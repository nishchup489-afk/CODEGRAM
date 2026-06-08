from uuid import UUID

from fastapi import HTTPException, status

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.project import Project

from app.models.feedback import (
    Feedback,
    FeedbackStatus,
)

from app.models.support import (
    SupportTicket,
    TicketStatus,
)

from app.models.LiveProject import LiveProject

from app.schema.admin import (
    AdminUpdateFeedback,
    AdminUpdateProject,
    AdminUpdateSupportTicket,
    AdminUpdateUser,
)


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db


    # =========================================================
    # DASHBOARD
    # =========================================================

    async def get_dashboard(self):
        total_users = await self._count(User)
        total_projects = await self._count(Project)
        total_live_projects = await self._count(LiveProject)

        new_feedback_result = await self.db.execute(
            select(func.count(Feedback.id)).where(
                Feedback.status == FeedbackStatus.new
            )
        )

        open_tickets_result = await self.db.execute(
            select(func.count(SupportTicket.id)).where(
                SupportTicket.status.in_(
                    [
                        TicketStatus.open,
                        TicketStatus.in_progress,
                        TicketStatus.waiting_on_user,
                    ]
                )
            )
        )

        active_users_result = await self.db.execute(
            select(func.count(User.id)).where(
                User.is_active == True
            )
        )

        recent_users_result = await self.db.execute(
            select(User)
            .order_by(User.created_at.desc())
            .limit(8)
        )

        recent_projects_result = await self.db.execute(
            select(Project)
            .order_by(Project.created_at.desc())
            .limit(8)
        )

        return {
            "stats": {
                "total_users": total_users,
                "total_projects": total_projects,
                "total_live_projects": total_live_projects,
                "new_feedback": new_feedback_result.scalar_one(),
                "open_support_tickets": open_tickets_result.scalar_one(),
                "active_users": active_users_result.scalar_one(),
            },
            "recent_users": recent_users_result.scalars().all(),
            "recent_projects": recent_projects_result.scalars().all(),
        }


    async def _count(self, model):
        result = await self.db.execute(
            select(func.count(model.id))
        )

        return result.scalar_one()


    # =========================================================
    # FEEDBACK
    # =========================================================

    async def list_feedback(
        self,
        status_filter: str | None = None,
        limit: int = 50,
    ):
        query = select(Feedback).order_by(
            Feedback.created_at.desc()
        )

        if status_filter:
            query = query.where(
                Feedback.status == status_filter
            )

        result = await self.db.execute(
            query.limit(limit)
        )

        return result.scalars().all()


    async def update_feedback(
        self,
        feedback_id: UUID,
        payload: AdminUpdateFeedback,
    ):
        feedback = await self.db.get(
            Feedback,
            feedback_id,
        )

        if not feedback:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Feedback not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(feedback, key, value)

        await self.db.commit()
        await self.db.refresh(feedback)

        return feedback


    # =========================================================
    # SUPPORT
    # =========================================================

    async def list_support_tickets(
        self,
        status_filter: str | None = None,
        limit: int = 50,
    ):
        query = select(SupportTicket).order_by(
            SupportTicket.created_at.desc()
        )

        if status_filter:
            query = query.where(
                SupportTicket.status == status_filter
            )

        result = await self.db.execute(
            query.limit(limit)
        )

        return result.scalars().all()


    async def update_support_ticket(
        self,
        ticket_id: UUID,
        payload: AdminUpdateSupportTicket,
    ):
        ticket = await self.db.get(
            SupportTicket,
            ticket_id,
        )

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Support ticket not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(ticket, key, value)

        await self.db.commit()
        await self.db.refresh(ticket)

        return ticket


    # =========================================================
    # USERS
    # =========================================================

    async def list_users(
        self,
        limit: int = 50,
    ):
        result = await self.db.execute(
            select(User)
            .order_by(User.created_at.desc())
            .limit(limit)
        )

        return result.scalars().all()


    async def update_user(
        self,
        user_id: UUID,
        payload: AdminUpdateUser,
    ):
        user = await self.db.get(
            User,
            user_id,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)

        return user


    # =========================================================
    # PROJECTS
    # =========================================================

    async def list_projects(
        self,
        limit: int = 50,
    ):
        result = await self.db.execute(
            select(Project)
            .order_by(Project.created_at.desc())
            .limit(limit)
        )

        return result.scalars().all()


    async def update_project(
        self,
        project_id: UUID,
        payload: AdminUpdateProject,
    ):
        project = await self.db.get(
            Project,
            project_id,
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        update_data = payload.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(project, key, value)

        await self.db.commit()
        await self.db.refresh(project)

        return project