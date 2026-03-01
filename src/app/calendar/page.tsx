"use client";

import { useEffect, useState, useRef, useCallback, useMemo, RefObject } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ChevronLeft, ChevronRight, Calendar, X, MapPin, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendarStore, hydrateCalendarStore } from "@/stores/calendar-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";

// ─── constants ────────────────────────────────────────────────────────────────

type ViewMode = "week" | "month" | "day";

const HOUR_PX = 64;

const DAY_NAMES_SHORT = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const DAY_NAMES_FULL = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

const CALENDAR_COLORS: { dot: string; bg: string; text: string; check: string }[] = [
  { dot: "bg-indigo-500",  bg: "bg-indigo-500/90",  text: "text-white", check: "#6366f1" },
  { dot: "bg-pink-500",    bg: "bg-pink-500/90",    text: "text-white", check: "#ec4899" },
  { dot: "bg-emerald-500", bg: "bg-emerald-500/90", text: "text-white", check: "#10b981" },
  { dot: "bg-amber-500",   bg: "bg-amber-500/90",   text: "text-white", check: "#f59e0b" },
  { dot: "bg-cyan-500",    bg: "bg-cyan-500/90",    text: "text-white", check: "#06b6d4" },
  { dot: "bg-orange-500",  bg: "bg-orange-500/90",  text: "text-white", check: "#f97316" },
];

// ─── live clock ───────────────────────────────────────────────────────────────

function useNowMinutes(): number {
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  return nowMinutes;
}

