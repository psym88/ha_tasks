# Tasks rewrite status

The frontend rewrite is complete. This document records the resulting contracts
rather than the retired transition strategy.

## Decisions

- Tasks use one typed aggregate schema in persistence, Python runtime,
  WebSocket messages, the TypeScript client, and exported Store snapshots.
- Old Store schemas are supported only by the sequential converters in
  `migrations.py`.
- Archives contain the current Store version and payload in `tasks.json`.
  Import uses the same sequential Store converters as startup; archives have
  no separate schema or version.
- There is no schedule-anchor field. Fixed schedules follow calendar rules;
  sliding schedules advance from completion.
- Sensor tasks use the same `due` state as other tasks. `due` is empty while
  waiting, set when the sensor triggers, and cleared on completion.
- Completion history records completed work. After deletion, fixed and sliding
  tasks recalculate `due` only from the newest remaining completion; sensor
  tasks and empty histories preserve their current state.
- The public Home Assistant `tasks_event` remains available to users and
  automations, but internal components communicate directly through
  `TaskManager`.
- A native Home Assistant To-do entity is intentionally not implemented.
- Safari-specific work is outside the current scope.

## Current aggregate

```text
Task
├── id, name, icon, description, active
├── assignee_id, label_ids, nfc_tag_id
├── due
├── schedule
│   ├── fixed: unit, interval, calendar fields, time
│   ├── sliding: unit, interval
│   └── sensor: entity_id
├── notification
│   └── device_ids, persistent, critical, route
├── completions[]
└── attachments[]
```

Attachment content remains in task-scoped files; only attachment metadata is
embedded in the aggregate.

## Runtime architecture

- `TaskManager` is the only application-level mutation entry point.
- `TaskEngine` owns one nearest-due timer and subscriptions only for referenced
  binary sensors.
- The due sensor and notification handling receive committed manager changes
  directly.
- `tasks/subscribe` sends a revisioned initial snapshot and subsequent task
  snapshots. Registry data is loaded separately.
- Bulk changes are committed as one backend operation.
- Editor saves commit task fields, staged uploads, attachment deletions, and
  history deletions as one task operation.
- HTTP handles multipart attachment uploads, archive downloads, and streamed
  archive imports. WebSocket handles state, commands, and subscriptions.
- Individual attachments are limited to 100 MiB. Archive imports have no
  application-level size limit and are streamed to disk before parsing.

## Frontend

- The frontend is TypeScript built into stable bundled production assets.
- Lit is bundled by the integration.
- Only integration-owned `ha-tasks-*` custom elements and browser primitives
  are used.
- There is no Home Assistant-internal UI-component dependency and no table
  library.
- The desktop table and mobile list implement search, filters, sorting,
  selection, column visibility, and bulk operations directly.
- Grouping is not implemented.

## Compatibility boundary

Current application code does not detect, accept, project, or preserve flat
task records. Field names such as `task_name`, `task_due`, `schedule_type`, and
`notification_target` exist only in Store migration converters and their
versioned fixtures.

No runtime fallback selects between old and current shapes.

## Verification

The maintained checks cover:

- every Store migration step and fixture,
- Store-snapshot archive import and export,
- recurrence and DST behavior,
- fixed, sliding, and sensor due behavior,
- manager changes and public events,
- notifications and NFC completion,
- attachment transactions and archive streaming,
- WebSocket subscriptions and bulk operations,
- TypeScript type checking,
- frontend behavior and generated production assets,
- Home Assistant startup with the integration mounted read-only from the
  active workspace.
