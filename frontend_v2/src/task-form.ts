import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  loadAssignmentOptions,
  loadNotificationDevices,
  previewTaskSchedule,
  saveTaskDetails,
  type RecurrenceScheduleDetails,
  type ScheduleDetails,
} from "./api";
import type {
  HomeAssistant,
  ScheduleDay,
  ScheduleType,
  ScheduleUnit,
  Task,
  TasksDevice,
  TasksLabel,
  TasksTag,
  TasksUser,
} from "./types";
import { openTasksDialog } from "./ui/dialog";
import { expandableElementName } from "./ui/expandable";
import {
  comboboxFieldElementName,
  multiSelectFieldElementName,
  selectFieldElementName,
  switchFieldElementName,
  textFieldElementName,
  type FieldOption,
} from "./ui/fields";
import { elementName } from "./version";

const textFieldTag = unsafeStatic(textFieldElementName);
const selectFieldTag = unsafeStatic(selectFieldElementName);
const comboboxFieldTag = unsafeStatic(comboboxFieldElementName);
const multiSelectFieldTag = unsafeStatic(multiSelectFieldElementName);
const switchFieldTag = unsafeStatic(switchFieldElementName);
const expandableTag = unsafeStatic(expandableElementName);

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

const triggerOptions: FieldOption[] = [
  { label: "After completion", value: "sliding" },
  { label: "Fixed schedule", value: "fixed" },
  { label: "Problem sensor", value: "sensor" },
];

const unitOptions: FieldOption[] = [
  { label: "Days", value: "daily" },
  { label: "Weeks", value: "weekly" },
  { label: "Months", value: "monthly" },
  { label: "Years", value: "yearly" },
];

const dayOptions: FieldOption[] = [
  ...Array.from({ length: 31 }, (_, index) => ({
    label: String(index + 1),
    value: String(index + 1),
  })),
  { label: "Last day", value: "last" },
];

const localDateParts = (
  hass: HomeAssistant,
  value?: string | null,
): Record<string, string> => {
  const date = value ? new Date(value) : new Date();
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: hass.config?.time_zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
};

class TasksTaskForm extends LitElement {
  static properties = {
    name: { state: true },
    description: { state: true },
    status: { state: true },
    icon: { state: true },
    assigneeId: { state: true },
    labelIds: { state: true },
    nfcTagId: { state: true },
    users: { state: true },
    labels: { state: true },
    tags: { state: true },
    assignmentLoading: { state: true },
    assignmentError: { state: true },
    notificationDeviceIds: { state: true },
    notificationPersistent: { state: true },
    notificationCritical: { state: true },
    notificationRoute: { state: true },
    devices: { state: true },
    notificationLoading: { state: true },
    notificationError: { state: true },
    notificationRouteError: { state: true },
    scheduleType: { state: true },
    scheduleUnit: { state: true },
    scheduleInterval: { state: true },
    scheduleWeekdays: { state: true },
    scheduleDay: { state: true },
    scheduleMonth: { state: true },
    scheduleTime: { state: true },
    problemSensor: { state: true },
    preview: { state: true },
    previewLoading: { state: true },
    previewError: { state: true },
    previewExpanded: { state: true },
    nameError: { state: true },
    scheduleError: { state: true },
    saveError: { state: true },
    saving: { state: true },
  };

  static styles = css`
    :host,
    form,
    .planning {
      display: grid;
      gap: 16px;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .weekday {
      min-width: 0;
      min-height: 36px;
      padding: 0 4px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid transparent;
      border-radius: 18px;
      font: inherit;
      cursor: pointer;
    }

    .weekday[aria-pressed="true"] {
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
    }

    .weekday:focus-visible,
    .link:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .weekday:disabled {
      opacity: 0.55;
      cursor: default;
    }

    .caption,
    .hint,
    .preview,
    .error {
      margin: 0;
      font-size: 13px;
    }

    .caption {
      color: var(--secondary-text-color);
    }

    .hint,
    .preview {
      color: var(--secondary-text-color);
    }

    .preview {
      display: grid;
      gap: 6px;
      padding: 0;
      list-style: none;
    }

    .link {
      justify-self: start;
      min-height: 32px;
      padding: 0;
      color: var(--primary-color);
      background: transparent;
      border: 0;
      font: inherit;
      cursor: pointer;
    }

    .error {
      color: var(--error-color);
    }

    @media (max-width: 520px) {
      .row {
        grid-template-columns: 1fr;
      }
    }
  `;

