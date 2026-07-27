import { build } from "esbuild";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outdir = join(root, "custom_components/tasks/frontend/v2");

await mkdir(outdir, { recursive: true });
for (const file of await readdir(outdir)) {
  if (
    /^panel(?:-[A-Z0-9]+)?\.js$/.test(file) ||
    /^card(?:-[A-Z0-9]+)?\.js$/.test(file) ||
    /^chunk-[A-Z0-9]+\.js$/.test(file) ||
    file === "card-loader.js" ||
    file === "assets.json"
  ) {
    await rm(join(outdir, file));
  }
}

const result = await build({
  entryPoints: {
    panel: join(root, "frontend_v2/src/panel.ts"),
    card: join(root, "frontend_v2/src/card.ts"),
  },
  outdir,
  bundle: true,
  splitting: true,
  entryNames: "[name]-[hash]",
  chunkNames: "chunk-[hash]",
  format: "esm",
  legalComments: "none",
  metafile: true,
  minify: true,
  platform: "browser",
  target: "es2022",
});

const outputFor = (entryName) =>
  Object.entries(result.metafile.outputs).find(
    ([, output]) =>
      output.entryPoint && basename(output.entryPoint) === `${entryName}.ts`,
  )?.[0];
const panel = outputFor("panel");
const card = outputFor("card");
if (!panel || !card) {
  throw new Error("V2 panel or card output was not generated");
}
await writeFile(
  join(outdir, "assets.json"),
  `${JSON.stringify(
    { panel: basename(panel), card: basename(card) },
    null,
    2,
  )}\n`,
);
