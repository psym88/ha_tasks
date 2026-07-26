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
  assert.match(source, /<ol class="progress" role="log" aria-live="polite"><\/ol><div class="result" role="status"><\/div><input class="archive-upload" type="file" accept="\.zip,application\/zip">/);
  assert.match(source, /\.result\.success\{color:var\(--success-color\)\}/);
  assert.match(source, /\.result\.warning\{color:var\(--warning-color\)\}/);
  assert.match(source, /\.result\.error\{color:var\(--error-color\)\}/);
  assert.match(source, /\.archive-upload\{display:none\}/);
  assert.match(source, /<ha-button class="import" slot="secondaryAction">.*settings\.import/);
  assert.match(source, /slot="primaryAction"/);
  assert.match(source, /querySelector\("\.import"\)\.onclick=\(\)=>input\.click\(\)/);
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
