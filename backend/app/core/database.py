from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
)
from sqlalchemy.orm import (
    sessionmaker,
    declarative_base,
)

from app.core.config import settings

Base = declarative_base()

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG and settings.APP_ENV != "production",
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_recycle=settings.DATABASE_POOL_RECYCLE,
    pool_pre_ping=settings.DATABASE_POOL_PRE_PING,
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():

    async with AsyncSessionLocal() as session:
        yield session
