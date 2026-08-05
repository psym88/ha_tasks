import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { build } from "esbuild";

const root = new URL("../..", import.meta.url);
const localize = await readFile(
  new URL("frontend/src/localize.ts", root),
  "utf8",
);
const localizedElement = await readFile(
  new URL("frontend/src/localized-element.ts", root),
  "utf8",
);
const languages = {};
for (const language of ["en", "de"]) {
  languages[language] = JSON.parse(
    await readFile(
      new URL(
        `custom_components/tasks/translations/${language}.json`,
        root,
      ),
      "utf8",
    ),
  ).common;
  languages[language] = Object.fromEntries(
    Object.entries(languages[language])
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

const sourceFiles = await readdir(
  new URL("frontend/src", root),
  { recursive: true },
);
const source = (
  await Promise.all(
    sourceFiles
      .filter((file) => file.endsWith(".ts"))
      .map((file) =>
        readFile(
          new URL(`frontend/src/${file.replaceAll(path.sep, "/")}`, root),
          "utf8",
        ),
      ),
  )
).join("\n");

test("frontend loads versioned language catalogs with English fallback", () => {
  assert.match(localize, /"\/tasks_strings\.json"/);
  assert.match(localize, /`\/tasks_translations\/\$\{code\}\.json`/);
  assert.match(localize, /\?v=\$\{encodeURIComponent/);
  assert.match(localize, /messages = \{ \.\.\.fallback, \.\.\.translated \}/);
});

test("frontend localizes Home Assistant WebSocket error objects", async () => {
  const output = await build({
    stdin: {
      contents: localize,
      loader: "ts",
      sourcefile: "localize.ts",
    },
    bundle: true,
    format: "esm",
    platform: "browser",
    write: false,
  });
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      common: Object.fromEntries(
        Object.entries(languages.en).map(([key, value]) => [
          `ui_${key.replace(".", "_")}`,
          value,
        ]),
      ),
    }),
  });
  try {
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(
      output.outputFiles[0].text,
    ).toString("base64")}`;
    const runtime = await import(moduleUrl);
    await runtime.ready;
    let languageUpdates = 0;
    const unsubscribe = runtime.subscribeLanguage(() => {
      languageUpdates += 1;
    });
    await runtime.setLanguage("de");
    assert.equal(languageUpdates, 1);
    unsubscribe();
    assert.equal(
      runtime.errorText({
        code: "nfc_tag_already_assigned",
        message: "nfc_tag_already_assigned",
      }),
      "This NFC tag is already assigned to another task.",
    );
    assert.equal(
      runtime.errorText({ unexpected: true }),
      "An unexpected error occurred.",
    );
  } finally {
    globalThis.fetch = previousFetch;
  }
  assert.match(source, /this\.saveError = errorText\(error\)/);
  assert.equal(
    languages.en["error.nfc_tag_already_assigned"],
    "This NFC tag is already assigned to another task.",
  );
  assert.equal(
    languages.de["error.nfc_tag_already_assigned"],
    "Dieser NFC-Tag ist bereits einem anderen Task zugewiesen.",
  );
});

test("every direct frontend translation key exists in English and German", () => {
  const keys = [
    ...source.matchAll(/\bt\(\s*"([^"]+)"/g),
  ].map((match) => match[1]);
  for (const language of ["en", "de"]) {
    const missing = [...new Set(keys)].filter(
      (key) => !(key in languages[language]),
    );
    assert.deepEqual(missing, [], `${language} is missing ${missing.join(", ")}`);
  }
});

test("problem sensor status keys match the generated catalog namespace", () => {
  for (const language of ["en", "de"]) {
    for (const status of ["missing", "unavailable", "unknown"]) {
      assert.ok(`problem.sensor_${status}` in languages[language]);
      assert.ok(`problem.sensor_${status}_short` in languages[language]);
    }
  }
  assert.match(source, /`problem\.sensor_\$\{status\}`/);
  assert.match(source, /`problem\.sensor_\$\{sensorStatus\}_short`/);
  assert.doesNotMatch(source, /problem_sensor\.\$\{/);
});

test("frontend translation values have no surrounding whitespace", () => {
  for (const [language, catalog] of Object.entries(languages)) {
    for (const [key, value] of Object.entries(catalog)) {
      assert.equal(
        value,
        value.trim(),
        `${language}.${key} has surrounding whitespace`,
      );
    }
  }
});

test("frontend panel and card follow Home Assistant language changes", () => {
  assert.match(source, /setLanguage\(this\.language\)/);
  assert.match(source, /this\.hass\?\.locale\?\.language/);
  assert.match(source, /<ha-relative-time/);
  assert.match(localize, /for \(const listener of listeners\)/);
  assert.match(localizedElement, /subscribeLanguage\(\(\) => this\.requestUpdate\(\)\)/);
});
