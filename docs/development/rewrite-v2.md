# Tasks V2 Rewrite

This document is the persistent implementation record for the Tasks V2
rewrite. It is intentionally separate from `ARCHITECTURE.md`: this file tracks
work in progress, while `ARCHITECTURE.md` documents only stable contracts.

## Status

- Phase: 4 - Protocol
- Baseline commit: `2fa1bcff18415bb4122572fe699f0526f45d9b22`
- Branch: `dev`
- Store schema: 3
- Archive format: 3
- Minimum Home Assistant version: 2026.7.0
- Validation Home Assistant version: 2026.7.4

## Baseline

Measured at the baseline commit, excluding translations, images, and other
non-code assets:

| Area | Files | Lines | Bytes |
| --- | ---: | ---: | ---: |
| Backend Python | 15 | 1,858 | 78,098 |
| Frontend source | 14 | 1,135 | 129,049 |
| Frontend vendor | 2 | 3,393 | 143,399 |
| Backend and frontend tests | 23 | 3,376 | 192,999 |

Baseline validation:

- Backend: 111 tests passed
- Frontend: 121 tests passed
- Home Assistant: 2026.7.4 started with the workspace integration mounted
  read-only and loaded `tasks` plus `tasks.sensor`

## Goals

- Preserve the Tasks product idea and its useful behavior.
- Make domain rules explicit and independently testable.
- Route all mutations through one application service.
- Keep Home Assistant public APIs at the integration boundary.
- Replace Home Assistant-internal frontend elements with owned components.
- Remove the table vendor and use a small task-specific table.
- Keep persisted user data upgradeable from every published store version.
- Keep the legacy implementation usable until its replacement is validated.

## Non-goals

- No new product features during the rewrite.
- No event sourcing.
- No custom database.
- No generic form engine.
- No frontend component suite such as Vaadin or Web Awesome.
- No table or grid framework.
- No table grouping in V2.
- No incompatible store migration before the new backend is proven.
- No visual polish work before functional parity.

## Fixed decisions

1. Home Assistant `Store` remains the persistence mechanism.
2. Store schema 3 remains writable during the compatibility phase.
3. A future schema 4 must have a sequential 3-to-4 converter and fixtures.
4. Datetimes are aware `datetime` objects inside the domain and UTC ISO strings
   only at persistence and transport boundaries.
5. A task has exactly one trigger variant:
   - fixed calendar schedule,
   - interval after completion,
   - binary-sensor problem trigger.
6. Completion history is an audit log. Deleting a history record must not
   replay scheduling or mutate the current due value.
7. A `TaskManager` will become the only mutation entry point.
8. Public `tasks_event` events remain supported but are not used as the
   integration's internal message bus.
9. WebSocket remains responsible for commands and live state; HTTP remains
   responsible for file and archive streaming.
10. The frontend will be TypeScript compiled to versioned production assets.
11. The frontend will bundle its own Lit runtime and register only
    `ha-tasks-*`, `tasks-panel`, and `tasks-card` elements.
12. The V2 panel and card will initially use parallel test registrations.
13. A native `todo.tasks` entity will be an adapter over the Tasks domain, not
    the persistence source of truth.

## Target backend boundaries

| Module | Responsibility |
| --- | --- |
| `models.py` | Typed tasks, trigger variants, completion and attachment data |
| `repository.py` | Store serialization, migration boundary, attachment files |
| `manager.py` | Validation, mutations, persistence, internal notifications |
| `scheduling.py` | Pure recurrence calculations and runtime trigger engine |
| `api.py` | WebSocket protocol and subscriptions |
| `archive.py` | HTTP archive and attachment streaming |
| `todo.py` | Native Home Assistant to-do adapter |
| `sensor.py` | Derived due-task count |

Small lifecycle and event helpers should be consolidated into these boundaries
rather than retained as one-file abstractions.

## Target frontend boundaries

| Module | Responsibility |
| --- | --- |
| `api.ts` | Typed WebSocket and HTTP client |
| `store.ts` | Snapshot subscription and derived registry indexes |
| `panel.ts` | Sidebar composition |
| `dashboard-card.ts` | Compact Lovelace representation and card editor |
| `task-table.ts` | Search, filters, sorting, selection and responsive rows |
| `task-dialog.ts` | Viewer and completion flow |
| `task-form.ts` | Explicit task editor sections and save transaction |
| `ui.ts` | Small owned dialog, menu, field and combobox primitives |
| `shared-styles.ts` | Only shared tokens and structural primitives |

