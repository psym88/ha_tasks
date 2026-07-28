"""Translation catalog consistency tests."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).parents[1]
COMPONENT = ROOT / "custom_components" / "tasks"
FRONTEND_SOURCE = COMPONENT / "frontend"
TRANSLATIONS = COMPONENT / "translations"

_DYNAMIC_FRONTEND_KEYS = {
    "notification.due_message",
    "notification.due_title",
    "notification.problem_message",
    "notification.problem_title",
    "schedule.period_day",
    "schedule.period_days",
    "schedule.period_month",
    "schedule.period_months",
    "schedule.period_week",
    "schedule.period_weeks",
    "schedule.period_year",
    "schedule.period_years",
}


def _catalog(language: str) -> dict[str, str]:
    path = TRANSLATIONS / f"{language}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return {
        key.removeprefix("ui_").replace("_", ".", 1): value
        for key, value in data["common"].items()
        if key.startswith("ui_")
    }


def _used_frontend_keys() -> set[str]:
    source = "\n".join(
        path.read_text(encoding="utf-8")
        for path in FRONTEND_SOURCE.glob("*.js")
    )
    return set(
        re.findall(r'["\']([a-z0-9_]+\.[a-z0-9_]+)["\']', source)
    )


def _backend_error_codes() -> set[str]:
    source = "\n".join(
        path.read_text(encoding="utf-8") for path in COMPONENT.glob("*.py")
    )
    return set(re.findall(r'(?:ValueError|send_error)\(\s*(?:msg\["id"\],\s*)?"([^"]+)"', source))


def test_language_catalogs_have_identical_frontend_keys() -> None:
    assert set(_catalog("de")) == set(_catalog("en"))


def test_home_assistant_catalogs_contain_ui_strings_as_common_keys() -> None:
    for language in ("de", "en"):
        data = json.loads(
            (TRANSLATIONS / f"{language}.json").read_text(encoding="utf-8")
        )
        assert set(data) == {"common", "config", "entity"}
        assert all(key.startswith("ui_") for key in data["common"])


def test_all_frontend_translation_keys_exist() -> None:
    assert _used_frontend_keys() <= set(_catalog("en"))


def test_frontend_catalog_has_no_unused_keys() -> None:
    dynamic = _DYNAMIC_FRONTEND_KEYS | {
        f"error.{code}" for code in _backend_error_codes()
    }
    assert set(_catalog("en")) <= _used_frontend_keys() | dynamic


def test_backend_error_codes_are_translated() -> None:
    ignored = {"task_id_required"}
    expected = {f"error.{code}" for code in _backend_error_codes() - ignored}
    assert expected <= set(_catalog("en"))
