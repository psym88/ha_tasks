import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("local runtime provisions the shared Alex test account", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /const username = "alex";/);
  assert.match(source, /const password = "alex";/);
  assert.match(source, /name: "Alex"/);
});

test("documentation screenshots exclude transient Home Assistant notifications", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /querySelectorAll\?\.\("notification-manager"\)/);
  assert.match(source, /manager\.style\.setProperty\("display", "none", "important"\)/);
  assert.match(source, /hideNotificationManagers\(document\);[\s\S]*?page\.screenshot/);
});

test("documentation screenshots target the production frontend elements", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /panel\?\.snapshot\?\.tasks\?\.length/);
  assert.match(source, /panel\.openTask\(task\)/);
  assert.match(source, /panel\.handleTaskAction\("edit", task\)/);
  assert.match(
    source,
    /panel\.shadowRoot\.querySelector\("\.fab"\)\.click\(\)/,
  );
  assert.match(source, /walk\(document, "ha-tasks-dialog"\)/);
  assert.match(source, /content && dialog\?\.open/);
  assert.match(source, /ha-tasks-task-viewer/);
  assert.match(source, /ha-tasks-task-form/);
  assert.match(source, /ha-tasks-expandable/);
  assert.match(source, /card\?\.snapshot\?\.tasks\?\.length/);
  assert.match(source, /querySelector\("ha-tasks-task-table"\)/);
  assert.match(source, /querySelector\("tbody tr"\)/);
  assert.doesNotMatch(source, /tasks-popup-|ha-adaptive-dialog|\.task-row/);
});

test("documentation screenshot seeding consumes the transactional save result", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /const result = await socket\.call\(\{/);
  assert.match(source, /created\.push\(result\.task\)/);
});

test("documentation dashboard card uses its production defaults", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /cards:\s*\[\{\s*type: "custom:tasks-card",\s*\}\]/);
  assert.doesNotMatch(
    source,
    /show_action_menu|secondary_info|due_days|assignee_ids/,
  );
  assert.match(source, /title: "Tasks card",\s*show_in_sidebar: true/);
});
