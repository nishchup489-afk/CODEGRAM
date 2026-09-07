"""add query scalability indexes

Revision ID: f33a64c91b08
Revises: 901d70fb62e4
Create Date: 2026-09-07

"""
from typing import Sequence, Union

from alembic import op


revision: str = "f33a64c91b08"
down_revision: Union[str, Sequence[str], None] = "901d70fb62e4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # pg_trgm supports indexed contains matching for user discovery. Keep the
    # extension on downgrade because another application object may use it.
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    op.execute(
        """
        CREATE INDEX ix_users_username_lower_trgm
        ON users USING gin (username_lower gin_trgm_ops)
        """
    )
    op.execute(
        """
        CREATE INDEX ix_users_display_name_lower_trgm
        ON users USING gin (lower(display_name) gin_trgm_ops)
        WHERE display_name IS NOT NULL
        """
    )
    op.execute(
        """
        CREATE INDEX ix_users_public_search_rank
        ON users (followers_count DESC, created_at DESC)
        WHERE is_active = true AND is_banned = false AND is_private = false
        """
    )

    op.execute(
        """
        CREATE INDEX ix_projects_created_at_id
        ON projects (created_at DESC, id DESC)
        """
    )
    op.execute(
        """
        CREATE INDEX ix_projects_user_created_at
        ON projects (user_id, created_at DESC)
        """
    )
    op.create_index(
        "ix_project_stars_project_user",
        "project_stars",
        ["project_id", "user_id"],
    )
    op.create_index(
        "ix_project_bookmarks_project_user",
        "project_bookmarks",
        ["project_id", "user_id"],
    )
    op.execute(
        """
        CREATE INDEX ix_project_comments_visible_thread
        ON project_comments (project_id, parent_id, created_at DESC)
        WHERE deleted_at IS NULL
        """
    )
    op.execute(
        """
        CREATE INDEX ix_live_projects_visible_feed
        ON live_projects (created_at DESC, id DESC)
        WHERE is_public = true AND is_draft = false
        """
    )
    op.execute(
        """
        CREATE INDEX ix_feed_events_public_created_at_id
        ON feed_events (created_at DESC, id DESC)
        WHERE is_public = true
        """
    )


def downgrade() -> None:
    op.drop_index("ix_feed_events_public_created_at_id", table_name="feed_events")
    op.drop_index("ix_live_projects_visible_feed", table_name="live_projects")
    op.drop_index("ix_project_comments_visible_thread", table_name="project_comments")
    op.drop_index("ix_project_bookmarks_project_user", table_name="project_bookmarks")
    op.drop_index("ix_project_stars_project_user", table_name="project_stars")
    op.drop_index("ix_projects_user_created_at", table_name="projects")
    op.drop_index("ix_projects_created_at_id", table_name="projects")
    op.drop_index("ix_users_public_search_rank", table_name="users")
    op.drop_index("ix_users_display_name_lower_trgm", table_name="users")
    op.drop_index("ix_users_username_lower_trgm", table_name="users")
