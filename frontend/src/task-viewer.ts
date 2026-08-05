import { css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  completeTask,
  loadAssignmentOptions,
  loadAttachmentUrls,
  loadTaskHistory,
} from "./api";
import { fileIcon } from "./file-icon";
import { errorText, t, timedScheduleText } from "./localize";
import { LocalizedLitElement } from "./localized-element";
import { problemSensorStatus } from "./problem-sensor-status";
import type {
  Attachment,
  Completion,
  HomeAssistant,
  Task,
  TasksLabel,
  TasksTag,
  TasksUser,
} from "./types";
import { openTasksDialog } from "./ui/dialog";
import { expandableElementName } from "./ui/expandable";
import { textFieldElementName } from "./ui/fields";
import { pillElementName } from "./ui/pill";
import { elementName } from "./version";

const expandableTag = unsafeStatic(expandableElementName);
const pillTag = unsafeStatic(pillElementName);
const textFieldTag = unsafeStatic(textFieldElementName);

class TasksAttachmentPreview extends LocalizedLitElement {
  static properties = {
    attachment: { attribute: false },
    url: {},
  };

  static styles = css`
    :host {
      display: block;
    }

    img,
    video,
    iframe {
      display: block;
      width: 100%;
      max-height: 70dvh;
      border: 0;
      object-fit: contain;
    }

    audio {
      width: 100%;
    }

    iframe {
      height: 70dvh;
    }

    a {
      color: var(--primary-color);
    }
  `;

  declare attachment: Attachment;
  declare url: string;

  protected render() {
    const type = this.attachment.content_type;
    if (type.startsWith("image/")) {
      return html`<img src=${this.url} alt=${this.attachment.filename} />`;
    }
    if (type.startsWith("video/")) {
      return html`<video src=${this.url} controls></video>`;
    }
    if (type.startsWith("audio/")) {
      return html`<audio src=${this.url} controls></audio>`;
    }
    if (type === "application/pdf") {
      return html`<iframe
        src=${this.url}
        title=${this.attachment.filename}
      ></iframe>`;
    }
    return html`<a href=${this.url} target="_blank" rel="noopener">
      ${t("app.open_file", { name: this.attachment.filename })}
    </a>`;
  }
}

const attachmentPreviewElementName = elementName("attachment-preview");
if (!customElements.get(attachmentPreviewElementName)) {
  customElements.define(
    attachmentPreviewElementName,
    TasksAttachmentPreview,
  );
}

class TasksTaskViewer extends LocalizedLitElement {
  static properties = {
    task: { attribute: false },
    attachments: { state: true },
    users: { state: true },
    labels: { state: true },
    tags: { state: true },
    history: { state: true },
    signedFiles: { state: true },
    loading: { state: true },
    assignmentReady: { state: true },
    assignmentError: { state: true },
    historyError: { state: true },
    attachmentError: { state: true },
    completionNotes: { state: true },
    completionError: { state: true },
    completing: { state: true },
  };

  static styles = css`
    :host,
    .content,
    .records {
      display: grid;
      gap: 12px;
    }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .pills > * {
      margin: 0;
    }

    .pill-break {
      flex-basis: 100%;
      height: 0;
    }

    .description,
    .hint,
    .error {
      margin: 0;
    }

    .description {
      display: grid;
      gap: 8px;
      white-space: pre-wrap;
    }

    .description :is(p, h3, h4, ul, ol, blockquote) {
      margin: 0;
    }

    .description :is(ul, ol) {
      padding-left: 24px;
    }

    .description blockquote {
      padding-left: 12px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--divider-color);
    }

    .description a {
      color: var(--primary-color);
    }

    .description code {
      padding: 1px 4px;
      background: var(--secondary-background-color);
      border-radius: 4px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .error {
      color: var(--error-color);
      font-size: 13px;
    }

    .records {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .record {
      display: grid;
      min-width: 0;
      grid-template-columns: 32px minmax(0, 1fr);
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
    }

    .record-icon {
      --mdc-icon-size: 22px;
      color: var(--secondary-text-color);
    }

    .record-content {
      display: grid;
      min-width: 0;
      gap: 2px;
    }

    button.record {
      width: 100%;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    button.record:hover {
      background: var(--secondary-background-color);
    }

    .secondary {
      color: var(--secondary-text-color);
      font-size: 13px;
      overflow-wrap: anywhere;
    }

    .planning-details {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: 8px 12px;
      margin: 0;
    }

    .planning-details dt {
      color: var(--primary-text-color);
    }

    .planning-details dd {
      margin: 0;
    }

    .entity-state {
      padding: 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-decoration: underline;
      cursor: pointer;
    }

    .entity-state.unavailable,
    .unavailable {
      color: var(--error-color);
    }

    @media (max-width: 520px) {
      .planning-details {
        grid-template-columns: 1fr;
        gap: 2px;
      }

      .planning-details dd + dt {
        margin-top: 8px;
      }
    }
  `;

