""":asjkhdgfajkshdgf

Revision ID: af8fded8d660
Revises: dce47bf7e32a
Create Date: 2026-05-23 21:05:27.275978

"""
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = 'af8fded8d660'
down_revision: Union[str, Sequence[str], None] = 'dce47bf7e32a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """No-op retained to preserve the deployed revision graph.

    This revision originally duplicated the column addition from its parent.
    """
    pass


def downgrade() -> None:
    """No schema change was introduced by this repaired revision."""
    pass
