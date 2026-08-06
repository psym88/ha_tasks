import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

const baseUrl = (process.env.HA_SCREENSHOT_BASE_URL || "http://127.0.0.1:8123").replace(/\/$/, "");
const outputDir = path.resolve(process.env.HA_SCREENSHOT_OUTPUT || ".artifacts/screenshots");
const authOutput = process.env.HA_SCREENSHOT_AUTH_OUTPUT;
const clientId = `${baseUrl}/`;
const username = "documentation";
const password = "tasks-screenshot-password";
const targetTaskName = "Review emergency contacts";
const uiWaitTimeout = Number(process.env.HA_SCREENSHOT_UI_TIMEOUT || "60000");
const referenceNow = "2026-07-26T10:00:00+00:00";

const desktop = { viewport: { width: 1440, height: 1000 } };
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true };
const themes = ["light", "dark"];
const editorBoxes = [
  ["planning", "Schedule"],
  ["assignment", "Assignment"],
  ["notification", "Notification"],
  ["files", "Files"],
  ["history", "History"],
];

function isoAtOffset(days, hour = 8, minute = 0) {
  const now = new Date(referenceNow);
  const value = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + days,
    hour,
    minute,
  ));
  return value.toISOString();
}

async function waitForHomeAssistant() {
  const deadline = Date.now() + 120_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/onboarding`);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Home Assistant did not become ready: ${lastError}`);
}

async function requestJson(url, { method = "GET", token, body, form } = {}) {
  const headers = {};
  let requestBody;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  } else if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    requestBody = new URLSearchParams(form);
  }
  const response = await fetch(`${baseUrl}${url}`, { method, headers, body: requestBody });
  const text = await response.text();
  const value = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${method} ${url} returned ${response.status}: ${text}`);
  }
  return value;
}

class HomeAssistantSocket {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    const websocketUrl = `${baseUrl.replace(/^http/, "ws")}/api/websocket`;
    this.socket = new WebSocket(websocketUrl);
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("WebSocket connection timed out")), 30_000);
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
      this.socket.addEventListener("close", () => {
        for (const { reject: rejectPending } of this.pending.values()) {
          rejectPending(new Error("Home Assistant WebSocket closed"));
        }
        this.pending.clear();
      });
      this.socket.addEventListener("message", (event) => this.onMessage(event));
      this.openTimeout = timeout;
    });
    clearTimeout(this.openTimeout);
    const authResult = new Promise((resolve, reject) => {
      this.authResolve = resolve;
      this.authReject = reject;
    });
    this.socket.send(JSON.stringify({ type: "auth", access_token: this.accessToken }));
    await authResult;
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    if (message.type === "auth_ok") {
      this.authResolve?.();
      return;
    }
    if (message.type === "auth_invalid") {
      this.authReject?.(new Error(message.message || "WebSocket authentication failed"));
      return;
    }
    if (message.type !== "result") return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    if (message.success) pending.resolve(message.result);
    else pending.reject(new Error(`${message.error?.code}: ${message.error?.message}`));
  }

  call(command) {
    const id = this.nextId++;
    const response = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.socket.send(JSON.stringify({ id, ...command }));
    return response;
  }

  close() {
    this.socket?.close();
  }
}

async function completeOnboarding() {
  const status = await requestJson("/api/onboarding");
  const done = new Set(status.filter((step) => step.done).map((step) => step.step));
  if (done.has("user")) {
    throw new Error("The screenshot Home Assistant config must start empty");
  }

  const user = await requestJson("/api/onboarding/users", {
    method: "POST",
    body: {
      name: "Marco",
      username,
      password,
      client_id: clientId,
      language: "en",
    },
  });
  const tokens = await requestJson("/auth/token", {
    method: "POST",
    form: {
      grant_type: "authorization_code",
      code: user.auth_code,
      client_id: clientId,
    },
  });
  const token = tokens.access_token;

  await requestJson("/api/onboarding/core_config", { method: "POST", token });
  await requestJson("/api/onboarding/analytics", { method: "POST", token });
  await requestJson("/api/onboarding/integration", {
    method: "POST",
    token,
    body: { client_id: clientId, redirect_uri: clientId },
  });
  return { ...tokens, clientId, hassUrl: baseUrl, expires: Date.now() + tokens.expires_in * 1000 };
}

async function seedUsers(socket) {
  const users = await socket.call({ type: "config/auth/list" });
  for (const name of ["Jill", "Alex"]) {
    if (!users.some((user) => user.name === name)) {
      await socket.call({ type: "config/auth/create", name });
    }
  }
}

async function setupTasksIntegration(token) {
  const flow = await requestJson("/api/config/config_entries/flow", {
    method: "POST",
    token,
    body: { handler: "tasks", show_advanced_options: false },
  });
  if (flow.type === "form") {
    const result = await requestJson(`/api/config/config_entries/flow/${flow.flow_id}`, {
      method: "POST",
      token,
      body: {},
    });
    if (!["create_entry", "abort"].includes(result.type)) {
      throw new Error(`Unexpected Tasks config-flow result: ${JSON.stringify(result)}`);
    }
  } else if (flow.type !== "abort") {
    throw new Error(`Unexpected Tasks config-flow start: ${JSON.stringify(flow)}`);
  }
}

async function waitForTasks(socket) {
  const deadline = Date.now() + 60_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      return await socket.call({ type: "tasks/list" });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Tasks did not load: ${lastError}`);
}

