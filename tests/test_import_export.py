"""Full archive import and export tests."""

import ast
import asyncio
from io import BytesIO
import json
from pathlib import Path
import zipfile

import pytest

from custom_components.tasks.archive_converter import (
    ARCHIVE_FORMAT,
    upgrade_archive_manifest,
)
from custom_components.tasks.attachment_api import _build_archive, _parse_archive
from custom_components.tasks.task_store import TasksStore


class FakeHass:
    async def async_add_executor_job(self, function, *args):
        return function(*args)


class MemoryStore:
    async def async_save(self, data):
        self.data = data


class FailingStore:
    async def async_save(self, data):
        raise RuntimeError("save failed")


def archive_task(task_id: str, task_name: str) -> dict:
    return {
        "task_id": task_id,
        "task_name": task_name,
        "task_description": None,
        "assignee_id": None,
        "label_ids": [],
        "nfc_tag_id": None,
        "task_due": "2026-07-24",
        "schedule_start_date": None,
        "schedule_anchor_date": "2026-07-24",
        "schedule_type": "sliding",
        "schedule_unit": "monthly",
        "schedule_interval": 1,
        "schedule_weekdays": [],
        "schedule_day": None,
        "schedule_month": None,
    }


def archive_store(tmp_path: Path) -> TasksStore:
    store = TasksStore.__new__(TasksStore)
    store._hass = FakeHass()
    store._store = MemoryStore()
    store._upload_dir = tmp_path / "uploads"
    store._lock = asyncio.Lock()
    store._data = {
        "tasks": [archive_task("task-1", "Bins")],
        "history": {"task-1": [{"history_entry_id": "history-1"}]},
        "attachments": [{"attachment_id": "file-1", "task_id": "task-1", "size": 7}],
    }
    store._upload_dir.mkdir(parents=True)
    (store._upload_dir / "file-1").write_bytes(b"content")
    return store


def test_export_and_import_preserve_existing_data_and_add_new_tasks(tmp_path):
    async def run():
        source = archive_store(tmp_path / "source")
        source._data["tasks"][0]["task_name"] = "Imported conflict"
        source._data["tasks"].append(archive_task("task-2", "New task"))
        source._data["history"]["task-2"] = [{"history_entry_id": "history-2"}]
        source._data["attachments"].append(
            {"attachment_id": "file-2", "task_id": "task-2", "size": 3}
        )
        source._data["attachments"].append(
            {"attachment_id": "file-3", "task_id": "task-2", "size": 5}
        )
        (source._upload_dir / "file-2").write_bytes(b"new")
        (source._upload_dir / "file-3").write_bytes(b"added")
        data, files = await source.async_export_archive()

        target = archive_store(tmp_path / "target")
        target._data["tasks"][0]["task_name"] = "Existing data"
        (target._upload_dir / "file-2").write_bytes(b"keep")
        (target._upload_dir / "obsolete").write_bytes(b"old")
        await target.async_import_archive(data, files)

        assert [
            (task["task_id"], task["task_name"]) for task in target._data["tasks"]
        ] == [
            ("task-1", "Existing data"),
            ("task-2", "New task"),
        ]
        assert target._data["tasks"][1] == source._data["tasks"][1]
        assert target._data["history"]["task-1"] == [
            {"history_entry_id": "history-1"}
        ]
        assert target._data["history"]["task-2"] == [
            {"history_entry_id": "history-2"}
        ]
        assert target._data["attachments"] == [
            {"attachment_id": "file-1", "task_id": "task-1", "size": 7},
            {"attachment_id": "file-3", "task_id": "task-2", "size": 5},
        ]
        assert target._store.data == target._data
        assert sorted(path.name for path in target._upload_dir.iterdir()) == [
            "file-1", "file-2", "file-3", "obsolete"
        ]
        assert (target._upload_dir / "file-1").read_bytes() == b"content"
        assert (target._upload_dir / "file-2").read_bytes() == b"keep"
        assert (target._upload_dir / "file-3").read_bytes() == b"added"

    asyncio.run(run())


def test_import_removes_only_new_files_when_store_save_fails(tmp_path):
    async def run():
        source = archive_store(tmp_path / "source")
        source._data["tasks"].append(archive_task("task-2", "New task"))
        source._data["history"]["task-2"] = []
        source._data["attachments"].append(
            {"attachment_id": "file-2", "task_id": "task-2", "size": 3}
        )
        (source._upload_dir / "file-2").write_bytes(b"new")
        data, files = await source.async_export_archive()

        target = archive_store(tmp_path / "target")
        target._store = FailingStore()
        old_data = target._data

        with pytest.raises(RuntimeError, match="save failed"):
            await target.async_import_archive(data, files)

        assert target._data is old_data
        assert (target._upload_dir / "file-1").read_bytes() == b"content"
        assert not (target._upload_dir / "file-2").exists()

    asyncio.run(run())


