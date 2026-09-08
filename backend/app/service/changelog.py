"""Compatibility facade for the changelog repository."""

from app.repository import changelog as _repository
from app.utility.module_exports import export_defined_symbols

__all__ = export_defined_symbols(globals(), _repository)
