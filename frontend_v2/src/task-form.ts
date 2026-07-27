import { LitElement, css, html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import { saveTaskDetails } from "./api";
import type { HomeAssistant, Task } from "./types";
import { openTasksDialog } from "./ui/dialog";
import {
  comboboxFieldElementName,
  selectFieldElementName,
  textFieldElementName,
  type FieldOption,
} from "./ui/fields";
import { elementName } from "./version";

const textFieldTag = unsafeStatic(textFieldElementName);
const selectFieldTag = unsafeStatic(selectFieldElementName);
const comboboxFieldTag = unsafeStatic(comboboxFieldElementName);

const statusOptions: FieldOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const iconOptions: FieldOption[] = [
  { label: "Tasks", value: "mdi:clipboard-check-outline" },
  { label: "Tools", value: "mdi:wrench-outline" },
  { label: "Cleaning", value: "mdi:broom" },
  { label: "Home", value: "mdi:home-outline" },
  { label: "Calendar", value: "mdi:calendar-check-outline" },
];

class TasksTaskForm extends LitElement {
  static properties = {
    name: { state: true },
    description: { state: true },
    status: { state: true },
    icon: { state: true },
    nameError: { state: true },
    saveError: { state: true },
    saving: { state: true },
  };

  static styles = css`
    :host,
    form {
      display: grid;
      gap: 16px;
    }

    .error {
      margin: 0;
      color: var(--error-color);
    }
  `;

  declare name: string;
  declare description: string;
  declare status: "active" | "inactive";
  declare icon: string;
  declare nameError: string;
  declare saveError: string;
  declare saving: boolean;

  private hass?: HomeAssistant;
  private task?: Task;

  constructor() {
    super();
    this.name = "";
    this.description = "";
    this.status = "active";
    this.icon = "";
    this.nameError = "";
    this.saveError = "";
    this.saving = false;
  }

  configure(hass: HomeAssistant, task: Task): void {
    this.hass = hass;
    this.task = task;
    this.name = task.task_name;
    this.description = task.task_description || "";
    this.status = task.active === false ? "inactive" : "active";
    this.icon = task.task_icon || "";
  }

  async save(): Promise<boolean> {
    const name = this.name.trim();
    if (!name) {
      this.nameError = "Name is required";
      return false;
    }
    if (!this.hass || !this.task || this.saving) {
      return false;
    }
    this.nameError = "";
    this.saveError = "";
    this.saving = true;
    try {
      await saveTaskDetails(this.hass, this.task, {
        name,
        description: this.description,
        active: this.status === "active",
        icon: this.icon,
      });
      return true;
    } catch (error) {
      this.saveError = error instanceof Error ? error.message : String(error);
      return false;
    } finally {
      this.saving = false;
    }
  }

  protected render() {
    return staticHtml`
      <form @submit=${(event: Event) => event.preventDefault()}>
        <${textFieldTag}
          label="Name"
          required
          .value=${this.name}
          .error=${this.nameError}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) => {
            this.name = event.detail;
            this.nameError = "";
          }}
        ></${textFieldTag}>
        <${textFieldTag}
          label="Description"
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) => {
            this.description = event.detail;
          }}
        ></${textFieldTag}>
        <${selectFieldTag}
          label="Status"
          .value=${this.status}
          .options=${statusOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) => {
            this.status = event.detail as "active" | "inactive";
          }}
        ></${selectFieldTag}>
        <${comboboxFieldTag}
          label="Icon"
          .value=${this.icon}
          .options=${iconOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) => {
            this.icon = event.detail;
          }}
        ></${comboboxFieldTag}>
        ${this.saveError
          ? html`<p class="error" role="alert">${this.saveError}</p>`
          : null}
      </form>
    `;
  }
}

const taskFormElementName = elementName("task-form");

if (!customElements.get(taskFormElementName)) {
  customElements.define(taskFormElementName, TasksTaskForm);
}

export const openTaskEditor = async (
  hass: HomeAssistant,
  task: Task,
): Promise<boolean> => {
  const form = document.createElement(taskFormElementName) as TasksTaskForm;
  form.configure(hass, task);
  const result = await openTasksDialog({
    heading: `Edit ${task.task_name}`,
    content: form,
    actions: [
      { label: "Cancel", value: "cancel" },
      { label: "Save", value: "save", run: () => form.save() },
    ],
  });
  return result === "save";
};