async function uploadAttachment(token) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540">
  <rect width="960" height="540" fill="#03a9f4"/>
  <circle cx="160" cy="160" r="88" fill="#ffffff" opacity=".92"/>
  <path d="M120 160l28 28 58-68" fill="none" stroke="#03a9f4" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="80" y="350" fill="#ffffff" font-family="Arial, sans-serif" font-size="56" font-weight="700">Tasks maintenance guide</text>
  <text x="82" y="420" fill="#ffffff" font-family="Arial, sans-serif" font-size="30">Documentation attachment preview</text>
</svg>`;
  const form = new FormData();
  form.append("file", new Blob([svg], { type: "image/svg+xml" }), "maintenance-guide.svg");
  const response = await fetch(`${baseUrl}/api/tasks/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok) throw new Error(`Attachment upload failed: ${response.status} ${await response.text()}`);
  return (await response.json()).file_id;
}

async function seedData(socket, token) {
  const initial = await waitForTasks(socket);
  if (initial.tasks.length) return;

  const cleaning = await socket.call({
    type: "config/label_registry/create",
    name: "Cleaning",
    color: "blue",
    icon: "mdi:spray-bottle",
  });
  const safety = await socket.call({
    type: "config/label_registry/create",
    name: "Safety",
    color: "red",
    icon: "mdi:shield-check-outline",
  });
  const outdoor = await socket.call({
    type: "config/label_registry/create",
    name: "Outdoor",
    color: "green",
    icon: "mdi:tree-outline",
  });
  const tag = await socket.call({
    type: "tag/create",
    tag_id: "tasks-docs-maintenance",
    name: "Maintenance cabinet",
    description: "Documentation NFC tag",
  });
  const userIds = new Map(initial.users.map((user) => [user.name, user.id]));
  for (const name of ["Marco", "Jill", "Alex"]) {
    if (!userIds.has(name)) throw new Error(`Screenshot user not found: ${name}`);
  }

  const fixed = (unit, values = {}) => ({
    type: "fixed",
    unit,
    interval: 1,
    time: "08:00",
    ...values,
  });
  const sliding = (unit, interval = 1) => ({
    type: "sliding",
    unit,
    interval,
  });
  const sensor = (entity_id) => ({ type: "sensor", entity_id });
  const notify = (critical = false, route = null) => ({
    device_ids: [],
    persistent: true,
    critical,
    route,
  });
  const taskDefinitions = [
    {
      name: "Clean bathroom extractor fan",
      icon: "mdi:fan",
      due: isoAtOffset(-8),
      schedule: fixed("daily"),
      assignee_id: userIds.get("Marco"),
      label_ids: [cleaning.label_id],
      notification: notify(),
    },
    {
      name: "Vacuum the ground floor",
      icon: "mdi:vacuum",
      due: isoAtOffset(0, 10),
      schedule: sliding("weekly"),
      assignee_id: userIds.get("Jill"),
      label_ids: [cleaning.label_id],
    },
    {
      name: "Water the garden",
      icon: "mdi:watering-can-outline",
      due: isoAtOffset(1, 18),
      schedule: fixed("daily"),
      label_ids: [outdoor.label_id],
    },
    {
      name: "Change bed linen",
      icon: "mdi:bed-king-outline",
      due: isoAtOffset(2),
      schedule: fixed("weekly", { interval: 2, weekdays: [5] }),
      assignee_id: userIds.get("Alex"),
      label_ids: [cleaning.label_id],
    },
    {
      name: "Put out recycling bins",
      icon: "mdi:recycle",
      due: isoAtOffset(6, 19),
      schedule: fixed("weekly", { weekdays: [2], time: "19:00" }),
      label_ids: [outdoor.label_id],
    },
    {
      name: "Test smoke and carbon monoxide alarms",
      icon: "mdi:smoke-detector-variant",
      due: isoAtOffset(8),
      schedule: fixed("monthly", { day: 15 }),
      assignee_id: userIds.get("Marco"),
      label_ids: [safety.label_id],
      notification: notify(true),
    },
    {
      name: "Replace drinking water filter",
      icon: "mdi:water-pump",
      due: isoAtOffset(10),
      schedule: sliding("monthly", 3),
      assignee_id: userIds.get("Jill"),
    },
    {
      name: "Deep-clean the refrigerator",
      icon: "mdi:fridge-outline",
      due: isoAtOffset(21),
      schedule: sliding("monthly"),
      label_ids: [cleaning.label_id],
    },
    {
      name: "Annual heat pump service",
      icon: "mdi:heat-pump-outline",
      due: isoAtOffset(60),
      schedule: fixed("yearly", { month: 10, day: 15 }),
      assignee_id: userIds.get("Alex"),
      label_ids: [safety.label_id],
    },
    {
      name: "Inspect washing machine hoses",
      icon: "mdi:washing-machine",
      due: isoAtOffset(180),
      schedule: sliding("yearly"),
      active: false,
      label_ids: [safety.label_id],
    },
    {
      name: "Check basement leak sensor",
      icon: "mdi:water-alert-outline",
      schedule: sensor("binary_sensor.basement_leak"),
      label_ids: [safety.label_id],
      notification: notify(),
    },
    {
      name: targetTaskName,
      icon: "mdi:clipboard-text-clock-outline",
      description: "Verify telephone numbers, evacuation notes, and the household maintenance checklist.\n\nKeep this information available offline.",
      due: "2030-01-15T07:00:00+00:00",
      schedule: fixed("yearly", { month: 1, day: 15 }),
      assignee_id: userIds.get("Alex"),
      label_ids: [safety.label_id, outdoor.label_id],
      nfc_tag_id: tag.id,
      notification: notify(true, "/tasks"),
    },
  ];

  const fileId = await uploadAttachment(token);
  const created = [];
  for (const definition of taskDefinitions) {
    const result = await socket.call({
      type: "tasks/task/save",
      ...definition,
      file_ids: definition.name === targetTaskName ? [fileId] : [],
    });
    created.push(result.task);
  }

  const target = created.find((task) => task.name === targetTaskName);
  await socket.call({
    type: "tasks/task/complete",
    task_id: target.id,
    completed_at: "2029-01-15T07:30:00+00:00",
    notes: "Updated emergency contacts and checked the printed copy.",
  });
  await socket.call({
    type: "lovelace/dashboards/create",
    require_admin: false,
    icon: "mdi:clipboard-check-outline",
    title: "Tasks documentation",
    show_in_sidebar: false,
    url_path: "tasks-docs",
    mode: "storage",
  });
  await socket.call({
    type: "lovelace/config/save",
    url_path: "tasks-docs",
    config: {
      title: "Tasks",
      views: [{
        title: "Tasks",
        path: "tasks",
        icon: "mdi:clipboard-check-outline",
        cards: [{
          type: "custom:tasks-card",
        }],
      }],
    },
  });
}

