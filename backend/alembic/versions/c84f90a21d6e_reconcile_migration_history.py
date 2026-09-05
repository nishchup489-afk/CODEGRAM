"""reconcile migration history

Revision ID: c84f90a21d6e
Revises: 62b6090822bc
Create Date: 2026-09-05

"""
from typing import Sequence, Union

from alembic import op


revision: str = "c84f90a21d6e"
down_revision: Union[str, Sequence[str], None] = "62b6090822bc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Reconcile databases that ran the pre-repair migration history."""
    op.execute(
        "ALTER TABLE project_stars "
        "DROP COLUMN IF EXISTS clerk_user_id"
    )
    op.execute(
        "CREATE SEQUENCE IF NOT EXISTS support_ticket_seq START WITH 1"
    )
    op.execute(
        """
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
                        MAX(
                            substring(
                                ticket_number
                                FROM '^CG-([0-9]+)$'
                            )::bigint
                        ),
                        0
                    ) + 1
                )
                INTO next_ticket_number
                FROM support_tickets;

                PERFORM setval(
                    'support_ticket_seq',
                    next_ticket_number,
                    false
                );
            END IF;
        END
        $$;
        """
    )


def downgrade() -> None:
    """Cleanup is intentionally not reversed.

    The removed column was redundant and the ticket sequence predates this
    revision, so recreating/removing either object would reintroduce drift.
    """
    pass