  declare name: string;
  declare description: string;
  declare status: "active" | "inactive";
  declare icon: string;
  declare assigneeId: string;
  declare labelIds: string[];
  declare nfcTagId: string;
  declare users: TasksUser[];
  declare labels: TasksLabel[];
  declare tags: TasksTag[];
  declare assignmentLoading: boolean;
  declare assignmentError: string;
  declare notificationDeviceIds: string[];
  declare notificationPersistent: boolean;
  declare notificationCritical: boolean;
  declare notificationRoute: string;
  declare devices: TasksDevice[];
  declare notificationLoading: boolean;
  declare notificationError: string;
  declare notificationRouteError: string;
  declare scheduleType: ScheduleType;
  declare scheduleUnit: ScheduleUnit;
  declare scheduleInterval: number;
  declare scheduleWeekdays: number[];
  declare scheduleDay: ScheduleDay;
  declare scheduleMonth: number;
  declare scheduleTime: string;
  declare problemSensor: string;
  declare preview: string[];
  declare previewLoading: boolean;
  declare previewError: string;
  declare previewExpanded: boolean;
  declare nameError: string;
  declare scheduleError: string;
  declare saveError: string;
  declare saving: boolean;

  private hass?: HomeAssistant;
  private task?: Task;
  private scheduleDirty = false;
  private assignmentDirty = false;
  private notificationDirty = false;
  private previewRequest = 0;

  constructor() {
    super();
    this.name = "";
    this.description = "";
    this.status = "active";
    this.icon = "";
    this.assigneeId = "";
    this.labelIds = [];
    this.nfcTagId = "";
    this.users = [];
    this.labels = [];
    this.tags = [];
    this.assignmentLoading = false;
    this.assignmentError = "";
    this.notificationDeviceIds = [];
    this.notificationPersistent = false;
    this.notificationCritical = false;
    this.notificationRoute = "";
    this.devices = [];
    this.notificationLoading = false;
    this.notificationError = "";
    this.notificationRouteError = "";
    this.scheduleType = "sliding";
    this.scheduleUnit = "monthly";
    this.scheduleInterval = 1;
    this.scheduleWeekdays = [];
    this.scheduleDay = 1;
    this.scheduleMonth = 1;
    this.scheduleTime = "09:00";
    this.problemSensor = "";
    this.preview = [];
    this.previewLoading = false;
    this.previewError = "";
    this.previewExpanded = false;
    this.nameError = "";
    this.scheduleError = "";
    this.saveError = "";
    this.saving = false;
  }

