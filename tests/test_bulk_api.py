"""Tests for the transactional bulk WebSocket command."""

import asyncio
from datetime import datetime, timezone
from inspect import unwrap
from types import SimpleNamespace

from custom_components.tasks import task_api


def test_bulk_command_passes_one_validated_operation_set(monkeypatch):
    class Manager:
        async def async_bulk_mutate(
            self,
            operations,
            user_id,
            user_name,
            now,
            *,
            context,
        ):
            self.received = (
                operations,
                user_id,
                user_name,
                now,
                context,
            )
            return [
                {
                    "action": "update",
                    "task_id": "task-1",
                    "task": {"task_id": "task-1", "active": False},
                }
            ]

    async def run():
        manager = Manager()
        context = object()
        results = []
        connection = SimpleNamespace(
            user=SimpleNamespace(id="user-1", name="Alex"),
            context=lambda msg: context,
            send_result=lambda message_id, result: results.append(
                (message_id, result)
            ),
            send_error=lambda *args: None,
        )
        now = datetime(2026, 7, 27, 10, tzinfo=timezone.utc)
        monkeypatch.setattr(task_api.dt_util, "utcnow", lambda: now)
        operations = [
            {
                "action": "update",
                "task_id": "task-1",
                "changes": {"active": False},
            }
        ]

        await unwrap(task_api.ws_task_bulk)(
            SimpleNamespace(),
            connection,
            {
                "id": 9,
                "type": "tasks/task/bulk",
                "operations": operations,
            },
            manager,
        )

        assert manager.received == (
            operations,
            "user-1",
            "Alex",
            now,
            context,
        )
        assert results == [
            (
                9,
                {
                    "results": [
                        {
                            "action": "update",
                            "task_id": "task-1",
                            "task": {"task_id": "task-1", "active": False},
                        }
                    ]
                },
            )
        ]

    asyncio.run(run())
