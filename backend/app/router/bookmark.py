from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.schema.project import GetProject

from app.service.bookmark import (
    get_my_bookmarks,
)


router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"],
)


@router.get(
    "/me",
    response_model=list[GetProject],
)
async def get_bookmarked_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await get_my_bookmarks(
        db=db,
        clerk_user_id=current_user.clerk_user_id,
    )
