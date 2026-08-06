import { css, html } from "lit";

import { LocalizedLitElement } from "../localized-element";
import { elementName } from "../version";

export interface FieldOption {
  label: string;
  value: string;
}

const fieldStyles = css`
  :host {
    display: block;
  }

  label {
    display: grid;
    gap: 6px;
    color: var(--primary-text-color);
    font-size: 13px;
  }

  input,
  textarea,
  select {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 12px;
    color: var(--primary-text-color);
    background: var(--primary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    font: inherit;
    font-size: 14px;
  }

  input,
  select {
    height: 40px;
  }

  input[type="time"] {
    display: block;
    min-inline-size: 0;
    inline-size: 100%;
    inline-size: -webkit-fill-available;
    padding-block: 0;
    -webkit-appearance: none;
    appearance: none;
    line-height: 40px;
  }

  input[type="time"]::-webkit-date-and-time-value {
    height: 100%;
    margin: 0;
    line-height: 40px;
  }

  textarea {
    min-height: 96px;
    resize: vertical;
  }

  input:hover,
  textarea:hover,
  select:hover {
    border-color: var(--secondary-text-color);
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: var(--primary-color);
    outline: 1px solid var(--primary-color);
  }

  [aria-invalid="true"] {
    border-color: var(--error-color);
  }

  .error {
    color: var(--error-color);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

`;

abstract class TasksField extends LocalizedLitElement {
  static properties = {
    label: {},
    value: {},
    required: { type: Boolean },
    disabled: { type: Boolean },
    error: {},
  };

  static styles = fieldStyles;

  declare label: string;
  declare value: string;
  declare required: boolean;
  declare disabled: boolean;
  declare error: string;

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.required = false;
    this.disabled = false;
    this.error = "";
  }

  protected change(value: string): void {
    this.value = value;
    this.error = "";
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: value,
      }),
    );
  }

  protected errorMessage() {
    return this.error
      ? html`<span class="error" role="alert">${this.error}</span>`
      : null;
  }
}

class TasksTextField extends TasksField {
  static properties = {
    ...TasksField.properties,
    placeholder: {},
    hideLabel: { attribute: "hide-label", type: Boolean },
    multiline: { type: Boolean },
    inputType: { attribute: "input-type" },
    min: { type: Number },
  };

  declare placeholder: string;
  declare hideLabel: boolean;
  declare multiline: boolean;
  declare inputType: "text" | "number" | "time";
  declare min?: number;

  constructor() {
    super();
    this.placeholder = "";
    this.hideLabel = false;
    this.multiline = false;
    this.inputType = "text";
    this.min = undefined;
  }

  protected render() {
    return html`
      <label>
        <span class=${this.hideLabel ? "visually-hidden" : ""}>
          ${this.label}
        </span>
        ${this.multiline
          ? html`
              <textarea
                .value=${this.value}
                .placeholder=${this.placeholder}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${Boolean(this.error)}
                @input=${(event: Event) =>
                  this.change((event.target as HTMLTextAreaElement).value)}
              ></textarea>
            `
          : html`
              <input
                type=${this.inputType}
                min=${this.min ?? ""}
                .value=${this.value}
                .placeholder=${this.placeholder}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${Boolean(this.error)}
                @input=${(event: Event) =>
                  this.change((event.target as HTMLInputElement).value)}
              />
            `}
        ${this.errorMessage()}
      </label>
    `;
  }
}

class TasksSelectField extends TasksField {
  static properties = {
    ...TasksField.properties,
    options: { attribute: false },
  };

  declare options: FieldOption[];

  constructor() {
    super();
    this.options = [];
  }

  protected render() {
    return html`
      <label>
        <span>${this.label}</span>
        <select
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${Boolean(this.error)}
          @change=${(event: Event) =>
            this.change((event.target as HTMLSelectElement).value)}
        >
          ${this.options.map(
            (option) => html`
              <option
                value=${option.value}
                ?selected=${option.value === this.value}
              >
                ${option.label}
              </option>
            `,
          )}
        </select>
        ${this.errorMessage()}
      </label>
    `;
  }
}

export const textFieldElementName = elementName("text-field");
export const selectFieldElementName = elementName("select-field");

if (!customElements.get(textFieldElementName)) {
  customElements.define(textFieldElementName, TasksTextField);
}
if (!customElements.get(selectFieldElementName)) {
  customElements.define(selectFieldElementName, TasksSelectField);
}
