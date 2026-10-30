# Tasks

Tasks adds recurring household tasks to Home Assistant. Tasks can be assigned, scheduled, completed with notes, and linked to files or NFC tags.

[![Open your Home Assistant instance and add this repository to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=psym88&repository=ha_tasks&category=integration)

## Features

- Daily, weekly, monthly, and yearly recurring tasks
- Fixed schedules with a local time, intervals after completion, and Home Assistant template problem triggers
- Preview of the actual upcoming due dates and times calculated from each schedule
- Task pausing from individual and bulk action menus
- Home Assistant user and label assignments, notes, history, and attachments
- Optional NFC tag completion
- Sidebar panel and configurable dashboard card
- Task management through LLM-based Assist agents
- A due-task summary sensor
- Home Assistant events for task, history, and attachment changes
- ZIP backup and restore
- English and German interface

## Installation

Tasks requires Home Assistant 2026.10.0 or newer.

1. Use the button above, or add `https://github.com/psym88/ha_tasks` to HACS as an **Integration** repository.
2. Install Tasks and restart Home Assistant.
3. Open **Settings → Devices & services → Add integration** and select **Tasks**.

Only one Tasks configuration entry can be created.

### Removal

1. Open **Settings → Devices & services**, select **Tasks**, and delete the integration entry.
2. Remove Tasks from HACS.
3. Restart Home Assistant.

Removing the integration does not delete exported backups. Tasks data in `<config>/.storage/tasks` and attachments in `<config>/tasks/uploads` can be removed manually if they are no longer needed.

## Usage

Administrators can open **Tasks** in the sidebar. Use **+ Add task** to create a task. Select a task to view and complete it; use its three-dot menu to pause, resume, edit, or delete it. Paused tasks remain in the task table with a red pause icon and no displayed due value.

The task table supports configurable columns, search, sorting, and filters for assignee, labels, notification targets, recurrence calculation, and rhythm.

Task details show the status, planning, due date and time, assignee, labels,
attachments, completion history, and notes in one dialog.

| Light | Dark |
| --- | --- |
| ![Task list with the task viewer open in light mode](docs/images/task-viewer-desktop-light.png) | ![Task list with the task viewer open in dark mode](docs/images/task-viewer-desktop-dark.png) |

### Creating and editing tasks

Select **+ Add task** to open an empty editor:

| Light | Dark |
| --- | --- |
| ![Empty new-task editor in light mode](docs/images/task-editor-new-desktop-light.png) | ![Empty new-task editor in dark mode](docs/images/task-editor-new-desktop-dark.png) |

The editor groups the settings for an existing task into separate expandable
sections.

#### Description templates

Task descriptions support the same Home Assistant templates as the standard
Markdown dashboard card. Template output is rendered as Markdown and updates
automatically when a referenced entity changes.

For example, a task description can display a separate status based on a sensor
value:

```jinja2
{% if states('sensor.errormessage_thermostat') == 'OK' %}
No errors
{% else %}
Error message: **{{ states('sensor.errormessage_thermostat') }}**
{% endif %}
```

#### Schedule and triggers

A task can follow a fixed calendar schedule, repeat from its last completion,
or become due when a Home Assistant template detects a problem.

| Light | Dark |
| --- | --- |
| ![Expanded task schedule with example data in light mode](docs/images/task-editor-planning-desktop-light.png) | ![Expanded task schedule with example data in dark mode](docs/images/task-editor-planning-desktop-dark.png) |

##### Problem sensor tasks

Home Assistant integrations expose device faults in different ways: as a binary
sensor, readable text, a numeric error code, or separate entities for the code
and its description. Problem sensor tasks handle all of these variants with two
templates:

- **Condition** decides whether a problem is active.
- **Error message** turns the current states into a readable incident message.

For a binary sensor, **Generate from entity** creates the condition
automatically. Custom templates can evaluate text or numeric sensors and combine
multiple entities.

| Light | Dark |
| --- | --- |
| ![Problem sensor editor with an error-code condition in light mode](docs/images/problem-sensor-editor-desktop-light.png) | ![Problem sensor editor with an error-code condition in dark mode](docs/images/problem-sensor-editor-desktop-dark.png) |

For example, assume `sensor.heat_pump_error_code` reports `0` while the heat
pump is healthy and an integration-specific code when a fault occurs:

| Sensor state | Meaning |
| --- | --- |
| `0` | No error |
| `1001` | Overheating |
| `2001` | Excessive current |
| `3001` | Communication fault |

First, the condition identifies every usable non-zero code as a problem:

```jinja2
{% set entity = 'sensor.heat_pump_error_code' %}
{% set code = states(entity) %}
{{ has_value(entity) and code != '0' }}
```

Each part has one purpose:

- `entity` stores the entity ID once so it can be reused.
- `states(entity)` reads the current state as text and stores it in `code`.
- `has_value(entity)` is true only when the entity exists and its state is
  neither `unknown` nor `unavailable`.
- `code != '0'` distinguishes an error code from the healthy state `0`.
- `and` makes the complete condition true only when both checks are true.

This produces the following results:

| Sensor state | Condition result |
| --- | --- |
| `0` | `false` |
| `unknown` | `false` |
| `unavailable` | `false` |
| Any other error code | `true` |

Then the error message template translates the current code and provides a
fallback for codes that have not been documented yet:

```jinja2
{% set errors = {
  '1001': 'Overheating',
  '2001': 'Excessive current',
  '3001': 'Communication fault'
} %}
{% set code = states('sensor.heat_pump_error_code') %}
{{ errors.get(code, 'Unknown heat pump error (code ' ~ code ~ ')') }}
```

If the sensor reports `1001`, the condition becomes true, the task becomes due,
and `Overheating` is stored with the incident:

| Light | Dark |
| --- | --- |
| ![Active heat-pump problem with its translated message in light mode](docs/images/problem-sensor-active-desktop-light.png) | ![Active heat-pump problem with its translated message in dark mode](docs/images/problem-sensor-active-desktop-dark.png) |

The error message is rendered and stored when the task is triggered. It remains
the message that caused this incident even if the sensor changes later. To also
show the current device message, add a separate Home Assistant template to the
task description.

A problem task becomes due when its condition initially evaluates to true or
changes from false to true. Completing it immediately checks the condition
again: a remaining problem opens a new incident with a freshly rendered
message; otherwise the task waits for the next false-to-true change. A warning
icon identifies invalid conditions and missing, unknown, or unavailable
entities. This health warning is refreshed when Home Assistant starts, when a
Tasks client reconnects, and when the task is saved.

#### Assignment

| Light | Dark |
| --- | --- |
| ![Expanded task assignment with example data in light mode](docs/images/task-editor-assignment-desktop-light.png) | ![Expanded task assignment with example data in dark mode](docs/images/task-editor-assignment-desktop-dark.png) |

#### Notification

The task name is used as the notification title. The body combines the problem
message captured when the task was triggered with the task description rendered
at notification time; empty parts are omitted.

| Light | Dark |
| --- | --- |
| ![Expanded task notification settings with example data in light mode](docs/images/task-editor-notification-desktop-light.png) | ![Expanded task notification settings with example data in dark mode](docs/images/task-editor-notification-desktop-dark.png) |

#### Files

Files are managed in the task editor, and supported formats open in an in-panel
preview dialog.

| Light | Dark |
| --- | --- |
| ![Expanded task files with example data in light mode](docs/images/task-editor-files-desktop-light.png) | ![Expanded task files with example data in dark mode](docs/images/task-editor-files-desktop-dark.png) |

#### History

| Light | Dark |
| --- | --- |
| ![Expanded task history with example data in light mode](docs/images/task-editor-history-desktop-light.png) | ![Expanded task history with example data in dark mode](docs/images/task-editor-history-desktop-dark.png) |

### NFC completion

To complete a task with NFC, create a tag under **Settings → Tags** and assign it in the task editor. One tag can be assigned to only one task.

### Dashboard card

Add the **Tasks** card from the dashboard card picker. Its visual editor controls view/edit mode, the due-date range, and assignee filters. The assignee dropdown can dynamically target the logged-in user or selected users. Open panels and cards update immediately through the Tasks WebSocket subscription.

| Light | Dark |
| --- | --- |
| ![Tasks dashboard card on mobile in light mode](docs/images/dashboard-card-mobile-light.png) | ![Tasks dashboard card on mobile in dark mode](docs/images/dashboard-card-mobile-dark.png) |

Paused tasks are hidden from the dashboard card. Resuming a task keeps its stored due value, so an overdue task can immediately appear as due again.

### Voice assistants

With an LLM-based Home Assistant Assist agent, you can ask which tasks are open,
due, overdue, assigned to a person, unassigned, or scheduled for the current
week. The assistant can also show task details and completion history, assign or
unassign a person, complete tasks, and create recurring tasks.

When creating a fixed schedule, the assistant asks for missing planning details
such as the time. Deleting a task always requires a separate confirmation naming
the task before it is permanently removed.

### Backup and restore

Open **Settings** above the task list and expand **Backup**. Export creates a ZIP archive containing all data and attachments from Tasks. Import validates the archive and adds only tasks with new IDs together with their history and conflict-free attachments. Existing tasks and files are never overwritten.

## Home Assistant entities

The `sensor.tasks_due` entity counts active tasks whose due date and time has been reached and belongs to the **Tasks** device.

Example badge for [Navbar Card](https://github.com/joseluis9595/lovelace-navbar-card):

```yaml
badge:
  count: |
    [[[
      return Number(states['sensor.tasks_due']?.state || 0);
    ]]]
  show: |
    [[[
      return Number(states['sensor.tasks_due']?.state || 0) > 0;
    ]]]
```

## Home Assistant events

Tasks fires `tasks_event` after every committed operation and when a task reaches its due time. Automations can filter its `resource_type` and `action` data. Resource types are `task` and `archive`. Task actions are `saved`, `updated`, `deleted`, `completed`, `bulk_mutated`, and `due`; archive imports use `imported`. A newly saved task has `created: true`.

To receive a notification when a task becomes due, create an automation, open **Edit in YAML**, and paste:

```yaml
alias: Tasks task is due
triggers:
  - trigger: event
    event_type: tasks_event
    event_data:
      resource_type: task
      action: due
actions:
  - action: notify.notify
    data:
      title: Tasks
      message: "{{ trigger.event.data.resource_name }} is due."
```

Every event includes `resource_id` when the changed resource has one. Single-task events also include `resource_name`; bulk operations describe their task IDs in `operations`.

## Data and support

Tasks stores task data locally in Home Assistant and attachments under `<config>/tasks/uploads`. It does not send task data to an external service.

- [Issues and feature requests](https://github.com/psym88/ha_tasks/issues)
- [Release history](https://github.com/psym88/ha_tasks/releases)
- [MIT License](LICENSE)
