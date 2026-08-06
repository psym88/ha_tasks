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
import {
  problemSensorStatus,
  type ProblemSensorStatus,
} from "./problem-sensor-status";
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
  | "status"
  | "due";
type Filters = Record<FilterKey, string[]>;
export type TaskConfiguredFilters = Partial<Filters>;
type BulkAction =
  | ""
  | "complete"
  | "pause"
  | "resume"
  | "assign"
  | "unassign"
  | "add-label"
  | "remove-label"
  | "add-notification"
  | "remove-notification"
  | "delete";
export type TaskColumnKey =
  | "due"
  | "assignee"
  | "nfc"
  | "files"
  | "labels"
  | "notifications"
  | "trigger"
  | "status";
type ColumnVisibility = Record<TaskColumnKey, boolean>;

export interface TaskTableOption<T extends string = string> {
  value: T;
  label: string;
}

const localStorageKey = "tasks-table-state-v2";
const sessionStorageKey = "tasks-table-session-v1";
export const taskColumnOptions: TaskTableOption<TaskColumnKey>[] = [
  { value: "due", label: "task.due" },
  { value: "assignee", label: "table.assignee" },
  { value: "nfc", label: "task.nfc_tag_id" },
  { value: "files", label: "task.files" },
  { value: "labels", label: "task.labels" },
  { value: "notifications", label: "table.notifications" },
  { value: "trigger", label: "table.recurrence" },
  { value: "status", label: "app.status" },
];
const columnLabels = Object.fromEntries(
  taskColumnOptions.map((option) => [option.value, option.label]),
) as Record<TaskColumnKey, string>;
const filterLabels: Record<FilterKey, string> = {
  assignee: "task.assignment",
  labels: "task.labels",
  notifications: "table.notifications",
  trigger: "table.recurrence",
  status: "app.status",
  due: "task.due",
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
  due: [],
});
const filterKeys = Object.keys(emptyFilters()) as FilterKey[];

export const taskTriggerFilterOptions = [
  { value: "fixed" as const, label: "task.fixed" },
  { value: "sliding" as const, label: "task.sliding" },
  { value: "sensor" as const, label: "task.problem_sensor" },
];
export type TaskTriggerFilterValue =
  (typeof taskTriggerFilterOptions)[number]["value"];

export const taskStatusFilterOptions = [
  { value: "active" as const, label: "app.active" },
  { value: "paused" as const, label: "app.paused" },
];
export type TaskStatusFilterValue =
  (typeof taskStatusFilterOptions)[number]["value"];

export const taskDueFilterOptions = [
  { value: "overdue", label: "table.due_overdue" },
  { value: "today", label: "table.due_today" },
  { value: "tomorrow", label: "table.due_tomorrow" },
  { value: "next_7_days", label: "table.due_next_7_days" },
  { value: "next_30_days", label: "table.due_next_30_days" },
] as const satisfies readonly TaskTableOption[];
export type TaskDueFilterValue =
  (typeof taskDueFilterOptions)[number]["value"];

