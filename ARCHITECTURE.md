# Architecture

Tasks is a local-push Home Assistant integration with one config entry.
Persistent data is stored in Home Assistant; attachment files live under
`<config>/tasks/uploads`.

## Data model

- A task is the persisted aggregate root. It embeds identity and content,
  exactly one schedule variant, notification settings, completion history, and
  attachment metadata. Attachment content remains in separate files.
- The runtime, WebSocket API, Store, and exported `tasks.json` use the same
  aggregate schema. Support for older flat records is isolated to Store
  migrations.
- A fixed schedule advances by its configured calendar rule. A sliding schedule
  advances from the exact completion time. Neither schedule uses a separate
  anchor field.
- A sensor task has no due value while waiting. An `off` to `on` transition sets
  `due` to the transition time and emits the shared due event. Completing it
  clears `due`; a later transition can trigger it again.
- Pausing preserves `due` but excludes the task from scheduling, sensor
  triggering, the dashboard card, and the due-task count.
- Removing completion records recalculates fixed and sliding `due` from the
  newest remaining completion. Sensor tasks and tasks without remaining
  completions preserve their current `due`.
- Date-times are timezone-aware Python values internally and UTC ISO strings at
  persistence and transport boundaries.
- Store schema 6 nests completion and attachment metadata under each task and
  removes fields not defined by the aggregate. The sequential
  `1 -> 2 -> 3 -> 4 -> 5 -> 6` migration chain is the only Store
  compatibility layer.

## Home Assistant platforms

- `sensor.tasks_due` is a push-only summary of active tasks whose due date-time
  has been reached.
- One `TaskEngine` owns the nearest fixed or sliding timer and listens only to
  binary sensors referenced by active sensor tasks. It persists sensor trigger
  times first, then uses the same due-event and notification path as scheduled
  tasks.

## Backend

- `models.py`: typed current task, schedule, completion, notification, and
  attachment values
- `repository.py`: Home Assistant Store persistence and attachment files
- `task_store.py`: atomic current-schema aggregate mutations
- `manager.py`: the sole mutation entry point, runtime revisions, direct
  internal callbacks, and the public event
- `migrations.py`: sequential Store migrations
- `recurrence.py`: schedule validation and recurring local date-time
  calculations
- `scheduling.py`: timer scheduling, indexed sensor transitions, and startup
  reconciliation
- `notifications.py`: Mobile App and persistent notifications for due tasks
- `task_api.py`: authenticated commands, subscriptions, bulk operations, and
  atomic editor saves
- `attachment_api.py`: authenticated multipart uploads, attachments, and ZIP
  import/export
- `sensor.py`: due-task summary entity
- `nfc_completion.py`: tag-scan handling and completion attribution
- `task_events.py`: public Tasks event helper
- `config_flow.py` and `__init__.py`: setup and integration lifecycle

The ZIP archive contains a versioned Store snapshot in `tasks.json` and
attachment content under `attachments/`. Import applies the same Store
migrations used at startup before current-schema validation. There is no
separate archive schema or archive version.

## Frontend

The TypeScript frontend under `frontend_v2/src` builds content-hashed ES
modules into `custom_components/tasks/frontend/v2`. Home Assistant registers
the stable `tasks-panel` and `tasks-card` custom elements from those versioned
assets. Lit is bundled with the integration; no Home Assistant-internal UI
component or table library is a runtime dependency.

The panel and card consume the revisioned `tasks/subscribe` snapshot. Registry
lookups are loaded independently. Task changes do not reload unrelated Home
Assistant registries.

`task-table.ts` owns search, filters, sorting, selection, bulk actions,
responsive rows, and persisted view preferences. `dashboard-card.ts` owns the
compact Lovelace presentation and its editor. Dialogs, menus, fields,
expandable sections, and status pills use integration-owned custom elements and
browser primitives.

The engine, due sensor, and notification coordinator receive committed changes
directly from `TaskManager`. The public Home Assistant `tasks_event` remains
available to users and automations but is not an internal message bus.

## Security and permissions

WebSocket and HTTP endpoints require an authenticated Home Assistant user. All
signed-in users can manage tasks; only administrators can open the sidebar
panel. Dashboard edit controls are governed by card configuration. Attachment
paths are task-scoped and served through signed URLs.

## Tests and releases

- Backend tests: `pytest`
- Frontend tests: `node --test tests/frontend/*.test.mjs`
- `manifest.json` is the release-version source.
- Built frontend assets use content hashes under a manifest-versioned URL
  prefix.
- Development releases are tagged from `dev` and published as GitHub
  pre-releases.
