"""Tests for the transactional task editor command."""

import asyncio
from datetime import datetime, timezone
from inspect import unwrap
from types import SimpleNamespace

from custom_components.tasks import task_api


def test_save_command_consumes_uploads_and_forwards_one_transaction(monkeypatch):
    class Manager:
        async def async_save_task(
            self,
            task_id,
            payload,
            uploads,
            deleted_attachment_ids,
            deleted_history_entry_ids,
            now,
            *,
            context,
        ):
            self.received = (
                task_id,
                payload,
                uploads,
                deleted_attachment_ids,
                deleted_history_entry_ids,
                now,
                context,
            )
            return {"task": {"task_id": task_id}, "attachments": []}

    async def run():
        now = datetime(2026, 7, 27, 10, tzinfo=timezone.utc)
        uploads = [("manual.pdf", "application/pdf", b"document")]
        monkeypatch.setattr(task_api.dt_util, "utcnow", lambda: now)
        monkeypatch.setattr(
            task_api,
            "_read_uploaded_files",
            lambda hass, file_ids: uploads,
        )
        manager = Manager()
        context = object()
        results = []
        hass = SimpleNamespace(
            async_add_executor_job=lambda target, *args: asyncio.to_thread(
                target, *args
            )
        )
        connection = SimpleNamespace(
            context=lambda msg: context,
            send_result=lambda message_id, result: results.append(
                (message_id, result)
            ),
            send_error=lambda *args: None,
        )
        message = {
            "id": 4,
            "type": "tasks/task/save",
            "task_id": "task-1",
            "task_name": "Pump",
            "file_ids": ["upload-1"],
            "deleted_attachment_ids": ["file-1"],
            "deleted_history_entry_ids": ["history-1"],
        }

        await unwrap(task_api.ws_task_save)(
            hass, connection, message, manager
        )

        assert manager.received == (
            "task-1",
            message,
            uploads,
            ["file-1"],
            ["history-1"],
            now,
            context,
        )
        assert results == [
            (
                4,
                {
                    "task": {"task_id": "task-1"},
                    "attachments": [],
                },
            )
        ]

    asyncio.run(run())