## Compatibility strategy

### Backend

The new domain model first reads and writes store schema 3 through an adapter.
Existing WebSocket commands and the current frontend continue to operate. The
old store implementation is removed only after every mutation path uses the
new manager.

### Frontend

The V2 panel and card are registered alongside the current implementation under
temporary names. They use the same backend data so both versions can be compared
in one Home Assistant instance. Legacy frontend assets are removed only after
the V2 paths pass the functional matrix.

### Persistence

Published migration converters and fixtures are never removed. Store schema 4
is introduced only when the aggregate representation is ready and rollback no
longer needs schema-3 write compatibility.

## Functional matrix

Legend: `legacy` means protected by the current baseline; `pending` means V2 has
not replaced the path yet.

| Capability | Baseline | V2 | Required verification |
| --- | --- | --- | --- |
| Create task | legacy | pending | API, persistence, panel |
| Update task metadata | legacy | pending | partial update compatibility |
| Delete task | legacy | pending | history and attachment cleanup |
| Pause and resume | legacy | pending | stored due value remains stable |
| Fixed daily recurrence | legacy | pending | local wall time and DST |
| Fixed weekly recurrence | legacy | pending | weekdays and interval anchor |
| Fixed monthly recurrence | legacy | pending | clamping and last day |
| Fixed yearly recurrence | legacy | pending | leap-day clamping |
| After-completion recurrence | legacy | pending | completion timestamp anchor |
| Recurrence preview | legacy | pending | same authoritative calculation |
| Problem-sensor trigger | legacy | pending | startup and off-to-on behavior |
| Completion notes | legacy | pending | trimming and attribution |
| Delete history | legacy | complete | deletion does not alter current due |
| NFC completion | legacy | pending | user/context attribution |
| Persistent notification | legacy | pending | create and dismiss |
| Mobile notification | legacy | pending | device target and critical payload |
| Task attachments | legacy | pending | upload, preview and delete |
| ZIP export | legacy | pending | data and attachment consistency |
| ZIP import | legacy | pending | streaming, migration and merge report |
| Due sensor | legacy | pending | push update and active-task filtering |
| Public Tasks events | legacy | pending | stable filterable event data |
| Authenticated task access | legacy | pending | existing permission contract |
| Admin-only sidebar | legacy | pending | panel registration |
| Dashboard card | legacy | pending | view and edit modes |
| Table search | legacy | pending | localized presentation |
| Table filters | legacy | pending | assignee, label, notification, trigger |
| Table sorting | legacy | pending | missing due values sort last |
| Table selection and bulk actions | legacy | pending | one backend mutation |
| Table column visibility | legacy | pending | persisted local preference |
| English and German UI | legacy | pending | English fallback |
| Cache-safe frontend update | legacy | pending | version and asset hash change |
| Native `todo.tasks` entity | absent | pending | CRUD and completion adapter |

## Delivery phases

### Phase 0 - Baseline

- [x] Remove the obsolete WebSocket archive import.
- [x] Run complete backend and frontend tests.
- [x] Restart and validate the development container.
- [x] Commit and push the baseline.
- [x] Record code sizes and compatibility requirements.

### Phase 1 - Domain model

- [x] Add typed trigger variants.
- [x] Add typed task, completion, notification and attachment value objects.
- [x] Add schema-3 trigger serialization and parsing tests.
- [x] Move schedule normalization and signatures into the model.
- [x] Use domain schedules in recurrence without changing behavior.
- [x] Keep all current APIs and the schema-3 representation compatible.

### Phase 2 - Repository and manager

- [x] Isolate Home Assistant Store access in the repository.
- [x] Add atomic in-memory mutation semantics.
- [x] Route task CRUD and completion through `TaskManager`.
- [x] Simplify history deletion.
- [x] Route attachment mutations through `TaskManager`.

### Phase 3 - Runtime adapters

