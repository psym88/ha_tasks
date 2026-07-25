import { t } from "./localize.js";
import { createActionMenu } from "./action-menu.js";

export const knownReferenceId=(id,items=[],key="id")=>id&&items.some(item=>item[key]===id)?id:null;
export const knownLabelIds=(ids=[],labels=[])=>ids.filter(id=>knownReferenceId(id,labels,"label_id"));

export const NO_DUE_TIMESTAMP = Number.MAX_SAFE_INTEGER;
export const INITIAL_TASK_SORTING = {column:"due_ts",direction:"asc"};
export const DEFAULT_TASK_COLUMN_ORDER = ["icon","name","due_ts","assignee","nfc_tag","files","labels","notifications","recurrence","rhythm","actions"];
export const DEFAULT_HIDDEN_TASK_COLUMNS = ["labels","notifications","recurrence","rhythm"];
export const TASK_TABLE_DIMENSIONS = {
  assignee:{title:"table.assignee",icon:"mdi:account"},
  labels:{title:"table.label",icon:"mdi:label-outline",values:"label_names",defaultHidden:true},
  notifications:{title:"table.notifications",icon:"mdi:bell-outline",values:"notification_names",defaultHidden:true},
  recurrence:{title:"table.recurrence",icon:"mdi:calendar-sync",defaultHidden:true},
  rhythm:{title:"table.rhythm",icon:"mdi:repeat",defaultHidden:true},
};
export const TASK_FILTER_COLUMNS = Object.keys(TASK_TABLE_DIMENSIONS);
export const FILTER_CATEGORY_TAG="tasks-sidebar-filter-category";
export const TASK_TABLE_STORAGE_KEYS = {
  search:"tasks-sidebar-table-search",
  filters:"tasks-sidebar-table-filters",
  sorting:"tasks-sidebar-table-sort",
  grouping:"tasks-sidebar-table-grouping",
  collapsed:"tasks-sidebar-table-collapsed",
  columnOrder:"tasks-sidebar-table-column-order",
  hiddenColumns:"tasks-sidebar-table-hidden-columns",
};

