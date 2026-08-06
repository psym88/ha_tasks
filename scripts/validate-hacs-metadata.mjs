import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const hacs = JSON.parse(await readFile("hacs.json", "utf8"));
const manifest = JSON.parse(
  await readFile("custom_components/tasks/manifest.json", "utf8"),
);

assert.equal(manifest.domain, "tasks");
assert.equal(manifest.name, hacs.name);
assert.match(manifest.version, /^\d{8}\.[1-9]\d*$/);
assert.ok(Array.isArray(manifest.codeowners) && manifest.codeowners.length > 0);
assert.equal(manifest.config_flow, true);
assert.match(manifest.documentation, /^https:\/\/github\.com\//);
assert.match(manifest.issue_tracker, /^https:\/\/github\.com\//);
assert.equal(hacs.zip_release, true);
assert.equal(hacs.filename, "ha_tasks.zip");
assert.match(hacs.homeassistant, /^\d{4}\.\d+\.\d+$/);

await access("custom_components/tasks/__init__.py");
await access("custom_components/tasks/translations/en.json");
await access("README.md");

console.log("Local HACS metadata and repository structure validated");