- [x] Replace public-event internal coordination with direct callbacks.
- [x] Consolidate due and problem trigger scheduling.
- [x] Track only configured binary sensors.
- [x] Route NFC and notifications through `TaskManager`.
- [x] Update the due sensor from relevant domain changes only.

### Phase 4 - Protocol

- [ ] Add an initial-snapshot WebSocket subscription.
- [ ] Add revisioned task updates.
- [ ] Add one bulk-mutation command.
- [ ] Add transactional task and attachment saving.
- [ ] Retain legacy commands until the current frontend is retired.

### Phase 5 - Frontend V2

- [ ] Add TypeScript and production bundling.
- [ ] Add owned UI primitives.
- [ ] Add V2 task form and viewer.
- [ ] Add V2 task table without grouping or a grid dependency.
- [ ] Add V2 dashboard card.
- [ ] Register parallel test panel and card.
- [ ] Verify light, dark, desktop and mobile behavior.

### Phase 6 - Native Home Assistant adapter

- [ ] Add `todo.tasks`.
- [ ] Verify native create, update, delete and complete actions.
- [ ] Keep Tasks-specific metadata in the Tasks domain.

### Phase 7 - Cutover

- [ ] Replace production panel and card registrations.
- [ ] Remove legacy WebSocket commands.
- [ ] Remove legacy frontend and TanStack vendor files.
- [ ] Introduce and migrate to store schema 4 if still beneficial.
- [ ] Update stable architecture documentation.
- [ ] Compare final code and bundle sizes against the baseline.

## Work log

### 2026-07-27

- Established baseline commit `2fa1bcf`.
- Verified 111 backend and 121 frontend tests.
- Verified Home Assistant 2026.7.4 loads the mounted Tasks integration.
- Started Phase 1 with schema-3 compatibility as a hard constraint.
- Replaced dictionary-based trigger normalization and signatures with typed
  fixed, after-completion, and problem-sensor variants.
- Verified 118 backend and 121 frontend tests after the first domain slice.
- Added typed task, notification, completion, and attachment values at the
  schema-3 boundary while preserving unknown imported task fields.
- Routed task creation, partial updates, completion creation, and attachment
  creation through the typed boundary.
- Verified all published schema-3 fixture values cross the typed boundary and
  all 124 backend plus 121 frontend tests pass.
- Changed completion history to an audit log: new entries no longer store
  scheduling snapshots and deletion no longer recalculates the task.
- Preserved legacy scheduling snapshot fields through migrations and archives.
- Removed 51 production lines and verified all 123 backend tests.
- Extracted Home Assistant Store access, migrations, and attachment-file I/O
  into `TasksRepository`.
- Made mutations copy-on-write so failed persistence leaves the active snapshot
  unchanged; attachment creation also removes its file when persistence fails.
- Reduced `task_store.py` from 404 to 389 lines. The explicit repository
  boundary and rollback behavior add 112 production lines in this phase.
- Verified all 124 backend and 121 frontend tests.
- Added `TaskManager` as the only runtime mutation entry point for WebSocket,
  archive, NFC, scheduling, attachments, and completion.
- Centralized public change events after successful persistence and removed
  duplicate event construction from the WebSocket, HTTP, and NFC adapters.
- Reduced `task_api.py` by 42 lines and `task_store.py` by another 8 lines.
  The explicit application boundary adds a net 147 production lines.
- Verified all 127 backend and 121 frontend tests.
- Replaced four internal `tasks_event` listeners with synchronous
  `TaskManager` change callbacks while retaining the public event contract.
- Routed due notification creation and completion/deletion dismissal directly
  through the manager.
- Limited due-sensor refreshes to task, archive, and due changes instead of
  every public Tasks event.
- Added 24 net production lines for the typed internal change contract and
  verified all 128 backend plus 121 frontend tests.
- Consolidated `due_events.py` and `problem_events.py` into `scheduling.py`.
- Replaced the global state-event scan with Home Assistant 2026.7.4's indexed
  `async_track_state_change_event` helper and dynamically refresh the entity
  set only when problem-trigger configuration changes.
- Eliminated one production module; the indexed subscription behavior adds 20
  net production lines.
- Verified all 129 backend and 121 frontend tests.

## Next action

Add one initial-snapshot WebSocket subscription while retaining the legacy
request and public-event APIs for the current frontend.
