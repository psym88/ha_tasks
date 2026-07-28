import type {
  Completion,
  HomeAssistant,
  ScheduleDay,
  ScheduleType,
  ScheduleUnit,
  Task,
  TasksDevice,
  TasksLabel,
  TasksSnapshot,
  TasksTag,
  TasksUser,
} from "./types";

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
  schedule?: ScheduleDetails;
  assignment?: AssignmentDetails;
  notification?: NotificationDetails;
  files?: FileChanges;
}

export interface AssignmentDetails {
  assigneeId: string;
  labelIds: string[];
  nfcTagId: string;
}

export interface AssignmentOptions {
  users: TasksUser[];
  labels: TasksLabel[];
  tags: TasksTag[];
}

export interface NotificationDetails {
  deviceIds: string[];
  persistent: boolean;
  critical: boolean;
  route: string;
}

export interface FileChanges {
  staged: File[];
  deletedAttachmentIds: string[];
  deletedHistoryEntryIds: string[];
}

export interface ArchiveImportReport {
  attachments_imported?: number;
  attachments_skipped?: number;
  history_entries_imported?: number;
  tasks_imported?: number;
  tasks_skipped?: string[];
}

export type BulkTaskOperation =
  | {
      action: "update";
      id: string;
      changes: Partial<Task>;
    }
  | {
      action: "complete";
      id: string;
      notes: null;
    }
  | {
      action: "delete";
      id: string;
    };

export interface RecurrenceScheduleDetails {
  type: Exclude<ScheduleType, "sensor">;
  unit: ScheduleUnit;
  interval: number;
  weekdays: number[];
  day: ScheduleDay;
  month: number;
  time: string;
}

export interface ProblemScheduleDetails {
  type: "sensor";
  problemSensor: string;
}

export type ScheduleDetails =
  | RecurrenceScheduleDetails
  | ProblemScheduleDetails;

const schedulePayload = (
  schedule: ScheduleDetails,
): Record<string, unknown> => {
  if (schedule.type === "sensor") {
    return {
      type: schedule.type,
      entity_id: schedule.problemSensor.trim(),
    };
  }
  const payload: Record<string, unknown> = {
    type: schedule.type,
    unit: schedule.unit,
    interval: schedule.interval,
  };
  if (schedule.type === "fixed") {
    payload.time = schedule.time;
    if (schedule.unit === "weekly") {
      payload.weekdays = schedule.weekdays;
    } else if (schedule.unit === "monthly") {
      payload.day = schedule.day;
    } else if (schedule.unit === "yearly") {
      payload.day = schedule.day;
      payload.month = schedule.month;
    }
  }
  return payload;
};

const uploadFile = async (
  hass: HomeAssistant,
  file: File,
): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  const response = await hass.fetchWithAuth("/api/tasks/upload", {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    throw new Error(`File upload failed (${response.status})`);
  }
  return (await response.json() as { file_id: string }).file_id;
};

const responseError = async (response: Response): Promise<Error> => {
  const result = await response.json().catch(() => ({})) as {
    code?: string;
  };
  return new Error(result.code || `HTTP ${response.status}`);
};

