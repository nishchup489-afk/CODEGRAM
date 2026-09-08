from datetime import datetime, timezone

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.app_notice import AppNotice


async def get_active_notice(db: AsyncSession) -> AppNotice | None:
    now = datetime.now(timezone.utc)
    statement = (
        select(AppNotice)
        .where(
            AppNotice.is_active.is_(True),
            or_(AppNotice.starts_at.is_(None), AppNotice.starts_at <= now),
            or_(AppNotice.expires_at.is_(None), AppNotice.expires_at >= now),
        )
        .order_by(AppNotice.priority.desc(), AppNotice.created_at.desc())
        .limit(1)
    )
    return await db.scalar(statement)
