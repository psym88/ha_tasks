import{a as m,b as o,c as d,d as f,e as k,f as h,g as w,h as x,i as T,j as C,l as $,m as b,n as E,o as S,q as D}from"./chunk-NLD4M7K3.js";var l="tasks-card-v2",y="tasks-card-v2-editor",u=[{value:"due",label:"Due"},{value:"assignee",label:"Assignee"},{value:"nfc_tag",label:"NFC tag"},{value:"labels",label:"Labels"}],g=()=>({type:`custom:${l}`,show_action_menu:!1,show_add_task:!1,secondary_info:u.map(i=>i.value),due_days:0,assignee_filter:"all"}),Z=()=>{let{type:i,...e}=g();return e},I=(i={})=>{let e=Number(i.due_days);return{...g(),...i,type:i.type||`custom:${l}`,show_action_menu:i.show_action_menu===!0,show_add_task:i.show_add_task===!0,secondary_info:Array.isArray(i.secondary_info)?i.secondary_info.filter((t,s,a)=>u.some(r=>r.value===t)&&a.indexOf(t)===s):u.map(t=>t.value),due_days:i.due_days===null?null:Number.isInteger(e)&&e>=0?e:0,assignee_filter:typeof i.assignee_filter=="string"&&i.assignee_filter.trim()?i.assignee_filter.trim():"all"}},c=(i,e)=>{let t=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:e}).formatToParts(new Date(i)),s=a=>t.find(r=>r.type===a)?.value||"";return`${s("year")}-${s("month")}-${s("day")}`},H=(i,e)=>{let[t,s,a]=i.split("-").map(Number);return new Date(Date.UTC(t,s-1,a+e)).toISOString().slice(0,10)},_=class extends f{static properties={hass:{attribute:!1},config:{state:!0}};static styles=m`
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
  `;constructor(){super(),this.config=g()}setConfig(e){this.config=I(e)}change(e){this.config={...this.config,...e},this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:this.config}}))}render(){let e=!["all","current_user"].includes(this.config.assignee_filter);return o`
      <fieldset>
        <legend>Actions</legend>
        <label>
          <input
            type="checkbox"
            .checked=${this.config.show_action_menu}
            @change=${t=>this.change({show_action_menu:t.currentTarget.checked})}
          >
          Show task actions
        </label>
        <label>
          <input
            type="checkbox"
            .checked=${this.config.show_add_task}
            @change=${t=>this.change({show_add_task:t.currentTarget.checked})}
          >
          Show add task
        </label>
      </fieldset>
      <fieldset>
        <legend>Secondary information</legend>
        ${u.map(t=>o`
            <label>
              <input
                type="checkbox"
                .checked=${this.config.secondary_info.includes(t.value)}
                @change=${s=>{let a=s.currentTarget.checked;this.change({secondary_info:a?[...this.config.secondary_info,t.value]:this.config.secondary_info.filter(r=>r!==t.value)})}}
              >
              ${t.label}
            </label>
          `)}
      </fieldset>
      <fieldset>
        <legend>Filters</legend>
        <label class="field">
          <span>Due within days (empty for all)</span>
          <input
            type="number"
            min="0"
            step="1"
            .value=${this.config.due_days===null?"":String(this.config.due_days)}
            @change=${t=>{let s=t.currentTarget.value;this.change({due_days:s===""?null:Math.max(0,Number(s))})}}
          >
        </label>
        <label class="field">
          <span>Assignee</span>
          <select
            .value=${this.config.assignee_filter}
            @change=${t=>this.change({assignee_filter:t.currentTarget.value})}
          >
            <option value="all">All assignees</option>
            <option value="current_user">Logged-in user</option>
            ${e?o`
                  <option value=${this.config.assignee_filter}>
                    ${this.config.assignee_filter}
                  </option>
                `:d}
          </select>
        </label>
      </fieldset>
    `}},A=k(E),v=class extends f{static properties={hass:{attribute:!1},config:{state:!0},snapshot:{state:!0},users:{state:!0},tags:{state:!0},labels:{state:!0},error:{state:!0}};static styles=m`
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
  `;connection;unsubscribe;static getStubConfig(){return Z()}static getConfigElement(){return document.createElement(y)}constructor(){super(),this.config=g(),this.users=[],this.tags=[],this.labels=[],this.error=""}setConfig(e){if(!e||typeof e!="object")throw new Error("Card configuration is required");this.config=I(e)}getCardSize(){return Math.max(1,Math.min(8,this.visibleTasks().length))}updated(){this.hass?.connection!==this.connection&&this.connect()}disconnectedCallback(){this.disconnect(),super.disconnectedCallback()}disconnect(){this.unsubscribe?.(),this.unsubscribe=void 0,this.connection=void 0}async connect(){if(this.disconnect(),!this.hass)return;let e=this.hass,t=e.connection;this.connection=t,this.error="";let s=x(e);try{let a=await w(e,r=>{this.snapshot=r});this.connection===t?this.unsubscribe=a:a()}catch(a){this.connection===t&&(this.error=a instanceof Error?a.message:String(a))}try{let a=await s;this.connection===t&&(this.users=a.users,this.tags=a.tags,this.labels=a.labels)}catch{}}timeZone(){return this.hass?.config?.time_zone}visibleTasks(){if(!this.snapshot)return[];let e=c(this.snapshot.now,this.timeZone()),t=this.config.due_days===null?void 0:H(e,this.config.due_days),s=this.config.assignee_filter==="current_user",a=this.hass?.user?.id,r=["all","current_user"].includes(this.config.assignee_filter)?void 0:new Set(this.users.filter(n=>n.name.localeCompare(this.config.assignee_filter,void 0,{sensitivity:"accent"})===0).map(n=>n.id));return this.snapshot.tasks.filter(n=>n.active!==!1&&(!t||!!n.task_due&&c(n.task_due,this.timeZone())<=t)&&(!s||!!a&&n.assignee_id===a)&&(!r||r.has(n.assignee_id||""))).sort((n,p)=>!!n.task_due!=!!p.task_due?n.task_due?-1:1:Date.parse(n.task_due||"")-Date.parse(p.task_due||"")||n.task_name.localeCompare(p.task_name,this.hass?.locale?.language))}due(e){if(!e.task_due||!this.snapshot)return"";let t=c(e.task_due,this.timeZone()),s=c(this.snapshot.now,this.timeZone()),a=(Date.parse(`${t}T00:00:00Z`)-Date.parse(`${s}T00:00:00Z`))/864e5,r=a===-1?"Yesterday":a===0?"Today":a===1?"Tomorrow":a===2?"In 2 days":new Intl.DateTimeFormat(this.hass?.locale?.language,{dateStyle:"medium",timeZone:this.timeZone()}).format(new Date(e.task_due));return a>=0&&a<=2?`${r} \xB7 ${new Intl.DateTimeFormat(this.hass?.locale?.language,{timeStyle:"short",timeZone:this.timeZone()}).format(new Date(e.task_due))}`:r}dueStatus(e){if(!e.task_due||!this.snapshot)return"";let t=c(e.task_due,this.timeZone()),s=c(this.snapshot.now,this.timeZone());return t<s?"overdue":t===s?"today":"future"}metadata(e){let t={due:this.due(e),assignee:this.users.find(s=>s.id===e.assignee_id)?.name||"",nfc_tag:this.tags.find(s=>s.id===e.nfc_tag_id)?.name||"",labels:this.labels.filter(s=>e.label_ids?.includes(s.label_id)).map(s=>s.name).join(", ")};return this.config.secondary_info.map(s=>t[s]).filter(Boolean).join(" \xB7 ")}open(e){this.hass&&D(this.hass,e,this.snapshot?.attachments||[])}action(e,t){this.hass&&(t==="open"?this.open(e):t==="edit"?b(this.hass,e,this.snapshot?.attachments||[]):t==="active"?C(this.hass,e.task_id,e.active===!1):t==="delete"&&this.confirmDelete(e))}async confirmDelete(e){this.hass&&await $({heading:"Delete task?",content:o`<p>
        Delete “${e.task_name}” including its completion history and
        attachments?
      </p>`,actions:[{label:"Cancel",value:"cancel"},{label:"Delete",value:"delete",destructive:!0,run:()=>T(this.hass,e.task_id)}]})}render(){let e=this.visibleTasks();return this.error?o`<article class="card error">${this.error}</article>`:h`
      <article class="card">
        <ul aria-label="Tasks">
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
                      ${this.metadata(t)?o`<span class="meta">${this.metadata(t)}</span>`:d}
                    </span>
                  </button>
                  ${this.config.show_action_menu?h`
                        <span class="menu">
                          <${A}
                            label="Actions for ${t.task_name}"
                            .items=${S(t)}
                            @tasks-action=${s=>this.action(t,s.detail)}
                          ></${A}>
                        </span>
                      `:d}
                </li>
              `):o`<li class="empty">No tasks</li>`}
          ${this.config.show_add_task?o`
                <li>
                  <button
                    class="add"
                    type="button"
                    @click=${()=>this.hass&&void b(this.hass)}
                  >
                    <span class="plus" aria-hidden="true">+</span>
                    <span>Add task</span>
                  </button>
                </li>
              `:d}
        </ul>
      </article>
    `}};customElements.get(l)||customElements.define(l,v);customElements.get(y)||customElements.define(y,_);window.customCards||=[];window.customCards.some(i=>i.type===l)||window.customCards.push({type:l,name:"Tasks V2",description:"Tasks card using the owned V2 frontend."});
