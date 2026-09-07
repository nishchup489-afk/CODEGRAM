import json
import logging

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient

from app.core.config import Settings
from app.core.operations import (
    JsonFormatter,
    MemoryRateLimitBackend,
    RateLimitMiddleware,
    RedisRateLimitBackend,
    RequestLoggingMiddleware,
)
from app.router import operations


def _settings(**overrides):
    values = {
        "DATABASE_URL": "postgresql+asyncpg://test:test@127.0.0.1:1/codegram_test",
        "RATE_LIMIT_ENABLED": True,
        "RATE_LIMIT_WRITE_REQUESTS": 2,
        "RATE_LIMIT_SENSITIVE_REQUESTS": 1,
        "RATE_LIMIT_WINDOW_SECONDS": 60,
    }
    values.update(overrides)
    return Settings(**values)


@pytest.mark.asyncio
async def test_request_id_is_preserved_and_returned():
    app = FastAPI()
    app.add_middleware(RequestLoggingMiddleware)

    @app.get("/example")
    async def example():
        return {"ok": True}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get(
            "/example", headers={"X-Request-ID": "upstream-request-123"}
        )

    assert response.headers["X-Request-ID"] == "upstream-request-123"


def test_json_formatter_emits_structured_request_fields():
    record = logging.LogRecord(
        "app.http", logging.INFO, __file__, 1, "request_complete", (), None
    )
    record.request_id = "request-1"
    record.status_code = 204

    payload = json.loads(JsonFormatter().format(record))

    assert payload["message"] == "request_complete"
    assert payload["request_id"] == "request-1"
    assert payload["status_code"] == 204


@pytest.mark.asyncio
async def test_sensitive_writes_are_rate_limited():
    app = FastAPI()
    app.add_middleware(
        RateLimitMiddleware,
        config=_settings(),
        backend=MemoryRateLimitBackend(),
    )

    @app.post("/api/v1/feedback")
    async def feedback():
        return {"ok": True}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        first = await client.post("/api/v1/feedback")
        second = await client.post("/api/v1/feedback")

    assert first.status_code == 200
    assert first.headers["X-RateLimit-Remaining"] == "0"
    assert second.status_code == 429
    assert int(second.headers["Retry-After"]) > 0


@pytest.mark.asyncio
async def test_search_gets_are_rate_limited_under_api_prefix():
    app = FastAPI()
    app.add_middleware(
        RateLimitMiddleware,
        config=_settings(),
        backend=MemoryRateLimitBackend(),
    )

    @app.get("/api/v1/search")
    async def search():
        return {"results": []}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        first = await client.get("/api/v1/search?q=python")
        second = await client.get("/api/v1/search?q=python")

    assert first.status_code == 200
    assert second.status_code == 429


@pytest.mark.asyncio
async def test_redis_rate_limit_backend_uses_atomic_counter_script():
    class FakeRedis:
        async def eval(self, script, key_count, key, window_seconds):
            assert "INCR" in script
            assert key_count == 1
            assert key == "rate-limit:write:client"
            assert window_seconds == 60
            return [3, 41]

    allowed, remaining, retry_after = await RedisRateLimitBackend(
        FakeRedis()
    ).consume("rate-limit:write:client", limit=3, window_seconds=60)

    assert allowed is True
    assert remaining == 0
    assert retry_after == 41


@pytest.mark.asyncio
async def test_readiness_reports_dependency_status(monkeypatch):
    async def available():
        return None

    monkeypatch.setattr(operations, "_database_ready", available)
    monkeypatch.setattr(operations, "_redis_ready", available)
    app = FastAPI()
    app.include_router(operations.router)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        live = await client.get("/health/live")
        ready = await client.get("/health/ready")

    assert live.json() == {"status": "ok"}
    assert ready.status_code == 200
    assert ready.json()["checks"] == {
        "database": "ok",
        "redis": "not_configured",
    }


@pytest.mark.asyncio
async def test_readiness_is_503_when_database_is_unavailable(monkeypatch):
    async def unavailable():
        raise RuntimeError("down")

    async def available():
        return None

    monkeypatch.setattr(operations, "_database_ready", unavailable)
    monkeypatch.setattr(operations, "_redis_ready", available)
    app = FastAPI()
    app.include_router(operations.router)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health/ready")

    assert response.status_code == 503
    assert response.json()["status"] == "unavailable"
    assert response.json()["checks"]["database"] == "unavailable"
