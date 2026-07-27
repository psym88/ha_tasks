import { LitElement, css, html, nothing } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";

import {
  completeTask,
  loadAssignmentOptions,
  loadAttachmentUrls,
  loadTaskHistory,
} from "./api";
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

class TasksAttachmentPreview extends LitElement {
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
      Open ${this.attachment.filename}
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

class TasksTaskViewer extends LitElement {
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
      gap: 8px;
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
      gap: 2px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
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
      color: var(--secondary-text-color);
    }

    .planning-details dd {
      margin: 0;
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
    attachments: Attachment[],
  ): void {
    this.hass = hass;
    this.task = task;
    this.attachments = attachments.filter(
      (attachment) => attachment.task_id === task.task_id,
    );
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
      loadTaskHistory(this.hass, this.task.task_id),
      loadAttachmentUrls(this.hass, this.task.task_id),
    ]);
    if (assignment.status === "fulfilled") {
      this.users = assignment.value.users;
      this.labels = assignment.value.labels;
      this.tags = assignment.value.tags;
      this.assignmentReady = true;
    } else {
      this.assignmentError = "Assignment details could not be loaded";
    }
    if (history.status === "fulfilled") {
      this.history = Array.isArray(history.value.history)
        ? history.value.history
        : [];
    } else {
      this.historyError = "Completion history could not be loaded";
    }
    if (files.status === "fulfilled") {
      this.signedFiles = files.value.signed_files || {};
    } else {
      this.attachmentError = "Attachment links could not be loaded";
    }
    this.loading = false;
  }

  private formatDate(value?: string | null): string {
    if (!value) {
      return "Not scheduled";
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

  private scheduleText(): string {
    if (this.task.schedule_type === "sensor") {
      const entityId = this.task.problem_sensor || "";
      const name =
        this.hass?.states?.[entityId]?.attributes?.friendly_name || entityId;
      return name ? `When ${name} reports a problem` : "When a problem occurs";
    }
    const interval = Math.max(1, Number(this.task.schedule_interval) || 1);
    const unit = this.task.schedule_unit || "monthly";
    const singular: Record<string, string> = {
      daily: "day",
      weekly: "week",
      monthly: "month",
      yearly: "year",
    };
    const period = `${interval} ${singular[unit]}${interval === 1 ? "" : "s"}`;
    if (this.task.schedule_type === "sliding") {
      return `Every ${period} after completion`;
    }
    const time = this.task.schedule_time || "00:00";
    if (unit === "weekly") {
      const names = Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(this.hass?.locale?.language, {
          weekday: "long",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(2024, 0, index + 1))),
      );
      const weekdays = (this.task.schedule_weekdays || [])
        .map((day) => names[day])
        .filter(Boolean)
        .join(", ");
      return `Every ${period}${weekdays ? ` on ${weekdays}` : ""} at ${time}`;
    }
    if (unit === "monthly") {
      const day =
        this.task.schedule_day === "last"
          ? "the last day"
          : `day ${this.task.schedule_day || 1}`;
      return `Every ${period} on ${day} at ${time}`;
    }
    if (unit === "yearly") {
      const month = new Intl.DateTimeFormat(this.hass?.locale?.language, {
        month: "long",
      }).format(new Date(2024, (this.task.schedule_month || 1) - 1, 1));
      const day =
        this.task.schedule_day === "last"
          ? `the last day of ${month}`
          : `${month} ${this.task.schedule_day || 1}`;
      return `Every ${period} on ${day} at ${time}`;
    }
    return `Every ${period} at ${time}`;
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
    const lines = (this.task.task_description || "").split(/\r?\n/);
    if (!lines.some((line) => line.trim())) {
      return html`<p class="hint">No description.</p>`;
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
    const url = this.signedFiles[attachment.attachment_id];
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
    });
  }

  async complete(): Promise<boolean> {
    if (!this.hass || this.completing) {
      return false;
    }
    const result = await openTasksDialog({
      heading: "Complete task?",
      content: html`<p>
        Mark “${this.task.task_name}” as completed and calculate its next due
        date?
      </p>`,
      actions: [
        { label: "Cancel", value: "cancel" },
        { label: "Complete", value: "complete" },
      ],
    });
    if (result !== "complete") {
      return false;
    }
    this.completing = true;
    this.completionError = "";
    try {
      await completeTask(this.hass, this.task.task_id, this.completionNotes);
      return true;
    } catch (error) {
      this.completionError =
        error instanceof Error ? error.message : String(error);
      return false;
    } finally {
      this.completing = false;
    }
  }

  private renderMetadata() {
    const assignee =
      this.users.find((user) => user.id === this.task.assignee_id)?.name ||
      (this.assignmentReady ? "Unassigned" : "Loading assignment…");
    const tag = this.tags.find((item) => item.id === this.task.nfc_tag_id);
    const labels = (this.task.label_ids || [])
      .map((id) => this.labels.find((label) => label.label_id === id))
      .filter((label): label is TasksLabel => Boolean(label));
    return staticHtml`
      <div class="pills">
        <${pillTag}>${this.formatDate(this.task.task_due)}</${pillTag}>
        <${pillTag}>${assignee}</${pillTag}>
        <${pillTag} tone=${this.task.active === false ? "muted" : "positive"}>
          ${this.task.active === false ? "Inactive" : "Active"}
        </${pillTag}>
        ${this.attachments.length
          ? staticHtml`<${pillTag}>
              ${this.attachments.length}
              ${this.attachments.length === 1 ? "file" : "files"}
            </${pillTag}>`
          : nothing}
        ${tag
          ? staticHtml`<${pillTag}>NFC: ${tag.name || tag.id}</${pillTag}>`
          : nothing}
        ${labels.map(
          (label) =>
            staticHtml`<${pillTag}>${label.name}</${pillTag}>`,
        )}
      </div>
    `;
  }

  private renderAttachments() {
    if (this.attachmentError) {
      return html`<p class="error" role="alert">${this.attachmentError}</p>`;
    }
    if (!this.attachments.length) {
      return html`<p class="hint">No attachments.</p>`;
    }
    return html`
      <ul class="records">
        ${this.attachments.map((attachment) => {
          const available = Boolean(
            this.signedFiles[attachment.attachment_id],
          );
          return html`
            <li>
              <button
                class="record"
                type="button"
                ?disabled=${!available}
                @click=${() => void this.openAttachment(attachment)}
              >
                <span>${attachment.filename}</span>
                <span class="secondary"
                  >${this.formatSize(attachment.size)}</span
                >
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
      return html`<p class="hint">No completion history.</p>`;
    }
    return html`
      <ul class="records">
        ${this.history.map((entry) => html`
          <li class="record">
            <span
              >${this.formatDate(entry.completed_at)} ·
              ${entry.user_name || "System"}</span
            >
            <span class="secondary"
              >${entry.notes === "tasks.history.completed_via_nfc"
                ? "Completed via NFC"
                : entry.notes || "No notes"}</span
            >
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
          ? html`<p class="hint" aria-live="polite">Loading task details…</p>`
          : nothing}
        ${this.assignmentError
          ? html`<p class="error" role="alert">${this.assignmentError}</p>`
          : nothing}
        <${expandableTag} heading="Planning" open>
          <dl class="planning-details">
            <dt>Due</dt>
            <dd>${this.formatDate(this.task.task_due)}</dd>
            <dt>Rule</dt>
            <dd>${this.scheduleText()}</dd>
          </dl>
        </${expandableTag}>
        <${expandableTag} heading="Attachments">
          ${this.renderAttachments()}
        </${expandableTag}>
        <${expandableTag} heading="Completion history">
          ${this.renderHistory()}
        </${expandableTag}>
        <${textFieldTag}
          label="Completion notes"
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
  attachments: Attachment[],
): Promise<boolean> => {
  const viewer = document.createElement(
    taskViewerElementName,
  ) as TasksTaskViewer;
  viewer.configure(hass, task, attachments);
  const result = await openTasksDialog({
    heading: task.task_name,
    content: viewer,
    actions: [
      { label: "Close", value: "close" },
      { label: "Complete", value: "complete", run: () => viewer.complete() },
    ],
  });
  return result === "complete";
};
