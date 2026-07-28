import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../../frontend/src/panel.ts", import.meta.url),
  "utf8",
);
const api = await readFile(
  new URL("../../frontend/src/api.ts", import.meta.url),
  "utf8",
);
const archive = await readFile(
  new URL("../../frontend/src/archive.ts", import.meta.url),
  "utf8",
);
const dialog = await readFile(
  new URL("../../frontend/src/ui/dialog.ts", import.meta.url),
  "utf8",
);
const expandable = await readFile(
  new URL("../../frontend/src/ui/expandable.ts", import.meta.url),
  "utf8",
);
const version = await readFile(
  new URL("../../frontend/src/version.ts", import.meta.url),
  "utf8",
);
const actionMenu = await readFile(
  new URL("../../frontend/src/ui/action-menu.ts", import.meta.url),
  "utf8",
);
const pill = await readFile(
  new URL("../../frontend/src/ui/pill.ts", import.meta.url),
  "utf8",
);
const fields = await readFile(
  new URL("../../frontend/src/ui/fields.ts", import.meta.url),
  "utf8",
);
const taskForm = await readFile(
  new URL("../../frontend/src/task-form.ts", import.meta.url),
  "utf8",
);
const taskViewer = await readFile(
  new URL("../../frontend/src/task-viewer.ts", import.meta.url),
  "utf8",
);
const taskTable = await readFile(
  new URL("../../frontend/src/task-table.ts", import.meta.url),
  "utf8",
);
const dashboardCard = await readFile(
  new URL("../../frontend/src/dashboard-card.ts", import.meta.url),
  "utf8",
);
const cardEntry = await readFile(
  new URL("../../frontend/src/card.ts", import.meta.url),
  "utf8",
);
const bundle = await readFile(
  new URL("../../custom_components/tasks/frontend/panel.js", import.meta.url),
  "utf8",
);
const cardBundle = await readFile(
  new URL("../../custom_components/tasks/frontend/card.js", import.meta.url),
  "utf8",
);
const buildScript = await readFile(
  new URL("../../scripts/build-frontend.mjs", import.meta.url),
  "utf8",
);

test("frontend subscribes to the revisioned snapshot protocol", () => {
  assert.match(api, /type: "tasks\/subscribe"/);
  assert.match(source, /snapshot\.revision/);
});

