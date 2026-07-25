import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

globalThis.HTMLElement = class {};
globalThis.customElements = { get: () => undefined, define: () => undefined };
globalThis.fetch = async url => {
  const language = String(url).match(/\/([a-z]{2,3})\.json$/)?.[1] || "en";
  const catalog = JSON.parse(readFileSync(new URL(`../../custom_components/tasks/translations/${language}.json`, import.meta.url), "utf8"));
  return { ok: true, json: async () => catalog };
};

const {ready,setLanguage}=await import("../../custom_components/tasks/frontend/localize.js");
await ready;
await setLanguage("en");
const {DEFAULT_HIDDEN_TASK_COLUMNS,DEFAULT_TASK_COLUMN_ORDER,INITIAL_TASK_SORTING,NO_DUE_TIMESTAMP,TASK_FILTER_COLUMNS,TASK_GROUP_COLUMNS,TASK_TABLE_DIMENSIONS,TASK_TABLE_STORAGE_KEYS,dueTimestamp,filterTaskTableRows,loadTaskTableView,storeTaskTableValue,taskTableRows}=await import("../../custom_components/tasks/frontend/sidebar-task-list.js");
const {knownLabelIds,knownReferenceId}=await import("../../custom_components/tasks/frontend/sidebar-task-list.js");

const source=readFileSync(new URL("../../custom_components/tasks/frontend/sidebar-task-list.js",import.meta.url),"utf8");

test("task rows flatten every grouping dimension and resolve ids to names",()=>{
  const tasks=[{task_id:"laundry",task_name:"Laundry",task_icon:"mdi:washing-machine",task_due:"2026-07-24",schedule_type:"fixed",schedule_unit:"weekly",assignee_id:"alex",label_ids:["upstairs","deleted","chores"],nfc_tag_id:"washer",notification_target:{device_id:["phone","deleted-phone"]},notification_persistent:true}];
  const original=structuredClone(tasks);
  const attachments=[{attachment_id:"a",task_id:"laundry"},{attachment_id:"b",task_id:"laundry"},{attachment_id:"c",task_id:"other"}];
  const [row]=taskTableRows(tasks,{users:[{id:"alex",name:"Alex"}],tags:[{id:"washer",name:"Washer"}],labels:[{label_id:"upstairs",name:"Upstairs"},{label_id:"chores",name:"Chores"}],devices:[{id:"phone",name_by_user:"Alex's phone"}],attachments,translate:key=>key});
  assert.deepEqual({id:row.id,icon:row.icon,name:row.name,recurrence:row.recurrence,rhythm:row.rhythm,assignee:row.assignee,labels:row.labels,label_names:row.label_names,notifications:row.notifications,notification_names:row.notification_names,nfc_tag:row.nfc_tag,files:row.files},{id:"laundry",icon:"mdi:washing-machine",name:"Laundry",recurrence:"task.fixed",rhythm:"task.weekly",assignee:"Alex",labels:"Chores, Upstairs",label_names:["Upstairs","Chores"],notifications:"Alex's phone, task.notification_panel_target",notification_names:["Alex's phone","task.notification_panel_target"],nfc_tag:"Washer",files:2});
  assert.equal(row.task,tasks[0]);
  assert.deepEqual(tasks,original);
});

test("deleted Home Assistant labels are excluded from task projections",()=>{
  assert.deepEqual(knownLabelIds(["known","deleted"],[{label_id:"known",name:"Known"}]),["known"]);
  const [row]=taskTableRows([{task_id:"task",task_name:"Task",label_ids:["deleted"]}],{labels:[],translate:key=>`translated:${key}`});
  assert.equal(row.labels,"translated:task.no_labels");
  assert.deepEqual(row.label_names,[]);
  assert.equal(row.notifications,"translated:task.no_notification_targets");
  assert.deepEqual(row.notification_names,[]);
});

