"""Public Tasks event tests."""

from types import SimpleNamespace

from custom_components.tasks.const import EVENT_TASKS
from custom_components.tasks.manager import TaskManager


def test_tasks_event_has_stable_filterable_data():
    fired = []
    context = object()
    hass = SimpleNamespace(
        bus=SimpleNamespace(
            async_fire=lambda event_type, data, context=None: fired.append(
                (event_type, data, context)
            )
        )
    )

    manager = TaskManager(hass, SimpleNamespace())
    manager._changed(
        "completed",
        "task",
        "task-1",
        context=context,
        source="nfc",
    )

    assert fired == [
        (
            EVENT_TASKS,
            {
                "action": "completed",
                "resource_type": "task",
                "resource_id": "task-1",
                "source": "nfc",
            },
            context,
        )
    ]
