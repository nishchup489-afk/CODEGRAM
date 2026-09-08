from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Response, status
from app.core.config import settings
from app.repository.health import check_database


router = APIRouter(tags=["Operations"])
logger = logging.getLogger(__name__)


@router.get("/health", include_in_schema=False)
@router.get("/health/live", include_in_schema=False)
async def liveness() -> dict[str, str]:
    return {"status": "ok"}


async def _database_ready() -> None:
    await check_database()


async def _redis_ready() -> None:
    if not settings.REDIS_URL:
        return
    try:
        from redis.asyncio import Redis
    except ImportError as exc:
        raise RuntimeError("Redis is configured but its client package is unavailable") from exc
    client: Any = Redis.from_url(settings.REDIS_URL)
    try:
        await client.ping()
    finally:
        await client.aclose()


@router.get("/health/ready", include_in_schema=False)
async def readiness(response: Response) -> dict[str, Any]:
    checks: dict[str, str] = {}
    for name, check in (("database", _database_ready), ("redis", _redis_ready)):
        try:
            await check()
            checks[name] = "ok" if name == "database" or settings.REDIS_URL else "not_configured"
        except Exception:
            logger.exception("readiness_check_failed", extra={"dependency": name})
            checks[name] = "unavailable"

    ready = checks["database"] == "ok" and checks["redis"] in {"ok", "not_configured"}
    if not ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return {"status": "ready" if ready else "unavailable", "checks": checks}
