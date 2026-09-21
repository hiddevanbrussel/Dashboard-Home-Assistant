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

/** Scale hour rows so ~16 hours fit in the visible time-grid viewport. */
export function hourHeightForViewport(clientHeight: number): number {
  if (clientHeight <= 0) return DEFAULT_HOUR_H;
  return Math.max(MIN_HOUR_H, Math.round(clientHeight / VISIBLE_DAY_HOURS));
}
