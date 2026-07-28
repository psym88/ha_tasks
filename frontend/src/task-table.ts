import { css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  loadAssignmentOptions,
  loadNotificationDevices,
  mutateTasks,
  type BulkTaskOperation,
} from "./api";
import { errorText, t } from "./localize";
import { LocalizedLitElement } from "./localized-element";
import type {
  HomeAssistant,
  Task,
  TasksDevice,
  TasksLabel,
  TasksTag,
  TasksUser,
} from "./types";
import {
  actionMenuElementName,
  type ActionMenuItem,
} from "./ui/action-menu";
import { openTasksDialog } from "./ui/dialog";
import { elementName } from "./version";

type FilterKey =
  | "assignee"
  | "labels"
  | "notifications"
  | "trigger"
  | "status";
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
  | "nfc"
  | "files"
  | "labels"
  | "notifications"
  | "trigger"
  | "status";
type ColumnVisibility = Record<ColumnKey, boolean>;

interface FilterOption {
  value: string;
  label: string;
}

const localStorageKey = "tasks-table-state-v2";
const sessionStorageKey = "tasks-table-session-v1";
const columnLabels: Record<ColumnKey, string> = {
  due: "task.due",
  assignee: "table.assignee",
  nfc: "task.nfc_tag_id",
  files: "task.files",
  labels: "task.labels",
  notifications: "table.notifications",
  trigger: "table.recurrence",
  status: "app.status",
};
const defaultColumns: ColumnVisibility = {
  due: true,
  assignee: true,
  nfc: true,
  files: true,
  labels: false,
  notifications: false,
  trigger: false,
  status: false,
};
const emptyFilters = (): Filters => ({
  assignee: [],
  labels: [],
  notifications: [],
  trigger: [],
  status: [],
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
  { label: t("menu.edit"), value: "edit", icon: "mdi:pencil-outline" },
  {
    label: task.active === false ? t("app.resume") : t("app.pause"),
    value: "active",
    icon:
      task.active === false
        ? "mdi:play-circle-outline"
        : "mdi:pause-circle-outline",
  },
  {
    label: t("common.delete"),
    value: "delete",
    icon: "mdi:delete-outline",
    destructive: true,
  },
];

const bulkActions = (): ActionMenuItem[] => [
  { label: t("bulk.complete"), value: "complete", icon: "mdi:check-circle-outline" },
  { label: t("app.pause"), value: "pause", icon: "mdi:pause-circle-outline" },
  { label: t("app.resume"), value: "resume", icon: "mdi:play-circle-outline" },
  { label: t("bulk.assign_person"), value: "assign", icon: "mdi:account-outline" },
  { label: t("app.add_label"), value: "add-label", icon: "mdi:tag-plus-outline" },
  {
    label: t("app.remove_label"),
    value: "remove-label",
    icon: "mdi:tag-minus-outline",
  },
  {
    label: t("app.add_notification"),
    value: "add-notification",
    icon: "mdi:bell-plus-outline",
  },
  {
    label: t("app.remove_notification"),
    value: "remove-notification",
    icon: "mdi:bell-minus-outline",
  },
  {
    label: t("bulk.delete"),
    value: "delete",
    icon: "mdi:delete-outline",
    destructive: true,
  },
];

class TasksTaskTable extends LocalizedLitElement {
  static properties = {
    hass: { attribute: false },
    tasks: { attribute: false },
    search: { state: true },
    filters: { state: true },
    openFilterGroups: { state: true },
    users: { state: true },
    labels: { state: true },
    devices: { state: true },
    registryError: { state: true },
    columns: { state: true },
    selectedIds: { state: true },
    bulkAction: { state: true },
    bulkTarget: { state: true },
    openBulkPicker: { state: true },
    bulkBusy: { state: true },
    bulkError: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 20px;
    }

    .toolbar {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .selection-toolbar {
      display: flex;
      min-width: 0;
      flex: 1;
      align-items: center;
      gap: 8px;
    }

    .bulk-bar {
      display: grid;
      gap: 8px;
      width: 280px;
    }

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
      margin: 0;
      color: var(--error-color);
    }

    .bulk-menu .popover-panel {
      width: 312px;
    }

    .bulk-menu > summary {
      color: var(--primary-color);
    }

    .bulk-action-picker {
      overflow: hidden;
    }

    .bulk-action-picker + .bulk-action-picker {
      border-top: 1px solid var(--divider-color);
    }

    .bulk-bar .bulk-action-picker-trigger {
      display: flex;
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      gap: var(--ha-space-3);
      padding: 0 var(--ha-space-4);
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }

    .bulk-bar .bulk-action-picker-trigger:hover {
      background: var(--secondary-background-color);
    }

    .bulk-action-picker-trigger ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }

    .bulk-action-picker-trigger .picker-chevron {
      margin-inline-start: auto;
      transition: transform 200ms ease;
    }

    .bulk-action-picker.open .picker-chevron {
      transform: rotate(180deg);
    }

    .bulk-action-content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease;
    }

    .bulk-action-picker.open .bulk-action-content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .bulk-action-list {
      display: grid;
      min-height: 0;
      max-height: min(336px, 42dvh);
      overflow-y: auto;
      border-top: 1px solid var(--divider-color);
    }

    .bulk-bar .bulk-action {
      display: flex;
      min-height: 48px;
      align-items: center;
      gap: var(--ha-space-3);
      padding: 0 var(--ha-space-4);
      color: var(--secondary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      text-align: start;
    }

    .bulk-bar .bulk-action + .bulk-action {
      border-top: 1px solid var(--divider-color);
    }

    .bulk-bar .bulk-action:hover,
    .bulk-bar .bulk-action.selected {
      background: var(--secondary-background-color);
    }

    .bulk-bar .bulk-action.selected {
      color: var(--primary-color);
    }

    .bulk-action ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }

    .bulk-bar .bulk-action.destructive,
    .bulk-action.destructive ha-icon {
      color: var(--error-color);
    }

    .bulk-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--ha-space-2);
      padding-top: var(--ha-space-2);
    }

    .search {
      width: min(360px, 100%);
      min-width: 0;
      min-height: 40px;
      flex: 1;
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

    .toolbar > details[open] > summary,
    .selection-toolbar > details[open] > summary {
      color: var(--primary-color);
      background: var(--secondary-background-color);
      border-color: var(--primary-color);
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
      border-radius: var(--ha-border-radius-lg);
      box-shadow: var(--ha-box-shadow-m, var(--ha-card-box-shadow));
    }

    .column-panel,
    .filter-panel {
      width: 312px;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ha-space-2);
      width: 100%;
    }

    .filter-category {
      position: static;
      width: 100%;
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .filter-category-heading {
      display: flex;
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      padding: 0 var(--ha-space-4);
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      font: inherit;
      font-weight: var(--ha-font-weight-medium);
      text-align: start;
      cursor: pointer;
    }

    .filter-category-heading .filter-chevron {
      margin-inline-start: auto;
      color: var(--secondary-text-color);
      transition: transform 200ms ease;
    }

    .filter-category-count {
      margin-inline-start: var(--ha-space-2);
      color: var(--secondary-text-color);
      font-weight: var(--ha-font-weight-normal);
    }

    .filter-category.open .filter-chevron {
      transform: rotate(180deg);
    }

    .filter-category-content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease;
    }

    .filter-category.open .filter-category-content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .filter-category fieldset {
      min-height: 0;
      overflow: hidden;
      display: grid;
      box-sizing: border-box;
      padding: 0;
      border-top: 1px solid var(--divider-color);
    }

    fieldset {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    ha-checkbox {
      min-height: 32px;
    }

    .column-options {
      display: grid;
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .option-row {
      display: flex;
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      align-items: center;
      justify-content: flex-start;
      gap: var(--ha-space-3);
      padding-inline: var(--ha-space-4);
      color: var(--secondary-text-color);
      background: transparent;
      border: 0;
      border-radius: 0;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }

    .option-row ha-icon {
      --mdc-icon-size: 20px;
      margin-inline-start: auto;
    }

    .option-row + .option-row {
      border-top: 1px solid var(--divider-color);
    }

    .option-row:hover,
    .option-row.active {
      background: var(--secondary-background-color);
    }

    .option-row.active {
      color: var(--primary-color);
      font-weight: var(--ha-font-weight-medium);
    }

    .filter-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--ha-space-2);
      margin-top: 0;
      padding-top: var(--ha-space-2);
    }

    .registry-error {
      margin: 0;
      color: var(--error-color);
    }

    @media (prefers-reduced-motion: reduce) {
      .bulk-action-content,
      .picker-chevron,
      .filter-category-content,
      .filter-chevron {
        transition: none;
      }
    }

    .table-wrap {
      overflow-x: auto;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
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

    tbody tr {
      cursor: pointer;
    }

    .task-name {
      font-weight: 500;
    }

    .inactive .task-name {
      color: var(--secondary-text-color);
    }

    .inactive td {
      color: var(--secondary-text-color);
    }

    .inactive {
      background: color-mix(
        in srgb,
        var(--secondary-text-color) 5%,
        transparent
      );
    }

    .icon {
      width: 40px;
      padding-right: 4px;
      padding-left: 12px;
      text-align: center;
    }

    .icon ha-icon {
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
      background: var(--success-color);
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
      position: relative;
      width: 48px;
      padding-top: 0;
      padding-right: 8px;
      padding-bottom: 0;
      padding-left: 12px;
      line-height: 0;
      text-align: center;
    }

    .selection ha-checkbox {
      position: absolute;
      top: 50%;
      left: 50%;
      display: block;
      min-height: 0;
      transform: translate(-50%, -50%);
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
      .files-column,
      .nfc-column,
      .labels-column,
      .notifications-column,
      .trigger-column,
      .status-column {
        display: none;
      }

      .toolbar {
        flex-wrap: wrap;
      }

      .search {
        flex: 1;
      }

      .toolbar > details,
      .selection-toolbar > details {
        position: static;
      }

      .toolbar .popover-panel {
        top: calc(100% + 6px);
        right: 0;
        left: 0;
        width: auto;
        max-width: none;
        max-height: calc(100dvh - 96px);
        overflow: auto;
      }

      .bulk-bar {
        width: 100%;
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
  declare filters: Filters;
  declare openFilterGroups: FilterKey[];
  declare users: TasksUser[];
  declare labels: TasksLabel[];
  declare tags: TasksTag[];
  declare devices: TasksDevice[];
  declare registryError: string;
  declare columns: ColumnVisibility;
  declare selectedIds: string[];
  declare bulkAction: BulkAction;
  declare bulkTarget: string;
  declare openBulkPicker: "" | "action" | "target";
  declare bulkBusy: boolean;
  declare bulkError: string;

  private registryConnection?: HomeAssistant["connection"];
  private readonly closePanels = (event: Event): void => {
    const path = event.composedPath();
    for (const details of this.renderRoot.querySelectorAll("details[open]")) {
      if (!path.includes(details)) {
        details.removeAttribute("open");
      }
    }
  };

  constructor() {
    super();
    const local = storedObject("localStorage", localStorageKey);
    const session = storedObject("sessionStorage", sessionStorageKey);
    this.tasks = [];
    this.search = typeof session.search === "string" ? session.search : "";
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
    this.openFilterGroups = [];
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
    this.tags = [];
    this.devices = [];
    this.registryError = "";
    this.selectedIds = [];
    this.bulkAction = "";
    this.bulkTarget = "";
    this.openBulkPicker = "";
    this.bulkBusy = false;
    this.bulkError = "";
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this.closePanels);
  }

  disconnectedCallback(): void {
    document.removeEventListener("click", this.closePanels);
    super.disconnectedCallback();
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
      this.tags = assignments.value.tags;
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

  private nfcTag(task: Task): string {
    if (!task.nfc_tag_id) {
      return "—";
    }
    return (
      this.tags.find((tag) => tag.id === task.nfc_tag_id)?.name ||
      task.nfc_tag_id
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
    if (key === "status") {
      return [task.active === false ? "paused" : "active"];
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
    if (key === "status") {
      return value === "paused" ? t("app.paused") : t("app.active");
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

  private compareDue(left: Task, right: Task): number {
    const leftDue = this.dueValue(left);
    const rightDue = this.dueValue(right);
    if (leftDue === undefined || rightDue === undefined) {
      if (leftDue !== rightDue) {
        return leftDue === undefined ? 1 : -1;
      }
    } else if (leftDue !== rightDue) {
      return leftDue - rightDue;
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
              this.nfcTag(task),
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
      .sort((left, right) => this.compareDue(left, right));
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
    this.retainVisibleSelection();
    this.storeSessionView();
  }

  private toggleColumn(key: ColumnKey, visible: boolean): void {
    this.columns = { ...this.columns, [key]: visible };
    this.storeLocalView();
  }

  private resetColumns(): void {
    this.columns = { ...defaultColumns };
    this.storeLocalView();
  }

  private storeLocalView(): void {
    try {
      globalThis.localStorage?.setItem(
        localStorageKey,
        JSON.stringify({
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
    if (key === "files") {
      return String(task.attachments.length);
    }
    if (key === "nfc") {
      return this.nfcTag(task);
    }
    if (key === "labels") {
      return this.labelsText(task);
    }
    if (key === "notifications") {
      return this.notificationsText(task);
    }
    return key === "trigger" ? this.trigger(task) : this.status(task);
  }

  private columnValue(task: Task, key: ColumnKey) {
    const value = this.columnText(task, key);
    if (key === "due" && value !== "—" && this.hass && task.due) {
      return html`
        <ha-relative-time
          .hass=${this.hass}
          .datetime=${task.due}
          capitalize
          title=${value}
        ></ha-relative-time>
      `;
    }
    return key === "status"
      ? html`<span class="status">${value}</span>`
      : value;
  }

  private mobileDetails(task: Task) {
    const keys = (Object.keys(this.columns) as ColumnKey[])
      .filter(
        (key) =>
          this.columns[key] && this.columnText(task, key) !== "—",
      );
    return keys.map(
      (key, index) => html`
        ${index ? html`<span aria-hidden="true"> · </span>` : nothing}
        ${this.columnValue(task, key)}
      `,
    );
  }

  private visibleColumnCount(): number {
    return Object.values(this.columns).filter(Boolean).length + 4;
  }

  private selectedTasks(): Task[] {
    const ids = new Set(this.selectedIds);
    return this.tasks.filter((task) => ids.has(task.id));
  }

  private visibleSelectedTasks(): Task[] {
    const ids = new Set(this.selectedIds);
    return this.visibleTasks().filter((task) => ids.has(task.id));
  }

  private retainVisibleSelection(): void {
    const visibleIds = new Set(this.visibleTasks().map((task) => task.id));
    this.selectedIds = this.selectedIds.filter((id) => visibleIds.has(id));
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

  private bulkActionDestructive(): boolean {
    return [
      "delete",
      "remove-label",
      "remove-notification",
    ].includes(this.bulkAction);
  }

  private bulkActionLabel(): string {
    if (this.bulkAction === "complete") {
      return t("bulk.complete");
    }
    if (this.bulkAction === "pause") {
      return t("app.pause");
    }
    if (this.bulkAction === "resume") {
      return t("app.resume");
    }
    if (this.bulkAction === "assign") {
      return t("app.assign");
    }
    if (
      this.bulkAction === "add-label" ||
      this.bulkAction === "add-notification"
    ) {
      return t("app.add");
    }
    if (
      this.bulkAction === "remove-label" ||
      this.bulkAction === "remove-notification"
    ) {
      return t("common.remove");
    }
    return this.bulkAction === "delete"
      ? t("common.delete")
      : t("app.apply");
  }

  private bulkTargetLabel(): string {
    if (this.bulkAction === "assign") {
      return t("app.choose_person");
    }
    if (
      this.bulkAction === "add-label" ||
      this.bulkAction === "remove-label"
    ) {
      return t("app.choose_label");
    }
    return t("app.choose_notification");
  }

  private bulkTargetIcon(): string {
    if (this.bulkAction === "assign") {
      return "mdi:account-outline";
    }
    if (
      this.bulkAction === "add-label" ||
      this.bulkAction === "remove-label"
    ) {
      return "mdi:tag-outline";
    }
    return "mdi:bell-outline";
  }

  private bulkOperations(): BulkTaskOperation[] {
    return this.visibleSelectedTasks().map((task) => {
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

  private renderBulkPicker(
    picker: "action" | "target",
    options: ActionMenuItem[],
    selectedValue: string,
    placeholder: string,
    placeholderIcon: string,
    select: (value: string) => void,
  ) {
    const selected = options.find(
      (option) => option.value === selectedValue,
    );
    const open = this.openBulkPicker === picker;
    return html`
      <div class=${open
        ? "bulk-action-picker open"
        : "bulk-action-picker"}>
        <button
          class="bulk-action-picker-trigger"
          type="button"
          aria-expanded=${open ? "true" : "false"}
          @click=${() => {
            this.openBulkPicker = open ? "" : picker;
          }}
        >
          <ha-icon .icon=${selected?.icon || placeholderIcon}></ha-icon>
          <span>${selected?.label || placeholder}</span>
          <ha-icon
            class="picker-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="bulk-action-content">
          <div class="bulk-action-list">
            ${options.map(
              (option) => html`
                <button
                  class=${[
                    "bulk-action",
                    selectedValue === option.value ? "selected" : "",
                    option.destructive ? "destructive" : "",
                  ].filter(Boolean).join(" ")}
                  type="button"
                  @click=${() => {
                    select(option.value);
                    this.openBulkPicker = "";
                  }}
                >
                  ${option.icon
                    ? html`<ha-icon .icon=${option.icon}></ha-icon>`
                    : nothing}
                  <span>${option.label}</span>
                </button>
              `,
            )}
          </div>
        </div>
      </div>
    `;
  }

  private renderBulkMenu(selected: Task[]) {
    const bulkTargets = this.bulkTargets();
    const actions = bulkActions();
    const targetIcon = this.bulkTargetIcon();
    const targetOptions = bulkTargets.map((option) => ({
      ...option,
      icon: targetIcon,
    }));
    return html`
      <details
        class="bulk-menu"
        @toggle=${(event: Event) => {
          if (!(event.currentTarget as HTMLDetailsElement).open) {
            this.openBulkPicker = "";
          }
        }}
      >
        <summary>${t("bulk.actions")} (${selected.length})</summary>
        <div class="popover-panel">
          <div class="bulk-bar">
            ${this.renderBulkPicker(
              "action",
              actions,
              this.bulkAction,
              t("app.choose_action"),
              "mdi:gesture-tap-button",
              (value) => {
                this.bulkAction = value as BulkAction;
                this.bulkTarget = "";
                this.bulkError = "";
              },
            )}
            ${bulkTargets.length
              ? this.renderBulkPicker(
                  "target",
                  targetOptions,
                  this.bulkTarget,
                  this.bulkTargetLabel(),
                  targetIcon,
                  (value) => {
                    this.bulkTarget = value;
                  },
                )
              : nothing}
            <div class="bulk-footer">
              <ha-button
                appearance="accent"
                variant=${this.bulkActionDestructive() ? "danger" : "brand"}
                ?disabled=${this.bulkBusy ||
                !selected.length ||
                !this.bulkAction ||
                (this.bulkNeedsTarget() && !this.bulkTarget)}
                @click=${() => void this.applyBulk()}
              >
                ${this.bulkBusy
                  ? t("app.applying")
                  : this.bulkActionLabel()}
              </ha-button>
            </div>
            ${this.bulkError
              ? html`<p class="bulk-error" role="alert">
                  ${this.bulkError}
                </p>`
              : nothing}
          </div>
        </div>
      </details>
    `;
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
      const appliedIds = new Set(operations.map((operation) => operation.id));
      this.selectedIds = this.selectedIds.filter(
        (id) => !appliedIds.has(id),
      );
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
    const activeCount = this.filters[key].length;
    const open = this.openFilterGroups.includes(key);
    return html`
      <div class=${open ? "filter-category open" : "filter-category"}>
        <button
          class="filter-category-heading"
          type="button"
          aria-expanded=${open ? "true" : "false"}
          @click=${() => {
            this.openFilterGroups = open
              ? this.openFilterGroups.filter((group) => group !== key)
              : [...this.openFilterGroups, key];
          }}
        >
          <span>${label}</span>
          ${activeCount
            ? html`<span class="filter-category-count">
                (${activeCount})
              </span>`
            : nothing}
          <ha-icon
            class="filter-chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="filter-category-content">
          <fieldset>
            ${this.filterOptions(key).map(
              (option) => {
                const active = this.filters[key].includes(option.value);
                return html`
                <button
                  class=${active ? "option-row active" : "option-row"}
                  type="button"
                  aria-pressed=${active}
                  @click=${() =>
                    this.toggleFilter(
                      key,
                      option.value,
                      !active,
                    )}
                >
                  <span>${option.label}</span>
                  ${active
                    ? html`<ha-icon icon="mdi:check"></ha-icon>`
                    : nothing}
                </button>
              `;
              },
            )}
          </fieldset>
        </div>
      </div>
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

  private columnHeader(key: ColumnKey) {
    return html`
      <th class=${`${key}-column`}>${t(columnLabels[key])}</th>
    `;
  }

  private columnCell(task: Task, key: ColumnKey) {
    return html`
      <td class=${`${key}-column`}>
        ${this.columnValue(task, key)}
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
    return staticHtml`
      <div class="toolbar">
        <div class="selection-toolbar">
          <input
            class="search"
            type="search"
            aria-label=${t("table.search")}
            placeholder=${t("table.search")}
            .value=${this.search}
            @input=${(event: Event) => {
              this.search = (event.currentTarget as HTMLInputElement).value;
              this.retainVisibleSelection();
              this.storeSessionView();
            }}
          >
          ${selectedTasks.length
            ? this.renderBulkMenu(selectedTasks)
            : nothing}
        </div>
        <details>
          <summary>${t("table.filters")}${filterCount ? ` (${filterCount})` : ""}</summary>
          <div class="popover-panel filter-panel">
            <div class="filter-grid">
              ${this.filterGroup(t("task.assignment"), "assignee")}
              ${this.filterGroup(t("task.labels"), "labels")}
              ${this.filterGroup(t("table.notifications"), "notifications")}
              ${this.filterGroup(t("table.recurrence"), "trigger")}
              ${this.filterGroup(t("app.status"), "status")}
            </div>
            <div class="filter-footer">
              ${this.registryError
                ? html`<p class="registry-error">${this.registryError}</p>`
                : nothing}
              <ha-button
                appearance="plain"
                variant="neutral"
                @click=${() => {
                  this.filters = emptyFilters();
                  this.storeSessionView();
                }}
              >
                ${t("table.reset_filters")}
              </ha-button>
            </div>
          </div>
        </details>
        <details>
          <summary>${t("table.columns")}</summary>
          <div class="popover-panel column-panel">
            <div class="column-options">
              ${(Object.keys(columnLabels) as ColumnKey[]).map(
                (key) => html`
                  <button
                    class=${this.columns[key]
                      ? "option-row active"
                      : "option-row"}
                    type="button"
                    aria-pressed=${this.columns[key]}
                    @click=${() =>
                      this.toggleColumn(key, !this.columns[key])}
                  >
                    <span>${t(columnLabels[key])}</span>
                    ${this.columns[key]
                      ? html`<ha-icon icon="mdi:check"></ha-icon>`
                      : nothing}
                  </button>
                `,
              )}
            </div>
            <div class="filter-footer">
              <ha-button
                appearance="plain"
                variant="neutral"
                @click=${this.resetColumns}
              >
                ${t("table.reset_columns")}
              </ha-button>
            </div>
          </div>
        </details>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="selection">
                <ha-checkbox
                  aria-label=${t("app.select_visible")}
                  .checked=${allVisibleSelected}
                  .indeterminate=${someVisibleSelected &&
                  !allVisibleSelected}
                  @change=${(event: Event) =>
                    this.toggleVisible(
                      tasks,
                      (
                        event.currentTarget as HTMLElement & {
                          checked: boolean;
                        }
                      ).checked,
                    )}
                ></ha-checkbox>
              </th>
              <th class="icon" aria-hidden="true"></th>
              <th>${t("table.task")}</th>
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
                      @click=${() => this.open(task)}
                    >
                      <td
                        class="selection"
                        @click=${(event: Event) => event.stopPropagation()}
                      >
                        <ha-checkbox
                          aria-label=${t("app.select_task", {
                            name: task.name,
                          })}
                          .checked=${selectedIds.has(task.id)}
                          @change=${(event: Event) =>
                            this.toggleTask(
                              task.id,
                              (
                                event.currentTarget as HTMLElement & {
                                  checked: boolean;
                                }
                              ).checked,
                            )}
                        ></ha-checkbox>
                      </td>
                      <td class="icon">
                        <ha-icon
                          .icon=${task.active === false
                            ? "mdi:pause-circle-outline"
                            : task.icon || "mdi:clipboard-check-outline"}
                        ></ha-icon>
                      </td>
                      <td class="task-name">
                        ${task.name}
                        <span class="mobile-details">
                          ${this.mobileDetails(task)}
                        </span>
                      </td>
                      ${visibleColumns.map((key) =>
                        this.columnCell(task, key))}
                      <td
                        class="actions"
                        @click=${(event: Event) => event.stopPropagation()}
                      >
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