test("deleted Home Assistant users and NFC tags become unassigned",()=>{
  assert.equal(knownReferenceId("known",[{id:"known"}]),"known");
  assert.equal(knownReferenceId("deleted",[{id:"known"}]),null);
  const [row]=taskTableRows([{task_id:"task",task_name:"Task",assignee_id:"deleted-user",nfc_tag_id:"deleted-tag"}],{users:[],tags:[],translate:key=>`translated:${key}`});
  assert.equal(row.assignee,"translated:task.unassigned");
  assert.equal(row.nfc_tag,"translated:task.no_nfc_tag");
});

test("missing assignments receive localized searchable values",()=>{
  const [row]=taskTableRows([{task_id:"task",task_name:"Task",schedule_unit:"daily"}],{translate:key=>`translated:${key}`});
  assert.equal(row.assignee,"translated:task.unassigned");
  assert.equal(row.labels,"translated:task.no_labels");
  assert.deepEqual(row.label_names,[]);
  assert.equal(row.nfc_tag,"translated:task.no_nfc_tag");
  assert.equal(row.files,0);
});

test("due timestamps validate calendar dates and represent missing dates as the maximum",()=>{
  assert.equal(dueTimestamp("2026-07-22"),new Date(2026,6,22).getTime());
  assert.equal(dueTimestamp("2026-02-30"),NO_DUE_TIMESTAMP);
  assert.equal(dueTimestamp(""),NO_DUE_TIMESTAMP);
});

test("native pane filters combine dimensions and allow multiple values within one dimension",()=>{
  const rows=[
    {id:"1",assignee:"Alex",labels:"Chores, Upstairs",label_names:["Chores","Upstairs"],notifications:"Phone, Panel",notification_names:["Phone","Panel"],recurrence:"Fixed",rhythm:"Weekly"},
    {id:"2",assignee:"Alex",labels:"Garden",label_names:["Garden"],notifications:"Tablet",notification_names:["Tablet"],recurrence:"Sliding",rhythm:"Monthly"},
    {id:"3",assignee:"Sam",labels:"Chores",label_names:["Chores"],notifications:"Phone",notification_names:["Phone"],recurrence:"Fixed",rhythm:"Daily"},
  ];
  assert.deepEqual(filterTaskTableRows(rows,{assignee:["Alex"]}).map(row=>row.id),["1","2"]);
  assert.deepEqual(filterTaskTableRows(rows,{rhythm:["Weekly","Daily"]}).map(row=>row.id),["1","3"]);
  assert.deepEqual(filterTaskTableRows(rows,{recurrence:["Fixed"]}).map(row=>row.id),["1","3"]);
  assert.deepEqual(filterTaskTableRows(rows,{labels:["Chores"]}).map(row=>row.id),["1","3"]);
  assert.deepEqual(filterTaskTableRows(rows,{notifications:["Panel"]}).map(row=>row.id),["1"]);
  assert.equal(filterTaskTableRows(rows,{}).length,3);
});

