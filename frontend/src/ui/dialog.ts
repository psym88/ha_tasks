import { html } from "lit";

import { LocalizedLitElement } from "../localized-element";
import { elementName } from "../version";

export interface DialogAction {
  label: string;
  value: string;
  destructive?: boolean;
  run?: () => boolean | void | Promise<boolean | void>;
}

export interface DialogOptions {
  heading: string;
  content: unknown;
  actions?: DialogAction[];
  width?: "small" | "medium" | "large";
}

class TasksDialog extends LocalizedLitElement {
  static properties = {
    heading: {},
    content: { attribute: false },
    actions: { attribute: false },
    width: {},
    open: { type: Boolean },
  };

  declare heading: string;
  declare content: unknown;
  declare actions: DialogAction[];
  declare width: "small" | "medium" | "large";
  declare open: boolean;

  private running = false;
  private closeValue = "";

  constructor() {
    super();
    this.heading = "";
    this.content = html``;
    this.actions = [];
    this.width = "medium";
    this.open = false;
  }

  private close(value = ""): void {
    this.closeValue = value;
    this.open = false;
  }

  private async run(action: DialogAction): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;
    try {
      if ((await action.run?.()) !== false) {
        this.close(action.value);
      }
    } finally {
      this.running = false;
    }
  }

  protected render() {
    const primaryAction = this.actions.at(-1);
    const secondaryActions = this.actions.slice(0, -1);
    return html`
      <ha-adaptive-dialog
        width=${this.width}
        flexcontent
        header-title=${this.heading}
        .open=${this.open}
        @closed=${() => {
          this.open = false;
          this.dispatchEvent(
            new CustomEvent("tasks-dialog-closed", {
              bubbles: true,
              composed: true,
              detail: this.closeValue,
            }),
          );
        }}
      >
        ${this.content}
        ${primaryAction
          ? html`
              <ha-dialog-footer slot="footer">
                ${secondaryActions.map(
                  (action) => html`
                    <ha-button
                      slot="secondaryAction"
                      appearance="plain"
                      variant=${action.destructive ? "danger" : "neutral"}
                      ?disabled=${this.running}
                      @click=${() => void this.run(action)}
                    >
                      ${action.label}
                    </ha-button>
                  `,
                )}
                <ha-button
                  slot="primaryAction"
                  appearance="accent"
                  variant=${primaryAction.destructive ? "danger" : "brand"}
                  ?disabled=${this.running}
                  @click=${() => void this.run(primaryAction)}
                >
                  ${primaryAction.label}
                </ha-button>
              </ha-dialog-footer>
            `
          : ""}
      </ha-adaptive-dialog>
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
  width = "medium",
}: DialogOptions): Promise<string> => {
  const dialog = document.createElement(dialogElementName) as TasksDialog;
  dialog.heading = heading;
  dialog.content = content;
  dialog.actions = actions;
  dialog.width = width;
  const appRoot = document.querySelector("home-assistant")?.shadowRoot;
  (appRoot || document.body).append(dialog);
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
