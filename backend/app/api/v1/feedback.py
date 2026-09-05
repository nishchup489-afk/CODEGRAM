from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    Query,
    Request,
    status,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.admin import require_admin
from app.core.database import get_db
from app.core.auth import get_current_user, get_current_user_optional
from app.models.user import User

from app.models.feedback import (
    FeedbackType,
    FeedbackStatus,
    FeedbackSentiment,
)

from app.schema.feedback import (
    FeedbackCreate,
    FeedbackResponse,
    FeedbackAdminUpdate,
    FeedbackAdminResponse,
)

from app.service.feedback import FeedbackService


router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"],
)


# =========================================================
# REQUEST DIAGNOSTICS
# =========================================================

def _extract_request_diagnostics(
    request: Request,
) -> dict:

    return {
        "user_agent": request.headers.get("user-agent"),
        "referer": request.headers.get("referer"),
        "ip": request.client.host if request.client else None,
    }


# =========================================================
# CREATE FEEDBACK
# POST /feedback (Bearer token optional for anonymous feedback)
# =========================================================

@router.post(
    "",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_feedback(
    payload: FeedbackCreate,
    request: Request,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):

    service = FeedbackService(db)

    diagnostics = _extract_request_diagnostics(
        request=request,
    )

    return await service.create_feedback(
        payload=payload,
        clerk_user_id=current_user.clerk_user_id if current_user else None,
        request_diagnostics=diagnostics,
    )


# =========================================================
# LIST MY FEEDBACK
# GET /feedback/me (Bearer token required)
# =========================================================

@router.get(
    "/me",
    response_model=list[FeedbackResponse],
)
async def list_my_feedback(
    current_user: User = Depends(get_current_user),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):

    service = FeedbackService(db)

    feedback_items, _total = await service.list_my_feedback(
        clerk_user_id=current_user.clerk_user_id,
        limit=limit,
        offset=offset,
    )

    return feedback_items


# =========================================================
# GET MY SINGLE FEEDBACK
# GET /feedback/me/{feedback_id} (Bearer token required)
# =========================================================

@router.get(
    "/me/{feedback_id}",
    response_model=FeedbackResponse,
)
async def get_my_feedback(
    feedback_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    service = FeedbackService(db)

    return await service.get_my_feedback(
        clerk_user_id=current_user.clerk_user_id,
        feedback_id=feedback_id,
    )


# =========================================================
# ADMIN LIST FEEDBACK
# GET /feedback/admin
# Retained for compatibility; protected by the same dependency as /admin.
# =========================================================

@router.get(
    "/admin",
    response_model=list[FeedbackAdminResponse],
)
async def admin_list_feedback(
    feedback_status: FeedbackStatus | None = Query(default=None),
    feedback_type: FeedbackType | None = Query(default=None),
    sentiment: FeedbackSentiment | None = Query(default=None),
    rating: int | None = Query(default=None, ge=1, le=5),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):

    service = FeedbackService(db)

    feedback_items, _total = await service.admin_list_feedback(
        feedback_status=feedback_status,
        feedback_type=feedback_type,
        sentiment=sentiment,
        rating=rating,
        limit=limit,
        offset=offset,
    )

    return feedback_items


# =========================================================
# ADMIN GET SINGLE FEEDBACK
# GET /feedback/admin/{feedback_id}
# Retained for compatibility; protected by the same dependency as /admin.
# =========================================================

@router.get(
    "/admin/{feedback_id}",
    response_model=FeedbackAdminResponse,
)
async def admin_get_feedback(
    feedback_id: UUID,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):

    service = FeedbackService(db)

    return await service.admin_get_feedback(
        feedback_id=feedback_id,
    )


# =========================================================
# ADMIN UPDATE FEEDBACK
# PATCH /feedback/admin/{feedback_id}
# Retained for compatibility; protected by the same dependency as /admin.
# =========================================================

@router.patch(
    "/admin/{feedback_id}",
    response_model=FeedbackAdminResponse,
)
async def admin_update_feedback(
    feedback_id: UUID,
    payload: FeedbackAdminUpdate,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):

    service = FeedbackService(db)

    return await service.admin_update_feedback(
        feedback_id=feedback_id,
        payload=payload,
        admin_clerk_user_id=admin_clerk_user_id,
    )


# =========================================================
# ADMIN ARCHIVE FEEDBACK
# PATCH /feedback/admin/{feedback_id}/archive
# Retained for compatibility; protected by the same dependency as /admin.
# =========================================================

@router.patch(
    "/admin/{feedback_id}/archive",
    response_model=FeedbackAdminResponse,
)
async def admin_archive_feedback(
    feedback_id: UUID,
    admin_clerk_user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):

    service = FeedbackService(db)

    return await service.admin_archive_feedback(
        feedback_id=feedback_id,
        admin_clerk_user_id=admin_clerk_user_id,
    )
