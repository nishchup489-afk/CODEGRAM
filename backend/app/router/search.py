from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repository.search import search_public_users


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
    users = await search_public_users(db=db, query=q, limit=limit)

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
