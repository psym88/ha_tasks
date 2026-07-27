export interface Task {
  task_id: string;
  task_name: string;
  task_description?: string;
  active?: boolean;
  due?: string | null;
  schedule_type?: string;
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
}

export interface HomeAssistant {
  connection: HomeAssistantConnection;
}
