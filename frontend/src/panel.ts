import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import { deleteTask, setTaskActive, subscribeTasks } from "./api";
import { openArchive } from "./archive";
import { errorText, setLanguage, t } from "./localize";
import { openTaskEditor } from "./task-form";
import { taskTableElementName } from "./task-table";
import { openTaskViewer } from "./task-viewer";
import type { HomeAssistant, Task, TasksSnapshot } from "./types";
import { openTasksDialog } from "./ui/dialog";

const taskTableTag = unsafeStatic(taskTableElementName);

class TasksPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    snapshot: { state: true },
    error: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100%;
      box-sizing: border-box;
      padding: 24px;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    main {
      max-width: 960px;
      margin: 0 auto;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .add {
      min-height: 40px;
      padding: 0 18px;
      color: var(--text-primary-color, white);
      background: var(--primary-color);
      border: 0;
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }

    .backup {
      min-height: 40px;
      padding: 0 16px;
      color: var(--primary-color);
      background: transparent;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }

    .backup:focus-visible,
    .add:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .error {
      color: var(--error-color);
    }

    @media (max-width: 520px) {
      header,
      .header-actions {
        align-items: flex-start;
      }

      header {
        flex-direction: column;
      }
    }
  `;

  declare hass?: HomeAssistant;
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
    if (action === "open") {
      this.openTask(task);
    } else if (action === "edit") {
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
      <main>
        <header>
          <h1>${t("app.title")}</h1>
          <div class="header-actions">
            ${snapshot
              ? html`${t("app.summary", {
                  count: snapshot.tasks.length,
                  revision: snapshot.revision,
                })}`
              : nothing}
            <button
              class="backup"
              type="button"
              @click=${() => this.hass && void openArchive(this.hass)}
            >
              ${t("settings.import_export")}
            </button>
            <button
              class="add"
              type="button"
              @click=${() => this.hass && void openTaskEditor(this.hass)}
            >
              ${t("common.add_task")}
            </button>
          </div>
        </header>
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
    `;
  }
}

const panelElementName = "tasks-panel";
if (!customElements.get(panelElementName)) {
  customElements.define(panelElementName, TasksPanel);
}
