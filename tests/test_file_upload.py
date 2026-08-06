"""Tasks-owned temporary file upload tests."""

import asyncio
from types import SimpleNamespace
from uuid import uuid4

import pytest

from aiohttp import web

from custom_components.tasks import attachment_api
from custom_components.tasks.attachment_api import (
    PendingUpload,
    TemporaryUploads,
)


def test_temporary_upload_is_consumed_by_its_owner_and_removed(tmp_path):
    file_id = uuid4().hex
    filename = "manual.pdf"
    upload_dir = tmp_path / file_id
    upload_dir.mkdir()
    path = upload_dir / filename
    path.write_bytes(b"document")
    hass = SimpleNamespace(
        async_add_executor_job=lambda target, *args: asyncio.to_thread(
            target, *args
        )
    )
    uploads = TemporaryUploads(hass, tmp_path)
    uploads.files[file_id] = PendingUpload(
        filename, "application/pdf", path, "user-1"
    )

    async def run():
        assert await uploads.async_consume([file_id], "user-1") == [
            (filename, "application/pdf", b"document")
        ]

    asyncio.run(run())
    assert file_id not in uploads.files
    assert not upload_dir.exists()


def test_temporary_upload_cannot_be_consumed_by_another_user(tmp_path):
    file_id = uuid4().hex
    path = tmp_path / file_id / "manual.pdf"
    path.parent.mkdir()
    path.write_bytes(b"document")
    hass = SimpleNamespace(
        async_add_executor_job=lambda target, *args: asyncio.to_thread(
            target, *args
        )
    )
    uploads = TemporaryUploads(hass, tmp_path)
    uploads.files[file_id] = PendingUpload(
        "manual.pdf", "application/pdf", path, "user-1"
    )

    async def run():
        with pytest.raises(ValueError, match="invalid_upload"):
            await uploads.async_consume([file_id], "user-2")

    asyncio.run(run())
    assert file_id in uploads.files
    assert path.exists()


def test_attachment_upload_rejects_oversize_file_and_removes_partial_file(
    tmp_path, monkeypatch
):
    class Upload:
        headers = {}

        def __init__(self):
            self.chunks = iter((b"1234", b"5678"))

        async def read_chunk(self, _size):
            return next(self.chunks, b"")

    monkeypatch.setattr(attachment_api, "MAX_ATTACHMENT_SIZE", 7)
    hass = SimpleNamespace(
        async_add_executor_job=lambda target, *args: asyncio.to_thread(
            target, *args
        )
    )
    uploads = TemporaryUploads(hass, tmp_path)

    async def run():
        with pytest.raises(web.HTTPRequestEntityTooLarge):
            await uploads.async_store(Upload(), "manual.pdf", "user-1")

    asyncio.run(run())
    assert uploads.files == {}
    assert list(tmp_path.iterdir()) == []


def test_temporary_upload_cleanup_schedules_executor_job_directly(
    tmp_path, monkeypatch
):
    """Shutdown cleanup does not wrap an executor Future as a coroutine."""
    listeners = []
    jobs = []
    monkeypatch.setattr(attachment_api.tempfile, "gettempdir", lambda: tmp_path)

    class Hass:
        bus = SimpleNamespace(
            async_listen_once=lambda _event, listener: listeners.append(listener)
        )

        def async_add_executor_job(self, target, *args):
            jobs.append((target, args))
            return asyncio.get_running_loop().run_in_executor(
                None, target, *args
            )

        def async_create_task(self, _target):
            pytest.fail("executor Future was passed to async_create_task")

    async def run():
        uploads = await TemporaryUploads.async_create(Hass())
        listeners[0](None)
        await asyncio.sleep(0)
        return uploads

    uploads = asyncio.run(run())

    assert uploads.root == tmp_path / "home-assistant-tasks-upload"
    assert jobs[-1] == (attachment_api.shutil.rmtree, (uploads.root, True))
