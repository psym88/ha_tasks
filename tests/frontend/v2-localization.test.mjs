import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { build } from "esbuild";

const root = new URL("../..", import.meta.url);
const localize = await readFile(
  new URL("frontend_v2/src/localize.ts", root),
  "utf8",
);
const languages = {};
for (const language of ["en", "de"]) {
  languages[language] = JSON.parse(
    await readFile(
      new URL(
        `custom_components/tasks/frontend_translations/${language}.json`,
        root,
      ),
      "utf8",
    ),
  ).frontend;
}

const sourceFiles = await readdir(
  new URL("frontend_v2/src", root),
  { recursive: true },
);
const source = (
  await Promise.all(
    sourceFiles
      .filter((file) => file.endsWith(".ts"))
      .map((file) =>
        readFile(
          new URL(`frontend_v2/src/${file.replaceAll(path.sep, "/")}`, root),
          "utf8",
        ),
      ),
  )
).join("\n");

test("V2 loads versioned language catalogs with English fallback", () => {
  assert.match(localize, /"\/tasks_strings\.json"/);
  assert.match(localize, /`\/tasks_translations\/\$\{code\}\.json`/);
  assert.match(localize, /\?v=\$\{encodeURIComponent/);
  assert.match(localize, /messages = \{ \.\.\.fallback, \.\.\.translated \}/);
});

test("V2 localizes Home Assistant WebSocket error objects", async () => {
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
    json: async () => ({ frontend: languages.en }),
  });
  try {
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(
      output.outputFiles[0].text,
    ).toString("base64")}`;
    const runtime = await import(moduleUrl);
    await runtime.ready;
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

test("every direct V2 translation key exists in English and German", () => {
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

test("V2 panel and card follow Home Assistant language changes", () => {
  assert.match(source, /setLanguage\(this\.language\)/);
  assert.match(source, /this\.hass\?\.locale\?\.language/);
  assert.match(source, /Intl\.RelativeTimeFormat/);
});
