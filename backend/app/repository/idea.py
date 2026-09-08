from sqlalchemy.ext.asyncio import AsyncSession

from app.models.idea import Idea
from app.models.user import User
from app.schema.idea import IdeaCreate


async def create_idea(
    db: AsyncSession,
    payload: IdeaCreate,
    current_user: User | None,
) -> Idea:
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
