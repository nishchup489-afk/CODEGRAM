from unittest.mock import AsyncMock

from sqlalchemy.ext.asyncio import AsyncSession


def test_fake_db_has_async_session_contract(fake_db):
    assert isinstance(fake_db, AsyncMock)
    assert isinstance(fake_db.commit, AsyncMock)
    assert isinstance(fake_db.rollback, AsyncMock)
    assert isinstance(fake_db.execute, AsyncMock)
