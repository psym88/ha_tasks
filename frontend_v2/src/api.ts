import type {
  HomeAssistant,
  ScheduleDay,
  ScheduleType,
  ScheduleUnit,
  Task,
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
      schedule_type: schedule.type,
      problem_sensor: schedule.problemSensor.trim(),
    };
  }
  const payload: Record<string, unknown> = {
    schedule_type: schedule.type,
    schedule_unit: schedule.unit,
    schedule_interval: schedule.interval,
  };
  if (schedule.type === "fixed") {
    payload.schedule_time = schedule.time;
    if (schedule.unit === "weekly") {
      payload.schedule_weekdays = schedule.weekdays;
    } else if (schedule.unit === "monthly") {
      payload.schedule_day = schedule.day;
    } else if (schedule.unit === "yearly") {
      payload.schedule_day = schedule.day;
      payload.schedule_month = schedule.month;
    }
  }
  return payload;
};

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
    ...(details.schedule
      ? schedulePayload(details.schedule)
      : { schedule_type: task.schedule_type }),
    ...(details.assignment
      ? {
          assignee_id: details.assignment.assigneeId || null,
          label_ids: details.assignment.labelIds,
          nfc_tag_id: details.assignment.nfcTagId || null,
        }
      : {}),
    file_ids: [],
    deleted_attachment_ids: [],
    deleted_history_entry_ids: [],
  });

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

export const previewTaskSchedule = (
  hass: HomeAssistant,
  schedule: RecurrenceScheduleDetails,
  taskDue?: string,
): Promise<{ task_dues: string[] }> =>
  hass.connection.sendMessagePromise({
    type: "tasks/task/preview_next_due",
    ...schedulePayload(schedule),
    ...(taskDue ? { task_due: taskDue } : {}),
  });
