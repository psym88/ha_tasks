export type ScheduleType = "fixed" | "sliding" | "sensor";
export type ScheduleUnit = "daily" | "weekly" | "monthly" | "yearly";
export type ScheduleDay = number | "last";

export interface Task {
  task_id: string;
  task_name: string;
  task_icon?: string | null;
  task_description?: string | null;
  active: boolean;
  task_due?: string | null;
  schedule_type: ScheduleType;
  schedule_unit?: ScheduleUnit | null;
  schedule_interval?: number | null;
  schedule_weekdays?: number[];
  schedule_day?: ScheduleDay | null;
  schedule_month?: number | null;
  schedule_time?: string | null;
  problem_sensor?: string | null;
}

export interface Attachment {
  attachment_id: string;
  task_id: string;
}

export interface TasksChange {
  action: string;
  resource_type: string;
  resource_id?: string | null;
}

export interface TasksSnapshot {
  type: "snapshot";
  revision: number;
  tasks: Task[];
  attachments: Attachment[];
  now: string;
  change?: TasksChange;
}

type Unsubscribe = () => void;

export interface HomeAssistantConnection {
  subscribeMessage<T>(
    callback: (message: T) => void,
    message: { type: string },
  ): Promise<Unsubscribe>;
  sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
}

export interface HomeAssistant {
  connection: HomeAssistantConnection;
  config?: {
    time_zone?: string;
  };
  locale?: {
    language?: string;
  };
  states?: Record<
    string,
    {
      entity_id: string;
      attributes?: {
        friendly_name?: string;
      };
    }
  >;
}