  configure(hass: HomeAssistant, task: Task): void {
    const parts = localDateParts(hass, task.task_due);
    const year = Number(parts.year);
    const month = Number(parts.month);
    const day = Number(parts.day);
    const weekday = (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7;
    this.hass = hass;
    this.task = task;
    this.name = task.task_name;
    this.description = task.task_description || "";
    this.status = task.active === false ? "inactive" : "active";
    this.icon = task.task_icon || "";
    this.assigneeId = task.assignee_id || "";
    this.labelIds = [...(task.label_ids || [])];
    this.nfcTagId = task.nfc_tag_id || "";
    this.notificationDeviceIds = [
      ...new Set(
        (task.notification_target?.device_id || []).filter(
          (id): id is string => typeof id === "string",
        ),
      ),
    ];
    this.notificationPersistent = Boolean(task.notification_persistent);
    this.notificationCritical = Boolean(task.notification_critical);
    this.notificationRoute = task.notification_route || "";
    this.scheduleType = task.schedule_type;
    this.scheduleUnit = task.schedule_unit || "monthly";
    this.scheduleInterval = task.schedule_interval || 1;
    this.scheduleWeekdays = task.schedule_weekdays?.length
      ? [...task.schedule_weekdays]
      : [weekday];
    this.scheduleDay = task.schedule_day || day;
    this.scheduleMonth = task.schedule_month || month;
    this.scheduleTime =
      task.schedule_time || `${parts.hour || "09"}:${parts.minute || "00"}`;
    this.problemSensor = task.problem_sensor || "";
    this.scheduleDirty = false;
    this.assignmentDirty = false;
    this.notificationDirty = false;
    void this.loadAssignments();
    void this.loadNotifications();
    void this.updateComplete.then(() => this.loadPreview());
  }

  private async loadAssignments(): Promise<void> {
    const hass = this.hass;
    if (!hass) {
      return;
    }
    this.assignmentLoading = true;
    this.assignmentError = "";
    try {
      const options = await loadAssignmentOptions(hass);
      this.users = [...options.users].sort((left, right) =>
        left.name.localeCompare(right.name, this.hass?.locale?.language),
      );
      this.labels = [...options.labels].sort((left, right) =>
        left.name.localeCompare(right.name, this.hass?.locale?.language),
      );
      this.tags = [...options.tags].sort((left, right) =>
        (left.name || left.id).localeCompare(
          right.name || right.id,
          this.hass?.locale?.language,
        ),
      );
      this.assigneeId = this.users.some((user) => user.id === this.assigneeId)
        ? this.assigneeId
        : "";
      this.labelIds = this.labelIds.filter((id) =>
        this.labels.some((label) => label.label_id === id),
      );
      this.nfcTagId = this.tags.some((tag) => tag.id === this.nfcTagId)
        ? this.nfcTagId
        : "";
    } catch {
      this.assignmentError = "Assignments could not be loaded";
    } finally {
      this.assignmentLoading = false;
    }
  }

  private deviceName(device: TasksDevice): string {
    return (
      device.name_by_user ||
      device.name ||
      [device.manufacturer, device.model].filter(Boolean).join(" ") ||
      device.id
    );
  }

  private async loadNotifications(): Promise<void> {
    const hass = this.hass;
    if (!hass) {
      return;
    }
    this.notificationLoading = true;
    this.notificationError = "";
    try {
      this.devices = (await loadNotificationDevices(hass)).sort((left, right) =>
        this.deviceName(left).localeCompare(
          this.deviceName(right),
          this.hass?.locale?.language,
        ),
      );
      this.notificationDeviceIds = this.notificationDeviceIds.filter((id) =>
        this.devices.some((device) => device.id === id),
      );
    } catch {
      this.notificationError = "Notification devices could not be loaded";
    } finally {
      this.notificationLoading = false;
    }
  }

  private monthOptions(): FieldOption[] {
    return Array.from({ length: 12 }, (_, index) => ({
      label: new Intl.DateTimeFormat(this.hass?.locale?.language, {
        month: "long",
      }).format(new Date(2024, index, 1)),
      value: String(index + 1),
    }));
  }

  private weekdayLabels(): string[] {
    return Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(this.hass?.locale?.language, {
        weekday: "short",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(2024, 0, index + 1))),
    );
  }

