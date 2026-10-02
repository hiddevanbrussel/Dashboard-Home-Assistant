import { describe, expect, it } from "vitest";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";
import {
  addDays,
  currentOrNextActivity,
  DEFAULT_HOUR_H,
  eventsFromNowOnDay,
  gridHours,
  highlightedEventIndex,
  hourHeightForViewport,
  isSameDay,
  layoutAllDayWeek,
  layoutTimedOverlaps,
  MIN_HOUR_H,
  monthGridDays,
  startOfWeek,
  stepTime,
  timedEventFrame,
  TIMED_EVENT_GAP_PX,
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

  it("keeps hour rows tall enough for readable events", () => {
    expect(hourHeightForViewport(0)).toBe(DEFAULT_HOUR_H);
    expect(hourHeightForViewport(700)).toBe(70);
    expect(hourHeightForViewport(200)).toBe(MIN_HOUR_H);
  });

  it("leaves a gap between back-to-back hourly events", () => {
    const hourH = DEFAULT_HOUR_H;
    const first = timedEventFrame(new Date(2026, 8, 21, 10, 0), new Date(2026, 8, 21, 11, 0), hourH, 22);
    const second = timedEventFrame(new Date(2026, 8, 21, 11, 0), new Date(2026, 8, 21, 12, 0), hourH, 22);
    expect(second.top - (first.top + first.height)).toBe(TIMED_EVENT_GAP_PX);
    expect(first.height).toBe(hourH - TIMED_EVENT_GAP_PX);
  });

  it("places overlapping timed events in side-by-side columns", () => {
    const events: CalendarEvent[] = [
      {
        entityId: "calendar.a",
        summary: "Marieke training",
        start: "2026-09-30T09:00:00",
        end: "2026-09-30T12:00:00",
        allDay: false,
      },
      {
        entityId: "calendar.a",
        summary: "Belletje bellen",
        start: "2026-09-30T10:00:00",
        end: "2026-09-30T10:30:00",
        allDay: false,
      },
    ];
    const layout = layoutTimedOverlaps(events);
    expect(layout).toHaveLength(2);
    expect(layout.every((item) => item.columns === 2)).toBe(true);
    const columns = new Set(layout.map((item) => item.column));
    expect(columns.size).toBe(2);
    expect(layout[0].left).toBe(0);
    expect(layout[1].left).toBeCloseTo(0.5);
    expect(layout[0].width).toBeLessThan(0.5);
    expect(layout[1].width).toBeLessThan(0.5);
  });

  it("keeps non-overlapping timed events full width", () => {
    const events: CalendarEvent[] = [
      {
        entityId: "calendar.a",
        summary: "Morning",
        start: "2026-09-30T09:00:00",
        end: "2026-09-30T10:00:00",
        allDay: false,
      },
      {
        entityId: "calendar.a",
        summary: "Afternoon",
        start: "2026-09-30T11:00:00",
        end: "2026-09-30T12:00:00",
        allDay: false,
      },
    ];
    const layout = layoutTimedOverlaps(events);
    expect(layout.every((item) => item.columns === 1 && item.column === 0 && item.left === 0)).toBe(true);
  });

  it("lays out multi-day all-day events as spanning bars without per-day duplication", () => {
    const weekStart = startOfWeek(new Date(2026, 8, 28)); // Mon 28 Sep 2026
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const events: CalendarEvent[] = [
      {
        entityId: "calendar.a",
        summary: "Melanie jarig",
        start: "2026-10-01",
        end: "2026-10-02",
        allDay: true,
      },
      {
        entityId: "calendar.a",
        summary: "Optie weekendje Karin",
        start: "2026-10-02",
        end: "2026-10-05",
        allDay: true,
      },
    ];
    const { items, rowCount } = layoutAllDayWeek(events, weekDays);
    expect(rowCount).toBe(1);
    expect(items).toHaveLength(2);

    const birthday = items.find((item) => item.event.summary === "Melanie jarig")!;
    expect(birthday.startDay).toBe(3); // Thu
    expect(birthday.endDay).toBe(3);

    const weekend = items.find((item) => item.event.summary === "Optie weekendje Karin")!;
    expect(weekend.startDay).toBe(4); // Fri
    expect(weekend.endDay).toBe(6); // Sun
    expect(weekend.row).toBe(0);
    expect(birthday.row).toBe(0);
  });

  it("stacks concurrent all-day events on separate rows", () => {
    const weekStart = startOfWeek(new Date(2026, 8, 28));
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const events: CalendarEvent[] = [
      {
        entityId: "calendar.a",
        summary: "Trip A",
        start: "2026-10-01",
        end: "2026-10-03",
        allDay: true,
      },
      {
        entityId: "calendar.b",
        summary: "Trip B",
        start: "2026-10-01",
        end: "2026-10-02",
        allDay: true,
      },
    ];
    const { items, rowCount } = layoutAllDayWeek(events, weekDays);
    expect(rowCount).toBe(2);
    expect(new Set(items.map((item) => item.row)).size).toBe(2);
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

  it("drops past timed events when listing today's remaining agenda", () => {
    const now = new Date(2026, 8, 16, 18, 20);
    const events: CalendarEvent[] = [
      { entityId: "calendar.a", summary: "All day", start: "2026-09-16", end: "2026-09-17", allDay: true },
      { entityId: "calendar.a", summary: "Morning", start: "2026-09-16T07:00:00", end: "2026-09-16T08:00:00", allDay: false },
      { entityId: "calendar.a", summary: "Now", start: "2026-09-16T18:00:00", end: "2026-09-16T19:00:00", allDay: false },
      { entityId: "calendar.a", summary: "Later", start: "2026-09-16T20:00:00", end: "2026-09-16T21:00:00", allDay: false },
    ];
    expect(eventsFromNowOnDay(events, now, now).map((ev) => ev.summary)).toEqual(["All day", "Now", "Later"]);
    const tomorrow = addDays(now, 1);
    const laterEvents: CalendarEvent[] = [
      { entityId: "calendar.a", summary: "Trip", start: "2026-09-17T09:00:00", end: "2026-09-17T10:00:00", allDay: false },
    ];
    expect(eventsFromNowOnDay(laterEvents, tomorrow, now).map((ev) => ev.summary)).toEqual(["Trip"]);
  });
});
