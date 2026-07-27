import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  loadAssignmentOptions,
  loadNotificationDevices,
} from "./api";
import type {
  HomeAssistant,
  Task,
  TasksDevice,
  TasksLabel,
  TasksUser,
} from "./types";
import {
  actionMenuElementName,
  type ActionMenuItem,
} from "./ui/action-menu";
import { elementName } from "./version";

type SortKey = "name" | "due" | "assignee" | "trigger" | "status";
type SortDirection = "asc" | "desc";
type FilterKey = "assignee" | "labels" | "notifications" | "trigger";
type Filters = Record<FilterKey, string[]>;

interface FilterOption {
  value: string;
  label: string;
}

const emptyFilters = (): Filters => ({
  assignee: [],
  labels: [],
  notifications: [],
  trigger: [],
});

const actionMenuTag = unsafeStatic(actionMenuElementName);
const taskActions = (task: Task): ActionMenuItem[] => [
  { label: "Open", value: "open" },
  { label: "Edit", value: "edit" },
  {
    label: task.active === false ? "Resume" : "Pause",
    value: "active",
  },
  { label: "Delete", value: "delete", destructive: true },
];

class TasksTaskTable extends LitElement {
  static properties = {
    hass: { attribute: false },
    tasks: { attribute: false },
    search: { state: true },
    sortKey: { state: true },
    sortDirection: { state: true },
    filters: { state: true },
    users: { state: true },
    labels: { state: true },
    devices: { state: true },
    registryError: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 20px;
    }

    .toolbar {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
    }

    .search {
      width: min(360px, 100%);
      min-height: 40px;
      box-sizing: border-box;
      padding: 8px 12px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font: inherit;
    }

    .search:focus-visible,
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    details {
      position: relative;
    }

    summary {
      min-height: 40px;
      box-sizing: border-box;
      padding: 9px 14px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      cursor: pointer;
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .filter-panel {
      position: absolute;
      z-index: 2;
      top: 46px;
      right: 0;
      width: min(560px, calc(100vw - 48px));
      box-sizing: border-box;
      padding: 16px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 6px 24px rgba(0, 0, 0, 0.28)
      );
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    fieldset {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-bottom: 6px;
      font-weight: 500;
    }

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 32px;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin: 0;
      accent-color: var(--primary-color);
    }

    .filter-footer {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }

    .filter-footer button {
      min-height: 36px;
      padding: 0 12px;
      color: var(--primary-color);
      background: transparent;
      border: 0;
      border-radius: 18px;
      font: inherit;
      cursor: pointer;
    }

    .filter-actions {
      display: flex;
      gap: 4px;
      margin-left: auto;
    }

    .registry-error {
      margin: 0;
      color: var(--error-color);
    }

    .table-wrap {
      overflow-x: auto;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      height: 52px;
      box-sizing: border-box;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      text-align: left;
      vertical-align: middle;
    }

