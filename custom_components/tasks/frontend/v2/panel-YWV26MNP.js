import{a as o,b as a,c as n,d as c,e as g,f,g as v,h as b,i as y,k,l as x,m as e,n as _,p as $,q as p,r as h,u as T,v as w}from"./chunk-IWV7POVX.js";var l=(r,t,s)=>e(r===1?t:s,{count:r}),A=r=>{let t=r instanceof Error?r.message:String(r),s=`error.${t}`,i=e(s);return i===s?t:i},d=class extends c{static properties={hass:{attribute:!1},busy:{state:!0},status:{state:!0},warning:{state:!0},failed:{state:!0}};static styles=o`
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
  `;constructor(){super(),this.busy=!1,this.warning=!1,this.failed=!1}async exportArchive(){if(!(!this.hass||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[e("settings.exporting")];try{await b(this.hass),this.status=[e("settings.export_complete")]}catch(t){this.failed=!0,this.status=[e("common.error",{message:A(t)})]}finally{this.busy=!1}}}reportLines(t){let s=(t.conversions||[]).map(([S,z])=>e("settings.progress_convert",{from:S,to:z}));s.push(l(t.attachments_imported||0,"settings.progress_attachment_one","settings.progress_attachment_many"),l(t.history_entries_imported||0,"settings.progress_history_one","settings.progress_history_many"),l(t.tasks_imported||0,"settings.progress_task_one","settings.progress_task_many"));let i=t.tasks_skipped||[];return i.length&&s.push(e(i.length===1?"settings.progress_skipped_one":"settings.progress_skipped_many",{count:i.length,names:i.join(", ")})),t.attachments_skipped&&s.push(l(t.attachments_skipped,"settings.progress_attachment_skipped_one","settings.progress_attachment_skipped_many")),this.warning=!!(i.length||t.attachments_skipped),s.push(e(this.warning?"settings.import_complete_warning":"settings.import_complete")),s}async importArchive(t){if(!(!this.hass||!t||this.busy)){this.busy=!0,this.warning=!1,this.failed=!1,this.status=[e("settings.progress_load"),e("settings.progress_unpack")];try{this.status=this.reportLines(await y(this.hass,t))}catch(s){this.failed=!0,this.status=[e("settings.import_failed",{message:A(s)})]}finally{this.busy=!1}}}render(){let t=this.failed?"error":this.warning?"status warning":"status";return a`
      <p>${e("settings.archive_hint")}</p>
      ${this.status?a`<ul class=${t} role="status" aria-live="polite">
            ${this.status.map(s=>a`<li>${s}</li>`)}
          </ul>`:n}
      <input
        id="archive"
        type="file"
        accept=".zip,application/zip"
        ?disabled=${this.busy}
        @change=${s=>{let i=s.currentTarget;this.importArchive(i.files?.[0]),i.value=""}}
      />
      <div class="actions">
        <button
          type="button"
          ?disabled=${this.busy}
          @click=${()=>this.renderRoot.querySelector("#archive")?.click()}
        >
          ${e("settings.import")}
        </button>
        <button
          class="primary"
          type="button"
          ?disabled=${this.busy}
          @click=${()=>{this.exportArchive()}}
        >
          ${e("settings.export")}
        </button>
      </div>
    `}},m=$("archive");customElements.get(m)||customElements.define(m,d);var E=r=>{let t=document.createElement(m);return t.hass=r,p({heading:e("settings.import_export"),content:t,actions:[{label:e("common.close"),value:"close"}]})};var H=g(T),u=class extends c{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=o`
    :host {
      display: block;
      min-height: 100%;
      box-sizing: border-box;
      padding: 24px;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    main {
      max-width: 960px;
      margin: 0 auto;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .add {
      min-height: 40px;
      padding: 0 18px;
      color: var(--text-primary-color, white);
      background: var(--primary-color);
      border: 0;
      border-radius: 20px;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }

    .backup {
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

    .backup:focus-visible,
    .add:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .error {
      color: var(--error-color);
    }

    @media (max-width: 520px) {
      header,
      .header-actions {
        align-items: flex-start;
      }

      header {
        flex-direction: column;
      }
    }
  `;unsubscribe;connection;language;updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,_(this.language).then(()=>this.requestUpdate()))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let t=this.hass.connection;this.connection=t,this.error=void 0;try{let s=await v(this.hass,i=>{this.snapshot=i});this.connection===t?this.unsubscribe=s:s()}catch(s){this.connection===t&&(this.error=s instanceof Error?s.message:String(s))}}openTask(t){this.hass&&w(this.hass,t,this.snapshot?.attachments||[])}async confirmDelete(t){this.hass&&await p({heading:e("task.delete_title"),content:a`<p>
        ${e("task.delete_confirm",{name:t.task_name})}
      </p>`,actions:[{label:e("common.cancel"),value:"cancel"},{label:e("common.delete"),value:"delete",destructive:!0,run:()=>k(this.hass,t.task_id)}]})}handleTaskAction(t,s){this.hass&&(t==="open"?this.openTask(s):t==="edit"?h(this.hass,s,this.snapshot?.attachments||[]):t==="active"?x(this.hass,s.task_id,s.active===!1):t==="delete"&&this.confirmDelete(s))}render(){let t=this.snapshot;return a`
      <main>
        <header>
          <h1>${e("v2.title")}</h1>
          <div class="header-actions">
            ${t?a`${e("v2.summary",{count:t.tasks.length,revision:t.revision})}`:n}
            <button
              class="backup"
              type="button"
              @click=${()=>this.hass&&void E(this.hass)}
            >
              ${e("settings.import_export")}
            </button>
            <button
              class="add"
              type="button"
              @click=${()=>this.hass&&void h(this.hass)}
            >
              ${e("common.add_task")}
            </button>
          </div>
        </header>
        ${this.error?a`<p class="error">${e("v2.load_error",{message:this.error})}</p>`:t?f`
                <${H}
                  .hass=${this.hass}
                  .tasks=${t.tasks}
                  @tasks-task-open=${s=>this.openTask(s.detail)}
                  @tasks-task-action=${s=>this.handleTaskAction(s.detail.action,s.detail.task)}
                ></${H}>
              `:a`<p>${e("common.loading")}</p>`}
      </main>
    `}},L="tasks-panel";customElements.get(L)||customElements.define(L,u);
