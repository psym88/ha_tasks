import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../../frontend_v2/src/panel.ts", import.meta.url),
  "utf8",
);
const api = await readFile(
  new URL("../../frontend_v2/src/api.ts", import.meta.url),
  "utf8",
);
const dialog = await readFile(
  new URL("../../frontend_v2/src/ui/dialog.ts", import.meta.url),
  "utf8",
);
const expandable = await readFile(
  new URL("../../frontend_v2/src/ui/expandable.ts", import.meta.url),
  "utf8",
);
const version = await readFile(
  new URL("../../frontend_v2/src/version.ts", import.meta.url),
  "utf8",
);
const actionMenu = await readFile(
  new URL("../../frontend_v2/src/ui/action-menu.ts", import.meta.url),
  "utf8",
);
const pill = await readFile(
  new URL("../../frontend_v2/src/ui/pill.ts", import.meta.url),
  "utf8",
);
const fields = await readFile(
  new URL("../../frontend_v2/src/ui/fields.ts", import.meta.url),
  "utf8",
);
const taskForm = await readFile(
  new URL("../../frontend_v2/src/task-form.ts", import.meta.url),
  "utf8",
);
const taskViewer = await readFile(
  new URL("../../frontend_v2/src/task-viewer.ts", import.meta.url),
  "utf8",
);
const assets = JSON.parse(
  await readFile(
    new URL(
      "../../custom_components/tasks/frontend/v2/assets.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const bundle = await readFile(
  new URL(
    `../../custom_components/tasks/frontend/v2/${assets.panel}`,
    import.meta.url,
  ),
  "utf8",
);

test("V2 subscribes to the revisioned snapshot protocol", () => {
  assert.match(api, /type: "tasks\/subscribe"/);
  assert.match(source, /snapshot\.revision/);
});

test("V2 bundle owns its Lit runtime and custom element", () => {
  assert.match(assets.panel, /^panel-[A-Z0-9]+\.js$/);
  assert.match(bundle, /ha-tasks-/);
  assert.doesNotMatch(bundle, /\bfrom\s+["']lit["']/);
  assert.doesNotMatch(bundle, /\bimport\s+["']lit["']/);
});

test("V2 dialog is owned and accepts rendered content", () => {
  assert.match(dialog, /<dialog/);
  assert.match(dialog, /dialog\.showModal\(\)/);
  assert.match(dialog, /dialog\.content = content/);
  assert.doesNotMatch(dialog, /ha-dialog|show-dialog/);
});

test("V2 expandable uses native disclosure semantics", () => {
  assert.match(expandable, /<details/);
  assert.match(expandable, /<summary>/);
  assert.doesNotMatch(expandable, /ha-expansion-panel/);
});

test("V2 assets and elements are isolated by the bundle hash", () => {
  assert.match(version, /new URL\(import\.meta\.url\)/);
  assert.match(version, /`ha-tasks-\${name}-\${bundleHash}`/);
});

test("V2 action menu anchors to its trigger and stays in the viewport", () => {
  assert.match(actionMenu, /trigger\.getBoundingClientRect\(\)/);
  assert.match(actionMenu, /menu\.getBoundingClientRect\(\)/);
  assert.match(actionMenu, /window\.visualViewport/);
  assert.match(actionMenu, /popover="auto"/);
  assert.match(actionMenu, /role="menuitem"/);
  assert.doesNotMatch(actionMenu, /ha-menu|ha-dropdown/);
  assert.match(
    source,
    /snapshot\.tasks\.map\(\s*\(task\) => staticHtml`/,
  );
});

test("V2 action menu follows keyboard menu navigation", () => {
  for (const key of ["ArrowDown", "ArrowUp", "Home", "End"]) {
    assert.match(actionMenu, new RegExp(`event\\.key === "${key}"`));
  }
});

test("V2 pill owns its presentation", () => {
  assert.match(pill, /border-radius: 999px/);
  assert.match(pill, /elementName\("pill"\)/);
  assert.doesNotMatch(pill, /ha-chip|ha-assist-chip/);
});

test("V2 owns its text textarea select combobox and switch controls", () => {
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

test("V2 editor saves task details and planning in one transaction", () => {
  assert.match(api, /type: "tasks\/task\/save"/);
  assert.match(api, /schedulePayload\(details\.schedule\)/);
  assert.match(api, /task_id: task\.task_id/);
  assert.match(api, /schedule_type: task\.schedule_type/);
  assert.match(api, /deleted_attachment_ids: details\.files\?/);
  assert.match(taskForm, /run: \(\) => form\.save\(\)/);
  assert.match(taskForm, /if \(!name\)/);
  assert.match(taskForm, /this\.scheduleDirty \? schedule : undefined/);
});

test("V2 creates tasks through the shared editor with complete defaults", () => {
  assert.match(taskForm, /existingTask\?: Task/);
  assert.match(taskForm, /heading: existingTask \? `Edit/);
  assert.match(taskForm, /: "New task"/);
  assert.match(taskForm, /const isNew = !task\.task_id/);
  assert.match(taskForm, /this\.scheduleDirty = isNew/);
  assert.match(taskForm, /this\.assignmentDirty = isNew/);
  assert.match(taskForm, /this\.notificationDirty = isNew/);
  assert.match(taskForm, /this\.task\.task_id \? this\.task : undefined/);
  assert.match(source, /openTaskEditor\(this\.hass\)/);
});

test("V2 deletes tasks only after its owned confirmation", () => {
  assert.match(api, /type: "tasks\/task\/delete"/);
  assert.match(source, /heading: "Delete task\?"/);
  assert.match(source, /run: \(\) => deleteTask\(this\.hass!, task\.task_id\)/);
  assert.match(
    source,
    /\{ label: "Delete", value: "delete", destructive: true \}/,
  );
});

test("V2 planning uses the authoritative preview API for every recurrence", () => {
  assert.match(api, /type: "tasks\/task\/preview_next_due"/);
  assert.match(taskForm, /previewTaskSchedule/);
  assert.match(taskForm, /scheduleType === "sensor"/);
  assert.match(taskForm, /scheduleUnit === "weekly"/);
  assert.match(taskForm, /scheduleUnit === "monthly"/);
  assert.match(taskForm, /scheduleUnit === "yearly"/);
  assert.match(taskForm, /Select at least one weekday/);
  assert.match(taskForm, /startsWith\("binary_sensor\."\)/);
});

test("V2 planning sends only fields used by the selected trigger", () => {
  assert.match(api, /if \(schedule\.type === "sensor"\)/);
  assert.match(api, /problem_sensor: schedule\.problemSensor\.trim\(\)/);
  assert.match(api, /if \(schedule\.type === "fixed"\)/);
  assert.match(api, /schedule_weekdays = schedule\.weekdays/);
  assert.match(api, /schedule_month = schedule\.month/);
});

test("V2 assignment loads registries and saves only after editing", () => {
  assert.match(api, /type: "tasks\/list"/);
  assert.match(api, /type: "tag\/list"/);
  assert.match(api, /type: "config\/label_registry\/list"/);
  assert.match(api, /assignee_id: details\.assignment\.assigneeId \|\| null/);
  assert.match(api, /label_ids: details\.assignment\.labelIds/);
  assert.match(api, /nfc_tag_id: details\.assignment\.nfcTagId \|\| null/);
  assert.match(taskForm, /this\.assignmentDirty/);
  assert.match(taskForm, /this\.assignmentDirty[\s\S]*?assignment:/);
});

test("V2 assignment excludes deleted registry references", () => {
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

test("V2 notification editor loads mobile devices and saves only after editing", () => {
  assert.match(api, /type: "config\/device_registry\/list"/);
  assert.match(api, /identifier\?\.\[0\] === "mobile_app"/);
  assert.match(
    api,
    /notification_target: details\.notification\.deviceIds\.length/,
  );
  assert.match(
    api,
    /notification_persistent: details\.notification\.persistent/,
  );
  assert.match(api, /notification_critical: details\.notification\.critical/);
  assert.match(
    api,
    /notification_route: details\.notification\.route\.trim\(\) \|\| null/,
  );
  assert.match(taskForm, /this\.notificationDirty/);
  assert.match(taskForm, /this\.notificationDirty[\s\S]*?notification:/);
  assert.match(taskForm, /notificationRoute\.startsWith\("\/\/"\)/);
});

test("V2 notification editor excludes deleted and non-mobile devices", () => {
  assert.match(
    taskForm,
    /this\.devices\.some\(\(device\) => device\.id === id\)/,
  );
  assert.match(taskForm, /loadNotificationDevices/);
});

test("V2 stages attachments and commits file changes transactionally", () => {
  assert.match(api, /hass\.fetchWithAuth\("\/api\/file_upload"/);
  assert.match(api, /file_ids: fileIds/);
  assert.match(
    api,
    /deleted_attachment_ids: details\.files\?\.deletedAttachmentIds/,
  );
  assert.match(taskForm, /type="file"/);
  assert.match(taskForm, /this\.stagedFiles/);
  assert.match(taskForm, /this\.deletedAttachmentIds/);
  assert.match(source, /snapshot\.attachments/);
  assert.doesNotMatch(taskForm, /ha-file-upload|ha-selector/);
});

test("V2 loads completion history and stages deletion until save", () => {
  assert.match(api, /type: "tasks\/history\/list"/);
  assert.match(
    api,
    /deleted_history_entry_ids: details\.files\?\.deletedHistoryEntryIds/,
  );
  assert.match(taskForm, /loadTaskHistory/);
  assert.match(taskForm, /this\.deletedHistoryEntryIds/);
  assert.match(taskForm, /Completed via NFC/);
});

test("V2 task viewer loads assignment history and signed attachments", () => {
  assert.match(taskViewer, /loadAssignmentOptions/);
  assert.match(taskViewer, /loadTaskHistory/);
  assert.match(taskViewer, /loadAttachmentUrls/);
  assert.match(api, /type: "tasks\/attachment\/urls"/);
  assert.match(taskViewer, /this\.signedFiles\[attachment\.attachment_id\]/);
  assert.match(source, /openTaskViewer/);
});

test("V2 previews common attachment types in its owned dialog", () => {
  assert.match(taskViewer, /type\.startsWith\("image\/"\)/);
  assert.match(taskViewer, /type\.startsWith\("video\/"\)/);
  assert.match(taskViewer, /type\.startsWith\("audio\/"\)/);
  assert.match(taskViewer, /type === "application\/pdf"/);
  assert.match(taskViewer, /openTasksDialog/);
  assert.doesNotMatch(taskViewer, /ha-dialog|show-dialog/);
});

test("V2 completion requires confirmation and sends trimmed notes", () => {
  assert.match(api, /type: "tasks\/task\/complete"/);
  assert.match(api, /notes: notes\.trim\(\) \|\| null/);
  assert.match(taskViewer, /heading: "Complete task\?"/);
  assert.match(taskViewer, /if \(result !== "complete"\)/);
  assert.match(taskViewer, /await completeTask/);
  assert.match(taskViewer, /label="Completion notes"/);
});

test("V2 viewer renders complete trigger rules and responsive details", () => {
  assert.match(taskViewer, /schedule_type === "sensor"/);
  assert.match(taskViewer, /schedule_type === "sliding"/);
  assert.match(taskViewer, /unit === "weekly"/);
  assert.match(taskViewer, /unit === "monthly"/);
  assert.match(taskViewer, /unit === "yearly"/);
  assert.match(taskViewer, /schedule_weekdays/);
  assert.match(taskViewer, /schedule_month/);
  assert.match(taskViewer, /@media \(max-width: 520px\)/);
});

test("V2 viewer preserves safe common markdown without HA internals", () => {
  assert.match(taskViewer, /renderDescription\(\)/);
  assert.match(taskViewer, /<strong>/);
  assert.match(taskViewer, /<em>/);
  assert.match(taskViewer, /<code>/);
  assert.match(taskViewer, /<blockquote>/);
  assert.match(taskViewer, /\^\(\?:https\?:\|mailto:\|\\\/\|#\)/);
  assert.doesNotMatch(taskViewer, /unsafeHTML|ha-markdown/);
});

test("V2 viewer keeps independently loaded details available", () => {
  assert.match(taskViewer, /Promise\.allSettled/);
  assert.match(taskViewer, /assignment\.status === "fulfilled"/);
  assert.match(taskViewer, /history\.status === "fulfilled"/);
  assert.match(taskViewer, /files\.status === "fulfilled"/);
  assert.match(taskViewer, /Assignment details could not be loaded/);
  assert.match(taskViewer, /Completion history could not be loaded/);
  assert.match(taskViewer, /Attachment links could not be loaded/);
});
