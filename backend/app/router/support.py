# app/api/v1/support.py
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import  get_db
from app.models.user import User
from app.schema.support import SupportTicketCreate, SupportTicketResponse
from app.service.support import SupportService

router = APIRouter(prefix="/support", tags=["support"])


def _extract_request_diagnostics(request: Request) -> dict:
    return {
        "user_agent": request.headers.get("user-agent"),
        "referer": request.headers.get("referer"),
        "ip": request.client.host if request.client else None,
    }


@router.post(
    "/tickets",
    response_model=SupportTicketResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_ticket(
    payload: SupportTicketCreate,
    request: Request,
    # current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = SupportService(db)
    diagnostics = _extract_request_diagnostics(request)
    return await service.create_ticket(
        # user=current_user,
        payload=payload,
        request_diagnostics=diagnostics,
    )


@router.get("/tickets", response_model=list[SupportTicketResponse])
async def list_my_tickets(
    # current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = 20,
    offset: int = 0,
):
    service = SupportService(db)
    tickets, _total = await service.list_user_tickets(
        # user=current_user, limit=limit, offset=offset
    )
    return tickets