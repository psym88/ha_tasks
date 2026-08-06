export type ScheduleType = "fixed" | "sliding" | "sensor";
export type ScheduleUnit = "daily" | "weekly" | "monthly" | "yearly";
export type ScheduleDay = number | "last";

export interface FixedTaskSchedule {
  type: "fixed";
  unit: ScheduleUnit;
  interval: number;
  weekdays?: number[];
  day?: ScheduleDay | null;
  month?: number | null;
  time?: string | null;
}

export interface SlidingTaskSchedule {
  type: "sliding";
  unit: ScheduleUnit;
  interval: number;
}

export interface SensorTaskSchedule {
  type: "sensor";
  entity_id: string;
}

export type TaskSchedule =
  | FixedTaskSchedule
  | SlidingTaskSchedule
  | SensorTaskSchedule;

export interface Task {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  active: boolean;
  assignee_id?: string | null;
  label_ids?: string[];
  nfc_tag_id?: string | null;
  notification: {
    device_ids: string[];
    persistent: boolean;
    critical: boolean;
    route?: string | null;
  };
  due?: string | null;
  schedule: TaskSchedule;
  completions: Completion[];
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  uploaded_at: string;
}

export interface Completion {
  id: string;
  completed_at: string;
  user_id?: string | null;
  user_name: string;
  notes?: string | null;
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
  now: string;
  change?: TasksChange;
}

export interface TasksUser {
  id: string;
  name: string;
}

export interface TasksTag {
  id: string;
  name: string;
}

export interface TasksLabel {
  label_id: string;
  name: string;
}

export interface TasksDevice {
  id: string;
  name_by_user?: string | null;
  name?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  identifiers?: Array<[string, string]>;
}

type Unsubscribe = () => void;

export interface HomeAssistantConnection {
  subscribeMessage<T>(
    callback: (message: T) => void,
    message: { type: string },
  ): Promise<Unsubscribe>;
  sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
}

export interface HomeAssistantState {
  entity_id: string;
  state: string;
  attributes?: {
    friendly_name?: string;
    user_id?: string;
    device_class?: string;
  };
}

export interface HomeAssistant {
  connection: HomeAssistantConnection;
  user?: {
    id: string;
  };
  fetchWithAuth(
    path: string,
    init?: RequestInit,
  ): Promise<Response>;
  config?: {
    time_zone?: string;
  };
  locale?: {
    language?: string;
  };
  states?: Record<string, HomeAssistantState>;
  formatEntityState(stateObj: HomeAssistantState, state?: string): string;
}
