from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def search_public_users(db: AsyncSession, query: str, limit: int) -> list[User]:
    cleaned_query = query.strip().lower()
    if len(cleaned_query) < 2:
        return []
    escaped_query = (
        cleaned_query.replace("\\", "\\\\")
        .replace("%", "\\%")
        .replace("_", "\\_")
    )
    statement = (
        select(User)
        .where(
            User.is_active.is_(True),
            User.is_banned.is_(False),
            User.is_private.is_(False),
            or_(
                User.username_lower.ilike(f"%{escaped_query}%", escape="\\"),
                func.lower(User.display_name).ilike(
                    f"%{escaped_query}%", escape="\\"
                ),
            ),
        )
        .order_by(
            func.greatest(
                func.similarity(User.username_lower, cleaned_query),
                func.similarity(func.lower(User.display_name), cleaned_query),
            ).desc(),
            User.followers_count.desc(),
            User.created_at.desc(),
        )
        .limit(limit)
    )
    return (await db.scalars(statement)).all()
