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
const {DEFAULT_HIDDEN_TASK_COLUMNS,INITIAL_TASK_SORTING,TASK_TABLE_LOCAL_STORAGE_KEY,TASK_TABLE_SESSION_STORAGE_KEY,loadTaskTableView,storeTaskTableView}=await import("../../custom_components/tasks/frontend/task-table-view.js");
const {matchesDimensionFilters}=await import("../../custom_components/tasks/frontend/tasks-data-table.js");

const source=readFileSync(new URL("../../custom_components/tasks/frontend/sidebar-task-list.js",import.meta.url),"utf8");

test("task rows flatten every grouping dimension and resolve ids to names",()=>{
  const tasks=[{task_id:"laundry",task_name:"Laundry",task_icon:"mdi:washing-machine",task_due:"2026-07-24T10:15:00Z",schedule_type:"fixed",schedule_unit:"weekly",assignee_id:"alex",label_ids:["upstairs","deleted","chores"],nfc_tag_id:"washer",notification_target:{device_id:["phone","deleted-phone"]},notification_persistent:true}];
  const original=structuredClone(tasks);
  const attachments=[{attachment_id:"a",task_id:"laundry"},{attachment_id:"b",task_id:"laundry"},{attachment_id:"c",task_id:"other"}];
  const [row]=taskTableRows(tasks,{users:[{id:"alex",name:"Alex"}],tags:[{id:"washer",name:"Washer"}],labels:[{label_id:"upstairs",name:"Upstairs"},{label_id:"chores",name:"Chores"}],devices:[{id:"phone",name_by_user:"Alex's phone"}],attachments,translate:key=>key});
  assert.deepEqual({id:row.id,icon:row.icon,name:row.name,recurrence:row.recurrence,rhythm:row.rhythm,assignee:row.assignee,labels:row.labels,label_ids:row.label_ids,notifications:row.notifications,notification_ids:row.notification_ids,nfc_tag:row.nfc_tag,files:row.files},{id:"laundry",icon:"mdi:washing-machine",name:"Laundry",recurrence:"task.fixed",rhythm:"task.weekly",assignee:"Alex",labels:"Chores, Upstairs",label_ids:["chores","upstairs"],notifications:"Alex's phone, task.notification_panel_target",notification_ids:["phone","panel"],nfc_tag:"Washer",files:2});
  assert.equal(row.task,tasks[0]);
  assert.deepEqual(tasks,original);
});

test("deleted Home Assistant labels are excluded from task projections",()=>{
  assert.deepEqual(knownLabelIds(["known","deleted"],[{label_id:"known",name:"Known"}]),["known"]);
  const [row]=taskTableRows([{task_id:"task",task_name:"Task",label_ids:["deleted"]}],{labels:[],translate:key=>`translated:${key}`});
  assert.equal(row.labels,"translated:task.no_labels");
  assert.deepEqual(row.label_ids,[]);
  assert.equal(row.notifications,"translated:task.no_notification_targets");
  assert.deepEqual(row.notification_ids,[]);
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
  assert.match(rowsSource,/due_ts:dueTimestamp\(task\.active===false\?null:task\.task_due\)/);
  assert.match(source,/row\.task\.active!==false&&row\.task\.task_due\?this\.date\(row\.task\.task_due," - "\)/);
});

