# Codegram backend

## Local setup

Copy `.env.example` to `.env`, replace its placeholder values, then install the
locked dependencies:

```bash
poetry install --with dev --no-root
```

Apply migrations before starting the API. The application intentionally does
not create or alter tables during startup:

```bash
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload
```

Protected routes require `Authorization: Bearer <Clerk session token>`. The API
validates the token signature through Clerk JWKS and checks its issuer,
expiration, not-before time, session, subject, and authorized-party claims.
`POST /sync_user/` also uses the verified subject and resolves its primary email
through Clerk's Backend API; identity fields in request bodies or query strings
are not trusted.

Application endpoints are published canonically under `/api/v1`. Unversioned
aliases remain temporarily available for the frontend migration, but they are
excluded from OpenAPI and should not be used by new clients.

The PostgreSQL pool is configured through `DATABASE_POOL_SIZE`,
`DATABASE_MAX_OVERFLOW`, `DATABASE_POOL_TIMEOUT`, `DATABASE_POOL_RECYCLE`, and
`DATABASE_POOL_PRE_PING`. Size the pool across all workers so their combined
maximum stays below the database connection limit.

Persistence is isolated under `app/repository`. Routers continue to call the
service API, while service modules act as stable compatibility facades over
the repository implementations. SQLAlchemy statements and session mutations
must not be added to routers, API modules, services, authentication helpers, or
general utilities; boundary tests enforce this rule.

`GET /health/live` is a dependency-free process probe. `GET /health/ready`
checks PostgreSQL and, when configured, Redis. Requests receive an
`X-Request-ID` response header and are logged as structured JSON.

Write endpoints are rate limited. The default in-memory backend is
process-local, so production deployments with multiple workers or replicas
should configure `REDIS_URL` and install the `redis` Python package in the
deployment image.

## Development checks

Install the locked application and test dependencies:

```bash
poetry install --with dev --no-root
```

Run the backend test suite:

```bash
poetry run pytest
```

The default tests do not connect to PostgreSQL. Their ASGI client skips the
application lifespan and uses an unreachable test-only database URL as a guard
against accidentally contacting a developer or production database. Tests that
need persistence should override `get_db` with an isolated fixture explicitly.

The backend CI workflow also checks the dependency lock, compiles application
and migration modules, verifies that Alembic has exactly one migration head,
and replays the full migration history against a fresh PostgreSQL 16 database.
