from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid
from dataclasses import dataclass
from typing import Any, Protocol

from fastapi import FastAPI
from starlette.datastructures import Headers, MutableHeaders
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.core.config import Settings, settings


logger = logging.getLogger("app.http")
_REQUEST_ID_HEADER = "x-request-id"
_SENSITIVE_PATH_PARTS = (
    "/sync",
    "/early-access",
    "/support",
    "/feedback",
    "/follow",
    "/bookmark",
    "/star",
    "/comment",
    "/vote",
    "/search",
)


class JsonFormatter(logging.Formatter):
    """Small dependency-free JSON formatter for platform log collectors."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        for field in (
            "request_id",
            "method",
            "path",
            "status_code",
            "duration_ms",
            "client_ip",
        ):
            if hasattr(record, field):
                payload[field] = getattr(record, field)
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, separators=(",", ":"), default=str)


def configure_json_logging(level: str = "INFO") -> None:
    root = logging.getLogger()
    root.setLevel(level.upper())
    if any(getattr(handler, "_codegram_json", False) for handler in root.handlers):
        return
    handlers = root.handlers or [logging.StreamHandler()]
    for handler in handlers:
        handler.setFormatter(JsonFormatter())
        handler._codegram_json = True  # type: ignore[attr-defined]
    if not root.handlers:
        root.addHandler(handlers[0])


def _request_id(headers: Headers) -> str:
    candidate = headers.get(_REQUEST_ID_HEADER, "")
    if candidate and len(candidate) <= 128 and all(char.isalnum() or char in "-_." for char in candidate):
        return candidate
    return uuid.uuid4().hex


class RequestLoggingMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)
        request_id = _request_id(headers)
        scope.setdefault("state", {})["request_id"] = request_id
        started = time.perf_counter()
        status_code = 500

        async def send_with_request_id(message: Message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message["status"]
                response_headers = MutableHeaders(scope=message)
                response_headers[_REQUEST_ID_HEADER] = request_id
            await send(message)

        try:
            await self.app(scope, receive, send_with_request_id)
        except Exception:
            logger.exception(
                "request_failed",
                extra=self._log_fields(scope, request_id, status_code, started),
            )
            raise
        else:
            logger.info(
                "request_complete",
                extra=self._log_fields(scope, request_id, status_code, started),
            )

    @staticmethod
    def _log_fields(
        scope: Scope, request_id: str, status_code: int, started: float
    ) -> dict[str, Any]:
        client = scope.get("client")
        return {
            "request_id": request_id,
            "method": scope.get("method"),
            "path": scope.get("path"),
            "status_code": status_code,
            "duration_ms": round((time.perf_counter() - started) * 1000, 2),
            "client_ip": client[0] if client else None,
        }


class RateLimitBackend(Protocol):
    async def consume(self, key: str, limit: int, window_seconds: int) -> tuple[bool, int, int]: ...


@dataclass
class _Window:
    count: int
    expires_at: float


class MemoryRateLimitBackend:
    """Process-local fallback; limits are not shared across worker replicas."""

    def __init__(self) -> None:
        self._windows: dict[str, _Window] = {}
        self._lock = asyncio.Lock()
        self._operations = 0

    async def consume(self, key: str, limit: int, window_seconds: int) -> tuple[bool, int, int]:
        now = time.monotonic()
        async with self._lock:
            self._operations += 1
            window = self._windows.get(key)
            if window is None or window.expires_at <= now:
                window = _Window(count=0, expires_at=now + window_seconds)
                self._windows[key] = window
            window.count += 1
            if self._operations % 1000 == 0:
                self._windows = {
                    item_key: item
                    for item_key, item in self._windows.items()
                    if item.expires_at > now
                }
            retry_after = max(1, int(window.expires_at - now) + 1)
            remaining = max(0, limit - window.count)
            return window.count <= limit, remaining, retry_after


class RedisRateLimitBackend:
    _SCRIPT = """
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
local ttl = redis.call('TTL', KEYS[1])
return {count, ttl}
"""

    def __init__(self, client: Any) -> None:
        self.client = client

    @classmethod
    def from_url(cls, url: str) -> RedisRateLimitBackend:
        try:
            from redis.asyncio import Redis
        except ImportError as exc:  # pragma: no cover - depends on deployment extras
            raise RuntimeError("REDIS_URL requires the 'redis' Python package") from exc
        return cls(Redis.from_url(url, encoding="utf-8", decode_responses=True))

    async def consume(self, key: str, limit: int, window_seconds: int) -> tuple[bool, int, int]:
        count, ttl = await self.client.eval(self._SCRIPT, 1, key, window_seconds)
        count = int(count)
        retry_after = max(1, int(ttl))
        return count <= limit, max(0, limit - count), retry_after


def build_rate_limit_backend(config: Settings = settings) -> RateLimitBackend:
    if config.REDIS_URL:
        return RedisRateLimitBackend.from_url(config.REDIS_URL)
    logger.warning("rate_limit_using_process_local_memory")
    return MemoryRateLimitBackend()


class RateLimitMiddleware:
    def __init__(
        self,
        app: ASGIApp,
        config: Settings = settings,
        backend: RateLimitBackend | None = None,
    ) -> None:
        self.app = app
        self.config = config
        self.backend = backend or build_rate_limit_backend(config)

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not self.config.RATE_LIMIT_ENABLED:
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        sensitive = any(part in path.lower() for part in _SENSITIVE_PATH_PARTS)
        if scope.get("method") in {"HEAD", "OPTIONS"} or (
            scope.get("method") == "GET" and not sensitive
        ):
            await self.app(scope, receive, send)
            return
        limit = (
            self.config.RATE_LIMIT_SENSITIVE_REQUESTS
            if sensitive
            else self.config.RATE_LIMIT_WRITE_REQUESTS
        )
        client = scope.get("client")
        identity = client[0] if client else "unknown"
        key = f"rate-limit:{'sensitive' if sensitive else 'write'}:{identity}"
        try:
            allowed, remaining, retry_after = await self.backend.consume(
                key, limit, self.config.RATE_LIMIT_WINDOW_SECONDS
            )
        except Exception:
            logger.exception("rate_limit_backend_unavailable")
            response = JSONResponse(
                status_code=503,
                content={"detail": "Request limiting service is unavailable"},
                headers={"Retry-After": "1"},
            )
            await response(scope, receive, send)
            return
        if not allowed:
            response = JSONResponse(
                status_code=429,
                content={"detail": "Too many requests"},
                headers={"Retry-After": str(retry_after), "X-RateLimit-Remaining": "0"},
            )
            await response(scope, receive, send)
            return

        async def send_with_limit(message: Message) -> None:
            if message["type"] == "http.response.start":
                MutableHeaders(scope=message)["X-RateLimit-Remaining"] = str(remaining)
            await send(message)

        await self.app(scope, receive, send_with_limit)


def configure_operational_middleware(app: FastAPI, config: Settings = settings) -> None:
    configure_json_logging(config.LOG_LEVEL)
    app.add_middleware(RateLimitMiddleware, config=config)
    # Starlette executes the last-added middleware first. Logging stays outside
    # rate limiting so rejected requests also receive an ID and access log.
    app.add_middleware(RequestLoggingMiddleware)
