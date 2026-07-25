"""Tests for declarative task field handling."""

import pytest
import voluptuous as vol

from custom_components.tasks.task_fields import (
    api_task_fields,
    normalize_task_fields,
)


def test_create_and_update_schemas_come_from_the_same_field_registry():
    create = {key.schema: key for key in api_task_fields()}
    update = {key.schema: key for key in api_task_fields(update=True)}

    assert set(create) == set(update)
    assert isinstance(create["task_name"], vol.Required)
    assert isinstance(create["schedule_type"], vol.Required)
    assert isinstance(update["task_name"], vol.Optional)
    assert isinstance(update["schedule_type"], vol.Optional)


def test_task_field_normalization_applies_defaults_and_compacts_values():
    values = normalize_task_fields(
        {
            "task_name": "  Filter maintenance  ",
            "label_ids": ["filter", "filter"],
            "notification_target": {"device_id": ["phone", "phone"]},
            "notification_route": " /todo ",
        },
        include_defaults=True,
    )

    assert values["task_name"] == "Filter maintenance"
    assert values["label_ids"] == ["filter"]
    assert values["notification_target"] == {"device_id": ["phone"]}
    assert values["notification_persistent"] is False
    assert values["notification_route"] == "/todo"


def test_task_field_normalization_enforces_required_create_values():
    with pytest.raises(ValueError, match="name_required"):
        normalize_task_fields({}, include_defaults=True)
