import type { HomeAssistant, Task, TasksSnapshot } from "./types";

export const subscribeTasks = (
  hass: HomeAssistant,
  callback: (snapshot: TasksSnapshot) => void,
): Promise<() => void> =>
  hass.connection.subscribeMessage(callback, { type: "tasks/subscribe" });

export interface TaskDetails {
  name: string;
  description: string;
  active: boolean;
  icon: string;
}

export const saveTaskDetails = (
  hass: HomeAssistant,
  task: Task,
  details: TaskDetails,
): Promise<{ task: Task }> =>
  hass.connection.sendMessagePromise({
    type: "tasks/task/save",
    task_id: task.task_id,
    task_name: details.name.trim(),
    task_description: details.description.trim() || null,
    task_icon: details.icon.trim() || null,
    active: details.active,
    schedule_type: task.schedule_type,
    file_ids: [],
    deleted_attachment_ids: [],
    deleted_history_entry_ids: [],
  });
