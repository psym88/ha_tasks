export const NO_DUE_TIMESTAMP = Number.MAX_SAFE_INTEGER;

export function dueTimestamp(value) {
  const timestamp=Date.parse(value);
  return Number.isNaN(timestamp)?NO_DUE_TIMESTAMP:timestamp;
}

export function deviceName(device) {
  return device.name_by_user||device.name||[device.manufacturer,device.model].filter(Boolean).join(" ")||device.id;
}

export function createTaskTableRows(tasks,{users=[],tags=[],labels=[],devices=[],attachments=[],translate,locale}={}) {
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
    const assignee={id:assigneeId,label:userNames.get(assigneeId)||translate("task.unassigned")};
    const tagId=tagNames.has(task.nfc_tag_id)?task.nfc_tag_id:null;
    const taskLabels=(task.label_ids||[]).filter(id=>labelRecords.has(id)).map(id=>({id,label:labelRecords.get(id).name})).sort((a,b)=>a.label.localeCompare(b.label,locale));
    const taskDevices=[...new Set((task.notification_target?.device_id||[]).filter(id=>deviceNames.has(id)))].map(id=>({id,label:deviceNames.get(id)}));
    const notifications=[...(task.notification_persistent?[{id:"panel",label:translate("task.notification_panel_target")}]:[]),...taskDevices].sort((a,b)=>a.label.localeCompare(b.label,locale));
    const recurrence={id:recurrenceId,label:translate(`task.${recurrenceId}`)};
    const rhythm=task.schedule_type==="sensor"?{id:"problem",label:"–"}:{id:scheduleUnit,label:translate(`task.${scheduleUnit}`)};
    return {
      id:task.task_id,
      task,
      icon:task.task_icon||"mdi:clipboard-check-outline",
      name:task.task_name||"",
      due_ts:dueTimestamp(task.active===false?null:task.task_due),
      recurrence:recurrence.label,
      recurrence_id:recurrence.id,
      rhythm:rhythm.label,
      rhythm_id:rhythm.id,
      assignee:assignee.label,
      assignee_id:assignee.id||"__unassigned__",
      labels:taskLabels.map(item=>item.label).join(", ")||translate("task.no_labels"),
      label_ids:taskLabels.map(item=>item.id),
      notifications:notifications.map(item=>item.label).join(", ")||translate("task.no_notification_targets"),
      notification_ids:notifications.map(item=>item.id),
      nfc_tag:tagNames.get(tagId)||translate("task.no_nfc_tag"),
      files:fileCounts.get(task.task_id)||0,
      filter_options:{
        assignee:[assignee],
        labels:taskLabels,
        notifications,
        recurrence:[recurrence],
        rhythm:task.schedule_type==="sensor"?[]:[rhythm],
      },
    };
  });
}
