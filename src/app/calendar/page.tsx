"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ChevronLeft, ChevronRight, Calendar, X, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendarStore, hydrateCalendarStore } from "@/stores/calendar-store";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";

// ─── constants ────────────────────────────────────────────────────────────────

type ViewMode = "week" | "month" | "day";

const HOUR_PX = 64; // pixels per hour row

const DAY_NAMES_SHORT = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const DAY_NAMES_FULL = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

const CALENDAR_COLORS: { dot: string; bg: string; text: string }[] = [
  { dot: "bg-indigo-500", bg: "bg-indigo-500/90", text: "text-white" },
  { dot: "bg-pink-500",   bg: "bg-pink-500/90",   text: "text-white" },
  { dot: "bg-emerald-500",bg: "bg-emerald-500/90", text: "text-white" },
  { dot: "bg-amber-500",  bg: "bg-amber-500/90",   text: "text-white" },
  { dot: "bg-cyan-500",   bg: "bg-cyan-500/90",    text: "text-white" },
  { dot: "bg-orange-500", bg: "bg-orange-500/90",  text: "text-white" },
];

// ─── date helpers ─────────────────────────────────────────────────────────────

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); // Monday
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonthGrid(date: Date): Date[] {
  const first = startOfMonth(date);
  const startDow = first.getDay() === 0 ? 6 : first.getDay() - 1; // offset (0=Mon)
  const gridStart = addDays(first, -startDow);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

// ─── event helpers ────────────────────────────────────────────────────────────

function eventStartDate(ev: CalendarEvent): Date {
  return ev.allDay ? new Date(ev.start + "T00:00:00") : new Date(ev.start);
}

function eventEndDate(ev: CalendarEvent): Date {
  return ev.allDay ? new Date(ev.end + "T00:00:00") : new Date(ev.end);
}

function minutesIntoDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function eventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((ev) => !ev.allDay && isSameDay(eventStartDate(ev), day));
}

function allDayEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((ev) => {
    if (!ev.allDay) return false;
    const start = eventStartDate(ev);
    const end = eventEndDate(ev);
    return day >= start && day < end;
  });
}

// ─── sub-components ───────────────────────────────────────────────────────────

function EventChip({
  ev,
  color,
  onClick,
  small = false,
}: {
  ev: CalendarEvent;
  color: { dot: string; bg: string; text: string };
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded px-1 truncate cursor-pointer hover:opacity-80 transition-opacity",
        color.bg,
        color.text,
        small ? "text-[9px] py-0" : "text-[10px] py-0.5"
      )}
    >
      {ev.summary}
    </button>
  );
}

// ─── week view ────────────────────────────────────────────────────────────────

