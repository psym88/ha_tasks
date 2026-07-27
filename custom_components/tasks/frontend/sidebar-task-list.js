import { t } from "./localize.js";
import { createActionMenu } from "./action-menu.js";
import "./tasks-data-table.js";
import { SETTINGS_CONTENT_TAG } from "./popup-settings.js";
import {
  DEFAULT_HIDDEN_TASK_COLUMNS,
  INITIAL_TASK_SORTING,
  loadTaskTableView,
  storeTaskTableView,
} from "./task-table-view.js";
import {
  createTaskTableRows,
  deviceName,
} from "./task-table-rows.js";

export const knownReferenceId=(id,items=[],key="id")=>id&&items.some(item=>item[key]===id)?id:null;
export const knownLabelIds=(ids=[],labels=[])=>ids.filter(id=>knownReferenceId(id,labels,"label_id"));

export const TASK_TABLE_DIMENSIONS = {
  assignee:{title:"table.assignee",icon:"mdi:account",values:"assignee_id"},
  labels:{title:"table.label",icon:"mdi:label-outline",values:"label_ids"},
  notifications:{title:"table.notifications",icon:"mdi:bell-outline",values:"notification_ids"},
  recurrence:{title:"table.recurrence",icon:"mdi:calendar-sync",values:"recurrence_id"},
  rhythm:{title:"table.rhythm",icon:"mdi:repeat",values:"rhythm_id"},
};
export const TASK_FILTER_COLUMNS = Object.keys(TASK_TABLE_DIMENSIONS);
const TASK_TABLE_FILTER_DIMENSIONS=Object.fromEntries(Object.entries(TASK_TABLE_DIMENSIONS).map(([name,definition])=>[name,definition.values]));
export const FILTER_CATEGORY_TAG="tasks-sidebar-filter-category";

export class TasksSidebarFilterCategory extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"});this._items=[];this._value=[];this.expanded=false;this.label="";}
  set items(value){this._items=Array.isArray(value)?value:[];this.render();}
  get items(){return this._items;}
  set value(value){this._value=Array.isArray(value)?value:[];this.render();}
  get value(){return this._value;}
  connectedCallback(){this.render();}
  select(id){this._value=id?(this._value.includes(id)?this._value.filter(value=>value!==id):[...this._value,id]):[];this.dispatchEvent(new CustomEvent("value-changed",{bubbles:true,composed:true,detail:{value:this._value}}));this.render();}
  render(){
    if(!this.shadowRoot)return;
    this.shadowRoot.innerHTML=`<style>:host{display:block;border-bottom:1px solid var(--divider-color)}.header{display:flex;align-items:center}.badge{display:inline-block;box-sizing:border-box;min-width:16px;margin-inline-start:8px;padding:0 2px;border-radius:var(--ha-border-radius-circle);background:var(--primary-color);color:var(--text-primary-color);font-size:var(--ha-font-size-xs);font-weight:var(--ha-font-weight-normal);line-height:var(--ha-line-height-normal);text-align:center}.options{display:flex;flex-direction:column;padding-block:var(--ha-space-2)}.options label{display:flex;align-items:center;gap:var(--ha-space-2);min-height:40px;padding-inline:var(--ha-space-4)}</style><ha-expansion-panel left-chevron><div slot="header" class="header">${this.label}${this._value.length?`<span class="badge">${this._value.length}</span>`:""}</div><div class="options"></div></ha-expansion-panel>`;
    const panel=this.shadowRoot.querySelector("ha-expansion-panel"),options=this.shadowRoot.querySelector(".options");panel.expanded=this.expanded;panel.addEventListener("expanded-changed",event=>{this.expanded=Boolean(event.detail?.expanded);});
    for(const option of this._items){const label=document.createElement("label"),checkbox=document.createElement("ha-checkbox"),text=document.createElement("span");checkbox.checked=this._value.includes(option.value);checkbox.addEventListener("change",()=>this.select(option.value));label.addEventListener("click",event=>{if(!event.composedPath().includes(checkbox))this.select(option.value);});text.textContent=option.label;label.append(checkbox,text);options.append(label);}
  }
}

