import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  loadAssignmentOptions,
  loadNotificationDevices,
  loadTaskHistory,
  previewTaskSchedule,
  saveTaskDetails,
  type ScheduleDetails,
} from "./api";
import { errorText, t } from "./localize";
import type {
  Attachment,
  Completion,
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

const statusOptions = (): FieldOption[] => [
  { label: t("app.active"), value: "active" },
  { label: t("app.inactive"), value: "inactive" },
];

const iconOptions = (): FieldOption[] => [
  { label: t("app.title"), value: "mdi:clipboard-check-outline" },
  { label: "🛠", value: "mdi:wrench-outline" },
  { label: "🧹", value: "mdi:broom" },
  { label: "⌂", value: "mdi:home-outline" },
  { label: "📅", value: "mdi:calendar-check-outline" },
];

const triggerOptions = (): FieldOption[] => [
  { label: t("task.sliding"), value: "sliding" },
  { label: t("task.fixed"), value: "fixed" },
  { label: t("task.problem_sensor"), value: "sensor" },
];

const scheduleUnitOptions = (): FieldOption[] => [
  { label: t("task.daily"), value: "daily" },
  { label: t("task.weekly"), value: "weekly" },
  { label: t("task.monthly"), value: "monthly" },
  { label: t("task.yearly"), value: "yearly" },
];

const dayOptions = (): FieldOption[] => [
  ...Array.from({ length: 31 }, (_, index) => ({
    label: String(index + 1),
    value: String(index + 1),
  })),
  { label: t("task.last_day"), value: "last" },
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
    attachments: { state: true },
    stagedFiles: { state: true },
    deletedAttachmentIds: { state: true },
    history: { state: true },
    deletedHistoryEntryIds: { state: true },
    historyLoading: { state: true },
    historyError: { state: true },
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

    .records {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .record {
      display: grid;
      min-width: 0;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .record.pending {
      opacity: 0.55;
      text-decoration: line-through;
    }

    .record-copy {
      display: grid;
      min-width: 0;
      gap: 2px;
    }

    .record-title,
    .record-detail {
      overflow-wrap: anywhere;
    }

    .record-detail {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .record-action {
      min-width: 40px;
      min-height: 40px;
      padding: 0 10px;
      color: var(--error-color);
      background: transparent;
      border: 0;
      border-radius: 20px;
      font: inherit;
      cursor: pointer;
    }

    .pending .record-action {
      color: var(--primary-color);
    }

    .file-picker {
      display: grid;
      gap: 6px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .file-picker input {
      color: var(--primary-text-color);
      font: inherit;
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
  declare attachments: Attachment[];
  declare stagedFiles: File[];
  declare deletedAttachmentIds: string[];
  declare history: Completion[];
  declare deletedHistoryEntryIds: string[];
  declare historyLoading: boolean;
  declare historyError: string;
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
    this.attachments = [];
    this.stagedFiles = [];
    this.deletedAttachmentIds = [];
    this.history = [];
    this.deletedHistoryEntryIds = [];
    this.historyLoading = false;
    this.historyError = "";
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

  configure(
    hass: HomeAssistant,
    task: Task,
    _attachments: Attachment[] = [],
  ): void {
    const parts = localDateParts(hass, task.due);
    const year = Number(parts.year);
    const month = Number(parts.month);
    const day = Number(parts.day);
    const weekday = (new Date(Date.UTC(year, month - 1, day)).getUTCDay() + 6) % 7;
    this.hass = hass;
    this.task = task;
    this.name = task.name;
    this.description = task.description || "";
    this.status = task.active === false ? "inactive" : "active";
    this.icon = task.icon || "";
    this.assigneeId = task.assignee_id || "";
    this.labelIds = [...(task.label_ids || [])];
    this.nfcTagId = task.nfc_tag_id || "";
    this.notificationDeviceIds = [
      ...new Set(
        (task.notification.device_ids || []).filter(
          (id): id is string => typeof id === "string",
        ),
      ),
    ];
    this.notificationPersistent = Boolean(task.notification.persistent);
    this.notificationCritical = Boolean(task.notification.critical);
    this.notificationRoute = task.notification.route || "";
    this.attachments = [...task.attachments];
    this.stagedFiles = [];
    this.deletedAttachmentIds = [];
    this.history = [];
    this.deletedHistoryEntryIds = [];
    this.scheduleType = task.schedule.type;
    if (task.schedule.type === "sensor") {
      this.scheduleUnit = "monthly";
      this.scheduleInterval = 1;
      this.scheduleWeekdays = [weekday];
      this.scheduleDay = day;
      this.scheduleMonth = month;
      this.scheduleTime = `${parts.hour || "09"}:${parts.minute || "00"}`;
      this.problemSensor = task.schedule.entity_id;
    } else {
      this.scheduleUnit = task.schedule.unit;
      this.scheduleInterval = task.schedule.interval;
      this.scheduleWeekdays =
        task.schedule.type === "fixed" && task.schedule.weekdays?.length
          ? [...task.schedule.weekdays]
          : [weekday];
      this.scheduleDay =
        task.schedule.type === "fixed" && task.schedule.day
          ? task.schedule.day
          : day;
      this.scheduleMonth =
        task.schedule.type === "fixed" && task.schedule.month
          ? task.schedule.month
          : month;
      this.scheduleTime =
        (task.schedule.type === "fixed" && task.schedule.time) ||
        `${parts.hour || "09"}:${parts.minute || "00"}`;
      this.problemSensor = "";
    }
    const isNew = !task.id;
    this.scheduleDirty = isNew;
    this.assignmentDirty = isNew;
    this.notificationDirty = isNew;
    void this.loadAssignments();
    void this.loadNotifications();
    void this.loadHistory();
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
      this.assignmentError = t("app.assignment_load_error");
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
      this.notificationError = t("app.notification_load_error");
    } finally {
      this.notificationLoading = false;
    }
  }

  private async loadHistory(): Promise<void> {
    const hass = this.hass;
    const task = this.task;
    if (!hass || !task?.id) {
      return;
    }
    this.historyLoading = true;
    this.historyError = "";
    try {
      const result = await loadTaskHistory(hass, task.id);
      this.history = Array.isArray(result.history) ? result.history : [];
    } catch {
      this.historyError = t("app.history_load_error");
    } finally {
      this.historyLoading = false;
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
        error = t("app.select_binary_sensor");
      }
      if (reportError) {
        this.scheduleError = error;
      }
      return error ? undefined : { type: "sensor", problemSensor };
    }

    if (!Number.isInteger(this.scheduleInterval) || this.scheduleInterval < 1) {
      error = t("app.interval_min");
    } else if (
      this.scheduleType === "fixed" &&
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleTime)
    ) {
      error = t("app.select_valid_time");
    } else if (
      this.scheduleType === "fixed" &&
      this.scheduleUnit === "weekly" &&
      !this.scheduleWeekdays.length
    ) {
      error = t("error.select_at_least_one_weekday");
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
        this.scheduleDirty ? undefined : task.due || undefined,
      );
      if (request === this.previewRequest) {
        this.preview = result.dues;
      }
    } catch {
      if (request === this.previewRequest) {
        this.preview = [];
        this.previewError = t("app.preview_load_error");
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
      this.nameError = t("app.name_required");
    }
    if (
      notificationRoute &&
      (!notificationRoute.startsWith("/") ||
        notificationRoute.startsWith("//"))
    ) {
      this.notificationRouteError = t("app.route_invalid");
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
      await saveTaskDetails(
        this.hass,
        this.task.id ? this.task : undefined,
        {
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
          files: {
            staged: this.stagedFiles,
            deletedAttachmentIds: this.deletedAttachmentIds,
            deletedHistoryEntryIds: this.deletedHistoryEntryIds,
          },
        },
      );
      return true;
    } catch (error) {
      this.saveError = errorText(error);
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
        <p class="caption">${t("task.schedule_weekdays")}</p>
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
          label=${t("task.day")}
          .value=${String(this.scheduleDay)}
          .options=${dayOptions()}
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
            label=${t("task.day")}
            .value=${String(this.scheduleDay)}
            .options=${dayOptions()}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.scheduleDay =
                  event.detail === "last" ? "last" : Number(event.detail);
              })}
          ></${selectFieldTag}>
          <${selectFieldTag}
            label=${t("task.month")}
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
        label=${t("task.time")}
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
      return html`<p class="hint" aria-live="polite">
        ${t("app.loading_preview")}
      </p>`;
    }
    if (this.previewError) {
      return html`<p class="error" role="alert">${this.previewError}</p>`;
    }
    if (this.scheduleType === "sliding") {
      return html`
        <p class="caption">${t("task.first_due")}</p>
        <p class="hint">
          ${this.preview[0] ? this.formatDue(this.preview[0]) : "—"}
        </p>
      `;
    }
    const visible = this.previewExpanded
      ? this.preview
      : this.preview.slice(0, 4);
    return html`
      <p class="caption">${t("task.preview_task_dues")}</p>
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
              ${this.previewExpanded ? t("app.show_less") : t("app.show_all")}
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
            label=${t("task.recurrence_calculation")}
            .value=${this.scheduleType}
            .options=${triggerOptions()}
            ?disabled=${this.saving}
            @value-changed=${(event: CustomEvent<string>) =>
              this.scheduleChanged(() => {
                this.scheduleType = event.detail as ScheduleType;
              })}
          ></${selectFieldTag}>
          <${comboboxFieldTag}
            label=${t("task.problem_sensor")}
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
            ${t("app.sensor_hint")}
          </p>
        </div>
      `;
    }
    return staticHtml`
      <div class="planning">
        <${selectFieldTag}
          label=${t("task.recurrence_calculation")}
          .value=${this.scheduleType}
          .options=${triggerOptions()}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.scheduleChanged(() => {
              this.scheduleType = event.detail as ScheduleType;
            })}
        ></${selectFieldTag}>
        <div class="row">
          <${textFieldTag}
            label=${t("app.every")}
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
            label=${t("app.unit")}
            .value=${this.scheduleUnit}
            .options=${scheduleUnitOptions()}
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
                ${t("app.sliding_hint")}
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
        ${t("app.loading_assignments")}
      </p>`;
    }
    if (this.assignmentError) {
      return html`<p class="error" role="alert">${this.assignmentError}</p>`;
    }
    const userOptions: FieldOption[] = [
      { label: t("task.unassigned"), value: "" },
      ...this.users.map((user) => ({ label: user.name, value: user.id })),
    ];
    const tagOptions: FieldOption[] = [
      { label: t("task.no_nfc_tag"), value: "" },
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
          label=${t("task.user")}
          .value=${this.assigneeId}
          .options=${userOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.assignmentChanged(() => {
              this.assigneeId = event.detail;
            })}
        ></${selectFieldTag}>
        <${selectFieldTag}
          label=${t("task.nfc_tag_id")}
          .value=${this.nfcTagId}
          .options=${tagOptions}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.assignmentChanged(() => {
              this.nfcTagId = event.detail;
            })}
        ></${selectFieldTag}>
        <${multiSelectFieldTag}
          label=${t("task.labels")}
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
        ${t("app.loading_notifications")}
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
          label=${t("app.mobile_devices")}
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
          : html`<p class="hint">${t("app.no_mobile_devices")}</p>`}
        <${switchFieldTag}
          label=${t("task.notification_persistent")}
          description=${t("task.notification_persistent_description")}
          .checked=${this.notificationPersistent}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<boolean>) =>
            this.notificationChanged(() => {
              this.notificationPersistent = event.detail;
            })}
        ></${switchFieldTag}>
        <${switchFieldTag}
          label=${t("task.notification_critical")}
          description=${t("task.notification_critical_description")}
          .checked=${this.notificationCritical}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<boolean>) =>
            this.notificationChanged(() => {
              this.notificationCritical = event.detail;
            })}
        ></${switchFieldTag}>
        <${textFieldTag}
          label=${t("app.navigation_target")}
          .value=${this.notificationRoute}
          .error=${this.notificationRouteError}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) =>
            this.notificationChanged(() => {
              this.notificationRoute = event.detail;
            })}
        ></${textFieldTag}>
        <p class="hint">${t("app.navigation_hint")}</p>
      </div>
    `;
  }

  private formatSize(size: number): string {
    if (size < 1024) {
      return `${size} B`;
    }
    if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  private toggleId(id: string, values: string[]): string[] {
    return values.includes(id)
      ? values.filter((value) => value !== id)
      : [...values, id];
  }

  private renderAttachments() {
    return html`
      <div class="planning">
        ${this.attachments.length || this.stagedFiles.length
          ? html`
              <ul class="records">
                ${this.attachments.map((attachment) => {
                  const pending = this.deletedAttachmentIds.includes(
                    attachment.id,
                  );
                  return html`
                    <li class="record ${pending ? "pending" : ""}">
                      <span class="record-copy">
                        <span class="record-title">${attachment.filename}</span>
                        <span class="record-detail"
                          >${this.formatSize(attachment.size)}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${t(
                          pending
                            ? "app.undo_remove_named"
                            : "app.remove_named",
                          { name: attachment.filename },
                        )}
                        ?disabled=${this.saving}
                        @click=${() => {
                          this.deletedAttachmentIds = this.toggleId(
                            attachment.id,
                            this.deletedAttachmentIds,
                          );
                        }}
                      >
                        ${pending ? t("common.undo") : t("common.remove")}
                      </button>
                    </li>
                  `;
                })}
                ${this.stagedFiles.map(
                  (file, index) => html`
                    <li class="record">
                      <span class="record-copy">
                        <span class="record-title">${file.name}</span>
                        <span class="record-detail"
                          >${this.formatSize(file.size)} ·
                          ${t("app.new_file")}</span
                        >
                      </span>
                      <button
                        class="record-action"
                        type="button"
                        aria-label=${t("app.remove_new_file", {
                          name: file.name,
                        })}
                        ?disabled=${this.saving}
                        @click=${() => {
                          this.stagedFiles = this.stagedFiles.filter(
                            (_, fileIndex) => fileIndex !== index,
                          );
                        }}
                      >
                        ${t("common.remove")}
                      </button>
                    </li>
                  `,
                )}
              </ul>
            `
          : html`<p class="hint">${t("task.no_files")}.</p>`}
        <label class="file-picker">
          <span>${t("app.add_files")}</span>
          <input
            type="file"
            multiple
            ?disabled=${this.saving}
            @change=${(event: Event) => {
              const input = event.target as HTMLInputElement;
              this.stagedFiles = [
                ...this.stagedFiles,
                ...Array.from(input.files || []),
              ];
              input.value = "";
            }}
          />
        </label>
      </div>
    `;
  }

  private renderHistory() {
    if (this.historyLoading) {
      return html`<p class="hint" aria-live="polite">
        ${t("app.loading_history")}
      </p>`;
    }
    if (this.historyError) {
      return html`<p class="error" role="alert">${this.historyError}</p>`;
    }
    if (!this.history.length) {
      return html`<p class="hint">${t("task.no_history")}.</p>`;
    }
    return html`
      <ul class="records">
        ${this.history.map((entry) => {
          const pending = this.deletedHistoryEntryIds.includes(
            entry.id,
          );
          const notes =
            entry.notes === "tasks.history.completed_via_nfc"
              ? t("history.completed_via_nfc")
              : entry.notes || t("app.no_notes");
          return html`
            <li class="record ${pending ? "pending" : ""}">
              <span class="record-copy">
                <span class="record-title"
                  >${this.formatDue(entry.completed_at)} ·
                  ${entry.user_name || t("common.system")}</span
                >
                <span class="record-detail">${notes}</span>
              </span>
              <button
                class="record-action"
                type="button"
                aria-label=${pending
                  ? t("history.undo_remove")
                  : t("history.remove")}
                ?disabled=${this.saving}
                @click=${() => {
                  this.deletedHistoryEntryIds = this.toggleId(
                    entry.id,
                    this.deletedHistoryEntryIds,
                  );
                }}
              >
                ${pending ? t("common.undo") : t("common.remove")}
              </button>
            </li>
          `;
        })}
      </ul>
    `;
  }

  protected render() {
    return staticHtml`
      <form @submit=${(event: Event) => event.preventDefault()}>
        <${textFieldTag}
          label=${t("task.name")}
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
          label=${t("task.optional_description")}
          multiline
          .value=${this.description}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) => {
            this.description = event.detail;
          }}
        ></${textFieldTag}>
        <${selectFieldTag}
          label=${t("app.status")}
          .value=${this.status}
          .options=${statusOptions()}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) => {
            this.status = event.detail as "active" | "inactive";
          }}
        ></${selectFieldTag}>
        <${comboboxFieldTag}
          label=${t("task.icon")}
          .value=${this.icon}
          .options=${iconOptions()}
          ?disabled=${this.saving}
          @value-changed=${(event: CustomEvent<string>) => {
            this.icon = event.detail;
          }}
        ></${comboboxFieldTag}>
        <${expandableTag} heading=${t("task.assignment")}>
          ${this.renderAssignment()}
        </${expandableTag}>
        <${expandableTag} heading=${t("task.notification")}>
          ${this.renderNotification()}
        </${expandableTag}>
        <${expandableTag} heading=${t("task.planning")} open>
          ${this.renderPlanning()}
        </${expandableTag}>
        <${expandableTag} heading=${t("task.files")}>
          ${this.renderAttachments()}
        </${expandableTag}>
        ${this.task?.id
          ? staticHtml`
              <${expandableTag} heading=${t("task.history")}>
                ${this.renderHistory()}
              </${expandableTag}>
            `
          : nothing}
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
  existingTask?: Task,
  attachments: Attachment[] = [],
): Promise<boolean> => {
  const task: Task = existingTask || {
    id: "",
    name: "",
    active: true,
    schedule: {
      type: "sliding",
      unit: "monthly",
      interval: 1,
    },
    notification: {
      device_ids: [],
      persistent: false,
      critical: false,
      route: null,
    },
    due: null,
    completions: [],
    attachments: [],
  };
  const form = document.createElement(taskFormElementName) as TasksTaskForm;
  form.configure(hass, task, attachments);
  const result = await openTasksDialog({
    heading: existingTask
      ? `${t("task.edit")}: ${task.name}`
      : t("task.new"),
    content: form,
    actions: [
      { label: t("common.cancel"), value: "cancel" },
      { label: t("common.save"), value: "save", run: () => form.save() },
    ],
  });
  return result === "save";
};
