import { css, html } from "lit";

import { LocalizedLitElement } from "../localized-element";
import { elementName } from "../version";

class TasksPill extends LocalizedLitElement {
  static properties = {
    tone: { reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      margin: 0 8px 8px 0;
    }

    span {
      display: inline-flex;
      min-height: 28px;
      box-sizing: border-box;
      align-items: center;
      padding: 3px 10px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      font-size: 13px;
      line-height: 20px;
    }

    :host([tone="positive"]) span {
      color: var(--success-color);
      border-color: var(--success-color);
    }

    :host([tone="muted"]) span {
      color: var(--secondary-text-color);
    }
  `;

  declare tone: "default" | "positive" | "muted";

  constructor() {
    super();
    this.tone = "default";
  }

  protected render() {
    return html`<span><slot></slot></span>`;
  }
}

export const pillElementName = elementName("pill");

if (!customElements.get(pillElementName)) {
  customElements.define(pillElementName, TasksPill);
}
