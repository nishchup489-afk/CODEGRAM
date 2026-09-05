import os
from collections.abc import AsyncIterator
from unittest.mock import AsyncMock

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession


# Importing the application constructs SQLAlchemy's engine. Tests use a
# deliberately unreachable URL and never start the production lifespan, so a
# developer's configured database cannot be contacted accidentally.
os.environ["DATABASE_URL"] = "postgresql+asyncpg://test:test@127.0.0.1:1/codegram_test"
os.environ.setdefault("APP_ENV", "test")


@pytest.fixture(scope="session")
def test_app():
    from app.main import app

    return app


@pytest_asyncio.fixture
async def api_client(test_app) -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=test_app)

    async with AsyncClient(
        transport=transport,
        base_url="http://testserver",
    ) as client:
        yield client


@pytest.fixture
def fake_db() -> AsyncMock:
    """AsyncSession-shaped test double for isolated service tests."""

    return AsyncMock(spec=AsyncSession)
