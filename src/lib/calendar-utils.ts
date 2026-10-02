import type { CalendarEvent } from "@/app/api/ha/calendar/route";

export function localeOf(language: string): string {
  return language === "nl" ? "nl-NL" : "en-US";
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function monthGridDays(date: Date): Date[] {
  const first = startOfMonth(date);
  const startDow = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const gridStart = addDays(first, -startDow);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

/** Drop the unused 6th week so the month grid can fill the screen with larger cells. */
export function visibleMonthDays(date: Date): Date[] {
  const days = monthGridDays(date);
  const lastWeek = days.slice(35);
  const lastWeekOutside = lastWeek.every((d) => d.getMonth() !== date.getMonth());
  return lastWeekOutside ? days.slice(0, 35) : days;
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatTime(date: Date, locale: string): string {
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

export function weekDayNames(locale: string, style: "short" | "long"): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: style })
  );
}

export function monthNames(locale: string): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i, 1).toLocaleDateString(locale, { month: "long" })
  );
}

export function eventStart(ev: CalendarEvent): Date {
  return ev.allDay ? new Date(`${ev.start}T00:00:00`) : new Date(ev.start);
}

export function eventEnd(ev: CalendarEvent): Date {
  return ev.allDay ? new Date(`${ev.end}T00:00:00`) : new Date(ev.end);
}

export function minutesInDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function timedOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events
    .filter((ev) => !ev.allDay && isSameDay(eventStart(ev), day))
    .sort((a, b) => eventStart(a).getTime() - eventStart(b).getTime());
}

export function allDayOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((ev) => {
    if (!ev.allDay) return false;
    return day >= eventStart(ev) && day < eventEnd(ev);
  });
}

export function eventsOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return [...allDayOnDay(events, day), ...timedOnDay(events, day)];
}

/** Today's remaining agenda: all-day plus timed events that have not ended yet. */
export function eventsFromNowOnDay(events: CalendarEvent[], day: Date, now = new Date()): CalendarEvent[] {
  const dayEvents = eventsOnDay(events, day);
  if (!isSameDay(day, now)) return dayEvents;
  const nowMs = now.getTime();
  return dayEvents.filter((ev) => ev.allDay || eventEnd(ev).getTime() > nowMs);
}

/** Index of the event to emphasize in a day list: current/next timed event today, otherwise the first. */
export function highlightedEventIndex(events: CalendarEvent[], day: Date, now = new Date()): number {
  const dayEvents = eventsOnDay(events, day);
  if (dayEvents.length === 0) return -1;
  if (!isSameDay(day, now)) return 0;

  const timed = dayEvents.map((ev, i) => ({ ev, i })).filter(({ ev }) => !ev.allDay);
  if (timed.length === 0) return 0;

  const nowMs = now.getTime();
  const current = timed.find(({ ev }) => eventStart(ev).getTime() <= nowMs && eventEnd(ev).getTime() > nowMs);
  if (current) return current.i;
  const next = timed.find(({ ev }) => eventStart(ev).getTime() > nowMs);
  if (next) return next.i;
  return timed[timed.length - 1].i;
}

export type ActivityStatus = "current" | "next" | "done";

export type CurrentActivity = {
  event: CalendarEvent;
  status: ActivityStatus;
  index: number;
};

/** Current, upcoming, or last event on a day — used for the dashboard “now” strip. */
export function currentOrNextActivity(events: CalendarEvent[], day: Date, now = new Date()): CurrentActivity | null {
  const dayEvents = eventsOnDay(events, day);
  const index = highlightedEventIndex(events, day, now);
  if (index < 0) return null;
  const event = dayEvents[index];
  if (!isSameDay(day, now)) return { event, status: "next", index };

  const nowMs = now.getTime();
  if (event.allDay) return { event, status: "current", index };
  if (eventStart(event).getTime() <= nowMs && eventEnd(event).getTime() > nowMs) {
    return { event, status: "current", index };
  }
  if (eventStart(event).getTime() > nowMs) return { event, status: "next", index };
  return { event, status: "done", index };
}

export function durationMinutes(ev: CalendarEvent): number {
  if (ev.allDay) return 24 * 60;
  return Math.max(0, Math.round((eventEnd(ev).getTime() - eventStart(ev).getTime()) / 60_000));
}

export function durationLabel(mins: number, t: (key: string) => string): string {
  if (mins < 60) return t("calendar.durationMin").replace("{n}", String(mins));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return t("calendar.durationHour").replace("{n}", String(h));
  return t("calendar.durationHourMin").replace("{h}", String(h)).replace("{m}", String(m));
}

export function looksLikeMeet(value?: string): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value.trim()) || /meet\.google|zoom\.|teams\.microsoft/i.test(value);
}