if(!customElements.get(FILTER_CATEGORY_TAG))customElements.define(FILTER_CATEGORY_TAG,TasksSidebarFilterCategory);

export function taskTableRows(tasks,{users=[],tags=[],labels=[],devices=[],attachments=[],translate=t,locale}={}) {
  return createTaskTableRows(tasks,{users,tags,labels,devices,attachments,translate,locale});
}

function textCell(value,title) {
  const cell=document.createElement("span");
  cell.textContent=value;
  if(title)cell.title=title;
  return cell;
}

function taskIconCell(row) {
  const icon=document.createElement("ha-icon");
  icon.setAttribute("icon",row.task.active===false?"mdi:pause-circle":row.icon);
  if(row.task.active===false)icon.style.color="var(--error-color)";
  return icon;
}

function taskNameCell(row) {
  const cell=document.createElement("div"),name=document.createElement("span");
  cell.className="task-name-cell";
  name.textContent=row.name;
  cell.append(name);
  return cell;
}

function dropdownItem(value,label,icon,slot="") {
  const item=document.createElement("ha-dropdown-item");
  item.value=value;
  item.textContent=label;
  if(slot)item.slot=slot;
  if(icon){const itemIcon=document.createElement("ha-icon");itemIcon.slot="icon";itemIcon.setAttribute("icon",icon);item.prepend(itemIcon);}
  return item;
}

function overflowDropdown(label,items,action) {
  const dropdown=document.createElement("ha-dropdown"),trigger=document.createElement("ha-assist-chip"),icon=document.createElement("ha-icon");
  dropdown.slot="selection-bar";
  trigger.slot="trigger";
  trigger.label=label;
  icon.slot="trailing-icon";
  icon.setAttribute("icon","mdi:menu-down");
  trigger.append(icon);
  dropdown.append(trigger,...items);
  dropdown.addEventListener("wa-select",event=>{
    const item=event.detail?.item,value=item?.value;
    if(value===undefined)return;
    void action(value,item);
    if(value.startsWith("person_")||value.startsWith("label_")||value.startsWith("notification_")){
      event.preventDefault();
      const checkbox=item.querySelector("ha-checkbox");
      if(checkbox){const checked=item.dataset.action!=="remove";checkbox.checked=checked;checkbox.indeterminate=false;item.dataset.action=checked?"remove":"add";}
    }
  });
  return dropdown;
}

