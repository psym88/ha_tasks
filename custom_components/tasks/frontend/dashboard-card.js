import { dueDateKey, TasksBase } from "./controller.js";
import { esc } from "./localize.js";
import { createActionMenu } from "./action-menu.js";
import { ready, setLanguage, t } from "./localize.js";

export const UNASSIGNED = "__unassigned__";
export const CURRENT_USER = "__current_user__";
export const SECONDARY_INFO = Object.freeze(["due","assignee","nfc_tag","labels"]);
export const DEFAULT_CARD_CONFIG = Object.freeze({
  type: "custom:tasks-card",
  show_action_menu: false,
  show_add_task: false,
  secondary_info: SECONDARY_INFO,
  due_days: 0,
  assignee_ids: [],
});

export function normalizeCardConfig(config={}) {
  const dueDays=config.due_days===null?null:Number.isInteger(Number(config.due_days))&&Number(config.due_days)>=0?Number(config.due_days):0;
  const secondaryInfo=Array.isArray(config.secondary_info)?config.secondary_info.filter((item,index,list)=>SECONDARY_INFO.includes(item)&&list.indexOf(item)===index):[...SECONDARY_INFO];
  return {
    ...DEFAULT_CARD_CONFIG,
    type:config.type||DEFAULT_CARD_CONFIG.type,
    show_action_menu:Boolean(config.show_action_menu),
    show_add_task:Boolean(config.show_add_task),
    secondary_info:secondaryInfo,
    due_days:dueDays,
    assignee_ids:Array.isArray(config.assignee_ids)?[...config.assignee_ids]:[],
  };
}

function addDays(iso,days){const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||"");if(!match)return null;const value=new Date(Date.UTC(+match[1],+match[2]-1,+match[3]+days));return value.toISOString().slice(0,10);}

export function filterDashboardTasks(tasks,config,today,timeZone,currentUserId){
  const cfg=normalizeCardConfig(config),limit=cfg.due_days===null?null:addDays(today,cfg.due_days);
  return tasks.filter(task=>{
    if(limit&&(!task.task_due||dueDateKey(task.task_due,timeZone)>limit))return false;
    if(cfg.assignee_ids.length){const assignee=task.assignee_id||UNASSIGNED,selected=cfg.assignee_ids.includes(assignee)||(cfg.assignee_ids.includes(CURRENT_USER)&&Boolean(currentUserId)&&assignee===currentUserId);if(!selected)return false;}
    return true;
  });
}

export function sortDashboardTasks(tasks,locale="en"){
  return [...tasks].sort((a,b)=>(a.task_due||"").localeCompare(b.task_due||"")||(a.task_name||"").localeCompare(b.task_name||"",locale));
}

export function dueStatus(taskDue,today,timeZone){const dueDate=dueDateKey(taskDue,timeZone);return dueDate<today?"overdue":dueDate===today?"today":"future";}
export function dashboardTaskRowHtml(task,showActionMenu,relativeDate,status,assigneeName="",tagName="",labelNames=[],secondaryInfo=SECONDARY_INFO){const values={due:relativeDate?`<span class="due-date">${esc(relativeDate)}</span>`:"",assignee:esc(assigneeName),nfc_tag:esc(tagName),labels:esc(labelNames.join(", "))},metadata=secondaryInfo.map(key=>values[key]).filter(Boolean).join(" • ");return `<ha-list-item-button class="task-row ${esc(status)}" data-task="${esc(task.task_id)}"><ha-icon class="task-icon" slot="start" icon="${esc(task.task_icon||"mdi:clipboard-check-outline")}"></ha-icon><span slot="headline">${esc(task.task_name)}</span>${metadata?`<span slot="supporting-text">${metadata}</span>`:""}${showActionMenu?'<span class="row-action-slot" slot="end"></span>':""}</ha-list-item-button>`;}
export function dashboardCardBodyHtml(rows,showAddTask){return `<ha-card><ha-list-base aria-label="Tasks">${rows||`<ha-list-item-base><ha-icon slot="start" icon="mdi:clipboard-check-outline"></ha-icon><span slot="headline">${t("card.empty")}</span></ha-list-item-base>`}${showAddTask?`<ha-list-item-button class="add-task"><ha-icon slot="start" icon="mdi:plus"></ha-icon><span slot="headline">${t("card.add")}</span></ha-list-item-button>`:""}</ha-list-base></ha-card>`;}
const editorGroup=(name,titleName,field)=>({type:"grid",name,flatten:true,column_min_width:"100%",schema:[{type:"constant",name:titleName},field]});
export function dashboardCardEditorSchema(users=[]){
  return [
    {type:"expandable",name:"secondary",title:t("card.content"),icon:"mdi:format-list-text",flatten:true,schema:[
      editorGroup("content_group","content_title",
      {name:"secondary_info",selector:{select:{multiple:true,reorder:true,custom_value:false,options:[
        {value:"due",label:t("task.due")},
        {value:"assignee",label:t("task.user")},
        {value:"nfc_tag",label:t("task.nfc_tag_id")},
        {value:"labels",label:t("task.labels")},
      ]}}}),
    ]},
    {type:"expandable",name:"filter",title:t("card.filter"),icon:"mdi:filter-variant",flatten:true,schema:[
      editorGroup("due_filter_group","due_filter_title",
        {name:"due_days",selector:{number:{min:0,step:1,mode:"box"}}}),
      editorGroup("assignee_filter_group","assignee_filter_title",
        {name:"assignee_ids",selector:{select:{multiple:true,mode:"dropdown",options:[{value:CURRENT_USER,label:t("card.current_user")},{value:UNASSIGNED,label:t("task.unassigned")},...users.map(user=>({value:user.id,label:user.name}))]}}}),
    ]},
  ];
}
export function dashboardCardOptionsHtml(){return `<ha-expansion-panel class="editor-options" outlined expanded><span class="editor-section-header" slot="header"><ha-icon icon="mdi:tune"></ha-icon><span>${t("card.options")}</span></span><div class="editor-option-list">${[["show_action_menu",t("card.show_action_menu")],["show_add_task",t("card.show_add_task")]].map(([key,label])=>`<label class="editor-option"><span>${esc(label)}</span><ha-switch data-option="${key}"></ha-switch></label>`).join("")}</div></ha-expansion-panel>`;}

