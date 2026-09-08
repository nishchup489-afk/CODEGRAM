from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest
from fastapi import FastAPI
from sqlalchemy.dialects import postgresql

from app.router import feed_event, live_projects, project as project_router, search
from app.repository import live_projects as live_project_service
from app.repository import project as project_service


class ScalarRows:
    def __init__(self, rows):
        self._rows = rows

    def all(self):
        return self._rows


def _project(project_id=None):
    now = datetime.now(timezone.utc)
    return SimpleNamespace(
        id=project_id or uuid4(),
        user_id=uuid4(),
        title="Scalable project",
        slug="scalable-project",
        description="description",
        github_url="https://github.com/example/repo",
        live_url=None,
        thumbnail_url=None,
        demo_video_url=None,
        gallery_urls=[],
        tech_stack=[],
        stars_count=7,
        views_count=3,
        comments_count=2,
        is_featured=False,
        created_at=now,
        updated_at=now,
        user=SimpleNamespace(username="builder", avatar_url=None, location=None),
    )


@pytest.mark.asyncio
async def test_project_detail_get_does_not_write_or_commit():
    db = AsyncMock()
    db.scalar.return_value = _project()

    response = await project_service.get_existing_project(
        db=db,
        slug="scalable-project",
    )

    assert response["stars_count"] == 7
    db.commit.assert_not_awaited()
    db.refresh.assert_not_awaited()


@pytest.mark.asyncio
async def test_project_feed_batches_viewer_state_queries():
    projects = [_project(), _project()]
    viewer = SimpleNamespace(id=uuid4())
    db = AsyncMock()
    db.scalars.side_effect = [
        ScalarRows(projects),
        ScalarRows([projects[0].id]),
        ScalarRows([projects[1].id]),
    ]

    response = await project_service.get_projects(
        db=db,
        limit=20,
        current_user=viewer,
    )

    assert db.scalars.await_count == 3
    assert response["items"][0]["is_starred"] is True
    assert response["items"][0]["is_bookmarked"] is False
    assert response["items"][1]["is_starred"] is False
    assert response["items"][1]["is_bookmarked"] is True


@pytest.mark.asyncio
async def test_project_cursor_uses_id_to_disambiguate_equal_timestamps():
    cursor = datetime.now(timezone.utc)
    cursor_id = uuid4()
    db = AsyncMock()
    db.scalars.return_value = ScalarRows([])

    await project_service.get_projects(
        db=db,
        cursor=cursor,
        cursor_id=cursor_id,
    )

    statement = db.scalars.await_args.args[0]
    sql = str(statement.compile(dialect=postgresql.dialect()))
    assert "projects.created_at <" in sql
    assert "projects.created_at =" in sql
    assert "projects.id <" in sql
    assert "ORDER BY projects.created_at DESC, projects.id DESC" in sql


@pytest.mark.asyncio
async def test_live_project_detail_get_does_not_write_or_commit(monkeypatch):
    now = datetime.now(timezone.utc)
    live_project = SimpleNamespace(created_at=now)
    db = AsyncMock()
    monkeypatch.setattr(
        live_project_service,
        "_get_visible_live_project_by_slug",
        AsyncMock(return_value=live_project),
    )

    result = await live_project_service.get_single_live_project(
        db=db,
        slug="private-safe",
    )

    assert result is live_project
    assert result.days_count == 1
    db.execute.assert_not_awaited()
    db.commit.assert_not_awaited()


def test_search_and_feed_bounds_are_published():
    app = FastAPI()
    app.include_router(search.router)
    app.include_router(live_projects.router)
    app.include_router(feed_event.router)
    paths = app.openapi()["paths"]

    search_parameters = {
        parameter["name"]: parameter
        for parameter in paths["/search/users"]["get"]["parameters"]
    }
    assert search_parameters["q"]["schema"]["minLength"] == 2
    assert search_parameters["q"]["schema"]["maxLength"] == 100

    for path in (
        "/live-projects",
        "/live-projects/{slug}/journals",
        "/live-projects/journals/{journal_id}/comments",
        "/feed-events",
    ):
        parameters = {
            parameter["name"]: parameter
            for parameter in paths[path]["get"]["parameters"]
        }
        assert parameters["limit"]["schema"]["maximum"] == 100
        assert "cursor" in parameters
        assert "cursor_id" in parameters


def test_project_comments_are_bounded_and_cursor_paginated():
    app = FastAPI()
    app.include_router(project_router.router)
    parameters = {
        parameter["name"]: parameter
        for parameter in app.openapi()["paths"]["/projects/{slug}/comments"]["get"][
            "parameters"
        ]
    }

    assert parameters["limit"]["schema"]["maximum"] == 100
    assert "cursor" in parameters
    assert "cursor_id" in parameters


def test_scalability_migration_includes_trigram_and_hot_path_indexes():
    migration = (
        Path(__file__).parents[1]
        / "alembic/versions/f33a64c91b08_add_scalability_indexes.py"
    ).read_text()

    assert "CREATE EXTENSION IF NOT EXISTS pg_trgm" in migration
    assert "gin_trgm_ops" in migration
    assert "ix_project_stars_project_user" in migration
    assert "ix_project_bookmarks_project_user" in migration
    assert "ix_projects_user_created_at" in migration
    assert "ix_live_projects_visible_feed" in migration
    assert "ix_feed_events_public_created_at_id" in migration
