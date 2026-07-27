import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import { deleteTask, setTaskActive, subscribeTasks } from "./api";
import { openTaskEditor } from "./task-form";
import { openTaskViewer } from "./task-viewer";
import type { HomeAssistant, Task, TasksSnapshot } from "./types";
import {
  actionMenuElementName,
  type ActionMenuItem,
} from "./ui/action-menu";
import { openTasksDialog } from "./ui/dialog";
import { elementName } from "./version";

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

class TasksPanelV2 extends LitElement {
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

    .add:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
    }

    ul {
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--divider-color);
    }

    .task {
      flex: 1;
      width: 100%;
      padding: 12px 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .task:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
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
        this.error = error instanceof Error ? error.message : String(error);
      }
    }
  }

  private openTask(task: Task): void {
    if (this.hass) {
      void openTaskViewer(
        this.hass,
        task,
        this.snapshot?.attachments || [],
      );
    }
  }

  private async confirmDelete(task: Task): Promise<void> {
    if (!this.hass) {
      return;
    }
    await openTasksDialog({
      heading: "Delete task?",
      content: html`
        <p>
          Delete “${task.task_name}” including its completion history and
          attachments?
        </p>
      `,
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
    const snapshot = this.snapshot;
    return html`
      <main>
        <header>
          <h1>Tasks V2</h1>
          <div class="header-actions">
            ${snapshot
              ? html`${snapshot.tasks.length} Tasks · Revision ${snapshot.revision}`
              : nothing}
            <button
              class="add"
              type="button"
              @click=${() => this.hass && void openTaskEditor(this.hass)}
            >
              Add task
            </button>
          </div>
        </header>
        ${this.error
          ? html`<p class="error">Tasks konnten nicht geladen werden: ${this.error}</p>`
          : !snapshot
            ? html`<p>Tasks werden geladen …</p>`
            : html`
                <ul>
                  ${snapshot.tasks.map(
                    (task) => staticHtml`
                      <li>
                        <button
                          class="task"
                          type="button"
                          @click=${() => this.openTask(task)}
                        >
                          ${task.task_name}
                        </button>
                        <${actionMenuTag}
                          label="Actions for ${task.task_name}"
                          .items=${taskActions(task)}
                          @tasks-action=${(event: CustomEvent<string>) => {
                            if (event.detail === "open") {
                              this.openTask(task);
                            } else if (event.detail === "edit" && this.hass) {
                              void openTaskEditor(
                                this.hass,
                                task,
                                snapshot.attachments,
                              );
                            } else if (
                              event.detail === "active" &&
                              this.hass
                            ) {
                              void setTaskActive(
                                this.hass,
                                task.task_id,
                                task.active === false,
                              );
                            } else if (event.detail === "delete") {
                              void this.confirmDelete(task);
                            }
                          }}
                        ></${actionMenuTag}>
                      </li>
                    `,
                  )}
                </ul>
              `}
      </main>
    `;
  }
}

const panelElementName = elementName("panel-v2");
if (!customElements.get(panelElementName)) {
  customElements.define(panelElementName, TasksPanelV2);
}
