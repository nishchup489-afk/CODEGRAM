from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.models.LiveProject import LiveProject
from app.schema.profile import PublicProfileResponse
from app.service import LiveProjects as live_project_service
from app.service.LiveProjects import _can_view_live_project
from app.utility import project_utility


def test_public_profile_dto_does_not_serialize_private_identity_fields():
    profile = PublicProfileResponse(
        id="12345678-1234-5678-1234-567812345678",
        username="luffy",
        display_name="Luffy",
        bio=None,
        avatar_url=None,
        banner_url=None,
        github_url=None,
        linkedin_url=None,
        portfolio_url=None,
        reputation_score=0,
        followers_count=0,
        following_count=0,
        posts_count=0,
        project_count=0,
    )

    assert "email" not in profile.model_dump()
    assert "clerk_user_id" not in profile.model_dump()


@pytest.mark.parametrize("is_public,is_draft,expected", [
    (True, False, True),
    (True, True, False),
    (False, False, False),
])
def test_live_project_visibility_for_anonymous_users(is_public, is_draft, expected):
    project = SimpleNamespace(
        user_id="owner-id",
        is_public=is_public,
        is_draft=is_draft,
    )

    assert _can_view_live_project(project, None) is expected


def test_live_project_owner_can_view_private_draft():
    project = SimpleNamespace(
        user_id="owner-id",
        is_public=False,
        is_draft=True,
    )
    owner = SimpleNamespace(id="owner-id")

    assert _can_view_live_project(project, owner) is True


def test_live_project_slug_is_globally_unique():
    unique_column_sets = {
        tuple(column.name for column in constraint.columns)
        for constraint in LiveProject.__table__.constraints
        if constraint.__class__.__name__ == "UniqueConstraint"
    }

    assert ("slug",) in unique_column_sets
    assert ("user_id", "slug") not in unique_column_sets


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "operation,extra_arguments",
    [
        (
            live_project_service.create_live_project_journal_comment,
            {"data": SimpleNamespace(parent_id=None, content="comment")},
        ),
        (live_project_service.like_live_project_journal, {}),
        (live_project_service.unlike_live_project_journal, {}),
    ],
)
async def test_journal_interactions_require_project_visibility(
    monkeypatch,
    operation,
    extra_arguments,
):
    user = SimpleNamespace(id=uuid4())
    db = AsyncMock()
    visibility_check = AsyncMock(
        side_effect=HTTPException(status_code=404, detail="Journal not found")
    )
    monkeypatch.setattr(
        live_project_service,
        "get_user_by_clerk_id",
        AsyncMock(return_value=user),
    )
    monkeypatch.setattr(
        live_project_service,
        "_require_journal_project_visibility",
        visibility_check,
    )
    journal_id = uuid4()

    with pytest.raises(HTTPException) as error:
        await operation(
            db=db,
            journal_id=journal_id,
            clerk_user_id="user_123",
            **extra_arguments,
        )

    assert error.value.status_code == 404
    visibility_check.assert_awaited_once_with(
        db=db,
        journal_id=journal_id,
        current_user=user,
    )
    db.scalar.assert_not_awaited()


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "operation,extra_arguments",
    [
        (
            live_project_service.update_live_project_journal_comment,
            {"data": SimpleNamespace(content="updated")},
        ),
        (live_project_service.delete_live_project_journal_comment, {}),
    ],
)
async def test_existing_comment_mutations_recheck_project_visibility(
    monkeypatch,
    operation,
    extra_arguments,
):
    user = SimpleNamespace(id=uuid4())
    comment = SimpleNamespace(journal_id=uuid4())
    db = AsyncMock()
    db.scalar.return_value = comment
    visibility_check = AsyncMock(
        side_effect=HTTPException(status_code=404, detail="Journal not found")
    )
    monkeypatch.setattr(
        live_project_service,
        "get_user_by_clerk_id",
        AsyncMock(return_value=user),
    )
    monkeypatch.setattr(
        live_project_service,
        "_require_journal_project_visibility",
        visibility_check,
    )

    with pytest.raises(HTTPException) as error:
        await operation(
            db=db,
            comment_id=uuid4(),
            clerk_user_id="user_123",
            **extra_arguments,
        )

    assert error.value.status_code == 404
    visibility_check.assert_awaited_once_with(
        db=db,
        journal_id=comment.journal_id,
        current_user=user,
    )
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
@pytest.mark.parametrize("address", [
    "127.0.0.1",
    "10.0.0.1",
    "169.254.169.254",
    "::1",
    "192.0.2.1",
])
async def test_live_url_rejects_non_public_addresses(monkeypatch, address):
    monkeypatch.setattr(
        project_utility,
        "_resolve_host",
        lambda _hostname, _port: {address},
    )

    with pytest.raises(HTTPException) as error:
        await project_utility._require_public_live_url("https://example.com/")

    assert error.value.status_code == 400


@pytest.mark.asyncio
async def test_live_url_accepts_only_all_public_dns_answers(monkeypatch):
    monkeypatch.setattr(
        project_utility,
        "_resolve_host",
        lambda _hostname, _port: {"93.184.216.34"},
    )

    await project_utility._require_public_live_url("https://example.com/")

    monkeypatch.setattr(
        project_utility,
        "_resolve_host",
        lambda _hostname, _port: {"93.184.216.34", "127.0.0.1"},
    )
    with pytest.raises(HTTPException):
        await project_utility._require_public_live_url("https://example.com/")


def test_live_url_rejects_credentials_and_non_web_ports():
    with pytest.raises(HTTPException):
        project_utility._normalize_live_url("https://user:pass@example.com/")
    with pytest.raises(HTTPException):
        project_utility._normalize_live_url("https://example.com:8443/")


@pytest.mark.asyncio
async def test_live_url_redirect_target_is_checked(monkeypatch):
    probed_urls = []

    async def fake_probe(_client, _method, url):
        probed_urls.append(url)
        if len(probed_urls) == 1:
            return 302, "http://169.254.169.254/latest/meta-data/"
        raise HTTPException(status_code=400, detail="non-public")

    monkeypatch.setattr(project_utility, "_send_live_url_probe", fake_probe)

    with pytest.raises(HTTPException):
        await project_utility.verify_live_url("https://example.com/")

    assert probed_urls == [
        "https://example.com/",
        "http://169.254.169.254/latest/meta-data/",
    ]
