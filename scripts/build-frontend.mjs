import { build } from "esbuild";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outdir = join(root, "custom_components/tasks/frontend");

await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });

await build({
  entryPoints: {
    panel: join(root, "frontend/src/panel.ts"),
    card: join(root, "frontend/src/card.ts"),
  },
  outdir,
  bundle: true,
  splitting: true,
  entryNames: "[name]",
  chunkNames: "shared",
  format: "esm",
  legalComments: "none",
  minify: true,
  platform: "browser",
  target: "es2022",
});
