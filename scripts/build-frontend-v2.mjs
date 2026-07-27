import { build } from "esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

await build({
  entryPoints: {
    panel: join(root, "frontend_v2/src/panel.ts"),
  },
  outdir: join(root, "custom_components/tasks/frontend/v2"),
  bundle: true,
  format: "esm",
  legalComments: "none",
  minify: true,
  platform: "browser",
  target: "es2022",
});
