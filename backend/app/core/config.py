from functools import lru_cache
from pathlib import Path

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parents[2]
LOCAL_DATABASE_URL = (
    "postgresql+asyncpg://postgres:postgres@localhost:5432/codegram"
)


class Settings(BaseSettings):
    # =========================================================
    # APP
    # =========================================================

    APP_NAME: str = "DevManiac"

    APP_ENV: str = "development"

    API_V1_PREFIX: str = "/api/v1"

    DEBUG: bool = False

    LOG_LEVEL: str = "INFO"

    # Optional shared backend for rate limits. When unset, the process-local
    # fallback is useful for development but does not coordinate replicas.
    REDIS_URL: str | None = None

    REDIS_MAX_CONNECTIONS: int = 20
    REDIS_SOCKET_TIMEOUT: float = 2.0
    REDIS_CONNECT_TIMEOUT: float = 2.0

    RATE_LIMIT_ENABLED: bool = True

    RATE_LIMIT_WRITE_REQUESTS: int = Field(default=60, ge=1)

    RATE_LIMIT_SENSITIVE_REQUESTS: int = Field(default=10, ge=1)

    RATE_LIMIT_WINDOW_SECONDS: int = Field(default=60, ge=1)


    # =========================================================
    # DATABASE
    # =========================================================

    DATABASE_URL: str = LOCAL_DATABASE_URL

    DATABASE_POOL_SIZE: int = Field(default=5, ge=1)

    DATABASE_MAX_OVERFLOW: int = Field(default=10, ge=0)

    DATABASE_POOL_TIMEOUT: float = Field(default=30.0, gt=0)

    DATABASE_POOL_RECYCLE: int = Field(default=1800, ge=1)

    DATABASE_POOL_PRE_PING: bool = True


    # =========================================================
    # CORS
    # =========================================================

    FRONTEND_URL: str = "http://localhost:3000"

    CORS_ORIGINS: str = "http://localhost:3000"


    # =========================================================
    # CLERK / ADMIN
    # =========================================================

    ADMIN_CLERK_USER_IDS: str = ""

    CLERK_SECRET_KEY: str | None = None

    # Frontend API URL from Clerk, for example
    # https://example.clerk.accounts.dev. Session-token `iss` must match it.
    CLERK_ISSUER: str | None = None

    # Optional override. By default this is derived from CLERK_ISSUER.
    CLERK_JWKS_URL: str | None = None

    # Comma-separated origins allowed in the Clerk token `azp` claim.
    # Falls back to CORS_ORIGINS when unset.
    CLERK_AUTHORIZED_PARTIES: str = ""

    # Clerk session tokens do not contain `aud` by default. Set this only
    # when a custom token template includes an audience for this API.
    CLERK_JWT_AUDIENCE: str | None = None

    CLERK_API_URL: str = "https://api.clerk.com/v1"


    # =========================================================
    # CLOUDINARY / MEDIA
    # =========================================================

    CLOUDINARY_CLOUD_NAME: str | None = None

    CLOUDINARY_API_KEY: str | None = None

    CLOUDINARY_API_SECRET: str | None = None

    # Optional GitHub API token used when validating repository URLs.
    GITHUB_TOKEN: str | None = None


    # =========================================================
    # SETTINGS CONFIG
    # =========================================================

    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


    # =========================================================
    # HELPERS
    # =========================================================

    @model_validator(mode="after")
    def require_explicit_production_database(self) -> "Settings":
        if (
            self.APP_ENV.strip().lower() == "production"
            and self.DATABASE_URL == LOCAL_DATABASE_URL
        ):
            raise ValueError(
                "DATABASE_URL must be explicitly configured in production"
            )
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


    @property
    def admin_clerk_user_id_list(self) -> list[str]:
        return [
            user_id.strip()
            for user_id in self.ADMIN_CLERK_USER_IDS.split(",")
            if user_id.strip()
        ]

    @property
    def clerk_authorized_party_list(self) -> list[str]:
        raw = self.CLERK_AUTHORIZED_PARTIES or self.CORS_ORIGINS
        return [value.strip().rstrip("/") for value in raw.split(",") if value.strip()]

    @property
    def clerk_jwks_url(self) -> str | None:
        if self.CLERK_JWKS_URL:
            return self.CLERK_JWKS_URL.strip()
        if self.CLERK_ISSUER:
            return f"{self.CLERK_ISSUER.strip().rstrip('/')}/.well-known/jwks.json"
        return None


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
