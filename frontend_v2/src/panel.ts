import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import { subscribeTasks } from "./api";
import { openTaskEditor } from "./task-form";
import type { HomeAssistant, Task, TasksSnapshot } from "./types";
import {
  actionMenuElementName,
  type ActionMenuItem,
} from "./ui/action-menu";
import { openTasksDialog } from "./ui/dialog";
import { expandableElementName } from "./ui/expandable";
import { pillElementName } from "./ui/pill";
import { elementName } from "./version";

const actionMenuTag = unsafeStatic(actionMenuElementName);
const expandableTag = unsafeStatic(expandableElementName);
const pillTag = unsafeStatic(pillElementName);
const taskActions: ActionMenuItem[] = [
  { label: "Open", value: "open" },
  { label: "Edit", value: "edit" },
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
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
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
    void openTasksDialog({
      heading: task.task_name,
      content: staticHtml`
        <p>
          <${pillTag} tone=${task.active === false ? "muted" : "positive"}>
            ${task.active === false ? "Inactive" : "Active"}
          </${pillTag}>
          <${pillTag}>${task.schedule_type || "Unknown trigger"}</${pillTag}>
        </p>
        ${task.task_description
          ? html`<p>${task.task_description}</p>`
          : nothing}
        <${expandableTag} heading="Planning" open>
          <p>Due: ${task.task_due || "Not scheduled"}</p>
          <p>Trigger: ${task.schedule_type || "Unknown"}</p>
        </${expandableTag}>
      `,
      actions: [{ label: "Close", value: "close" }],
    });
  }

  protected render() {
    const snapshot = this.snapshot;
    return html`
      <main>
        <header>
          <h1>Tasks V2</h1>
          ${snapshot
            ? html`${snapshot.tasks.length} Tasks · Revision ${snapshot.revision}`
            : nothing}
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
                          .items=${taskActions}
                          @tasks-action=${(event: CustomEvent<string>) => {
                            if (event.detail === "open") {
                              this.openTask(task);
                            } else if (event.detail === "edit" && this.hass) {
                              void openTaskEditor(this.hass, task);
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
