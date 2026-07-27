import { LitElement, css, html } from "lit";

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
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  input,
  textarea,
  select {
    width: 100%;
    min-height: 44px;
    box-sizing: border-box;
    padding: 9px 12px;
    color: var(--primary-text-color);
    background: var(--primary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    font: inherit;
    font-size: 14px;
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
`;

abstract class TasksField extends LitElement {
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
    multiline: { type: Boolean },
  };

  declare multiline: boolean;

  constructor() {
    super();
    this.multiline = false;
  }

  protected render() {
    return html`
      <label>
        <span>${this.label}${this.required ? " *" : ""}</span>
        ${this.multiline
          ? html`
              <textarea
                .value=${this.value}
                ?required=${this.required}
                ?disabled=${this.disabled}
                aria-invalid=${Boolean(this.error)}
                @input=${(event: Event) =>
                  this.change((event.target as HTMLTextAreaElement).value)}
              ></textarea>
            `
          : html`
              <input
                type="text"
                .value=${this.value}
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
        <span>${this.label}${this.required ? " *" : ""}</span>
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

class TasksComboboxField extends TasksField {
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
        <span>${this.label}${this.required ? " *" : ""}</span>
        <input
          type="text"
          role="combobox"
          list="options"
          autocomplete="off"
          .value=${this.value}
          ?required=${this.required}
          ?disabled=${this.disabled}
          aria-invalid=${Boolean(this.error)}
          @input=${(event: Event) =>
            this.change((event.target as HTMLInputElement).value)}
        />
        <datalist id="options">
          ${this.options.map(
            (option) =>
              html`<option value=${option.value}>${option.label}</option>`,
          )}
        </datalist>
        ${this.errorMessage()}
      </label>
    `;
  }
}

export const textFieldElementName = elementName("text-field");
export const selectFieldElementName = elementName("select-field");
export const comboboxFieldElementName = elementName("combobox-field");

if (!customElements.get(textFieldElementName)) {
  customElements.define(textFieldElementName, TasksTextField);
}
if (!customElements.get(selectFieldElementName)) {
  customElements.define(selectFieldElementName, TasksSelectField);
}
if (!customElements.get(comboboxFieldElementName)) {
  customElements.define(comboboxFieldElementName, TasksComboboxField);
}