function authenticationState(tokens) {
  return {
    cookies: [],
    origins: [{
      origin: baseUrl,
      localStorage: [{
        name: "hassTokens",
        value: JSON.stringify(tokens),
      }],
    }],
  };
}

async function waitForPanel(page) {
  await page.waitForFunction(() => {
    const walk = (root) => {
      const direct = root.querySelector?.("tasks-panel");
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    const panel = walk(document);
    const deepText = (root) => {
      let value = "";
      for (const node of root.childNodes || []) {
        if (node.nodeType === Node.TEXT_NODE) value += node.textContent || "";
        else {
          value += deepText(node);
          if (node.shadowRoot) value += deepText(node.shadowRoot);
        }
      }
      return value;
    };
    return panel?.snapshot?.tasks?.length >= 10
      && deepText(panel.shadowRoot).includes("Review emergency contacts");
  }, null, { timeout: uiWaitTimeout });
  await page.evaluate(() => document.fonts.ready);
}

async function openPanel(page) {
  await page.goto(`${baseUrl}/tasks`, { waitUntil: "domcontentloaded" });
  await waitForPanel(page);
}

async function waitForDialogContent(page, contentTag) {
  await page.waitForFunction((tag) => {
    const walk = (root, selector) => {
      const direct = root.querySelector?.(selector);
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot, selector);
          if (found) return found;
        }
      }
      return null;
    };
    const content = walk(document, tag);
    const dialog = walk(document, "ha-tasks-dialog");
    return Boolean(content && dialog?.open);
  }, contentTag, { timeout: 30_000 });
}

