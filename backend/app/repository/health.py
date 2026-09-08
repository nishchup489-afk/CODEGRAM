from sqlalchemy import text

from app.core.database import AsyncSessionLocal


async def check_database() -> None:
    async with AsyncSessionLocal() as db:
        await db.execute(text("SELECT 1"))
