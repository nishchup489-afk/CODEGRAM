-- ============================================================================
-- One-off: bring a create_all()-built database up to migration f33a64c91b08.
--
-- Production was created by the old startup create_all(), which builds only
-- what the models declare. Everything that lived in an Alembic op.execute() or
-- a migration-only op.create_index() is therefore missing. This script adds
-- exactly those objects. Every statement is idempotent, so it is safe to run
-- more than once.
--
-- Order of operations:
--   1. psql < scripts/adopt_production_schema.sql
--   2. poetry run alembic stamp f33a64c91b08
--   3. poetry run alembic upgrade head
--
-- Note: these CREATE INDEX statements take a brief write lock on each table.
-- On a large table use CREATE INDEX CONCURRENTLY instead, outside a
-- transaction, one statement at a time.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- From 2ed7a43da1d6 / c84f90a21d6e — support ticket numbering.
--
-- app/repository/support.py calls nextval('support_ticket_seq') when a ticket
-- is created. Without this sequence that endpoint raises, so this block is a
-- live bug fix, not just schema tidying.
-- ---------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS support_ticket_seq START WITH 1;

-- Advance the sequence past any ticket numbers that already exist, so the
-- next CG-nnn issued cannot collide with a row already in the table.
DO $$
DECLARE
    next_ticket_number bigint;
    sequence_next_value bigint;
BEGIN
    IF to_regclass('support_tickets') IS NOT NULL THEN
        SELECT last_value + CASE WHEN is_called THEN 1 ELSE 0 END
        INTO sequence_next_value
        FROM support_ticket_seq;

        SELECT GREATEST(
            sequence_next_value,
            COALESCE(
                MAX(substring(ticket_number FROM '^CG-([0-9]+)$')::bigint),
                0
            ) + 1
        )
        INTO next_ticket_number
        FROM support_tickets;

        PERFORM setval('support_ticket_seq', next_ticket_number, false);
    END IF;
END
$$;


-- ---------------------------------------------------------------------------
-- From c84f90a21d6e — drop a column the pre-repair history left behind.
-- A create_all() database never had it; the IF EXISTS makes this a no-op.
-- ---------------------------------------------------------------------------

ALTER TABLE project_stars DROP COLUMN IF EXISTS clerk_user_id;


-- ---------------------------------------------------------------------------
-- From f33a64c91b08 — trigram search support.
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS ix_users_username_lower_trgm
    ON users USING gin (username_lower gin_trgm_ops);

CREATE INDEX IF NOT EXISTS ix_users_display_name_lower_trgm
    ON users USING gin (lower(display_name) gin_trgm_ops)
    WHERE display_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_users_public_search_rank
    ON users (followers_count DESC, created_at DESC)
    WHERE is_active = true AND is_banned = false AND is_private = false;


-- ---------------------------------------------------------------------------
-- From f33a64c91b08 — feed and listing indexes.
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS ix_projects_created_at_id
    ON projects (created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS ix_projects_user_created_at
    ON projects (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_project_stars_project_user
    ON project_stars (project_id, user_id);

CREATE INDEX IF NOT EXISTS ix_project_bookmarks_project_user
    ON project_bookmarks (project_id, user_id);

CREATE INDEX IF NOT EXISTS ix_project_comments_visible_thread
    ON project_comments (project_id, parent_id, created_at DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_live_projects_visible_feed
    ON live_projects (created_at DESC, id DESC)
    WHERE is_public = true AND is_draft = false;

CREATE INDEX IF NOT EXISTS ix_feed_events_public_created_at_id
    ON feed_events (created_at DESC, id DESC)
    WHERE is_public = true;


-- ---------------------------------------------------------------------------
-- Verification. All four should be non-null / non-zero afterwards.
-- ---------------------------------------------------------------------------

SELECT
    to_regclass('public.support_ticket_seq') AS support_ticket_seq,
    (SELECT count(*) FROM pg_extension WHERE extname = 'pg_trgm') AS pg_trgm,
    (SELECT count(*) FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname LIKE 'ix_%'
        AND indexname IN (
            'ix_users_username_lower_trgm',
            'ix_users_display_name_lower_trgm',
            'ix_users_public_search_rank',
            'ix_projects_created_at_id',
            'ix_projects_user_created_at',
            'ix_project_stars_project_user',
            'ix_project_bookmarks_project_user',
            'ix_project_comments_visible_thread',
            'ix_live_projects_visible_feed',
            'ix_feed_events_public_created_at_id'
        )) AS catch_up_indexes;