// ─── date helpers ─────────────────────────────────────────────────────────────

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonthGrid(date: Date): Date[] {
  const first = startOfMonth(date);
  const startDow = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const gridStart = addDays(first, -startDow);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

// ─── mini calendar (sidebar) ──────────────────────────────────────────────────

function MiniCalendar({
  focusDate,
  onDateSelect,
  eventDates,
}: {
  focusDate: Date;
  onDateSelect: (d: Date) => void;
  eventDates: Set<string>;
}) {
  const [month, setMonth] = useState(() => new Date(focusDate.getFullYear(), focusDate.getMonth(), 1));
  const today = new Date();

  // Sync mini-calendar month when main view changes month
  useEffect(() => {
    setMonth(new Date(focusDate.getFullYear(), focusDate.getMonth(), 1));
  }, [focusDate.getFullYear(), focusDate.getMonth()]); // eslint-disable-line react-hooks/exhaustive-deps

  const days = daysInMonthGrid(month);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
          {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
        </span>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES_SHORT.map((d) => (
          <div key={d} className="text-[9px] text-center text-gray-400 dark:text-gray-500 font-medium">
            {d[0]}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const isFocus = isSameDay(day, focusDate);
          const isCurrentMonth = day.getMonth() === month.getMonth();
          const hasEvent = eventDates.has(toDateStr(day));

          return (
            <button
              key={i}
              type="button"
              onClick={() => onDateSelect(day)}
              className={cn(
                "relative flex flex-col items-center justify-center h-6 w-6 rounded-full text-[10px] font-medium transition-colors mx-auto",
                isFocus ? "bg-indigo-600 text-white" : isToday ? "text-indigo-600 font-bold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10",
                !isCurrentMonth && "opacity-30"
              )}
            >
              {day.getDate()}
              {hasEvent && !isFocus && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-400" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── add event modal ──────────────────────────────────────────────────────────

function AddEventModal({
  calendarEntityIds,
  colorMap,
  entityNames,
  defaultDate,
  onClose,
  onAdded,
}: {
  calendarEntityIds: string[];
  colorMap: Record<string, { dot: string; bg: string; text: string }>;
  entityNames: Record<string, string>;
  defaultDate: Date;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [title, setTitle] = useState("");
  const [calendarId, setCalendarId] = useState(calendarEntityIds[0] ?? "");
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState(toDateStr(defaultDate));
  const [startTime, setStartTime] = useState(`${String(defaultDate.getHours()).padStart(2, "0")}:00`);
  const [endDate, setEndDate] = useState(toDateStr(defaultDate));
  const [endTime, setEndTime] = useState(`${String((defaultDate.getHours() + 1) % 24).padStart(2, "0")}:00`);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !calendarId) return;
    setSubmitting(true);
    setError(null);
    try {
      const dtstart = allDay ? startDate : `${startDate}T${startTime}:00`;
      const dtend = allDay ? endDate : `${endDate}T${endTime}:00`;
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: calendarId,
          domain: "calendar",
          service: "create_event",
          service_data: {
            summary: title.trim(),
            dtstart,
            dtend,
            ...(description.trim() ? { description: description.trim() } : {}),
          },
        }),
      });
      if (!res.ok) throw new Error("Mislukt");
      onAdded();
      onClose();
    } catch {
      setError("Kon de afspraak niet aanmaken. Controleer of deze agenda schrijven ondersteunt.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Afspraak toevoegen</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel"
            required
            autoFocus
            className={inputClass}
          />

          {/* Calendar selector */}
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-sm shrink-0", colorMap[calendarId]?.dot ?? "bg-indigo-500")} />
            <select
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              className={cn(inputClass, "flex-1")}
            >
              {calendarEntityIds.map((id) => (
                <option key={id} value={id}>{entityNames[id] ?? id}</option>
              ))}
            </select>
          </div>

          {/* All-day toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">Hele dag</span>
          </label>

          {/* Start */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Van</label>
            <div className="flex gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={cn(inputClass, "flex-1")} />
              {!allDay && (
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={cn(inputClass, "w-28")} />
              )}
            </div>
          </div>

          {/* End */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Tot</label>
            <div className="flex gap-2">
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={cn(inputClass, "flex-1")} />
              {!allDay && (
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={cn(inputClass, "w-28")} />
              )}
            </div>
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschrijving (optioneel)"
            rows={2}
            className={cn(inputClass, "resize-none")}
          />

          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/20 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !calendarId}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Opslaan…" : "Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── event chip ───────────────────────────────────────────────────────────────

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
  scrollRef,
}: {
  weekDays: Date[];
  events: CalendarEvent[];
  colorMap: Record<string, { dot: string; bg: string; text: string }>;
  onSelectEvent: (ev: CalendarEvent) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const now = new Date();
  const nowMinutes = useNowMinutes();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, (now.getHours() - 1) * HOUR_PX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 flex border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
        <div className="w-14 shrink-0" />
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, now);
          const allDay = allDayEventsForDay(events, day);
          return (
            <div key={i} className="flex-1 border-l border-gray-200 dark:border-white/10 px-1 py-2 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">{DAY_NAMES_SHORT[i]}</span>
              <span className={cn("text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors", isToday ? "bg-indigo-600 text-white" : "text-gray-900 dark:text-white")}>
                {day.getDate()}
              </span>
              {allDay.slice(0, 2).map((ev, j) => (
                <EventChip key={j} ev={ev} color={colorMap[ev.entityId] ?? CALENDAR_COLORS[0]} onClick={() => onSelectEvent(ev)} small />
              ))}
              {allDay.length > 2 && <span className="text-[9px] text-gray-400">+{allDay.length - 2}</span>}
            </div>
          );
        })}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: 24 * HOUR_PX }}>
          <div className="w-14 shrink-0 relative">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_PX }}>
                {h > 0 && <span className="absolute -top-2.5 right-2 text-[10px] text-gray-400 dark:text-gray-500 select-none">{String(h).padStart(2, "0")}:00</span>}
              </div>
            ))}
          </div>

          {weekDays.map((day, di) => {
            const isToday = isSameDay(day, now);
            const dayEvs = eventsForDay(events, day);
            return (
              <div key={di} className={cn("flex-1 border-l border-gray-200 dark:border-white/10 relative", isToday && "bg-indigo-50/30 dark:bg-indigo-900/10")} style={{ minHeight: 24 * HOUR_PX }}>
                {hours.map((h) => <div key={h} className="absolute w-full border-t border-gray-100 dark:border-white/5" style={{ top: h * HOUR_PX }} />)}
                {isToday && (
                  <div className="absolute w-full flex items-center pointer-events-none z-20" style={{ top: (nowMinutes / 60) * HOUR_PX }}>
                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shrink-0" />
                    <div className="flex-1 h-px bg-red-500" />
                  </div>
                )}
                {dayEvs.map((ev, ei) => {
                  const start = eventStartDate(ev);
                  const end = eventEndDate(ev);
                  const top = (minutesIntoDay(start) / 60) * HOUR_PX;
                  const durationMins = (end.getTime() - start.getTime()) / 60000;
                  const height = Math.max((durationMins / 60) * HOUR_PX, 20);
                  const color = colorMap[ev.entityId] ?? CALENDAR_COLORS[0];
                  return (
                    <button key={ei} type="button" onClick={() => onSelectEvent(ev)} className={cn("absolute left-0.5 right-0.5 rounded text-left z-10 hover:opacity-90 active:opacity-80 transition-opacity", color.bg, color.text)} style={{ top, height }}>
                      <div className={cn("sticky top-0 px-1.5 py-0.5 rounded", color.bg)}>
                        <p className="text-[10px] font-semibold truncate leading-tight">{ev.summary}</p>
                        {height > 30 && <p className="text-[9px] opacity-80 leading-tight">{formatClock(start)}</p>}
                      </div>
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
      <div className="shrink-0 grid grid-cols-7 border-b border-gray-200 dark:border-white/10">
        {DAY_NAMES_SHORT.map((d) => (
          <div key={d} className="py-2 text-center text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">{d}</div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 h-full" style={{ gridAutoRows: "minmax(80px, 1fr)" }}>
          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            const isCurrentMonth = day.getMonth() === currentMonth;
            const dayEvs = [...allDayEventsForDay(events, day), ...eventsForDay(events, day)];
            return (
              <div key={i} className={cn("border-r border-b border-gray-100 dark:border-white/5 p-1 flex flex-col gap-0.5 overflow-hidden", !isCurrentMonth && "opacity-40")}>
                <span className={cn("text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full self-center", isToday ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-300")}>
                  {day.getDate()}
                </span>
                {dayEvs.slice(0, 3).map((ev, j) => (
                  <EventChip key={j} ev={ev} color={colorMap[ev.entityId] ?? CALENDAR_COLORS[0]} onClick={() => onSelectEvent(ev)} small />
                ))}
                {dayEvs.length > 3 && <span className="text-[9px] text-gray-400 pl-1">+{dayEvs.length - 3}</span>}
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
  scrollRef,
}: {
  date: Date;
  events: CalendarEvent[];
  colorMap: Record<string, { dot: string; bg: string; text: string }>;
  onSelectEvent: (ev: CalendarEvent) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const now = new Date();
  const nowMinutes = useNowMinutes();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isToday = isSameDay(date, now);
  const dayEvs = eventsForDay(events, date);
  const allDay = allDayEventsForDay(events, date);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = Math.max(0, (now.getHours() - 1) * HOUR_PX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {allDay.length > 0 && (
        <div className="shrink-0 px-4 py-2 border-b border-gray-200 dark:border-white/10 flex flex-wrap gap-1">
          {allDay.map((ev, i) => <EventChip key={i} ev={ev} color={colorMap[ev.entityId] ?? CALENDAR_COLORS[0]} onClick={() => onSelectEvent(ev)} />)}
        </div>
      )}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: 24 * HOUR_PX }}>
          <div className="w-16 shrink-0">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_PX }}>
                {h > 0 && <span className="absolute -top-2.5 right-3 text-[11px] text-gray-400 dark:text-gray-500 select-none">{String(h).padStart(2, "0")}:00</span>}
              </div>
            ))}
          </div>
          <div className="flex-1 border-l border-gray-200 dark:border-white/10 relative" style={{ minHeight: 24 * HOUR_PX }}>
            {hours.map((h) => <div key={h} className="absolute w-full border-t border-gray-100 dark:border-white/5" style={{ top: h * HOUR_PX }} />)}
            {isToday && (
              <div className="absolute w-full flex items-center pointer-events-none z-20" style={{ top: (nowMinutes / 60) * HOUR_PX }}>
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
                <button key={i} type="button" onClick={() => onSelectEvent(ev)} className={cn("absolute left-1 right-2 rounded-lg text-left z-10 hover:opacity-90 transition-opacity shadow-sm", color.bg, color.text)} style={{ top, height }}>
                  <div className={cn("sticky top-0 px-3 py-1.5 rounded-lg", color.bg)}>
                    <p className="text-sm font-semibold truncate">{ev.summary}</p>
                    {height > 36 && <p className="text-xs opacity-80">{formatClock(start)} – {formatClock(end)}</p>}
                    {height > 56 && ev.location && <p className="text-xs opacity-70 mt-0.5 truncate">📍 {ev.location}</p>}
                  </div>
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className={cn("h-1.5 w-full", color.bg)} />
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-4 leading-snug">{ev.summary}</h3>
            <button type="button" onClick={onClose} className="shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 shrink-0 text-gray-400" />
              {ev.allDay ? (
                <span>{start.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })} · Hele dag</span>
              ) : (
                <span>{start.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })} · {formatClock(start)} – {formatClock(end)}</span>
              )}
            </div>
            {ev.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{ev.location}</span>
              </div>
            )}
            {ev.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/10 pt-2 mt-2 leading-relaxed">{ev.description}</p>
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
  const entityStates = useEntityStateStore((s) => s.states);

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [hiddenCalendars, setHiddenCalendars] = useState<Set<string>>(new Set());
  const [addEventOpen, setAddEventOpen] = useState(false);
  const timeGridScrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();

  const colorMap = Object.fromEntries(
    calendarEntityIds.map((id, i) => [id, CALENDAR_COLORS[i % CALENDAR_COLORS.length]])
  );

  const entityNames = Object.fromEntries(
    calendarEntityIds.map((id) => [
      id,
      (entityStates[id]?.attributes?.friendly_name as string) ??
        id.split(".")[1]?.replace(/_/g, " ") ??
        id,
    ])
  );

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredEvents = useMemo(
    () => events.filter((ev) => !hiddenCalendars.has(ev.entityId)),
    [events, hiddenCalendars]
  );

  const eventDatesSet = useMemo<Set<string>>(() => {
    const s = new Set<string>();
    for (const ev of filteredEvents) s.add(toDateStr(eventStartDate(ev)));
    return s;
  }, [filteredEvents]);

  function toggleCalendar(id: string) {
    setHiddenCalendars((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function scrollToNow() {
    timeGridScrollRef.current?.scrollTo({ top: Math.max(0, (new Date().getHours() - 1) * HOUR_PX), behavior: "smooth" });
  }

  const fetchEvents = useCallback(async () => {
    if (calendarEntityIds.length === 0) { setEvents([]); return; }
    setLoading(true);
    try {
      let start: Date, end: Date;
      if (viewMode === "week") { start = weekStart; end = addDays(weekStart, 7); }
      else if (viewMode === "day") { start = new Date(currentDate); start.setHours(0, 0, 0, 0); end = addDays(start, 1); }
      else { start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); }
      const res = await fetch(`/api/ha/calendar?entityIds=${calendarEntityIds.join(",")}&start=${start.toISOString()}&end=${end.toISOString()}`);
      const data = await res.json();
      if (Array.isArray(data.events)) setEvents(data.events);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [calendarEntityIds, viewMode, currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const headerTitle =
    viewMode === "week"
      ? (() => {
          const endWeek = addDays(weekStart, 6);
          return weekStart.getMonth() === endWeek.getMonth()
            ? `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
            : `${MONTH_NAMES[weekStart.getMonth()]} – ${MONTH_NAMES[endWeek.getMonth()]} ${endWeek.getFullYear()}`;
        })()
      : viewMode === "day"
      ? `${DAY_NAMES_FULL[(currentDate.getDay() + 6) % 7]} ${currentDate.getDate()} ${MONTH_NAMES[currentDate.getMonth()]}`
      : `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const isCurrentPeriodToday =
    viewMode === "day" ? isSameDay(currentDate, today)
    : viewMode === "week" ? weekDays.some((d) => isSameDay(d, today))
    : currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();

  return (
    <AppShell activeTab="/calendar" contentNoScroll>
      <div className="flex h-full min-h-0">

        {/* ── Sidebar ── */}
        <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-gray-200 dark:border-white/10 bg-white/60 dark:bg-gray-900/60 overflow-y-auto">
          {/* Add event button */}
          <div className="p-3 pb-0">
            <button
              type="button"
              onClick={() => setAddEventOpen(true)}
              disabled={calendarEntityIds.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Toevoegen
            </button>
          </div>

          {/* Calendar filters */}
          {calendarEntityIds.length > 0 && (
            <div className="px-3 pt-5 pb-3">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Agenda&apos;s
              </p>
              <div className="space-y-0.5">
                {calendarEntityIds.map((id, i) => {
                  const color = CALENDAR_COLORS[i % CALENDAR_COLORS.length];
                  const isHidden = hiddenCalendars.has(id);
                  return (
                    <label key={id} className="flex items-center gap-2.5 py-1.5 px-1 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <div
                        className={cn(
                          "w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors",
                          isHidden ? "border-gray-300 dark:border-white/30 bg-transparent" : "border-transparent"
                        )}
                        style={isHidden ? {} : { backgroundColor: color.check }}
                      >
                        {!isHidden && (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" checked={!isHidden} onChange={() => toggleCalendar(id)} className="sr-only" />
                      <span className={cn("text-xs font-medium truncate", isHidden ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-700 dark:text-gray-200")}>
                        {entityNames[id]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mini calendar */}
          <div className="px-3 pt-4 pb-4 border-t border-gray-100 dark:border-white/10 mt-auto">
            <MiniCalendar
              focusDate={currentDate}
              onDateSelect={(d) => { setCurrentDate(d); setViewMode("day"); }}
              eventDates={eventDatesSet}
            />
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">

          {/* Toolbar */}
          <div className="sticky top-0 z-10 shrink-0 flex items-center justify-between gap-3 px-4 pt-3 pb-3 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            {/* Left: title + nav */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
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
                <button type="button" onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white min-w-0 truncate">
                {headerTitle}
              </h1>
              {loading && <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 dark:border-white/20 border-t-indigo-600 animate-spin shrink-0" />}
            </div>

            {/* Right: Nu + view switcher + add (mobile) */}
            <div className="flex items-center gap-2 shrink-0">
              {viewMode !== "month" && (
                <button
                  type="button"
                  onClick={scrollToNow}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Nu
                </button>
              )}
              <div className="flex items-center gap-0.5 rounded-lg bg-black/5 dark:bg-white/5 p-0.5">
                {(["month", "week", "day"] as ViewMode[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setViewMode(v)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md font-medium transition-colors",
                      viewMode === v ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {v === "month" ? "Maand" : v === "week" ? "Week" : "Dag"}
                  </button>
                ))}
              </div>
              {/* Add button (visible on mobile, hidden on md+ where sidebar has it) */}
              <button
                type="button"
                onClick={() => setAddEventOpen(true)}
                disabled={calendarEntityIds.length === 0}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                Toevoegen
              </button>
            </div>
          </div>

          {/* Empty state */}
          {calendarEntityIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400 dark:text-white/30 px-4 text-center">
              <Calendar className="h-10 w-10 opacity-30" />
              <p className="text-sm max-w-xs">
                Geen kalenders geselecteerd. Ga naar Instellingen → Kalender om kalenders toe te voegen.
              </p>
            </div>
          ) : (
            <>
              {viewMode === "week" && <WeekView weekDays={weekDays} events={filteredEvents} colorMap={colorMap} onSelectEvent={setSelectedEvent} scrollRef={timeGridScrollRef} />}
              {viewMode === "month" && <MonthView currentDate={currentDate} events={filteredEvents} colorMap={colorMap} onSelectEvent={setSelectedEvent} />}
              {viewMode === "day" && <DayView date={currentDate} events={filteredEvents} colorMap={colorMap} onSelectEvent={setSelectedEvent} scrollRef={timeGridScrollRef} />}
            </>
          )}
        </div>
      </div>

      {/* Event detail */}
      {selectedEvent && (
        <EventModal ev={selectedEvent} color={colorMap[selectedEvent.entityId] ?? CALENDAR_COLORS[0]} onClose={() => setSelectedEvent(null)} />
      )}

      {/* Add event */}
      {addEventOpen && (
        <AddEventModal
          calendarEntityIds={calendarEntityIds}
          colorMap={colorMap}
          entityNames={entityNames}
          defaultDate={currentDate}
          onClose={() => setAddEventOpen(false)}
          onAdded={fetchEvents}
        />
      )}
    </AppShell>
  );
}
