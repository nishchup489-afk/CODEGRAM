from __future__ import annotations

import asyncio

import httpx


RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}


async def request_with_retries(
    client: httpx.AsyncClient,
    method: str,
    url: str,
    *,
    attempts: int = 3,
    backoff_seconds: float = 0.1,
    **kwargs,
) -> httpx.Response:
    """Retry idempotent external calls on transport and transient HTTP errors."""

    if attempts < 1:
        raise ValueError("attempts must be at least 1")

    last_error: httpx.RequestError | None = None
    for attempt in range(attempts):
        try:
            sender = getattr(client, method.lower())
            response = await sender(url, **kwargs)
        except httpx.RequestError as exc:
            last_error = exc
        else:
            if response.status_code not in RETRYABLE_STATUS_CODES or attempt == attempts - 1:
                return response
            await response.aclose()

        if attempt < attempts - 1:
            await asyncio.sleep(backoff_seconds * (2**attempt))

    assert last_error is not None
    raise last_error
