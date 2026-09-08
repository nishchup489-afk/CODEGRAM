from types import ModuleType
from typing import Any


def export_defined_symbols(
    namespace: dict[str, Any],
    module: ModuleType,
    *,
    private: tuple[str, ...] = (),
) -> list[str]:
    """Expose symbols defined by another module without leaking its imports."""
    names = [
        name
        for name, value in vars(module).items()
        if not name.startswith("_")
        and getattr(value, "__module__", None) == module.__name__
    ]
    names.extend(name for name in private if hasattr(module, name))
    for name in names:
        namespace[name] = getattr(module, name)
    return sorted(set(names))