  declare task: Task;
  declare attachments: Attachment[];
  declare users: TasksUser[];
  declare labels: TasksLabel[];
  declare tags: TasksTag[];
  declare history: Completion[];
  declare signedFiles: Record<string, string>;
  declare loading: boolean;
  declare assignmentReady: boolean;
  declare assignmentError: string;
  declare historyError: string;
  declare attachmentError: string;
  declare completionNotes: string;
  declare completionError: string;
  declare completing: boolean;

  private hass?: HomeAssistant;

  constructor() {
    super();
    this.attachments = [];
    this.users = [];
    this.labels = [];
    this.tags = [];
    this.history = [];
    this.signedFiles = {};
    this.loading = false;
    this.assignmentReady = false;
    this.assignmentError = "";
    this.historyError = "";
    this.attachmentError = "";
    this.completionNotes = "";
    this.completionError = "";
    this.completing = false;
  }

  configure(
    hass: HomeAssistant,
    task: Task,
    _attachments: Attachment[] = [],
  ): void {
    this.hass = hass;
    this.task = task;
    this.attachments = [...task.attachments];
    void this.loadDetails();
  }

  private async loadDetails(): Promise<void> {
    if (!this.hass) {
      return;
    }
    this.loading = true;
    this.assignmentError = "";
    this.historyError = "";
    this.attachmentError = "";
    const [assignment, history, files] = await Promise.allSettled([
      loadAssignmentOptions(this.hass),
      loadTaskHistory(this.hass, this.task.id),
      loadAttachmentUrls(this.hass, this.task.id),
    ]);
    if (assignment.status === "fulfilled") {
      this.users = assignment.value.users;
      this.labels = assignment.value.labels;
      this.tags = assignment.value.tags;
      this.assignmentReady = true;
    } else {
      this.assignmentError = t("app.assignment_load_error");
    }
    if (history.status === "fulfilled") {
      this.history = Array.isArray(history.value.history)
        ? history.value.history
        : [];
    } else {
      this.historyError = t("app.history_load_error");
    }
    if (files.status === "fulfilled") {
      this.signedFiles = files.value.signed_files || {};
    } else {
      this.attachmentError = t("app.attachment_load_error");
    }
    this.loading = false;
  }

