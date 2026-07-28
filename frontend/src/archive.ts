import { LitElement, css, html, nothing } from "lit";

import {
  exportTasksArchive,
  importTasksArchive,
  type ArchiveImportReport,
} from "./api";
import { errorText, t } from "./localize";
import type { HomeAssistant } from "./types";
import { openTasksDialog } from "./ui/dialog";
import { elementName } from "./version";

const countText = (count: number, one: string, many: string): string =>
  t(count === 1 ? one : many, { count });

class TasksArchive extends LitElement {
  static properties = {
    hass: { attribute: false },
    busy: { state: true },
    status: { state: true },
    warning: { state: true },
    failed: { state: true },
  };

  static styles = css`
    :host {
      display: grid;
      gap: 18px;
    }

    p,
    ul {
      margin: 0;
    }

    ul {
      display: grid;
      gap: 6px;
      padding-inline-start: 24px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    button {
      min-height: 40px;
      padding: 0 16px;
      color: var(--primary-color);
      background: transparent;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }

    button.primary {
      color: var(--text-primary-color, white);
      background: var(--primary-color);
      border-color: var(--primary-color);
    }

    button:disabled {
      opacity: 0.55;
      cursor: default;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    input {
      display: none;
    }

    .status {
      color: var(--success-color);
    }

    .warning {
      color: var(--warning-color);
    }

    .error {
      color: var(--error-color);
    }
  `;

  declare hass?: HomeAssistant;
  declare busy: boolean;
  declare status?: string[];
  declare warning: boolean;
  declare failed: boolean;

  constructor() {
    super();
    this.busy = false;
    this.warning = false;
    this.failed = false;
  }

  private async exportArchive(): Promise<void> {
    if (!this.hass || this.busy) {
      return;
    }
    this.busy = true;
    this.warning = false;
    this.failed = false;
    this.status = [t("settings.exporting")];
    try {
      await exportTasksArchive(this.hass);
      this.status = [t("settings.export_complete")];
    } catch (error) {
      this.failed = true;
      this.status = [t("common.error", { message: errorText(error) })];
    } finally {
      this.busy = false;
    }
  }

  private reportLines(report: ArchiveImportReport): string[] {
    const lines: string[] = [];
    lines.push(
      countText(
        report.attachments_imported || 0,
        "settings.progress_attachment_one",
        "settings.progress_attachment_many",
      ),
      countText(
        report.history_entries_imported || 0,
        "settings.progress_history_one",
        "settings.progress_history_many",
      ),
      countText(
        report.tasks_imported || 0,
        "settings.progress_task_one",
        "settings.progress_task_many",
      ),
    );
    const skipped = report.tasks_skipped || [];
    if (skipped.length) {
      lines.push(
        t(
          skipped.length === 1
            ? "settings.progress_skipped_one"
            : "settings.progress_skipped_many",
          { count: skipped.length, names: skipped.join(", ") },
        ),
      );
    }
    if (report.attachments_skipped) {
      lines.push(
        countText(
          report.attachments_skipped,
          "settings.progress_attachment_skipped_one",
          "settings.progress_attachment_skipped_many",
        ),
      );
    }
    this.warning = Boolean(skipped.length || report.attachments_skipped);
    lines.push(
      t(
        this.warning
          ? "settings.import_complete_warning"
          : "settings.import_complete",
      ),
    );
    return lines;
  }

  private async importArchive(file?: File): Promise<void> {
    if (!this.hass || !file || this.busy) {
      return;
    }
    this.busy = true;
    this.warning = false;
    this.failed = false;
    this.status = [
      t("settings.progress_load"),
      t("settings.progress_unpack"),
    ];
    try {
      this.status = this.reportLines(
        await importTasksArchive(this.hass, file),
      );
    } catch (error) {
      this.failed = true;
      this.status = [
        t("settings.import_failed", { message: errorText(error) }),
      ];
    } finally {
      this.busy = false;
    }
  }

  protected render() {
    const statusClass = this.failed
      ? "error"
      : this.warning
        ? "status warning"
        : "status";
    return html`
      <p>${t("settings.archive_hint")}</p>
      ${this.status
        ? html`<ul class=${statusClass} role="status" aria-live="polite">
            ${this.status.map((line) => html`<li>${line}</li>`)}
          </ul>`
        : nothing}
      <input
        id="archive"
        type="file"
        accept=".zip,application/zip"
        ?disabled=${this.busy}
        @change=${(event: Event) => {
          const input = event.currentTarget as HTMLInputElement;
          void this.importArchive(input.files?.[0]);
          input.value = "";
        }}
      />
      <div class="actions">
        <button
          type="button"
          ?disabled=${this.busy}
          @click=${() =>
            this.renderRoot.querySelector<HTMLInputElement>("#archive")?.click()}
        >
          ${t("settings.import")}
        </button>
        <button
          class="primary"
          type="button"
          ?disabled=${this.busy}
          @click=${() => void this.exportArchive()}
        >
          ${t("settings.export")}
        </button>
      </div>
    `;
  }
}

const archiveElementName = elementName("archive");

if (!customElements.get(archiveElementName)) {
  customElements.define(archiveElementName, TasksArchive);
}

export const openArchive = (hass: HomeAssistant): Promise<string> => {
  const content = document.createElement(archiveElementName) as TasksArchive;
  content.hass = hass;
  return openTasksDialog({
    heading: t("settings.import_export"),
    content,
    actions: [{ label: t("common.close"), value: "close" }],
  });
};
