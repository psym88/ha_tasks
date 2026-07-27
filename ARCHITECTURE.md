# Architecture

Tasks is a local-push Home Assistant integration with one config entry. Persistent data is stored in Home Assistant; attachments live under `<config>/tasks/uploads`.

## Data model

- A **task** stores its description, active state, user and Home Assistant label assignments, nullable timezone-aware UTC `task_due` datetime, optional NFC tag, recurrence or binary-sensor trigger, due-notification settings, attachments, and completion history. Label assignments persist stable Home Assistant label IDs; the frontend resolves their current names from the label registry.
- Fixed schedules stay anchored to configured calendar rules and their selected local wall time. Completion-based schedules use their creation time initially and then advance from the exact completion datetime. Calendar calculations run in Home Assistant's time zone and persisted values use UTC.
- A problem-sensor task has no due value while waiting. For an active task, an `off` to `on` transition sets its due value to the transition time and emits the shared due event. Completing it clears the due value; a later `off` to `on` transition can trigger it again. Startup and trigger-setting changes reconcile active sensors that are already on.
- Pausing preserves a task's stored due value but excludes it from due scheduling, problem-sensor triggering, the dashboard card, and the due-task count. Resuming performs no scheduled-due recalculation.
- Persistent store schemas use sequential migrations so upgrades preserve tasks, completion history, and attachment metadata. Store migration fixtures cover every published schema version.

## Home Assistant platforms

- `sensor.tasks_due` is a push-only summary of active tasks whose due datetime has been reached.
- A single timer tracks the nearest future `task_due` among active tasks, fires one `task_due` event per matching task, and then schedules the next due time. Task mutations rebuild that timer.
- A separate problem-sensor scheduler listens for binary-sensor state transitions for active tasks. It persists the trigger time first, then uses the same due-event and notification path as scheduled tasks.

## Backend

- `models.py`: typed task, trigger, completion, notification, and attachment
  values
- `repository.py`: Home Assistant Store persistence, migrations, and attachment
  files
- `task_store.py`: atomic snapshot mutations and schema-3 serialization
- `manager.py`: application use cases, runtime revisions, and direct change
  callbacks
- `migrations.py`: sequential Home Assistant store-schema and archive-manifest migrations
- `recurrence.py`: trigger validation and recurring local datetime calculations
- `scheduling.py`: due-time scheduling, indexed problem-sensor transitions, and
  startup reconciliation
- `notifications.py`: Mobile App and persistent panel notifications for due tasks
- `task_api.py`: authenticated task API, snapshot subscriptions,
  transactional bulk commands, and atomic editor saves
- `attachment_api.py`: authenticated attachments and ZIP import/export
- `sensor.py`: due-task summary entity
- `nfc_completion.py`: tag-scan handling and completion attribution
- `task_events.py`: public Tasks event helper
- `config_flow.py` and `__init__.py`: setup and integration lifecycle

Import upgrades supported older archive manifests before validating them against the current outer schema. Archive format 3 converts legacy date-based task due and completion-history values to timezone-aware UTC datetimes; missing task activation values retain the active default.

## Frontend

The frontend is split into native ES modules under `custom_components/tasks/frontend`:

- `controller.js`: shared data and workflow controller used by the panel and card
- `panel.js`: Home Assistant panel entry point and custom-element registration
- `dashboard-card.js`: Lovelace card and visual editor
- `sidebar-task-list.js`: sidebar table adapter, flat row mapping, filter categories, and HA table configuration
- `popup-task-editor.js`: task editor workflow and reusable file and history sections
- `popup-*.js`: Home Assistant adaptive-dialog hosts for task viewing, attachment previews, confirmations, and settings
- `action-menu.js`: shared native action-menu construction
- `localize.js`: frontend localization and safe text rendering

The sidebar panel maps backend tasks and Home Assistant registry records directly to flat rows through `task-table-rows.js`; localized presentation values remain a frontend concern. Persistent and session-specific table view state is isolated in `task-table-view.js`. The framework-neutral `tasks-data-table` component uses the vendored TanStack Table Core engine for sorting, grouping, filtering, selection, and column state, while rendering its own DOM with Home Assistant theme variables. A shared dimension registry defines groupable and filterable columns; filters reduce the row data before it is passed to the table. The dashboard card keeps its separate compact task presentation.

The sidebar panel and dashboard card share the same controller and task viewer/editor workflows. Popups use Home Assistant's composed `show-dialog` contract and `ha-adaptive-dialog`; shared file and history sections are produced by `popup-task-editor.js`. Attachments are signed anchors whose click handler opens the integration's preview popup through the same native dialog contract.

Frontend development follows a native-first rule: use Home Assistant components and interaction contracts before adding custom UI. Custom CSS is limited to structural layout that HA components do not provide; visual values use Home Assistant CSS variables and design tokens. No external UI or table library is used.

The current frontend loads an initial snapshot and reloads it from the public
`tasks_event`. A parallel revisioned snapshot subscription is available for the
V2 frontend. Internal schedulers and the summary sensor receive committed
changes directly from `TaskManager`; the public event bus is not used for
internal coordination or polling.

## Security and permissions

WebSocket and HTTP endpoints require an authenticated Home Assistant user. All signed-in users can manage tasks; only administrators can open the sidebar panel. Dashboard edit controls are governed by the card configuration. Attachment paths are task-scoped and served through signed URLs.

## Tests and releases

- Backend tests: `pytest`
- Frontend tests: `node --test tests/frontend/*.test.mjs`
- `manifest.json` is the sole release-version source. The integration derives a versioned frontend URL prefix from it so every ES module and translation request changes together without enabling long-lived static cache headers.
- Development releases are tagged from `dev` and published as GitHub pre-releases.
