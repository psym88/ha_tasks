"""Full archive import and export tests."""

import ast
import asyncio
from io import BytesIO
import json
from pathlib import Path
import zipfile

import pytest

from custom_components.tasks.attachment_api import (
    archive_error_code,
    _build_archive,
    _parse_archive_file,
    _parse_archive_snapshot,
)
from custom_components.tasks.const import STORAGE_VERSION
from custom_components.tasks.repository import TasksRepository
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


def parse_archive_snapshot(content: bytes):
    with zipfile.ZipFile(BytesIO(content)) as archive:
        data, items = _parse_archive_snapshot(archive)
    return data, [item.filename for item in items]


@pytest.mark.parametrize(
    ("error", "code"),
    [
        ("unsupported_store_version", "unsupported_store_version"),
        ("unexpected_internal_detail", "invalid_archive"),
    ],
)
def test_archive_import_preserves_readable_error_codes(error, code):
    assert archive_error_code(ValueError(error)) == code


def archive_task(task_id: str, task_name: str) -> dict:
    return {
        "id": task_id,
        "name": task_name,
        "icon": None,
        "description": None,
        "active": True,
        "assignee_id": None,
        "label_ids": [],
        "nfc_tag_id": None,
        "due": "2026-07-24T10:15:00+00:00",
        "schedule": {
            "type": "sliding",
            "unit": "monthly",
            "interval": 1,
        },
        "notification": {
            "device_ids": [],
            "persistent": False,
            "critical": False,
            "route": None,
        },
        "completions": [],
        "attachments": [],
    }


def completion(entry_id: str) -> dict:
    return {
        "id": entry_id,
        "completed_at": "2026-07-23T10:15:00+00:00",
        "user_id": None,
        "user_name": "system",
        "notes": None,
    }


def attachment(file_id: str, size: int) -> dict:
    return {
        "id": file_id,
        "filename": f"{file_id}.bin",
        "content_type": "application/octet-stream",
        "size": size,
        "uploaded_at": "2026-07-23T10:15:00+00:00",
    }


def archive_store(tmp_path: Path) -> TasksStore:
    repository = TasksRepository(
        FakeHass(), tmp_path / "uploads", store=MemoryStore()
    )
    store = TasksStore(repository=repository)
    store._data = {
        "tasks": [
            {
                **archive_task("task-1", "Bins"),
                "completions": [completion("history-1")],
                "attachments": [attachment("file-1", 7)],
            }
        ],
    }
    repository.upload_dir.mkdir(parents=True)
    (repository.upload_dir / "file-1").write_bytes(b"content")
    return store


def test_export_and_import_preserve_existing_data_and_add_new_tasks(tmp_path):
    async def run():
        source = archive_store(tmp_path / "source")
        source._data["tasks"][0]["name"] = "Imported conflict"
        source._data["tasks"].append(
            {
                **archive_task("task-2", "New task"),
                "completions": [completion("history-2")],
                "attachments": [
                    attachment("file-2", 3),
                    attachment("file-3", 5),
                ],
            }
        )
        (source._repository.upload_dir / "file-2").write_bytes(b"new")
        (source._repository.upload_dir / "file-3").write_bytes(b"added")
        data, files = await source.async_export_archive()

        target = archive_store(tmp_path / "target")
        target._data["tasks"][0]["name"] = "Existing data"
        (target._repository.upload_dir / "file-2").write_bytes(b"keep")
        (target._repository.upload_dir / "obsolete").write_bytes(b"old")
        report = await target.async_import_archive(data, files)

        assert [
            (task["id"], task["name"]) for task in target._data["tasks"]
        ] == [
            ("task-1", "Existing data"),
            ("task-2", "New task"),
        ]
        assert {
            key: value
            for key, value in target._data["tasks"][1].items()
            if key != "attachments"
        } == {
            key: value
            for key, value in source._data["tasks"][1].items()
            if key != "attachments"
        }
        assert target._data["tasks"][0]["completions"] == [
            completion("history-1")
        ]
        assert target._data["tasks"][1]["completions"] == [
            completion("history-2")
        ]
        assert target.snapshot()["tasks"][0]["attachments"] == [
            attachment("file-1", 7)
        ]
        assert target.snapshot()["tasks"][1]["attachments"] == [
            attachment("file-3", 5)
        ]
        assert target._repository.store.data == target._data
        assert sorted(
            path.name for path in target._repository.upload_dir.iterdir()
        ) == [
            "file-1", "file-2", "file-3", "obsolete"
        ]
        assert (
            target._repository.upload_dir / "file-1"
        ).read_bytes() == b"content"
        assert (
            target._repository.upload_dir / "file-2"
        ).read_bytes() == b"keep"
        assert (
            target._repository.upload_dir / "file-3"
        ).read_bytes() == b"added"
        assert report == {
            "tasks_imported": 1,
            "tasks_skipped": ["Imported conflict"],
            "history_entries_imported": 1,
            "attachments_imported": 1,
            "attachments_skipped": 2,
        }

    asyncio.run(run())