    th {
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    th button,
    .task {
      padding: 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    th button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: inherit;
    }

    tbody tr:last-child td {
      border-bottom: 0;
    }

    tbody tr:hover {
      background: color-mix(
        in srgb,
        var(--primary-text-color) 4%,
        transparent
      );
    }

    .task {
      font-weight: 500;
    }

    .inactive .task {
      color: var(--secondary-text-color);
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }

    .status::before {
      width: 8px;
      height: 8px;
      background: var(--success-color, #43a047);
      border-radius: 50%;
      content: "";
    }

    .inactive .status::before {
      background: var(--error-color);
    }

    .actions {
      width: 48px;
      padding-right: 8px;
      padding-left: 8px;
      text-align: center;
    }

    .empty {
      padding: 28px 16px;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .mobile-details {
      display: none;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 400;
    }

    @media (max-width: 640px) {
      :host {
        margin-top: 16px;
      }

      .due-column,
      .assignee-column,
      .trigger-column,
      .status-column {
        display: none;
      }

      .toolbar {
        flex-wrap: wrap;
      }

      .search {
        flex: 1 1 220px;
      }

      .filter-panel {
        position: fixed;
        top: 16px;
        right: 16px;
        left: 16px;
        width: auto;
        max-height: calc(100dvh - 32px);
        overflow: auto;
      }

      .filter-grid {
        grid-template-columns: 1fr;
      }

      th,
      td {
        padding-right: 10px;
        padding-left: 10px;
      }

      .mobile-details {
        display: block;
      }
    }
  `;

  declare hass?: HomeAssistant;
  declare tasks: Task[];
  declare search: string;
  declare sortKey: SortKey;
  declare sortDirection: SortDirection;
  declare filters: Filters;
  declare users: TasksUser[];
  declare labels: TasksLabel[];
  declare devices: TasksDevice[];
  declare registryError: string;

  private registryConnection?: HomeAssistant["connection"];

  constructor() {
    super();
    this.tasks = [];
    this.search = "";
    this.sortKey = "due";
    this.sortDirection = "asc";
    this.filters = emptyFilters();
    this.users = [];
    this.labels = [];
    this.devices = [];
    this.registryError = "";
  }

  protected updated(): void {
    if (this.hass?.connection !== this.registryConnection) {
      void this.loadRegistries();
    }
  }

  private async loadRegistries(): Promise<void> {
    if (!this.hass) {
      return;
    }
    const hass = this.hass;
    const connection = hass.connection;
    this.registryConnection = connection;
    this.registryError = "";
    const [assignments, devices] = await Promise.allSettled([
      loadAssignmentOptions(hass),
      loadNotificationDevices(hass),
    ]);
    if (this.registryConnection !== connection) {
      return;
    }
    if (assignments.status === "fulfilled") {
      this.users = assignments.value.users;
      this.labels = assignments.value.labels;
    }
    if (devices.status === "fulfilled") {
      this.devices = devices.value;
    }
    if (
      assignments.status === "rejected" ||
      devices.status === "rejected"
    ) {
      this.registryError = "Some filter options could not be loaded";
    }
  }

  private trigger(task: Task): string {
    if (task.schedule_type === "sensor") {
      return "Problem sensor";
    }
    return task.schedule_type === "fixed"
      ? "Fixed schedule"
      : "After completion";
  }

  private status(task: Task): string {
    return task.active === false ? "Paused" : "Active";
  }

  private assignee(task: Task): string {
    return (
      this.users.find((user) => user.id === task.assignee_id)?.name ||
      "Unassigned"
    );
  }

  private taskLabels(task: Task): TasksLabel[] {
    const ids = new Set(task.label_ids || []);
    return this.labels
      .filter((label) => ids.has(label.label_id))
      .sort((left, right) =>
        left.name.localeCompare(
          right.name,
          this.hass?.locale?.language,
        ),
      );
  }

  private deviceName(device: TasksDevice): string {
    return (
      device.name_by_user ||
      device.name ||
      [device.manufacturer, device.model].filter(Boolean).join(" ") ||
      device.id
    );
  }

  private notificationDevices(task: Task): TasksDevice[] {
    const ids = new Set(task.notification_target?.device_id || []);
    return this.devices
      .filter((device) => ids.has(device.id))
      .sort((left, right) =>
        this.deviceName(left).localeCompare(
          this.deviceName(right),
          this.hass?.locale?.language,
        ),
      );
  }

  private filterValues(task: Task, key: FilterKey): string[] {
    if (key === "assignee") {
      const user = this.users.find((item) => item.id === task.assignee_id);
      return [user?.id || "__none__"];
    }
    if (key === "labels") {
      const values = this.taskLabels(task).map((label) => label.label_id);
      return values.length ? values : ["__none__"];
    }
    if (key === "notifications") {
      const values = [
        ...(task.notification_persistent ? ["panel"] : []),
        ...this.notificationDevices(task).map((device) => device.id),
      ];
      return values.length ? values : ["__none__"];
    }
    return [task.schedule_type];
  }

  private filterLabel(key: FilterKey, value: string): string {
    if (value === "__none__") {
      return key === "assignee"
        ? "Unassigned"
        : key === "labels"
          ? "No labels"
          : "No notifications";
    }
    if (key === "assignee") {
      return this.users.find((user) => user.id === value)?.name || value;
    }
    if (key === "labels") {
      return (
        this.labels.find((label) => label.label_id === value)?.name || value
      );
    }
    if (key === "notifications") {
      return value === "panel"
        ? "Persistent notification"
        : this.deviceName(
            this.devices.find((device) => device.id === value)!,
          );
    }
    return value === "sensor"
      ? "Problem sensor"
      : value === "fixed"
        ? "Fixed schedule"
        : "After completion";
  }

  private filterOptions(key: FilterKey): FilterOption[] {
    const values = new Set(
      this.tasks.flatMap((task) => this.filterValues(task, key)),
    );
    return [...values]
      .map((value) => ({ value, label: this.filterLabel(key, value) }))
      .sort((left, right) =>
        left.label.localeCompare(
          right.label,
          this.hass?.locale?.language,
        ),
      );
  }

  private matchesFilters(task: Task): boolean {
    return (Object.keys(this.filters) as FilterKey[]).every((key) => {
      const selected = this.filters[key];
      return (
        !selected.length ||
        this.filterValues(task, key).some((value) =>
          selected.includes(value),
        )
      );
    });
  }

  private dueValue(task: Task): number | undefined {
    if (task.active === false || !task.task_due) {
      return undefined;
    }
    const value = Date.parse(task.task_due);
    return Number.isNaN(value) ? undefined : value;
  }

  private due(task: Task): string {
    const value = this.dueValue(task);
    if (value === undefined) {
      return "—";
    }
    return new Intl.DateTimeFormat(this.hass?.locale?.language, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: this.hass?.config?.time_zone,
    }).format(value);
  }

  private compare(left: Task, right: Task): number {
    let result: number;
    if (this.sortKey === "due") {
      const leftDue = this.dueValue(left);
      const rightDue = this.dueValue(right);
      if (leftDue === undefined || rightDue === undefined) {
        if (leftDue === rightDue) {
          result = 0;
        } else {
          return leftDue === undefined ? 1 : -1;
        }
      } else {
        result = leftDue - rightDue;
      }
    } else {
      const value = (task: Task): string =>
        this.sortKey === "name"
          ? task.task_name
          : this.sortKey === "assignee"
            ? this.assignee(task)
          : this.sortKey === "trigger"
            ? this.trigger(task)
            : this.status(task);
      result = value(left).localeCompare(
        value(right),
        this.hass?.locale?.language,
      );
    }
    if (result !== 0) {
      return this.sortDirection === "asc" ? result : -result;
    }
    return left.task_name.localeCompare(
      right.task_name,
      this.hass?.locale?.language,
    );
  }

  private visibleTasks(): Task[] {
    const query = this.search.trim().toLocaleLowerCase(
      this.hass?.locale?.language,
    );
    return this.tasks
      .filter(
        (task) =>
          this.matchesFilters(task) &&
          (!query ||
            [
              task.task_name,
              task.task_description,
              this.assignee(task),
              this.taskLabels(task).map((label) => label.name).join(" "),
              this.notificationDevices(task)
                .map((device) => this.deviceName(device))
                .join(" "),
              this.trigger(task),
              this.status(task),
            ].some((value) =>
              value
                ?.toLocaleLowerCase(this.hass?.locale?.language)
                .includes(query),
            )),
      )
      .sort((left, right) => this.compare(left, right));
  }

  private sort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortKey = key;
      this.sortDirection = "asc";
    }
  }

  private sortLabel(key: SortKey): string {
    if (this.sortKey !== key) {
      return "";
    }
    return this.sortDirection === "asc" ? "↑" : "↓";
  }

  private toggleFilter(
    key: FilterKey,
    value: string,
    selected: boolean,
  ): void {
    const values = this.filters[key];
    this.filters = {
      ...this.filters,
      [key]: selected
        ? [...new Set([...values, value])]
        : values.filter((item) => item !== value),
    };
  }

  private selectedFilterCount(): number {
    return Object.values(this.filters).reduce(
      (count, values) => count + values.length,
      0,
    );
  }

  private filterGroup(
    label: string,
    key: FilterKey,
  ) {
    return html`
      <fieldset>
        <legend>${label}</legend>
        ${this.filterOptions(key).map(
          (option) => html`
            <label>
              <input
                type="checkbox"
                .checked=${this.filters[key].includes(option.value)}
                @change=${(event: Event) =>
                  this.toggleFilter(
                    key,
                    option.value,
                    (event.currentTarget as HTMLInputElement).checked,
                  )}
              >
              <span>${option.label}</span>
            </label>
          `,
        )}
      </fieldset>
    `;
  }

  private open(task: Task): void {
    this.dispatchEvent(
      new CustomEvent("tasks-task-open", {
        bubbles: true,
        composed: true,
        detail: task,
      }),
    );
  }

  private action(task: Task, action: string): void {
    this.dispatchEvent(
      new CustomEvent("tasks-task-action", {
        bubbles: true,
        composed: true,
        detail: { action, task },
      }),
    );
  }

  private header(label: string, key: SortKey, className = "") {
    return html`
      <th
        class=${className}
        aria-sort=${this.sortKey === key
          ? this.sortDirection === "asc"
            ? "ascending"
            : "descending"
          : "none"}
      >
        <button type="button" @click=${() => this.sort(key)}>
          ${label}
          ${this.sortKey === key
            ? html`<span aria-hidden="true">${this.sortLabel(key)}</span>`
            : nothing}
        </button>
      </th>
    `;
  }

  protected render() {
    const tasks = this.visibleTasks();
    const filterCount = this.selectedFilterCount();
    return staticHtml`
      <div class="toolbar">
        <input
          class="search"
          type="search"
          aria-label="Search tasks"
          placeholder="Search tasks"
          .value=${this.search}
          @input=${(event: Event) => {
            this.search = (event.currentTarget as HTMLInputElement).value;
          }}
        >
        <details>
          <summary>Filters${filterCount ? ` (${filterCount})` : ""}</summary>
          <div class="filter-panel">
            <div class="filter-grid">
              ${this.filterGroup("Assignment", "assignee")}
              ${this.filterGroup("Labels", "labels")}
              ${this.filterGroup("Notifications", "notifications")}
              ${this.filterGroup("Trigger", "trigger")}
            </div>
            <div class="filter-footer">
              ${this.registryError
                ? html`<p class="registry-error">${this.registryError}</p>`
                : html`<span></span>`}
              <div class="filter-actions">
                <button
                  type="button"
                  @click=${() => {
                    this.filters = emptyFilters();
                  }}
                >
                  Clear filters
                </button>
                <button
                  type="button"
                  @click=${() =>
                    this.renderRoot
                      .querySelector("details")
                      ?.removeAttribute("open")}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${this.header("Task", "name")}
              ${this.header("Due", "due", "due-column")}
              ${this.header("Assignee", "assignee", "assignee-column")}
              ${this.header("Trigger", "trigger", "trigger-column")}
              ${this.header("Status", "status", "status-column")}
              <th class="actions" aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            ${tasks.length
              ? tasks.map(
                  (task) => staticHtml`
                    <tr class=${task.active === false ? "inactive" : ""}>
                      <td>
                        <button
                          class="task"
                          type="button"
                          @click=${() => this.open(task)}
                        >
                          ${task.task_name}
                          <span class="mobile-details">
                            ${this.due(task)} · ${this.assignee(task)} ·
                            ${this.trigger(task)} · ${this.status(task)}
                          </span>
                        </button>
                      </td>
                      <td class="due-column">${this.due(task)}</td>
                      <td class="assignee-column">${this.assignee(task)}</td>
                      <td class="trigger-column">${this.trigger(task)}</td>
                      <td class="status-column">
                        <span class="status">${this.status(task)}</span>
                      </td>
                      <td class="actions">
                        <${actionMenuTag}
                          label="Actions for ${task.task_name}"
                          .items=${taskActions(task)}
                          @tasks-action=${(event: CustomEvent<string>) =>
                            this.action(task, event.detail)}
                        ></${actionMenuTag}>
                      </td>
                    </tr>
                  `,
                )
              : html`
                  <tr>
                    <td class="empty" colspan="6">
                      ${this.search ? "No matching tasks" : "No tasks"}
                    </td>
                  </tr>
                `}
          </tbody>
        </table>
      </div>
    `;
  }
}

export const taskTableElementName = elementName("task-table");

if (!customElements.get(taskTableElementName)) {
  customElements.define(taskTableElementName, TasksTaskTable);
}
