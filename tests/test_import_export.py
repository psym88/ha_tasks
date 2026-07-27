"""Full archive import and export tests."""

import ast
import asyncio
from io import BytesIO
import json
from pathlib import Path
import zipfile

import pytest

from custom_components.tasks.migrations import (
    ARCHIVE_FORMAT,
    upgrade_archive_manifest,
)
from custom_components.tasks.attachment_api import (
    archive_error_code,
    _build_archive,
    _parse_archive_file_with_report,
    _parse_archive_manifest,
)
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


def parse_archive_manifest(content: bytes):
    with zipfile.ZipFile(BytesIO(content)) as archive:
        data, items, conversions = _parse_archive_manifest(archive)
    return data, [item.filename for item in items], conversions


@pytest.mark.parametrize(
    ("error", "code"),
    [
        ("invalid_archive_integration", "invalid_archive_integration"),
        ("unexpected_internal_detail", "invalid_archive"),
    ],
)
def test_archive_import_preserves_readable_error_codes(error, code):
    assert archive_error_code(ValueError(error)) == code


def archive_task(task_id: str, task_name: str) -> dict:
    return {
        "task_id": task_id,
        "task_name": task_name,
        "task_description": None,
        "assignee_id": None,
        "label_ids": [],
        "nfc_tag_id": None,
        "task_due": "2026-07-24T10:15:00+00:00",
        "schedule_type": "sliding",
        "schedule_unit": "monthly",
        "schedule_interval": 1,
        "schedule_weekdays": [],
        "schedule_day": None,
        "schedule_month": None,
    }


def archive_store(tmp_path: Path) -> TasksStore:
    repository = TasksRepository(
        FakeHass(), tmp_path / "uploads", store=MemoryStore()
    )
    store = TasksStore(repository=repository)
    store._data = {
        "tasks": [
            store._aggregate_from_fields(
                archive_task("task-1", "Bins"),
                [{"history_entry_id": "history-1"}],
                [
                    {
                        "attachment_id": "file-1",
                        "task_id": "task-1",
                        "size": 7,
                    }
                ],
            )
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
            source._aggregate_from_fields(
                archive_task("task-2", "New task"),
                [{"history_entry_id": "history-2"}],
                [
                    {
                        "attachment_id": "file-2",
                        "task_id": "task-2",
                        "size": 3,
                    },
                    {
                        "attachment_id": "file-3",
                        "task_id": "task-2",
                        "size": 5,
                    },
                ],
            )
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
            {"id": "history-1"}
        ]
        assert target._data["tasks"][1]["completions"] == [
            {"id": "history-2"}
        ]
        assert target.snapshot()["attachments"] == [
            {"attachment_id": "file-1", "task_id": "task-1", "size": 7},
            {"attachment_id": "file-3", "task_id": "task-2", "size": 5},
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
            source._aggregate_from_fields(
                archive_task("task-2", "New task"),
                [],
                [
                    {
                        "attachment_id": "file-2",
                        "task_id": "task-2",
                        "size": 3,
                    }
                ],
            )
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
    data = {
        "tasks": [archive_task("task-1", "Bins")],
        "history": {},
        "attachments": [
            {"attachment_id": "file-1", "task_id": "task-1", "size": 7}
        ],
    }
    content = _build_archive(data, {"file-1": b"content"})

    archive_path = tmp_path / "tasks.zip"
    staging_dir = tmp_path / "staging"
    archive_path.write_bytes(content)
    staging_dir.mkdir()
    parsed, staged_files, report = _parse_archive_file_with_report(
        archive_path, staging_dir
    )
    assert parsed == data
    assert report == {"conversions": []}
    assert staged_files["file-1"].read_bytes() == b"content"
    with zipfile.ZipFile(BytesIO(content)) as archive:
        manifest_text = archive.read("tasks.json").decode()
        manifest = json.loads(manifest_text)
    assert manifest == {
        "integration": "tasks",
        "format": 3,
        "data": data,
    }
    assert manifest_text.startswith('{\n  "integration": "tasks",')
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
    assert "_parse_archive_file_with_report" in methods["post"]


def test_archive_parser_treats_task_records_as_opaque():
    data = {
        "tasks": [{"future_schema": True}],
        "history": {},
        "attachments": [],
    }

    assert parse_archive_manifest(_build_archive(data, {})) == (
        data,
        ["tasks.json"],
        [],
    )


def test_archive_migration_upgrades_format_1_without_mutating_data():
    data = {"tasks": [], "history": {}, "attachments": []}
    legacy = {"format": 1, "data": data}

    upgraded = upgrade_archive_manifest(legacy)

    assert upgraded == {
        "integration": "tasks",
        "format": ARCHIVE_FORMAT,
        "data": data,
    }
    assert legacy == {"format": 1, "data": data}


def test_archive_migration_upgrades_format_2_dates_without_adding_active():
    legacy = {
        "integration": "tasks",
        "format": 2,
        "data": {
            "tasks": [
                {
                    "task_id": "task-1",
                    "task_due": "2026-07-22",
                },
                {
                    "task_id": "task-2",
                    "task_due": "2026-07-22T12:15:00+02:00",
                },
            ],
            "history": {
                "task-1": [
                    {
                        "history_entry_id": "history-1",
                        "completion_date": "2026-07-23",
                        "recorded_at": "2026-07-23T12:30:00+02:00",
                        "task_due_before": "2026-07-22",
                        "task_due_after": "2026-08-22",
                    }
                ]
            },
            "attachments": [],
        },
    }

    upgraded = upgrade_archive_manifest(legacy)

    assert upgraded["format"] == 3
    assert upgraded["data"]["tasks"] == [
        {
            "task_id": "task-1",
            "task_due": "2026-07-22T00:00:00+00:00",
        },
        {
            "task_id": "task-2",
            "task_due": "2026-07-22T10:15:00+00:00",
        },
    ]
    assert upgraded["data"]["history"]["task-1"] == [
        {
            "history_entry_id": "history-1",
            "completed_at": "2026-07-23T10:30:00+00:00",
            "task_due_before": "2026-07-22T00:00:00+00:00",
            "task_due_after": "2026-08-22T00:00:00+00:00",
        }
    ]
    assert "active" not in upgraded["data"]["tasks"][0]
    assert legacy["data"]["tasks"][0]["task_due"] == "2026-07-22"
    assert "completion_date" in legacy["data"]["history"]["task-1"][0]


def test_archive_parser_imports_format_1():
    data = {
        "tasks": [archive_task("task-1", "Bins")],
        "history": {},
        "attachments": [],
    }
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr("tasks.json", json.dumps({"format": 1, "data": data}))

    assert parse_archive_manifest(output.getvalue()) == (
        data,
        ["tasks.json"],
        [(1, 2), (2, 3)],
    )


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
                "format": 4,
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
        parse_archive_manifest(output.getvalue())


def test_archive_parser_rejects_legacy_manifest_name():
    """The Tasks rename intentionally has no backup migration path."""
    output = BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr(
            "home-tasker.json",
            json.dumps({"format": 1, "data": {"tasks": [], "history": {}, "attachments": []}}),
        )

    with pytest.raises(ValueError, match="invalid_archive"):
        parse_archive_manifest(output.getvalue())