export function stepTime(value: string, deltaMinutes: number): string {
  const [h, m] = value.split(":").map(Number);
  const total = (((h * 60 + m + deltaMinutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Default hour row height, used before the time grid has been measured. */
export const DEFAULT_HOUR_H = 72;
/** Floor so timed events stay readable instead of packing a full workday into view. */
export const MIN_HOUR_H = 64;
/** Hour the week/day time grid starts on (06:00). */
export const CALENDAR_FOCUS_HOUR = 6;
/** Hours shown without scrolling; extra hours remain reachable by scroll. */
export const VISIBLE_DAY_HOURS = 10;

/** Hours shown in the week/day grid (06:00–24:00). */
export function gridHours(focusHour = CALENDAR_FOCUS_HOUR): number[] {
  return Array.from({ length: 24 - focusHour }, (_, i) => i + focusHour);
}

/** Position in hours from the top of the visible grid. */
export function hoursFromFocus(absoluteHours: number, focusHour = CALENDAR_FOCUS_HOUR): number {
  return absoluteHours - focusHour;
}

/** Pixel gap so back-to-back hourly events do not sit on the same edge. */
export const TIMED_EVENT_GAP_PX = 8;

/** Absolute top/height for a timed event on the week/day time grid. */
export function timedEventFrame(
  start: Date,
  end: Date,
  hourH: number,
  minHeight: number,
  gap = TIMED_EVENT_GAP_PX
): { top: number; height: number } {
  const top = hoursFromFocus(minutesInDay(start) / 60) * hourH;
  const rawHeight = ((end.getTime() - start.getTime()) / 60_000 / 60) * hourH;
  return { top, height: Math.max(rawHeight - gap, minHeight) };
}

/** Horizontal placement for overlapping timed events within a day column. */
export type TimedOverlapLayout = {
  event: CalendarEvent;
  /** 0-based column within the overlap cluster */
  column: number;
  /** Total columns in the overlap cluster */
  columns: number;
  /** Left edge as a 0–1 fraction of the day column */
  left: number;
  /** Width as a 0–1 fraction of the day column */
  width: number;
};

/**
 * Classic calendar overlap layout: concurrent timed events become side-by-side
 * columns so titles stay readable instead of stacking on top of each other.
 */
export function layoutTimedOverlaps(events: CalendarEvent[]): TimedOverlapLayout[] {
  type Node = {
    event: CalendarEvent;
    start: number;
    end: number;
    column: number;
    columns: number;
  };

  const nodes: Node[] = events.map((event) => ({
    event,
    start: eventStart(event).getTime(),
    end: eventEnd(event).getTime(),
    column: 0,
    columns: 1,
  }));

  nodes.sort((a, b) => a.start - b.start || b.end - a.end || a.end - b.end);

  const active: Node[] = [];
  for (const node of nodes) {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= node.start) active.splice(i, 1);
    }
    const used = new Set(active.map((a) => a.column));
    let column = 0;
    while (used.has(column)) column++;
    node.column = column;
    active.push(node);
  }

  const parent = nodes.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (i: number, j: number) => {
    const a = find(i);
    const b = find(j);
    if (a !== b) parent[a] = b;
  };

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].start < nodes[j].end && nodes[j].start < nodes[i].end) union(i, j);
    }
  }

  const groupColumns = new Map<number, number>();
  for (let i = 0; i < nodes.length; i++) {
    const root = find(i);
    groupColumns.set(root, Math.max(groupColumns.get(root) ?? 1, nodes[i].column + 1));
  }
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].columns = groupColumns.get(find(i)) ?? 1;
  }

  /** Small fractional gap between side-by-side columns. */
  const colGap = 0.02;
  return nodes.map((node) => {
    const slot = 1 / node.columns;
    const width = Math.max(slot - colGap, slot * 0.85);
    return {
      event: node.event,
      column: node.column,
      columns: node.columns,
      left: node.column * slot,
      width,
    };
  });
}

/** Multi-day / all-day bar placement across equal-width week columns. */
export type AllDayWeekLayoutItem = {
  event: CalendarEvent;
  /** Inclusive day index within the week (0–6) */
  startDay: number;
  /** Inclusive day index within the week (0–6) */
  endDay: number;
  /** Vertical stack lane */
  row: number;
};

export type AllDayWeekLayout = {
  items: AllDayWeekLayoutItem[];
  rowCount: number;
};

/** Pixel height of one all-day lane row (bar + gap). */
export const ALL_DAY_ROW_H = 22;

/**
 * Lay out all-day (and multi-day) events into stacked spanning bars for a week.
 * Uses equal day indices so the time-grid columns can stay `minmax(0, 1fr)`.
 */
export function layoutAllDayWeek(events: CalendarEvent[], weekDays: Date[]): AllDayWeekLayout {
  if (weekDays.length === 0) return { items: [], rowCount: 0 };

  const seen = new Set<string>();
  const spans: Omit<AllDayWeekLayoutItem, "row">[] = [];

  for (const event of events) {
    if (!event.allDay) continue;
    const key = `${event.entityId}|${event.start}|${event.end}|${event.summary}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const start = eventStart(event);
    const end = eventEnd(event);
    let startDay = -1;
    let endDay = -1;
    for (let i = 0; i < weekDays.length; i++) {
      const day = weekDays[i];
      if (day >= start && day < end) {
        if (startDay < 0) startDay = i;
        endDay = i;
      }
    }
    if (startDay < 0 || endDay < 0) continue;
    spans.push({ event, startDay, endDay });
  }

  // Prefer earlier start, then longer span
  spans.sort((a, b) => {
    if (a.startDay !== b.startDay) return a.startDay - b.startDay;
    return b.endDay - b.startDay - (a.endDay - a.startDay);
  });

  const rowLastDay: number[] = [];
  const items: AllDayWeekLayoutItem[] = spans.map((span) => {
    let row = rowLastDay.findIndex((last) => last < span.startDay);
    if (row < 0) {
      row = rowLastDay.length;
      rowLastDay.push(span.endDay);
    } else {
      rowLastDay[row] = span.endDay;
    }
    return { ...span, row };
  });

  return { items, rowCount: rowLastDay.length };
}

/** Scale hour rows so ~16 hours fit in the visible time-grid viewport. */
export function hourHeightForViewport(clientHeight: number): number {
  if (clientHeight <= 0) return DEFAULT_HOUR_H;
  return Math.max(MIN_HOUR_H, Math.round(clientHeight / VISIBLE_DAY_HOURS));
}
