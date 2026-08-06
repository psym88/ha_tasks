import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const baseUrl = (process.env.HA_RUNTIME_BASE_URL || "http://runtime:8123").replace(/\/$/, "");
const authPath = process.env.HA_RUNTIME_AUTH || ".artifacts/runtime/auth.json";
const targetTaskName = "Review emergency contacts";
const manifest = JSON.parse(
  await readFile("custom_components/tasks/manifest.json", "utf8"),
);

async function waitForHomeAssistant() {
  const deadline = Date.now() + 120_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Home Assistant did not restart: ${lastError}`);
}

async function callWebSocket(accessToken, command) {
  const socket = new WebSocket(`${baseUrl.replace(/^http/, "ws")}/api/websocket`);
  let nextId = 1;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("WebSocket timed out")), 30_000);
    socket.addEventListener("error", reject, { once: true });
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "auth_required") {
        socket.send(JSON.stringify({ type: "auth", access_token: accessToken }));
      } else if (message.type === "auth_ok") {
        socket.send(JSON.stringify({ id: nextId++, ...command }));
      } else if (message.type === "auth_invalid") {
        clearTimeout(timeout);
        socket.close();
        reject(new Error(message.message));
      } else if (message.type === "result") {
        clearTimeout(timeout);
        socket.close();
        if (message.success) resolve(message.result);
        else reject(new Error(`${message.error?.code}: ${message.error?.message}`));
      }
    });
  });
}

async function waitForTasks(accessToken) {
  const deadline = Date.now() + 60_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      return await callWebSocket(accessToken, { type: "tasks/list" });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Tasks did not load after restart: ${lastError}`);
}

await waitForHomeAssistant();
console.log("Home Assistant HTTP endpoint is ready");
const tokens = JSON.parse(await readFile(authPath, "utf8"));
const snapshot = await waitForTasks(tokens.access_token);
console.log("Tasks WebSocket API is ready");
assert.ok(
  snapshot.tasks.some((task) => task.name === targetTaskName),
  "Seeded task did not survive the Home Assistant restart",
);
const statesResponse = await fetch(`${baseUrl}/api/states`, {
  headers: { Authorization: `Bearer ${tokens.access_token}` },
});
assert.equal(statesResponse.status, 200, "State API is unavailable");
const states = await statesResponse.json();
console.log("Authenticated state API is ready");
assert.ok(
  states.some((state) => state.entity_id === "sensor.tasks_due"),
  "Tasks due sensor was not registered",
);

for (const path of [
  `/tasks_frontend/${manifest.version}/panel.js`,
  `/tasks_frontend/${manifest.version}/card.js`,
  "/tasks_strings.json",
]) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
}

console.log("Runtime restart, persistence, WebSocket, and frontend resources verified");
process.exit(0);
