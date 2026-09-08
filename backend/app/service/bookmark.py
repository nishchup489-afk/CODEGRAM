"""Compatibility facade for the bookmark repository."""

from app.repository import bookmark as _repository
from app.utility.module_exports import export_defined_symbols

__all__ = export_defined_symbols(globals(), _repository)
