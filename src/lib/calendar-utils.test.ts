import { describe, expect, it } from "vitest";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";
import {
  addDays,
  currentOrNextActivity,
  DEFAULT_HOUR_H,
  gridHours,
  highlightedEventIndex,
  hourHeightForViewport,
  isSameDay,
  MIN_HOUR_H,
  monthGridDays,
  startOfWeek,
  stepTime,
  toDateKey,
  visibleMonthDays,
} from "./calendar-utils";

describe("calendar-utils", () => {
  it("starts the week on Monday", () => {
    const wednesday = new Date(2025, 8, 10); // 10 Sep 2025 is Wednesday
    const start = startOfWeek(wednesday);
    expect(start.getDay()).toBe(1);
    expect(toDateKey(start)).toBe("2025-09-08");
  });

  it("builds a 6-week month grid starting Monday", () => {
    const september = monthGridDays(new Date(2025, 8, 1)); // 1 Sep 2025 is Monday
    expect(september).toHaveLength(42);
    expect(september[0].getDay()).toBe(1);
    expect(toDateKey(september[0])).toBe("2025-09-01");

    const october = monthGridDays(new Date(2025, 9, 1)); // 1 Oct 2025 is Wednesday
    expect(october[0].getDay()).toBe(1);
    expect(toDateKey(october[0])).toBe("2025-09-29");
  });

  it("hides an unused sixth week so the month can fill the screen", () => {
    const september = visibleMonthDays(new Date(2025, 8, 1));
    expect(september).toHaveLength(35);

    const march = visibleMonthDays(new Date(2026, 2, 1)); // 1 Mar 2026 is Sunday → 6 weeks
    expect(march).toHaveLength(42);
  });

  it("compares calendar days without time", () => {
    const a = new Date(2025, 8, 8, 9, 30);
    const b = new Date(2025, 8, 8, 18, 0);
    expect(isSameDay(a, b)).toBe(true);
    expect(isSameDay(a, addDays(b, 1))).toBe(false);
  });

  it("steps times in 15-minute wraps", () => {
    expect(stepTime("00:00", -15)).toBe("23:45");
    expect(stepTime("23:45", 15)).toBe("00:00");
    expect(stepTime("11:30", 90)).toBe("13:00");
  });

  it("starts the time grid at 06:00", () => {
    expect(gridHours()[0]).toBe(6);
    expect(gridHours()).toHaveLength(18);
  });

  it("scales hour rows to fit a workday in the viewport", () => {
    expect(hourHeightForViewport(0)).toBe(DEFAULT_HOUR_H);
    expect(hourHeightForViewport(700)).toBe(44);
    expect(hourHeightForViewport(200)).toBe(MIN_HOUR_H);
  });

  it("highlights the current or next timed event on today", () => {
    const day = new Date(2026, 8, 11, 8, 30);
    const events: CalendarEvent[] = [
      { entityId: "calendar.a", summary: "All day", start: "2026-09-11", end: "2026-09-12", allDay: true },
      { entityId: "calendar.a", summary: "Morning", start: "2026-09-11T07:00:00", end: "2026-09-11T08:00:00", allDay: false },
      { entityId: "calendar.a", summary: "Now", start: "2026-09-11T08:00:00", end: "2026-09-11T09:00:00", allDay: false },
      { entityId: "calendar.a", summary: "Later", start: "2026-09-11T10:00:00", end: "2026-09-11T11:00:00", allDay: false },
    ];
    expect(highlightedEventIndex(events, day, day)).toBe(2);
    expect(highlightedEventIndex(events, addDays(day, 1), day)).toBe(-1);
    const otherDay = addDays(day, 1);
    const otherEvents: CalendarEvent[] = [
      { entityId: "calendar.a", summary: "Trip", start: "2026-09-12T12:00:00", end: "2026-09-12T13:00:00", allDay: false },
    ];
    expect(highlightedEventIndex(otherEvents, otherDay, day)).toBe(0);
  });

  it("labels the current versus next activity on today", () => {
    const now = new Date(2026, 8, 11, 8, 30);
    const events: CalendarEvent[] = [
      { entityId: "calendar.a", summary: "Now", start: "2026-09-11T08:00:00", end: "2026-09-11T09:00:00", allDay: false },
      { entityId: "calendar.a", summary: "Later", start: "2026-09-11T10:00:00", end: "2026-09-11T11:00:00", allDay: false },
    ];
    expect(currentOrNextActivity(events, now, now)?.status).toBe("current");
    expect(currentOrNextActivity(events, now, now)?.event.summary).toBe("Now");

    const morning = new Date(2026, 8, 11, 7, 0);
    expect(currentOrNextActivity(events, morning, morning)?.status).toBe("next");
    expect(currentOrNextActivity(events, morning, morning)?.event.summary).toBe("Now");

    const evening = new Date(2026, 8, 11, 18, 0);
    expect(currentOrNextActivity(events, evening, evening)?.status).toBe("done");
  });
});
