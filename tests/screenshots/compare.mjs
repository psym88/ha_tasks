import { appendFile, copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const baselineDir = path.resolve(process.argv[2] || "docs/images");
const candidateDir = path.resolve(process.argv[3] || ".artifacts/screenshots");
const diffDir = path.resolve(process.argv[4] || ".artifacts/screenshot-diffs");
const update = process.argv.includes("--update");
const failOnChange = process.argv.includes("--fail-on-change");
const maxDiffRatio = Number(process.env.HA_SCREENSHOT_MAX_DIFF_RATIO || "0.0005");

const candidateNames = (await readdir(candidateDir))
  .filter((name) => name.endsWith(".png"))
  .sort();
if (!candidateNames.length) throw new Error(`No PNG screenshots found in ${candidateDir}`);

await mkdir(diffDir, { recursive: true });
const results = [];
for (const name of candidateNames) {
  const candidatePath = path.join(candidateDir, name);
  const baselinePath = path.join(baselineDir, name);
  let baseline;
  try {
    baseline = PNG.sync.read(await readFile(baselinePath));
  } catch {
    results.push({ name, status: "missing", ratio: 1 });
    if (update) {
      await mkdir(path.dirname(baselinePath), { recursive: true });
      await copyFile(candidatePath, baselinePath);
    }
    continue;
  }

  const candidate = PNG.sync.read(await readFile(candidatePath));
  if (baseline.width !== candidate.width || baseline.height !== candidate.height) {
    results.push({
      name,
      status: "dimensions",
      baseline: `${baseline.width}x${baseline.height}`,
      candidate: `${candidate.width}x${candidate.height}`,
      ratio: 1,
    });
    if (update) await copyFile(candidatePath, baselinePath);
    continue;
  }

  const diff = new PNG({ width: candidate.width, height: candidate.height });
  const pixels = pixelmatch(
    baseline.data,
    candidate.data,
    diff.data,
    candidate.width,
    candidate.height,
    { threshold: 0.1, includeAA: false },
  );
  const ratio = pixels / (candidate.width * candidate.height);
  const changed = ratio > maxDiffRatio;
  results.push({ name, status: changed ? "changed" : "current", pixels, ratio });
  if (changed) {
    await writeFile(path.join(diffDir, name), PNG.sync.write(diff));
    if (update) await copyFile(candidatePath, baselinePath);
  }
}

const changed = results.filter((result) => result.status !== "current");
const report = [
  "# Documentation screenshot comparison",
  "",
  `Allowed changed-pixel ratio: ${(maxDiffRatio * 100).toFixed(3)}%`,
  "",
  "| Screenshot | Status | Difference |",
  "| --- | --- | ---: |",
  ...results.map((result) => `| ${result.name} | ${result.status} | ${(result.ratio * 100).toFixed(3)}% |`),
  "",
  changed.length
    ? `${changed.length} screenshot(s) require review.`
    : "All documentation screenshots are current.",
  "",
].join("\n");
await writeFile(path.join(diffDir, "report.md"), report, "utf8");
console.log(report);

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed.length ? "true" : "false"}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `changed_count=${changed.length}\n`);
}

if (failOnChange && changed.length) {
  process.exitCode = 1;
}
