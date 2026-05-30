from typing import Optional, Any
from uuid import UUID
from datetime import datetime, timezone

from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.models.support import (
    SupportTicket,
    TicketCategory,
    TicketStatus,
    TicketPriority,
)
from app.models.user import User
from app.models.project import Project
from app.schema.support import (
    SupportTicketCreate,
    SupportTicketAdminUpdate,
)
from app.core.exceptions import NotFoundError, ForbiddenError, ValidationError


class SupportService:
    """
    Business logic for support tickets.

    Routes should never touch the SupportTicket model directly — they call
    this service. This keeps validation, authorization, and side effects
    (notifications, audit logs) in one place.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    # ---------- Ticket number generation ----------

    async def _generate_ticket_number(self) -> str:
        """
        Uses a Postgres sequence for monotonic, human-readable ticket numbers.
        Requires `CREATE SEQUENCE support_ticket_seq START 1;` in a migration.
        """
        result = await self.db.execute(text("SELECT nextval('support_ticket_seq')"))
        n = result.scalar_one()
        return f"CG-{n:04d}"

    # ---------- Create ----------

    async def create_ticket(
        self,
        user: User,
        payload: SupportTicketCreate,
        request_diagnostics: Optional[dict[str, Any]] = None,
    ) -> SupportTicket:
        """
        Create a new support ticket.

        `request_diagnostics` is merged with any client-supplied diagnostics
        and overrides them on conflict — the server's view of the request
        is more trustworthy than the client's.
        """
        # If a project_id was provided, verify it exists AND belongs to the user.
        # Don't leak existence of other users' projects.
        if payload.project_id is not None:
            await self._verify_project_ownership(payload.project_id, user.id)

        # Merge diagnostics: client-supplied first, server overrides on conflict.
        diagnostics: Optional[dict[str, Any]] = None
        if payload.diagnostics or request_diagnostics:
            diagnostics = {**(payload.diagnostics or {}), **(request_diagnostics or {})}

        ticket_number = await self._generate_ticket_number()

        ticket = SupportTicket(
            ticket_number=ticket_number,
            user_id=user.id,
            project_id=payload.project_id,
            category=payload.category,
            subject=payload.subject.strip(),
            description=payload.description.strip(),
            diagnostics=diagnostics,
            status=TicketStatus.open,
            priority=self._infer_initial_priority(payload.category),
        )

        self.db.add(ticket)

        try:
            await self.db.flush()
        except IntegrityError as e:
            # ticket_number collision is the only realistic case here
            await self.db.rollback()
            raise ValidationError("Could not create ticket. Please try again.") from e

        await self.db.commit()
        await self.db.refresh(ticket)

        # Side effects (email notify, etc.) AFTER commit so they don't
        # block the response and don't fire on rollback.
        await self._notify_support_team(ticket)

        return ticket

    # ---------- Read ----------

    async def get_ticket_for_user(
        self, ticket_id: UUID, user: User
    ) -> SupportTicket:
        """Fetch a ticket the user owns. 404 if not theirs or doesn't exist."""
        result = await self.db.execute(
            select(SupportTicket).where(
                SupportTicket.id == ticket_id,
                SupportTicket.user_id == user.id,
            )
        )
        ticket = result.scalar_one_or_none()
        if ticket is None:
            raise NotFoundError("Ticket not found.")
        return ticket

    async def list_user_tickets(
        self,
        user: User,
        status: Optional[TicketStatus] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[SupportTicket], int]:
        """
        Return (tickets, total_count) for the current user.
        Most recent first.
        """
        limit = min(max(limit, 1), 100)
        offset = max(offset, 0)

        base_filter = [SupportTicket.user_id == user.id]
        if status is not None:
            base_filter.append(SupportTicket.status == status)

        items_query = (
            select(SupportTicket)
            .where(*base_filter)
            .order_by(SupportTicket.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        count_query = select(func.count(SupportTicket.id)).where(*base_filter)

        items_result = await self.db.execute(items_query)
        count_result = await self.db.execute(count_query)

        return items_result.scalars().all(), count_result.scalar_one()

    # ---------- Admin operations ----------

    async def admin_update_ticket(
        self,
        ticket_id: UUID,
        admin: User,
        payload: SupportTicketAdminUpdate,
    ) -> SupportTicket:
        """
        Admin-only: update status, priority, or internal notes.
        Auto-stamps resolved_at / resolved_by when status flips to resolved.
        """
        if not getattr(admin, "is_admin", False):
            raise ForbiddenError("Admin access required.")

        result = await self.db.execute(
            select(SupportTicket).where(SupportTicket.id == ticket_id)
        )
        ticket = result.scalar_one_or_none()
        if ticket is None:
            raise NotFoundError("Ticket not found.")

        data = payload.model_dump(exclude_unset=True)

        # Status transition side effects
        new_status = data.get("status")
        if new_status is not None and new_status != ticket.status:
            if new_status == TicketStatus.resolved and ticket.resolved_at is None:
                ticket.resolved_at = datetime.now(timezone.utc)
                ticket.resolved_by_user_id = admin.id
            elif new_status != TicketStatus.resolved and ticket.resolved_at is not None:
                # Reopening — clear resolution metadata
                ticket.resolved_at = None
                ticket.resolved_by_user_id = None

        for field, value in data.items():
            setattr(ticket, field, value)

        await self.db.commit()
        await self.db.refresh(ticket)
        return ticket

    async def admin_list_tickets(
        self,
        admin: User,
        status: Optional[TicketStatus] = None,
        category: Optional[TicketCategory] = None,
        priority: Optional[TicketPriority] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[SupportTicket], int]:
        """Admin queue view. Open + high-priority first."""
        if not getattr(admin, "is_admin", False):
            raise ForbiddenError("Admin access required.")

        limit = min(max(limit, 1), 100)
        offset = max(offset, 0)

        filters = []
        if status is not None:
            filters.append(SupportTicket.status == status)
        if category is not None:
            filters.append(SupportTicket.category == category)
        if priority is not None:
            filters.append(SupportTicket.priority == priority)

        # Priority ordering: urgent → high → normal → low
        priority_order = func.array_position(
            text("ARRAY['urgent','high','normal','low']::text[]"),
            SupportTicket.priority,
        )

        items_query = (
            select(SupportTicket)
            .where(*filters)
            .order_by(
                # Open tickets first
                (SupportTicket.status == TicketStatus.open).desc(),
                priority_order.asc(),
                SupportTicket.created_at.desc(),
            )
            .limit(limit)
            .offset(offset)
        )
        count_query = select(func.count(SupportTicket.id)).where(*filters)

        items_result = await self.db.execute(items_query)
        count_result = await self.db.execute(count_query)

        return items_result.scalars().all(), count_result.scalar_one()

    # ---------- Internal helpers ----------

    async def _verify_project_ownership(
        self, project_id: UUID, user_id: UUID
    ) -> None:
        result = await self.db.execute(
            select(Project.id).where(
                Project.id == project_id,
                Project.user_id == user_id,
            )
        )
        if result.scalar_one_or_none() is None:
            # 404, not 403 — don't leak that the project exists
            raise NotFoundError("Project not found.")

    def _infer_initial_priority(self, category: TicketCategory) -> TicketPriority:
        """
        Light heuristic — admins can override. Account issues and integration
        failures tend to be more blocking than feature requests.
        """
        if category in (TicketCategory.account, TicketCategory.integration):
            return TicketPriority.high
        return TicketPriority.normal

    async def _notify_support_team(self, ticket: SupportTicket) -> None:
        """
        Stub for now. Wire this up to your email provider (Resend, Postmark,
        SendGrid) or push to a background queue. Keep it OUT of the request
        path once you have real volume.
        """
        # TODO: send email to support@codegram.dev with ticket summary
        # TODO: optionally push to a Slack webhook for fast triage
        pass