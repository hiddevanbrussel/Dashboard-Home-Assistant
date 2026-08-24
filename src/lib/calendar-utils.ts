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