export const withTaskList = Base => class extends Base {
  restoreTaskTableView(){
    if(this.taskTableView)return this.taskTableView;
    this.taskTableView=loadTaskTableView(globalThis.localStorage,globalThis.sessionStorage);
    this.tableFilters=this.taskTableView.filters;
    return this.taskTableView;
  }
  persistTaskTableValue(kind,value){
    this.taskTableView={...this.restoreTaskTableView(),[kind]:value};
    storeTaskTableView(globalThis.localStorage,globalThis.sessionStorage,this.taskTableView);
  }
  tagName(task){const id=knownReferenceId(task?.nfc_tag_id,this.tags);return id?this.tags.find(tag=>tag.id===id)?.name||"":"";}
  mobileDevices(){return this.devices.filter(device=>device.identifiers?.some(identifier=>identifier?.[0]==="mobile_app"));}
  tableRows(){return taskTableRows(this.tasks,{users:this.users,tags:this.tags,labels:this.labels,devices:this.mobileDevices(),attachments:this.attachments,translate:t,locale:this.locale()});}
  filterLabel(schema){return t(TASK_TABLE_DIMENSIONS[schema.name]?.title)||schema.name;}
  filterItems(rows,column){
    const options=new Map();
    for(const row of rows)for(const option of row.filter_options[column]||[])options.set(option.id||"__unassigned__",option.label);
    return [...options].map(([value,label])=>({value,label}));
  }
  activeFilterCount(){return TASK_FILTER_COLUMNS.reduce((count,column)=>count+(this.tableFilters?.[column]?.length||0),0);}
  tableColumns(){
    const groupable={sortable:true,groupable:true};
    const dimension=name=>({title:t(TASK_TABLE_DIMENSIONS[name].title),...groupable});
    const available={
      icon:{title:"",hideable:false,template:row=>taskIconCell(row)},
      name:{title:t("table.task"),sortable:true,template:row=>taskNameCell(row)},
      due_ts:{title:t("task.due"),sortable:true,template:row=>textCell(row.task.active!==false&&row.task.task_due?this.date(row.task.task_due," - "):"–")},
      assignee:dimension("assignee"),
      nfc_tag:{title:t("task.nfc_tag_id"),sortable:true},
      files:{title:t("task.files"),sortable:true},
      labels:dimension("labels"),
      notifications:dimension("notifications"),
      recurrence:dimension("recurrence"),
      rhythm:dimension("rhythm"),
      actions:{title:"",hideable:false,template:row=>this.taskActionButton(row.task)},
    };
    return available;
  }
  taskActionButton(task){
    return createActionMenu({
      label:t("task.actions"),
      active:task.active!==false,
      toggleActive:()=>this.ws({type:"tasks/task/update",task_id:task.task_id,active:task.active===false}),
      edit:()=>this.taskEditor(task),
      remove:()=>this.deleteTask(task),
    });
  }
  selectedTasks(){const ids=new Set(this.selectedTaskIds||[]);return this.tasks.filter(task=>ids.has(task.task_id));}
  clearTaskSelection(){const wrapper=this.shadowRoot.querySelector("tasks-data-table");wrapper?.clearSelection();this.selectedTaskIds=[];if(wrapper)wrapper.selected=0;}
  async runBulkAction(action,clear=false){for(const task of this.selectedTasks())await action(task);if(clear)this.clearTaskSelection();}
  async bulkAssignPerson(assigneeId){await this.runBulkAction(task=>this.ws({type:"tasks/task/update",task_id:task.task_id,assignee_id:assigneeId==="__unassigned__"?null:assigneeId}));}
  async bulkAssignLabel(labelId,action="add"){await this.runBulkAction(task=>this.ws({type:"tasks/task/update",task_id:task.task_id,label_ids:action==="remove"?(task.label_ids||[]).filter(id=>id!==labelId):[...new Set([...(task.label_ids||[]),labelId])]}));}
  async bulkAssignNotification(target,action="add"){await this.runBulkAction(task=>{if(target==="panel")return this.ws({type:"tasks/task/update",task_id:task.task_id,notification_persistent:action==="add"});const ids=task.notification_target?.device_id||[];return this.ws({type:"tasks/task/update",task_id:task.task_id,notification_target:{device_id:action==="remove"?ids.filter(id=>id!==target):[...new Set([...ids,target])]}});});}
  async bulkSetActive(active){await this.runBulkAction(task=>this.ws({type:"tasks/task/update",task_id:task.task_id,active}));}
  async bulkComplete(){const tasks=this.selectedTasks();if(!tasks.length||!await this.confirmAction(t("bulk.complete_title"),t("bulk.complete_confirm",{count:tasks.length}),t("task.completed"),"brand"))return;await this.runBulkAction(task=>this.ws({type:"tasks/task/complete",task_id:task.task_id,notes:null}));}
  async bulkDelete(){const tasks=this.selectedTasks();if(!tasks.length||!await this.confirmAction(t("bulk.delete_title"),t("bulk.delete_confirm",{count:tasks.length}),t("common.delete"),"danger"))return;await this.runBulkAction(task=>this.ws({type:"tasks/task/delete",task_id:task.task_id}),true);}
  personItems(slot=""){return [["__unassigned__",t("task.unassigned"),"mdi:account-off-outline"],...this.users.map(user=>[user.id,user.name,"mdi:account"])].map(([value,label,icon])=>dropdownItem(`person_${value}`,label,icon,slot));}
  labelItems(slot=""){const tasks=this.selectedTasks();return this.labels.map(label=>{const selected=tasks.length>0&&tasks.every(task=>(task.label_ids||[]).includes(label.label_id)),partial=!selected&&tasks.some(task=>(task.label_ids||[]).includes(label.label_id)),item=dropdownItem(`label_${label.label_id}`,label.name,null,slot),checkbox=document.createElement("ha-checkbox");item.dataset.action=selected?"remove":"add";item.setAttribute("keep-open","");checkbox.slot="icon";checkbox.checked=selected;checkbox.indeterminate=partial;checkbox.tabIndex=-1;checkbox.style.pointerEvents="none";item.prepend(checkbox);return item;});}
  notificationItems(slot=""){const tasks=this.selectedTasks(),targets=[["panel",t("task.notification_panel_target")],...this.mobileDevices().map(device=>[device.id,deviceName(device)])];return targets.map(([id,name])=>{const has=task=>id==="panel"?Boolean(task.notification_persistent):(task.notification_target?.device_id||[]).includes(id),selected=tasks.length>0&&tasks.every(has),partial=!selected&&tasks.some(has),item=dropdownItem(`notification_${id}`,name,null,slot),checkbox=document.createElement("ha-checkbox");item.dataset.action=selected?"remove":"add";item.setAttribute("keep-open","");checkbox.slot="icon";checkbox.checked=selected;checkbox.indeterminate=partial;checkbox.tabIndex=-1;checkbox.style.pointerEvents="none";item.prepend(checkbox);return item;});}
  handleBulkMenu(value,item){if(value==="active")void this.bulkSetActive(item.dataset.active==="true");else if(value==="complete")void this.bulkComplete();else if(value==="delete")void this.bulkDelete();else if(["person_menu","label_menu","notification_menu"].includes(value))return;else if(value.startsWith("person_"))void this.bulkAssignPerson(value.slice(7));else if(value.startsWith("label_"))void this.bulkAssignLabel(value.slice(6),item.dataset.action);else if(value.startsWith("notification_"))void this.bulkAssignNotification(value.slice(13),item.dataset.action);}
  selectionSubmenu(label,value,items){
    const parent=dropdownItem(value,label);
    for(const item of items){item.slot="submenu";parent.append(item);}
    parent.addEventListener("pointerleave",()=>parent.closeSubmenu());
    return parent;
  }
  appendBulkActions(wrapper){
    wrapper.querySelectorAll('[slot="selection-bar"]').forEach(element=>element.remove());
    const activate=this.selectedTasks().every(task=>task.active===false),active=dropdownItem("active",t(activate?"menu.activate":"menu.deactivate"),activate?"mdi:play-circle-outline":"mdi:pause-circle-outline"),complete=dropdownItem("complete",t("bulk.complete"),"mdi:check-circle-outline"),remove=dropdownItem("delete",t("bulk.delete"),"mdi:delete-outline");active.dataset.active=String(activate);remove.setAttribute("variant","danger");
    const dropdown=overflowDropdown(t("bulk.actions"),[complete,active,document.createElement("wa-divider"),this.selectionSubmenu(t("bulk.assign_person"),"person_menu",this.personItems("submenu")),this.selectionSubmenu(t("bulk.assign_label"),"label_menu",this.labelItems("submenu")),this.selectionSubmenu(t("bulk.assign_notification"),"notification_menu",this.notificationItems("submenu")),document.createElement("wa-divider"),remove],(value,item)=>this.handleBulkMenu(value,item));
    dropdown.addEventListener("wa-after-hide",()=>{if(dropdown.isConnected)this.appendBulkActions(wrapper);},{once:true});
    wrapper.append(dropdown);
  }
  render(){
    if(!this.shadowRoot.querySelector(".app")){
      const view=this.restoreTaskTableView();
      this.shadowRoot.innerHTML=`<style>:host{display:block;height:100%;background:var(--primary-background-color);color:var(--primary-text-color)}.app,tasks-data-table{display:block;height:100%}.filters{box-sizing:border-box;width:100%}ha-assist-chip{--ha-assist-chip-container-shape:10px}</style><div class="app"></div>`;
      const wrapper=document.createElement("tasks-data-table"),settings=document.createElement(SETTINGS_CONTENT_TAG),filterPane=document.createElement("div"),fab=document.createElement("ha-button"),fabIcon=document.createElement("ha-icon");
      wrapper.style.setProperty("--main-title-margin","0");
      wrapper.defaultSorting=INITIAL_TASK_SORTING;
      wrapper.defaultHiddenColumns=DEFAULT_HIDDEN_TASK_COLUMNS;
      wrapper.filterDimensions=TASK_TABLE_FILTER_DIMENSIONS;
      wrapper.filter=view.search;
      wrapper.initialSorting=view.sorting;
      wrapper.initialGroupColumn=view.grouping;
      wrapper.initialCollapsedGroups=view.collapsed;
      wrapper.hiddenColumns=Array.isArray(view.hiddenColumns)?[...view.hiddenColumns]:[...DEFAULT_HIDDEN_TASK_COLUMNS];
      settings.slot="settings-pane";
      settings.controller=this;
      filterPane.className="filters";filterPane.slot="filter-pane";for(const column of TASK_FILTER_COLUMNS){const filter=document.createElement(FILTER_CATEGORY_TAG);filter.dataset.column=column;filter.controller=this;filter.addEventListener("value-changed",event=>{event.stopPropagation();this.tableFilters={...(this.tableFilters||{}),[column]:event.detail?.value||[]};this.persistTaskTableValue("filters",this.tableFilters);this.clearTaskSelection();this.updateTaskTable();});filterPane.append(filter);}
      fab.slot="fab";
      fab.setAttribute("size","l");
      fab.textContent=t("common.add_task");
      fabIcon.slot="start";
      fabIcon.setAttribute("icon","mdi:plus");
      fab.prepend(fabIcon);
      fab.addEventListener("click",()=>this.taskEditor(null));
      wrapper.append(settings,filterPane,fab);
      this.appendBulkActions(wrapper);
      this.shadowRoot.querySelector(".app").append(wrapper);
      wrapper.addEventListener("selection-changed",event=>{this.selectedTaskIds=event.detail?.value||[];wrapper.selected=this.selectedTaskIds.length;this.appendBulkActions(wrapper);});
      wrapper.addEventListener("row-click",event=>{const task=this.tasks.find(item=>item.task_id===event.detail?.id);if(task)this.taskViewer(task);});
      wrapper.addEventListener("clear-filter",()=>{this.tableFilters={};this.persistTaskTableValue("filters",this.tableFilters);this.clearTaskSelection();this.updateTaskTable();});
      wrapper.addEventListener("search-changed",event=>this.persistTaskTableValue("search",event.detail?.value||""));
      wrapper.addEventListener("sorting-changed",event=>this.persistTaskTableValue("sorting",event.detail));
      wrapper.addEventListener("grouping-changed",event=>this.persistTaskTableValue("grouping",event.detail?.value||undefined));
      wrapper.addEventListener("collapsed-changed",event=>this.persistTaskTableValue("collapsed",event.detail?.value));
      wrapper.addEventListener("columns-changed",event=>this.persistTaskTableValue("hiddenColumns",event.detail?.hiddenColumns));
    }
    this.updateTaskTable();
  }
  updateTaskTable(){
    const wrapper=this.shadowRoot.querySelector("tasks-data-table");
    if(!wrapper)return;
    const settings=wrapper.querySelector('[slot="settings-pane"]'),fab=wrapper.querySelector('[slot="fab"]'),rows=this.tableRows();
    if(settings)settings.controller=this;
    if(fab){for(const node of [...fab.childNodes])if(node.nodeType===3)node.remove();fab.append(document.createTextNode(t("common.add_task")));}
    wrapper.querySelectorAll(FILTER_CATEGORY_TAG).forEach(filter=>{const column=filter.dataset.column;filter.controller=this;filter.label=this.filterLabel({name:column});filter.items=this.filterItems(rows,column);filter.value=this.tableFilters?.[column]||[];});
    wrapper.hass=this._hass;
    wrapper.tabs=[{name:"Tasks",path:""}];
    wrapper.narrow=Boolean(this.narrow);
    wrapper.filters=this.activeFilterCount();
    wrapper.columns=this.tableColumns();
    wrapper.dimensionFilters=this.tableFilters;
    wrapper.data=rows;
    wrapper.selected=(this.selectedTaskIds||[]).length;
    if(!wrapper.querySelector('[slot="selection-bar"]')?.open)this.appendBulkActions(wrapper);
    wrapper.noDataText=t("table.empty");
    wrapper.searchLabel=t("table.search");
  }
};
