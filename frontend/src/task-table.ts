import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  loadAssignmentOptions,
  loadNotificationDevices,
  mutateTasks,
  type BulkTaskOperation,
} from "./api";
import { errorText, t } from "./localize";
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
import { openTasksDialog } from "./ui/dialog";
import { elementName } from "./version";

type SortKey = "name" | "due" | "assignee" | "trigger" | "status";
type SortDirection = "asc" | "desc";
type FilterKey = "assignee" | "labels" | "notifications" | "trigger";
type Filters = Record<FilterKey, string[]>;
type BulkAction =
  | ""
  | "complete"
  | "pause"
  | "resume"
  | "assign"
  | "add-label"
  | "remove-label"
  | "add-notification"
  | "remove-notification"
  | "delete";
type ColumnKey =
  | "due"
  | "assignee"
  | "labels"
  | "notifications"
  | "trigger"
  | "status";
type ColumnVisibility = Record<ColumnKey, boolean>;

interface FilterOption {
  value: string;
  label: string;
}

const localStorageKey = "tasks-table-state-v1";
const sessionStorageKey = "tasks-table-session-v1";
const columnLabels: Record<ColumnKey, string> = {
  due: "task.due",
  assignee: "table.assignee",
  labels: "task.labels",
  notifications: "table.notifications",
  trigger: "table.recurrence",
  status: "app.status",
};
const defaultColumns: ColumnVisibility = {
  due: true,
  assignee: true,
  labels: false,
  notifications: false,
  trigger: true,
  status: true,
};
const emptyFilters = (): Filters => ({
  assignee: [],
  labels: [],
  notifications: [],
  trigger: [],
});

