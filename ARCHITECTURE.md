# Architecture

Tasks is a local-push Home Assistant integration with one config entry. Persistent data is stored in Home Assistant; attachments live under `<config>/tasks/uploads`.

## Data model

- A **task** stores its description, user and Home Assistant label assignments, nullable native date-or-datetime `task_due` value, optional NFC tag, recurrence or binary-sensor trigger, due-notification settings, attachments, and completion history. Label assignments persist stable Home Assistant label IDs; the frontend resolves their current names from the label registry.
- Fixed schedules stay anchored to configured calendar rules. Completion-based schedules advance from the completion date.
- A problem-sensor task has no due value while waiting. An `off` to `on` transition sets its due value to the transition time and emits the shared due event. Completing it clears the due value; a later `off` to `on` transition can trigger it again. Startup and trigger-setting changes reconcile sensors that are already on.
- Before version 1.0, stored-schema changes need no compatibility migration.

## Home Assistant platforms

- Scheduled tasks and triggered problem-sensor tasks are items of one push-only `todo.tasks` entity; waiting problem-sensor tasks are excluded. Items expose the task ID, name, due value, and open status. Native mutations can rename or complete an item. Due changes are accepted for Home Assistant dialog compatibility but ignored, while creation and deletion remain integration-owned operations.
- `sensor.tasks_due` remains a separate summary because a to-do entity's native state counts its visible incomplete items, not only due items.
- Todo and due sensor entities share one Tasks service device.
- A single timer tracks the nearest future scheduled `task_due`, fires one `task_due` event per matching task, and then schedules the next due time. Task mutations rebuild that timer.
- A separate problem-sensor scheduler listens for binary-sensor state transitions. It persists the trigger time first, then uses the same due-event and notification path as scheduled tasks.

## Backend

- `task_store.py`: persistence, serialized mutations, and task normalization
- `archive_converter.py`: sequential upgrades from older archive manifests to the current format
- `recurrence.py`: trigger validation and recurring due-date calculations
- `due_events.py`: shared date/datetime parsing and the single due-event timer
- `problem_events.py`: binary problem-sensor transitions and startup reconciliation
- `notifications.py`: Mobile App and persistent panel notifications for due tasks
- `task_api.py`: authenticated task and metadata API
- `attachment_api.py`: authenticated attachments and ZIP import/export
- `todo.py`: native task-list entity and standard item mutations
- `sensor.py`: due-task summary entity
- `nfc_completion.py`: tag-scan handling and completion attribution
- `task_events.py`: public Tasks event helper
- `config_flow.py` and `__init__.py`: setup and integration lifecycle

Import upgrades supported older archive manifests before validating them against the current outer schema. Task records remain opaque to the archive layer.

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

The sidebar panel maps backend tasks to flat rows and delegates its toolbar, search, sorting, grouping, and table rendering to Home Assistant's internal `hass-tabs-subpage-data-table` and `ha-data-table` components. A shared dimension registry defines groupable and filterable columns; filters reduce the row data before it is passed to the table. The dashboard card keeps its separate compact task presentation.

The sidebar panel and dashboard card share the same controller and task viewer/editor workflows. Popups use Home Assistant's composed `show-dialog` contract and `ha-adaptive-dialog`; shared file and history sections are produced by `popup-task-editor.js`. Attachments are signed anchors whose click handler opens the integration's preview popup through the same native dialog contract.

Frontend development follows a native-first rule: use Home Assistant components and interaction contracts before adding custom UI. Custom CSS is limited to structural layout that HA components do not provide; visual values use Home Assistant CSS variables and design tokens. No external UI or table library is used.

The frontend loads an initial snapshot and reloads it from `tasks_event`. The same event updates the to-do list and summary sensor immediately after stored mutations and due-time transitions; no dispatcher, entity fingerprint, or polling is used.

## Security and permissions

WebSocket and HTTP endpoints require an authenticated Home Assistant user. All signed-in users can manage tasks; only administrators can open the sidebar panel. Dashboard edit controls are governed by the card configuration. Attachment paths are task-scoped and served through signed URLs.

## Tests and releases

- Backend tests: `pytest`
- Frontend tests: `node --test tests/frontend/*.test.mjs`
- Release versions must match in `manifest.json`, `const.py`, and `frontend/panel.js`.
- Development releases are tagged from `dev` and published as GitHub pre-releases.
