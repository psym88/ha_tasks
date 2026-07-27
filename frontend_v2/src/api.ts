import type { HomeAssistant, TasksSnapshot } from "./types";

export const subscribeTasks = (
  hass: HomeAssistant,
  callback: (snapshot: TasksSnapshot) => void,
): Promise<() => void> =>
  hass.connection.subscribeMessage(callback, { type: "tasks/subscribe" });
