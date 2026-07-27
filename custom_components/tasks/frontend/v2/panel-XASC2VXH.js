import{a as n,b as t,c as o,d as r,e as c,f as h,g as d,i as l,j as p,k as m,l as u,m as i,p as f,q as k}from"./chunk-NLD4M7K3.js";var v=c(f),a=class extends r{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=n`
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
  `;unsubscribe;connection;updated(){this.hass?.connection!==this.connection&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass.connection;this.connection=e,this.error=void 0;try{let s=await d(this.hass,g=>{this.snapshot=g});this.connection===e?this.unsubscribe=s:s()}catch(s){this.connection===e&&(this.error=s instanceof Error?s.message:String(s))}}openTask(e){this.hass&&k(this.hass,e,this.snapshot?.attachments||[])}async confirmDelete(e){this.hass&&await u({heading:"Delete task?",content:t`
        <p>
          Delete “${e.task_name}” including its completion history and
          attachments?
        </p>
      `,actions:[{label:"Cancel",value:"cancel"},{label:"Delete",value:"delete",destructive:!0,run:()=>l(this.hass,e.task_id)}]})}handleTaskAction(e,s){this.hass&&(e==="open"?this.openTask(s):e==="edit"?i(this.hass,s,this.snapshot?.attachments||[]):e==="active"?p(this.hass,s.task_id,s.active===!1):e==="delete"&&this.confirmDelete(s))}render(){let e=this.snapshot;return t`
      <main>
        <header>
          <h1>Tasks V2</h1>
          <div class="header-actions">
            ${e?t`${e.tasks.length} Tasks · Revision ${e.revision}`:o}
            <button
              class="add"
              type="button"
              @click=${()=>this.hass&&void i(this.hass)}
            >
              Add task
            </button>
          </div>
        </header>
        ${this.error?t`<p class="error">Tasks konnten nicht geladen werden: ${this.error}</p>`:e?h`
                <${v}
                  .hass=${this.hass}
                  .tasks=${e.tasks}
                  @tasks-task-open=${s=>this.openTask(s.detail)}
                  @tasks-task-action=${s=>this.handleTaskAction(s.detail.action,s.detail.task)}
                ></${v}>
              `:t`<p>Tasks werden geladen …</p>`}
      </main>
    `}},b=m("panel");customElements.get(b)||customElements.define(b,a);
