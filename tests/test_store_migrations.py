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


def test_current_schema_is_the_only_runtime_transport_shape():
    store = TasksStore.__new__(TasksStore)
    store._data = _fixture(STORAGE_VERSION)["data"]

    snapshot = store.snapshot()

    assert snapshot["tasks"][0]["id"] == "task-1"
    assert snapshot["tasks"][0]["schedule"]["type"] == "fixed"
    assert snapshot["tasks"][0]["notification"]["device_ids"] == []
    assert snapshot["tasks"][0]["attachments"] == [
        {
            "id": "attachment-1",
            "filename": "manual.pdf",
            "content_type": "application/pdf",
            "size": 42,
            "uploaded_at": "2026-07-20T10:00:00+00:00",
        }
    ]
    assert store.history("task-1")[0]["id"] == "history-1"


def test_schema_six_removes_every_unknown_field():
    source = _fixture(5)["data"]
    migrated = upgrade_store_data(5, source)

    assert "extra" not in migrated["tasks"][0]
    expected = _fixture(6)["data"]
    assert migrated == expected


def test_version_one_wrapper_preserves_data_written_before_version_bump():
    """A mislabeled aggregate is normalized by the converter chain."""
    current = _fixture(STORAGE_VERSION)["data"]
    current["tasks"][0]["active"] = False
    current["tasks"][0]["schedule_time"] = "08:30"

    expected = _fixture(STORAGE_VERSION)["data"]
    expected["tasks"][0]["active"] = False
    assert upgrade_store_data(1, current) == expected


@pytest.mark.parametrize("version", [0, STORAGE_VERSION + 1])
def test_store_migration_rejects_unsupported_versions(version):
    with pytest.raises(ValueError, match="unsupported_store_version"):
        upgrade_store_data(version, {})
