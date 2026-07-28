import { css, html, nothing } from "lit";

import { LocalizedLitElement } from "../localized-element";
import { elementName } from "../version";

class TasksExpandable extends LocalizedLitElement {
  static properties = {
    heading: {},
    icon: {},
    open: { type: Boolean },
  };

  static styles = css`
    details {
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
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

    .chevron {
      margin-inline-start: auto;
      color: var(--secondary-text-color);
    }

    details[open] .chevron {
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
  declare icon: string;
  declare open: boolean;

  constructor() {
    super();
    this.heading = "";
    this.icon = "";
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
        <summary>
          ${this.icon ? html`<ha-icon .icon=${this.icon}></ha-icon>` : nothing}
          ${this.heading}
          <ha-icon
            class="chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </summary>
        <div class="content"><slot></slot></div>
      </details>
    `;
  }
}

export const expandableElementName = elementName("expandable");

if (!customElements.get(expandableElementName)) {
  customElements.define(expandableElementName, TasksExpandable);
}