function WeekView({
  weekDays,
  events,
  colorMap,
  onSelectEvent,
}: {
  weekDays: Date[];
  events: CalendarEvent[];
  colorMap: Record<string, { dot: string; bg: string; text: string }>;
  onSelectEvent: (ev: CalendarEvent) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const now = new Date();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, (now.getHours() - 1) * HOUR_PX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Day header */}
      <div className="shrink-0 flex border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
        <div className="w-14 shrink-0" />
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, now);
          const allDay = allDayEventsForDay(events, day);
          return (
            <div
              key={i}
              className="flex-1 border-l border-gray-200 dark:border-white/10 px-1 py-2 flex flex-col items-center gap-1"
            >
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">
                {DAY_NAMES_SHORT[i]}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isToday
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 dark:text-white"
                )}
              >
                {day.getDate()}
              </span>
              {allDay.slice(0, 2).map((ev, j) => (
                <EventChip
                  key={j}
                  ev={ev}
                  color={colorMap[ev.entityId] ?? CALENDAR_COLORS[0]}
                  onClick={() => onSelectEvent(ev)}
                  small
                />
              ))}
              {allDay.length > 2 && (
                <span className="text-[9px] text-gray-400">+{allDay.length - 2}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: 24 * HOUR_PX }}>
          {/* Time labels */}
          <div className="w-14 shrink-0 relative">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_PX }}>
                {h > 0 && (
                  <span className="absolute -top-2.5 right-2 text-[10px] text-gray-400 dark:text-gray-500 select-none">
                    {String(h).padStart(2, "0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, di) => {
            const isToday = isSameDay(day, now);
            const dayEvs = eventsForDay(events, day);
            const nowMinutes = now.getHours() * 60 + now.getMinutes();

            return (
              <div
                key={di}
                className={cn(
                  "flex-1 border-l border-gray-200 dark:border-white/10 relative",
                  isToday && "bg-indigo-50/30 dark:bg-indigo-900/10"
                )}
                style={{ minHeight: 24 * HOUR_PX }}
              >
                {/* Hour lines */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="absolute w-full border-t border-gray-100 dark:border-white/5"
                    style={{ top: h * HOUR_PX }}
                  />
                ))}

                {/* Current time indicator */}
                {isToday && (
                  <div
                    className="absolute w-full flex items-center pointer-events-none z-20"
                    style={{ top: (nowMinutes / 60) * HOUR_PX }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shrink-0" />
                    <div className="flex-1 h-px bg-red-500" />
                  </div>
                )}

                {/* Events */}
                {dayEvs.map((ev, ei) => {
                  const start = eventStartDate(ev);
                  const end = eventEndDate(ev);
                  const top = (minutesIntoDay(start) / 60) * HOUR_PX;
                  const durationMins = (end.getTime() - start.getTime()) / 60000;
                  const height = Math.max((durationMins / 60) * HOUR_PX, 20);
                  const color = colorMap[ev.entityId] ?? CALENDAR_COLORS[0];

                  return (
                    <button
                      key={ei}
                      type="button"
                      onClick={() => onSelectEvent(ev)}
                      className={cn(
                        "absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-left overflow-hidden z-10",
                        "hover:opacity-90 active:opacity-80 transition-opacity",
                        color.bg,
                        color.text
                      )}
                      style={{ top, height }}
                    >
                      <p className="text-[10px] font-semibold truncate leading-tight">
                        {ev.summary}
                      </p>
                      {height > 30 && (
                        <p className="text-[9px] opacity-80 leading-tight">
                          {formatClock(start)}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── month view ───────────────────────────────────────────────────────────────

function MonthView({
  currentDate,
  events,
  colorMap,
  onSelectEvent,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  colorMap: Record<string, { dot: string; bg: string; text: string }>;
  onSelectEvent: (ev: CalendarEvent) => void;
}) {
  const days = daysInMonthGrid(currentDate);
  const today = new Date();
  const currentMonth = currentDate.getMonth();

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Weekday header */}
      <div className="shrink-0 grid grid-cols-7 border-b border-gray-200 dark:border-white/10">
        {DAY_NAMES_SHORT.map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 h-full" style={{ gridAutoRows: "minmax(80px, 1fr)" }}>
          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            const isCurrentMonth = day.getMonth() === currentMonth;
            const dayEvs = [
              ...allDayEventsForDay(events, day),
              ...eventsForDay(events, day),
            ];

            return (
              <div
                key={i}
                className={cn(
                  "border-r border-b border-gray-100 dark:border-white/5 p-1 flex flex-col gap-0.5 overflow-hidden",
                  !isCurrentMonth && "opacity-40"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full self-center",
                    isToday
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {day.getDate()}
                </span>
                {dayEvs.slice(0, 3).map((ev, j) => (
                  <EventChip
                    key={j}
                    ev={ev}
                    color={colorMap[ev.entityId] ?? CALENDAR_COLORS[0]}
                    onClick={() => onSelectEvent(ev)}
                    small
                  />
                ))}
                {dayEvs.length > 3 && (
                  <span className="text-[9px] text-gray-400 pl-1">+{dayEvs.length - 3}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── day view ─────────────────────────────────────────────────────────────────

function DayView({
  date,
  events,
  colorMap,
  onSelectEvent,
}: {
  date: Date;
  events: CalendarEvent[];
  colorMap: Record<string, { dot: string; bg: string; text: string }>;
  onSelectEvent: (ev: CalendarEvent) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isToday = isSameDay(date, now);
  const dayEvs = eventsForDay(events, date);
  const allDay = allDayEventsForDay(events, date);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, (now.getHours() - 1) * HOUR_PX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* All-day events */}
      {allDay.length > 0 && (
        <div className="shrink-0 px-4 py-2 border-b border-gray-200 dark:border-white/10 flex flex-wrap gap-1">
          {allDay.map((ev, i) => (
            <EventChip
              key={i}
              ev={ev}
              color={colorMap[ev.entityId] ?? CALENDAR_COLORS[0]}
              onClick={() => onSelectEvent(ev)}
            />
          ))}
        </div>
      )}

      {/* Time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: 24 * HOUR_PX }}>
          {/* Time labels */}
          <div className="w-16 shrink-0">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_PX }}>
                {h > 0 && (
                  <span className="absolute -top-2.5 right-3 text-[11px] text-gray-400 dark:text-gray-500 select-none">
                    {String(h).padStart(2, "0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Single day column */}
          <div className="flex-1 border-l border-gray-200 dark:border-white/10 relative" style={{ minHeight: 24 * HOUR_PX }}>
            {hours.map((h) => (
              <div
                key={h}
                className="absolute w-full border-t border-gray-100 dark:border-white/5"
                style={{ top: h * HOUR_PX }}
              />
            ))}

            {isToday && (
              <div
                className="absolute w-full flex items-center pointer-events-none z-20"
                style={{ top: ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_PX }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 shrink-0" />
                <div className="flex-1 h-px bg-red-500" />
              </div>
            )}

            {dayEvs.map((ev, i) => {
              const start = eventStartDate(ev);
              const end = eventEndDate(ev);
              const top = (minutesIntoDay(start) / 60) * HOUR_PX;
              const durationMins = (end.getTime() - start.getTime()) / 60000;
              const height = Math.max((durationMins / 60) * HOUR_PX, 24);
              const color = colorMap[ev.entityId] ?? CALENDAR_COLORS[0];

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectEvent(ev)}
                  className={cn(
                    "absolute left-1 right-2 rounded-lg px-3 py-1.5 text-left overflow-hidden z-10",
                    "hover:opacity-90 transition-opacity shadow-sm",
                    color.bg,
                    color.text
                  )}
                  style={{ top, height }}
                >
                  <p className="text-sm font-semibold truncate">{ev.summary}</p>
                  {height > 36 && (
                    <p className="text-xs opacity-80">
                      {formatClock(start)} – {formatClock(end)}
                    </p>
                  )}
                  {height > 56 && ev.location && (
                    <p className="text-xs opacity-70 mt-0.5 truncate">📍 {ev.location}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── event detail modal ───────────────────────────────────────────────────────

function EventModal({
  ev,
  color,
  onClose,
}: {
  ev: CalendarEvent;
  color: { dot: string; bg: string; text: string };
  onClose: () => void;
}) {
  const start = eventStartDate(ev);
  const end = eventEndDate(ev);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color bar */}
        <div className={cn("h-1.5 w-full", color.bg)} />

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-4 leading-snug">
              {ev.summary}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 shrink-0 text-gray-400" />
              {ev.allDay ? (
                <span>
                  {start.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
                  {" · Hele dag"}
                </span>
              ) : (
                <span>
                  {start.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
                  {" · "}
                  {formatClock(start)} – {formatClock(end)}
                </span>
              )}
            </div>

            {ev.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{ev.location}</span>
              </div>
            )}

            {ev.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/10 pt-2 mt-2 leading-relaxed">
                {ev.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { calendarEntityIds } = useCalendarStore();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const today = new Date();

  // Assign colors per calendar entity
  const colorMap = Object.fromEntries(
    calendarEntityIds.map((id, i) => [id, CALENDAR_COLORS[i % CALENDAR_COLORS.length]])
  );

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchEvents = useCallback(async () => {
    if (calendarEntityIds.length === 0) {
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      const ws = startOfWeek(currentDate);
      let start: Date, end: Date;
      if (viewMode === "week") {
        start = ws;
        end = addDays(ws, 7);
      } else if (viewMode === "day") {
        start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        end = addDays(start, 1);
      } else {
        start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      }
      const res = await fetch(
        `/api/ha/calendar?entityIds=${calendarEntityIds.join(",")}&start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await res.json();
      if (Array.isArray(data.events)) setEvents(data.events);
    } catch {
      // ignore fetch errors silently
    } finally {
      setLoading(false);
    }
  }, [calendarEntityIds, viewMode, currentDate]);

  useEffect(() => { hydrateCalendarStore(); }, []);
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  function navigate(dir: -1 | 1) {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
      else if (viewMode === "day") d.setDate(d.getDate() + dir);
      else d.setMonth(d.getMonth() + dir);
      return d;
    });
  }

  // Header title
  const headerTitle =
    viewMode === "week"
      ? (() => {
          const endWeek = addDays(weekStart, 6);
          if (weekStart.getMonth() === endWeek.getMonth()) {
            return `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
          }
          return `${MONTH_NAMES[weekStart.getMonth()]} – ${MONTH_NAMES[endWeek.getMonth()]} ${endWeek.getFullYear()}`;
        })()
      : viewMode === "day"
      ? `${DAY_NAMES_FULL[(currentDate.getDay() + 6) % 7]} ${currentDate.getDate()} ${MONTH_NAMES[currentDate.getMonth()]}`
      : `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const isCurrentPeriodToday =
    viewMode === "day"
      ? isSameDay(currentDate, today)
      : viewMode === "week"
      ? weekDays.some((d) => isSameDay(d, today))
      : currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth();

  return (
    <AppShell activeTab="/calendar" contentNoScroll>
      <div className="flex flex-col h-full">
        {/* ── toolbar ── */}
        <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white min-w-0">
              {headerTitle}
            </h1>
            {loading && (
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-white/20 border-t-indigo-600 animate-spin shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date())}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-lg border transition-colors",
                  isCurrentPeriodToday
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-200 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10"
                )}
              >
                Vandaag
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* View switcher */}
            <div className="flex items-center gap-0.5 rounded-lg bg-black/5 dark:bg-white/5 p-0.5">
              {(["month", "week", "day"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setViewMode(v)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-md font-medium transition-colors",
                    viewMode === v
                      ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {v === "month" ? "Maand" : v === "week" ? "Week" : "Dag"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── empty state ── */}
        {calendarEntityIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400 dark:text-white/30 px-4 text-center">
            <Calendar className="h-10 w-10 opacity-30" />
            <p className="text-sm max-w-xs">
              Geen kalenders geselecteerd. Ga naar Instellingen → Kalender om kalenders toe te voegen.
            </p>
          </div>
        ) : (
          <>
            {viewMode === "week" && (
              <WeekView
                weekDays={weekDays}
                events={events}
                colorMap={colorMap}
                onSelectEvent={setSelectedEvent}
              />
            )}
            {viewMode === "month" && (
              <MonthView
                currentDate={currentDate}
                events={events}
                colorMap={colorMap}
                onSelectEvent={setSelectedEvent}
              />
            )}
            {viewMode === "day" && (
              <DayView
                date={currentDate}
                events={events}
                colorMap={colorMap}
                onSelectEvent={setSelectedEvent}
              />
            )}
          </>
        )}
      </div>

      {/* ── event detail ── */}
      {selectedEvent && (
        <EventModal
          ev={selectedEvent}
          color={colorMap[selectedEvent.entityId] ?? CALENDAR_COLORS[0]}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </AppShell>
  );
}
