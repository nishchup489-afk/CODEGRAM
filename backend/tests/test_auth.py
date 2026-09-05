from types import SimpleNamespace

import httpx
import jwt
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from starlette.requests import Request

from app.core import auth
from app.schema.user import UserSync
from app.service.user import sync_user


def make_request(authorization: str | None = None) -> Request:
    headers = []
    if authorization is not None:
        headers.append((b"authorization", authorization.encode()))
    return Request({"type": "http", "headers": headers})


@pytest.mark.asyncio
async def test_spoofed_query_identity_cannot_access_profile(api_client):
    response = await api_client.get(
        "/profile/me",
        params={"clerk_user_id": "user_victim"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"
    assert response.headers["www-authenticate"] == "Bearer"


@pytest.mark.asyncio
async def test_spoofed_query_identity_cannot_access_admin(api_client):
    response = await api_client.get(
        "/admin/dashboard",
        params={"clerk_user_id": "user_admin"},
    )

    assert response.status_code == 401


def test_bearer_token_parsing():
    credentials = HTTPAuthorizationCredentials(
        scheme="Bearer",
        credentials="session-token",
    )

    assert auth._bearer_token(
        make_request("Bearer session-token"),
        credentials,
    ) == "session-token"
    assert auth._bearer_token(make_request(), None) is None


def test_verify_token_validates_and_returns_clerk_principal(monkeypatch):
    monkeypatch.setattr(auth.settings, "CLERK_ISSUER", "https://clerk.example")
    monkeypatch.setattr(
        auth.settings,
        "CLERK_AUTHORIZED_PARTIES",
        "https://app.example",
    )
    monkeypatch.setattr(
        auth,
        "_jwks_client",
        lambda _url: SimpleNamespace(
            get_signing_key_from_jwt=lambda _token: SimpleNamespace(key="public-key")
        ),
    )

    def fake_decode(token, key, **options):
        assert token == "valid-token"
        assert key == "public-key"
        assert options["algorithms"] == ["RS256"]
        assert options["issuer"] == "https://clerk.example"
        return {
            "sub": "user_123",
            "sid": "sess_123",
            "iss": "https://clerk.example",
            "azp": "https://app.example",
            "iat": 1,
            "nbf": 1,
            "exp": 4_000_000_000,
        }

    monkeypatch.setattr(auth.jwt, "decode", fake_decode)

    principal = auth._verify_token("valid-token")

    assert principal.user_id == "user_123"
    assert principal.session_id == "sess_123"


def test_verify_token_rejects_invalid_tokens(monkeypatch):
    monkeypatch.setattr(auth.settings, "CLERK_ISSUER", "https://clerk.example")
    monkeypatch.setattr(
        auth,
        "_jwks_client",
        lambda _url: SimpleNamespace(
            get_signing_key_from_jwt=lambda _token: SimpleNamespace(key="public-key")
        ),
    )

    def reject_token(*_args, **_kwargs):
        raise jwt.InvalidTokenError

    monkeypatch.setattr(auth.jwt, "decode", reject_token)

    with pytest.raises(HTTPException) as error:
        auth._verify_token("invalid-token")

    assert error.value.status_code == 401


@pytest.mark.asyncio
async def test_clerk_primary_email_comes_from_verified_subject(monkeypatch):
    monkeypatch.setattr(auth.settings, "CLERK_SECRET_KEY", "sk_test_secret")

    class FakeClient:
        def __init__(self, **kwargs):
            assert kwargs["headers"]["Authorization"] == "Bearer sk_test_secret"

        async def __aenter__(self):
            return self

        async def __aexit__(self, *_args):
            return None

        async def get(self, path):
            assert path == "/users/user_123"
            return httpx.Response(
                200,
                json={
                    "primary_email_address_id": "email_1",
                    "email_addresses": [
                        {"id": "email_1", "email_address": "verified@example.com"}
                    ],
                    "banned": False,
                    "locked": False,
                },
            )

    monkeypatch.setattr(auth.httpx, "AsyncClient", FakeClient)
    principal = auth.ClerkPrincipal(
        user_id="user_123",
        session_id="sess_123",
        claims={},
    )

    email = await auth.get_clerk_primary_email(principal)

    assert email == "verified@example.com"


@pytest.mark.asyncio
async def test_sync_never_relinks_an_existing_email(fake_db):
    existing_email_owner = SimpleNamespace(id="existing-user")
    fake_db.scalar.side_effect = [None, existing_email_owner]

    with pytest.raises(HTTPException) as error:
        await sync_user(
            db=fake_db,
            data=UserSync(display_name="Attacker", avatar_url=None),
            clerk_user_id="user_attacker",
            email="victim@example.com",
        )

    assert error.value.status_code == 409
    fake_db.commit.assert_not_awaited()
