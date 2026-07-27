import { LitElement, css, html, nothing } from "lit";

import { subscribeTasks } from "./api";
import type { HomeAssistant, TasksSnapshot } from "./types";

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
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color);
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
                    (task) => html`<li>${task.task_name}</li>`,
                  )}
                </ul>
              `}
      </main>
    `;
  }
}

customElements.define("ha-tasks-panel-v2", TasksPanelV2);
