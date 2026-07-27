import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import type { HomeAssistant, Task } from "./types";
import {
  actionMenuElementName,
  type ActionMenuItem,
} from "./ui/action-menu";
import { elementName } from "./version";

type SortKey = "name" | "due" | "trigger" | "status";
type SortDirection = "asc" | "desc";

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
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 20px;
    }

    .toolbar {
      display: flex;
      margin-bottom: 12px;
    }

    input {
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

    input:focus-visible,
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
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
      .trigger-column,
      .status-column {
        display: none;
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

  constructor() {
    super();
    this.tasks = [];
    this.search = "";
    this.sortKey = "due";
    this.sortDirection = "asc";
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
          !query ||
          [
            task.task_name,
            task.task_description,
            this.trigger(task),
            this.status(task),
          ].some((value) =>
            value
              ?.toLocaleLowerCase(this.hass?.locale?.language)
              .includes(query),
          ),
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
    return staticHtml`
      <div class="toolbar">
        <input
          type="search"
          aria-label="Search tasks"
          placeholder="Search tasks"
          .value=${this.search}
          @input=${(event: Event) => {
            this.search = (event.currentTarget as HTMLInputElement).value;
          }}
        >
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${this.header("Task", "name")}
              ${this.header("Due", "due", "due-column")}
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
                            ${this.due(task)} · ${this.trigger(task)} ·
                            ${this.status(task)}
                          </span>
                        </button>
                      </td>
                      <td class="due-column">${this.due(task)}</td>
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
                    <td class="empty" colspan="5">
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
