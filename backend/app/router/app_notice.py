from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repository.app_notice import get_active_notice
from app.schema.app_notice import PublicAppNoticeItem


router = APIRouter(
    prefix="/app-notices",
    tags=["App Notices"],
)


@router.get(
    "/active",
    response_model=PublicAppNoticeItem | None,
)
async def get_active_app_notice(
    db: AsyncSession = Depends(get_db),
):
    return await get_active_notice(db)
