"""DevManiac backend application package."""

from importlib import import_module
from types import ModuleType


__all__ = ["api", "core", "main", "models", "router", "schema", "service", "utility"]


def __getattr__(name: str) -> ModuleType:
    """Expose application subpackages without creating eager import cycles."""
    if name not in __all__:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
    module = import_module(f"{__name__}.{name}")
    globals()[name] = module
    return module
