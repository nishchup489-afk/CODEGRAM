"""make live-project slugs globally unique

Revision ID: 901d70fb62e4
Revises: c84f90a21d6e
Create Date: 2026-09-05

"""
from typing import Sequence, Union

from alembic import op


revision: str = "901d70fb62e4"
down_revision: Union[str, Sequence[str], None] = "c84f90a21d6e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove ambiguity from APIs that address live projects only by slug."""
    op.execute(
        """
        DO $$
        DECLARE
            duplicate record;
            candidate text;
            attempt integer;
        BEGIN
            FOR duplicate IN
                SELECT id, slug AS original_slug
                FROM (
                    SELECT
                        id,
                        slug,
                        row_number() OVER (
                            PARTITION BY slug
                            ORDER BY created_at, id
                        ) AS duplicate_number
                    FROM live_projects
                ) AS ranked
                WHERE duplicate_number > 1
            LOOP
                attempt := 0;
                LOOP
                    candidate := left(duplicate.original_slug, 155)
                        || '-' || replace(duplicate.id::text, '-', '')
                        || '-' || attempt::text;
                    EXIT WHEN NOT EXISTS (
                        SELECT 1
                        FROM live_projects
                        WHERE slug = candidate
                    );
                    attempt := attempt + 1;
                END LOOP;

                UPDATE live_projects
                SET slug = candidate
                WHERE id = duplicate.id;
            END LOOP;
        END
        $$;
        """
    )
    op.drop_constraint(
        "unique_user_live_project_slug",
        "live_projects",
        type_="unique",
    )
    op.create_unique_constraint(
        "unique_live_project_slug",
        "live_projects",
        ["slug"],
    )


def downgrade() -> None:
    """Restore per-user uniqueness; collision-renamed slugs stay stable."""
    op.drop_constraint(
        "unique_live_project_slug",
        "live_projects",
        type_="unique",
    )
    op.create_unique_constraint(
        "unique_user_live_project_slug",
        "live_projects",
        ["user_id", "slug"],
    )