test("panel uses the native Home Assistant data-table wrapper",()=>{
  assert.match(source,/createElement\("hass-tabs-subpage-data-table"\)/);
  assert.match(source,/wrapper\.data=filterTaskTableRows\(rows,this\.tableFilters\)/);
  assert.match(source,/wrapper\.initialSorting=view\.sorting/);
  assert.deepEqual(INITIAL_TASK_SORTING,{column:"due_ts",direction:"asc"});
  assert.doesNotMatch(source,/groupRow\(|wireGroup\(|placeholder-add|class="group"/);
});

test("native task column renders the stored icon with a fallback",()=>{
  assert.match(source,/icon:task\.task_icon\|\|"mdi:clipboard-check-outline"/);
  assert.match(source,/createElement\("ha-icon"\)/);
  assert.match(source,/icon\.setAttribute\("icon",row\.icon\)/);
  assert.match(source,/name:\{title:t\("table\.task"\)[^}]+template:row=>taskNameCell\(row\)/);
});

test("native table multi-select tracks selected task ids and count",()=>{
  assert.match(source,/wrapper\.setAttribute\("selectable",""\)/);
  assert.match(source,/wrapper\.addEventListener\("selection-changed"/);
  assert.match(source,/this\.selectedTaskIds=event\.detail\?\.value\|\|\[\]/);
  assert.match(source,/wrapper\.selected=this\.selectedTaskIds\.length/);
  assert.match(source,/wrapper\.selected=\(this\.selectedTaskIds\|\|\[\]\)\.length/);
});

test("native selection bar offers assignment notification completion and deletion bulk actions",()=>{
  assert.match(source,/dropdown\.slot="selection-bar"/);
  assert.match(source,/bulkDropdown\(t\("bulk\.assign_person"\)/);
  assert.match(source,/bulkDropdown\(t\("bulk\.assign_label"\)/);
  assert.match(source,/bulkDropdown\(t\("bulk\.assign_notification"\)/);
  assert.match(source,/overflowDropdown\(t\("bulk\.actions"\)/);
  assert.match(source,/selectionSubmenu\(t\("bulk\.assign_person"\)/);
  assert.match(source,/selectionSubmenu\(t\("bulk\.assign_label"\)/);
  assert.match(source,/selectionSubmenu\(t\("bulk\.assign_notification"\)/);
  assert.match(source,/dropdownItem\("complete",t\("bulk\.complete"\)/);
  assert.match(source,/dropdownItem\("delete",t\("bulk\.delete"\)/);
  assert.match(source,/type:"tasks\/task\/update"[\s\S]*assignee_id/);
  assert.match(source,/type:"tasks\/task\/update"[\s\S]*label_ids/);
  assert.match(source,/type:"tasks\/task\/complete"/);
  assert.match(source,/type:"tasks\/task\/delete"/);
  assert.match(source,/runBulkAction\(action,clear=false\)/);
  assert.match(source,/for\(const task of this\.selectedTasks\(\)\)await action\(task\);if\(clear\)this\.clearTaskSelection\(\)/);
  assert.match(source,/task\/delete"[^}]+task_id:task\.task_id\}\),true\)/);
  assert.match(source,/bulkAssignPerson\(assigneeId\)\{await this\.runBulkAction\(task=>this\.ws\(/);
  assert.match(source,/bulkAssignLabel\(labelId,action="add"\)\{await this\.runBulkAction\(task=>this\.ws\(/);
  assert.match(source,/bulkAssignNotification\(target,action="add"\)\{await this\.runBulkAction/);
  assert.match(source,/notification_persistent:action==="add"/);
  assert.match(source,/notification_target:\{device_id:/);
});

test("labels stay in their visible native table column",()=>{
  assert.doesNotMatch(source,/extraTemplate:row=>this\.taskLabels|taskLabels\(task\)|className="task-labels"/);
  assert.equal(TASK_TABLE_DIMENSIONS.labels.title,"table.label");
  assert.deepEqual(DEFAULT_HIDDEN_TASK_COLUMNS,["labels","notifications","recurrence","rhythm"]);
});

test("bulk action chips use the same compact shape as native config dashboards",()=>{
  assert.match(source,/ha-assist-chip\{--ha-assist-chip-container-shape:10px\}/);
  assert.match(source,/chevron\.slot="trailing-icon"/);
  assert.match(source,/createElement\("ha-icon-button"\)/);
  assert.match(source,/mdi:dots-vertical/);
});

test("panel title uses Home Assistant's compact native title margin",()=>{
  assert.match(source,/wrapper\.mainPage=true/);
  assert.match(source,/wrapper\.style\.setProperty\("--main-title-margin","0"\)/);
});

test("table starts with the requested visible columns in order",()=>{
  assert.deepEqual(DEFAULT_TASK_COLUMN_ORDER,["name","due_ts","assignee","nfc_tag","files","labels","notifications","recurrence","rhythm","actions"]);
  assert.deepEqual(DEFAULT_HIDDEN_TASK_COLUMNS,["labels","notifications","recurrence","rhythm"]);
  assert.match(source,/wrapper\.columnOrder=Array\.isArray\(view\.columnOrder\)/);
  assert.match(source,/wrapper\.hiddenColumns=Array\.isArray\(view\.hiddenColumns\)/);
  assert.equal(TASK_TABLE_DIMENSIONS.recurrence.defaultHidden,true);
  assert.equal(TASK_TABLE_DIMENSIONS.rhythm.defaultHidden,true);
  assert.equal(TASK_TABLE_DIMENSIONS.notifications.title,"table.notifications");
  assert.equal(TASK_TABLE_DIMENSIONS.notifications.defaultHidden,true);
  assert.equal(TASK_TABLE_DIMENSIONS.labels.defaultHidden,true);
  assert.match(source,/Object\.entries\(TASK_TABLE_DIMENSIONS\)/);
  assert.match(source,/Object\.fromEntries\(DEFAULT_TASK_COLUMN_ORDER\.map/);
});

test("custom table view survives reloads using the same storage split as Home Assistant",()=>{
  const memory=initial=>{
    const values=new Map(Object.entries(initial));
    return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  };
  const local=memory({}),session=memory({});
  storeTaskTableValue(local,TASK_TABLE_STORAGE_KEYS.sorting,{column:"name",direction:"desc"});
  storeTaskTableValue(local,TASK_TABLE_STORAGE_KEYS.grouping,"assignee");
  storeTaskTableValue(local,TASK_TABLE_STORAGE_KEYS.columnOrder,["name","assignee","actions"]);
  storeTaskTableValue(local,TASK_TABLE_STORAGE_KEYS.hiddenColumns,["files","labels"]);
  storeTaskTableValue(session,TASK_TABLE_STORAGE_KEYS.search,"filter");
  storeTaskTableValue(session,TASK_TABLE_STORAGE_KEYS.filters,{assignee:["Alex"]});

  assert.deepEqual(loadTaskTableView(local,session),{
    search:"filter",
    filters:{assignee:["Alex"]},
    sorting:{column:"name",direction:"desc"},
    grouping:"assignee",
    collapsed:undefined,
    columnOrder:DEFAULT_TASK_COLUMN_ORDER,
    hiddenColumns:["files","labels"],
  });
  assert.match(source,/wrapper\.addEventListener\("columns-changed"/);
  assert.match(source,/wrapper\.addEventListener\("sorting-changed"/);
  assert.match(source,/wrapper\.addEventListener\("grouping-changed"/);
  assert.match(source,/wrapper\.addEventListener\("collapsed-changed"/);
  assert.match(source,/wrapper\.addEventListener\("search-changed"/);
});

test("declarative dimensions can group the native table",()=>{
  assert.deepEqual(TASK_GROUP_COLUMNS,["assignee","labels","notifications","recurrence","rhythm"]);
  assert.deepEqual(TASK_GROUP_COLUMNS,Object.keys(TASK_TABLE_DIMENSIONS));
  assert.match(source,/Object\.entries\(TASK_TABLE_DIMENSIONS\)/);
  assert.match(source,/nfc_tag:\{title:[^}]+sortable:true,filterable:true\}/);
  assert.match(source,/wrapper\.initialGroupColumn=view\.grouping/);
  assert.doesNotMatch(source,/tableGrouping|table\.groupColumn=/);
});

test("native filter pane exposes every declarative dimension",()=>{
  assert.deepEqual(TASK_FILTER_COLUMNS,["assignee","labels","notifications","recurrence","rhythm"]);
  assert.match(source,/filterPane\.className="filters"/);
  assert.match(source,/filterPane\.slot="filter-pane"/);
  assert.match(source,/for\(const column of TASK_FILTER_COLUMNS\)/);
  assert.match(source,/createElement\(FILTER_CATEGORY_TAG\)/);
  assert.match(source,/querySelectorAll\(FILTER_CATEGORY_TAG\)/);
  assert.match(source,/\.filters\{box-sizing:border-box;width:100%\}/);
  assert.doesNotMatch(source,/\.filters\{[^}]*margin/);
  assert.doesNotMatch(source,/createElement\("ha-form"\)|ha-filter-states|expandedTableFilter|filterDefinitionPending/);
  assert.match(source,/wrapper\.setAttribute\("has-filters",""\)/);
  assert.match(source,/wrapper\.filters=this\.activeFilterCount\(\)/);
  assert.match(source,/wrapper\.data=filterTaskTableRows\(rows,this\.tableFilters\)/);
  assert.match(source,/wrapper\.addEventListener\("clear-filter"/);
});

test("native table width follows every container resize",()=>{
  assert.match(source,/wrapper\.style\.width="100%"/);
  assert.match(source,/new ResizeObserver\(\(\)=>/);
  assert.match(source,/taskTableResizeObserver\.observe\(table\)/);
  assert.match(source,/querySelector\("ha-data-table"\)/);
  assert.match(source,/removeProperty\("--table-row-width"\)/);
  assert.match(source,/table\.requestUpdate\?\.\(\)/);
  assert.match(source,/disconnectTaskTableResize\(\)/);
});

test("all filters follow Home Assistant category rows",()=>{
  const taskList=readFileSync(new URL("../../custom_components/tasks/frontend/sidebar-task-list.js",import.meta.url),"utf8");
  const filterCategory=taskList.slice(taskList.indexOf("export class TasksSidebarFilterCategory"),taskList.indexOf("export function dueTimestamp"));
  const actionMenu=readFileSync(new URL("../../custom_components/tasks/frontend/action-menu.js",import.meta.url),"utf8");
  assert.match(filterCategory,/createElement\("ha-list-item"\)/);
  assert.doesNotMatch(filterCategory,/createActionMenu|groupEditor|deleteGroup/);
  assert.match(actionMenu,/createElement\("ha-dropdown"\)/);
  assert.match(actionMenu,/dropdown\.addEventListener\("click",\s*stop\)/);
});

test("search remains delegated to the native table while its value is persisted",()=>{
  assert.match(source,/name:\{title:[^}]+filterable:true/);
  assert.match(source,/const groupable=\{sortable:true,filterable:true,groupable:true\}/);
  assert.match(source,/Object\.entries\(TASK_TABLE_DIMENSIONS\)/);
  assert.doesNotMatch(source,/tableSearch|filterTaskRows|syncNativeTableFilter/);
  assert.match(source,/wrapper\.addEventListener\("search-changed"/);
  assert.doesNotMatch(source,/wrapper\.addEventListener\("value-changed"/);
});

test("panel keeps native settings and add-task controls",()=>{
  assert.match(source,/settings\.slot="toolbar-icon"/);
  assert.match(source,/this\.settings\(\)/);
  assert.match(source,/fab\.slot="fab"/);
  assert.match(source,/fab\.setAttribute\("size","l"\)/);
  assert.doesNotMatch(source,/fab\.setAttribute\("variant","brand"\)/);
  assert.match(source,/this\.taskEditor\(null\)/);
});

test("files column shows the sortable attachment count",()=>{
  assert.match(source,/files:\{title:t\("task\.files"\),sortable:true,filterable:false\}/);
  assert.match(source,/attachments:this\.attachments/);
});

test("task action menu stops pointer and click propagation",()=>{
  const actionMenu=readFileSync(new URL("../../custom_components/tasks/frontend/action-menu.js",import.meta.url),"utf8");
  assert.match(source,/return createActionMenu\(/);
  assert.match(source,/edit:\(\)=>this\.taskEditor\(task\)/);
  assert.match(source,/remove:\(\)=>this\.deleteTask\(task\)/);
  assert.match(actionMenu,/createElement\("ha-dropdown"\)/);
  assert.match(actionMenu,/createElement\("ha-dropdown-item"\)/);
  assert.match(actionMenu,/dropdown\.addEventListener\("pointerdown",\s*stop\)/);
  assert.match(actionMenu,/dropdown\.addEventListener\("click",\s*stop\)/);
  assert.match(actionMenu,/dropdown\.addEventListener\("wa-select"/);
  assert.doesNotMatch(actionMenu,/position:fixed|box-shadow|row-action-menu/);
});

test("row clicks continue to open the existing task viewer",()=>{
  assert.match(source,/row-click[\s\S]*this\.taskViewer\(task\)/);
});
