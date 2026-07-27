import { LitElement, css, html, nothing } from "lit";

import { elementName } from "../version";

export interface DialogAction {
  label: string;
  value: string;
  destructive?: boolean;
}

export interface DialogOptions {
  heading: string;
  content: unknown;
  actions?: DialogAction[];
}

class TasksDialog extends LitElement {
  static properties = {
    heading: {},
    content: { attribute: false },
    actions: { attribute: false },
    open: { type: Boolean },
  };

  static styles = css`
    dialog {
      width: min(560px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      box-sizing: border-box;
      padding: 0;
      overflow: hidden;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 0;
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 8px 32px rgba(0, 0, 0, 0.32)
      );
      font-family: var(--ha-font-family-body, sans-serif);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.48);
    }

    article {
      display: grid;
      max-height: calc(100dvh - 32px);
      grid-template-rows: auto minmax(0, 1fr) auto;
    }

    header,
    footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 20px;
    }

    header {
      border-bottom: 1px solid var(--divider-color);
    }

    h2 {
      flex: 1;
      margin: 0;
      font-size: 20px;
      line-height: 28px;
    }

    section {
      padding: 20px;
      overflow: auto;
    }

    footer {
      justify-content: flex-end;
      border-top: 1px solid var(--divider-color);
    }

    button {
      min-height: 40px;
      padding: 0 16px;
      color: var(--primary-color);
      background: transparent;
      border: 0;
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }

    button:hover {
      background: var(--secondary-background-color);
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .close {
      width: 40px;
      padding: 0;
      color: var(--secondary-text-color);
      font-size: 26px;
      line-height: 1;
    }

    .destructive {
      color: var(--error-color);
    }
  `;

  declare heading: string;
  declare content: unknown;
  declare actions: DialogAction[];
  declare open: boolean;

  constructor() {
    super();
    this.heading = "";
    this.content = html``;
    this.actions = [];
    this.open = false;
  }

  protected updated(): void {
    const dialog = this.renderRoot.querySelector("dialog");
    if (!dialog) {
      return;
    }
    if (this.open && !dialog.open) {
      dialog.showModal();
    } else if (!this.open && dialog.open) {
      dialog.close();
    }
  }

  private close(value = ""): void {
    this.renderRoot.querySelector("dialog")?.close(value);
  }

  protected render() {
    return html`
      <dialog
        aria-labelledby="title"
        @close=${(event: Event) => {
          this.open = false;
          this.dispatchEvent(
            new CustomEvent("tasks-dialog-closed", {
              bubbles: true,
              composed: true,
              detail: (event.currentTarget as HTMLDialogElement).returnValue,
            }),
          );
        }}
      >
        <article>
          <header>
            <h2 id="title">${this.heading}</h2>
            <button
              class="close"
              type="button"
              aria-label="Close"
              @click=${() => this.close()}
            >
              ×
            </button>
          </header>
          <section>${this.content}</section>
          ${this.actions.length
            ? html`
                <footer>
                  ${this.actions.map(
                    (action) => html`
                      <button
                        class=${action.destructive
                          ? "destructive"
                          : nothing}
                        type="button"
                        @click=${() => this.close(action.value)}
                      >
                        ${action.label}
                      </button>
                    `,
                  )}
                </footer>
              `
            : nothing}
        </article>
      </dialog>
    `;
  }
}

const dialogElementName = elementName("dialog");

if (!customElements.get(dialogElementName)) {
  customElements.define(dialogElementName, TasksDialog);
}

export const openTasksDialog = ({
  heading,
  content,
  actions = [],
}: DialogOptions): Promise<string> => {
  const dialog = document.createElement(dialogElementName) as TasksDialog;
  dialog.heading = heading;
  dialog.content = content;
  dialog.actions = actions;
  document.body.append(dialog);
  dialog.open = true;
  return new Promise((resolve) => {
    dialog.addEventListener(
      "tasks-dialog-closed",
      (event) => {
        dialog.remove();
        resolve((event as CustomEvent<string>).detail);
      },
      { once: true },
    );
  });
};
