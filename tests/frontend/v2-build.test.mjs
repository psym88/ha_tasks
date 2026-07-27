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
const bundle = await readFile(
  new URL(
    "../../custom_components/tasks/frontend/v2/panel.js",
    import.meta.url,
  ),
  "utf8",
);

test("V2 subscribes to the revisioned snapshot protocol", () => {
  assert.match(api, /type: "tasks\/subscribe"/);
  assert.match(source, /snapshot\.revision/);
});

test("V2 bundle owns its Lit runtime and custom element", () => {
  assert.match(bundle, /ha-tasks-panel-v2/);
  assert.doesNotMatch(bundle, /\bfrom\s+["']lit["']/);
  assert.doesNotMatch(bundle, /\bimport\s+["']lit["']/);
});
