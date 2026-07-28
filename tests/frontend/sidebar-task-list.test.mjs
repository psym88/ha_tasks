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
const {TASK_FILTER_COLUMNS,TASK_TABLE_DIMENSIONS,knownLabelIds,knownReferenceId,taskTableRows}=await import("../../custom_components/tasks/frontend/sidebar-task-list.js");
const {NO_DUE_TIMESTAMP,createTaskTableRows,dueTimestamp}=await import("../../custom_components/tasks/frontend/task-table-rows.js");
const {DEFAULT_TASK_COLUMN_VISIBILITY,INITIAL_TASK_SORTING,TASK_TABLE_LOCAL_STORAGE_KEY,TASK_TABLE_SESSION_STORAGE_KEY,loadTaskTableView,storeTaskTableView}=await import("../../custom_components/tasks/frontend/task-table-view.js");
const {includesSelectedValue}=await import("../../custom_components/tasks/frontend/tasks-data-table.js");

const source=readFileSync(new URL("../../custom_components/tasks/frontend/sidebar-task-list.js",import.meta.url),"utf8");

test("task rows flatten every grouping dimension and resolve ids to names",()=>{
  const tasks=[{id:"laundry",name:"Laundry",icon:"mdi:washing-machine",due:"2026-07-24T10:15:00Z",schedule:{type:"fixed",unit:"weekly",interval:1,weekdays:[0],time:"10:15"},assignee_id:"alex",label_ids:["upstairs","deleted","chores"],nfc_tag_id:"washer",notification:{device_ids:["phone","deleted-phone"],persistent:true,critical:false,route:null}}];
  const original=structuredClone(tasks);
  const attachments=[{id:"a",taskId:"laundry"},{id:"b",taskId:"laundry"},{id:"c",taskId:"other"}];
  const [row]=taskTableRows(tasks,{users:[{id:"alex",name:"Alex"}],tags:[{id:"washer",name:"Washer"}],labels:[{label_id:"upstairs",name:"Upstairs"},{label_id:"chores",name:"Chores"}],devices:[{id:"phone",name_by_user:"Alex's phone"}],attachments,translate:key=>key});
  assert.deepEqual({id:row.id,icon:row.icon,name:row.name,recurrence:row.recurrence,rhythm:row.rhythm,assignee:row.assignee,labels:row.labels,label_ids:row.label_ids,notifications:row.notifications,notification_ids:row.notification_ids,nfc_tag:row.nfc_tag,files:row.files},{id:"laundry",icon:"mdi:washing-machine",name:"Laundry",recurrence:"task.fixed",rhythm:"task.weekly",assignee:"Alex",labels:"Chores, Upstairs",label_ids:["chores","upstairs"],notifications:"Alex's phone, task.notification_panel_target",notification_ids:["phone","panel"],nfc_tag:"Washer",files:2});
  assert.equal(row.task,tasks[0]);
  assert.deepEqual(tasks,original);
});

test("deleted Home Assistant labels are excluded from task projections",()=>{
  assert.deepEqual(knownLabelIds(["known","deleted"],[{label_id:"known",name:"Known"}]),["known"]);
  const [row]=taskTableRows([{id:"task",name:"Task",label_ids:["deleted"]}],{labels:[],translate:key=>`translated:${key}`});
  assert.equal(row.labels,"translated:task.no_labels");
  assert.deepEqual(row.label_ids,[]);
  assert.equal(row.notifications,"translated:task.no_notification_targets");
  assert.deepEqual(row.notification_ids,[]);
});

test("deleted Home Assistant users and NFC tags become unassigned",()=>{
  assert.equal(knownReferenceId("known",[{id:"known"}]),"known");
  assert.equal(knownReferenceId("deleted",[{id:"known"}]),null);
  const [row]=taskTableRows([{id:"task",name:"Task",assignee_id:"deleted-user",nfc_tag_id:"deleted-tag"}],{users:[],tags:[],translate:key=>`translated:${key}`});
  assert.equal(row.assignee,"translated:task.unassigned");
  assert.equal(row.nfc_tag,"translated:task.no_nfc_tag");
});

