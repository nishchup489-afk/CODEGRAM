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
