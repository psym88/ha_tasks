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
