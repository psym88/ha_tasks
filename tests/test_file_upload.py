"""Tasks-owned temporary file upload tests."""

import asyncio
from types import SimpleNamespace
from uuid import uuid4

import pytest

from custom_components.tasks.attachment_api import PendingUpload, TemporaryUploads


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
