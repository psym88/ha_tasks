import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("settings uses toolbar popover content without a dialog", () => {
  const source = readFileSync(new URL("../../custom_components/tasks/frontend/popup-settings.js", import.meta.url), "utf8");
  const table = readFileSync(new URL("../../custom_components/tasks/frontend/tasks-data-table.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /show-dialog|ha-adaptive-dialog/);
  assert.match(source, /SETTINGS_CONTENT_TAG="tasks-settings-content"/);
  assert.match(source, /Tasks - \$\{esc\(version\)\}/);
  assert.match(source, /<ha-expansion-panel outlined>/);
  assert.match(source, /t\("settings\.import_export"\)/);
  assert.match(table, /class="popover settings-popover"/);
  assert.match(table, /<slot name="settings-pane"><\/slot>/);
  assert.match(source, /application\/zip/);
  assert.doesNotMatch(source, /confirmAction|import_confirm/);
  assert.match(source, /<ol class="progress" role="log" aria-live="polite"><\/ol><div class="result" role="status"><\/div><input class="archive-upload" type="file" accept="\.zip,application\/zip">/);
  assert.match(source, /\.result\.success\{color:var\(--success-color\)\}/);
  assert.match(source, /\.result\.warning\{color:var\(--warning-color\)\}/);
  assert.match(source, /\.result\.error\{color:var\(--error-color\)\}/);
  assert.match(source, /\.archive-upload\{display:none\}/);
  assert.match(source, /\.progress-item\{display:flex;align-items:center/);
  assert.match(source, /<ha-button class="import">.*settings\.import/);
  assert.match(source, /<ha-button class="export" variant="brand">/);
  assert.match(source, /querySelector\("\.import"\)\.onclick=\(\)=>input\.click\(\)/);
  assert.match(source, /this\.controller\._settingsBackupExpanded=true/);
  assert.match(source, /panel\.expanded=Boolean\(this\.controller\._settingsBackupExpanded\)/);
  assert.match(source, /expanded-changed/);
  assert.match(source, /set controller\(value\)\{if\(this\._controller===value\)return;/);
  assert.doesNotMatch(source, /ht-label-medium|ht-content|\.content\{overflow:auto\}|:host\{color:|\.hint\{margin:0;color:/);
});

test("panel archive import streams directly to the authenticated Tasks endpoint", () => {
  const source = readFileSync(new URL("../../custom_components/tasks/frontend/controller.js", import.meta.url), "utf8");
  const dialog = readFileSync(new URL("../../custom_components/tasks/frontend/popup-settings.js", import.meta.url), "utf8");
  assert.match(source, /fetchWithAuth\("\/api\/tasks\/archive"\)/);
  assert.match(source, /fetchWithAuth\("\/api\/tasks\/archive",\{method:"POST",headers:\{"Content-Type":"application\/zip"\},body:file\}\)/);
  assert.doesNotMatch(source, /type:"tasks\/archive\/import",file_id:/);
  assert.match(dialog, /input\.addEventListener\("change",\(\)=>this\.importArchive\(input\.files\?\.\[0\],input\)\)/);
  assert.match(dialog, /report\.conversions/);
  assert.match(dialog, /report\.tasks_skipped/);
  assert.match(dialog, /skipped\.join\(", "\)/);
  assert.match(dialog, /settings\.progress_convert/);
  assert.match(dialog, /settings\.import_complete_warning/);
  assert.doesNotMatch(dialog, /ha-selector class="archive-upload"/);
  assert.match(source, /connection\.subscribeEvents\(\(\)=>this\.load\(\),"tasks_event"/);
});