def test_attachment_write_failure_removes_partial_import_only(tmp_path):
    store = archive_store(tmp_path)
    (store._upload_dir / "conflict").write_bytes(b"keep")

    with pytest.raises(FileExistsError):
        store._write_attachment_files(
            {"new-file": b"new", "conflict": b"replacement"}
        )

    assert not (store._upload_dir / "new-file").exists()
    assert (store._upload_dir / "conflict").read_bytes() == b"keep"


@pytest.mark.parametrize("file_id", ["", ".", "..", "../file", r"..\file"])
def test_attachment_paths_reject_unsafe_ids(tmp_path, file_id):
    with pytest.raises(ValueError, match="invalid_attachment_id"):
        archive_store(tmp_path).file_path(file_id)


def test_archive_helpers_round_trip_and_views_offload_zip_work():
    data = {
        "tasks": [archive_task("task-1", "Bins")],
        "history": {},
        "attachments": [
            {"attachment_id": "file-1", "task_id": "task-1", "size": 7}
        ],
    }
    content = _build_archive(data, {"file-1": b"content"})

    assert _parse_archive(content) == (data, {"file-1": b"content"})
    with zipfile.ZipFile(BytesIO(content)) as archive:
        manifest = json.loads(archive.read("tasks.json"))
    assert manifest == {
        "integration": "tasks",
        "format": 2,
        "data": data,
    }

    source = Path("custom_components/tasks/attachment_api.py").read_text(encoding="utf-8")
    tree = ast.parse(source)
    archive_view = next(
        node
        for node in tree.body
        if isinstance(node, ast.ClassDef) and node.name == "ArchiveView"
    )
    methods = {
        node.name: ast.unparse(node)
        for node in archive_view.body
        if isinstance(node, ast.AsyncFunctionDef)
    }
    assert "async_add_executor_job(_build_archive" in methods["get"]
    assert "post" not in methods


def test_archive_parser_treats_task_records_as_opaque():
    data = {
        "tasks": [{"future_schema": True}],
        "history": {},
        "attachments": [],
    }

    assert _parse_archive(_build_archive(data, {})) == (data, {})


def test_archive_converter_upgrades_format_1_without_mutating_data():
    data = {"tasks": [], "history": {}, "attachments": []}
    legacy = {"format": 1, "data": data}

    upgraded = upgrade_archive_manifest(legacy)

    assert upgraded == {
        "integration": "tasks",
        "format": ARCHIVE_FORMAT,
        "data": data,
    }
    assert legacy == {"format": 1, "data": data}


def test_archive_parser_imports_format_1():
    data = {
        "tasks": [archive_task("task-1", "Bins")],
        "history": {},
        "attachments": [],
    }
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr("tasks.json", json.dumps({"format": 1, "data": data}))

    assert _parse_archive(output.getvalue()) == (data, {})


@pytest.mark.parametrize(
    ("manifest", "error"),
    [
        (
            {
                "integration": "other",
                "format": 2,
                "data": {"tasks": [], "history": {}, "attachments": []},
            },
            "invalid_archive_integration",
        ),
        (
            {
                "format": 1,
                "unexpected": True,
                "data": {"tasks": [], "history": {}, "attachments": []},
            },
            "invalid_archive",
        ),
        (
            {
                "integration": "tasks",
                "format": 3,
                "data": {"tasks": [], "history": {}, "attachments": []},
            },
            "unsupported_archive_format",
        ),
        (
            {
                "integration": "tasks",
                "format": 2,
                "data": {"tasks": {}, "history": {}, "attachments": []},
            },
            "invalid_archive",
        ),
    ],
)
def test_archive_parser_validates_only_manifest_envelope(manifest, error):
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr("tasks.json", json.dumps(manifest))

    with pytest.raises(ValueError, match=error):
        _parse_archive(output.getvalue())


def test_archive_parser_rejects_legacy_manifest_name():
    """The Tasks rename intentionally has no backup migration path."""
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr(
            "home-tasker.json",
            json.dumps({"format": 1, "data": {"tasks": [], "history": {}, "attachments": []}}),
        )

    with pytest.raises(ValueError, match="invalid_archive"):
        _parse_archive(output.getvalue())