test("missing assignments receive localized searchable values",()=>{
  const [row]=taskTableRows([{id:"task",name:"Task",schedule:{type:"sliding",unit:"daily",interval:1}}],{translate:key=>`translated:${key}`});
  assert.equal(row.assignee,"translated:task.unassigned");
  assert.equal(row.labels,"translated:task.no_labels");
  assert.deepEqual(row.label_ids,[]);
  assert.equal(row.nfc_tag,"translated:task.no_nfc_tag");
  assert.equal(row.files,0);
});

test("due timestamps sort parsed datetimes and represent missing values as the maximum",()=>{
  assert.equal(dueTimestamp("2026-07-22T10:15:00Z"),Date.parse("2026-07-22T10:15:00Z"));
  assert.equal(dueTimestamp(""),NO_DUE_TIMESTAMP);
});

test("due table keeps numeric sorting separate from localized date-time display",()=>{
  const rowsSource=readFileSync(new URL("../../custom_components/tasks/frontend/task-table-rows.js",import.meta.url),"utf8");
  assert.match(rowsSource,/due_ts:dueTimestamp\(task\.active===false\?null:task\.due\)/);
  assert.match(source,/row\.task\.active!==false&&row\.task\.due\?this\.date\(row\.task\.due," - "\)/);
});

test("sensor tasks show no rhythm and do not create an empty filter option",()=>{
  const [row]=taskTableRows(
    [{id:"problem",name:"Problem",due:null,schedule:{type:"sensor",entity_id:"binary_sensor.problem"}}],
    {translate:key=>`translated:${key}`},
  );
  assert.equal(row.recurrence,"translated:task.problem");
  assert.equal(row.rhythm,"–");
  assert.equal(row.rhythm_id,"problem");
  assert.deepEqual(row.filter_options.rhythm,[]);
});

test("TanStack filters combine dimensions and allow multiple values within one dimension",()=>{
  const rows=[
    {id:"1",assignee_id:"alex",label_ids:["chores","upstairs"],notification_ids:["phone","panel"],recurrence_id:"fixed",rhythm_id:"weekly"},
    {id:"2",assignee_id:"alex",label_ids:["garden"],notification_ids:["tablet"],recurrence_id:"sliding",rhythm_id:"monthly"},
    {id:"3",assignee_id:"sam",label_ids:["chores"],notification_ids:["phone"],recurrence_id:"fixed",rhythm_id:"daily"},
  ];
  const dimensions={assignee:"assignee_id",labels:"label_ids",notifications:"notification_ids",recurrence:"recurrence_id",rhythm:"rhythm_id"};
  const filtered=filters=>rows.filter(row=>Object.entries(dimensions).every(([column,field])=>includesSelectedValue({original:row},field,filters[column]))).map(row=>row.id);
  assert.deepEqual(filtered({assignee:["alex"]}),["1","2"]);
  assert.deepEqual(filtered({rhythm:["weekly","daily"]}),["1","3"]);
  assert.deepEqual(filtered({recurrence:["fixed"]}),["1","3"]);
  assert.deepEqual(filtered({labels:["chores"]}),["1","3"]);
  assert.deepEqual(filtered({notifications:["panel"]}),["1"]);
  assert.deepEqual(filtered({}),["1","2","3"]);
});

