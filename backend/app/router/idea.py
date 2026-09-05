from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db          # adjust to your session dep
from app.models.idea import Idea
from app.schema.idea import IdeaCreate, IdeaOut
from app.core.auth import get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/ideas", tags=["ideas"])


@router.post("", response_model=IdeaOut, status_code=201)
async def create_idea(
    payload: IdeaCreate,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    idea = Idea(
        title=payload.title.strip(),
        description=payload.description.strip(),
        category=payload.category,
        contact_email=payload.contact_email,
        page_url=payload.page_url,
        diagnostics=payload.diagnostics,
        clerk_user_id=current_user.clerk_user_id if current_user else None,
    )

    db.add(idea)
    await db.commit()
    await db.refresh(idea)
    return idea
