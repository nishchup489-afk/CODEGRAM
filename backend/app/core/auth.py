from dataclasses import dataclass
from functools import lru_cache
from typing import Any
from urllib.parse import quote

import httpx
import jwt
from anyio import to_thread
from fastapi import Depends, HTTPException, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError, PyJWKClientError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import User

from .database import get_db


bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class ClerkPrincipal:
    user_id: str
    session_id: str
    claims: dict[str, Any]


def _unauthorized(detail: str = "Invalid or expired authentication token") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


@lru_cache
def _jwks_client(jwks_url: str) -> PyJWKClient:
    return PyJWKClient(
        jwks_url,
        cache_keys=True,
        cache_jwk_set=True,
        lifespan=300,
        timeout=5,
    )


def _verify_token(token: str) -> ClerkPrincipal:
    issuer = settings.CLERK_ISSUER
    jwks_url = settings.clerk_jwks_url
    if not issuer or not jwks_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Clerk authentication is not configured",
        )

    try:
        signing_key = _jwks_client(jwks_url).get_signing_key_from_jwt(token)
        decode_options = {
            "require": ["exp", "iat", "nbf", "iss", "sub", "sid"],
            "verify_aud": settings.CLERK_JWT_AUDIENCE is not None,
        }
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.CLERK_JWT_AUDIENCE,
            issuer=issuer.rstrip("/"),
            leeway=5,
            options=decode_options,
        )
    except (InvalidTokenError, PyJWKClientError, ValueError, TypeError):
        raise _unauthorized() from None

    if claims.get("sts") == "pending":
        raise _unauthorized("Clerk session is not active")

    authorized_party = claims.get("azp")
    allowed_parties = settings.clerk_authorized_party_list
    if authorized_party and authorized_party.rstrip("/") not in allowed_parties:
        raise _unauthorized("Authentication token has an unauthorized party")

    return ClerkPrincipal(
        user_id=claims["sub"],
        session_id=claims["sid"],
        claims=claims,
    )


def _bearer_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None,
) -> str | None:
    authorization = request.headers.get("authorization")
    if not authorization:
        return None
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _unauthorized("Authorization header must use Bearer authentication")
    return credentials.credentials.strip()


async def get_clerk_principal(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
) -> ClerkPrincipal:
    token = _bearer_token(request, credentials)
    if token is None:
        raise _unauthorized("Authentication required")
    return await to_thread.run_sync(_verify_token, token)


async def get_optional_clerk_principal(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
) -> ClerkPrincipal | None:
    token = _bearer_token(request, credentials)
    if token is None:
        return None
    return await to_thread.run_sync(_verify_token, token)


async def get_clerk_primary_email(principal: ClerkPrincipal) -> str:
    """Resolve the authenticated subject's primary email from Clerk's BAPI."""
    secret_key = settings.CLERK_SECRET_KEY
    if not secret_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Clerk Backend API is not configured",
        )

    user_id = quote(principal.user_id, safe="")
    try:
        async with httpx.AsyncClient(
            base_url=settings.CLERK_API_URL.rstrip("/"),
            headers={"Authorization": f"Bearer {secret_key}"},
            timeout=httpx.Timeout(5.0),
        ) as client:
            response = await client.get(f"/users/{user_id}")
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach Clerk Backend API",
        ) from None

    if response.status_code != status.HTTP_200_OK:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not retrieve authenticated Clerk user",
        )

    try:
        clerk_user = response.json()
        if clerk_user.get("banned") or clerk_user.get("locked"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Clerk user is not allowed to sign in",
            )
        primary_email_id = clerk_user.get("primary_email_address_id")
        email_addresses = clerk_user.get("email_addresses") or []
        primary = next(
            item for item in email_addresses if item.get("id") == primary_email_id
        )
        email = primary["email_address"]
    except (ValueError, KeyError, StopIteration, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Clerk user has no usable primary email address",
        ) from None

    if not isinstance(email, str) or not email.strip():
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Clerk user has no usable primary email address",
        )
    return email.strip()


async def get_current_user(
    principal: ClerkPrincipal = Depends(get_clerk_principal),
    db: AsyncSession = Depends(get_db),
) -> User:
    user = await db.scalar(select(User).where(User.clerk_user_id == principal.user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user has not been synced",
        )
    if user.is_banned or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    return user


async def get_current_user_optional(
    principal: ClerkPrincipal | None = Depends(get_optional_clerk_principal),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if principal is None:
        return None
    user = await db.scalar(select(User).where(User.clerk_user_id == principal.user_id))
    if user and (user.is_banned or not user.is_active):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )
    return user