function storedValue(storage,key,fallback) {
  try {
    const value=storage?.getItem(key);
    return value===null||value===undefined?fallback:JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function storeTaskTableValue(storage,key,value) {
  try {
    if(value===undefined)storage?.removeItem(key);
    else storage?.setItem(key,JSON.stringify(value));
  } catch {
    // Safari private browsing and locked-down WebViews can reject storage.
  }
}

export function loadTaskTableView(localStorage,sessionStorage) {
  const filters=storedValue(sessionStorage,TASK_TABLE_STORAGE_KEYS.filters,{});
  const storedOrder=storedValue(localStorage,TASK_TABLE_STORAGE_KEYS.columnOrder,DEFAULT_TASK_COLUMN_ORDER),columnOrder=Array.isArray(storedOrder)?storedOrder.filter(column=>DEFAULT_TASK_COLUMN_ORDER.includes(column)):[...DEFAULT_TASK_COLUMN_ORDER];
  for(const column of DEFAULT_TASK_COLUMN_ORDER)if(!columnOrder.includes(column)){const next=DEFAULT_TASK_COLUMN_ORDER.slice(DEFAULT_TASK_COLUMN_ORDER.indexOf(column)+1).find(candidate=>columnOrder.includes(candidate)),index=next?columnOrder.indexOf(next):columnOrder.length;columnOrder.splice(index,0,column);}
  return {
    search:String(storedValue(sessionStorage,TASK_TABLE_STORAGE_KEYS.search,"")||""),
    filters:filters&&typeof filters==="object"&&!Array.isArray(filters)?filters:{},
    sorting:storedValue(localStorage,TASK_TABLE_STORAGE_KEYS.sorting,INITIAL_TASK_SORTING),
    grouping:storedValue(localStorage,TASK_TABLE_STORAGE_KEYS.grouping,undefined),
    collapsed:storedValue(localStorage,TASK_TABLE_STORAGE_KEYS.collapsed,undefined),
    columnOrder,
    hiddenColumns:storedValue(localStorage,TASK_TABLE_STORAGE_KEYS.hiddenColumns,DEFAULT_HIDDEN_TASK_COLUMNS),
  };
}

export class TasksSidebarFilterCategory extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"});this._items=[];this._value=[];this.expanded=false;this.label="";this.icon="mdi:filter-variant";}
  set items(value){this._items=Array.isArray(value)?value:[];this.render();}
  get items(){return this._items;}
  set value(value){this._value=Array.isArray(value)?value:[];this.render();}
  get value(){return this._value;}
  connectedCallback(){this.render();}
  select(id){this._value=id?(this._value.includes(id)?this._value.filter(value=>value!==id):[...this._value,id]):[];this.dispatchEvent(new CustomEvent("value-changed",{bubbles:true,composed:true,detail:{value:this._value}}));this.render();}
  render(){
    if(!this.shadowRoot)return;
    this.shadowRoot.innerHTML=`<style>:host{display:block;border-bottom:1px solid var(--divider-color)}ha-expansion-panel{--ha-card-border-radius:var(--ha-border-radius-square);--expansion-panel-content-padding:0}.header{display:flex;align-items:center}.badge{display:inline-block;box-sizing:border-box;min-width:16px;margin-inline-start:8px;padding:0 2px;border-radius:var(--ha-border-radius-circle);background:var(--primary-color);color:var(--text-primary-color);font-size:var(--ha-font-size-xs);font-weight:var(--ha-font-weight-normal);line-height:var(--ha-line-height-normal);text-align:center}ha-list{--mdc-list-item-meta-size:auto;--mdc-list-side-padding-right:var(--ha-space-1);--mdc-list-side-padding-left:var(--ha-space-4);--ha-icon-button-size:36px}ha-list-item{--mdc-list-item-graphic-margin:var(--ha-space-4)}ha-dropdown-item{font-size:var(--ha-font-size-m)}</style><ha-expansion-panel left-chevron><div slot="header" class="header">${this.label}${this._value.length?`<span class="badge">${this._value.length}</span>`:""}</div><ha-list activatable></ha-list></ha-expansion-panel>`;
    const panel=this.shadowRoot.querySelector("ha-expansion-panel"),list=this.shadowRoot.querySelector("ha-list");panel.expanded=this.expanded;panel.addEventListener("expanded-changed",event=>{this.expanded=Boolean(event.detail?.expanded);});
    const all=document.createElement("ha-list-item");all.textContent=t("filter.show_all");all.selected=!this._value.length;all.activated=!this._value.length;all.addEventListener("click",()=>this.select(null));list.append(all);
    for(const option of this._items){const item=document.createElement("ha-list-item"),icon=document.createElement("ha-icon");item.value=option.value;item.selected=this._value.includes(option.value);item.activated=item.selected;item.graphic="icon";icon.slot="graphic";icon.setAttribute("icon",this.icon);item.append(icon,document.createTextNode(option.label));item.addEventListener("click",()=>this.select(option.value));list.append(item);}
  }
}

if(!customElements.get(FILTER_CATEGORY_TAG))customElements.define(FILTER_CATEGORY_TAG,TasksSidebarFilterCategory);

export function dueTimestamp(value) {
  const timestamp=Date.parse(value);
  return Number.isNaN(timestamp)?NO_DUE_TIMESTAMP:timestamp;
}

export function deviceName(device) {
  return device.name_by_user||device.name||[device.manufacturer,device.model].filter(Boolean).join(" ")||device.id;
}

export function taskTableRows(tasks,{users=[],tags=[],labels=[],devices=[],attachments=[],translate=t,locale}={}) {
  const userNames=new Map(users.map(user=>[user.id,user.name]));
  const tagNames=new Map(tags.map(tag=>[tag.id,tag.name]));
  const labelNames=new Map(labels.map(label=>[label.label_id,label.name]));
  const deviceNames=new Map(devices.map(device=>[device.id,deviceName(device)]));
  const fileCounts=new Map();
  for(const file of attachments)fileCounts.set(file.task_id,(fileCounts.get(file.task_id)||0)+1);
  return tasks.map(task=>{
    const schedule_unit=["daily","weekly","monthly","yearly"].includes(task.schedule_unit)?task.schedule_unit:"monthly",assigneeId=knownReferenceId(task.assignee_id,users),tagId=knownReferenceId(task.nfc_tag_id,tags),resolvedLabels=knownLabelIds(task.label_ids,labels).map(id=>labelNames.get(id)),resolvedDevices=[...new Set((task.notification_target?.device_id||[]).map(id=>deviceNames.get(id)).filter(Boolean))],notificationNames=[...(task.notification_persistent?[translate("task.notification_panel_target")]:[]),...resolvedDevices].sort((a,b)=>a.localeCompare(b,locale));
    return {
      id:task.task_id,
      task,
      icon:task.task_icon||"mdi:clipboard-check-outline",
      name:task.task_name||"",
      due_ts:dueTimestamp(task.active===false?null:task.task_due),
      recurrence:translate(`task.${task.schedule_type==="fixed"?"fixed":task.schedule_type==="sensor"?"problem":"sliding"}`),
      rhythm:task.schedule_type==="sensor"?"–":translate(`task.${schedule_unit}`),
      assignee:userNames.get(assigneeId)||translate("task.unassigned"),
      labels:[...resolvedLabels].sort((a,b)=>a.localeCompare(b)).join(", ")||translate("task.no_labels"),
      label_names:resolvedLabels,
      notifications:notificationNames.join(", ")||translate("task.no_notification_targets"),
      notification_names:notificationNames,
      nfc_tag:tagNames.get(tagId)||translate("task.no_nfc_tag"),
      files:fileCounts.get(task.task_id)||0,
    };
  });
}

export function filterTaskTableRows(rows,filters={}) {
  return rows.filter(row=>TASK_FILTER_COLUMNS.every(column=>{const selected=filters[column]||[],values=TASK_TABLE_DIMENSIONS[column].values?row[TASK_TABLE_DIMENSIONS[column].values]:[row[column]];return !selected.length||selected.some(value=>values.includes(value));}));
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

function dropdownItem(value,label,icon,slot="") {
  const item=document.createElement("ha-dropdown-item");
  item.value=value;
  item.textContent=label;
  if(slot)item.slot=slot;
  if(icon){const itemIcon=document.createElement("ha-icon");itemIcon.slot="icon";itemIcon.setAttribute("icon",icon);item.prepend(itemIcon);}
  return item;
}

function bulkDropdown(label,items,action) {
  const dropdown=document.createElement("ha-dropdown"),trigger=document.createElement("ha-assist-chip"),chevron=document.createElement("ha-icon");
  dropdown.slot="selection-bar";
  trigger.slot="trigger";
  trigger.label=label;
  chevron.slot="trailing-icon";
  chevron.setAttribute("icon","mdi:menu-down");
  trigger.append(chevron);
  dropdown.append(trigger,...items);
  dropdown.addEventListener("wa-select",event=>{const item=event.detail?.item,value=item?.value;if(value!==undefined)void action(value,item);});
  return dropdown;
}

function overflowDropdown(label,items,action,narrow=false) {
  const dropdown=document.createElement("ha-dropdown"),trigger=narrow?document.createElement("ha-assist-chip"):document.createElement("ha-icon-button"),icon=document.createElement("ha-icon");
  dropdown.slot="selection-bar";
  trigger.slot="trigger";
  trigger.label=label;
  if(narrow){icon.slot="trailing-icon";icon.setAttribute("icon","mdi:menu-down");trigger.append(icon);}else{trigger.title=label;trigger.setAttribute("aria-label",label);icon.setAttribute("icon","mdi:dots-vertical");trigger.append(icon);}
  dropdown.append(trigger,...items);
  dropdown.addEventListener("wa-select",event=>{const item=event.detail?.item,value=item?.value;if(value!==undefined)void action(value,item);});
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
    const session=kind==="search"||kind==="filters";
    storeTaskTableValue(session?globalThis.sessionStorage:globalThis.localStorage,TASK_TABLE_STORAGE_KEYS[kind],value);
    this.taskTableView={...this.restoreTaskTableView(),[kind]:value};
  }
  tagName(task){const id=knownReferenceId(task?.nfc_tag_id,this.tags);return id?this.tags.find(tag=>tag.id===id)?.name||"":"";}
  mobileDevices(){return this.devices.filter(device=>device.identifiers?.some(identifier=>identifier?.[0]==="mobile_app"));}
  tableRows(){return taskTableRows(this.tasks,{users:this.users,tags:this.tags,labels:this.labels,devices:this.mobileDevices(),attachments:this.attachments,translate:t,locale:this.locale()});}
  filterLabel(schema){return t(TASK_TABLE_DIMENSIONS[schema.name]?.title)||schema.name;}
  filterItems(rows,column){const values=TASK_TABLE_DIMENSIONS[column].values;return [...new Set(rows.flatMap(row=>values?row[values]:row[column]))].map(value=>({value,label:value}));}
  activeFilterCount(){return TASK_FILTER_COLUMNS.reduce((count,column)=>count+(this.tableFilters?.[column]?.length||0),0);}
  tableColumns(){
    const groupable={sortable:true,filterable:true,groupable:true};
    const available={
      icon:{title:"",label:t("task.icon"),type:"icon",moveable:false,showNarrow:true,template:row=>taskIconCell(row)},
      name:{title:t("table.task"),main:true,sortable:true,filterable:true,grows:true,flex:3,minWidth:"150px"},
      due_ts:{title:t("task.due"),sortable:true,filterable:false,template:row=>textCell(row.task.active!==false&&row.task.task_due?this.date(row.task.task_due," - "):"–")},
      nfc_tag:{title:t("task.nfc_tag_id"),sortable:true,filterable:true},
      files:{title:t("task.files"),sortable:true,filterable:false},
    };
    for(const [name,definition] of Object.entries(TASK_TABLE_DIMENSIONS))available[name]={title:t(definition.title),defaultHidden:Boolean(definition.defaultHidden),...groupable};
    available.actions={title:"",label:t("task.actions"),type:"overflow-menu",moveable:false,hideable:false,showNarrow:true,template:row=>this.taskActionButton(row.task)};
    return Object.fromEntries(DEFAULT_TASK_COLUMN_ORDER.map(name=>[name,available[name]]));
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
  clearTaskSelection(){const wrapper=this.shadowRoot.querySelector("hass-tabs-subpage-data-table");wrapper?.clearSelection();this.selectedTaskIds=[];if(wrapper)wrapper.selected=0;}
  async runBulkAction(action,clear=false){for(const task of this.selectedTasks())await action(task);if(clear)this.clearTaskSelection();}
  async bulkAssignPerson(assigneeId){await this.runBulkAction(task=>this.ws({type:"tasks/task/update",task_id:task.task_id,assignee_id:assigneeId==="__unassigned__"?null:assigneeId}));}
  async bulkAssignLabel(labelId,action="add"){await this.runBulkAction(task=>this.ws({type:"tasks/task/update",task_id:task.task_id,label_ids:action==="remove"?(task.label_ids||[]).filter(id=>id!==labelId):[...new Set([...(task.label_ids||[]),labelId])]}));}
  async bulkAssignNotification(target,action="add"){await this.runBulkAction(task=>{if(target==="panel")return this.ws({type:"tasks/task/update",task_id:task.task_id,notification_persistent:action==="add"});const ids=task.notification_target?.device_id||[];return this.ws({type:"tasks/task/update",task_id:task.task_id,notification_target:{device_id:action==="remove"?ids.filter(id=>id!==target):[...new Set([...ids,target])]}});});}
  async bulkSetActive(active){await this.runBulkAction(task=>this.ws({type:"tasks/task/update",task_id:task.task_id,active}));}
  async bulkComplete(){const tasks=this.selectedTasks();if(!tasks.length||!await this.confirmAction(t("bulk.complete_title"),t("bulk.complete_confirm",{count:tasks.length}),t("task.completed"),"brand"))return;await this.runBulkAction(task=>this.ws({type:"tasks/task/complete",task_id:task.task_id,notes:null}));}
  async bulkDelete(){const tasks=this.selectedTasks();if(!tasks.length||!await this.confirmAction(t("bulk.delete_title"),t("bulk.delete_confirm",{count:tasks.length}),t("common.delete"),"danger"))return;await this.runBulkAction(task=>this.ws({type:"tasks/task/delete",task_id:task.task_id}),true);}
  personItems(slot=""){return [["__unassigned__",t("task.unassigned"),"mdi:account-off-outline"],...this.users.map(user=>[user.id,user.name,"mdi:account"])].map(([value,label,icon])=>dropdownItem(`person_${value}`,label,icon,slot));}
  labelItems(slot=""){const tasks=this.selectedTasks();return this.labels.map(label=>{const selected=tasks.length>0&&tasks.every(task=>(task.label_ids||[]).includes(label.label_id)),partial=!selected&&tasks.some(task=>(task.label_ids||[]).includes(label.label_id)),item=dropdownItem(`label_${label.label_id}`,"",null,slot),checkbox=document.createElement("ha-checkbox"),display=document.createElement("ha-label");item.dataset.action=selected?"remove":"add";item.setAttribute("keep-open","");checkbox.slot="icon";checkbox.checked=selected;checkbox.indeterminate=partial;display.color=label.color;display.description=label.description||undefined;display.textContent=label.name;if(label.icon){const icon=document.createElement("ha-icon");icon.slot="icon";icon.setAttribute("icon",label.icon);display.prepend(icon);}item.append(checkbox,display);return item;});}
  notificationItems(slot=""){const tasks=this.selectedTasks(),targets=[["panel",t("task.notification_panel_target")],...this.mobileDevices().map(device=>[device.id,deviceName(device)])];return targets.map(([id,name])=>{const has=task=>id==="panel"?Boolean(task.notification_persistent):(task.notification_target?.device_id||[]).includes(id),selected=tasks.length>0&&tasks.every(has),partial=!selected&&tasks.some(has),item=dropdownItem(`notification_${id}`,name,null,slot),checkbox=document.createElement("ha-checkbox");item.dataset.action=selected?"remove":"add";item.setAttribute("keep-open","");checkbox.slot="icon";checkbox.checked=selected;checkbox.indeterminate=partial;item.prepend(checkbox);return item;});}
  handleBulkMenu(value,item){if(value==="active")void this.bulkSetActive(item.dataset.active==="true");else if(value==="complete")void this.bulkComplete();else if(value==="delete")void this.bulkDelete();else if(["person_menu","label_menu","notification_menu"].includes(value))return;else if(value.startsWith("person_"))void this.bulkAssignPerson(value.slice(7));else if(value.startsWith("label_"))void this.bulkAssignLabel(value.slice(6),item.dataset.action);else if(value.startsWith("notification_"))void this.bulkAssignNotification(value.slice(13),item.dataset.action);}
  selectionSubmenu(label,value,items){const parent=dropdownItem(value,label);for(const item of items){item.slot="submenu";parent.append(item);}return parent;}
  observeTaskTableWidth(wrapper){
    requestAnimationFrame(()=>{const table=wrapper.shadowRoot?.querySelector("ha-data-table");if(!table){if(wrapper.isConnected)this.observeTaskTableWidth(wrapper);return;}this.taskTableResizeObserver?.disconnect();this.taskTableResizeObserver=new ResizeObserver(()=>{table.style.removeProperty("--table-row-width");table.requestUpdate?.();});this.taskTableResizeObserver.observe(table);});
  }
  disconnectTaskTableResize(){this.taskTableResizeObserver?.disconnect();this.taskTableResizeObserver=null;}
  appendBulkActions(wrapper){
    wrapper.querySelectorAll('[slot="selection-bar"]').forEach(element=>element.remove());
    const activate=this.selectedTasks().every(task=>task.active===false),active=dropdownItem("active",t(activate?"menu.activate":"menu.deactivate"),activate?"mdi:play-circle-outline":"mdi:pause-circle-outline"),complete=dropdownItem("complete",t("bulk.complete"),"mdi:check-circle-outline"),remove=dropdownItem("delete",t("bulk.delete"),"mdi:delete-outline");active.dataset.active=String(activate);remove.setAttribute("variant","danger");
    if(this.narrow){wrapper.append(overflowDropdown(t("bulk.actions"),[this.selectionSubmenu(t("bulk.assign_person"),"person_menu",this.personItems("submenu")),this.selectionSubmenu(t("bulk.assign_label"),"label_menu",this.labelItems("submenu")),this.selectionSubmenu(t("bulk.assign_notification"),"notification_menu",this.notificationItems("submenu")),document.createElement("wa-divider"),active,complete,remove],(value,item)=>this.handleBulkMenu(value,item),true));return;}
    wrapper.append(
      bulkDropdown(t("bulk.assign_person"),this.personItems(),(value,item)=>this.handleBulkMenu(value,item)),
      bulkDropdown(t("bulk.assign_label"),this.labelItems(),(value,item)=>this.handleBulkMenu(value,item)),
      bulkDropdown(t("bulk.assign_notification"),this.notificationItems(),(value,item)=>this.handleBulkMenu(value,item)),
      overflowDropdown(t("bulk.actions"),[active,complete,remove],(value,item)=>this.handleBulkMenu(value,item)),
    );
  }
  render(){
    if(!this.shadowRoot.querySelector(".app")){
      const view=this.restoreTaskTableView();
      this.shadowRoot.innerHTML=`<style>:host{display:block;height:100%;background:var(--primary-background-color);color:var(--primary-text-color)}.app,hass-tabs-subpage-data-table{display:block;height:100%}.filters{box-sizing:border-box;width:100%}ha-assist-chip{--ha-assist-chip-container-shape:10px}</style><div class="app"></div>`;
      const wrapper=document.createElement("hass-tabs-subpage-data-table"),settings=document.createElement("ha-icon-button"),settingsIcon=document.createElement("ha-icon"),filterPane=document.createElement("div"),fab=document.createElement("ha-button"),fabIcon=document.createElement("ha-icon");
      wrapper.className="task-table";
      wrapper.mainPage=true;
      wrapper.style.width="100%";
      wrapper.style.setProperty("--main-title-margin","0");
      wrapper.setAttribute("clickable","");
      wrapper.setAttribute("selectable","");
      wrapper.setAttribute("has-fab","");
      wrapper.setAttribute("has-filters","");
      wrapper.filter=view.search;
      wrapper.initialSorting=view.sorting;
      wrapper.initialGroupColumn=view.grouping;
      wrapper.initialCollapsedGroups=view.collapsed;
      wrapper.columnOrder=Array.isArray(view.columnOrder)?[...view.columnOrder]:[...DEFAULT_TASK_COLUMN_ORDER];
      wrapper.hiddenColumns=Array.isArray(view.hiddenColumns)?[...view.hiddenColumns]:[...DEFAULT_HIDDEN_TASK_COLUMNS];
      settings.slot="toolbar-icon";
      settings.label=t("settings.title");
      settings.setAttribute("aria-label",t("settings.title"));
      settingsIcon.setAttribute("icon","mdi:cog-outline");
      settings.append(settingsIcon);
      settings.addEventListener("click",event=>{event.stopPropagation();this.settings();});
      filterPane.className="filters";filterPane.slot="filter-pane";for(const column of TASK_FILTER_COLUMNS){const filter=document.createElement(FILTER_CATEGORY_TAG);filter.dataset.column=column;filter.controller=this;filter.addEventListener("value-changed",event=>{event.stopPropagation();this.tableFilters={...(this.tableFilters||{}),[column]:event.detail?.value||[]};this.persistTaskTableValue("filters",this.tableFilters);this.updateTaskTable();});filterPane.append(filter);}
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
      this.observeTaskTableWidth(wrapper);
      wrapper.addEventListener("selection-changed",event=>{this.selectedTaskIds=event.detail?.value||[];wrapper.selected=this.selectedTaskIds.length;this.appendBulkActions(wrapper);});
      wrapper.addEventListener("row-click",event=>{const task=this.tasks.find(item=>item.task_id===event.detail?.id);if(task)this.taskViewer(task);});
      wrapper.addEventListener("clear-filter",()=>{this.tableFilters={};this.persistTaskTableValue("filters",this.tableFilters);this.updateTaskTable();});
      wrapper.addEventListener("search-changed",event=>this.persistTaskTableValue("search",event.detail?.value||""));
      wrapper.addEventListener("sorting-changed",event=>this.persistTaskTableValue("sorting",event.detail));
      wrapper.addEventListener("grouping-changed",event=>this.persistTaskTableValue("grouping",event.detail?.value||undefined));
      wrapper.addEventListener("collapsed-changed",event=>this.persistTaskTableValue("collapsed",event.detail?.value));
      wrapper.addEventListener("columns-changed",event=>{const {columnOrder,hiddenColumns}=event.detail||{};this.persistTaskTableValue("columnOrder",columnOrder);this.persistTaskTableValue("hiddenColumns",hiddenColumns);});
    }
    this.updateTaskTable();
  }
  updateTaskTable(){
    const wrapper=this.shadowRoot.querySelector("hass-tabs-subpage-data-table");
    if(!wrapper)return;
    const settings=wrapper.querySelector('[slot="toolbar-icon"]'),fab=wrapper.querySelector('[slot="fab"]'),rows=this.tableRows();
    if(settings){settings.label=t("settings.title");settings.title=t("settings.title");settings.setAttribute("aria-label",t("settings.title"));}
    if(fab){for(const node of [...fab.childNodes])if(node.nodeType===3)node.remove();fab.append(document.createTextNode(t("common.add_task")));}
    wrapper.querySelectorAll(FILTER_CATEGORY_TAG).forEach(filter=>{const column=filter.dataset.column;filter.controller=this;filter.label=this.filterLabel({name:column});filter.icon=TASK_TABLE_DIMENSIONS[column].icon;filter.items=this.filterItems(rows,column);filter.value=this.tableFilters?.[column]||[];});
    wrapper.hass=this._hass;
    wrapper.route=this.route;
    wrapper.tabs=[{name:"Tasks",path:""}];
    wrapper.narrow=Boolean(this.narrow);
    wrapper.isWide=Boolean(this.isWide);
    wrapper.columns=this.tableColumns();
    wrapper.data=filterTaskTableRows(rows,this.tableFilters);
    wrapper.selected=(this.selectedTaskIds||[]).length;
    this.appendBulkActions(wrapper);
    wrapper.filters=this.activeFilterCount();
    wrapper.noDataText=t("table.empty");
    wrapper.searchLabel=t("table.search");
  }
};
