"""Translation catalog consistency tests."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).parents[1]
COMPONENT = ROOT / "custom_components" / "tasks"
FRONTEND = COMPONENT / "frontend"
TRANSLATIONS = COMPONENT / "translations"
FRONTEND_TRANSLATIONS = COMPONENT / "frontend_translations"

LOCALIZE_ALIASES = {
    "addTask": "common.add_task",
    "fixed": "task.fixed",
    "sliding": "task.sliding",
    "daily": "task.daily",
    "weekly": "task.weekly",
    "monthly": "task.monthly",
    "yearly": "task.yearly",
    "save": "common.save",
    "files": "task.files",
    "history": "task.history",
    "noFiles": "task.no_files",
    "noHistory": "task.no_history",
}


def _catalog(language: str) -> dict[str, str]:
    path = FRONTEND_TRANSLATIONS / f"{language}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return data["frontend"]


def _used_frontend_keys() -> set[str]:
    source = "\n".join(
        path.read_text(encoding="utf-8") for path in FRONTEND.glob("*.js")
    )
    keys = set(re.findall(r'\b(?:t|tr)\(\s*["\']([^"\']+)["\']', source))
    keys.update(
        LOCALIZE_ALIASES.get(alias, alias)
        for alias in re.findall(r"\bL\.([A-Za-z0-9_]+)", source)
    )
    return keys


def _backend_error_codes() -> set[str]:
    source = "\n".join(
        path.read_text(encoding="utf-8") for path in COMPONENT.glob("*.py")
    )
    return set(re.findall(r'(?:ValueError|send_error)\(\s*(?:msg\["id"\],\s*)?"([^"]+)"', source))


def test_language_catalogs_have_identical_frontend_keys() -> None:
    assert set(_catalog("de")) == set(_catalog("en"))


def test_home_assistant_catalogs_exclude_custom_frontend_keys() -> None:
    for language in ("de", "en"):
        data = json.loads(
            (TRANSLATIONS / f"{language}.json").read_text(encoding="utf-8")
        )
        assert set(data) == {"config", "entity"}


def test_all_frontend_translation_keys_exist() -> None:
    assert _used_frontend_keys() <= set(_catalog("en"))


def test_backend_error_codes_are_translated() -> None:
    ignored = {"task_id_required"}
    expected = {f"error.{code}" for code in _backend_error_codes() - ignored}
    assert expected <= set(_catalog("en"))
