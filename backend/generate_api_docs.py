"""Generate per-operation API documentation from FastAPI's OpenAPI contract."""

from __future__ import annotations

import inspect
import json
import os
import re
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
BACKEND_ROOT = REPO_ROOT / "backend"
FRONTEND_ROOT = REPO_ROOT / "frontend"
DOCS_ROOT = REPO_ROOT / "api_docs"
HTTP_METHODS = {"get", "post", "put", "patch", "delete"}
CALL_PATTERN = re.compile(
    r"(?:\bapi\.(?P<api_method>get|post|put|patch|delete)|(?P<fetch>\bfetch))"
    r"\s*\(\s*"
    r"(?P<quote>[`\"'])(?P<url>.*?)(?P=quote)",
    re.DOTALL,
)
TEMPLATE_VALUE = re.compile(r"\$\{[^}]+\}")


def _frontend_calls() -> list[dict[str, Any]]:
    calls: list[dict[str, Any]] = []
    for path in sorted(FRONTEND_ROOT.rglob("*")):
        if path.suffix not in {".js", ".jsx", ".ts", ".tsx"}:
            continue
        if any(part in {"node_modules", ".next"} for part in path.parts):
            continue
        content = path.read_text(errors="ignore")
        for match in CALL_PATTERN.finditer(content):
            url = " ".join(match.group("url").split())
            if "/" not in url:
                continue
            calls.append(
                {
                    "path": path,
                    "line": content.count("\n", 0, match.start()) + 1,
                    "method": (match.group("api_method") or "get").lower(),
                    "url": url,
                }
            )
    return calls


def _segments(value: str) -> list[str]:
    value = TEMPLATE_VALUE.sub("{value}", value)
    value = value.split("?", 1)[0].rstrip("/") or "/"
    if value.startswith("/api/v1"):
        value = value[len("/api/v1") :] or "/"
    return [segment for segment in value.split("/") if segment]


