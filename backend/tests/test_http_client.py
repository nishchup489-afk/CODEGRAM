import httpx
import pytest

from app.core.http_client import request_with_retries


@pytest.mark.asyncio
async def test_external_request_retries_transient_status(monkeypatch):
    attempts = 0

    async def handler(_request):
        nonlocal attempts
        attempts += 1
        return httpx.Response(503 if attempts < 3 else 200)

    async def no_sleep(_delay):
        return None

    monkeypatch.setattr("app.core.http_client.asyncio.sleep", no_sleep)
    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        response = await request_with_retries(client, "GET", "https://example.com")

    assert response.status_code == 200
    assert attempts == 3


@pytest.mark.asyncio
async def test_external_request_does_not_retry_client_error():
    attempts = 0

    async def handler(_request):
        nonlocal attempts
        attempts += 1
        return httpx.Response(404)

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        response = await request_with_retries(client, "GET", "https://example.com")

    assert response.status_code == 404
    assert attempts == 1
