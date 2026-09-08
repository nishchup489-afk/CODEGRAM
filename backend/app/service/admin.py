"""Compatibility facade for the admin repository."""

from app.repository import admin as _repository
from app.utility.module_exports import export_defined_symbols

__all__ = export_defined_symbols(globals(), _repository)
