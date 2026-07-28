import { css, html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import { deleteTask, setTaskActive, subscribeTasks } from "./api";
import { openArchive } from "./archive";
import { errorText, setLanguage, t } from "./localize";
import { LocalizedLitElement } from "./localized-element";
import { openTaskEditor } from "./task-form";
import { taskTableElementName } from "./task-table";
import { openTaskViewer } from "./task-viewer";
import type { HomeAssistant, Task, TasksSnapshot } from "./types";
import { openTasksDialog } from "./ui/dialog";

const taskTableTag = unsafeStatic(taskTableElementName);

class TasksPanel extends LocalizedLitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    snapshot: { state: true },
    error: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      height: 100%;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .page {
      height: 100%;
      overflow: auto;
    }

    main {
      max-width: 960px;
      margin: 0 auto;
      padding: var(--ha-space-6);
      padding-bottom: calc(var(--ha-space-12) + var(--ha-space-12));
    }

    header {
      position: sticky;
      z-index: 4;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ha-space-4);
      min-height: var(--header-height);
      box-sizing: border-box;
      padding: var(--safe-area-inset-top, 0) var(--ha-space-4) 0;
      color: var(--app-header-text-color, var(--primary-text-color));
      background: var(--app-header-background-color, var(--card-background-color));
      border-bottom: var(
        --app-header-border-bottom,
        var(--ha-border-width-s) solid var(--divider-color)
      );
    }

    .header-title {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: var(--ha-space-3);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--ha-space-4);
    }

    .fab {
      position: fixed;
      z-index: 3;
      right: calc(var(--ha-space-6) + var(--safe-area-inset-right, 0px));
      bottom: calc(var(--ha-space-6) + var(--safe-area-inset-bottom, 0px));
      display: inline-flex;
      width: auto;
      --ha-button-box-shadow: var(--ha-box-shadow-l);
    }

    .backup {
      color: var(--app-header-text-color);
    }

    h1 {
      margin: 0;
      font-size: var(--ha-font-size-xl);
      font-weight: var(--ha-font-weight-normal, 400);
    }

    .error {
      color: var(--error-color);
    }

    @media (max-width: 520px) {
      .header-actions {
        gap: var(--ha-space-2);
      }

      header {
        padding-right: var(--ha-space-2);
        padding-left: var(--ha-space-1);
      }

      main {
        padding: var(--ha-space-4) var(--ha-space-2) var(--ha-space-6);
        padding-bottom: calc(var(--ha-space-12) + var(--ha-space-12));
      }

      .header-actions > span {
        display: none;
      }

      .fab {
        right: calc(var(--ha-space-4) + var(--safe-area-inset-right, 0px));
        bottom: calc(var(--ha-space-4) + var(--safe-area-inset-bottom, 0px));
      }
    }
  `;

  declare hass?: HomeAssistant;
  declare narrow: boolean;
  declare snapshot?: TasksSnapshot;
  declare error?: string;

  private unsubscribe?: () => void;
  private connection?: HomeAssistant["connection"];
  private language?: string;

  protected updated(): void {
    if (this.hass?.connection !== this.connection) {
      void this.connect();
    }
    if (this.hass?.locale?.language !== this.language) {
      this.language = this.hass?.locale?.language;
      void setLanguage(this.language).then(() => this.requestUpdate());
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
    const connection = this.hass.connection;
    this.connection = connection;
    this.error = undefined;
    try {
      const unsubscribe = await subscribeTasks(this.hass, (snapshot) => {
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

  protected render() {
    const snapshot = this.snapshot;
    return html`
      <div class="page">
        <header>
          <div class="header-title">
            <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}>
            </ha-menu-button>
            <h1>${t("app.title")}</h1>
          </div>
          <div class="header-actions">
            <ha-icon-button
              class="backup"
              label=${t("settings.import_export")}
              title=${t("settings.import_export")}
              @click=${() => this.hass && void openArchive(this.hass)}
            >
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </header>
        <main>
          ${this.error
            ? html`<p class="error">${t("app.load_error", {
                message: this.error,
              })}</p>`
            : !snapshot
              ? html`<p>${t("common.loading")}</p>`
              : staticHtml`
                  <${taskTableTag}
                    .hass=${this.hass}
                    .tasks=${snapshot.tasks}
                    @tasks-task-open=${(event: CustomEvent<Task>) =>
                      this.openTask(event.detail)}
                    @tasks-task-action=${(
                      event: CustomEvent<{ action: string; task: Task }>,
                    ) => this.handleTaskAction(event.detail.action, event.detail.task)}
                  ></${taskTableTag}>
                `}
        </main>
        <ha-button
          class="fab"
          appearance="accent"
          variant="brand"
          size="l"
          @click=${() => this.hass && void openTaskEditor(this.hass)}
        >
          <ha-icon slot="start" icon="mdi:plus"></ha-icon>
          ${t("common.add_task")}
        </ha-button>
      </div>
    `;
  }
}

const panelElementName = "tasks-panel";
if (!customElements.get(panelElementName)) {
  customElements.define(panelElementName, TasksPanel);
}