def _frontend_matches(
    route_path: str,
    method: str,
    calls: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    route_segments = _segments(route_path)
    matches = []
    for call in calls:
        if call["method"] != method:
            continue
        call_segments = _segments(call["url"])
        if len(call_segments) != len(route_segments):
            continue
        if all(
            route.startswith("{") or route == candidate
            for route, candidate in zip(route_segments, call_segments, strict=True)
        ):
            matches.append(call)
    return matches


def _schema_label(schema: dict[str, Any]) -> str:
    if "$ref" in schema:
        return schema["$ref"].rsplit("/", 1)[-1]
    if schema.get("type") == "array":
        return f"array[{_schema_label(schema.get('items', {}))}]"
    if "anyOf" in schema:
        return " | ".join(_schema_label(item) for item in schema["anyOf"])
    return schema.get("title") or schema.get("type") or "unspecified"


def _schema_shape(
    schema: dict[str, Any],
    components: dict[str, Any],
    seen: frozenset[str] = frozenset(),
) -> Any:
    if "$ref" in schema:
        name = schema["$ref"].rsplit("/", 1)[-1]
        if name in seen:
            return f"<{name}>"
        return _schema_shape(
            components.get(name, {}), components, seen | {name}
        )
    if "anyOf" in schema:
        non_null = [item for item in schema["anyOf"] if item.get("type") != "null"]
        return _schema_shape(non_null[0], components, seen) if non_null else None
    schema_type = schema.get("type")
    if schema_type == "object" or "properties" in schema:
        return {
            name: _schema_shape(value, components, seen)
            for name, value in schema.get("properties", {}).items()
        }
    if schema_type == "array":
        return [_schema_shape(schema.get("items", {}), components, seen)]
    if "enum" in schema:
        return schema["enum"][0] if schema["enum"] else None
    if schema.get("format") == "uuid":
        return "uuid"
    if schema.get("format") == "date-time":
        return "date-time"
    return {
        "string": "string",
        "integer": 0,
        "number": 0,
        "boolean": False,
    }.get(schema_type, "value")


def _response(operation: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    responses = operation.get("responses", {})
    preferred = next(
        (code for code in ("200", "201", "202", "204") if code in responses),
        next(iter(responses), "200"),
    )
    schema = (
        responses.get(preferred, {})
        .get("content", {})
        .get("application/json", {})
        .get("schema", {})
    )
    return preferred, schema


def _source_locations(app: Any) -> dict[tuple[str, str], tuple[Path, int]]:
    locations: dict[tuple[str, str], tuple[Path, int]] = {}
    for route in app.routes:
        endpoint = getattr(route, "endpoint", None)
        source = inspect.getsourcefile(endpoint) if endpoint else None
        if not source:
            continue
        try:
            line = inspect.getsourcelines(endpoint)[1]
        except (OSError, TypeError):
            line = 1
        for method in getattr(route, "methods", set()):
            locations[(route.path, method.lower())] = (Path(source), line)
    return locations


def _authentication(app: Any) -> dict[tuple[str, str], str]:
    authentication: dict[tuple[str, str], str] = {}
    for route in app.routes:
        dependency_names = {
            getattr(dependency.call, "__name__", "")
            for dependency in getattr(getattr(route, "dependant", None), "dependencies", [])
        }
        if "require_admin" in dependency_names:
            value = "Admin bearer token required"
        elif "get_current_user" in dependency_names:
            value = "Bearer token required"
        elif "get_current_user_optional" in dependency_names:
            value = "Public; bearer token enables viewer-specific fields"
        else:
            value = "Public"
        for method in getattr(route, "methods", set()):
            authentication[(route.path, method.lower())] = value
    return authentication


def _operation_filename(method: str, path: str) -> str:
    clean = re.sub(r"[^a-zA-Z0-9]+", "_", path).strip("_").lower()
    return f"{method.lower()}_{clean or 'root'}.md"


def generate() -> None:
    os.environ.setdefault(
        "DATABASE_URL",
        "postgresql+asyncpg://docs:docs@127.0.0.1:1/codegram_docs",
    )
    from app.main import app

    document = app.openapi()
    components = document.get("components", {}).get("schemas", {})
    calls = _frontend_calls()
    sources = _source_locations(app)
    authentication = _authentication(app)
    operations: list[tuple[str, str, dict[str, Any]]] = []
    for path, path_item in document["paths"].items():
        for method, operation in path_item.items():
            if method in HTTP_METHODS:
                operations.append((path, method, operation))

    # Operational probes are deliberately hidden from OpenAPI but still need
    # route documentation.
    documented_paths = {path for path, _, _ in operations}
    for path in (
        "/api/v1/health",
        "/api/v1/health/live",
        "/api/v1/health/ready",
    ):
        if path not in documented_paths:
            operations.append(
                (
                    path,
                    "get",
                    {
                        "summary": "Operational health probe",
                        "operationId": path.strip("/").replace("/", "_") or "health",
                        "responses": {
                            "200": {
                                "content": {
                                    "application/json": {
                                        "schema": {"type": "object"}
                                    }
                                }
                            }
                        },
                    },
                )
            )

    DOCS_ROOT.mkdir(parents=True, exist_ok=True)
    expected_files = {"README.md"}
    index_rows = []
    for path, method, operation in sorted(operations, key=lambda item: (item[0], item[1])):
        filename = _operation_filename(method, path)
        expected_files.add(filename)
        response_code, response_schema = _response(operation)
        matches = _frontend_matches(path, method, calls)
        auth = authentication.get((path, method), "Public")
        source = sources.get((path, method))
        if source is None and path.startswith("/api/v1"):
            source = sources.get((path[len("/api/v1") :] or "/", method))

        lines = [
            f"# {method.upper()} `{path}`",
            "",
            operation.get("summary") or operation.get("operationId", "API operation"),
            "",
            f"- Authentication: {auth}",
            f"- Operation ID: `{operation.get('operationId', 'n/a')}`",
        ]
        if source:
            relative = source[0].resolve().relative_to(REPO_ROOT)
            lines.append(
                f"- Backend implementation: [`{relative}:{source[1]}`](../{relative}#L{source[1]})"
            )

        lines.extend(["", "## Frontend connections", ""])
        if matches:
            for match in matches:
                relative = match["path"].relative_to(REPO_ROOT)
                lines.append(
                    f"- [`{relative}:{match['line']}`](../{relative}#L{match['line']}): "
                    f"`{match['url']}`"
                )
        else:
            lines.append("- No direct frontend API call was found.")

        request_schema = (
            operation.get("requestBody", {})
            .get("content", {})
            .get("application/json", {})
            .get("schema")
        )
        if request_schema:
            lines.extend(
                [
                    "",
                    "## Request schema",
                    "",
                    f"Model: `{_schema_label(request_schema)}`",
                    "",
                    "```json",
                    json.dumps(_schema_shape(request_schema, components), indent=2),
                    "```",
                ]
            )

        lines.extend(
            [
                "",
                f"## Return schema — HTTP {response_code}",
                "",
                f"Model: `{_schema_label(response_schema)}`",
                "",
                "```json",
                json.dumps(_schema_shape(response_schema, components), indent=2),
                "```",
                "",
                "---",
                "",
                "Generated from the backend OpenAPI contract. Run "
                "`cd backend && poetry run python generate_api_docs.py` to refresh.",
                "",
            ]
        )
        (DOCS_ROOT / filename).write_text("\n".join(lines))
        index_rows.append(
            f"| {method.upper()} | `{path}` | [{operation.get('summary') or operation.get('operationId', 'Details')}]({filename}) |"
        )

    for stale in DOCS_ROOT.glob("*.md"):
        if stale.name not in expected_files:
            stale.unlink()

    readme = [
        "# API route documentation",
        "",
        "This directory is generated from FastAPI's canonical OpenAPI contract. "
        "Each operation includes its backend source, detected frontend call sites, "
        "request model, and return shape.",
        "",
        "Canonical application routes use `/api/v1`. Unversioned compatibility "
        "aliases are intentionally omitted.",
        "",
        "| Method | Route | Documentation |",
        "| --- | --- | --- |",
        *index_rows,
        "",
        "Regenerate after changing routes or schemas:",
        "",
        "```bash",
        "cd backend",
        "poetry run python generate_api_docs.py",
        "```",
        "",
    ]
    (DOCS_ROOT / "README.md").write_text("\n".join(readme))


if __name__ == "__main__":
    generate()