async function openTaskViewer(page) {
  await openPanel(page);
  await page.evaluate(async (taskName) => {
    const walk = (root) => {
      const direct = root.querySelector?.("tasks-panel");
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    const panel = walk(document);
    const task = panel.snapshot.tasks.find((item) => item.name === taskName);
    if (!task) throw new Error(`Screenshot task not found: ${taskName}`);
    panel.openTask(task);
  }, targetTaskName);
  await waitForDialogContent(page, "ha-tasks-task-viewer");
  await page.waitForTimeout(350);
}

async function openTaskEditor(page, { taskName = null, expandedBox = null } = {}) {
  await openPanel(page);
  await page.evaluate(async (name) => {
    const walk = (root) => {
      const direct = root.querySelector?.("tasks-panel");
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    const panel = walk(document);
    const task = name
      ? panel.snapshot.tasks.find((item) => item.name === name)
      : null;
    if (name && !task) throw new Error(`Screenshot task not found: ${name}`);
    if (task) panel.handleTaskAction("edit", task);
    else panel.shadowRoot.querySelector(".fab").click();
  }, taskName);
  await waitForDialogContent(page, "ha-tasks-task-form");
  await page.waitForFunction(() => {
    const walk = (root) => {
      const direct = root.querySelector?.("ha-tasks-task-form");
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    const form = walk(document);
    return Boolean(form && !form.loadingAssignments && !form.loadingDevices);
  }, null, { timeout: 30_000 });
  await page.evaluate((selectedHeading) => {
    const walk = (root) => {
      const direct = root.querySelector?.("ha-tasks-task-form");
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    const form = walk(document);
    for (const expandable of form.shadowRoot.querySelectorAll("ha-tasks-expandable")) {
      expandable.open = Boolean(
        selectedHeading && expandable.heading === selectedHeading,
      );
    }
  }, expandedBox);
  await page.waitForTimeout(350);
}

async function openDashboard(page) {
  await page.goto(`${baseUrl}/tasks-docs/tasks`, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForFunction(() => {
      const walk = (root) => {
        const direct = root.querySelector?.("tasks-card");
        if (direct) return direct;
        for (const node of root.querySelectorAll?.("*") || []) {
          if (node.shadowRoot) {
            const found = walk(node.shadowRoot);
            if (found) return found;
          }
        }
        return null;
      };
      const card = walk(document);
      const table = card?.shadowRoot?.querySelector("ha-tasks-task-table");
      return card?.snapshot?.tasks?.length >= 10
        && table?.shadowRoot?.querySelector("tbody tr");
    }, null, { timeout: uiWaitTimeout });
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      text: document.body.innerText.slice(0, 2000),
      cardDefined: Boolean(customElements.get("tasks-card")),
      elements: (() => {
        const found = [];
        const walk = (root) => {
          for (const node of root.querySelectorAll?.("*") || []) {
            if (
              node.localName === "tasks-card"
              || node.localName === "hui-error-card"
              || node.localName === "hui-view"
              || node.localName === "hui-masonry-view"
            ) {
              found.push({
                tag: node.localName,
                text: node.shadowRoot?.textContent?.trim().slice(0, 500)
                  || node.textContent?.trim().slice(0, 500)
                  || "",
              });
            }
            if (node.shadowRoot) walk(node.shadowRoot);
          }
        };
        walk(document);
        return found;
      })(),
    }));
    console.error("Dashboard diagnostics", diagnostics);
    await page.screenshot({ path: path.join(outputDir, "dashboard-diagnostics.png") });
    throw error;
  }
  await page.waitForTimeout(1000);
  await page.waitForFunction(() => {
    const walk = (root) => {
      const direct = root.querySelector?.("tasks-card");
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    const card = walk(document);
    const table = card?.shadowRoot?.querySelector("ha-tasks-task-table");
    return card?.snapshot?.tasks?.length >= 10
      && table?.shadowRoot?.querySelector("tbody tr");
  }, null, { timeout: uiWaitTimeout });
  await page.evaluate((fixedNow) => {
    const walk = (root) => {
      const direct = root.querySelector?.("tasks-card");
      if (direct) return direct;
      for (const node of root.querySelectorAll?.("*") || []) {
        if (node.shadowRoot) {
          const found = walk(node.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };
    const card = walk(document);
    card.snapshot = { ...card.snapshot, now: fixedNow };
    card.requestUpdate();
  }, referenceNow);
  await page.evaluate(() => document.fonts.ready);
}

async function capture(page, name) {
  await page.evaluate(() => {
    const hideNotificationManagers = (root) => {
      for (const manager of root.querySelectorAll?.("notification-manager") || []) {
        manager.style.setProperty("display", "none", "important");
      }
      for (const element of root.querySelectorAll?.("*") || []) {
        if (element.shadowRoot) hideNotificationManagers(element.shadowRoot);
      }
    };
    hideNotificationManagers(document);
  });
  await page.screenshot({
    path: path.join(outputDir, name),
    animations: "disabled",
    caret: "hide",
  });
  console.log(`Captured ${name}`);
}

async function captureMatrix(tokens) {
  const browser = await chromium.launch();
  try {
    for (const theme of themes) {
      const mobileContext = await browser.newContext({
        viewport: mobile.viewport,
        isMobile: mobile.isMobile,
        hasTouch: mobile.isMobile,
        locale: "en-US",
        timezoneId: "Europe/Zurich",
        colorScheme: theme,
        reducedMotion: "reduce",
        storageState: authenticationState(tokens),
      });
      const mobilePage = await mobileContext.newPage();
      await openDashboard(mobilePage);
      await capture(mobilePage, `dashboard-card-mobile-${theme}.png`);
      await mobileContext.close();

      const desktopContext = await browser.newContext({
        viewport: desktop.viewport,
        locale: "en-US",
        timezoneId: "Europe/Zurich",
        colorScheme: theme,
        reducedMotion: "reduce",
        storageState: authenticationState(tokens),
      });
      const page = await desktopContext.newPage();
      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type())) {
          console.error(`Browser ${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => console.error(`Browser error: ${error.stack || error.message || error}`));

      await openTaskViewer(page);
      await capture(page, `task-viewer-desktop-${theme}.png`);

      await openTaskEditor(page);
      await capture(page, `task-editor-new-desktop-${theme}.png`);

      for (const [name, selector] of editorBoxes) {
        await openTaskEditor(page, {
          taskName: targetTaskName,
          expandedBox: selector,
        });
        await capture(page, `task-editor-${name}-desktop-${theme}.png`);
      }
      await desktopContext.close();
    }
  } finally {
    await browser.close();
  }
}

await mkdir(outputDir, { recursive: true });
await waitForHomeAssistant();
const tokens = await completeOnboarding();
if (authOutput) {
  await mkdir(path.dirname(authOutput), { recursive: true });
  await writeFile(authOutput, JSON.stringify(tokens), "utf8");
}
await setupTasksIntegration(tokens.access_token);
const socket = new HomeAssistantSocket(tokens.access_token);
await socket.connect();
try {
  await seedUsers(socket);
  await seedData(socket, tokens.access_token);
} finally {
  socket.close();
}
await captureMatrix(tokens);
