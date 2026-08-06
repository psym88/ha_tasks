import { t, timedScheduleText } from "./localize";
import type { ScheduleDay, ScheduleType, ScheduleUnit } from "./types";

export interface ScheduleTextDetails {
  type: ScheduleType;
  unit?: ScheduleUnit;
  interval?: number;
  weekdays?: number[] | null;
  day?: ScheduleDay | null;
  month?: number | null;
  time?: string | null;
  sensorName?: string;
}

const periodKeys: Record<ScheduleUnit, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
  yearly: "year",
};

export const scheduleText = (
  schedule: ScheduleTextDetails,
  language?: string,
): string => {
  if (schedule.type === "sensor") {
    const description = t("schedule.problem_sensor_description");
    return schedule.sensorName
      ? `${description} (${schedule.sensorName})`
      : description;
  }

  const unit = schedule.unit || "daily";
  const interval = Math.max(1, Number(schedule.interval) || 1);
  const singular = t(`schedule.period_${periodKeys[unit]}`);
  const plural = t(`schedule.period_${periodKeys[unit]}s`);
  if (schedule.type === "sliding") {
    return t(
      interval === 1
        ? "schedule.after_completion_one"
        : "schedule.after_completion_many",
      {
        schedule_interval: interval,
        period: interval === 1 ? singular : plural,
      },
    );
  }

  const time = schedule.time || "09:00";
  if (unit === "weekly") {
    const names = Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(language, {
        weekday: "long",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(2024, 0, index + 1))),
    );
    const weekdays = (schedule.weekdays || [])
      .map((day) => names[day])
      .filter(Boolean);
    const joined = weekdays.length > 1
      ? `${weekdays.slice(0, -1).join(", ")} ${t("schedule.and")} ${weekdays.at(-1)}`
      : weekdays[0] || "";
    return timedScheduleText(t(
      interval === 1 ? "schedule.weekly_one" : "schedule.weekly_many",
      {
        schedule_interval: interval,
        days: joined ? ` ${t("schedule.on_days", { days: joined })}` : "",
      },
    ), time);
  }
  if (unit === "monthly") {
    const day = schedule.day === "last"
      ? t("schedule.on_last_day")
      : t("schedule.on_day_number", { day: Number(schedule.day || 1) });
    return timedScheduleText(t(
      interval === 1 ? "schedule.monthly_one" : "schedule.monthly_many",
      { schedule_interval: interval, day },
    ), time);
  }
  if (unit === "yearly") {
    const month = new Intl.DateTimeFormat(language, {
      month: "long",
    }).format(new Date(2024, (schedule.month || 1) - 1, 1));
    const day = schedule.day === "last"
      ? t("schedule.on_last_day_of_month", { month })
      : t("schedule.on_day_of_month", {
          day: Number(schedule.day || 1),
          month,
        });
    return timedScheduleText(t(
      interval === 1 ? "schedule.yearly_one" : "schedule.yearly_many",
      { schedule_interval: interval, day },
    ), time);
  }
  return timedScheduleText(t(
    interval === 1 ? "schedule.fixed_one" : "schedule.fixed_many",
    {
      schedule_interval: interval,
      period: interval === 1 ? singular : plural,
    },
  ), time);
};
