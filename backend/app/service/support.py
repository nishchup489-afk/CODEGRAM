"""Compatibility facade for the support repository."""

from app.repository import support as _repository
from app.utility.module_exports import export_defined_symbols

__all__ = export_defined_symbols(globals(), _repository)
