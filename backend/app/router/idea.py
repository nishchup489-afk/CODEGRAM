from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db          # adjust to your session dep
from app.schema.idea import IdeaCreate, IdeaOut
from app.core.auth import get_current_user_optional
from app.models.user import User
from app.repository.idea import create_idea as create_idea_record

router = APIRouter(prefix="/ideas", tags=["ideas"])


@router.post("", response_model=IdeaOut, status_code=201)
async def create_idea(
    payload: IdeaCreate,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    return await create_idea_record(db, payload, current_user)
