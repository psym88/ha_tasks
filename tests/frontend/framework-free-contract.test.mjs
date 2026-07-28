import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = new URL("../..", import.meta.url);
const frontendRoot = new URL(
  "custom_components/tasks/frontend/",
  root,
);
const sourceFiles = (await readdir(frontendRoot, { recursive: true }))
  .filter((file) => file.endsWith(".js"))
  .filter((file) => !file.includes("vendor/"));
const sources = Object.fromEntries(
  await Promise.all(
    sourceFiles.map(async (file) => [
      file.replaceAll(path.sep, "/"),
      await readFile(
        new URL(file.replaceAll(path.sep, "/"), frontendRoot),
        "utf8",
      ),
    ]),
  ),
);
const source = Object.values(sources).join("\n");

const messages = {};
for (const language of ["en", "de"]) {
  const catalog = JSON.parse(
    await readFile(
      new URL(
        `custom_components/tasks/translations/${language}.json`,
        root,
      ),
      "utf8",
    ),
  );
  messages[language] = Object.fromEntries(
    Object.entries(catalog.common)
      .filter(([key]) => key.startsWith("ui_"))
      .map(([key, value]) => {
        const separator = key.indexOf("_", 3);
        return [
          `${key.slice(3, separator)}.${key.slice(separator + 1)}`,
          value,
        ];
      }),
  );
}

test("production frontend is framework-free source", () => {
  assert.match(sources["panel.js"], /from "\.\/controller\.js"/);
  assert.match(
    sources["dashboard-card.js"],
    /customElements\.define\("tasks-card"/,
  );
  assert.doesNotMatch(source, /\bfrom\s+["']lit(?:\/|["'])/);
  assert.doesNotMatch(source, /ha-tasks-(?:dialog|field|pill|menu)/);
});

test("framework-free frontend uses the current backend contract", () => {
  assert.match(
    sources["controller.js"],
    /subscribeMessage\(snapshot=>this\.applySnapshot\(snapshot\),\{type:"tasks\/subscribe"\}\)/,
  );
  assert.match(
    sources["controller.js"],
    /fetchWithAuth\("\/api\/tasks\/upload"/,
  );
  assert.match(
    sources["popup-task-editor.js"],
    /type:"tasks\/task\/save"[\s\S]*notification:\{device_ids:/,
  );
  assert.match(
    sources["popup-task-editor.js"],
    /schedule:schedulePayload/,
  );
  assert.match(
    sources["popup-task-editor.js"],
    /type:"tasks\/task\/preview_next_due",schedule:scheduleValue\(\)/,
  );
  assert.match(
    sources["sidebar-task-list.js"],
    /action:"update",id:task\.id,changes:/,
  );
  assert.doesNotMatch(
    source,
    /fetchWithAuth\("\/api\/file_upload"/,
  );
});

test("every direct framework-free translation key exists", () => {
  const keys = [...source.matchAll(/\b(?:t|tr)\(\s*"([^"]+)"/g)]
    .map((match) => match[1]);
  for (const language of ["en", "de"]) {
    const missing = [...new Set(keys)]
      .filter((key) => !(key in messages[language]));
    assert.deepEqual(
      missing,
      [],
      `${language} is missing ${missing.join(", ")}`,
    );
  }
});

test("frontend translation values have no surrounding whitespace", () => {
  for (const [language, catalog] of Object.entries(messages)) {
    for (const [key, value] of Object.entries(catalog)) {
      assert.equal(
        value,
        value.trim(),
        `${language}.${key} has surrounding whitespace`,
      );
    }
  }
});