const storedObject = (
  storageName: "localStorage" | "sessionStorage",
  key: string,
): Record<string, unknown> => {
  try {
    const storage = globalThis[storageName];
    const value = JSON.parse(storage?.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
};

const actionMenuTag = unsafeStatic(actionMenuElementName);
export const taskActions = (task: Task): ActionMenuItem[] => [
  { label: t("app.open"), value: "open" },
  { label: t("menu.edit"), value: "edit" },
  {
    label: task.active === false ? t("app.resume") : t("app.pause"),
    value: "active",
  },
  { label: t("common.delete"), value: "delete", destructive: true },
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
    columns: { state: true },
    selectedIds: { state: true },
    bulkAction: { state: true },
    bulkTarget: { state: true },
    bulkBusy: { state: true },
    bulkError: { state: true },
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

    .bulk-bar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
      padding: 10px 12px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .bulk-count {
      margin-right: auto;
      font-weight: 500;
    }

    .bulk-bar select,
    .bulk-bar button {
      min-height: 36px;
      box-sizing: border-box;
      padding: 0 10px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font: inherit;
    }

    .bulk-bar button {
      color: var(--primary-color);
      cursor: pointer;
    }

    .bulk-bar button:disabled {
      opacity: 0.55;
      cursor: default;
    }

    .bulk-error {
      flex-basis: 100%;
      margin: 0;
      color: var(--error-color);
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

    .popover-panel {
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

    .column-panel {
      width: 240px;
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

    .selection {
      width: 48px;
      padding-right: 8px;
      padding-left: 12px;
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
      .labels-column,
      .notifications-column,
      .trigger-column,
      .status-column {
        display: none;
      }

      .toolbar {
        flex-wrap: wrap;
      }

      .bulk-count {
        flex-basis: 100%;
      }

      .search {
        flex: 1 1 220px;
      }

      .popover-panel {
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
  declare columns: ColumnVisibility;
  declare selectedIds: string[];
  declare bulkAction: BulkAction;
  declare bulkTarget: string;
  declare bulkBusy: boolean;
  declare bulkError: string;

  private registryConnection?: HomeAssistant["connection"];

  constructor() {
    super();
    const local = storedObject("localStorage", localStorageKey);
    const session = storedObject("sessionStorage", sessionStorageKey);
    this.tasks = [];
    this.search = typeof session.search === "string" ? session.search : "";
    this.sortKey = ["name", "due", "assignee", "trigger", "status"].includes(
      String(local.sortKey),
    )
      ? (local.sortKey as SortKey)
      : "due";
    this.sortDirection =
      local.sortDirection === "desc" ? "desc" : "asc";
    const storedFilters =
      session.filters &&
      typeof session.filters === "object" &&
      !Array.isArray(session.filters)
        ? (session.filters as Record<string, unknown>)
        : {};
    this.filters = Object.fromEntries(
      (Object.keys(emptyFilters()) as FilterKey[]).map((key) => [
        key,
        Array.isArray(storedFilters[key])
          ? storedFilters[key].filter(
              (value): value is string => typeof value === "string",
            )
          : [],
      ]),
    ) as Filters;
    const storedColumns =
      local.columns &&
      typeof local.columns === "object" &&
      !Array.isArray(local.columns)
        ? (local.columns as Record<string, unknown>)
        : {};
    this.columns = Object.fromEntries(
      (Object.keys(defaultColumns) as ColumnKey[]).map((key) => [
        key,
        typeof storedColumns[key] === "boolean"
          ? storedColumns[key]
          : defaultColumns[key],
      ]),
    ) as ColumnVisibility;
    this.users = [];
    this.labels = [];
    this.devices = [];
    this.registryError = "";
    this.selectedIds = [];
    this.bulkAction = "";
    this.bulkTarget = "";
    this.bulkBusy = false;
    this.bulkError = "";
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
      this.registryError = t("app.registry_load_error");
    }
  }

  private trigger(task: Task): string {
    if (task.schedule.type === "sensor") {
      return t("task.problem_sensor");
    }
    return task.schedule.type === "fixed"
      ? t("task.fixed")
      : t("task.sliding");
  }

  private status(task: Task): string {
    return task.active === false ? t("app.paused") : t("app.active");
  }

  private assignee(task: Task): string {
    return (
      this.users.find((user) => user.id === task.assignee_id)?.name ||
      t("task.unassigned")
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
    const ids = new Set(task.notification.device_ids || []);
    return this.devices
      .filter((device) => ids.has(device.id))
      .sort((left, right) =>
        this.deviceName(left).localeCompare(
          this.deviceName(right),
          this.hass?.locale?.language,
        ),
      );
  }

  private labelsText(task: Task): string {
    return this.taskLabels(task).map((label) => label.name).join(", ") || "—";
  }

  private notificationsText(task: Task): string {
    return [
      ...(task.notification.persistent
        ? [t("task.notification_persistent")]
        : []),
      ...this.notificationDevices(task).map((device) =>
        this.deviceName(device),
      ),
    ].join(", ") || "—";
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
        ...(task.notification.persistent ? ["panel"] : []),
        ...this.notificationDevices(task).map((device) => device.id),
      ];
      return values.length ? values : ["__none__"];
    }
    return [task.schedule.type];
  }

  private filterLabel(key: FilterKey, value: string): string {
    if (value === "__none__") {
      return key === "assignee"
        ? t("task.unassigned")
        : key === "labels"
          ? t("task.no_labels")
          : t("app.no_notifications");
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
        ? t("task.notification_persistent")
        : this.deviceName(
            this.devices.find((device) => device.id === value)!,
          );
    }
    return value === "sensor"
      ? t("task.problem_sensor")
      : value === "fixed"
        ? t("task.fixed")
        : t("task.sliding");
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
    if (task.active === false || !task.due) {
      return undefined;
    }
    const value = Date.parse(task.due);
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
          ? task.name
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
    return left.name.localeCompare(
      right.name,
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
              task.name,
              task.description,
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
    this.storeLocalView();
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
    this.storeSessionView();
  }

  private toggleColumn(key: ColumnKey, visible: boolean): void {
    this.columns = { ...this.columns, [key]: visible };
    this.storeLocalView();
  }

  private storeLocalView(): void {
    try {
      globalThis.localStorage?.setItem(
        localStorageKey,
        JSON.stringify({
          sortKey: this.sortKey,
          sortDirection: this.sortDirection,
          columns: this.columns,
        }),
      );
    } catch {
      // Storage can be unavailable in private or locked-down WebViews.
    }
  }

  private storeSessionView(): void {
    try {
      globalThis.sessionStorage?.setItem(
        sessionStorageKey,
        JSON.stringify({
          search: this.search,
          filters: this.filters,
        }),
      );
    } catch {
      // Storage can be unavailable in private or locked-down WebViews.
    }
  }

  private columnText(task: Task, key: ColumnKey): string {
    if (key === "due") {
      return this.due(task);
    }
    if (key === "assignee") {
      return this.assignee(task);
    }
    if (key === "labels") {
      return this.labelsText(task);
    }
    if (key === "notifications") {
      return this.notificationsText(task);
    }
    return key === "trigger" ? this.trigger(task) : this.status(task);
  }

  private mobileDetails(task: Task): string {
    return (Object.keys(this.columns) as ColumnKey[])
      .filter(
        (key) =>
          this.columns[key] && this.columnText(task, key) !== "—",
      )
      .map((key) => this.columnText(task, key))
      .join(" · ");
  }

  private visibleColumnCount(): number {
    return Object.values(this.columns).filter(Boolean).length + 3;
  }

  private selectedTasks(): Task[] {
    const ids = new Set(this.selectedIds);
    return this.tasks.filter((task) => ids.has(task.id));
  }

  private toggleTask(taskId: string, selected: boolean): void {
    this.selectedIds = selected
      ? [...new Set([...this.selectedIds, taskId])]
      : this.selectedIds.filter((id) => id !== taskId);
  }

  private toggleVisible(tasks: Task[], selected: boolean): void {
    const ids = new Set(this.selectedIds);
    for (const task of tasks) {
      if (selected) {
        ids.add(task.id);
      } else {
        ids.delete(task.id);
      }
    }
    this.selectedIds = [...ids];
  }

  private bulkTargets(): FilterOption[] {
    if (this.bulkAction === "assign") {
      return [
        { value: "__none__", label: t("task.unassigned") },
        ...this.users.map((user) => ({
          value: user.id,
          label: user.name,
        })),
      ];
    }
    if (
      this.bulkAction === "add-label" ||
      this.bulkAction === "remove-label"
    ) {
      return this.labels.map((label) => ({
        value: label.label_id,
        label: label.name,
      }));
    }
    if (
      this.bulkAction === "add-notification" ||
      this.bulkAction === "remove-notification"
    ) {
      return [
        { value: "panel", label: t("task.notification_persistent") },
        ...this.devices.map((device) => ({
          value: device.id,
          label: this.deviceName(device),
        })),
      ];
    }
    return [];
  }

  private bulkNeedsTarget(): boolean {
    return [
      "assign",
      "add-label",
      "remove-label",
      "add-notification",
      "remove-notification",
    ].includes(this.bulkAction);
  }

  private bulkOperations(): BulkTaskOperation[] {
    return this.selectedTasks().map((task) => {
      if (this.bulkAction === "complete") {
        return { action: "complete", id: task.id, notes: null };
      }
      if (this.bulkAction === "delete") {
        return { action: "delete", id: task.id };
      }
      let changes: Partial<Task>;
      if (this.bulkAction === "pause" || this.bulkAction === "resume") {
        changes = { active: this.bulkAction === "resume" };
      } else if (this.bulkAction === "assign") {
        changes = {
          assignee_id:
            this.bulkTarget === "__none__" ? null : this.bulkTarget,
        };
      } else if (
        this.bulkAction === "add-label" ||
        this.bulkAction === "remove-label"
      ) {
        const labels = task.label_ids || [];
        changes = {
          label_ids:
            this.bulkAction === "remove-label"
              ? labels.filter((id) => id !== this.bulkTarget)
              : [...new Set([...labels, this.bulkTarget])],
        };
      } else {
        const devices = task.notification.device_ids || [];
        if (this.bulkTarget === "panel") {
          changes = {
            notification: {
              ...task.notification,
              persistent: this.bulkAction === "add-notification",
            },
          };
        } else {
          changes = {
            notification: {
              ...task.notification,
              device_ids:
                this.bulkAction === "remove-notification"
                  ? devices.filter((id) => id !== this.bulkTarget)
                  : [...new Set([...devices, this.bulkTarget])],
            },
          };
        }
      }
      return { action: "update", id: task.id, changes };
    });
  }

  private async applyBulk(): Promise<void> {
    if (
      !this.hass ||
      this.bulkBusy ||
      !this.bulkAction ||
      (this.bulkNeedsTarget() && !this.bulkTarget)
    ) {
      return;
    }
    const operations = this.bulkOperations();
    if (!operations.length) {
      return;
    }
    if (this.bulkAction === "complete" || this.bulkAction === "delete") {
      const deleting = this.bulkAction === "delete";
      const result = await openTasksDialog({
        heading: deleting
          ? t("bulk.delete_title")
          : t("bulk.complete_title"),
        content: html`<p>
          ${deleting
            ? t("bulk.delete_confirm", { count: operations.length })
            : t("bulk.complete_confirm", { count: operations.length })}
        </p>`,
        actions: [
          { label: t("common.cancel"), value: "cancel" },
          {
            label: deleting ? t("common.delete") : t("app.complete"),
            value: "confirm",
            destructive: deleting,
          },
        ],
      });
      if (result !== "confirm") {
        return;
      }
    }
    this.bulkBusy = true;
    this.bulkError = "";
    try {
      await mutateTasks(this.hass, operations);
      this.selectedIds = [];
      this.bulkAction = "";
      this.bulkTarget = "";
    } catch (error) {
      this.bulkError = errorText(error);
    } finally {
      this.bulkBusy = false;
    }
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

  private closePanel(event: Event): void {
    (event.currentTarget as HTMLElement)
      .closest("details")
      ?.removeAttribute("open");
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

  private columnHeader(key: ColumnKey) {
    const className = `${key}-column`;
    return key === "labels" || key === "notifications"
      ? html`<th class=${className}>${t(columnLabels[key])}</th>`
      : this.header(t(columnLabels[key]), key, className);
  }

  private columnCell(task: Task, key: ColumnKey) {
    const value = this.columnText(task, key);
    return html`
      <td class=${`${key}-column`}>
        ${key === "status"
          ? html`<span class="status">${value}</span>`
          : value}
      </td>
    `;
  }

  protected render() {
    const tasks = this.visibleTasks();
    const filterCount = this.selectedFilterCount();
    const visibleColumns = (Object.keys(this.columns) as ColumnKey[]).filter(
      (key) => this.columns[key],
    );
    const selectedTasks = this.selectedTasks();
    const selectedIds = new Set(this.selectedIds);
    const allVisibleSelected =
      tasks.length > 0 &&
      tasks.every((task) => selectedIds.has(task.id));
    const someVisibleSelected = tasks.some((task) =>
      selectedIds.has(task.id),
    );
    const bulkTargets = this.bulkTargets();
    return staticHtml`
      <div class="toolbar">
        <input
          class="search"
          type="search"
          aria-label=${t("table.search")}
          placeholder=${t("table.search")}
          .value=${this.search}
          @input=${(event: Event) => {
            this.search = (event.currentTarget as HTMLInputElement).value;
            this.storeSessionView();
          }}
        >
        <details>
          <summary>${t("table.filters")}${filterCount ? ` (${filterCount})` : ""}</summary>
          <div class="popover-panel">
            <div class="filter-grid">
              ${this.filterGroup(t("task.assignment"), "assignee")}
              ${this.filterGroup(t("task.labels"), "labels")}
              ${this.filterGroup(t("table.notifications"), "notifications")}
              ${this.filterGroup(t("table.recurrence"), "trigger")}
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
                    this.storeSessionView();
                  }}
                >
                  ${t("table.reset_filters")}
                </button>
                <button
                  type="button"
                  @click=${this.closePanel}
                >
                  ${t("app.done")}
                </button>
              </div>
            </div>
          </div>
        </details>
        <details>
          <summary>${t("table.columns")}</summary>
          <div class="popover-panel column-panel">
            <fieldset>
              <legend>${t("app.visible_columns")}</legend>
              ${(Object.keys(columnLabels) as ColumnKey[]).map(
                (key) => html`
                  <label>
                    <input
                      type="checkbox"
                      .checked=${this.columns[key]}
                      @change=${(event: Event) =>
                        this.toggleColumn(
                          key,
                          (event.currentTarget as HTMLInputElement).checked,
                        )}
                    >
                    <span>${t(columnLabels[key])}</span>
                  </label>
                `,
              )}
            </fieldset>
            <div class="filter-footer">
              <span></span>
              <button type="button" @click=${this.closePanel}>
                ${t("app.done")}
              </button>
            </div>
          </div>
        </details>
      </div>
      ${selectedTasks.length
        ? html`
            <div class="bulk-bar">
              <span class="bulk-count">
                ${t("app.selected", { count: selectedTasks.length })}
              </span>
              <select
                aria-label=${t("bulk.actions")}
                .value=${this.bulkAction}
                @change=${(event: Event) => {
                  this.bulkAction = (
                    event.currentTarget as HTMLSelectElement
                  ).value as BulkAction;
                  this.bulkTarget = "";
                  this.bulkError = "";
                }}
              >
                <option value="">${t("app.choose_action")}</option>
                <option value="complete">${t("bulk.complete")}</option>
                <option value="pause">${t("app.pause")}</option>
                <option value="resume">${t("app.resume")}</option>
                <option value="assign">${t("bulk.assign_person")}</option>
                <option value="add-label">${t("app.add_label")}</option>
                <option value="remove-label">${t("app.remove_label")}</option>
                <option value="add-notification">${t("app.add_notification")}</option>
                <option value="remove-notification">${t("app.remove_notification")}</option>
                <option value="delete">${t("bulk.delete")}</option>
              </select>
              ${bulkTargets.length
                ? html`
                    <select
                      aria-label=${t("app.choose_target")}
                      .value=${this.bulkTarget}
                      @change=${(event: Event) => {
                        this.bulkTarget = (
                          event.currentTarget as HTMLSelectElement
                        ).value;
                      }}
                    >
                      <option value="">${t("app.choose_target")}</option>
                      ${bulkTargets.map(
                        (option) => html`
                          <option value=${option.value}>
                            ${option.label}
                          </option>
                        `,
                      )}
                    </select>
                  `
                : nothing}
              <button
                type="button"
                ?disabled=${this.bulkBusy ||
                !this.bulkAction ||
                (this.bulkNeedsTarget() && !this.bulkTarget)}
                @click=${() => void this.applyBulk()}
              >
                ${this.bulkBusy ? t("app.applying") : t("app.apply")}
              </button>
              <button
                type="button"
                ?disabled=${this.bulkBusy}
                @click=${() => {
                  this.selectedIds = [];
                  this.bulkAction = "";
                  this.bulkTarget = "";
                  this.bulkError = "";
                }}
              >
                ${t("app.clear")}
              </button>
              ${this.bulkError
                ? html`<p class="bulk-error">${this.bulkError}</p>`
                : nothing}
            </div>
          `
        : nothing}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="selection">
                <input
                  type="checkbox"
                  aria-label=${t("app.select_visible")}
                  .checked=${allVisibleSelected}
                  .indeterminate=${someVisibleSelected &&
                  !allVisibleSelected}
                  @change=${(event: Event) =>
                    this.toggleVisible(
                      tasks,
                      (event.currentTarget as HTMLInputElement).checked,
                    )}
                >
              </th>
              ${this.header(t("table.task"), "name")}
              ${visibleColumns.map((key) => this.columnHeader(key))}
              <th class="actions" aria-label=${t("task.actions")}></th>
            </tr>
          </thead>
          <tbody>
            ${tasks.length
              ? tasks.map(
                  (task) => staticHtml`
                    <tr
                      class=${task.active === false ? "inactive" : ""}
                      aria-selected=${selectedIds.has(task.id)}
                    >
                      <td class="selection">
                        <input
                          type="checkbox"
                          aria-label=${t("app.select_task", {
                            name: task.name,
                          })}
                          .checked=${selectedIds.has(task.id)}
                          @change=${(event: Event) =>
                            this.toggleTask(
                              task.id,
                              (event.currentTarget as HTMLInputElement)
                                .checked,
                            )}
                        >
                      </td>
                      <td>
                        <button
                          class="task"
                          type="button"
                          @click=${() => this.open(task)}
                        >
                          ${task.name}
                          <span class="mobile-details">
                            ${this.mobileDetails(task)}
                          </span>
                        </button>
                      </td>
                      ${visibleColumns.map((key) =>
                        this.columnCell(task, key))}
                      <td class="actions">
                        <${actionMenuTag}
                          label=${t("app.actions_for", {
                            name: task.name,
                          })}
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
                    <td class="empty" colspan=${this.visibleColumnCount()}>
                      ${this.search ? t("table.empty") : t("app.no_tasks")}
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
