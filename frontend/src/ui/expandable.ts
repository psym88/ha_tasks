import { css, html } from "lit";

import { t } from "../localize";
import { LocalizedLitElement } from "../localized-element";
import { elementName } from "../version";

class TasksExpandable extends LocalizedLitElement {
  static properties = {
    heading: {},
    warning: { type: Boolean },
    open: { type: Boolean },
  };

  static styles = css`
    .expandable {
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg);
    }

    .heading {
      display: flex;
      width: 100%;
      min-height: 48px;
      box-sizing: border-box;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      font: inherit;
      font-weight: 500;
      text-align: start;
      cursor: pointer;
    }

    .chevron {
      margin-inline-start: auto;
      color: var(--secondary-text-color);
      transition: transform 200ms ease;
    }

    .warning {
      color: var(--error-color);
      --mdc-icon-size: 18px;
    }

    .expandable.open .chevron {
      transform: rotate(180deg);
    }

    .heading:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .content {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 200ms ease,
        opacity 150ms ease;
    }

    .expandable.open .content {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .content-inner {
      min-height: 0;
      overflow: hidden;
    }

    .content-padding {
      padding: 0 16px 16px;
      color: var(--secondary-text-color);
    }

    @media (prefers-reduced-motion: reduce) {
      .content,
      .chevron {
        transition: none;
      }
    }
  `;

  declare heading: string;
  declare warning: boolean;
  declare open: boolean;

  constructor() {
    super();
    this.heading = "";
    this.warning = false;
    this.open = false;
  }

  protected render() {
    return html`
      <div class=${this.open ? "expandable open" : "expandable"}>
        <button
          class="heading"
          type="button"
          aria-expanded=${this.open ? "true" : "false"}
          @click=${() => {
            this.open = !this.open;
          }}
        >
          ${this.heading}
          ${this.warning
            ? html`
                <ha-icon
                  class="warning"
                  icon="mdi:alert-circle-outline"
                  aria-label=${t("app.section_needs_attention")}
                  title=${t("app.section_needs_attention")}
                ></ha-icon>
              `
            : null}
          <ha-icon
            class="chevron"
            icon="mdi:chevron-down"
          ></ha-icon>
        </button>
        <div class="content">
          <div class="content-inner">
            <div class="content-padding"><slot></slot></div>
          </div>
        </div>
      </div>
    `;
  }
}

export const expandableElementName = elementName("expandable");

if (!customElements.get(expandableElementName)) {
  customElements.define(expandableElementName, TasksExpandable);
}
