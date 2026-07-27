import{a as n,b as i,c as r,d as c,e as h,f as d,g as l,i as m,j as p,k as s,l as u,n as f,o as v,p as a,s as g,t as k}from"./chunk-OV6ILB2H.js";var b=h(g),o=class extends c{static properties={hass:{attribute:!1},snapshot:{state:!0},error:{state:!0}};static styles=n`
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
  `;unsubscribe;connection;language;updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,u(this.language).then(()=>this.requestUpdate()))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let t=this.hass.connection;this.connection=t,this.error=void 0;try{let e=await l(this.hass,T=>{this.snapshot=T});this.connection===t?this.unsubscribe=e:e()}catch(e){this.connection===t&&(this.error=e instanceof Error?e.message:String(e))}}openTask(t){this.hass&&k(this.hass,t,this.snapshot?.attachments||[])}async confirmDelete(t){this.hass&&await v({heading:s("task.delete_title"),content:i`<p>
        ${s("task.delete_confirm",{name:t.task_name})}
      </p>`,actions:[{label:s("common.cancel"),value:"cancel"},{label:s("common.delete"),value:"delete",destructive:!0,run:()=>m(this.hass,t.task_id)}]})}handleTaskAction(t,e){this.hass&&(t==="open"?this.openTask(e):t==="edit"?a(this.hass,e,this.snapshot?.attachments||[]):t==="active"?p(this.hass,e.task_id,e.active===!1):t==="delete"&&this.confirmDelete(e))}render(){let t=this.snapshot;return i`
      <main>
        <header>
          <h1>${s("v2.title")}</h1>
          <div class="header-actions">
            ${t?i`${s("v2.summary",{count:t.tasks.length,revision:t.revision})}`:r}
            <button
              class="add"
              type="button"
              @click=${()=>this.hass&&void a(this.hass)}
            >
              ${s("common.add_task")}
            </button>
          </div>
        </header>
        ${this.error?i`<p class="error">${s("v2.load_error",{message:this.error})}</p>`:t?d`
                <${b}
                  .hass=${this.hass}
                  .tasks=${t.tasks}
                  @tasks-task-open=${e=>this.openTask(e.detail)}
                  @tasks-task-action=${e=>this.handleTaskAction(e.detail.action,e.detail.task)}
                ></${b}>
              `:i`<p>${s("common.loading")}</p>`}
      </main>
    `}},x=f("panel");customElements.get(x)||customElements.define(x,o);
