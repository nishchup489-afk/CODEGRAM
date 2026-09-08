"""Compatibility facade for the live-project repository."""

from app.repository import live_projects as _repository
from app.utility.module_exports import export_defined_symbols


__all__ = export_defined_symbols(
    globals(),
    _repository,
    private=(
        "_can_view_live_project",
        "_get_visible_live_project_by_slug",
        "_live_project_visibility_clause",
        "_require_journal_project_visibility",
    ),
)
