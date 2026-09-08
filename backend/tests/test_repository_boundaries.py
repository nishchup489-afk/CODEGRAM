import ast
from pathlib import Path

from app.repository import bookmark as bookmark_repository
from app.repository import live_projects as live_project_repository
from app.repository import project as project_repository
from app.service import bookmark as bookmark_service
from app.service import live_projects as live_project_service
from app.service import project as project_service


APP_ROOT = Path(__file__).resolve().parents[1] / "app"
SESSION_METHODS = {
    "add",
    "commit",
    "delete",
    "execute",
    "flush",
    "refresh",
    "rollback",
    "scalar",
    "scalars",
}


def _python_files(*directories: str):
    for directory in directories:
        yield from (APP_ROOT / directory).rglob("*.py")


def test_services_do_not_define_database_queries_or_session_calls():
    violations = []
    for path in _python_files("service"):
        tree = ast.parse(path.read_text())
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                modules = [
                    node.module if isinstance(node, ast.ImportFrom) else alias.name
                    for alias in node.names
                ]
                if any(module and module.startswith("sqlalchemy") for module in modules):
                    violations.append(f"{path.name}: SQLAlchemy import")
            if (
                isinstance(node, ast.Call)
                and isinstance(node.func, ast.Attribute)
                and node.func.attr in SESSION_METHODS
            ):
                violations.append(f"{path.name}: {node.func.attr}()")

    assert violations == []


def test_http_routes_do_not_execute_database_operations_directly():
    violations = []
    for path in _python_files("router", "api"):
        tree = ast.parse(path.read_text())
        for node in ast.walk(tree):
            if not (
                isinstance(node, ast.Call)
                and isinstance(node.func, ast.Attribute)
                and node.func.attr in SESSION_METHODS
            ):
                continue
            owner = node.func.value
            if isinstance(owner, ast.Name) and owner.id == "db":
                violations.append(f"{path.relative_to(APP_ROOT)}: db.{node.func.attr}()")
            if (
                isinstance(owner, ast.Attribute)
                and isinstance(owner.value, ast.Name)
                and owner.value.id == "self"
                and owner.attr == "db"
            ):
                violations.append(f"{path.relative_to(APP_ROOT)}: self.db.{node.func.attr}()")

    assert violations == []


def test_service_facades_reuse_repository_implementations():
    assert bookmark_service.add_project_bookmark is bookmark_repository.add_project_bookmark
    assert project_service.get_projects is project_repository.get_projects
    assert (
        live_project_service.get_live_projects_feed
        is live_project_repository.get_live_projects_feed
    )
