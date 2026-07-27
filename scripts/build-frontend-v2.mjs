import { build } from "esbuild";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outdir = join(root, "custom_components/tasks/frontend/v2");

await mkdir(outdir, { recursive: true });
for (const file of await readdir(outdir)) {
  if (/^panel(?:-[A-Z0-9]+)?\.js$/.test(file) || file === "assets.json") {
    await rm(join(outdir, file));
  }
}

const result = await build({
  entryPoints: {
    panel: join(root, "frontend_v2/src/panel.ts"),
  },
  outdir,
  bundle: true,
  entryNames: "[name]-[hash]",
  format: "esm",
  legalComments: "none",
  metafile: true,
  minify: true,
  platform: "browser",
  target: "es2022",
});

const panel = Object.entries(result.metafile.outputs).find(
  ([, output]) => output.entryPoint,
)?.[0];
if (!panel) {
  throw new Error("V2 panel output was not generated");
}
await writeFile(
  join(outdir, "assets.json"),
  `${JSON.stringify({ panel: basename(panel) }, null, 2)}\n`,
);
