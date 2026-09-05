"""added clerk_user_id to project stars

Revision ID: dce47bf7e32a
Revises: 7d63714b2ea6
Create Date: 2026-05-23 20:39:34.678748

"""
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = 'dce47bf7e32a'
down_revision: Union[str, Sequence[str], None] = '7d63714b2ea6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Keep project stars keyed by the users table.

    The original revision added a second, non-null identity column without a
    backfill. ProjectStar uses ``user_id`` as its identity and the following
    revision attempted to add this column a second time, making clean replay
    impossible. A forward cleanup removes it from previously upgraded DBs.
    """
    pass


def downgrade() -> None:
    """No schema change was introduced by this repaired revision."""
    pass
