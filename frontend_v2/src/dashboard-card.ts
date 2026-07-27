import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  deleteTask,
  loadAssignmentOptions,
  setTaskActive,
  subscribeTasks,
} from "./api";
import { openTaskEditor } from "./task-form";
import { taskActions } from "./task-table";
import { openTaskViewer } from "./task-viewer";
import type {
  HomeAssistant,
  Task,
  TasksLabel,
  TasksSnapshot,
  TasksTag,
  TasksUser,
} from "./types";
import { actionMenuElementName } from "./ui/action-menu";
import { openTasksDialog } from "./ui/dialog";

type SecondaryInfo = "due" | "assignee" | "nfc_tag" | "labels";

interface CardConfig {
  type: string;
  show_action_menu: boolean;
  show_add_task: boolean;
  secondary_info: SecondaryInfo[];
  due_days: number | null;
  assignee_filter: string;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
    }>;
  }
}

const stableCardTag = "tasks-card-v2";
const editorElementName = "tasks-card-v2-editor";
const secondaryOptions: Array<{
  value: SecondaryInfo;
  label: string;
}> = [
  { value: "due", label: "Due" },
  { value: "assignee", label: "Assignee" },
  { value: "nfc_tag", label: "NFC tag" },
  { value: "labels", label: "Labels" },
];
const defaultConfig = (): CardConfig => ({
  type: `custom:${stableCardTag}`,
  show_action_menu: false,
  show_add_task: false,
  secondary_info: secondaryOptions.map((option) => option.value),
  due_days: 0,
  assignee_filter: "all",
});

const stubConfig = (): Partial<CardConfig> => {
  const { type: _type, ...config } = defaultConfig();
  return config;
};

const normalizeConfig = (
  value: Partial<CardConfig> = {},
): CardConfig => {
  const dueDays = Number(value.due_days);
  return {
    ...defaultConfig(),
    ...value,
    type: value.type || `custom:${stableCardTag}`,
    show_action_menu: value.show_action_menu === true,
    show_add_task: value.show_add_task === true,
    secondary_info: Array.isArray(value.secondary_info)
      ? value.secondary_info.filter(
          (item, index, values): item is SecondaryInfo =>
            secondaryOptions.some((option) => option.value === item) &&
            values.indexOf(item) === index,
        )
      : secondaryOptions.map((option) => option.value),
    due_days:
      value.due_days === null
        ? null
        : Number.isInteger(dueDays) && dueDays >= 0
          ? dueDays
          : 0,
    assignee_filter:
      typeof value.assignee_filter === "string" &&
      value.assignee_filter.trim()
        ? value.assignee_filter.trim()
        : "all",
  };
};

const dateKey = (value: string, timeZone?: string): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(new Date(value));
  const part = (type: string): string =>
    parts.find((item) => item.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

const addDays = (value: string, days: number): string => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
};

class TasksDashboardCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  static styles = css`
    :host {
      display: grid;
      gap: 18px;
      padding: 8px 0;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    fieldset {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-bottom: 4px;
      font-weight: 600;
    }

    label {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 36px;
    }

    label.field {
      display: grid;
      gap: 5px;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin: 0;
      accent-color: var(--primary-color);
    }

    input[type="number"],
    select {
      min-height: 40px;
      box-sizing: border-box;
      padding: 7px 10px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font: inherit;
    }
  `;

  declare hass?: HomeAssistant;
  declare config: CardConfig;

  constructor() {
    super();
    this.config = defaultConfig();
  }

  setConfig(config: Partial<CardConfig>): void {
    this.config = normalizeConfig(config);
  }

  private change(changes: Partial<CardConfig>): void {
    this.config = { ...this.config, ...changes };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config: this.config },
      }),
    );
  }

  protected render() {
    const customAssignee = !["all", "current_user"].includes(
      this.config.assignee_filter,
    );
    return html`
      <fieldset>
        <legend>Actions</legend>
        <label>
          <input
            type="checkbox"
            .checked=${this.config.show_action_menu}
            @change=${(event: Event) =>
              this.change({
                show_action_menu: (
                  event.currentTarget as HTMLInputElement
                ).checked,
              })}
          >
          Show task actions
        </label>
        <label>
          <input
            type="checkbox"
            .checked=${this.config.show_add_task}
            @change=${(event: Event) =>
              this.change({
                show_add_task: (
                  event.currentTarget as HTMLInputElement
                ).checked,
              })}
          >
          Show add task
        </label>
      </fieldset>
      <fieldset>
        <legend>Secondary information</legend>
        ${secondaryOptions.map(
          (option) => html`
            <label>
              <input
                type="checkbox"
                .checked=${this.config.secondary_info.includes(
                  option.value,
                )}
                @change=${(event: Event) => {
                  const checked = (
                    event.currentTarget as HTMLInputElement
                  ).checked;
                  this.change({
                    secondary_info: checked
                      ? [
                          ...this.config.secondary_info,
                          option.value,
                        ]
                      : this.config.secondary_info.filter(
                          (value) => value !== option.value,
                        ),
                  });
                }}
              >
              ${option.label}
            </label>
          `,
        )}
      </fieldset>
      <fieldset>
        <legend>Filters</legend>
        <label class="field">
          <span>Due within days (empty for all)</span>
          <input
            type="number"
            min="0"
            step="1"
            .value=${this.config.due_days === null
              ? ""
              : String(this.config.due_days)}
            @change=${(event: Event) => {
              const value = (
                event.currentTarget as HTMLInputElement
              ).value;
              this.change({
                due_days: value === "" ? null : Math.max(0, Number(value)),
              });
            }}
          >
        </label>
        <label class="field">
          <span>Assignee</span>
          <select
            .value=${this.config.assignee_filter}
            @change=${(event: Event) =>
              this.change({
                assignee_filter: (
                  event.currentTarget as HTMLSelectElement
                ).value,
              })}
          >
            <option value="all">All assignees</option>
            <option value="current_user">Logged-in user</option>
            ${customAssignee
              ? html`
                  <option value=${this.config.assignee_filter}>
                    ${this.config.assignee_filter}
                  </option>
                `
              : nothing}
          </select>
        </label>
      </fieldset>
    `;
  }
}

const actionMenuTag = unsafeStatic(actionMenuElementName);

class TasksDashboardCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    snapshot: { state: true },
    users: { state: true },
    tags: { state: true },
    labels: { state: true },
    error: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color));
      border: var(--ha-card-border-width, 1px) solid
        var(--ha-card-border-color, var(--divider-color));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      min-height: 56px;
      border-bottom: 1px solid var(--divider-color);
    }

    li:last-child {
      border-bottom: 0;
    }

    .row,
    .add {
      display: grid;
      min-width: 0;
      flex: 1;
      grid-template-columns: 14px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      align-self: stretch;
      padding: 8px 16px;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .row:hover,
    .add:hover {
      background: color-mix(
        in srgb,
        var(--primary-text-color) 4%,
        transparent
      );
    }

    .dot {
      width: 10px;
      height: 10px;
      background: var(--success-color, #43a047);
      border-radius: 50%;
    }

    .today .dot {
      background: var(--warning-color);
    }

    .overdue .dot {
      background: var(--error-color);
    }

    .copy {
      min-width: 0;
    }

    .name {
      display: block;
      overflow: hidden;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta {
      display: block;
      margin-top: 2px;
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .menu {
      flex: 0 0 48px;
      text-align: center;
    }

    .empty,
    .error {
      padding: 20px 16px;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .error {
      color: var(--error-color);
    }

    .add {
      grid-template-columns: 14px minmax(0, 1fr);
      color: var(--primary-color);
    }

    .plus {
      font-size: 22px;
      line-height: 1;
    }
  `;

  declare hass?: HomeAssistant;
  declare config: CardConfig;
  declare snapshot?: TasksSnapshot;
  declare users: TasksUser[];
  declare tags: TasksTag[];
  declare labels: TasksLabel[];
  declare error: string;

  private connection?: HomeAssistant["connection"];
  private unsubscribe?: () => void;

  static getStubConfig(): Partial<CardConfig> {
    return stubConfig();
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(editorElementName);
  }

  constructor() {
    super();
    this.config = defaultConfig();
    this.users = [];
    this.tags = [];
    this.labels = [];
    this.error = "";
  }

  setConfig(config: Partial<CardConfig>): void {
    if (!config || typeof config !== "object") {
      throw new Error("Card configuration is required");
    }
    this.config = normalizeConfig(config);
  }

  getCardSize(): number {
    return Math.max(1, Math.min(8, this.visibleTasks().length));
  }

  protected updated(): void {
    if (this.hass?.connection !== this.connection) {
      void this.connect();
    }
  }

  disconnectedCallback(): void {
    this.disconnect();
    super.disconnectedCallback();
  }

  private disconnect(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.connection = undefined;
  }

  private async connect(): Promise<void> {
    this.disconnect();
    if (!this.hass) {
      return;
    }
    const hass = this.hass;
    const connection = hass.connection;
    this.connection = connection;
    this.error = "";
    const assignments = loadAssignmentOptions(hass);
    try {
      const unsubscribe = await subscribeTasks(hass, (snapshot) => {
        this.snapshot = snapshot;
      });
      if (this.connection === connection) {
        this.unsubscribe = unsubscribe;
      } else {
        unsubscribe();
      }
    } catch (error) {
      if (this.connection === connection) {
        this.error = error instanceof Error ? error.message : String(error);
      }
    }
    try {
      const options = await assignments;
      if (this.connection === connection) {
        this.users = options.users;
        this.tags = options.tags;
        this.labels = options.labels;
      }
    } catch {
      // Tasks remain usable when registry metadata is unavailable.
    }
  }

  private timeZone(): string | undefined {
    return this.hass?.config?.time_zone;
  }

  private visibleTasks(): Task[] {
    if (!this.snapshot) {
      return [];
    }
    const today = dateKey(this.snapshot.now, this.timeZone());
    const limit =
      this.config.due_days === null
        ? undefined
        : addDays(today, this.config.due_days);
    const currentUserFilter =
      this.config.assignee_filter === "current_user";
    const currentUser = this.hass?.user?.id;
    const namedUsers = !["all", "current_user"].includes(
      this.config.assignee_filter,
    )
      ? new Set(
          this.users
            .filter(
              (user) =>
                user.name.localeCompare(
                  this.config.assignee_filter,
                  undefined,
                  { sensitivity: "accent" },
                ) === 0,
            )
            .map((user) => user.id),
        )
      : undefined;
    return this.snapshot.tasks
      .filter(
        (task) =>
          task.active !== false &&
          (!limit ||
            (!!task.task_due &&
              dateKey(task.task_due, this.timeZone()) <= limit)) &&
          (!currentUserFilter ||
            (!!currentUser && task.assignee_id === currentUser)) &&
          (!namedUsers || namedUsers.has(task.assignee_id || "")),
      )
      .sort((left, right) => {
        if (!!left.task_due !== !!right.task_due) {
          return left.task_due ? -1 : 1;
        }
        return (
          Date.parse(left.task_due || "") -
            Date.parse(right.task_due || "") ||
          left.task_name.localeCompare(
            right.task_name,
            this.hass?.locale?.language,
          )
        );
      });
  }

  private due(task: Task): string {
    if (!task.task_due || !this.snapshot) {
      return "";
    }
    const dueKey = dateKey(task.task_due, this.timeZone());
    const todayKey = dateKey(this.snapshot.now, this.timeZone());
    const difference =
      (Date.parse(`${dueKey}T00:00:00Z`) -
        Date.parse(`${todayKey}T00:00:00Z`)) /
      86_400_000;
    const relative =
      difference === -1
        ? "Yesterday"
        : difference === 0
          ? "Today"
          : difference === 1
            ? "Tomorrow"
            : difference === 2
              ? "In 2 days"
              : new Intl.DateTimeFormat(this.hass?.locale?.language, {
                  dateStyle: "medium",
                  timeZone: this.timeZone(),
                }).format(new Date(task.task_due));
    return difference >= 0 && difference <= 2
      ? `${relative} · ${new Intl.DateTimeFormat(
          this.hass?.locale?.language,
          {
            timeStyle: "short",
            timeZone: this.timeZone(),
          },
        ).format(new Date(task.task_due))}`
      : relative;
  }

  private dueStatus(task: Task): string {
    if (!task.task_due || !this.snapshot) {
      return "";
    }
    const due = dateKey(task.task_due, this.timeZone());
    const today = dateKey(this.snapshot.now, this.timeZone());
    return due < today ? "overdue" : due === today ? "today" : "future";
  }

  private metadata(task: Task): string {
    const values: Record<SecondaryInfo, string> = {
      due: this.due(task),
      assignee:
        this.users.find((user) => user.id === task.assignee_id)?.name || "",
      nfc_tag:
        this.tags.find((tag) => tag.id === task.nfc_tag_id)?.name || "",
      labels: this.labels
        .filter((label) => task.label_ids?.includes(label.label_id))
        .map((label) => label.name)
        .join(", "),
    };
    return this.config.secondary_info
      .map((key) => values[key])
      .filter(Boolean)
      .join(" · ");
  }

  private open(task: Task): void {
    if (this.hass) {
      void openTaskViewer(
        this.hass,
        task,
        this.snapshot?.attachments || [],
      );
    }
  }

  private action(task: Task, action: string): void {
    if (!this.hass) {
      return;
    }
    if (action === "open") {
      this.open(task);
    } else if (action === "edit") {
      void openTaskEditor(
        this.hass,
        task,
        this.snapshot?.attachments || [],
      );
    } else if (action === "active") {
      void setTaskActive(
        this.hass,
        task.task_id,
        task.active === false,
      );
    } else if (action === "delete") {
      void this.confirmDelete(task);
    }
  }

  private async confirmDelete(task: Task): Promise<void> {
    if (!this.hass) {
      return;
    }
    await openTasksDialog({
      heading: "Delete task?",
      content: html`<p>
        Delete “${task.task_name}” including its completion history and
        attachments?
      </p>`,
      actions: [
        { label: "Cancel", value: "cancel" },
        {
          label: "Delete",
          value: "delete",
          destructive: true,
          run: () => deleteTask(this.hass!, task.task_id),
        },
      ],
    });
  }

  protected render() {
    const tasks = this.visibleTasks();
    if (this.error) {
      return html`<article class="card error">${this.error}</article>`;
    }
    return staticHtml`
      <article class="card">
        <ul aria-label="Tasks">
          ${tasks.length
            ? tasks.map((task) => staticHtml`
                <li class=${this.dueStatus(task)}>
                  <button
                    class="row"
                    type="button"
                    @click=${() => this.open(task)}
                  >
                    <span class="dot" aria-hidden="true"></span>
                    <span class="copy">
                      <span class="name">${task.task_name}</span>
                      ${this.metadata(task)
                        ? html`<span class="meta">${this.metadata(task)}</span>`
                        : nothing}
                    </span>
                  </button>
                  ${this.config.show_action_menu
                    ? staticHtml`
                        <span class="menu">
                          <${actionMenuTag}
                            label="Actions for ${task.task_name}"
                            .items=${taskActions(task)}
                            @tasks-action=${(event: CustomEvent<string>) =>
                              this.action(task, event.detail)}
                          ></${actionMenuTag}>
                        </span>
                      `
                    : nothing}
                </li>
              `)
            : html`<li class="empty">No tasks</li>`}
          ${this.config.show_add_task
            ? html`
                <li>
                  <button
                    class="add"
                    type="button"
                    @click=${() =>
                      this.hass && void openTaskEditor(this.hass)}
                  >
                    <span class="plus" aria-hidden="true">+</span>
                    <span>Add task</span>
                  </button>
                </li>
              `
            : nothing}
        </ul>
      </article>
    `;
  }
}

if (!customElements.get(stableCardTag)) {
  customElements.define(stableCardTag, TasksDashboardCard);
}
if (!customElements.get(editorElementName)) {
  customElements.define(editorElementName, TasksDashboardCardEditor);
}

window.customCards ||= [];
if (!window.customCards.some((card) => card.type === stableCardTag)) {
  window.customCards.push({
    type: stableCardTag,
    name: "Tasks V2",
    description: "Tasks card using the owned V2 frontend.",
  });
}
