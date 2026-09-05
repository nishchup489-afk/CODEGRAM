def test_openapi_document_has_expected_metadata(test_app):
    document = test_app.openapi()

    assert document["openapi"].startswith("3.")
    assert document["info"]["title"] == "DevManiac API"
    assert document["info"]["version"] == "1.0.0"


def test_openapi_exposes_core_operational_paths(test_app):
    paths = test_app.openapi()["paths"]

    assert "get" in paths["/"]
    assert "get" in paths["/health"]


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
        ("/profile/me", "get"),
        ("/projects/", "post"),
        ("/sync_user/", "post"),
        ("/admin/dashboard", "get"),
    ]:
        operation = document["paths"][path][method]
        assert operation["security"] == [{"HTTPBearer": []}]
        assert "clerk_user_id" not in {
            parameter["name"] for parameter in operation.get("parameters", [])
        }
