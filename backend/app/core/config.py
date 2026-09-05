from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # =========================================================
    # APP
    # =========================================================

    APP_NAME: str = "DevManiac"

    APP_ENV: str = "development"

    API_V1_PREFIX: str = "/api/v1"

    DEBUG: bool = True


    # =========================================================
    # DATABASE
    # =========================================================

    DATABASE_URL: str


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


    # =========================================================
    # SETTINGS CONFIG
    # =========================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


    # =========================================================
    # HELPERS
    # =========================================================

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
