"""add early access signups

Revision ID: b7c41d9e2f08
Revises: f33a64c91b08
Create Date: 2026-09-08

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "b7c41d9e2f08"
down_revision: Union[str, Sequence[str], None] = "f33a64c91b08"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "early_access_signups",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "email",
            sa.String(length=320),
            nullable=False,
        ),
        sa.Column(
            "source",
            sa.String(length=64),
            server_default="maintenance",
            nullable=False,
        ),
        sa.Column(
            "referrer",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_early_access_signups_id",
        "early_access_signups",
        ["id"],
    )

    # Unique: the repository relies on this index for ON CONFLICT DO NOTHING,
    # so a resubmitted address is a no-op instead of an IntegrityError.
    op.create_index(
        "ix_early_access_signups_email",
        "early_access_signups",
        ["email"],
        unique=True,
    )

    op.create_index(
        "ix_early_access_signups_source",
        "early_access_signups",
        ["source"],
    )

    op.create_index(
        "ix_early_access_signups_created_at",
        "early_access_signups",
        ["created_at"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_early_access_signups_created_at",
        table_name="early_access_signups",
    )

    op.drop_index(
        "ix_early_access_signups_source",
        table_name="early_access_signups",
    )

    op.drop_index(
        "ix_early_access_signups_email",
        table_name="early_access_signups",
    )

    op.drop_index(
        "ix_early_access_signups_id",
        table_name="early_access_signups",
    )

    op.drop_table("early_access_signups")
