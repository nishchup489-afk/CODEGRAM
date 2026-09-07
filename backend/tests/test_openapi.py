def test_openapi_document_has_expected_metadata(test_app):
    document = test_app.openapi()

    assert document["openapi"].startswith("3.")
    assert document["info"]["title"] == "DevManiac API"
    assert document["info"]["version"] == "1.0.0"


def test_openapi_exposes_core_operational_paths(test_app):
    paths = test_app.openapi()["paths"]

    assert "get" in paths["/"]
    assert "/health" not in paths


def test_every_operation_has_a_unique_id(test_app):
    operation_ids = [
        operation["operationId"]
        for path_item in test_app.openapi()["paths"].values()
        for method, operation in path_item.items()
        if method in {"get", "post", "put", "patch", "delete"}
    ]

    assert len(operation_ids) == len(set(operation_ids))


def test_protected_routes_publish_bearer_auth_without_identity_query(test_app):
    document = test_app.openapi()

    assert "HTTPBearer" in document["components"]["securitySchemes"]
    for path, method in [
        ("/api/v1/profile/me", "get"),
        ("/api/v1/projects/", "post"),
        ("/api/v1/sync_user/", "post"),
        ("/api/v1/admin/dashboard", "get"),
    ]:
        operation = document["paths"][path][method]
        assert operation["security"] == [{"HTTPBearer": []}]
        assert "clerk_user_id" not in {
            parameter["name"] for parameter in operation.get("parameters", [])
        }


def test_legacy_admin_routes_require_bearer_auth(test_app):
    document = test_app.openapi()
    legacy_admin_operations = [
        ("/api/v1/support/admin/tickets", "get"),
        ("/api/v1/support/admin/tickets/{ticket_id}", "patch"),
        ("/api/v1/feedback/admin", "get"),
        ("/api/v1/feedback/admin/{feedback_id}", "get"),
        ("/api/v1/feedback/admin/{feedback_id}", "patch"),
        ("/api/v1/feedback/admin/{feedback_id}/archive", "patch"),
        ("/api/v1/changelog", "post"),
        ("/api/v1/changelog/admin/all", "get"),
        ("/api/v1/changelog/{changelog_id}", "patch"),
        ("/api/v1/changelog/{changelog_id}", "delete"),
    ]

    for path, method in legacy_admin_operations:
        operation = document["paths"][path][method]
        assert operation["security"] == [{"HTTPBearer": []}]
        assert "admin_clerk_user_id" not in {
            parameter["name"] for parameter in operation.get("parameters", [])
        }


def test_public_changelog_reads_remain_public(test_app):
    document = test_app.openapi()

    assert "security" not in document["paths"]["/api/v1/changelog"]["get"]
    assert "security" not in document["paths"]["/api/v1/changelog/{slug}"]["get"]


def test_openapi_documents_only_canonical_versioned_application_routes(test_app):
    paths = test_app.openapi()["paths"]

    assert "/api/v1/projects/" in paths
    assert "/projects/" not in paths