export class TasksCard extends TasksBase {
  static getStubConfig(){return {...DEFAULT_CARD_CONFIG};}
  static async getConfigElement(){return document.createElement("tasks-card-editor");}
  setConfig(config){this.config=normalizeCardConfig(config);if(this.loaded)this.render();}
  getCardSize(){return Math.max(1,Math.min(8,this.visibleTasks().length+1));}
  visibleTasks(){return sortDashboardTasks(filterDashboardTasks(this.tasks||[],this.config||DEFAULT_CARD_CONFIG,this.today,this.timeZone(),this._hass?.user?.id),this.locale());}
  render(){
    if(!this.shadowRoot.querySelector(".card-root"))this.shadowRoot.innerHTML='<style>.task-row.today .task-icon,.task-row.today .due-date{color:var(--warning-color)}.task-row.overdue .task-icon,.task-row.overdue .due-date{color:var(--error-color)}.task-row.future .task-icon,.task-row.future .due-date{color:var(--success-color)}</style><div class="card-root"></div>';
    const root=this.shadowRoot.querySelector(".card-root"),tasks=this.visibleTasks(),config=normalizeCardConfig(this.config);
    root.innerHTML=dashboardCardBodyHtml(tasks.map(task=>dashboardTaskRowHtml(task,config.show_action_menu,this.relativeDate(task.task_due),dueStatus(task.task_due,this.today,this.timeZone()),this.users.find(user=>user.id===task.assignee_id)?.name||"",this.tagName(task),this.labelNames(task),config.secondary_info)).join(""),config.show_add_task);
    root.querySelectorAll("[data-task]").forEach(row=>{const task=this.tasks.find(item=>item.task_id===row.dataset.task);row.onclick=()=>this.taskViewer(task);const slot=row.querySelector(".row-action-slot");if(slot){const menu=createActionMenu({label:t("task.actions"),edit:()=>this.taskEditor(task),remove:()=>this.deleteTask(task)});menu.slot="end";slot.replaceWith(menu);}});
    const add=root.querySelector(".add-task");if(add)add.onclick=()=>{add.blur();this.taskEditor(null);};
  }
}

export class TasksCardEditor extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"});this.config={...DEFAULT_CARD_CONFIG};this.users=[];this.loaded=false;}
  set hass(value){this._hass=value;setLanguage(value?.locale?.language).then(changed=>{updateCardMetadata();if(!this.loaded){this.loaded=true;this.load();}else if(changed)this.render();});}
  setConfig(config){const next=normalizeCardConfig(config),unchanged=JSON.stringify(next)===JSON.stringify(this.config);this.config=next;if(!unchanged||!this.shadowRoot.querySelector("ha-form"))this.render();}
  async load(){try{const data=await this._hass.connection.sendMessagePromise({type:"tasks/list"});this.users=data.users||[];}catch(error){console.error("Tasks card editor load failed",error);}this.render();}
  update(patch){this.config=normalizeCardConfig({...this.config,...patch});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:{...this.config}},bubbles:true,composed:true}));}
  render(){if(!this.shadowRoot||!this._hass)return;this.shadowRoot.innerHTML=`<style>.editor-options{display:block}.editor-section-header{display:flex;align-items:center;gap:16px}.editor-section-header ha-icon{color:var(--secondary-text-color)}.editor-option-list{display:flex;flex-direction:column;gap:4px;padding:12px}.editor-option{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:16px;min-height:48px;cursor:pointer}ha-form{display:block;margin-top:24px}</style>${dashboardCardOptionsHtml()}<ha-form></ha-form>`;this.shadowRoot.querySelectorAll("[data-option]").forEach(control=>{const key=control.dataset.option;control.checked=this.config[key];control.addEventListener("change",()=>this.update({[key]:control.checked}));});const form=this.shadowRoot.querySelector("ha-form");form.setAttribute("style","--ha-space-6:8px");form.hass=this._hass;form.data={secondary_info:this.config.secondary_info,due_days:this.config.due_days,assignee_ids:this.config.assignee_ids};form.schema=dashboardCardEditorSchema(this.users);form.computeLabel=schema=>({content_title:t("card.state_content"),secondary_info:t("card.add_filter"),due_filter_title:t("task.due"),due_days:t("card.days"),assignee_filter_title:t("task.user"),assignee_ids:t("card.add_filter")}[schema.name]||schema.name);form.addEventListener("value-changed",event=>this.update(event.detail?.value||{}));
  }
}

if(!customElements.get("tasks-card"))customElements.define("tasks-card",TasksCard);
if(!customElements.get("tasks-card-editor"))customElements.define("tasks-card-editor",TasksCardEditor);
window.customCards=window.customCards||[];
function updateCardMetadata(){const card=window.customCards.find(item=>item.type==="tasks-card");if(card)card.description=t("card.description");}
ready.then(()=>{if(!window.customCards.some(card=>card.type==="tasks-card"))window.customCards.push({type:"tasks-card",name:"Tasks",description:t("card.description")});else updateCardMetadata();});
