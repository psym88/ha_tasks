import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("documentation screenshots exclude transient Home Assistant notifications", () => {
  const source = readFileSync(
    new URL("../screenshots/capture.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /querySelectorAll\?\.\("notification-manager"\)/);
  assert.match(source, /manager\.style\.setProperty\("display", "none", "important"\)/);
  assert.match(source, /hideNotificationManagers\(document\);[\s\S]*?page\.screenshot/);
});
