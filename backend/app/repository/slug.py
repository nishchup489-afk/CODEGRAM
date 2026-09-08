from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def slug_exists(
    db: AsyncSession,
    model: Any,
    slug: str,
    user_id: Any = None,
) -> bool:
    statement = select(model.id).where(model.slug == slug)
    if user_id is not None:
        statement = statement.where(model.user_id == user_id)
    return (await db.execute(statement)).first() is not None
