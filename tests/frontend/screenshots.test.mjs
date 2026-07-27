import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("documentation screenshots exclude transient Home Assistant notifications", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /querySelectorAll\?\.\("notification-manager"\)/);
  assert.match(source, /manager\.style\.setProperty\("display", "none", "important"\)/);
  assert.match(source, /hideNotificationManagers\(document\);[\s\S]*?page\.screenshot/);
});

test("documentation screenshots target the production V2 elements", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /panel\?\.snapshot\?\.tasks\?\.length/);
  assert.match(source, /panel\.openTask\(task\)/);
  assert.match(source, /panel\.handleTaskAction\("edit", task\)/);
  assert.match(source, /ha-tasks-task-viewer/);
  assert.match(source, /ha-tasks-task-form/);
  assert.match(source, /ha-tasks-expandable/);
  assert.match(source, /card\?\.snapshot\?\.tasks\?\.length/);
  assert.doesNotMatch(source, /tasks-popup-|ha-adaptive-dialog|\.task-row/);
});