test("sensor tasks show no rhythm and do not create an empty filter option",()=>{
  const [row]=taskTableRows(
    [{task_id:"problem",task_name:"Problem",task_due:null,schedule_type:"sensor",problem_sensor:"binary_sensor.problem"}],
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
  const filtered=filters=>rows.filter(row=>matchesDimensionFilters(row,filters,dimensions)).map(row=>row.id);
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
  assert.match(source,/wrapper\.dimensionFilters=this\.tableFilters/);
  assert.match(source,/wrapper\.data=rows/);
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

test("table toolbar and scrolling keep controls and headers stable",()=>{
  const tableSource=readFileSync(new URL("../../custom_components/tasks/frontend/tasks-data-table.js",import.meta.url),"utf8");
  assert.ok(tableSource.indexOf('<div class="toolbar-actions">')<tableSource.indexOf('<div class="selection${this.selected?" active":""}"><input class="search"'));
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
  assert.match(rowsSource,/icon:task\.task_icon\|\|"mdi:clipboard-check-outline"/);
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
  assert.match(source,/wrapper\.selected=this\.selectedTaskIds\.length/);
  assert.match(source,/wrapper\.selected=\(this\.selectedTaskIds\|\|\[\]\)\.length/);
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
  assert.match(source,/bulkSetActive\(active\)[\s\S]*type:"tasks\/task\/update",task_id:task\.task_id,active/);
  assert.match(source,/notification_persistent:action==="add"/);
  assert.match(source,/notification_target:\{device_id:/);
  assert.match(source,/checkbox\.tabIndex=-1;checkbox\.style\.pointerEvents="none"/);
  assert.match(source,/dropdownItem\(`label_\$\{label\.label_id\}`,label\.name,null,slot\)/);
  assert.doesNotMatch(source,/createElement\("ha-label"\)/);
});

test("labels stay in their visible native table column",()=>{
  assert.doesNotMatch(source,/extraTemplate:row=>this\.taskLabels|taskLabels\(task\)|className="task-labels"/);
  assert.equal(TASK_TABLE_DIMENSIONS.labels.title,"table.label");
  assert.deepEqual(DEFAULT_HIDDEN_TASK_COLUMNS,["labels","notifications","recurrence","rhythm"]);
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
  assert.deepEqual(DEFAULT_HIDDEN_TASK_COLUMNS,["labels","notifications","recurrence","rhythm"]);
  assert.match(source,/wrapper\.hiddenColumns=Array\.isArray\(view\.hiddenColumns\)/);
  assert.equal(TASK_TABLE_DIMENSIONS.notifications.title,"table.notifications");
  assert.match(source,/Object\.entries\(TASK_TABLE_DIMENSIONS\)/);
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
    hiddenColumns:["files","labels"],
  });

  assert.deepEqual(loadTaskTableView(local,session),{
    search:"filter",
    filters:{assignee:["alex"]},
    sorting:{column:"name",direction:"desc"},
    grouping:"assignee",
    collapsed:undefined,
    hiddenColumns:["files","labels"],
  });
  assert.ok(local.getItem(TASK_TABLE_LOCAL_STORAGE_KEY));
  assert.ok(session.getItem(TASK_TABLE_SESSION_STORAGE_KEY));
  assert.match(source,/wrapper\.addEventListener\("columns-changed"/);
  assert.match(source,/wrapper\.addEventListener\("sorting-changed"/);
  assert.match(source,/wrapper\.addEventListener\("grouping-changed"/);
  assert.match(source,/wrapper\.addEventListener\("collapsed-changed"/);
  assert.match(source,/wrapper\.addEventListener\("search-changed"/);
});

test("declarative dimensions can group the native table",()=>{
  assert.match(source,/Object\.entries\(TASK_TABLE_DIMENSIONS\)/);
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
  assert.match(source,/wrapper\.filters=this\.activeFilterCount\(\)/);
  assert.match(source,/wrapper\.filterDimensions=TASK_TABLE_FILTER_DIMENSIONS/);
  assert.match(source,/wrapper\.dimensionFilters=this\.tableFilters/);
  assert.match(source,/wrapper\.data=rows/);
  assert.match(source,/wrapper\.addEventListener\("clear-filter"/);
  assert.match(source,/value-changed"[\s\S]*?persistTaskTableValue\("filters",this\.tableFilters\);this\.clearTaskSelection\(\);this\.updateTaskTable\(\)/);
  assert.match(source,/clear-filter",\(\)=>\{this\.tableFilters=\{\};this\.persistTaskTableValue\("filters",this\.tableFilters\);this\.clearTaskSelection\(\);this\.updateTaskTable\(\)/);
});

test("table projection keeps stable ids separate from localized labels",()=>{
  const [row]=createTaskTableRows([{task_id:"task",task_name:"Task",assignee_id:"alex",label_ids:["chores"],schedule_type:"fixed",schedule_unit:"weekly"}],{
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

test("filter badge count is set before table updates render",()=>{
  assert.ok(source.indexOf("wrapper.filters=this.activeFilterCount()")<source.indexOf("wrapper.columns=this.tableColumns()"));
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
  assert.match(source,/Object\.entries\(TASK_TABLE_DIMENSIONS\)/);
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