  private formatDate(value?: string | null): string {
    if (!value) {
      return t("app.not_scheduled");
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat(this.hass?.locale?.language, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: this.hass?.config?.time_zone,
    }).format(date);
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

  private renderInline(text: string) {
    const parts: unknown[] = [];
    const pattern =
      /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
    let position = 0;
    for (const match of text.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (index > position) {
        parts.push(text.slice(position, index));
      }
      if (match[2]) {
        parts.push(html`<strong>${match[2]}</strong>`);
      } else if (match[3]) {
        parts.push(html`<em>${match[3]}</em>`);
      } else if (match[4]) {
        parts.push(html`<code>${match[4]}</code>`);
      } else if (match[5] && match[6]) {
        const url = match[6];
        parts.push(
          /^(?:https?:|mailto:|\/|#)/.test(url)
            ? html`<a href=${url} target="_blank" rel="noopener"
                >${match[5]}</a
              >`
            : match[5],
        );
      }
      position = index + match[0].length;
    }
    if (position < text.length) {
      parts.push(text.slice(position));
    }
    return parts;
  }

  private renderDescription() {
    const lines = (this.task.description || "").split(/\r?\n/);
    if (!lines.some((line) => line.trim())) {
      return html`<p class="hint">${t("task.no_description")}.</p>`;
    }
    const blocks: unknown[] = [];
    for (let index = 0; index < lines.length; ) {
      const line = lines[index];
      if (!line.trim()) {
        index += 1;
      } else if (line.startsWith("- ")) {
        const items: string[] = [];
        while (lines[index]?.startsWith("- ")) {
          items.push(lines[index].slice(2));
          index += 1;
        }
        blocks.push(
          html`<ul>
            ${items.map((item) => html`<li>${this.renderInline(item)}</li>`)}
          </ul>`,
        );
      } else if (/^\d+\. /.test(line)) {
        const items: string[] = [];
        while (/^\d+\. /.test(lines[index] || "")) {
          items.push(lines[index].replace(/^\d+\. /, ""));
          index += 1;
        }
        blocks.push(
          html`<ol>
            ${items.map((item) => html`<li>${this.renderInline(item)}</li>`)}
          </ol>`,
        );
      } else {
        const match = /^(#{1,2})\s+(.+)$/.exec(line);
        blocks.push(
          match
            ? match[1].length === 1
              ? html`<h3>${this.renderInline(match[2])}</h3>`
              : html`<h4>${this.renderInline(match[2])}</h4>`
            : line.startsWith("> ")
              ? html`<blockquote>${this.renderInline(line.slice(2))}</blockquote>`
              : html`<p>${this.renderInline(line)}</p>`,
        );
        index += 1;
      }
    }
    return blocks;
  }

  private async openAttachment(attachment: Attachment): Promise<void> {
    const url = this.signedFiles[attachment.id];
    if (!url) {
      return;
    }
    const preview = document.createElement(
      attachmentPreviewElementName,
    ) as TasksAttachmentPreview;
    preview.attachment = attachment;
    preview.url = url;
    await openTasksDialog({
      heading: attachment.filename,
      content: preview,
      width: "large",
    });
  }

  async complete(): Promise<boolean> {
    if (!this.hass || this.completing) {
      return false;
    }
    const result = await openTasksDialog({
      heading: t("task.complete_title"),
      content: html`<p>
        ${t("task.complete_confirm", { name: this.task.name })}
      </p>`,
      actions: [
        { label: t("common.cancel"), value: "cancel" },
        { label: t("app.complete"), value: "complete" },
      ],
    });
    if (result !== "complete") {
      return false;
    }
    this.completing = true;
    this.completionError = "";
    try {
      await completeTask(this.hass, this.task.id, this.completionNotes);
      return true;
    } catch (error) {
      this.completionError = errorText(error);
      return false;
    } finally {
      this.completing = false;
    }
  }

  private renderMetadata() {
    const assignee = this.users.find(
      (user) => user.id === this.task.assignee_id,
    )?.name;
    const tag = this.tags.find((item) => item.id === this.task.nfc_tag_id);
    const labels = (this.task.label_ids || [])
      .map((id) => this.labels.find((label) => label.label_id === id))
      .filter((label): label is TasksLabel => Boolean(label));
    return staticHtml`
      <div class="pills">
        ${this.task.due
          ? staticHtml`<${pillTag}>
              ${this.formatDate(this.task.due)}
            </${pillTag}>`
          : nothing}
        ${assignee
          ? staticHtml`<${pillTag}>${assignee}</${pillTag}>`
          : nothing}
        ${this.attachments.length
          ? staticHtml`<${pillTag}>
              ${t(
                this.attachments.length === 1
                  ? "app.file_count_one"
                  : "app.file_count_many",
                { count: this.attachments.length },
              )}
            </${pillTag}>`
          : nothing}
        ${tag
          ? staticHtml`<${pillTag}>NFC: ${tag.name || tag.id}</${pillTag}>`
          : nothing}
        ${labels.length ? html`<span class="pill-break"></span>` : nothing}
        ${labels.map(
          (label) =>
            staticHtml`<${pillTag}>${label.name}</${pillTag}>`,
        )}
      </div>
    `;
  }

  private planningWarning(): boolean {
    return (
      this.task.schedule.type === "sensor" &&
      problemSensorStatus(this.hass, this.task.schedule) !== "available"
    );
  }

  private scheduleText(): string {
    const schedule = this.task.schedule;
    if (schedule.type === "sensor") {
      return t("schedule.problem_sensor_description");
    }
    const interval = Math.max(1, Number(schedule.interval) || 1);
    const periodKey = {
      daily: "day",
      weekly: "week",
      monthly: "month",
      yearly: "year",
    } as const;
    const singular = t(`schedule.period_${periodKey[schedule.unit]}`);
    const plural = t(`schedule.period_${periodKey[schedule.unit]}s`);
    if (schedule.type === "sliding") {
      return t(
        interval === 1
          ? "schedule.after_completion_one"
          : "schedule.after_completion_many",
        {
          schedule_interval: interval,
          period: interval === 1 ? singular : plural,
        },
      );
    }
    const time = schedule.time || "09:00";
    if (schedule.unit === "weekly") {
      const names = Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(this.hass?.locale?.language, {
          weekday: "long",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(2024, 0, index + 1))),
      );
      const weekdays = (schedule.weekdays || [])
        .map((day) => names[day])
        .filter(Boolean);
      const joined = weekdays.length > 1
        ? `${weekdays.slice(0, -1).join(", ")} ${t("schedule.and")} ${weekdays.at(-1)}`
        : weekdays[0] || "";
      const description = t(
        interval === 1 ? "schedule.weekly_one" : "schedule.weekly_many",
        {
          schedule_interval: interval,
          days: joined ? ` ${t("schedule.on_days", { days: joined })}` : "",
        },
      );
      return timedScheduleText(description, time);
    }
    if (schedule.unit === "monthly") {
      const day = schedule.day === "last"
        ? t("schedule.on_last_day")
        : t("schedule.on_day_number", { day: Number(schedule.day || 1) });
      return timedScheduleText(t(
        interval === 1 ? "schedule.monthly_one" : "schedule.monthly_many",
        { schedule_interval: interval, day },
      ), time);
    }
    if (schedule.unit === "yearly") {
      const month = new Intl.DateTimeFormat(this.hass?.locale?.language, {
        month: "long",
      }).format(new Date(2024, (schedule.month || 1) - 1, 1));
      const day = schedule.day === "last"
        ? t("schedule.on_last_day_of_month", { month })
        : t("schedule.on_day_of_month", {
            day: Number(schedule.day || 1),
            month,
          });
      return timedScheduleText(t(
        interval === 1 ? "schedule.yearly_one" : "schedule.yearly_many",
        { schedule_interval: interval, day },
      ), time);
    }
    return timedScheduleText(t(
      interval === 1 ? "schedule.fixed_one" : "schedule.fixed_many",
      {
        schedule_interval: interval,
        period: interval === 1 ? singular : plural,
      },
    ), time);
  }

  private renderPlanning() {
    const schedule = this.task.schedule;
    const sensorState = schedule.type === "sensor"
      ? this.hass?.states?.[schedule.entity_id]
      : undefined;
    const sensorName = sensorState?.attributes?.friendly_name;
    const sensorStatus = schedule.type === "sensor"
      ? problemSensorStatus(this.hass, schedule)
      : undefined;
    return html`
      <dl class="planning-details">
        <dt>${t("task.recurrence_calculation")}</dt>
        <dd>${schedule.type === "sensor"
          ? t("task.problem_sensor")
          : schedule.type === "fixed"
            ? t("task.fixed")
            : t("task.sliding")}</dd>
        <dt>${t("task.planning")}</dt>
        <dd>${this.scheduleText()}</dd>
        ${schedule.type === "sensor"
          ? html`
              <dt>${t("task.problem_sensor")}</dt>
              <dd>
                ${sensorName ? `${sensorName} · ` : ""}${schedule.entity_id}
              </dd>
              <dt>${t("app.status")}</dt>
              <dd class=${sensorStatus === "available" ? "" : "unavailable"}>
                ${sensorState
                  ? html`
                      <button
                        class="entity-state ${sensorStatus === "available"
                          ? ""
                          : "unavailable"}"
                        type="button"
                        @click=${() => this.dispatchEvent(
                          new CustomEvent("hass-more-info", {
                            detail: { entityId: schedule.entity_id },
                            bubbles: true,
                            composed: true,
                          }),
                        )}
                      >
                        ${sensorState.state}
                      </button>
                    `
                  : t("problem.sensor_missing_short")}
              </dd>
            `
          : nothing}
      </dl>
    `;
  }

  private renderAttachments() {
    if (this.attachmentError) {
      return html`<p class="error" role="alert">${this.attachmentError}</p>`;
    }
    if (!this.attachments.length) {
      return html`<p class="hint">${t("task.no_files")}.</p>`;
    }
    return html`
      <ul class="records">
        ${this.attachments.map((attachment) => {
          const available = Boolean(
            this.signedFiles[attachment.id],
          );
          return html`
            <li>
              <button
                class="record"
                type="button"
                ?disabled=${!available}
                @click=${() => void this.openAttachment(attachment)}
              >
                <ha-icon
                  class="record-icon"
                  .icon=${fileIcon(
                    attachment.filename,
                    attachment.content_type,
                  )}
                ></ha-icon>
                <span class="record-content">
                  <span>${attachment.filename}</span>
                  <span class="secondary">
                    ${this.formatSize(attachment.size)}
                  </span>
                </span>
              </button>
            </li>
          `;
        })}
      </ul>
    `;
  }

  private renderHistory() {
    if (this.historyError) {
      return html`<p class="error" role="alert">${this.historyError}</p>`;
    }
    if (!this.history.length) {
      return html`<p class="hint">${t("task.no_history")}.</p>`;
    }
    return html`
      <ul class="records">
        ${this.history.map((entry) => html`
          <li class="record">
            <ha-icon class="record-icon" icon="mdi:history"></ha-icon>
            <span class="record-content">
              <span>
                ${this.formatDate(entry.completed_at)} ·
                ${entry.user_name || t("common.system")}
              </span>
              <span class="secondary">
                ${entry.notes === "tasks.history.completed_via_nfc"
                  ? t("history.completed_via_nfc")
                  : entry.notes || t("app.no_notes")}
              </span>
            </span>
          </li>
        `)}
      </ul>
    `;
  }

  protected render() {
    return staticHtml`
      <div class="content">
        ${this.renderMetadata()}
        <div class="description">${this.renderDescription()}</div>
        ${this.loading
          ? html`<p class="hint" aria-live="polite">
              ${t("app.loading_details")}
            </p>`
          : nothing}
        ${this.assignmentError
          ? html`<p class="error" role="alert">${this.assignmentError}</p>`
          : nothing}
        <${expandableTag}
          heading=${t("task.planning")}
          .warning=${this.planningWarning()}
        >
          ${this.renderPlanning()}
        </${expandableTag}>
        <${expandableTag} heading=${t("task.files")}>
          ${this.renderAttachments()}
        </${expandableTag}>
        <${expandableTag} heading=${t("task.history")}>
          ${this.renderHistory()}
        </${expandableTag}>
        <${textFieldTag}
          label=${t("task.completion_notes")}
          multiline
          .value=${this.completionNotes}
          ?disabled=${this.completing}
          @value-changed=${(event: CustomEvent<string>) => {
            this.completionNotes = event.detail;
          }}
        ></${textFieldTag}>
        ${this.completionError
          ? html`<p class="error" role="alert">${this.completionError}</p>`
          : nothing}
      </div>
    `;
  }
}

const taskViewerElementName = elementName("task-viewer");
if (!customElements.get(taskViewerElementName)) {
  customElements.define(taskViewerElementName, TasksTaskViewer);
}

export const openTaskViewer = async (
  hass: HomeAssistant,
  task: Task,
  attachments: Attachment[] = [],
): Promise<boolean> => {
  const viewer = document.createElement(
    taskViewerElementName,
  ) as TasksTaskViewer;
  viewer.configure(hass, task, attachments);
  const result = await openTasksDialog({
    heading: task.name,
    content: viewer,
    actions: [
      {
        label: t("app.complete"),
        value: "complete",
        run: () => viewer.complete(),
      },
    ],
  });
  return result === "complete";
};
