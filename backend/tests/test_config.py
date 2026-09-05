import pytest
from pydantic import ValidationError

from app.core.config import Settings


def make_settings(**overrides) -> Settings:
    values = {
        "DATABASE_URL": "postgresql+asyncpg://test:test@localhost/codegram_test",
        "_env_file": None,
    }
    values.update(overrides)
    return Settings(**values)


def test_database_url_is_required():
    with pytest.raises(ValidationError):
        Settings(DATABASE_URL=None, _env_file=None)


def test_comma_separated_configuration_is_normalized():
    settings = make_settings(
        CORS_ORIGINS=" https://one.example,https://two.example, ",
        ADMIN_CLERK_USER_IDS=" user_1, user_2, ",
    )

    assert settings.cors_origin_list == [
        "https://one.example",
        "https://two.example",
    ]
    assert settings.admin_clerk_user_id_list == ["user_1", "user_2"]


def test_settings_ignore_unknown_environment_values():
    settings = make_settings(UNRELATED_SETTING="ignored")

    assert settings.DATABASE_URL.endswith("/codegram_test")


def test_clerk_jwks_and_authorized_parties_are_normalized():
    settings = make_settings(
        CLERK_ISSUER="https://example.clerk.accounts.dev/",
        CLERK_AUTHORIZED_PARTIES="https://app.example/, http://localhost:3000",
    )

    assert settings.clerk_jwks_url == (
        "https://example.clerk.accounts.dev/.well-known/jwks.json"
    )
    assert settings.clerk_authorized_party_list == [
        "https://app.example",
        "http://localhost:3000",
    ]
