import { dueDateKey, TasksBase } from "./controller.js";
import { esc } from "./localize.js";
import { createActionMenu } from "./action-menu.js";
import { ready, t } from "./localize.js";

export const SECONDARY_INFO = Object.freeze(["due","assignee","nfc_tag","labels"]);
export const DEFAULT_CARD_CONFIG = Object.freeze({
  type: "custom:tasks-card",
  show_action_menu: false,
  show_add_task: false,
  secondary_info: SECONDARY_INFO,
  due_days: 0,
  assignee_filter: "all",
});

export function normalizeCardConfig(config={}) {
  const dueDays=config.due_days===null?null:Number.isInteger(Number(config.due_days))&&Number(config.due_days)>=0?Number(config.due_days):0;
  const secondaryInfo=Array.isArray(config.secondary_info)?config.secondary_info.filter((item,index,list)=>SECONDARY_INFO.includes(item)&&list.indexOf(item)===index):[...SECONDARY_INFO];
  const configuredAssigneeFilter=typeof config.assignee_filter==="string"?config.assignee_filter.trim():"";
  const assigneeFilter=configuredAssigneeFilter||"all";
  return {
    ...DEFAULT_CARD_CONFIG,
    type:config.type||DEFAULT_CARD_CONFIG.type,
    show_action_menu:Boolean(config.show_action_menu),
    show_add_task:Boolean(config.show_add_task),
    secondary_info:secondaryInfo,
    due_days:dueDays,
    assignee_filter:assigneeFilter,
  };
}

function addDays(iso,days){const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||"");if(!match)return null;const value=new Date(Date.UTC(+match[1],+match[2]-1,+match[3]+days));return value.toISOString().slice(0,10);}

export function filterDashboardTasks(tasks,config,now,timeZone,currentUserId,users=[]){
  const cfg=normalizeCardConfig(config),today=dueDateKey(now,timeZone),limit=cfg.due_days===null?null:addDays(today,cfg.due_days);
  const namedAssignees=!["all","current_user"].includes(cfg.assignee_filter)?users.filter(user=>String(user.name||"").trim().localeCompare(cfg.assignee_filter,undefined,{sensitivity:"accent"})===0).map(user=>user.id):null;
  return tasks.filter(task=>{
    if(task.active===false)return false;
    if(limit&&(!task.due||dueDateKey(task.due,timeZone)>limit))return false;
    if(namedAssignees&&!namedAssignees.includes(task.assignee_id))return false;
    if(cfg.assignee_filter==="current_user"&&(!currentUserId||task.assignee_id!==currentUserId))return false;
    return true;
  });
}

export function sortDashboardTasks(tasks,locale="en"){
  return [...tasks].sort((a,b)=>{
    if(Boolean(a.due)!==Boolean(b.due))return a.due?-1:1;
    return (Date.parse(a.due)-Date.parse(b.due))||(a.name||"").localeCompare(b.name||"",locale);
  });
}