def test_import_removes_only_new_files_when_store_save_fails(tmp_path):
    async def run():
        source = archive_store(tmp_path / "source")
        source._data["tasks"].append(
            {
                **archive_task("task-2", "New task"),
                "attachments": [attachment("file-2", 3)],
            }
        )
        (source._repository.upload_dir / "file-2").write_bytes(b"new")
        data, files = await source.async_export_archive()

        target = archive_store(tmp_path / "target")
        target._repository.store = FailingStore()
        old_data = target._data

        with pytest.raises(RuntimeError, match="save failed"):
            await target.async_import_archive(data, files)

        assert target._data is old_data
        assert (
            target._repository.upload_dir / "file-1"
        ).read_bytes() == b"content"
        assert not (target._repository.upload_dir / "file-2").exists()

    asyncio.run(run())


def test_attachment_write_failure_removes_partial_import_only(tmp_path):
    store = archive_store(tmp_path)
    (store._repository.upload_dir / "conflict").write_bytes(b"keep")

    with pytest.raises(FileExistsError):
        store._repository._write_attachment_files(
            {"new-file": b"new", "conflict": b"replacement"}
        )

    assert not (store._repository.upload_dir / "new-file").exists()
    assert (
        store._repository.upload_dir / "conflict"
    ).read_bytes() == b"keep"


def test_attachment_write_streams_staged_file(tmp_path):
    store = archive_store(tmp_path / "store")
    staged_file = tmp_path / "staged-attachment"
    staged_file.write_bytes(b"staged content")

    store._repository._write_attachment_files({"file-2": staged_file})

    assert (
        store._repository.upload_dir / "file-2"
    ).read_bytes() == b"staged content"


@pytest.mark.parametrize("file_id", ["", ".", "..", "../file", r"..\file"])
def test_attachment_paths_reject_unsafe_ids(tmp_path, file_id):
    with pytest.raises(ValueError, match="invalid_attachment_id"):
        archive_store(tmp_path).file_path(file_id)


def test_archive_helpers_round_trip_and_views_offload_zip_work(tmp_path):
    task = archive_task("task-1", "Bins")
    task["attachments"] = [attachment("file-1", 7)]
    data = {
        "tasks": [task],
    }
    content = _build_archive(data, {"file-1": b"content"})

    archive_path = tmp_path / "tasks.zip"
    staging_dir = tmp_path / "staging"
    archive_path.write_bytes(content)
    staging_dir.mkdir()
    parsed, staged_files = _parse_archive_file(
        archive_path, staging_dir
    )
    assert parsed == data
    assert staged_files["file-1"].read_bytes() == b"content"
    with zipfile.ZipFile(BytesIO(content)) as archive:
        manifest_text = archive.read("tasks.json").decode()
        manifest = json.loads(manifest_text)
    assert manifest == {
        "version": STORAGE_VERSION,
        "data": data,
    }
    assert manifest_text.startswith('{\n  "version": ')
    assert '\n    "tasks": [\n' in manifest_text
    assert len(manifest_text.splitlines()) > 1

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
    assert "request.content.readany()" in methods["post"]
    assert "_parse_archive_file" in methods["post"]


def test_archive_parser_treats_task_records_as_opaque():
    data = {
        "tasks": [{"future_schema": True}],
    }

    assert parse_archive_snapshot(_build_archive(data, {})) == (
        data,
        ["tasks.json"],
    )


def test_archive_parser_uses_store_migrations():
    task = {**archive_task("task-1", "Bins"), "obsolete": True}
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr(
            "tasks.json",
            json.dumps({"version": 5, "data": {"tasks": [task]}}),
        )

    assert parse_archive_snapshot(output.getvalue()) == (
        {"tasks": [archive_task("task-1", "Bins")]},
        ["tasks.json"],
    )


@pytest.mark.parametrize(
    ("snapshot", "error"),
    [
        (
            {"data": {"tasks": []}},
            "invalid_archive",
        ),
        (
            {
                "version": STORAGE_VERSION,
                "unexpected": True,
                "data": {"tasks": []},
            },
            "invalid_archive",
        ),
        (
            {
                "version": STORAGE_VERSION + 1,
                "data": {"tasks": []},
            },
            "unsupported_store_version",
        ),
        (
            {
                "version": STORAGE_VERSION,
                "data": {"tasks": {}},
            },
            "invalid_archive",
        ),
    ],
)
def test_archive_parser_validates_store_snapshot(snapshot, error):
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr("tasks.json", json.dumps(snapshot))

    with pytest.raises(ValueError, match=error):
        parse_archive_snapshot(output.getvalue())


def test_archive_parser_rejects_unexpected_snapshot_name():
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr(
            "store.json",
            json.dumps(
                {
                    "version": STORAGE_VERSION,
                    "data": {"tasks": []},
                }
            ),
        )

    with pytest.raises(ValueError, match="invalid_archive"):
        parse_archive_snapshot(output.getvalue())
