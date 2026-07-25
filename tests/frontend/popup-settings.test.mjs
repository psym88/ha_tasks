import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("settings uses a native dialog with a collapsible import/export section", () => {
  const source = readFileSync(new URL("../../custom_components/tasks/frontend/popup-settings.js", import.meta.url), "utf8");
  assert.match(source, /show-dialog/);
  assert.match(source, /<ha-adaptive-dialog/);
  assert.match(source, /Tasks - \$\{esc\(version\)\}.*<ha-expansion-panel outlined>/);
  assert.match(source, /<ha-expansion-panel outlined>/);
  assert.match(source, /slot="header"/);
  assert.doesNotMatch(source, /<details>|<summary>|summary::after/);
  assert.match(source, /application\/zip/);
  assert.match(source, /confirmAction/);
  assert.match(source, /t\("settings\.import_export"\)/);
  assert.match(source, /<ol class="progress ht-content" role="log" aria-live="polite"><\/ol><div class="result ht-label-medium" role="status"><\/div><ha-selector class="archive-upload"><\/ha-selector>/);
  assert.match(source, /\.result\.success\{color:var\(--success-color\)\}/);
  assert.match(source, /\.result\.warning\{color:var\(--warning-color\)\}/);
  assert.match(source, /\.result\.error\{color:var\(--error-color\)\}/);
  assert.match(source, /slot="primaryAction"/);
});

test("panel archive import uses Home Assistant file upload and its Tasks event", () => {
  const source = readFileSync(new URL("../../custom_components/tasks/frontend/controller.js", import.meta.url), "utf8");
  const dialog = readFileSync(new URL("../../custom_components/tasks/frontend/popup-settings.js", import.meta.url), "utf8");
  assert.match(source, /fetchWithAuth\("\/api\/tasks\/archive"\)/);
  assert.match(source, /type:"tasks\/archive\/import",file_id:fileId/);
  assert.match(source, /return this\.ws\(\{type:"tasks\/archive\/import",file_id:fileId\}\)/);
  assert.match(dialog, /selector\.selector=\{file:\{accept:"\.zip,application\/zip"\}\}/);
  assert.match(dialog, /selector\.addEventListener\("value-changed"/);
  assert.match(dialog, /report\.conversions/);
  assert.match(dialog, /report\.tasks_skipped/);
  assert.match(dialog, /skipped\.join\(", "\)/);
  assert.match(dialog, /settings\.progress_convert/);
  assert.match(dialog, /settings\.import_complete_warning/);
  assert.doesNotMatch(dialog, /input type="file"|chooseImport/);
  assert.doesNotMatch(source, /fetch\("\/api\/tasks\/archive",\{method:"POST"/);
  assert.match(source, /connection\.subscribeEvents\(\(\)=>this\.load\(\),"tasks_event"/);
});
