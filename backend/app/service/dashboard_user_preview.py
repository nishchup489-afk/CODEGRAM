"""Compatibility facade for the dashboard-preview repository."""

from app.repository import dashboard_user_preview as _repository
from app.utility.module_exports import export_defined_symbols

__all__ = export_defined_symbols(globals(), _repository)
