import{a as b,b as c,c as u,d as _,e as $,f as h,g as T,h as C,i as E,j as S,k as n,l as y,m as D,o as I,p as v,q as Z,r as A,t as M}from"./chunk-OV6ILB2H.js";var d="tasks-card-v2",k="tasks-card-v2-editor",p=[{value:"due",label:"task.due"},{value:"assignee",label:"task.user"},{value:"nfc_tag",label:"task.nfc_tag_id"},{value:"labels",label:"task.labels"}],m=()=>({type:`custom:${d}`,show_action_menu:!1,show_add_task:!1,secondary_info:p.map(i=>i.value),due_days:0,assignee_filter:"all"}),P=()=>{let{type:i,...e}=m();return e},L=(i={})=>{let e=Number(i.due_days);return{...m(),...i,type:i.type||`custom:${d}`,show_action_menu:i.show_action_menu===!0,show_add_task:i.show_add_task===!0,secondary_info:Array.isArray(i.secondary_info)?i.secondary_info.filter((t,s,a)=>p.some(o=>o.value===t)&&a.indexOf(t)===s):p.map(t=>t.value),due_days:i.due_days===null?null:Number.isInteger(e)&&e>=0?e:0,assignee_filter:typeof i.assignee_filter=="string"&&i.assignee_filter.trim()?i.assignee_filter.trim():"all"}},l=(i,e)=>{let t=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}).formatToParts(new Date(i)),s=a=>t.find(o=>o.type===a)?.value||"";return`${s("year")}-${s("month")}-${s("day")}`},U=(i,e)=>{let[t,s,a]=i.split("-").map(Number);return new Date(Date.UTC(t,s-1,a+e)).toISOString().slice(0,10)},w=class extends _{static properties={hass:{attribute:!1},config:{state:!0}};static styles=b`
    :host {
      display: grid;
      gap: 18px;
      padding: 8px 0;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    fieldset {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      border: 0;
    }

    legend {
      margin-bottom: 4px;
      font-weight: 600;
    }

    label {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 36px;
    }

    label.field {
      display: grid;
      gap: 5px;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin: 0;
      accent-color: var(--primary-color);
    }

    input[type="number"],
    select {
      min-height: 40px;
      box-sizing: border-box;
      padding: 7px 10px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font: inherit;
    }
  `;language;constructor(){super(),this.config=m()}setConfig(e){this.config=L(e)}updated(){this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,y(this.language).then(()=>this.requestUpdate()))}change(e){this.config={...this.config,...e},this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:this.config}}))}render(){let e=!["all","current_user"].includes(this.config.assignee_filter);return c`
      <fieldset>
        <legend>${n("card.options")}</legend>
        <label>
          <input
            type="checkbox"
            .checked=${this.config.show_action_menu}
            @change=${t=>this.change({show_action_menu:t.currentTarget.checked})}
          >
          ${n("card.show_action_menu")}
        </label>
        <label>
          <input
            type="checkbox"
            .checked=${this.config.show_add_task}
            @change=${t=>this.change({show_add_task:t.currentTarget.checked})}
          >
          ${n("card.show_add_task")}
        </label>
      </fieldset>
      <fieldset>
        <legend>${n("card.state_content")}</legend>
        ${p.map(t=>c`
            <label>
              <input
                type="checkbox"
                .checked=${this.config.secondary_info.includes(t.value)}
                @change=${s=>{let a=s.currentTarget.checked;this.change({secondary_info:a?[...this.config.secondary_info,t.value]:this.config.secondary_info.filter(o=>o!==t.value)})}}
              >
              ${n(t.label)}
            </label>
          `)}
      </fieldset>
      <fieldset>
        <legend>${n("card.filter")}</legend>
        <label class="field">
          <span>${n("card.due_days")}</span>
          <input
            type="number"
            min="0"
            step="1"
            .value=${this.config.due_days===null?"":String(this.config.due_days)}
            @change=${t=>{let s=t.currentTarget.value;this.change({due_days:s===""?null:Math.max(0,Number(s))})}}
          >
        </label>
        <label class="field">
          <span>${n("task.user")}</span>
          <select
            .value=${this.config.assignee_filter}
            @change=${t=>this.change({assignee_filter:t.currentTarget.value})}
          >
            <option value="all">${n("card.all_users")}</option>
            <option value="current_user">${n("card.current_user")}</option>
            ${e?c`
                  <option value=${this.config.assignee_filter}>
                    ${this.config.assignee_filter}
                  </option>
                `:u}
          </select>
        </label>
      </fieldset>
    `}},H=$(Z),x=class extends _{static properties={hass:{attribute:!1},config:{state:!0},snapshot:{state:!0},users:{state:!0},tags:{state:!0},labels:{state:!0},error:{state:!0}};static styles=b`
    :host {
      display: block;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color));
      border: var(--ha-card-border-width, 1px) solid
        var(--ha-card-border-color, var(--divider-color));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      min-height: 56px;
      border-bottom: 1px solid var(--divider-color);
    }

    li:last-child {
      border-bottom: 0;
    }

    .row,
    .add {
      display: grid;
      min-width: 0;
      flex: 1;
      grid-template-columns: 14px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      align-self: stretch;
      padding: 8px 16px;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .row:hover,
    .add:hover {
      background: color-mix(
        in srgb,
        var(--primary-text-color) 4%,
        transparent
      );
    }

    .dot {
      width: 10px;
      height: 10px;
      background: var(--success-color, #43a047);
      border-radius: 50%;
    }

    .today .dot {
      background: var(--warning-color);
    }

    .overdue .dot {
      background: var(--error-color);
    }

    .copy {
      min-width: 0;
    }

    .name {
      display: block;
      overflow: hidden;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta {
      display: block;
      margin-top: 2px;
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .menu {
      flex: 0 0 48px;
      text-align: center;
    }

    .empty,
    .error {
      padding: 20px 16px;
      color: var(--secondary-text-color);
      text-align: center;
    }

    .error {
      color: var(--error-color);
    }

    .add {
      grid-template-columns: 14px minmax(0, 1fr);
      color: var(--primary-color);
    }

    .plus {
      font-size: 22px;
      line-height: 1;
    }
  `;connection;unsubscribe;language;static getStubConfig(){return P()}static getConfigElement(){return document.createElement(k)}constructor(){super(),this.config=m(),this.users=[],this.tags=[],this.labels=[],this.error=""}setConfig(e){if(!e||typeof e!="object")throw new Error("Card configuration is required");this.config=L(e)}getCardSize(){return Math.max(1,Math.min(8,this.visibleTasks().length))}updated(){this.hass?.connection!==this.connection&&this.connect(),this.hass?.locale?.language!==this.language&&(this.language=this.hass?.locale?.language,y(this.language).then(()=>this.requestUpdate()))}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass,t=e.connection;this.connection=t,this.error="";let s=C(e);try{let a=await T(e,o=>{this.snapshot=o});this.connection===t?this.unsubscribe=a:a()}catch(a){this.connection===t&&(this.error=a instanceof Error?a.message:String(a))}try{let a=await s;this.connection===t&&(this.users=a.users,this.tags=a.tags,this.labels=a.labels)}catch{}}timeZone(){return this.hass?.config?.time_zone}visibleTasks(){if(!this.snapshot)return[];let e=l(this.snapshot.now,this.timeZone()),t=this.config.due_days===null?void 0:U(e,this.config.due_days),s=this.config.assignee_filter==="current_user",a=this.hass?.user?.id,o=["all","current_user"].includes(this.config.assignee_filter)?void 0:new Set(this.users.filter(r=>r.name.localeCompare(this.config.assignee_filter,void 0,{sensitivity:"accent"})===0).map(r=>r.id));return this.snapshot.tasks.filter(r=>r.active!==!1&&(!t||!!r.task_due&&l(r.task_due,this.timeZone())<=t)&&(!s||!!a&&r.assignee_id===a)&&(!o||o.has(r.assignee_id||""))).sort((r,f)=>!!r.task_due!=!!f.task_due?r.task_due?-1:1:Date.parse(r.task_due||"")-Date.parse(f.task_due||"")||r.task_name.localeCompare(f.task_name,this.hass?.locale?.language))}due(e){if(!e.task_due||!this.snapshot)return"";let t=l(e.task_due,this.timeZone()),s=l(this.snapshot.now,this.timeZone()),a=(Date.parse(`${t}T00:00:00Z`)-Date.parse(`${s}T00:00:00Z`))/864e5,o=a>=-1&&a<=2?new Intl.RelativeTimeFormat(this.hass?.locale?.language,{numeric:"auto"}).format(a,"day"):new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeZone:this.timeZone()}).format(new Date(e.task_due));return a>=0&&a<=2?`${o} \xB7 ${new Intl.DateTimeFormat(this.hass?.locale?.language,{timeStyle:"short",timeZone:this.timeZone()}).format(new Date(e.task_due))}`:o}dueStatus(e){if(!e.task_due||!this.snapshot)return"";let t=l(e.task_due,this.timeZone()),s=l(this.snapshot.now,this.timeZone());return t<s?"overdue":t===s?"today":"future"}metadata(e){let t={due:this.due(e),assignee:this.users.find(s=>s.id===e.assignee_id)?.name||"",nfc_tag:this.tags.find(s=>s.id===e.nfc_tag_id)?.name||"",labels:this.labels.filter(s=>e.label_ids?.includes(s.label_id)).map(s=>s.name).join(", ")};return this.config.secondary_info.map(s=>t[s]).filter(Boolean).join(" \xB7 ")}open(e){this.hass&&M(this.hass,e,this.snapshot?.attachments||[])}action(e,t){this.hass&&(t==="open"?this.open(e):t==="edit"?v(this.hass,e,this.snapshot?.attachments||[]):t==="active"?S(this.hass,e.task_id,e.active===!1):t==="delete"&&this.confirmDelete(e))}async confirmDelete(e){this.hass&&await I({heading:n("task.delete_title"),content:c`<p>
        ${n("task.delete_confirm",{name:e.task_name})}
      </p>`,actions:[{label:n("common.cancel"),value:"cancel"},{label:n("common.delete"),value:"delete",destructive:!0,run:()=>E(this.hass,e.task_id)}]})}render(){let e=this.visibleTasks();return this.error?c`<article class="card error">${this.error}</article>`:h`
      <article class="card">
        <ul aria-label=${n("v2.title")}>
          ${e.length?e.map(t=>h`
                <li class=${this.dueStatus(t)}>
                  <button
                    class="row"
                    type="button"
                    @click=${()=>this.open(t)}
                  >
                    <span class="dot" aria-hidden="true"></span>
                    <span class="copy">
                      <span class="name">${t.task_name}</span>
                      ${this.metadata(t)?c`<span class="meta">${this.metadata(t)}</span>`:u}
                    </span>
                  </button>
                  ${this.config.show_action_menu?h`
                        <span class="menu">
                          <${H}
                            label=${n("v2.actions_for",{name:t.task_name})}
                            .items=${A(t)}
                            @tasks-action=${s=>this.action(t,s.detail)}
                          ></${H}>
                        </span>
                      `:u}
                </li>
              `):c`<li class="empty">${n("card.empty")}</li>`}
          ${this.config.show_add_task?c`
                <li>
                  <button
                    class="add"
                    type="button"
                    @click=${()=>this.hass&&void v(this.hass)}
                  >
                    <span class="plus" aria-hidden="true">+</span>
                    <span>${n("common.add_task")}</span>
                  </button>
                </li>
              `:u}
        </ul>
      </article>
    `}};customElements.get(d)||customElements.define(d,x);customElements.get(k)||customElements.define(k,w);window.customCards||=[];var g=window.customCards.find(i=>i.type===d);g||(g={type:d,name:"Tasks V2"},window.customCards.push(g));D.then(()=>{g.description=n("card.description")});
