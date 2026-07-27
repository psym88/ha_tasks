import type {
  HomeAssistant,
  ScheduleDay,
  ScheduleType,
  ScheduleUnit,
  Task,
  TasksSnapshot,
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
    file_ids: [],
    deleted_attachment_ids: [],
    deleted_history_entry_ids: [],
  });

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
