"""Regression tests for every published Tasks store schema."""

import asyncio
import json
from pathlib import Path

import pytest

from custom_components.tasks.const import STORAGE_KEY, STORAGE_VERSION
from custom_components.tasks.migrations import STORE_UPGRADES, upgrade_store_data
from custom_components.tasks.repository import _TasksDataStore
from custom_components.tasks.task_store import TasksStore


FIXTURES = Path(__file__).parent / "fixtures"


def _fixture(version: int) -> dict:
    return json.loads((FIXTURES / f"store_v{version}.json").read_text())


def test_store_migration_chain_and_fixtures_cover_every_version():
    """A version bump cannot omit its converter or representative fixture."""
    assert set(STORE_UPGRADES) == set(range(1, STORAGE_VERSION))
    assert {
        int(path.stem.removeprefix("store_v"))
        for path in FIXTURES.glob("store_v*.json")
    } == set(range(1, STORAGE_VERSION + 1))


@pytest.mark.parametrize("source_version", range(1, STORAGE_VERSION + 1))
def test_every_published_store_version_upgrades_to_current(source_version):
    """Tasks, history, and attachment metadata survive all upgrade paths."""
    source = _fixture(source_version)
    current = _fixture(STORAGE_VERSION)

    assert source["version"] == source_version
    assert source["key"] == STORAGE_KEY
    assert upgrade_store_data(source_version, source["data"]) == current["data"]


def test_home_assistant_store_uses_the_tasks_migration_chain():
    """The Store hook delegates old on-disk data to the tested converters."""
    source = _fixture(1)
    current = _fixture(STORAGE_VERSION)
    store = _TasksDataStore.__new__(_TasksDataStore)

    migrated = asyncio.run(
        store._async_migrate_func(
            source["version"], source["minor_version"], source["data"]
        )
    )

    assert migrated == current["data"]


def test_schema_four_projects_the_existing_transport_shape():
    """Current clients keep flat tasks and globally listed attachments."""
    store = TasksStore.__new__(TasksStore)
    store._data = _fixture(4)["data"]

    snapshot = store.snapshot()

    assert snapshot["tasks"][0]["task_id"] == "task-1"
    assert snapshot["tasks"][0]["schedule_type"] == "fixed"
    assert snapshot["tasks"][0]["notification_target"] == {}
    assert snapshot["attachments"] == [
        {
            "attachment_id": "attachment-1",
            "task_id": "task-1",
            "filename": "manual.pdf",
            "content_type": "application/pdf",
            "size": 42,
            "uploaded_at": "2026-07-20T10:00:00+00:00",
        }
    ]
    assert store.history("task-1")[0]["history_entry_id"] == "history-1"


def test_version_one_wrapper_preserves_data_written_before_version_bump():
    """Recent V1 files may already contain fields introduced before this fix."""
    current = _fixture(STORAGE_VERSION)["data"]
    current["tasks"][0]["active"] = False
    current["tasks"][0]["schedule_time"] = "08:30"

    assert upgrade_store_data(1, current) == current


@pytest.mark.parametrize("version", [0, STORAGE_VERSION + 1])
def test_store_migration_rejects_unsupported_versions(version):
    with pytest.raises(ValueError, match="unsupported_store_version"):
        upgrade_store_data(version, {})