export function dueStatus(taskDue,now,timeZone){const dueDate=dueDateKey(taskDue,timeZone),today=dueDateKey(now,timeZone);return !dueDate?"":dueDate<today?"overdue":dueDate===today?"today":"future";}
export function dashboardTaskRowHtml(task,showActionMenu,relativeDate,status,assigneeName="",tagName="",labelNames=[],secondaryInfo=SECONDARY_INFO){const values={due:relativeDate?`<span class="due-date">${esc(relativeDate)}</span>`:"",assignee:esc(assigneeName),nfc_tag:esc(tagName),labels:esc(labelNames.join(", "))},metadata=secondaryInfo.map(key=>values[key]).filter(Boolean).join(" • ");return `<ha-list-item-button class="task-row ${esc(status)}" data-task="${esc(task.id)}"><ha-icon class="task-icon" slot="start" icon="${esc(task.icon||"mdi:clipboard-check-outline")}"></ha-icon><span slot="headline">${esc(task.name)}</span>${metadata?`<span slot="supporting-text">${metadata}</span>`:""}${showActionMenu?'<span class="row-action-slot" slot="end"></span>':""}</ha-list-item-button>`;}
export function dashboardCardBodyHtml(rows,showAddTask){return `<ha-card><ha-list-base aria-label="Tasks">${rows||`<ha-list-item-base><ha-icon slot="start" icon="mdi:clipboard-check-outline"></ha-icon><span slot="headline">${t("card.empty")}</span></ha-list-item-base>`}${showAddTask?`<ha-list-item-button class="add-task"><ha-icon slot="start" icon="mdi:plus"></ha-icon><span slot="headline">${t("card.add")}</span></ha-list-item-button>`:""}</ha-list-base></ha-card>`;}
const editorGroup=(name,titleName,field)=>({type:"grid",name,flatten:true,column_min_width:"100%",schema:[{type:"constant",name:titleName},field]});
export function dashboardCardEditorSchema(){
  return [
    {type:"expandable",name:"options",title:t("card.options"),icon:"mdi:tune",expanded:true,flatten:true,schema:[
      {name:"show_action_menu",selector:{boolean:{}}},
      {name:"show_add_task",selector:{boolean:{}}},
    ]},
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
        {name:"assignee_filter",default:"all",selector:{select:{mode:"dropdown",options:[{value:"all",label:t("card.all_users")},{value:"current_user",label:t("card.current_user")}]}}}),
    ]},
  ];
}
const dashboardCardEditorLabel=schema=>({show_action_menu:t("card.show_action_menu"),show_add_task:t("card.show_add_task"),content_title:t("card.state_content"),secondary_info:t("card.add_filter"),due_filter_title:t("task.due"),due_days:t("card.days"),assignee_filter_title:t("task.user"),assignee_filter:t("card.add_filter")}[schema.name]);
const assertDashboardCardConfig=config=>{if(config.assignee_filter!==undefined&&!["all","current_user"].includes(config.assignee_filter))throw new Error(t("card.custom_assignee_yaml_only"));};

export class TasksCard extends TasksBase {
  static getStubConfig(){return {show_action_menu:false,show_add_task:false,secondary_info:[...SECONDARY_INFO],due_days:0,assignee_filter:"all"};}
  static getConfigForm(){return {schema:dashboardCardEditorSchema(),computeLabel:dashboardCardEditorLabel,assertConfig:assertDashboardCardConfig};}
  setConfig(config){this.config=normalizeCardConfig(config);if(this.loaded)this.render();}
  getCardSize(){return Math.max(1,Math.min(8,this.visibleTasks().length+1));}
  visibleTasks(){return sortDashboardTasks(filterDashboardTasks(this.tasks||[],this.config||DEFAULT_CARD_CONFIG,this.now,this.timeZone(),this._hass?.user?.id,this.users),this.locale());}
  render(){
    if(!this.shadowRoot.querySelector(".card-root"))this.shadowRoot.innerHTML='<style>.task-row.today .task-icon,.task-row.today .due-date{color:var(--warning-color)}.task-row.overdue .task-icon,.task-row.overdue .due-date{color:var(--error-color)}.task-row.future .task-icon,.task-row.future .due-date{color:var(--success-color)}</style><div class="card-root"></div>';
    const root=this.shadowRoot.querySelector(".card-root"),tasks=this.visibleTasks(),config=this.config;
    root.innerHTML=dashboardCardBodyHtml(tasks.map(task=>dashboardTaskRowHtml(task,config.show_action_menu,this.relativeDate(task.due),dueStatus(task.due,this.now,this.timeZone()),this.users.find(user=>user.id===task.assignee_id)?.name||"",this.tagName(task),this.labelNames(task),config.secondary_info)).join(""),config.show_add_task);
    root.querySelectorAll("[data-task]").forEach(row=>{const task=this.tasks.find(item=>item.id===row.dataset.task);row.onclick=()=>this.taskViewer(task);const slot=row.querySelector(".row-action-slot");if(slot){const menu=createActionMenu({label:t("task.actions"),active:task.active!==false,toggleActive:()=>this.ws({type:"tasks/task/update",task_id:task.id,active:task.active===false}),edit:()=>this.taskEditor(task),remove:()=>this.deleteTask(task)});menu.slot="end";slot.replaceWith(menu);}});
    const add=root.querySelector(".add-task");if(add)add.onclick=()=>{add.blur();this.taskEditor(null);};
  }
}

if(!customElements.get("tasks-card"))customElements.define("tasks-card",TasksCard);
window.customCards=window.customCards||[];
function updateCardMetadata(){const card=window.customCards.find(item=>item.type==="tasks-card");if(card)card.description=t("card.description");}
ready.then(()=>{if(!window.customCards.some(card=>card.type==="tasks-card"))window.customCards.push({type:"tasks-card",name:"Tasks",description:t("card.description")});else updateCardMetadata();});
