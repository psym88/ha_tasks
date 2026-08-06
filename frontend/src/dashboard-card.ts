import { css, html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import { deleteTask, setTaskActive, subscribeTasks } from "./api";
import { errorText, ready, setLanguage, t } from "./localize";
import { LocalizedLitElement } from "./localized-element";
import { openTaskEditor } from "./task-form";
import {
  taskColumnOptions,
  taskDueFilterOptions,
  taskStatusFilterOptions,
  taskTableElementName,
  taskTriggerFilterOptions,
  type TaskColumnKey,
  type TaskConfiguredFilters,
  type TaskDueFilterValue,
  type TaskStatusFilterValue,
  type TaskTriggerFilterValue,
} from "./task-table";
import { openTaskViewer } from "./task-viewer";
import type { HomeAssistant, Task, TasksSnapshot } from "./types";
import { openTasksDialog } from "./ui/dialog";

interface CardConfig {
  type: string;
  show_bulk_selection: boolean;
  show_search: boolean;
  show_action_menu: boolean;
  show_icon: boolean;
  show_add_task: boolean;
  show_header: boolean;
  filter_assignees: string[];
  filter_current_user: boolean;
  filter_unassigned: boolean;
  filter_labels: string[];
  filter_no_labels: boolean;
  filter_notifications: string[];
  filter_persistent: boolean;
  filter_no_notifications: boolean;
  filter_triggers: TaskTriggerFilterValue[];
  filter_statuses: TaskStatusFilterValue[];
  filter_due: TaskDueFilterValue[];
  columns: TaskColumnKey[];
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

const stableCardTag = "tasks-card";
const taskTableTag = unsafeStatic(taskTableElementName);
const defaultColumns: TaskColumnKey[] = ["due", "assignee"];
const defaultConfig = (): CardConfig => ({
  type: `custom:${stableCardTag}`,
  show_bulk_selection: false,
  show_search: true,
  show_action_menu: false,
  show_icon: true,
  show_add_task: true,
  show_header: false,
  filter_assignees: [],
  filter_current_user: false,
  filter_unassigned: false,
  filter_labels: [],
  filter_no_labels: false,
  filter_notifications: [],
  filter_persistent: false,
  filter_no_notifications: false,
  filter_triggers: [],
  filter_statuses: [],
  filter_due: [],
  columns: [...defaultColumns],
});

const stubConfig = (): Partial<CardConfig> => {
  const { type: _type, ...config } = defaultConfig();
  return config;
};

const configuredValues = <T extends string>(
  value: unknown,
  options: readonly { value: T }[],
  fallback: T[],
): T[] =>
  Array.isArray(value)
    ? value.filter(
        (item, index, values): item is T =>
          typeof item === "string" &&
          options.some((option) => option.value === item) &&
          values.indexOf(item) === index,
      )
    : [...fallback];

const stringValues = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (item, index, values): item is string =>
          typeof item === "string" && values.indexOf(item) === index,
      )
    : [];

const normalizeConfig = (config: Partial<CardConfig>): CardConfig => ({
  type: config.type || `custom:${stableCardTag}`,
  show_bulk_selection: config.show_bulk_selection === true,
  show_search: config.show_search !== false,
  show_action_menu: config.show_action_menu === true,
  show_icon: config.show_icon !== false,
  show_add_task: config.show_add_task !== false,
  show_header: config.show_header === true,
  filter_assignees: stringValues(config.filter_assignees),
  filter_current_user: config.filter_current_user === true,
  filter_unassigned: config.filter_unassigned === true,
  filter_labels: stringValues(config.filter_labels),
  filter_no_labels: config.filter_no_labels === true,
  filter_notifications: stringValues(config.filter_notifications),
  filter_persistent: config.filter_persistent === true,
  filter_no_notifications: config.filter_no_notifications === true,
  filter_triggers: configuredValues(
    config.filter_triggers,
    taskTriggerFilterOptions,
    [],
  ),
  filter_statuses: configuredValues(
    config.filter_statuses,
    taskStatusFilterOptions,
    [],
  ),
  filter_due: configuredValues(
    config.filter_due,
    taskDueFilterOptions,
    [],
  ),
  columns: configuredValues(
    config.columns,
    taskColumnOptions,
    defaultColumns,
  ),
});

class TasksDashboardCard extends LocalizedLitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    snapshot: { state: true },
    error: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .message {
      margin: 0;
      padding: var(--ha-space-4);
      color: var(--secondary-text-color);
    }

    .error {
      color: var(--error-color);
    }
  `;

  declare hass?: HomeAssistant;
  declare config: CardConfig;
  declare snapshot?: TasksSnapshot;
  declare error: string;

  private connection?: HomeAssistant["connection"];
  private unsubscribe?: () => void;
  private language?: string;

  static getStubConfig(): Partial<CardConfig> {
    return stubConfig();
  }

  static getConfigForm() {
    return {
      schema: [
        {
          type: "expandable",
          name: "",
          title: t("card.options"),
          flatten: true,
          schema: [
            {
              name: "show_bulk_selection",
              selector: { boolean: {} },
            },
            {
              name: "show_search",
              selector: { boolean: {} },
            },
            {
              name: "show_action_menu",
              selector: { boolean: {} },
            },
            {
              name: "show_icon",
              selector: { boolean: {} },
            },
            {
              name: "show_add_task",
              selector: { boolean: {} },
            },
            {
              name: "show_header",
              selector: { boolean: {} },
            },
          ],
        },
        {
          type: "expandable",
          name: "",
          title: t("card.filter"),
          flatten: true,
          schema: [
            {
              type: "expandable",
              name: "",
              title: t("task.assignment"),
              flatten: true,
              schema: [
                {
                  name: "filter_assignees",
                  selector: {
                    entity: {
                      multiple: true,
                      filter: [{ domain: "person" }],
                    },
                  },
                },
                {
                  name: "filter_unassigned",
                  selector: { boolean: {} },
                },
                {
                  name: "filter_current_user",
                  selector: { boolean: {} },
                },
              ],
            },
            {
              type: "expandable",
              name: "",
              title: t("task.labels"),
              flatten: true,
              schema: [
                {
                  name: "filter_labels",
                  selector: { label: { multiple: true } },
                },
                {
                  name: "filter_no_labels",
                  selector: { boolean: {} },
                },
              ],
            },
            {
              type: "expandable",
              name: "",
              title: t("table.notifications"),
              flatten: true,
              schema: [
                {
                  name: "filter_notifications",
                  selector: {
                    device: {
                      multiple: true,
                      filter: [{ integration: "mobile_app" }],
                    },
                  },
                },
                {
                  name: "filter_persistent",
                  selector: { boolean: {} },
                },
                {
                  name: "filter_no_notifications",
                  selector: { boolean: {} },
                },
              ],
            },
            {
              type: "expandable",
              name: "",
              title: t("table.recurrence"),
              flatten: true,
              schema: [
                {
                  name: "filter_triggers",
                  selector: {
                    select: {
                      multiple: true,
                      options: taskTriggerFilterOptions.map((option) => ({
                        value: option.value,
                        label: t(option.label),
                      })),
                    },
                  },
                },
              ],
            },
            {
              type: "expandable",
              name: "",
              title: t("app.status"),
              flatten: true,
              schema: [
                {
                  name: "filter_statuses",
                  selector: {
                    select: {
                      multiple: true,
                      options: taskStatusFilterOptions.map((option) => ({
                        value: option.value,
                        label: t(option.label),
                      })),
                    },
                  },
                },
              ],
            },
            {
              type: "expandable",
              name: "",
              title: t("task.due"),
              flatten: true,
              schema: [
                {
                  name: "filter_due",
                  selector: {
                    select: {
                      multiple: true,
                      options: taskDueFilterOptions.map((option) => ({
                        value: option.value,
                        label: t(option.label),
                      })),
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: "expandable",
          name: "",
          title: t("card.content"),
          flatten: true,
          schema: [
            {
              name: "columns",
              selector: {
                select: {
                  multiple: true,
                  reorder: true,
                  options: taskColumnOptions.map((option) => ({
                    value: option.value,
                    label: t(option.label),
                  })),
                },
              },
            },
          ],
        },
      ],
      computeLabel: (schema: { name: string }): string | undefined => {
        const labels: Record<string, string> = {
          show_bulk_selection: "card.multi_selection",
          show_search: "card.search",
          show_action_menu: "card.action_menu",
          show_icon: "task.icon",
          show_add_task: "card.add_task",
          show_header: "card.table_header",
          filter_assignees: "task.user",
          filter_current_user: "card.current_user",
          filter_unassigned: "task.unassigned",
          filter_labels: "task.labels",
          filter_no_labels: "task.no_labels",
          filter_notifications: "table.notifications",
          filter_persistent: "task.notification_persistent",
          filter_no_notifications: "app.no_notifications",
          filter_triggers: "table.recurrence",
          filter_statuses: "app.status",
          filter_due: "card.due_periods",
          columns: "card.visible_columns",
        };
        return labels[schema.name] ? t(labels[schema.name]) : undefined;
      },
    };
  }

  constructor() {
    super();
    this.config = defaultConfig();
    this.error = "";
  }

  setConfig(config: Partial<CardConfig>): void {
    if (!config || typeof config !== "object") {
      throw new Error("Card configuration is required");
    }
    this.config = normalizeConfig(config);
  }

  getCardSize(): number {
    return Math.max(
      2,
      Math.min(8, this.snapshot?.tasks.length || 2),
    );
  }

  protected updated(): void {
    if (this.hass?.connection !== this.connection) {
      void this.connect();
    }
    if (this.hass?.locale?.language !== this.language) {
      this.language = this.hass?.locale?.language;
      void setLanguage(this.language);
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
        this.error = errorText(error);
      }
    }
  }

  private openTask(task: Task): void {
    if (this.hass) {
      void openTaskViewer(this.hass, task);
    }
  }

  private async confirmDelete(task: Task): Promise<void> {
    if (!this.hass) {
      return;
    }
    await openTasksDialog({
      heading: t("task.delete_title"),
      content: html`<p>
        ${t("task.delete_confirm", { name: task.name })}
      </p>`,
      actions: [
        { label: t("common.cancel"), value: "cancel" },
        {
          label: t("common.delete"),
          value: "delete",
          destructive: true,
          run: () => deleteTask(this.hass!, task.id),
        },
      ],
    });
  }

  private handleTaskAction(action: string, task: Task): void {
    if (!this.hass) {
      return;
    }
    if (action === "edit") {
      void openTaskEditor(this.hass, task);
    } else if (action === "active") {
      void setTaskActive(
        this.hass,
        task.id,
        task.active === false,
      );
    } else if (action === "delete") {
      void this.confirmDelete(task);
    }
  }

  private configuredFilters(): TaskConfiguredFilters {
    const assigneeIds = new Set(
      this.config.filter_assignees
        .map(
          (entityId) =>
            this.hass?.states?.[entityId]?.attributes?.user_id,
        )
        .filter((userId): userId is string => Boolean(userId)),
    );
    if (this.config.filter_current_user && this.hass?.user?.id) {
      assigneeIds.add(this.hass.user.id);
    }
    return {
      assignee: [
        ...assigneeIds,
        ...(this.config.filter_unassigned ? ["__none__"] : []),
      ],
      labels: [
        ...this.config.filter_labels,
        ...(this.config.filter_no_labels ? ["__none__"] : []),
      ],
      notifications: [
        ...this.config.filter_notifications,
        ...(this.config.filter_persistent ? ["panel"] : []),
        ...(this.config.filter_no_notifications ? ["__none__"] : []),
      ],
      trigger: this.config.filter_triggers,
      status: this.config.filter_statuses,
      due: this.config.filter_due,
    };
  }

  protected render() {
    if (this.error) {
      return html`<p class="message error">${this.error}</p>`;
    }
    if (!this.snapshot) {
      return html`<p class="message">${t("common.loading")}</p>`;
    }
    return staticHtml`
      <${taskTableTag}
        compact
        .hass=${this.hass}
        .tasks=${this.snapshot.tasks}
        .now=${this.snapshot.now}
        .configuredFilters=${this.configuredFilters()}
        .showBulkSelection=${this.config.show_bulk_selection}
        .showIcon=${this.config.show_icon}
        .showAddTask=${this.config.show_add_task}
        .showHeader=${this.config.show_header}
        .showFilters=${false}
        .showColumns=${false}
        .configuredColumns=${this.config.columns}
        .showSearch=${this.config.show_search}
        .showActionMenu=${this.config.show_action_menu}
        @tasks-task-open=${(event: CustomEvent<Task>) =>
          this.openTask(event.detail)}
        @tasks-task-add=${() =>
          this.hass && void openTaskEditor(this.hass)}
        @tasks-task-action=${(
          event: CustomEvent<{ action: string; task: Task }>,
        ) => this.handleTaskAction(event.detail.action, event.detail.task)}
      ></${taskTableTag}>
    `;
  }
}

if (!customElements.get(stableCardTag)) {
  customElements.define(stableCardTag, TasksDashboardCard);
}

window.customCards ||= [];
let cardMetadata = window.customCards.find(
  (card) => card.type === stableCardTag,
);
if (!cardMetadata) {
  cardMetadata = {
    type: stableCardTag,
    name: "Tasks",
  };
  window.customCards.push(cardMetadata);
}
void ready.then(() => {
  cardMetadata!.description = t("card.description");
});
