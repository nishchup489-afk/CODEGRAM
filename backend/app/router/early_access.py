from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repository.early_access import register_early_access
from app.schema.early_access import EarlyAccessCreate, EarlyAccessResponse


router = APIRouter(
    prefix="/early-access",
    tags=["Early Access"],
)


# Path is "" rather than "/" so the canonical URL is /api/v1/early-access with
# no 307 redirect hop on every submission.
@router.post(
    "",
    response_model=EarlyAccessResponse,
)
async def create_early_access_signup(
    data: EarlyAccessCreate,
    db: AsyncSession = Depends(get_db),
):
    await register_early_access(
        db,
        email=data.email,
        source=data.source,
        referrer=data.referrer,
    )

    return EarlyAccessResponse(
        detail="You're on the early access list.",
    )
