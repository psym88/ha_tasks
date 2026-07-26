export const NO_DUE_TIMESTAMP = Number.MAX_SAFE_INTEGER;
export const INITIAL_TASK_SORTING = {column:"due_ts",direction:"asc"};
export const DEFAULT_TASK_COLUMN_ORDER = ["icon","name","due_ts","assignee","nfc_tag","files","labels","notifications","recurrence","rhythm","actions"];
export const DEFAULT_HIDDEN_TASK_COLUMNS = ["labels","notifications","recurrence","rhythm"];
export const TASK_TABLE_LOCAL_STORAGE_KEY = "tasks-table-state-v1";
export const TASK_TABLE_SESSION_STORAGE_KEY = "tasks-table-session-v1";

function storedValue(storage,key,fallback) {
  try {
    const value=storage?.getItem(key);
    return value===null||value===undefined?fallback:JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizedColumnOrder(value) {
  const order=Array.isArray(value)?value.filter(column=>DEFAULT_TASK_COLUMN_ORDER.includes(column)):[...DEFAULT_TASK_COLUMN_ORDER];
  for(const column of DEFAULT_TASK_COLUMN_ORDER)if(!order.includes(column)){
    const next=DEFAULT_TASK_COLUMN_ORDER.slice(DEFAULT_TASK_COLUMN_ORDER.indexOf(column)+1).find(candidate=>order.includes(candidate));
    const index=next?order.indexOf(next):order.length;
    order.splice(index,0,column);
  }
  return order;
}

export function loadTaskTableView(localStorage,sessionStorage) {
  const local=storedValue(localStorage,TASK_TABLE_LOCAL_STORAGE_KEY,{});
  const session=storedValue(sessionStorage,TASK_TABLE_SESSION_STORAGE_KEY,{});
  const filters=session.filters;
  return {
    search:String(session.search||""),
    filters:filters&&typeof filters==="object"&&!Array.isArray(filters)?filters:{},
    sorting:local.sorting||INITIAL_TASK_SORTING,
    grouping:local.grouping,
    collapsed:local.collapsed,
    columnOrder:normalizedColumnOrder(local.columnOrder),
    hiddenColumns:Array.isArray(local.hiddenColumns)?local.hiddenColumns:[...DEFAULT_HIDDEN_TASK_COLUMNS],
  };
}

export function storeTaskTableView(localStorage,sessionStorage,view) {
  try {
    localStorage?.setItem(TASK_TABLE_LOCAL_STORAGE_KEY,JSON.stringify({
      sorting:view.sorting,
      grouping:view.grouping,
      collapsed:view.collapsed,
      columnOrder:view.columnOrder,
      hiddenColumns:view.hiddenColumns,
    }));
  } catch {
    // Safari private browsing and locked-down WebViews can reject storage.
  }
  try {
    sessionStorage?.setItem(TASK_TABLE_SESSION_STORAGE_KEY,JSON.stringify({
      search:view.search||"",
      filters:view.filters||{},
    }));
  } catch {
    // Safari private browsing and locked-down WebViews can reject storage.
  }
}

export function dueTimestamp(value) {
  const timestamp=Date.parse(value);
  return Number.isNaN(timestamp)?NO_DUE_TIMESTAMP:timestamp;
}

export function deviceName(device) {
  return device.name_by_user||device.name||[device.manufacturer,device.model].filter(Boolean).join(" ")||device.id;
}

export function createTaskTableModel(tasks,{users=[],tags=[],labels=[],devices=[],attachments=[],translate,locale}={}) {
  const userNames=new Map(users.map(user=>[user.id,user.name]));
  const tagNames=new Map(tags.map(tag=>[tag.id,tag.name]));
  const labelRecords=new Map(labels.map(label=>[label.label_id,label]));
  const deviceNames=new Map(devices.map(device=>[device.id,deviceName(device)]));
  const fileCounts=new Map();
  for(const file of attachments)fileCounts.set(file.task_id,(fileCounts.get(file.task_id)||0)+1);
  return tasks.map(task=>{
    const scheduleUnit=["daily","weekly","monthly","yearly"].includes(task.schedule_unit)?task.schedule_unit:"monthly";
    const recurrenceId=task.schedule_type==="fixed"?"fixed":task.schedule_type==="sensor"?"problem":"sliding";
    const assigneeId=userNames.has(task.assignee_id)?task.assignee_id:null;
    const tagId=tagNames.has(task.nfc_tag_id)?task.nfc_tag_id:null;
    const taskLabels=(task.label_ids||[]).filter(id=>labelRecords.has(id)).map(id=>({id,label:labelRecords.get(id).name}));
    const taskDevices=[...new Set((task.notification_target?.device_id||[]).filter(id=>deviceNames.has(id)))].map(id=>({id,label:deviceNames.get(id)}));
    const notifications=[...(task.notification_persistent?[{id:"panel",label:translate("task.notification_panel_target")}]:[]),...taskDevices].sort((a,b)=>a.label.localeCompare(b.label,locale));
    return {
      id:task.task_id,
      source:task,
      icon:task.task_icon||"mdi:clipboard-check-outline",
      name:task.task_name||"",
      due:{value:task.task_due||null,timestamp:dueTimestamp(task.active===false?null:task.task_due)},
      assignee:{id:assigneeId,label:userNames.get(assigneeId)||translate("task.unassigned")},
      labels:taskLabels.sort((a,b)=>a.label.localeCompare(b.label,locale)),
      notifications,
      recurrence:{id:recurrenceId,label:translate(`task.${recurrenceId}`)},
      rhythm:task.schedule_type==="sensor"?{id:"none",label:"–"}:{id:scheduleUnit,label:translate(`task.${scheduleUnit}`)},
      nfcTag:{id:tagId,label:tagNames.get(tagId)||translate("task.no_nfc_tag")},
      fileCount:fileCounts.get(task.task_id)||0,
    };
  });
}

export function toHaTaskTableRows(models,{translate}={}) {
  return models.map(model=>({
    id:model.id,
    task:model.source,
    icon:model.icon,
    name:model.name,
    due_ts:model.due.timestamp,
    recurrence:model.recurrence.label,
    recurrence_id:model.recurrence.id,
    rhythm:model.rhythm.label,
    rhythm_id:model.rhythm.id,
    assignee:model.assignee.label,
    assignee_id:model.assignee.id||"__unassigned__",
    labels:model.labels.map(item=>item.label).join(", ")||translate("task.no_labels"),
    label_ids:model.labels.map(item=>item.id),
    notifications:model.notifications.map(item=>item.label).join(", ")||translate("task.no_notification_targets"),
    notification_ids:model.notifications.map(item=>item.id),
    nfc_tag:model.nfcTag.label,
    files:model.fileCount,
    filter_options:{
      assignee:[model.assignee],
      labels:model.labels,
      notifications:model.notifications,
      recurrence:[model.recurrence],
      rhythm:[model.rhythm],
    },
  }));
}