  private problemSensorOptions(): FieldOption[] {
    return Object.values(this.hass?.states || {})
      .filter((state) => state.entity_id.startsWith("binary_sensor."))
      .map((state) => ({
        label: state.attributes?.friendly_name || state.entity_id,
        value: state.entity_id,
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  private scheduleDetails(reportError: boolean): ScheduleDetails | undefined {
    let error = "";
    if (this.scheduleType === "sensor") {
      const problemSensor = this.problemSensor.trim();
      if (!problemSensor.startsWith("binary_sensor.")) {
        error = "Select a binary sensor";
      }
      if (reportError) {
        this.scheduleError = error;
      }
      return error ? undefined : { type: "sensor", problemSensor };
    }

    if (!Number.isInteger(this.scheduleInterval) || this.scheduleInterval < 1) {
      error = "Interval must be at least 1";
    } else if (
      this.scheduleType === "fixed" &&
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)
    ) {
      error = "Select a valid time";
    } else if (
      this.scheduleType === "fixed" &&
      this.scheduleUnit === "weekly" &&
      !this.scheduleWeekdays.length
    ) {
      error = "Select at least one weekday";
    }
    if (reportError) {
      this.scheduleError = error;
    }
    return error
      ? undefined
      : {
          type: this.scheduleType,
          unit: this.scheduleUnit,
          interval: this.scheduleInterval,
          weekdays: [...this.scheduleWeekdays].sort(),
          day: this.scheduleDay,
          month: this.scheduleMonth,
          time: this.scheduleTime,
        };
  }

  private scheduleChanged(change: () => void): void {
    this.scheduleDirty = true;
    this.scheduleError = "";
    this.previewExpanded = false;
    change();
    void this.loadPreview();
  }

  private assignmentChanged(change: () => void): void {
    this.assignmentDirty = true;
    change();
  }

  private notificationChanged(change: () => void): void {
    this.notificationDirty = true;
    this.notificationRouteError = "";
    change();
  }

  private async loadPreview(): Promise<void> {
    const hass = this.hass;
    const task = this.task;
    const schedule = this.scheduleDetails(false);
    const request = ++this.previewRequest;
    if (!hass || !task || !schedule || schedule.type === "sensor") {
      this.preview = [];
      this.previewLoading = false;
      this.previewError = "";
      return;
    }
    this.previewLoading = true;
    this.previewError = "";
    try {
      const result = await previewTaskSchedule(
        hass,
        schedule,
        this.scheduleDirty ? undefined : task.task_due || undefined,
      );
      if (request === this.previewRequest) {
        this.preview = result.task_dues;
      }
    } catch {
      if (request === this.previewRequest) {
        this.preview = [];
        this.previewError = "Schedule preview could not be loaded";
      }
    } finally {
      if (request === this.previewRequest) {
        this.previewLoading = false;
      }
    }
  }

  private formatDue(value: string): string {
    return new Intl.DateTimeFormat(this.hass?.locale?.language, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: this.hass?.config?.time_zone,
    }).format(new Date(value));
  }

  async save(): Promise<boolean> {
    const name = this.name.trim();
    const schedule = this.scheduleDetails(true);
    const notificationRoute = this.notificationRoute.trim();
    if (!name) {
      this.nameError = "Name is required";
    }
    if (
      notificationRoute &&
      (!notificationRoute.startsWith("/") ||
        notificationRoute.startsWith("//"))
    ) {
      this.notificationRouteError = "Use an internal path beginning with /";
    }
    if (!name || !schedule || this.notificationRouteError) {
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
        schedule: this.scheduleDirty ? schedule : undefined,
        assignment: this.assignmentDirty
          ? {
              assigneeId: this.assigneeId,
              labelIds: this.labelIds,
              nfcTagId: this.nfcTagId,
            }
          : undefined,
        notification: this.notificationDirty
          ? {
              deviceIds: this.notificationDeviceIds,
              persistent: this.notificationPersistent,
              critical: this.notificationCritical,
              route: notificationRoute,
            }
          : undefined,
      });
      return true;
    } catch (error) {
      this.saveError = error instanceof Error ? error.message : String(error);
      return false;
    } finally {
      this.saving = false;
    }
  }

