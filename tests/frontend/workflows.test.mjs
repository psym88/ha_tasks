import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const testsWorkflow = readFileSync(
  new URL("../../.github/workflows/tests.yml", import.meta.url),
  "utf8",
);
const betaWorkflow = readFileSync(
  new URL("../../.github/workflows/beta-tests.yml", import.meta.url),
  "utf8",
);
const runtimeScript = readFileSync(
  new URL("../../scripts/test-runtime.sh", import.meta.url),
  "utf8",
);
const captureScript = readFileSync(
  new URL("../screenshots/capture.mjs", import.meta.url),
  "utf8",
);

test("Tests and Beta Tests are separate manually runnable actions", () => {
  assert.match(testsWorkflow, /^name: Tests$/m);
  assert.doesNotMatch(testsWorkflow, /^\s*push:/m);
  assert.match(testsWorkflow, /pull_request:\s*\n\s*branches:\s*\n\s*- main/);
  assert.doesNotMatch(testsWorkflow, /pull_request:[\s\S]*?branches:[\s\S]*?- dev/);
  assert.match(testsWorkflow, /workflow_dispatch:/);
  assert.match(testsWorkflow, /workflow_call:/);
  assert.doesNotMatch(testsWorkflow, /schedule:/);
  assert.match(betaWorkflow, /^name: Beta Tests$/m);
  assert.match(betaWorkflow, /workflow_dispatch:/);
  assert.match(betaWorkflow, /schedule:\s*\n\s*- cron: "0 0 \* \* \*"/);
});

test("Beta Tests invoke the complete shared Tests workflow", () => {
  for (const job of [
    "name: Backend",
    "name: Frontend",
    "name: Home Assistant runtime",
    "name: Validate integration",
    "name: Validate repository",
  ]) {
    assert.match(testsWorkflow, new RegExp(job));
  }
  assert.match(betaWorkflow, /uses: \.\/\.github\/workflows\/tests\.yml/);
  assert.match(betaWorkflow, /ha_version: beta/);
  assert.match(betaWorkflow, /compare_screenshots: true/);
});

test("scheduled Beta Tests run only for an untested image digest", () => {
  assert.match(betaWorkflow, /docker buildx imagetools inspect[\s\S]*?:beta/);
  assert.match(betaWorkflow, /actions\/cache\/restore@v4/);
  assert.match(betaWorkflow, /actions\/cache\/save@v4/);
  assert.match(
    betaWorkflow,
    /github\.event_name == 'workflow_dispatch' \|\| steps\.cache\.outputs\.cache-hit != 'true'/,
  );
});

test("main pull requests and Beta Tests compare screenshots", () => {
  assert.match(
    testsWorkflow,
    /inputs\.compare_screenshots \|\| \(github\.event_name == 'pull_request' && github\.base_ref == 'main'\)/,
  );
  assert.equal(
    existsSync(
      new URL(
        "../../.github/workflows/documentation-screenshots.yml",
        import.meta.url,
      ),
    ),
    false,
  );
  assert.match(
    testsWorkflow,
    /HA_TASKS_COMPARE_SCREENSHOTS:.*inputs\.compare_screenshots.*pull_request.*main/,
  );
  assert.match(
    runtimeScript,
    /HA_TASKS_CAPTURE_SCREENSHOTS="\$\{HA_TASKS_COMPARE_SCREENSHOTS:-1\}"/,
  );
  assert.match(captureScript, /if \(captureScreenshots\) \{\s*await captureMatrix/);
});

test("beta failures own one digest issue and newer successes close it", () => {
  assert.match(betaWorkflow, /name: Report beta compatibility failure/);
  assert.match(betaWorkflow, /title="Beta compatibility failure: \$short_digest"/);
  assert.match(betaWorkflow, /gh issue create/);
  assert.match(betaWorkflow, /name: Record successful beta image/);
  assert.match(betaWorkflow, /gh issue close/);
  assert.match(betaWorkflow, /newer Home Assistant beta image/);
});

test("obsolete standalone validation workflows stay removed", () => {
  for (const workflow of [
    "documentation-screenshots.yml",
    "hacs.yml",
    "hassfest.yml",
  ]) {
    assert.equal(
      existsSync(new URL(`../../.github/workflows/${workflow}`, import.meta.url)),
      false,
    );
  }
});
