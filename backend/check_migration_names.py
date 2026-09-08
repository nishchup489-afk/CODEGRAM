"""Enforce readable names for new Alembic migrations.

Historical filenames are immutable because they have already been applied in
production. Their explicit allowlist is the baseline; every new migration must
use ``<12-char revision>_<descriptive_snake_case>.py`` and the filename revision
must match the module's ``revision`` value.
"""

from __future__ import annotations

import ast
import re
from pathlib import Path


VERSIONS_DIRECTORY = Path(__file__).parent / "alembic" / "versions"
LEGACY_FILENAMES = frozenset(
    {
        "00244fc746c3_fixed_bug.py",
        "18de52d74d24_add_bookmarks_and_previous_fix.py",
        "2797d7a9fb2a_add_feed_events.py",
        "2ed7a43da1d6_add_support_tickets.py",
        "3c3bac90387e_upgrade_user_stack_stats.py",
        "508cfe264abc_add_profile_extra_fields.py",
        "54582825b0fb_asjkhdgflk.py",
        "573aa5005d5c_add_is_draft_to_live_projects.py",
        "62b6090822bc_app_notice.py",
        "665d6a2b3657_added_stackkit.py",
        "7d63714b2ea6_asdkfhjg.py",
        "88ad7f2d9c75_added_follower.py",
        "8d1b81672c3e_add_parent_id_to_project_comments.py",
        "901d70fb62e4_make_live_project_slugs_global.py",
        "94b45f32816f_add_bookmarks_and_previous_fix.py",
        "a5731d1d0aee_add_feedback.py",
        "aee49d2d69c3_create_users_table.py",
        "af8fded8d660_asjkhdgfajkshdgf.py",
        "bbbbbba67647_add_bookmarks_and_previous_fix.py",
        "bd7a395fd28f_.py",
        "c84f90a21d6e_reconcile_migration_history.py",
        "dce47bf7e32a_added_clerk_user_id_to_project_stars.py",
        "eb5b75a57565_changelog.py",
        "ed8a89362b40_changelog.py",
        "eed7a116b954_restore_support_tickets.py",
        "f2a3d048005d_added_stackkit.py",
        "f33a64c91b08_add_scalability_indexes.py",
        "fa2514a1f273_add_bookmarks_and_previous_fix.py",
    }
)
MIGRATION_NAME = re.compile(
    r"^(?P<revision>[0-9a-f]{12})_"
    r"(?P<slug>[a-z][a-z0-9]+(?:_[a-z0-9]+)+)\.py$"
)
PLACEHOLDER_WORDS = frozenset({"change", "changes", "fix", "fixed", "migration", "update"})


def _declared_revision(path: Path) -> str | None:
    tree = ast.parse(path.read_text(), filename=str(path))
    for node in tree.body:
        if not isinstance(node, (ast.Assign, ast.AnnAssign)):
            continue
        targets = node.targets if isinstance(node, ast.Assign) else [node.target]
        if not any(isinstance(target, ast.Name) and target.id == "revision" for target in targets):
            continue
        value = node.value
        if isinstance(value, ast.Constant) and isinstance(value.value, str):
            return value.value
    return None


def migration_name_errors(directory: Path = VERSIONS_DIRECTORY) -> list[str]:
    errors: list[str] = []
    for path in sorted(directory.glob("*.py")):
        if path.name == "__init__.py" or path.name in LEGACY_FILENAMES:
            continue
        match = MIGRATION_NAME.fullmatch(path.name)
        if match is None:
            errors.append(
                f"{path.name}: expected <12-char revision>_<descriptive_snake_case>.py"
            )
            continue
        words = match.group("slug").split("_")
        if set(words) <= PLACEHOLDER_WORDS:
            errors.append(f"{path.name}: migration description is too generic")
        declared_revision = _declared_revision(path)
        if declared_revision != match.group("revision"):
            errors.append(
                f"{path.name}: filename revision does not match revision={declared_revision!r}"
            )
    return errors


def main() -> int:
    errors = migration_name_errors()
    if errors:
        print("Migration naming policy failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print("Migration naming policy passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
