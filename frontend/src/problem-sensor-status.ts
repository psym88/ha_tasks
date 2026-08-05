import type { HomeAssistant, SensorTaskSchedule } from "./types";

export type ProblemSensorStatus =
  | "available"
  | "missing"
  | "unavailable"
  | "unknown";

export const problemSensorStatus = (
  hass: HomeAssistant | undefined,
  schedule: SensorTaskSchedule,
): ProblemSensorStatus => {
  const state = hass?.states?.[schedule.entity_id];
  if (!state) {
    return "missing";
  }
  return state.state === "unavailable" || state.state === "unknown"
    ? state.state
    : "available";
};