test("panel uses the framework-neutral TanStack table wrapper",()=>{
  const tableSource=readFileSync(new URL("../../custom_components/tasks/frontend/tasks-data-table.js",import.meta.url),"utf8");
  assert.match(source,/import "\.\/tasks-data-table\.js"/);
  assert.match(source,/createElement\("tasks-data-table"\)/);
  assert.match(source,/wrapper\.configure\(\{columns:this\.tableColumns\(\),dimensionFilters:this\.tableFilters,data:rows\}\)/);
  assert.match(source,/wrapper\.initialSorting=view\.sorting/);
  assert.deepEqual(INITIAL_TASK_SORTING,{column:"due_ts",direction:"asc"});
  assert.match(tableSource,/from "\.\/vendor\/tanstack-table-core\.mjs"/);
  assert.match(tableSource,/getSortedRowModel|getGroupedRowModel|getFilteredRowModel/);
  assert.match(tableSource,/groupedColumnMode:false/);
  assert.match(tableSource,/<ha-expansion-panel left-chevron class="columns-panel"/);
  assert.match(tableSource,/<ha-expansion-panel left-chevron class="grouping-panel"/);
  assert.match(tableSource,/<ha-checkbox data-column=/);
  assert.match(tableSource,/<input type="radio" name="group"/);
  assert.doesNotMatch(tableSource,/<ha-radio-(?:group|option)|<input type="checkbox"/);
});

test("TanStack owns table visibility selection sorting and filtering logic",()=>{
  const tableSource=readFileSync(new URL("../../custom_components/tasks/frontend/tasks-data-table.js",import.meta.url),"utf8");
  assert.match(tableSource,/columnVisibility:this\._columnVisibility/);
  assert.match(tableSource,/onColumnVisibilityChange:updater/);
  assert.match(tableSource,/column\.getIsVisible\(\)/);
  assert.match(tableSource,/column\.toggleVisibility\(\)/);
  assert.doesNotMatch(tableSource,/_hiddenColumns|hiddenColumns/);
  assert.match(tableSource,/this\._table\.resetRowSelection\(\)/);
  assert.match(tableSource,/this\._table\.getSelectedRowModel\(\)\.rows\.map\(row=>row\.id\)/);
  assert.match(tableSource,/sortingFn:id==="due_ts"\|\|id==="files"\?"basic":"alphanumeric"/);
  assert.match(tableSource,/globalFilterFn:"includesString"/);
  assert.match(tableSource,/columnFilters:this\._columnFilters/);
  assert.match(tableSource,/filterFn:definition\.filterField\?/);
  assert.doesNotMatch(tableSource,/Object\.values\(row\.original\)|localeCompare/);
});