test("frontend bundles own their runtime and stable production elements", () => {
  assert.match(version, /`ha-tasks-\${name}`/);
  assert.match(source, /const panelElementName = "tasks-panel"/);
  assert.match(bundle, /tasks-panel/);
  assert.match(cardBundle, /tasks-card/);
  assert.doesNotMatch(bundle, /\bfrom\s+["']lit["']/);
  assert.doesNotMatch(bundle, /\bimport\s+["']lit["']/);
  assert.match(buildScript, /splitting: false/);
  assert.doesNotMatch(bundle, /\bfrom\s+["'][^"']+["']/);
  assert.doesNotMatch(cardBundle, /\bfrom\s+["'][^"']+["']/);
});

test("frontend dialog is owned and accepts rendered content", () => {
  assert.match(dialog, /<dialog/);
  assert.match(dialog, /dialog\.showModal\(\)/);
  assert.match(dialog, /dialog\.content = content/);
  assert.doesNotMatch(dialog, /ha-dialog|show-dialog/);
});

test("frontend expandable uses native disclosure semantics", () => {
  assert.match(expandable, /<details/);
  assert.match(expandable, /<summary>/);
  assert.doesNotMatch(expandable, /ha-expansion-panel/);
});

test("frontend elements use an integration-owned namespace", () => {
  assert.match(version, /`ha-tasks-\${name}`/);
});

test("frontend action menu anchors to its trigger and stays in the viewport", () => {
  assert.match(actionMenu, /trigger\.getBoundingClientRect\(\)/);
  assert.match(actionMenu, /menu\.getBoundingClientRect\(\)/);
  assert.match(actionMenu, /window\.visualViewport/);
  assert.match(actionMenu, /popover="auto"/);
  assert.match(actionMenu, /role="menuitem"/);
  assert.doesNotMatch(actionMenu, /ha-menu|ha-dropdown/);
  assert.match(
    taskTable,
    /tasks\.map\(\s*\(task\) => staticHtml`/,
  );
});

test("frontend action menu follows keyboard menu navigation", () => {
  for (const key of ["ArrowDown", "ArrowUp", "Home", "End"]) {
    assert.match(actionMenu, new RegExp(`event\\.key === "${key}"`));
  }
});

test("frontend pill owns its presentation", () => {
  assert.match(pill, /border-radius: 999px/);
  assert.match(pill, /elementName\("pill"\)/);
  assert.doesNotMatch(pill, /ha-chip|ha-assist-chip/);
});

test("frontend owns its text textarea select combobox and switch controls", () => {
  assert.match(fields, /<input/);
  assert.match(fields, /<textarea/);
  assert.match(fields, /<select/);
  assert.match(fields, /role="combobox"/);
  assert.match(fields, /<datalist/);
  assert.match(fields, /type="checkbox"/);
  assert.match(fields, /elementName\("multi-select-field"\)/);
  assert.match(fields, /elementName\("switch-field"\)/);
  assert.doesNotMatch(
    fields,
    /ha-textfield|ha-selector|ha-combo-box|ha-switch/,
  );
});

test("frontend editor saves task details and planning in one transaction", () => {
  assert.match(api, /type: "tasks\/task\/save"/);
  assert.match(api, /schedulePayload\(details\.schedule\)/);
  assert.match(api, /task_id: task\.id/);
  assert.match(api, /schedule: task\.schedule/);
  assert.match(api, /deleted_attachment_ids: details\.files\?/);
  assert.match(taskForm, /run: \(\) => form\.save\(\)/);
  assert.match(taskForm, /if \(!name\)/);
  assert.match(taskForm, /this\.scheduleDirty \? schedule : undefined/);
});

test("frontend creates tasks through the shared editor with complete defaults", () => {
  assert.match(taskForm, /existingTask\?: Task/);
  assert.match(taskForm, /existingTask\s*\?\s*`\$\{t\("task\.edit"\)\}/);
  assert.match(taskForm, /: t\("task\.new"\)/);
  assert.match(taskForm, /const isNew = !task\.id/);
  assert.match(taskForm, /this\.scheduleDirty = isNew/);
  assert.match(taskForm, /this\.assignmentDirty = isNew/);
  assert.match(taskForm, /this\.notificationDirty = isNew/);
  assert.match(taskForm, /this\.task\.id \? this\.task : undefined/);
  assert.match(source, /openTaskEditor\(this\.hass\)/);
});

test("frontend deletes tasks only after its owned confirmation", () => {
  assert.match(api, /type: "tasks\/task\/delete"/);
  assert.match(source, /heading: t\("task\.delete_title"\)/);
  assert.match(source, /run: \(\) => deleteTask\(this\.hass!, task\.id\)/);
  assert.match(
    taskTable,
    /\{ label: t\("common\.delete"\), value: "delete", destructive: true \}/,
  );
});

test("frontend pauses and resumes tasks through the minimal update contract", () => {
  assert.match(api, /type: "tasks\/task\/update"/);
  assert.match(api, /task_id: taskId,\s*active,/);
  assert.match(
    taskTable,
    /task\.active === false \? t\("app\.resume"\) : t\("app\.pause"\)/,
  );
  assert.match(taskTable, /value: "active"/);
  assert.match(
    source,
    /setTaskActive\(\s*this\.hass,\s*task\.id,\s*task\.active === false/,
  );
});

test("frontend task table owns search, fixed due sorting, and responsive rows", () => {
  assert.match(source, /taskTableElementName/);
  assert.match(taskTable, /<table>/);
  assert.match(taskTable, /type="search"/);
  assert.match(taskTable, /private visibleTasks\(\)/);
  assert.match(taskTable, /private compareDue\(left: Task, right: Task\)/);
  assert.doesNotMatch(taskTable, /aria-sort=|sortDirection|sortKey/);
  assert.match(taskTable, /@media \(max-width: 640px\)/);
  assert.match(taskTable, /class="mobile-details"/);
  assert.doesNotMatch(taskTable, /tanstack|vaadin|ha-data-table/);
});

test("frontend task table keeps missing and paused due values sorted last", () => {
  assert.match(
    taskTable,
    /if \(task\.active === false \|\| !task\.due\)/,
  );
  assert.match(taskTable, /return leftDue === undefined \? 1 : -1/);
});

test("frontend task table resolves registry names and excludes deleted references", () => {
  assert.match(taskTable, /loadAssignmentOptions/);
  assert.match(taskTable, /loadNotificationDevices/);
  assert.match(
    taskTable,
    /this\.users\.find\(\(user\) => user\.id === task\.assignee_id\)/,
  );
  assert.match(
    taskTable,
    /this\.labels\s*\.filter\(\(label\) => ids\.has\(label\.label_id\)\)/,
  );
  assert.match(
    taskTable,
    /this\.devices\s*\.filter\(\(device\) => ids\.has\(device\.id\)\)/,
  );
  assert.match(taskTable, /assignee: "table\.assignee"/);
  assert.match(taskTable, /this\.columnHeader\(key\)/);
});

test("frontend task filters combine dimensions and values without grouping", () => {
  for (const dimension of [
    "assignee",
    "labels",
    "notifications",
    "trigger",
  ]) {
    assert.match(taskTable, new RegExp(`"${dimension}"`));
  }
  assert.match(taskTable, /private matchesFilters\(task: Task\)/);
  assert.match(taskTable, /Object\.keys\(this\.filters\).*\.every/s);
  assert.match(taskTable, /this\.filterValues\(task, key\)\.some/);
  assert.match(taskTable, /selected\.includes\(value\)/);
  assert.match(taskTable, /this\.filters = emptyFilters\(\)/);
  assert.doesNotMatch(taskTable, /grouping|group_by|groupColumn/i);
});

test("frontend table owns optional column visibility without grouping", () => {
  assert.match(taskTable, /type ColumnKey =/);
  assert.match(taskTable, /labels: false/);
  assert.match(taskTable, /notifications: false/);
  assert.match(taskTable, /this\.toggleColumn/);
  assert.match(taskTable, /visibleColumns\.map\(\(key\) => this\.columnHeader\(key\)\)/);
  assert.match(taskTable, /visibleColumns\.map\(\(key\) =>\s*this\.columnCell\(task, key\)\)/);
});

test("frontend table persists durable and per-tab view state separately", () => {
  assert.match(taskTable, /tasks-table-state-v2/);
  assert.match(taskTable, /tasks-table-session-v1/);
  assert.match(
    taskTable,
    /localStorage\?\.setItem\([\s\S]*columns:/,
  );
  assert.doesNotMatch(taskTable, /sortKey:|sortDirection:/);
  assert.match(
    taskTable,
    /sessionStorage\?\.setItem\([\s\S]*search:[\s\S]*filters:/,
  );
  assert.match(taskTable, /catch \{[\s\S]*Storage can be unavailable/);
});

test("frontend table selection submits one transactional bulk command", () => {
  assert.match(api, /type: "tasks\/task\/bulk"/);
  assert.match(api, /operations,/);
  assert.match(taskTable, /selectedIds: \{ state: true \}/);
  assert.match(taskTable, /aria-label=\$\{t\("app\.select_visible"\)\}/);
  assert.match(taskTable, /t\("app\.select_task"/);
  assert.match(taskTable, /private bulkOperations\(\): BulkTaskOperation\[\]/);
  assert.match(taskTable, /await mutateTasks\(this\.hass, operations\)/);
  assert.match(taskTable, /action: "complete"/);
  assert.match(taskTable, /action: "delete"/);
  assert.match(taskTable, /action: "update"/);
});

test("frontend bulk actions cover existing assignment and notification behavior", () => {
  for (const action of [
    "pause",
    "resume",
    "assign",
    "add-label",
    "remove-label",
    "add-notification",
    "remove-notification",
  ]) {
    assert.match(taskTable, new RegExp(`"${action}"`));
  }
  assert.match(taskTable, /notification: \{/);
  assert.match(taskTable, /device_ids:/);
  assert.match(taskTable, /label_ids:/);
  assert.match(taskTable, /assignee_id:/);
  assert.match(taskTable, /openTasksDialog/);
});

test("frontend dashboard card owns its view and editor", () => {
  assert.match(cardEntry, /import "\.\/dashboard-card"/);
  assert.doesNotMatch(source, /dashboard-card/);
  assert.match(
    dashboardCard,
    /class TasksDashboardCard extends LocalizedLitElement/,
  );
  assert.match(
    dashboardCard,
    /class TasksDashboardCardEditor extends LocalizedLitElement/,
  );
  assert.match(dashboardCard, /new CustomEvent\("config-changed"/);
  assert.match(dashboardCard, /secondary_info:/);
  assert.match(dashboardCard, /due_days:/);
  assert.match(dashboardCard, /assignee_filter:/);
  assert.doesNotMatch(
    dashboardCard,
    /<ha-(?:card|list|icon|form|selector)/,
  );
});

test("frontend dashboard card uses live snapshots and owned task actions", () => {
  assert.match(dashboardCard, /subscribeTasks\(hass/);
  assert.match(dashboardCard, /task\.active !== false/);
  assert.match(dashboardCard, /currentUserFilter/);
  assert.match(dashboardCard, /dateKey\(task\.due/);
  assert.match(dashboardCard, /openTaskViewer/);
  assert.match(dashboardCard, /openTaskEditor/);
  assert.match(dashboardCard, /taskActions\(task\)/);
});

test("frontend dashboard card follows the Lovelace custom-card contract", () => {
  assert.match(dashboardCard, /stableCardTag = "tasks-card"/);
  assert.match(dashboardCard, /editorElementName = "tasks-card-editor"/);
  assert.match(dashboardCard, /customElements\.define\(stableCardTag/);
  assert.match(dashboardCard, /customElements\.define\(editorElementName/);
  assert.match(dashboardCard, /card\.type === stableCardTag/);
  assert.match(dashboardCard, /new CustomEvent\("config-changed"/);
  assert.match(dashboardCard, /const \{ type: _type, \.\.\.config \}/);
  assert.doesNotMatch(dashboardCard, /__haTasksCardRuntime|runtimeChangedEvent/);
});

test("frontend panel streams archive export and import through the owned backup UI", () => {
  assert.match(source, /openArchive\(this\.hass\)/);
  assert.match(api, /fetchWithAuth\("\/api\/tasks\/archive"/);
  assert.match(api, /method: "POST"/);
  assert.match(api, /"Content-Type": "application\/zip"/);
  assert.match(api, /URL\.revokeObjectURL\(url\)/);
  assert.match(archive, /accept="\.zip,application\/zip"/);
  assert.match(archive, /report\.tasks_skipped/);
  assert.match(archive, /report\.attachments_skipped/);
});

test("frontend planning uses the authoritative preview API for every recurrence", () => {
  assert.match(api, /type: "tasks\/task\/preview_next_due"/);
  assert.match(taskForm, /previewTaskSchedule/);
  assert.match(taskForm, /scheduleType === "sensor"/);
  assert.match(taskForm, /scheduleUnit === "weekly"/);
  assert.match(taskForm, /scheduleUnit === "monthly"/);
  assert.match(taskForm, /scheduleUnit === "yearly"/);
  assert.match(taskForm, /t\("error\.select_at_least_one_weekday"\)/);
  assert.match(taskForm, /startsWith\("binary_sensor\."\)/);
});

test("frontend planning sends only fields used by the selected trigger", () => {
  assert.match(api, /if \(schedule\.type === "sensor"\)/);
  assert.match(api, /entity_id: schedule\.problemSensor\.trim\(\)/);
  assert.match(api, /if \(schedule\.type === "fixed"\)/);
  assert.match(api, /payload\.weekdays = schedule\.weekdays/);
  assert.match(api, /payload\.month = schedule\.month/);
});

test("frontend assignment loads registries and saves only after editing", () => {
  assert.match(api, /type: "tasks\/list"/);
  assert.match(api, /type: "tag\/list"/);
  assert.match(api, /type: "config\/label_registry\/list"/);
  assert.match(api, /assignee_id: details\.assignment\.assigneeId \|\| null/);
  assert.match(api, /label_ids: details\.assignment\.labelIds/);
  assert.match(api, /nfc_tag_id: details\.assignment\.nfcTagId \|\| null/);
  assert.match(taskForm, /this\.assignmentDirty/);
  assert.match(taskForm, /this\.assignmentDirty[\s\S]*?assignment:/);
});

test("frontend assignment excludes deleted registry references", () => {
  assert.match(
    taskForm,
    /this\.users\.some\(\(user\) => user\.id === this\.assigneeId\)/,
  );
  assert.match(
    taskForm,
    /this\.labels\.some\(\(label\) => label\.label_id === id\)/,
  );
  assert.match(
    taskForm,
    /this\.tags\.some\(\(tag\) => tag\.id === this\.nfcTagId\)/,
  );
});

test("frontend notification editor loads mobile devices and saves only after editing", () => {
  assert.match(api, /type: "config\/device_registry\/list"/);
  assert.match(api, /identifier\?\.\[0\] === "mobile_app"/);
  assert.match(
    api,
    /device_ids: details\.notification\.deviceIds/,
  );
  assert.match(
    api,
    /persistent: details\.notification\.persistent/,
  );
  assert.match(api, /critical: details\.notification\.critical/);
  assert.match(
    api,
    /route: details\.notification\.route\.trim\(\) \|\| null/,
  );
  assert.match(taskForm, /this\.notificationDirty/);
  assert.match(taskForm, /this\.notificationDirty[\s\S]*?notification:/);
  assert.match(taskForm, /notificationRoute\.startsWith\("\/\/"\)/);
});

test("frontend notification editor excludes deleted and non-mobile devices", () => {
  assert.match(
    taskForm,
    /this\.devices\.some\(\(device\) => device\.id === id\)/,
  );
  assert.match(taskForm, /loadNotificationDevices/);
});

test("frontend stages attachments and commits file changes transactionally", () => {
  assert.match(api, /hass\.fetchWithAuth\("\/api\/tasks\/upload"/);
  assert.match(api, /file_ids: fileIds/);
  assert.match(
    api,
    /deleted_attachment_ids: details\.files\?\.deletedAttachmentIds/,
  );
  assert.match(taskForm, /type="file"/);
  assert.match(taskForm, /this\.stagedFiles/);
  assert.match(taskForm, /this\.deletedAttachmentIds/);
  assert.match(taskForm, /this\.attachments = \[\.\.\.task\.attachments\]/);
  assert.doesNotMatch(taskForm, /ha-file-upload|ha-selector/);
});

test("frontend loads completion history and stages deletion until save", () => {
  assert.match(api, /type: "tasks\/history\/list"/);
  assert.match(
    api,
    /deleted_history_entry_ids: details\.files\?\.deletedHistoryEntryIds/,
  );
  assert.match(taskForm, /loadTaskHistory/);
  assert.match(taskForm, /this\.deletedHistoryEntryIds/);
  assert.match(taskForm, /t\("history\.completed_via_nfc"\)/);
});

test("frontend task viewer loads assignment history and signed attachments", () => {
  assert.match(taskViewer, /loadAssignmentOptions/);
  assert.match(taskViewer, /loadTaskHistory/);
  assert.match(taskViewer, /loadAttachmentUrls/);
  assert.match(api, /type: "tasks\/attachment\/urls"/);
  assert.match(taskViewer, /this\.signedFiles\[attachment\.id\]/);
  assert.match(source, /openTaskViewer/);
});

test("frontend previews common attachment types in its owned dialog", () => {
  assert.match(taskViewer, /type\.startsWith\("image\/"\)/);
  assert.match(taskViewer, /type\.startsWith\("video\/"\)/);
  assert.match(taskViewer, /type\.startsWith\("audio\/"\)/);
  assert.match(taskViewer, /type === "application\/pdf"/);
  assert.match(taskViewer, /openTasksDialog/);
  assert.doesNotMatch(taskViewer, /ha-dialog|show-dialog/);
});

test("frontend completion requires confirmation and sends trimmed notes", () => {
  assert.match(api, /type: "tasks\/task\/complete"/);
  assert.match(api, /notes: notes\.trim\(\) \|\| null/);
  assert.match(taskViewer, /heading: t\("task\.complete_title"\)/);
  assert.match(taskViewer, /if \(result !== "complete"\)/);
  assert.match(taskViewer, /await completeTask/);
  assert.match(taskViewer, /label=\$\{t\("task\.completion_notes"\)\}/);
});

test("frontend viewer renders complete trigger rules and responsive details", () => {
  assert.match(taskViewer, /schedule\.type === "sensor"/);
  assert.match(taskViewer, /schedule\.type === "sliding"/);
  assert.match(taskViewer, /unit === "weekly"/);
  assert.match(taskViewer, /unit === "monthly"/);
  assert.match(taskViewer, /unit === "yearly"/);
  assert.match(taskViewer, /schedule\.weekdays/);
  assert.match(taskViewer, /schedule\.month/);
  assert.match(taskViewer, /@media \(max-width: 520px\)/);
});

test("frontend viewer preserves safe common markdown without HA internals", () => {
  assert.match(taskViewer, /renderDescription\(\)/);
  assert.match(taskViewer, /<strong>/);
  assert.match(taskViewer, /<em>/);
  assert.match(taskViewer, /<code>/);
  assert.match(taskViewer, /<blockquote>/);
  assert.match(taskViewer, /\^\(\?:https\?:\|mailto:\|\\\/\|#\)/);
  assert.doesNotMatch(taskViewer, /unsafeHTML|ha-markdown/);
});

test("frontend viewer keeps independently loaded details available", () => {
  assert.match(taskViewer, /Promise\.allSettled/);
  assert.match(taskViewer, /assignment\.status === "fulfilled"/);
  assert.match(taskViewer, /history\.status === "fulfilled"/);
  assert.match(taskViewer, /files\.status === "fulfilled"/);
  assert.match(taskViewer, /t\("app\.assignment_load_error"\)/);
  assert.match(taskViewer, /t\("app\.history_load_error"\)/);
  assert.match(taskViewer, /t\("app\.attachment_load_error"\)/);
});
