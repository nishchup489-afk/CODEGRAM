from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User


router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.get("/users")
async def search_users(
    q: str = Query(min_length=2, max_length=100),
    limit: int = Query(default=10, ge=1, le=30),
    db: AsyncSession = Depends(get_db),
):
    cleaned_query = q.strip().lower()

    if len(cleaned_query) < 2:
        return []

    escaped_query = (
        cleaned_query.replace("\\", "\\\\")
        .replace("%", "\\%")
        .replace("_", "\\_")
    )

    stmt = (
        select(User)
        .where(
                User.is_active == True,
                User.is_banned == False,
                User.is_private == False,
            or_(
                User.username_lower.ilike(
                    f"%{escaped_query}%",
                    escape="\\",
                ),
                func.lower(User.display_name).ilike(
                    f"%{escaped_query}%",
                    escape="\\",
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

    result = await db.execute(stmt)

    users = result.scalars().all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "avatar_url": user.avatar_url,
            "bio": user.bio,
            "location": user.location,
            "followers_count": user.followers_count,
            "project_count": user.project_count,
            "is_verified": user.is_verified,
        }
        for user in users
    ]