export const exportTasksArchive = async (
  hass: HomeAssistant,
): Promise<void> => {
  const response = await hass.fetchWithAuth("/api/tasks/archive");
  if (!response.ok) {
    throw await responseError(response);
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = `tasks-${new Date().toISOString().slice(0, 10)}.zip`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const importTasksArchive = async (
  hass: HomeAssistant,
  file: File,
): Promise<ArchiveImportReport> => {
  const response = await hass.fetchWithAuth("/api/tasks/archive", {
    method: "POST",
    headers: { "Content-Type": "application/zip" },
    body: file,
  });
  if (!response.ok) {
    throw await responseError(response);
  }
  return response.json();
};

export const saveTaskDetails = async (
  hass: HomeAssistant,
  task: Task | undefined,
  details: TaskDetails,
): Promise<{ task: Task }> => {
  const fileIds = await Promise.all(
    (details.files?.staged || []).map((file) => uploadFile(hass, file)),
  );
  return hass.connection.sendMessagePromise({
    type: "tasks/task/save",
    ...(task ? { task_id: task.id } : {}),
    name: details.name.trim(),
    description: details.description.trim() || null,
    icon: details.icon.trim() || null,
    active: details.active,
    ...(details.schedule
      ? { schedule: schedulePayload(details.schedule) }
      : task
        ? { schedule: task.schedule }
        : {}),
    ...(details.assignment
      ? {
          assignee_id: details.assignment.assigneeId || null,
          label_ids: details.assignment.labelIds,
          nfc_tag_id: details.assignment.nfcTagId || null,
        }
      : {}),
    ...(details.notification
      ? {
          notification: {
            device_ids: details.notification.deviceIds,
            persistent: details.notification.persistent,
            critical: details.notification.critical,
            route: details.notification.route.trim() || null,
          },
        }
      : {}),
    file_ids: fileIds,
    deleted_attachment_ids: details.files?.deletedAttachmentIds || [],
    deleted_history_entry_ids: details.files?.deletedHistoryEntryIds || [],
  });
};

export const loadAssignmentOptions = async (
  hass: HomeAssistant,
): Promise<AssignmentOptions> => {
  const [tasks, tags, labels] = await Promise.all([
    hass.connection.sendMessagePromise<{ users?: TasksUser[] }>({
      type: "tasks/list",
    }),
    hass.connection
      .sendMessagePromise<TasksTag[]>({ type: "tag/list" })
      .catch(() => []),
    hass.connection
      .sendMessagePromise<TasksLabel[]>({
        type: "config/label_registry/list",
      })
      .catch(() => []),
  ]);
  return {
    users: tasks.users || [],
    tags: Array.isArray(tags) ? tags : [],
    labels: Array.isArray(labels) ? labels : [],
  };
};

export const loadNotificationDevices = async (
  hass: HomeAssistant,
): Promise<TasksDevice[]> => {
  const devices = await hass.connection.sendMessagePromise<TasksDevice[]>({
    type: "config/device_registry/list",
  });
  return (Array.isArray(devices) ? devices : []).filter((device) =>
    device.identifiers?.some((identifier) => identifier?.[0] === "mobile_app"),
  );
};

export const mutateTasks = (
  hass: HomeAssistant,
  operations: BulkTaskOperation[],
): Promise<unknown> =>
  hass.connection.sendMessagePromise({
    type: "tasks/task/bulk",
    operations,
  });

export const loadTaskHistory = (
  hass: HomeAssistant,
  taskId: string,
): Promise<{ history: Completion[] }> =>
  hass.connection.sendMessagePromise({
    type: "tasks/history/list",
    task_id: taskId,
  });

export const loadAttachmentUrls = (
  hass: HomeAssistant,
  taskId: string,
): Promise<{ signed_files: Record<string, string> }> =>
  hass.connection.sendMessagePromise({
    type: "tasks/attachment/urls",
    task_id: taskId,
  });

export const completeTask = (
  hass: HomeAssistant,
  taskId: string,
  notes: string,
): Promise<{ task: Task }> =>
  hass.connection.sendMessagePromise({
    type: "tasks/task/complete",
    task_id: taskId,
    notes: notes.trim() || null,
  });

export const deleteTask = (
  hass: HomeAssistant,
  taskId: string,
): Promise<void> =>
  hass.connection.sendMessagePromise({
    type: "tasks/task/delete",
    task_id: taskId,
  });

export const setTaskActive = (
  hass: HomeAssistant,
  taskId: string,
  active: boolean,
): Promise<Task> =>
  hass.connection.sendMessagePromise({
    type: "tasks/task/update",
    task_id: taskId,
    active,
  });

export const previewTaskSchedule = (
  hass: HomeAssistant,
  schedule: RecurrenceScheduleDetails,
  taskDue?: string,
): Promise<{ dues: string[] }> =>
  hass.connection.sendMessagePromise({
    type: "tasks/task/preview_next_due",
    schedule: schedulePayload(schedule),
    ...(taskDue ? { due: taskDue } : {}),
  });