  private renderFixedOptions() {
    if (this.scheduleType !== "fixed") {
      return nothing;
    }
    let unitOptions: unknown = nothing;
    if (this.scheduleUnit === "weekly") {
      unitOptions = html`
        <p class="caption">Weekdays</p>
        <div class="weekdays">
          ${this.weekdayLabels().map(
            (label, day) => html`
              <button
                class="weekday"
                type="button"
                aria-label=${label}
                aria-pressed=${this.scheduleWeekdays.includes(day)}
                ?disabled=${this.saving}
                @click=${() =>
                  this.scheduleChanged(() => {
                    this.scheduleWeekdays = this.scheduleWeekdays.includes(day)
                      ? this.scheduleWeekdays.filter((value) => value !== day)
                      : [...this.scheduleWeekdays, day];
                  })}
              >
                ${label}
              </button>
            `,
          )}
        </div>
      `;
    } else if (this.scheduleUnit === "monthly") {
      unitOptions = staticHtml`
        <${selectFieldTag}
          label="Day"
          .value=${String(this.scheduleDay)}
          .options=${dayOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.scheduleChanged(() => {
              this.scheduleDay =
                event.detail === "last" ? "last" : Number(event.detail);
            })}
        ></${selectFieldTag}>
      `;
    } else if (this.scheduleUnit === "yearly") {
      unitOptions = staticHtml`
        <div class="row">
          <${selectFieldTag}
            label="Day"
            .value=${String(this.scheduleDay)}
            .options=${dayOptions}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.scheduleDay =
                  event.detail === "last" ? "last" : Number(event.detail);
              })}
          ></${selectFieldTag}>
          <${selectFieldTag}
            label="Month"
            .value=${String(this.scheduleMonth)}
            .options=${this.monthOptions()}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.scheduleMonth = Number(event.detail);
              })}
          ></${selectFieldTag}>
        </div>
      `;
    }
    return staticHtml`
      <${textFieldTag}
        label="Time"
        required
        .inputType=${"time"}
        .value=${this.scheduleTime}
        ?disabled=${this.saving}
        @value-changed=${(event: CustomEvent<string>) =>
          this.scheduleChanged(() => {
            this.scheduleTime = event.detail;
          })}
      ></${textFieldTag}>
      ${unitOptions}
    `;
  }

  private renderPreview() {
    if (this.scheduleType === "sensor") {
      return nothing;
    }
    if (this.previewLoading && !this.preview.length) {
      return html`<p class="hint" aria-live="polite">Loading preview…</p>`;
    }
    if (this.previewError) {
      return html`<p class="error" role="alert">${this.previewError}</p>`;
    }
    if (this.scheduleType === "sliding") {
      return html`
        <p class="caption">First due</p>
        <p class="hint">
          ${this.preview[0] ? this.formatDue(this.preview[0]) : "—"}
        </p>
      `;
    }
    const visible = this.previewExpanded
      ? this.preview
      : this.preview.slice(0, 4);
    return html`
      <p class="caption">Next due dates</p>
      <ol class="preview">
        ${visible.map((due) => html`<li>${this.formatDue(due)}</li>`)}
      </ol>
      ${this.preview.length > 4
        ? html`
            <button
              class="link"
              type="button"
              @click=${() => {
                this.previewExpanded = !this.previewExpanded;
              }}
            >
              ${this.previewExpanded ? "Show less" : "Show all"}
            </button>
          `
        : nothing}
    `;
  }

  private renderPlanning() {
    if (this.scheduleType === "sensor") {
      return staticHtml`
        <div class="planning">
          <${selectFieldTag}
            label="Trigger"
            .value=${this.scheduleType}
            .options=${triggerOptions}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.scheduleType = event.detail as ScheduleType;
              })}
          ></${selectFieldTag}>
          <${comboboxFieldTag}
            label="Problem sensor"
            required
            .value=${this.problemSensor}
            .options=${this.problemSensorOptions()}
            .error=${this.scheduleError}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.problemSensor = event.detail;
              })}
          ></${comboboxFieldTag}>
          <p class="hint">
            The task becomes due when the binary sensor changes to on.
          </p>
        </div>
      `;
    }
    return staticHtml`
      <div class="planning">
        <${selectFieldTag}
          label="Trigger"
          .value=${this.scheduleType}
          .options=${triggerOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.scheduleChanged(() => {
              this.scheduleType = event.detail as ScheduleType;
            })}
        ></${selectFieldTag}>
        <div class="row">
          <${textFieldTag}
            label="Every"
            required
            .inputType=${"number"}
            .min=${1}
            .value=${String(this.scheduleInterval)}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.scheduleInterval = Number(event.detail);
              })}
          ></${textFieldTag}>
          <${selectFieldTag}
            label="Unit"
            .value=${this.scheduleUnit}
            .options=${unitOptions}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.scheduleUnit = event.detail as ScheduleUnit;
              })}
          ></${selectFieldTag}>
        </div>
        ${this.renderFixedOptions()}
        ${this.scheduleType === "sliding"
          ? html`
              <p class="hint">
                The next due date is calculated from each completion.
              </p>
            `
          : nothing}
        ${this.scheduleError
          ? html`<p class="error" role="alert">${this.scheduleError}</p>`
          : nothing}
        ${this.renderPreview()}
      </div>
    `;
  }

