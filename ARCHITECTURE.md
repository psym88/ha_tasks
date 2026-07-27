# Architecture

Tasks is a local-push Home Assistant integration with one config entry. Persistent data is stored in Home Assistant; attachments live under `<config>/tasks/uploads`.

## Data model

- A **task** is the persisted aggregate root. It embeds its base data,
  schedule variant, notification settings, completion history, and attachment
  metadata. Attachment content remains in separate files. Label assignments
  persist stable Home Assistant label IDs; the frontend resolves their current
  names from the label registry.
- Fixed schedules stay anchored to configured calendar rules and their selected local wall time. Completion-based schedules use their creation time initially and then advance from the exact completion datetime. Calendar calculations run in Home Assistant's time zone and persisted values use UTC.
- A problem-sensor task has no due value while waiting. For an active task, an `off` to `on` transition sets its due value to the transition time and emits the shared due event. Completing it clears the due value; a later `off` to `on` transition can trigger it again. Startup and trigger-setting changes reconcile active sensors that are already on.
- Pausing preserves a task's stored due value but excludes it from due scheduling, problem-sensor triggering, the dashboard card, and the due-task count. Resuming performs no scheduled-due recalculation.
- Store schema 5 nests completion and attachment metadata under their owning
  task and removes retired schedule metadata that has no runtime semantics.
  The sequential `1 → 2 → 3 → 4 → 5` migration chain and versioned fixtures
  preserve every published store format. WebSocket responses and archive
  format 3 remain flat compatibility boundaries.

## Home Assistant platforms

- `sensor.tasks_due` is a push-only summary of active tasks whose due datetime has been reached.
- One `TaskEngine` holds the nearest future `task_due` timer and listens only
  to binary sensors referenced by active tasks. It persists sensor trigger
  times first, then uses the same due-event and notification path as scheduled
  tasks.

## Backend

- `models.py`: typed task, trigger, completion, notification, and attachment
  values
- `repository.py`: Home Assistant Store persistence, migrations, and attachment
  files
- `task_store.py`: atomic versioned aggregate mutations and flat boundary
  projections
- `manager.py`: application use cases, runtime revisions, and direct change
  callbacks
- `migrations.py`: sequential Home Assistant store-schema and archive-manifest migrations
- `recurrence.py`: trigger validation and recurring local datetime calculations
- `scheduling.py`: due-time scheduling, indexed problem-sensor transitions, and
  startup reconciliation
- `notifications.py`: Mobile App and persistent panel notifications for due tasks
- `task_api.py`: authenticated task API, snapshot subscriptions,
  transactional bulk commands, and atomic editor saves
- `attachment_api.py`: authenticated temporary multipart uploads, attachments,
  and ZIP import/export
- `sensor.py`: due-task summary entity
- `nfc_completion.py`: tag-scan handling and completion attribution
- `task_events.py`: public Tasks event helper
- `config_flow.py` and `__init__.py`: setup and integration lifecycle

Import upgrades supported older archive manifests before validating them against the current outer schema. Archive format 3 converts legacy date-based task due and completion-history values to timezone-aware UTC datetimes; missing task activation values retain the active default.

## Frontend

The TypeScript frontend under `frontend_v2/src` builds content-hashed ES
modules into `custom_components/tasks/frontend/v2`. Home Assistant registers
the stable `tasks-panel` and `tasks-card` elements from those versioned assets.
The panel and card share the task form, viewer, archive flow, localization,
typed API client, and small integration-owned UI primitives.

`task-table.ts` owns task-specific search, filters, sorting, selection, bulk
actions, responsive rows, and persisted view preferences without a table
framework. `dashboard-card.ts` keeps a separate compact Lovelace presentation
and owns its visual editor. Dialogs, menus, fields, expandable sections, and
status pills use browser primitives and Home Assistant theme variables; the
bundle includes Lit as its only runtime UI dependency.

The panel and card consume the revisioned `tasks/subscribe` snapshot. Registry
lookups and task-specific detail commands remain at the authenticated
WebSocket boundary. The internal task engine and summary sensor receive
committed changes directly from `TaskManager`; the public event bus is not used
for internal coordination or frontend polling.

## Security and permissions

WebSocket and HTTP endpoints require an authenticated Home Assistant user. All signed-in users can manage tasks; only administrators can open the sidebar panel. Dashboard edit controls are governed by the card configuration. Attachment paths are task-scoped and served through signed URLs.

## Tests and releases

- Backend tests: `pytest`
- Frontend tests: `node --test tests/frontend/*.test.mjs`
- `manifest.json` is the sole release-version source. The integration derives a versioned frontend URL prefix from it so every ES module and translation request changes together without enabling long-lived static cache headers.
- Development releases are tagged from `dev` and published as GitHub pre-releases.
