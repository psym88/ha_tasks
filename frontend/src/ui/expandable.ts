import { LitElement, css, html } from "lit";

import { elementName } from "../version";

class TasksExpandable extends LitElement {
  static properties = {
    heading: {},
    open: { type: Boolean },
  };

  static styles = css`
    details {
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    summary {
      display: flex;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      font-weight: 500;
      cursor: pointer;
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary::after {
      margin-left: auto;
      content: "⌄";
      transition: transform 160ms ease;
    }

    details[open] summary::after {
      transform: rotate(180deg);
    }

    summary:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .content {
      padding: 0 16px 16px;
      color: var(--secondary-text-color);
    }
  `;

  declare heading: string;
  declare open: boolean;

  constructor() {
    super();
    this.heading = "";
    this.open = false;
  }

  protected render() {
    return html`
      <details
        ?open=${this.open}
        @toggle=${(event: Event) => {
          this.open = (event.currentTarget as HTMLDetailsElement).open;
        }}
      >
        <summary>${this.heading}</summary>
        <div class="content"><slot></slot></div>
      </details>
    `;
  }
}

export const expandableElementName = elementName("expandable");

if (!customElements.get(expandableElementName)) {
  customElements.define(expandableElementName, TasksExpandable);
}