  private renderAssignment() {
    if (this.assignmentLoading) {
      return html`<p class="hint" aria-live="polite">
        Loading assignments…
      </p>`;
    }
    if (this.assignmentError) {
      return html`<p class="error" role="alert">${this.assignmentError}</p>`;
    }
    const userOptions: FieldOption[] = [
      { label: "Unassigned", value: "" },
      ...this.users.map((user) => ({ label: user.name, value: user.id })),
    ];
    const tagOptions: FieldOption[] = [
      { label: "No NFC tag", value: "" },
      ...this.tags.map((tag) => ({
        label: tag.name || tag.id,
        value: tag.id,
      })),
    ];
    const labelOptions = this.labels.map((label) => ({
      label: label.name,
      value: label.label_id,
    }));
    return staticHtml`
      <div class="planning">
        <${selectFieldTag}
          label="Assignee"
          .value=${this.assigneeId}
          .options=${userOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.assignmentChanged(() => {
              this.assigneeId = event.detail;
            })}
        ></${selectFieldTag}>
        <${selectFieldTag}
          label="NFC tag"
          .value=${this.nfcTagId}
          .options=${tagOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.assignmentChanged(() => {
              this.nfcTagId = event.detail;
            })}
        ></${selectFieldTag}>
        <${multiSelectFieldTag}
          label="Labels"
          .value=${this.labelIds}
          .options=${labelOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string[]>) =>
            this.assignmentChanged(() => {
              this.labelIds = event.detail;
            })}
        ></${multiSelectFieldTag}>
      </div>
    `;
  }

  private renderNotification() {
    if (this.notificationLoading) {
      return html`<p class="hint" aria-live="polite">
        Loading notification devices…
      </p>`;
    }
    if (this.notificationError) {
      return html`<p class="error" role="alert">${this.notificationError}</p>`;
    }
    const deviceOptions = this.devices.map((device) => ({
      label: this.deviceName(device),
      value: device.id,
    }));
    return staticHtml`
      <div class="planning">
        <${multiSelectFieldTag}
          label="Mobile devices"
          .value=${this.notificationDeviceIds}
          .options=${deviceOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string[]>) =>
            this.notificationChanged(() => {
              this.notificationDeviceIds = event.detail;
            })}
        ></${multiSelectFieldTag}>
        ${deviceOptions.length
          ? nothing
          : html`<p class="hint">No mobile app devices found.</p>`}
        <${switchFieldTag}
          label="Persistent notification"
          description="Also show this notification in Home Assistant."
          .checked=${this.notificationPersistent}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<boolean>) =>
            this.notificationChanged(() => {
              this.notificationPersistent = event.detail;
            })}
        ></${switchFieldTag}>
        <${switchFieldTag}
          label="Critical notification"
          description="Use critical delivery on supported mobile devices."
          .checked=${this.notificationCritical}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<boolean>) =>
            this.notificationChanged(() => {
              this.notificationCritical = event.detail;
            })}
        ></${switchFieldTag}>
        <${textFieldTag}
          label="Navigation target"
          .value=${this.notificationRoute}
          .error=${this.notificationRouteError}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.notificationChanged(() => {
              this.notificationRoute = event.detail;
            })}
        ></${textFieldTag}>
        <p class="hint">Internal path, for example /lovelace/tasks.</p>
      </div>
    `;
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
        <${expandableTag} heading="Assignment">
          ${this.renderAssignment()}
        </${expandableTag}>
        <${expandableTag} heading="Notifications">
          ${this.renderNotification()}
        </${expandableTag}>
        <${expandableTag} heading="Planning" open>
          ${this.renderPlanning()}
        </${expandableTag}>
        ${this.saveError
          ? html`<p class="error" role="alert">${this.saveError}</p>`
          : nothing}
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