test("table toolbar and scrolling keep controls and headers stable",()=>{
  const tableSource=readFileSync(new URL("../../custom_components/tasks/frontend/tasks-data-table.js",import.meta.url),"utf8");
  assert.ok(tableSource.indexOf('<div class="toolbar-actions">')<tableSource.indexOf('<div class="selection${selectedCount?" active":""}"><input class="search"'));
  assert.match(tableSource,/\.toolbar-actions\{display:flex;align-items:center;margin-inline-start:auto\}/);
  assert.match(tableSource,/\.search\{box-sizing:border-box;height:var\(--ha-control-height,40px\)/);
  assert.match(tableSource,/--md-assist-chip-container-height:var\(--ha-control-height,40px\)/);
  assert.match(tableSource,/--md-assist-chip-label-text-size:var\(--ha-font-size-m\)/);
  assert.doesNotMatch(tableSource,/--ha-assist-chip-container-height/);
  assert.match(tableSource,/\.filter-menu,\.display-menu\{width:max-content;max-width:[^}]+padding:0;/);
  assert.match(tableSource,/\.settings-menu\{box-sizing:border-box;width:420px;max-width:calc\(100vw - var\(--ha-space-8\)\);padding:0;/);
  assert.match(tableSource,/\.filter-menu ha-expansion-panel,\.display-menu ha-expansion-panel,\.settings-menu slot::slotted\(\*\)\{width:100%\}/);
  assert.match(tableSource,/:host\{display:block;position:relative;height:100vh;min-height:0;overflow:hidden/);
  assert.match(tableSource,/\.toolbar\{position:absolute;z-index:5;top:0;inset-inline:0;/);
  assert.match(tableSource,/\.content\{position:absolute;top:calc\(var\(--header-height,0px\) \+ var\(--safe-area-inset-top,0px\)\);bottom:0;inset-inline:0;display:flex;min-height:0;flex-direction:column/);
  assert.doesNotMatch(tableSource,/thead\{position:sticky/);
  assert.match(tableSource,/<div class="content">\s*<div class="selection/);
  assert.match(tableSource,/@container \(max-width:600px\)\{[\s\S]*?\.table-wrap thead th button\{pointer-events:none;cursor:default\}/);
  assert.match(tableSource,/const previousScrollTop=this\.shadowRoot\?\.querySelector\("\.table-wrap"\)\?\.scrollTop\|\|0/);
  assert.match(tableSource,/this\.shadowRoot\.querySelector\("\.table-wrap"\)\.scrollTop=previousScrollTop/);
  assert.match(tableSource,/\.fab\{position:fixed;z-index:3;/);
  assert.match(tableSource,/row\.className="empty-row";cell\.colSpan=columns\.length\+1/);
  assert.match(tableSource,/tbody tr\.group-row,tbody tr\.empty-row\{display:table;width:100%\}/);
});

test("native icon column replaces the task icon for inactive tasks",()=>{
  const rowsSource=readFileSync(new URL("../../custom_components/tasks/frontend/task-table-rows.js",import.meta.url),"utf8");
  assert.match(rowsSource,/icon:task\.icon\|\|"mdi:clipboard-check-outline"/);
  assert.match(source,/function taskIconCell\(row\)/);
  assert.match(source,/function taskNameCell\(row\)/);
  assert.match(source,/icon\.setAttribute\("icon",row\.task\.active===false\?"mdi:pause-circle":row\.icon\)/);
  assert.match(source,/if\(row\.task\.active===false\)icon\.style\.color="var\(--error-color\)"/);
  assert.match(source,/icon:\{title:"",hideable:false,template:row=>taskIconCell\(row\)\}/);
  assert.match(source,/name:\{title:t\("table\.task"\),sortable:true,template:row=>taskNameCell\(row\)\}/);
  assert.doesNotMatch(source,/textDecoration|line-through/);
});

test("native table multi-select tracks selected task ids and count",()=>{
  assert.match(source,/wrapper\.addEventListener\("selection-changed"/);
  assert.match(source,/this\.selectedTaskIds=event\.detail\?\.value\|\|\[\]/);
  assert.doesNotMatch(source,/wrapper\.selected=/);
});

test("native selection bar offers assignment notification completion and deletion bulk actions",()=>{
  assert.match(source,/dropdown\.slot="selection-bar"/);
  assert.match(source,/overflowDropdown\(t\("bulk\.actions"\)/);
  assert.match(source,/selectionSubmenu\(t\("bulk\.assign_person"\)/);
  assert.match(source,/selectionSubmenu\(t\("bulk\.assign_label"\)/);
  assert.match(source,/selectionSubmenu\(t\("bulk\.assign_notification"\)/);
  assert.match(source,/dropdownItem\("complete",t\("bulk\.complete"\)/);
  assert.match(source,/dropdownItem\("active",t\(activate\?"menu\.activate":"menu\.deactivate"\)/);
  assert.match(source,/dropdownItem\("delete",t\("bulk\.delete"\)/);
  assert.match(source,/overflowDropdown\(t\("bulk\.actions"\),\[complete,active,document\.createElement\("wa-divider"\),this\.selectionSubmenu/);
  assert.match(source,/parent\.addEventListener\("pointerleave",\(\)=>parent\.closeSubmenu\(\)\)/);
  assert.doesNotMatch(source,/parent\.addEventListener\("focusout"/);
  assert.match(source,/value\.startsWith\("person_"\)\|\|value\.startsWith\("label_"\)\|\|value\.startsWith\("notification_"\)\)\{/);
  assert.match(source,/const checkbox=item\.querySelector\("ha-checkbox"\)/);
  assert.match(source,/checkbox\.checked=checked;checkbox\.indeterminate=false;item\.dataset\.action=checked\?"remove":"add"/);
  assert.match(source,/if\(!wrapper\.querySelector\('\[slot="selection-bar"\]'\)\?\.open\)this\.appendBulkActions\(wrapper\)/);
  assert.match(source,/dropdown\.addEventListener\("wa-after-hide",\(\)=>\{if\(dropdown\.isConnected\)this\.appendBulkActions\(wrapper\);\},\{once:true\}\)/);
  assert.match(source,/type:"tasks\/task\/bulk",operations/);
  assert.match(source,/runBulkAction\(operation,clear=false\)/);
  assert.match(source,/const operations=this\.selectedTasks\(\)\.map\(operation\)/);
  assert.match(source,/await this\.ws\(\{type:"tasks\/task\/bulk",operations\}\)/);
  assert.match(source,/action:"delete",id:task\.id\}\),true\)/);
  assert.match(source,/bulkAssignPerson\(assigneeId\)\{await this\.runBulkAction\(task=>\(\{action:"update"/);
  assert.match(source,/bulkAssignLabel\(labelId,action="add"\)\{await this\.runBulkAction\(task=>\(\{action:"update"/);
  assert.match(source,/bulkAssignNotification\(target,action="add"\)\{await this\.runBulkAction/);
  assert.match(source,/bulkSetActive\(active\)[\s\S]*action:"update",id:task\.id,changes:\{active\}/);
  assert.match(source,/action:"complete",id:task\.id,notes:null/);
  assert.match(source,/persistent:action==="add"/);
  assert.match(source,/device_ids:action==="remove"/);
  assert.match(source,/checkbox\.tabIndex=-1;checkbox\.style\.pointerEvents="none"/);
  assert.match(source,/dropdownItem\(`label_\$\{label\.label_id\}`,label\.name,null,slot\)/);
  assert.doesNotMatch(source,/createElement\("ha-label"\)/);
});

test("labels stay in their visible native table column",()=>{
  assert.doesNotMatch(source,/extraTemplate:row=>this\.taskLabels|taskLabels\(task\)|className="task-labels"/);
  assert.equal(TASK_TABLE_DIMENSIONS.labels.title,"table.label");
  assert.deepEqual(DEFAULT_TASK_COLUMN_VISIBILITY,{labels:false,notifications:false,recurrence:false,rhythm:false});
});

test("bulk action chips use the same compact shape as native config dashboards",()=>{
  assert.match(source,/ha-assist-chip\{--ha-assist-chip-container-shape:10px\}/);
  assert.match(source,/icon\.slot="trailing-icon"/);
  assert.match(source,/icon\.setAttribute\("icon","mdi:menu-down"\)/);
  assert.doesNotMatch(source,/createElement\("ha-icon-button"\)/);
});

test("panel title uses Home Assistant's compact native title margin",()=>{
  assert.match(source,/wrapper\.style\.setProperty\("--main-title-margin","0"\)/);
});

test("table starts with the requested visible columns in definition order",()=>{
  assert.deepEqual(DEFAULT_TASK_COLUMN_VISIBILITY,{labels:false,notifications:false,recurrence:false,rhythm:false});
  assert.match(source,/wrapper\.initialColumnVisibility=view\.columnVisibility/);
  assert.equal(TASK_TABLE_DIMENSIONS.notifications.title,"table.notifications");
  assert.match(source,/return available/);
  const columnsSource=source.slice(source.indexOf("tableColumns(){"),source.indexOf("taskActionButton(task)"));
  for(const [left,right] of [["icon","name"],["name","due_ts"],["due_ts","assignee"],["assignee","nfc_tag"],["nfc_tag","files"],["files","labels"],["labels","notifications"],["notifications","recurrence"],["recurrence","rhythm"],["rhythm","actions"]]){
    assert.ok(columnsSource.indexOf(`${left}:`)<columnsSource.indexOf(`${right}:`),`${left} should precede ${right}`);
  }
});

test("custom table view survives reloads using the same storage split as Home Assistant",()=>{
  const memory=initial=>{
    const values=new Map(Object.entries(initial));
    return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  };
  const local=memory({}),session=memory({});
  storeTaskTableView(local,session,{
    search:"filter",
    filters:{assignee:["alex"]},
    sorting:{column:"name",direction:"desc"},
    grouping:"assignee",
    collapsed:undefined,
    columnVisibility:{files:false,labels:false},
  });

  assert.deepEqual(loadTaskTableView(local,session),{
    search:"filter",
    filters:{assignee:["alex"]},
    sorting:{column:"name",direction:"desc"},
    grouping:"assignee",
    collapsed:undefined,
    columnVisibility:{files:false,labels:false},
  });
  assert.ok(local.getItem(TASK_TABLE_LOCAL_STORAGE_KEY));
  assert.ok(session.getItem(TASK_TABLE_SESSION_STORAGE_KEY));
  assert.match(source,/wrapper\.addEventListener\("visibility-changed"/);
  assert.match(source,/wrapper\.addEventListener\("sorting-changed"/);
  assert.match(source,/wrapper\.addEventListener\("grouping-changed"/);
  assert.match(source,/wrapper\.addEventListener\("collapsed-changed"/);
  assert.match(source,/wrapper\.addEventListener\("search-changed"/);

  const legacy=memory({[TASK_TABLE_LOCAL_STORAGE_KEY]:JSON.stringify({hiddenColumns:["files"]})});
  assert.deepEqual(loadTaskTableView(legacy,memory({})).columnVisibility,DEFAULT_TASK_COLUMN_VISIBILITY);
});

test("declarative dimensions can group the native table",()=>{
  assert.match(source,/const dimension=name=>\(\{title:t\(TASK_TABLE_DIMENSIONS\[name\]\.title\),filterField:TASK_TABLE_DIMENSIONS\[name\]\.values,\.\.\.groupable\}\)/);
  assert.match(source,/nfc_tag:\{title:[^}]+sortable:true\}/);
  assert.match(source,/wrapper\.initialGroupColumn=view\.grouping/);
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
  assert.match(source,/wrapper\.configure\(\{columns:this\.tableColumns\(\),dimensionFilters:this\.tableFilters,data:rows\}\)/);
  assert.match(source,/wrapper\.addEventListener\("clear-filter"/);
  assert.match(source,/value-changed"[\s\S]*?persistTaskTableValue\("filters",this\.tableFilters\);this\.clearTaskSelection\(\);this\.updateTaskTable\(\)/);
  assert.match(source,/clear-filter",\(\)=>\{this\.tableFilters=\{\};this\.persistTaskTableValue\("filters",this\.tableFilters\);this\.clearTaskSelection\(\);this\.updateTaskTable\(\)/);
});

test("table projection keeps stable ids separate from localized labels",()=>{
  const [row]=createTaskTableRows([{id:"task",name:"Task",assignee_id:"alex",label_ids:["chores"],schedule:{type:"fixed",unit:"weekly",interval:1,weekdays:[0],time:"10:00"}}],{
    users:[{id:"alex",name:"Alex"}],
    labels:[{label_id:"chores",name:"Chores"}],
    translate:key=>`translated:${key}`,
  });
  assert.equal(row.assignee_id,"alex");
  assert.equal(row.assignee,"Alex");
  assert.deepEqual(row.label_ids,["chores"]);
  assert.equal(row.labels,"Chores");
  assert.equal(row.recurrence_id,"fixed");
  assert.equal(row.recurrence,"translated:task.fixed");
});

test("table data and filter state are configured in one update",()=>{
  assert.match(source,/wrapper\.configure\(\{columns:this\.tableColumns\(\),dimensionFilters:this\.tableFilters,data:rows\}\)/);
  assert.doesNotMatch(source,/activeFilterCount|wrapper\.filters=|wrapper\.dimensionFilters=|wrapper\.data=/);
});

test("all filters follow Home Assistant category rows",()=>{
  const taskList=readFileSync(new URL("../../custom_components/tasks/frontend/sidebar-task-list.js",import.meta.url),"utf8");
  const filterCategory=taskList.slice(taskList.indexOf("export class TasksSidebarFilterCategory"),taskList.indexOf("export function taskTableRows"));
  const actionMenu=readFileSync(new URL("../../custom_components/tasks/frontend/action-menu.js",import.meta.url),"utf8");
  assert.match(filterCategory,/createElement\("ha-checkbox"\)/);
  assert.match(filterCategory,/\.options\{display:flex;flex-direction:column;padding-block:var\(--ha-space-2\)\}/);
  assert.match(filterCategory,/\.options label\{display:flex;align-items:center;gap:var\(--ha-space-2\);min-height:40px;padding-inline:var\(--ha-space-4\)\}/);
  assert.match(filterCategory,/label\.addEventListener\("click"/);
  assert.doesNotMatch(filterCategory,/createElement\("ha-icon"\)|createElement\("ha-list-item"\)/);
  assert.doesNotMatch(filterCategory,/createActionMenu|groupEditor|deleteGroup/);
  assert.match(actionMenu,/createElement\("ha-dropdown"\)/);
  assert.match(actionMenu,/dropdown\.addEventListener\("click",\s*stop\)/);
});

test("search remains delegated to the table while its value is persisted",()=>{
  assert.match(source,/const groupable=\{sortable:true,groupable:true\}/);
  assert.match(source,/filterField:TASK_TABLE_DIMENSIONS\[name\]\.values/);
  assert.match(source,/wrapper\.addEventListener\("search-changed"/);
});

test("panel keeps native settings and add-task controls",()=>{
  assert.match(source,/settings\.slot="settings-pane"/);
  assert.match(source,/settings\.controller=this/);
  assert.match(source,/fab\.slot="fab"/);
  assert.match(source,/fab\.setAttribute\("size","l"\)/);
  assert.doesNotMatch(source,/fab\.setAttribute\("variant","brand"\)/);
  assert.match(source,/this\.taskEditor\(null\)/);
});

test("files column shows the sortable attachment count",()=>{
  assert.match(source,/files:\{title:t\("task\.files"\),sortable:true\}/);
  assert.match(source,/attachments:this\.attachments/);
});

test("sorting indicator stays left without shifting the table header text",()=>{
  const table=readFileSync(new URL("../../custom_components/tasks/frontend/tasks-data-table.js",import.meta.url),"utf8");
  assert.doesNotMatch(table,/th button\.sortable\{padding-inline-start:/);
  assert.match(table,/th\{color:var\(--primary-text-color\);font-size:var\(--ha-font-size-l\)\}/);
  assert.match(table,/th button ha-icon\{position:absolute;inset-block-start:50%;inset-inline-start:calc\(-1 \* var\(--ha-space-4\)\);transform:translateY\(-50%\)/);
  assert.ok(table.indexOf("button.append(icon)")<table.indexOf("button.append(label)"));
});

test("task action menu stops pointer and click propagation",()=>{
  const actionMenu=readFileSync(new URL("../../custom_components/tasks/frontend/action-menu.js",import.meta.url),"utf8");
  assert.match(source,/return createActionMenu\(/);
  assert.match(source,/edit:\(\)=>this\.taskEditor\(task\)/);
  assert.match(source,/active:task\.active!==false/);
  assert.match(source,/active:task\.active===false/);
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
