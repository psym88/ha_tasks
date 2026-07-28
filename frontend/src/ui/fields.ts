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

  input:not([type="checkbox"]),
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

  input:not([type="checkbox"]):hover,
  textarea:hover,
  select:hover {
    border-color: var(--secondary-text-color);
  }

  input:not([type="checkbox"]):focus,
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

  fieldset {
    display: grid;
    gap: 8px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  legend {
    margin-bottom: 6px;
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  .choices {
    display: grid;
    gap: 4px;
  }

  .choice {
    display: flex;
    min-height: 36px;
    align-items: center;
    gap: 10px;
    color: var(--primary-text-color);
    font-size: 14px;
  }

  .choice input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--primary-color);
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
    inputType: { attribute: "input-type" },
    min: { type: Number },
  };

  declare multiline: boolean;
  declare inputType: "text" | "number" | "time";
  declare min?: number;

  constructor() {
    super();
    this.multiline = false;
    this.inputType = "text";
    this.min = undefined;
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
                type=${this.inputType}
                min=${this.min ?? ""}
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

class TasksMultiSelectField extends LitElement {
  static properties = {
    label: {},
    value: { attribute: false },
    options: { attribute: false },
    disabled: { type: Boolean },
  };

  static styles = fieldStyles;

  declare label: string;
  declare value: string[];
  declare options: FieldOption[];
  declare disabled: boolean;

  constructor() {
    super();
    this.label = "";
    this.value = [];
    this.options = [];
    this.disabled = false;
  }

  private toggle(value: string, selected: boolean): void {
    this.value = selected
      ? [...new Set([...this.value, value])]
      : this.value.filter((item) => item !== value);
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: this.value,
      }),
    );
  }

  protected render() {
    return html`
      <fieldset ?disabled=${this.disabled}>
        <legend>${this.label}</legend>
        <div class="choices">
          ${this.options.map(
            (option) => html`
              <label class="choice">
                <input
                  type="checkbox"
                  .checked=${this.value.includes(option.value)}
                  @change=${(event: Event) =>
                    this.toggle(
                      option.value,
                      (event.target as HTMLInputElement).checked,
                    )}
                />
                <span>${option.label}</span>
              </label>
            `,
          )}
        </div>
      </fieldset>
    `;
  }
}

class TasksSwitchField extends LitElement {
  static properties = {
    label: {},
    description: {},
    checked: { type: Boolean },
    disabled: { type: Boolean },
  };

  static styles = [
    fieldStyles,
    css`
      label {
        display: flex;
        min-height: 44px;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .copy {
        display: grid;
        gap: 2px;
      }

      small {
        color: var(--secondary-text-color);
      }

      input {
        flex: 0 0 auto;
        width: 20px;
        height: 20px;
        margin: 0;
        accent-color: var(--primary-color);
      }
    `,
  ];

  declare label: string;
  declare description: string;
  declare checked: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = "";
    this.description = "";
    this.checked = false;
    this.disabled = false;
  }

  protected render() {
    return html`
      <label>
        <span class="copy">
          <span>${this.label}</span>
          ${this.description ? html`<small>${this.description}</small>` : null}
        </span>
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${(event: Event) => {
            this.checked = (event.target as HTMLInputElement).checked;
            this.dispatchEvent(
              new CustomEvent("value-changed", {
                bubbles: true,
                composed: true,
                detail: this.checked,
              }),
            );
          }}
        />
      </label>
    `;
  }
}

export const textFieldElementName = elementName("text-field");
export const selectFieldElementName = elementName("select-field");
export const comboboxFieldElementName = elementName("combobox-field");
export const multiSelectFieldElementName = elementName("multi-select-field");
export const switchFieldElementName = elementName("switch-field");

if (!customElements.get(textFieldElementName)) {
  customElements.define(textFieldElementName, TasksTextField);
}
if (!customElements.get(selectFieldElementName)) {
  customElements.define(selectFieldElementName, TasksSelectField);
}
if (!customElements.get(comboboxFieldElementName)) {
  customElements.define(comboboxFieldElementName, TasksComboboxField);
}
if (!customElements.get(multiSelectFieldElementName)) {
  customElements.define(multiSelectFieldElementName, TasksMultiSelectField);
}
if (!customElements.get(switchFieldElementName)) {
  customElements.define(switchFieldElementName, TasksSwitchField);
}
