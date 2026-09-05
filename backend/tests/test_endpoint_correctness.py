from inspect import signature
from uuid import UUID

import pytest
from pydantic import ValidationError

from app.router import project as project_router
from app.schema.liveProjects import UpdateLiveProject
from app.schema.project import AddVote, UpdateProject
from app.service import bookmark as bookmark_service
from app.service.project import (
    delete_project_comment,
    update_project_comment,
    vote_on_comment,
)


def test_project_bookmark_routes_use_the_canonical_service():
    assert project_router.add_project_bookmark is bookmark_service.add_project_bookmark
    assert project_router.remove_project_bookmark is bookmark_service.remove_project_bookmark


def test_user_project_updates_exclude_moderation_and_derived_fields():
    assert "is_featured" not in UpdateProject.model_fields
    assert "stars_count" not in UpdateProject.model_fields
    assert "is_featured" not in UpdateLiveProject.model_fields

    with pytest.raises(ValidationError):
        UpdateProject(is_featured=True)
    with pytest.raises(ValidationError):
        UpdateProject(stars_count=999)
    with pytest.raises(ValidationError):
        UpdateLiveProject(is_featured=True)


def test_comment_vote_type_is_constrained_at_the_request_boundary():
    assert AddVote(vote_type="up").vote_type == "up"
    assert AddVote(vote_type="down").vote_type == "down"

    with pytest.raises(ValidationError):
        AddVote(vote_type="sideways")


def test_comment_mutation_services_accept_database_user_ids():
    for service in (
        update_project_comment,
        delete_project_comment,
        vote_on_comment,
    ):
        assert signature(service).parameters["user_id"].annotation is UUID


def test_bookmark_response_contracts_are_published(test_app):
    paths = test_app.openapi()["paths"]

    for method in ("post", "delete"):
        operation = paths["/projects/{slug}/bookmark"][method]
        schema = operation["responses"]["200"]["content"]["application/json"][
            "schema"
        ]
        assert schema["$ref"].endswith("/ProjectBookmarkStatus")


def test_comment_mutations_use_bearer_identity_not_identity_parameters(test_app):
    paths = test_app.openapi()["paths"]

    for path, method in (
        ("/projects/comments/{comment_id}", "patch"),
        ("/projects/comments/{comment_id}", "delete"),
        ("/projects/comments/{comment_id}/vote", "post"),
    ):
        operation = paths[path][method]
        assert operation["security"] == [{"HTTPBearer": []}]
        assert "clerk_user_id" not in {
            parameter["name"] for parameter in operation.get("parameters", [])
        }