const dateKey = (value: string | Date, timeZone?: string): string => {
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

const calendarDay = (
  value: string | Date,
  timeZone?: string,
): number => {
  const [year, month, day] = dateKey(value, timeZone)
    .split("-")
    .map(Number);
  return Math.floor(
    Date.UTC(year, month - 1, day) / 86_400_000,
  );
};

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

const bulkActions = (selected: Task[]): ActionMenuItem[] => [
  { label: t("bulk.complete"), value: "complete", icon: "mdi:check-circle-outline" },
  { label: t("app.pause"), value: "pause", icon: "mdi:pause-circle-outline" },
  { label: t("app.resume"), value: "resume", icon: "mdi:play-circle-outline" },
  { label: t("bulk.assign_person"), value: "assign", icon: "mdi:account-outline" },
  ...(selected.some((task) => task.assignee_id)
    ? [{
        label: t("bulk.remove_assignment"),
        value: "unassign",
        icon: "mdi:account-off-outline",
      }]
    : []),
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
    compact: { type: Boolean, reflect: true },
    showBulkSelection: { attribute: false },
    showIcon: { attribute: false },
    showAddTask: { attribute: false },
    showHeader: { attribute: false },
    showFilters: { attribute: false },
    configuredFilters: { attribute: false },
    showColumns: { attribute: false },
    configuredColumns: { attribute: false },
    now: { attribute: false },
    showSearch: { attribute: false },
    showActionMenu: { attribute: false },
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
    openToolbarPanel: { state: true },
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

    .toolbar-popover {
      position: relative;
    }

    summary,
    .toolbar-button {
      height: 40px;
      box-sizing: border-box;
      padding: 9px 14px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font: inherit;
      cursor: pointer;
    }

    .toolbar-button {
      appearance: none;
      line-height: normal;
    }

    .toolbar-button.full-width {
      width: 100%;
    }

    summary {
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .toolbar > details[open] > summary,
    .selection-toolbar > details[open] > summary,
    .toolbar-button.active {
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

    .sensor-warning {
      display: inline-flex;
      margin-left: 6px;
      color: var(--error-color);
      vertical-align: text-bottom;
    }

    .sensor-warning ha-icon {
      --mdc-icon-size: 18px;
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
      color: var(--primary-text-color);
    }

    .inactive .icon ha-icon {
      color: var(--secondary-text-color);
    }

    .due-today .icon ha-icon {
      color: var(--warning-color);
    }

    .due-overdue .icon ha-icon {
      color: var(--error-color);
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
      .selection-toolbar > details,
      .toolbar > .toolbar-popover {
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

    :host([compact]) {
      margin-top: 0;
    }

    :host([compact])
      :is(
        .due-column,
        .assignee-column,
        .files-column,
        .nfc-column,
        .labels-column,
        .notifications-column,
        .trigger-column,
        .status-column
      ) {
      display: none;
    }

    :host([compact]) .toolbar {
      flex-wrap: wrap;
    }

    :host([compact]) .search {
      flex: 1;
    }

    :host([compact]) :is(.toolbar, .selection-toolbar) > details {
      position: static;
    }

    :host([compact]) .toolbar > .toolbar-popover {
      position: static;
    }

    :host([compact]) .toolbar .popover-panel {
      top: calc(100% + 6px);
      right: 0;
      left: 0;
      width: auto;
      max-width: none;
      max-height: calc(100dvh - 96px);
      overflow: auto;
    }

    :host([compact]) .bulk-bar {
      width: 100%;
    }

    :host([compact]) :is(th, td) {
      padding-right: 10px;
      padding-left: 10px;
    }

    :host([compact]) .mobile-details {
      display: block;
    }
  `;

  declare hass?: HomeAssistant;
  declare tasks: Task[];
  declare compact: boolean;
  declare showBulkSelection: boolean;
  declare showIcon: boolean;
  declare showAddTask: boolean;
  declare showHeader: boolean;
  declare showFilters: boolean;
  declare configuredFilters?: TaskConfiguredFilters;
  declare showColumns: boolean;
  declare configuredColumns?: TaskColumnKey[];
  declare now?: string;
  declare showSearch: boolean;
  declare showActionMenu: boolean;
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
  declare openToolbarPanel: "" | "filters" | "columns";
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
    if (
      !path.some(
        (item) =>
          item instanceof HTMLElement &&
          item.classList.contains("toolbar-popover"),
      )
    ) {
      this.openToolbarPanel = "";
    }
  };

  constructor() {
    super();
    const local = storedObject("localStorage", localStorageKey);
    const session = storedObject("sessionStorage", sessionStorageKey);
    this.tasks = [];
    this.compact = false;
    this.showBulkSelection = true;
    this.showIcon = true;
    this.showAddTask = false;
    this.showHeader = true;
    this.showFilters = true;
    this.configuredFilters = undefined;
    this.showColumns = true;
    this.configuredColumns = undefined;
    this.now = undefined;
    this.showSearch = true;
    this.showActionMenu = true;
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
      (Object.keys(defaultColumns) as TaskColumnKey[]).map((key) => [
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
    this.openToolbarPanel = "";
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

  private problemSensorStatus(
    task: Task,
  ): ProblemSensorStatus | undefined {
    return task.schedule.type === "sensor"
      ? problemSensorStatus(this.hass, task.schedule)
      : undefined;
  }

  private problemSensorWarning(task: Task) {
    const status = this.problemSensorStatus(task);
    if (!status || status === "available") {
      return nothing;
    }
    const label = t(`problem.sensor_${status}`, {
      entity_id: task.schedule.type === "sensor"
        ? task.schedule.entity_id
        : "",
    });
    return html`
      <span class="sensor-warning" title=${label} aria-label=${label}>
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </span>
    `;
  }

  private assignee(task: Task): string {
    return (
      this.users.find((user) => user.id === task.assignee_id)?.name || "—"
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
    if (key === "due") {
      if (!task.due) {
        return [];
      }
      const timeZone = this.hass?.config?.time_zone;
      const offset =
        calendarDay(task.due, timeZone) -
        calendarDay(this.now || new Date(), timeZone);
      return [
        ...(offset < 0 ? ["overdue"] : []),
        ...(offset === 0 ? ["today"] : []),
        ...(offset === 1 ? ["tomorrow"] : []),
        ...(offset >= 0 && offset < 7 ? ["next_7_days"] : []),
        ...(offset >= 0 && offset < 30 ? ["next_30_days"] : []),
      ];
    }
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
      const option = taskStatusFilterOptions.find(
        (item) => item.value === value,
      );
      return option ? t(option.label) : value;
    }
    const option = taskTriggerFilterOptions.find(
      (item) => item.value === value,
    );
    return option ? t(option.label) : value;
  }

  private filterOptions(key: FilterKey): TaskTableOption[] {
    if (key === "due") {
      return taskDueFilterOptions.map((option) => ({
        value: option.value,
        label: t(option.label),
      }));
    }
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

  private activeFilters(): Filters {
    return this.configuredFilters
      ? { ...emptyFilters(), ...this.configuredFilters }
      : this.filters;
  }

  private matchesFilters(task: Task, filters: Filters): boolean {
    return filterKeys.every((key) => {
      const selected = filters[key];
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
      const sensorStatus = this.problemSensorStatus(task);
      if (sensorStatus && sensorStatus !== "available") {
        return t(`problem.sensor_${sensorStatus}_short`);
      }
      if (
        task.active !== false &&
        task.schedule.type === "sensor" &&
        !task.due
      ) {
        return t("table.waiting");
      }
      return "—";
    }
    return new Intl.DateTimeFormat(this.hass?.locale?.language, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: this.hass?.config?.time_zone,
    }).format(value);
  }

  private dueStatus(task: Task): "" | "due-today" | "due-overdue" {
    if (task.active === false || this.dueValue(task) === undefined) {
      return "";
    }
    const timeZone = this.hass?.config?.time_zone;
    const due = dateKey(task.due!, timeZone);
    const today = dateKey(new Date(), timeZone);
    return due < today ? "due-overdue" : due === today ? "due-today" : "";
  }

  private rowClass(task: Task): string {
    return task.active === false ? "inactive" : this.dueStatus(task);
  }

  private sortGroup(task: Task): number {
    if (task.active === false) {
      return 2;
    }
    return task.schedule.type === "sensor" && !task.due ? 1 : 0;
  }

  private compareDue(left: Task, right: Task): number {
    const groupDifference = this.sortGroup(left) - this.sortGroup(right);
    if (groupDifference) {
      return groupDifference;
    }
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
    const query = this.showSearch
      ? this.search.trim().toLocaleLowerCase(
          this.hass?.locale?.language,
        )
      : "";
    const filters = this.activeFilters();
    return this.tasks
      .filter(
        (task) =>
          this.matchesFilters(task, filters) &&
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

  private toggleColumn(key: TaskColumnKey, visible: boolean): void {
    this.columns = { ...this.columns, [key]: visible };
    this.storeLocalView();
  }

  private resetColumns(): void {
    this.columns = this.configuredColumns
      ? Object.fromEntries(
          (Object.keys(columnLabels) as TaskColumnKey[]).map((key) => [
            key,
            this.configuredColumns!.includes(key),
          ]),
        ) as ColumnVisibility
      : { ...defaultColumns };
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

  private columnText(task: Task, key: TaskColumnKey): string {
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

  private columnValue(task: Task, key: TaskColumnKey) {
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
    const keys = this.visibleColumnKeys().filter(
      (key) => this.columnText(task, key) !== "—",
    );
    return keys.map(
      (key, index) => html`
        ${index ? html`<span aria-hidden="true"> · </span>` : nothing}
        ${this.columnValue(task, key)}
      `,
    );
  }

  private visibleColumnKeys(): TaskColumnKey[] {
    return this.configuredColumns ??
      (Object.keys(this.columns) as TaskColumnKey[]).filter(
        (key) => this.columns[key],
      );
  }

  private visibleColumnCount(): number {
    return (
      this.visibleColumnKeys().length +
      1 +
      Number(this.showIcon) +
      Number(this.showBulkSelection) +
      Number(this.showActionMenu)
    );
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

  private bulkTargets(): TaskTableOption[] {
    if (this.bulkAction === "assign") {
      return this.users.map((user) => ({
        value: user.id,
        label: user.name,
      }));
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
    if (this.bulkAction === "unassign") {
      return t("bulk.remove_assignment");
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
          assignee_id: this.bulkTarget,
        };
      } else if (this.bulkAction === "unassign") {
        changes = { assignee_id: null };
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
    const actions = bulkActions(selected);
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
    return this.showFilters
      ? filterKeys.reduce(
          (count, key) => count + this.filters[key].length,
          0,
        )
      : 0;
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

  private columnHeader(key: TaskColumnKey) {
    return html`
      <th class=${`${key}-column`}>${t(columnLabels[key])}</th>
    `;
  }

  private columnCell(task: Task, key: TaskColumnKey) {
    return html`
      <td class=${`${key}-column`}>
        ${this.columnValue(task, key)}
      </td>
    `;
  }

  protected render() {
    const tasks = this.visibleTasks();
    const filterCount = this.selectedFilterCount();
    const visibleColumns = this.visibleColumnKeys();
    const selectedTasks = this.showBulkSelection
      ? this.selectedTasks()
      : [];
    const selectedIds = new Set(
      this.showBulkSelection ? this.selectedIds : [],
    );
    const allVisibleSelected =
      tasks.length > 0 &&
      tasks.every((task) => selectedIds.has(task.id));
    const someVisibleSelected = tasks.some((task) =>
      selectedIds.has(task.id),
    );
    const showToolbar =
      this.showSearch ||
      this.showAddTask ||
      this.showFilters ||
      this.showColumns ||
      selectedTasks.length > 0;
    const onlyAddTask =
      this.showAddTask &&
      !this.showSearch &&
      !this.showFilters &&
      !this.showColumns &&
      selectedTasks.length === 0;
    return staticHtml`
      ${showToolbar
        ? html`
            <div class="toolbar">
              ${this.showSearch ||
              this.showAddTask ||
              selectedTasks.length
                ? html`
                    <div class="selection-toolbar">
                      ${this.showSearch
                        ? html`
                            <input
                              class="search"
                              type="search"
                              aria-label=${t("table.search")}
                              placeholder=${t("table.search")}
                              .value=${this.search}
                              @input=${(event: Event) => {
                                this.search = (
                                  event.currentTarget as HTMLInputElement
                                ).value;
                                this.retainVisibleSelection();
                                this.storeSessionView();
                              }}
                            >
                          `
                        : nothing}
                      ${this.showAddTask
                        ? html`
                            <button
                              class=${onlyAddTask
                                ? "toolbar-button full-width"
                                : "toolbar-button"}
                              type="button"
                              @click=${() =>
                                this.dispatchEvent(
                                  new CustomEvent("tasks-task-add", {
                                    bubbles: true,
                                    composed: true,
                                  }),
                                )}
                            >
                              ${t("card.add_task")}
                            </button>
                          `
                        : nothing}
                      ${selectedTasks.length
                        ? this.renderBulkMenu(selectedTasks)
                        : nothing}
                    </div>
                  `
                : nothing}
              ${this.showFilters
                ? html`
                    <div class="toolbar-popover">
                      <button
                        class=${this.openToolbarPanel === "filters"
                          ? "toolbar-button active"
                          : "toolbar-button"}
                        type="button"
                        aria-expanded=${this.openToolbarPanel === "filters"}
                        @click=${() => {
                          this.openToolbarPanel =
                            this.openToolbarPanel === "filters"
                              ? ""
                              : "filters";
                        }}
                      >
                        ${t("table.filters")}${filterCount
                          ? ` (${filterCount})`
                          : ""}
                      </button>
                      ${this.openToolbarPanel === "filters"
                        ? html`
                            <div class="popover-panel filter-panel">
                              <div class="filter-grid">
                                ${filterKeys.map((key) =>
                                  this.filterGroup(
                                    t(filterLabels[key]),
                                    key,
                                  ))}
                              </div>
                              <div class="filter-footer">
                                ${this.registryError
                                  ? html`<p class="registry-error">
                                      ${this.registryError}
                                    </p>`
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
                          `
                        : nothing}
                    </div>
                  `
                : nothing}
              ${this.showColumns
                ? html`
                    <div class="toolbar-popover">
                      <button
                        class=${this.openToolbarPanel === "columns"
                          ? "toolbar-button active"
                          : "toolbar-button"}
                        type="button"
                        aria-expanded=${this.openToolbarPanel === "columns"}
                        @click=${() => {
                          this.openToolbarPanel =
                            this.openToolbarPanel === "columns"
                              ? ""
                              : "columns";
                        }}
                      >
                        ${t("table.columns")}
                      </button>
                      ${this.openToolbarPanel === "columns"
                        ? html`
                            <div class="popover-panel column-panel">
                              <div class="column-options">
                                ${(Object.keys(columnLabels) as TaskColumnKey[]).map(
                                  (key) => html`
                                    <button
                                      class=${this.columns[key]
                                        ? "option-row active"
                                        : "option-row"}
                                      type="button"
                                      aria-pressed=${this.columns[key]}
                                      @click=${() =>
                                        this.toggleColumn(
                                          key,
                                          !this.columns[key],
                                        )}
                                    >
                                      <span>${t(columnLabels[key])}</span>
                                      ${this.columns[key]
                                        ? html`<ha-icon
                                            icon="mdi:check"
                                          ></ha-icon>`
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
                          `
                        : nothing}
                    </div>
                  `
                : nothing}
            </div>
          `
        : nothing}
      <div class="table-wrap">
        <table>
          ${this.showHeader
            ? html`
                <thead>
                  <tr>
                    ${this.showBulkSelection
                      ? html`
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
                        `
                      : nothing}
                    ${this.showIcon
                      ? html`<th class="icon" aria-hidden="true"></th>`
                      : nothing}
                    <th>${t("table.task")}</th>
                    ${visibleColumns.map((key) =>
                      this.columnHeader(key))}
                    ${this.showActionMenu
                      ? html`<th
                          class="actions"
                          aria-label=${t("task.actions")}
                        ></th>`
                      : nothing}
                  </tr>
                </thead>
              `
            : nothing}
          <tbody>
            ${tasks.length
              ? tasks.map(
                  (task) => staticHtml`
                    <tr
                      class=${this.rowClass(task)}
                      aria-selected=${selectedIds.has(task.id)}
                      @click=${() => this.open(task)}
                    >
                      ${this.showBulkSelection
                        ? html`
                            <td
                              class="selection"
                              @click=${(event: Event) =>
                                event.stopPropagation()}
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
                          `
                        : nothing}
                      ${this.showIcon
                        ? html`
                            <td class="icon">
                              <ha-icon
                                .icon=${task.active === false
                                  ? "mdi:pause-circle-outline"
                                  : task.icon ||
                                    "mdi:clipboard-check-outline"}
                              ></ha-icon>
                            </td>
                          `
                        : nothing}
                      <td class="task-name">
                        ${task.name}
                        ${this.problemSensorWarning(task)}
                        <span class="mobile-details">
                          ${this.mobileDetails(task)}
                        </span>
                      </td>
                      ${visibleColumns.map((key) =>
                        this.columnCell(task, key))}
                      ${this.showActionMenu
                        ? staticHtml`
                            <td
                              class="actions"
                              @click=${(event: Event) =>
                                event.stopPropagation()}
                            >
                              <${actionMenuTag}
                                label=${t("app.actions_for", {
                                  name: task.name,
                                })}
                                .items=${taskActions(task)}
                                @tasks-action=${(
                                  event: CustomEvent<string>,
                                ) => this.action(task, event.detail)}
                              ></${actionMenuTag}>
                            </td>
                          `
                        : nothing}
                    </tr>
                  `,
                )
              : html`
                  <tr>
                    <td class="empty" colspan=${this.visibleColumnCount()}>
                      ${this.showSearch && this.search
                        ? t("table.empty")
                        : t("app.no_tasks")}
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
