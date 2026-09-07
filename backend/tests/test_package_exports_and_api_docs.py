from pathlib import Path
import re

import app
from app import api, core, models, router, schema, service, utility


REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS_ROOT = REPO_ROOT / "api_docs"


def test_root_package_exposes_every_backend_layer():
    assert set(app.__all__) == {
        "api",
        "core",
        "main",
        "models",
        "router",
        "schema",
        "service",
        "utility",
    }


def test_every_package_export_is_explicit_and_resolvable():
    for package in (api, api.v1, core, models, router, schema, service, utility):
        assert package.__all__
        assert all(isinstance(name, str) for name in package.__all__)
        assert all(hasattr(package, name) for name in package.__all__)


def test_every_module_in_each_backend_layer_is_imported():
    expectations = {
        core: {"admin", "auth", "config", "database", "http_client", "operations"},
        router: {
            "app_notice",
            "bookmark",
            "changelog",
            "dashboard",
            "dashboard_layout",
            "feed_event",
            "follow",
            "idea",
            "live_projects",
            "operations",
            "profile",
            "project",
            "search",
            "user",
        },
        schema: {
            "ProfileAnalytics",
            "admin",
            "app_notice",
            "changelog",
            "dashboard",
            "dashboard_user_preview",
            "feedback",
            "follow",
            "idea",
            "liveProjects",
            "profile",
            "project",
            "support",
            "user",
        },
        service: {
            "LiveProjects",
            "admin",
            "bookmark",
            "changelog",
            "dashboard",
            "dashboard_user_preview",
            "feedback",
            "follow",
            "profile",
            "project",
            "support",
            "user",
        },
        utility: {"project_utility"},
    }
    for package, expected in expectations.items():
        assert expected <= set(package.__all__)


def test_init_exports_cover_every_module_file():
    packages = (api.v1, core, models, router, schema, service, utility)
    aliases = {"LiveProject": "live_project"}

    for package in packages:
        package_directory = Path(package.__file__).parent
        expected = {
            aliases.get(path.stem, path.stem)
            for path in package_directory.glob("*.py")
            if path.stem != "__init__"
        }
        assert expected <= set(package.__all__)


def test_each_canonical_openapi_operation_has_its_own_document(test_app):
    expected = set()
    for path, path_item in test_app.openapi()["paths"].items():
        for method in path_item:
            if method not in {"get", "post", "put", "patch", "delete"}:
                continue
            clean_path = "_".join(
                part for part in re.split(r"[^a-zA-Z0-9]+", path) if part
            ).lower() or "root"
            filename = f"{method}_{clean_path}.md"
            expected.add(filename)
            content = (DOCS_ROOT / filename).read_text()
            assert content.startswith(f"# {method.upper()} `{path}`")
            assert "## Frontend connections" in content
            assert "## Return schema" in content

    actual = {path.name for path in DOCS_ROOT.glob("*.md") if path.name != "README.md"}
    assert expected <= actual
    assert {"get_health.md", "get_health_live.md", "get_health_ready.md"} <= actual
