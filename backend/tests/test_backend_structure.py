import ast
from pathlib import Path

from fastapi import APIRouter

import app.router as router_package
from app.core.config import settings
from app.utility.project_utility import _github_headers


BACKEND_ROOT = Path(__file__).resolve().parents[1]


def test_router_package_exports_an_aggregate_router():
    assert "router" in router_package.__all__
    assert isinstance(router_package.router, APIRouter)


def test_aggregate_registers_only_the_current_dashboard_route(test_app):
    dashboard_routes = [
        route
        for route in test_app.routes
        if getattr(route, "path", None).rstrip("/")
        in {"/dashboard", "/api/v1/dashboard"}
        and "GET" in getattr(route, "methods", set())
    ]

    assert {route.path for route in dashboard_routes} == {
        "/dashboard",
        "/api/v1/dashboard",
    }
    assert sum(route.include_in_schema for route in dashboard_routes) == 1


def test_operations_use_explicit_health_endpoints(test_app):
    paths = {getattr(route, "path", None) for route in test_app.routes}

    # The old probe remains as a hidden compatibility alias while deployments
    # move to the explicit liveness/readiness pair.
    assert "/health" in paths
    assert "/health/live" in paths
    assert "/health/ready" in paths


def test_application_packages_have_init_modules():
    package_directories = [
        path
        for path in (BACKEND_ROOT / "app").rglob("*")
        if path.is_dir() and "__pycache__" not in path.parts
    ]

    assert all((path / "__init__.py").is_file() for path in package_directories)


def test_runtime_configuration_has_no_direct_environment_reads():
    runtime_files = [
        *(BACKEND_ROOT / "app").rglob("*.py"),
        BACKEND_ROOT / "alembic" / "env.py",
    ]

    violations = []
    for path in runtime_files:
        tree = ast.parse(path.read_text())
        for node in ast.walk(tree):
            if not isinstance(node, ast.Call):
                continue
            function = node.func
            if isinstance(function, ast.Name) and function.id == "load_dotenv":
                violations.append(f"{path}: load_dotenv")
            if (
                isinstance(function, ast.Attribute)
                and isinstance(function.value, ast.Name)
                and function.value.id == "os"
                and function.attr == "getenv"
            ):
                violations.append(f"{path}: os.getenv")

    assert violations == []


def test_github_headers_use_central_settings(monkeypatch):
    monkeypatch.setattr(settings, "GITHUB_TOKEN", "github-test-token")

    assert _github_headers()["Authorization"] == "Bearer github-test-token"


def test_database_pool_configuration_is_centralized():
    assert settings.DATABASE_POOL_SIZE >= 1
    assert settings.DATABASE_MAX_OVERFLOW >= 0
    assert settings.DATABASE_POOL_TIMEOUT > 0
    assert settings.DATABASE_POOL_RECYCLE >= 1
