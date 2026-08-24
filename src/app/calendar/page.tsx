"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  MapPin,
  Plus,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useCalendarStore, hydrateCalendarStore } from "@/stores/calendar-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";
import {
  addDays,
  allDayOnDay,
  durationLabel,
  durationMinutes,
  eventEnd,
  eventStart,
  eventsOnDay,
  formatTime,
  isSameDay,
  localeOf,
  looksLikeMeet,
  minutesInDay,
  monthGridDays,
  monthNames as monthNameList,
  startOfWeek,
  stepTime,
  timedOnDay,
  toDateKey,
  visibleMonthDays,
  weekDayNames,
} from "@/lib/calendar-utils";

type ViewMode = "week" | "month" | "day";

const HOUR_H = 48;
const FOCUS_HOUR = 8;

function scrollTimeGrid(el: HTMLDivElement | null, hour = FOCUS_HOUR, smooth = false) {
  if (!el) return;
  const top = hour * HOUR_H;
  const apply = () => el.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  apply();
  let tries = 0;
  const tick = () => {
    if (!el.isConnected) return;
    apply();
    if (el.scrollHeight > el.clientHeight + 8 || tries++ >= 12) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

type CalColor = { bar: string; soft: string; check: string; glow: string };

const CAL_COLORS: CalColor[] = [
  { bar: "bg-accent-purple", soft: "bg-accent-purple/20 dark:bg-accent-purple/15", check: "#B48BFF", glow: "shadow-[0_0_24px_rgba(180,139,255,0.35)]" },
  { bar: "bg-accent-orange", soft: "bg-accent-orange/20 dark:bg-accent-orange/15", check: "#F2A654", glow: "shadow-[0_0_24px_rgba(242,166,84,0.3)]" },
  { bar: "bg-accent-green", soft: "bg-accent-green/20 dark:bg-accent-green/15", check: "#6BE46B", glow: "shadow-[0_0_24px_rgba(107,228,107,0.28)]" },
  { bar: "bg-accent-yellow", soft: "bg-accent-yellow/25 dark:bg-accent-yellow/15", check: "#F6D25C", glow: "shadow-[0_0_24px_rgba(246,210,92,0.28)]" },
  { bar: "bg-cyan-400", soft: "bg-cyan-400/20 dark:bg-cyan-400/15", check: "#22d3ee", glow: "shadow-[0_0_24px_rgba(34,211,238,0.28)]" },
  { bar: "bg-pink-400", soft: "bg-pink-400/20 dark:bg-pink-400/15", check: "#f472b6", glow: "shadow-[0_0_24px_rgba(244,114,182,0.28)]" },
];

function useNowMinutes(): number {
  const [mins, setMins] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setMins(n.getHours() * 60 + n.getMinutes());
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  return mins;
}

function TimeStepper({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-black/[0.04] px-1.5 py-1 dark:bg-white/5">
      <button type="button" onClick={() => onChange(stepTime(value, -15))} className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10" aria-label="-15 min">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>
      <span className="min-w-[3.4rem] text-center text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{value}</span>
      <button type="button" onClick={() => onChange(stepTime(value, 15))} className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10" aria-label="+15 min">
        <ChevronUp className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}

function MonthGrid({
  currentDate,
  selectedDate,
  events,
  colorMap,
  locale,
  moreLabel,
  onSelectDay,
  onSelectEvent,
}: {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  colorMap: Record<string, CalColor>;
  locale: string;
  moreLabel: string;
  onSelectDay: (d: Date) => void;
  onSelectEvent: (ev: CalendarEvent) => void;
}) {
  const days = visibleMonthDays(currentDate);
  const today = new Date();
  const labels = weekDayNames(locale, "short");
  const rows = days.length / 7;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      <div className="grid shrink-0 grid-cols-7 px-1">
        {labels.map((label) => (
          <div key={label} className="py-0.5 text-center text-[11px] font-medium capitalize text-gray-400 dark:text-gray-500">
            {label}
          </div>
        ))}
      </div>
      <div
        className="grid min-h-0 flex-1 grid-cols-7 gap-1.5"
        style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
      >
        {days.map((day) => {
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          const inMonth = day.getMonth() === currentDate.getMonth();
          const dayEvents = eventsOnDay(events, day);
          const shown = dayEvents.slice(0, 3);
          const extra = dayEvents.length - shown.length;

          return (
            <div
              key={toDateKey(day)}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDay(day)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDay(day);
                }
              }}
              className={cn(
                "flex min-h-0 cursor-pointer flex-col overflow-hidden rounded-xl border p-1 text-left transition-all duration-200",
                "bg-white/50 backdrop-blur-xl dark:bg-white/[0.05]",
                isSelected
                  ? "border-dashed border-accent-purple shadow-[0_0_0_1px_rgba(180,139,255,0.45)]"
                  : "border-white/70 hover:border-accent-purple/40 dark:border-white/10",
                isToday && cn("bg-accent-purple/10 dark:bg-accent-purple/15", CAL_COLORS[0].glow),
                !inMonth && "opacity-40"
              )}
            >
              <span
                className={cn(
                  "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  isToday ? "bg-accent-purple text-gray-900" : "text-gray-700 dark:text-gray-200"
                )}
              >
                {day.getDate()}
              </span>
              <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                {shown.map((ev, j) => {
                  const color = colorMap[ev.entityId] ?? CAL_COLORS[0];
                  return (
                    <button
                      key={`${ev.entityId}-${ev.start}-${j}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(day);
                        onSelectEvent(ev);
                      }}
                      className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-0.5 py-0.5 text-left hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <span className={cn("h-3 w-0.5 shrink-0 rounded-full", color.bar)} />
                      <span className="truncate text-[10px] font-medium leading-tight text-gray-700 dark:text-gray-200">
                        {ev.summary}
                      </span>
                    </button>
                  );
                })}
                {extra > 0 && (
                  <span className="pl-2 text-[10px] text-gray-400 dark:text-gray-500">
                    +{extra} {moreLabel}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({
  weekDays,
  selectedDate,
  events,
  colorMap,
  locale,
  onSelectDay,
  onSelectEvent,
  scrollRef,
}: {
  weekDays: Date[];
  selectedDate: Date;
  events: CalendarEvent[];
  colorMap: Record<string, CalColor>;
  locale: string;
  onSelectDay: (d: Date) => void;
  onSelectEvent: (ev: CalendarEvent) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const now = new Date();
  const nowMinutes = useNowMinutes();
  const labels = weekDayNames(locale, "short");

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => scrollTimeGrid(scrollRef.current, FOCUS_HOUR));
    return () => cancelAnimationFrame(id);
  }, [scrollRef]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-white/70 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex shrink-0 border-b border-white/50 dark:border-white/10">
        <div className="w-14 shrink-0" />
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, now);
          const isSelected = isSameDay(day, selectedDate);
          const allDay = allDayOnDay(events, day);
          return (
            <button
              key={toDateKey(day)}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 border-l border-white/40 px-1 py-2 dark:border-white/10",
                isSelected && "bg-accent-purple/10"
              )}
            >
              <span className="text-[10px] font-medium uppercase text-gray-400 dark:text-gray-500">{labels[i]}</span>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                  isToday
                    ? "bg-accent-purple text-gray-900"
                    : isSelected
                      ? "bg-black/10 text-gray-900 dark:bg-white/15 dark:text-white"
                      : "text-gray-900 dark:text-white"
                )}
              >
                {day.getDate()}
              </span>
              {allDay.slice(0, 2).map((ev, j) => (
                <span key={j} className="flex w-full min-w-0 items-center gap-1 truncate text-[9px] text-gray-700 dark:text-gray-200">
                  <span className={cn("h-2 w-0.5 shrink-0 rounded-full", (colorMap[ev.entityId] ?? CAL_COLORS[0]).bar)} />
                  <span className="truncate">{ev.summary}</span>
                </span>
              ))}
            </button>
          );
        })}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: 24 * HOUR_H }}>
          <div className="relative w-14 shrink-0">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_H }}>
                {h > 0 && (
                  <span className="absolute -top-2.5 right-2 select-none text-[10px] text-gray-400 dark:text-gray-500">
                    {String(h).padStart(2, "0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>
          {weekDays.map((day) => {
            const isToday = isSameDay(day, now);
            const dayEvents = timedOnDay(events, day);
            return (
              <div
                key={toDateKey(day)}
                className={cn("relative flex-1 border-l border-white/40 dark:border-white/10", isToday && "bg-accent-purple/5")}
                style={{ minHeight: 24 * HOUR_H }}
                onClick={() => onSelectDay(day)}
              >
                {hours.map((h) => (
                  <div key={h} className="absolute w-full border-t border-black/[0.04] dark:border-white/5" style={{ top: h * HOUR_H }} />
                ))}
                {isToday && (
                  <div className="pointer-events-none absolute z-20 flex w-full items-center" style={{ top: (nowMinutes / 60) * HOUR_H }}>
                    <div className="-ml-1 h-2 w-2 shrink-0 rounded-full bg-accent-orange" />
                    <div className="h-px flex-1 bg-accent-orange" />
                  </div>
                )}
                {dayEvents.map((ev, ei) => {
                  const start = eventStart(ev);
                  const end = eventEnd(ev);
                  const top = (minutesInDay(start) / 60) * HOUR_H;
                  const height = Math.max(((end.getTime() - start.getTime()) / 60_000 / 60) * HOUR_H, 22);
                  const color = colorMap[ev.entityId] ?? CAL_COLORS[0];
                  return (
                    <button
                      key={ei}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className={cn("absolute left-0.5 right-0.5 z-10 overflow-hidden rounded-lg text-left shadow-sm", color.soft)}
                      style={{ top, height }}
                    >
                      <span className={cn("absolute inset-y-0 left-0 w-0.5", color.bar)} />
                      <div className="px-1.5 py-0.5 pl-2">
                        <p className="truncate text-[10px] font-semibold leading-tight text-gray-800 dark:text-gray-100">{ev.summary}</p>
                        {height > 30 && <p className="text-[9px] text-gray-500 dark:text-gray-400">{formatTime(start, locale)}</p>}
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

function DayGrid({
  date,
  events,
  colorMap,
  locale,
  onSelectEvent,
  scrollRef,
}: {
  date: Date;
  events: CalendarEvent[];
  colorMap: Record<string, CalColor>;
  locale: string;
  onSelectEvent: (ev: CalendarEvent) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const now = new Date();
  const nowMinutes = useNowMinutes();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isToday = isSameDay(date, now);
  const dayEvents = timedOnDay(events, date);
  const allDay = allDayOnDay(events, date);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => scrollTimeGrid(scrollRef.current, FOCUS_HOUR));
    return () => cancelAnimationFrame(id);
  }, [scrollRef]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-white/70 bg-white/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
      {allDay.length > 0 && (
        <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-white/50 px-4 py-2 dark:border-white/10">
          {allDay.map((ev, i) => {
            const color = colorMap[ev.entityId] ?? CAL_COLORS[0];
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectEvent(ev)}
                className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", color.soft)}
              >
                <span className={cn("h-2 w-2 rounded-full", color.bar)} />
                {ev.summary}
              </button>
            );
          })}
        </div>
      )}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex" style={{ minHeight: 24 * HOUR_H }}>
          <div className="w-16 shrink-0">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_H }}>
                {h > 0 && (
                  <span className="absolute -top-2.5 right-3 select-none text-[11px] text-gray-400 dark:text-gray-500">
                    {String(h).padStart(2, "0")}:00
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="relative flex-1 border-l border-white/40 dark:border-white/10" style={{ minHeight: 24 * HOUR_H }}>
            {hours.map((h) => (
              <div key={h} className="absolute w-full border-t border-black/[0.04] dark:border-white/5" style={{ top: h * HOUR_H }} />
            ))}
            {isToday && (
              <div className="pointer-events-none absolute z-20 flex w-full items-center" style={{ top: (nowMinutes / 60) * HOUR_H }}>
                <div className="-ml-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent-orange" />
                <div className="h-px flex-1 bg-accent-orange" />
              </div>
            )}
            {dayEvents.map((ev, i) => {
              const start = eventStart(ev);
              const end = eventEnd(ev);
              const top = (minutesInDay(start) / 60) * HOUR_H;
              const height = Math.max(((end.getTime() - start.getTime()) / 60_000 / 60) * HOUR_H, 28);
              const color = colorMap[ev.entityId] ?? CAL_COLORS[0];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectEvent(ev)}
                  className={cn("absolute left-2 right-3 z-10 overflow-hidden rounded-2xl text-left shadow-sm", color.soft)}
                  style={{ top, height }}
                >
                  <span className={cn("absolute inset-y-0 left-0 w-1", color.bar)} />
                  <div className="px-3 py-1.5">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{ev.summary}</p>
                    {height > 36 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(start, locale)} – {formatTime(end, locale)}
                      </p>
                    )}
                    {height > 56 && ev.location && (
                      <p className="mt-0.5 truncate text-xs text-gray-400">{ev.location}</p>
                    )}
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

function AgendaSidebar({
  date,
  events,
  colorMap,
  calendarEntityIds,
  entityNames,
  hiddenCalendars,
  locale,
  t,
  onToggleCalendar,
  onSelectEvent,
  onAdd,
}: {
  date: Date;
  events: CalendarEvent[];
  colorMap: Record<string, CalColor>;
  calendarEntityIds: string[];
  entityNames: Record<string, string>;
  hiddenCalendars: Set<string>;
  locale: string;
  t: (key: string) => string;
  onToggleCalendar: (id: string) => void;
  onSelectEvent: (ev: CalendarEvent) => void;
  onAdd: () => void;
}) {
  const dayEvents = eventsOnDay(events, date);
  const dateLabel = date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <aside className="flex h-[28vh] min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-card border border-white/70 bg-white/45 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] lg:h-full lg:w-[300px]">
      <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{t("calendar.scheduled")}</h2>
          <p className="mt-0.5 text-xs capitalize text-gray-500 dark:text-gray-400">{dateLabel}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={calendarEntityIds.length === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-purple text-gray-900 shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label={t("calendar.addEvent")}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-3 scrollbar-hide">
        {calendarEntityIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center text-gray-400 dark:text-white/30">
            <Calendar className="h-8 w-8 opacity-40" />
            <p className="text-sm">{t("calendar.noCalendars")}</p>
            <p className="text-xs">{t("calendar.noCalendarsHint")}</p>
          </div>
        ) : dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center text-gray-400 dark:text-white/30">
            <Clock className="h-8 w-8 opacity-40" />
            <p className="text-sm">{t("calendar.noEvents")}</p>
          </div>
        ) : (
          dayEvents.map((ev, i) => {
            const color = colorMap[ev.entityId] ?? CAL_COLORS[0];
            const start = eventStart(ev);
            const end = eventEnd(ev);
            const timeLabel = ev.allDay
              ? t("calendar.allDay")
              : `${formatTime(start, locale)} – ${formatTime(end, locale)}`;
            const meet = looksLikeMeet(ev.location);
            return (
              <button
                key={`${ev.entityId}-${ev.start}-${i}`}
                type="button"
                onClick={() => onSelectEvent(ev)}
                className="w-full overflow-hidden rounded-2xl border border-white/60 bg-white/60 text-left shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.06]"
              >
                <div className={cn("h-1.5 w-full", color.bar)} />
                <div className="space-y-2 p-3.5">
                  <div>
                    <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                      {ev.summary || t("calendar.emptyTitle")}
                    </h3>
                    {ev.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{ev.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="tabular-nums">{timeLabel}</span>
                    <span>{durationLabel(durationMinutes(ev), t)}</span>
                  </div>
                  {ev.location && (
                    meet ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-purple/25 px-2.5 py-1 text-[11px] font-medium text-gray-800 dark:text-gray-100">
                        <Video className="h-3 w-3" />
                        {t("calendar.meetLink")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </span>
                    )
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {calendarEntityIds.length > 0 && (
        <div className="border-t border-white/50 px-4 py-3 dark:border-white/10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {t("calendar.calendars")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {calendarEntityIds.map((id, i) => {
              const color = CAL_COLORS[i % CAL_COLORS.length];
              const hidden = hiddenCalendars.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onToggleCalendar(id)}
                  className={cn(
                    "flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    hidden
                      ? "border-white/40 text-gray-400 line-through dark:border-white/10 dark:text-gray-600"
                      : "border-transparent bg-black/[0.04] text-gray-700 dark:bg-white/10 dark:text-gray-200"
                  )}
                >
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", hidden ? "bg-gray-300 dark:bg-gray-600" : color.bar)} />
                  <span className="truncate">{entityNames[id]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

function EventDetail({
  ev,
  color,
  locale,
  t,
  onClose,
}: {
  ev: CalendarEvent;
  color: CalColor;
  locale: string;
  t: (key: string) => string;
  onClose: () => void;
}) {
  const start = eventStart(ev);
  const end = eventEnd(ev);
  const meet = looksLikeMeet(ev.location);
  const href = ev.location?.startsWith("http") ? ev.location : ev.location ? `https://${ev.location}` : undefined;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-card border border-white/60 bg-white/90 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#1a1a1a]/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("h-1.5 w-full", color.bar)} />
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold leading-snug text-gray-900 dark:text-white">
              {ev.summary || t("calendar.emptyTitle")}
            </h3>
            <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 shrink-0 text-gray-400" />
              {ev.allDay ? (
                <span>
                  {start.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })} · {t("calendar.allDay")}
                </span>
              ) : (
                <span>
                  {start.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })} · {formatTime(start, locale)} – {formatTime(end, locale)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{durationLabel(durationMinutes(ev), t)}</p>
            {ev.location && (
              meet && href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-purple px-3 py-1.5 text-xs font-medium text-gray-900"
                >
                  <Video className="h-3.5 w-3.5" />
                  {t("calendar.meetLink")}
                </a>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{ev.location}</span>
                </div>
              )
            )}
            {ev.description && (
              <p className="border-t border-black/5 pt-3 text-sm leading-relaxed text-gray-500 dark:border-white/10 dark:text-gray-400">
                {ev.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateEventModal({
  calendarEntityIds,
  colorMap,
  entityNames,
  defaultDate,
  locale,
  t,
  onClose,
  onAdded,
}: {
  calendarEntityIds: string[];
  colorMap: Record<string, CalColor>;
  entityNames: Record<string, string>;
  defaultDate: Date;
  locale: string;
  t: (key: string) => string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const hour = Math.max(defaultDate.getHours(), 8);
  const [title, setTitle] = useState("");
  const [calendarId, setCalendarId] = useState(calendarEntityIds[0] ?? "");
  const [typeOpen, setTypeOpen] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(toDateKey(defaultDate));
  const [startTime, setStartTime] = useState(`${String(hour).padStart(2, "0")}:00`);
  const [endTime, setEndTime] = useState(`${String((hour + 1) % 24).padStart(2, "0")}:00`);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !calendarId) return;
    setSaving(true);
    setError(null);
    try {
      const dtstart = allDay ? date : `${date}T${startTime}:00`;
      const dtend = allDay ? date : `${date}T${endTime}:00`;
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
            ...(note.trim() ? { description: note.trim() } : {}),
          },
        }),
      });
      if (!res.ok) throw new Error("fail");
      onAdded();
      onClose();
    } catch {
      setError(t("calendar.createError"));
    } finally {
      setSaving(false);
    }
  }

  const dateObj = new Date(`${date}T12:00:00`);
  const dateLabel = dateObj.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md space-y-4 rounded-card border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#1a1a1a]/92"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("calendar.titlePlaceholder")}
            required
            autoFocus
            className="w-full bg-transparent text-2xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none dark:text-white dark:placeholder:text-gray-600"
          />
          <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <label className="block space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{t("calendar.date")}</span>
          <div className="relative">
            <p className="text-sm font-medium capitalize text-gray-800 dark:text-gray-200">{dateLabel}</p>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
          </div>
        </label>

        <div className="relative space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{t("calendar.type")}</span>
          <button
            type="button"
            onClick={() => setTypeOpen((v) => !v)}
            className="flex w-full items-center gap-2 rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm font-medium text-gray-800 dark:bg-white/5 dark:text-gray-100"
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", (colorMap[calendarId] ?? CAL_COLORS[0]).bar)} />
            <span className="flex-1 truncate text-left">{entityNames[calendarId] ?? calendarId}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {typeOpen && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-white/60 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-[#222]">
              {calendarEntityIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setCalendarId(id);
                    setTypeOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <span className={cn("h-2.5 w-2.5 rounded-full", (colorMap[id] ?? CAL_COLORS[0]).bar)} />
                  <span className="truncate text-gray-800 dark:text-gray-100">{entityNames[id] ?? id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{t("calendar.hour")}</span>
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300 accent-[#B48BFF]"
              />
              {t("calendar.allDay")}
            </label>
          </div>
          {!allDay && (
            <div className="flex items-center justify-between gap-2">
              <TimeStepper value={startTime} onChange={setStartTime} />
              <span className="text-xs text-gray-400">—</span>
              <TimeStepper value={endTime} onChange={setEndTime} />
            </div>
          )}
        </div>

        <label className="block space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{t("calendar.note")}</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("calendar.notePlaceholder")}
            rows={3}
            className="w-full resize-none rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:bg-white/5 dark:text-white"
          />
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving || !title.trim() || !calendarId}
          className="w-full rounded-2xl bg-accent-purple py-3 text-sm font-semibold text-gray-900 shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saving ? t("calendar.saving") : t("calendar.save")}
        </button>
      </form>
    </div>
  );
}

export default function CalendarPage() {
  const { t, language } = useTranslation();
  const locale = localeOf(language);
  const { calendarEntityIds } = useCalendarStore();
  const entityStates = useEntityStateStore((s) => s.states);

  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [hiddenCalendars, setHiddenCalendars] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const timeScrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const months = useMemo(() => monthNameList(locale), [locale]);

  const colorMap = Object.fromEntries(
    calendarEntityIds.map((id, i) => [id, CAL_COLORS[i % CAL_COLORS.length]])
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

  const visibleEvents = useMemo(
    () => events.filter((ev) => !hiddenCalendars.has(ev.entityId)),
    [events, hiddenCalendars]
  );

  function toggleCalendar(id: string) {
    setHiddenCalendars((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function scrollToNow() {
    const hour = new Date().getHours();
    scrollTimeGrid(timeScrollRef.current, hour < FOCUS_HOUR ? FOCUS_HOUR : hour, true);
  }

  function selectDay(day: Date) {
    setSelectedDate(day);
    setCurrentDate(day);
  }

  const loadEvents = useCallback(async () => {
    if (calendarEntityIds.length === 0) {
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      let start: Date;
      let end: Date;
      if (viewMode === "week") {
        start = startOfWeek(currentDate);
        end = addDays(start, 7);
      } else if (viewMode === "day") {
        start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        end = addDays(start, 1);
      } else {
        const days = monthGridDays(currentDate);
        start = days[0];
        end = addDays(days[days.length - 1], 1);
      }
      const res = await fetch(
        `/api/ha/calendar?entityIds=${calendarEntityIds.join(",")}&start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await res.json();
      if (Array.isArray(data.events)) setEvents(data.events);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [calendarEntityIds, viewMode, currentDate]);

  useEffect(() => {
    hydrateCalendarStore();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useLayoutEffect(() => {
    if (viewMode === "month") return;
    const frame = requestAnimationFrame(() => scrollTimeGrid(timeScrollRef.current));
    const timer = window.setTimeout(() => scrollTimeGrid(timeScrollRef.current), 120);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [viewMode]);

  function navigate(dir: -1 | 1) {
    const d = new Date(currentDate);
    if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
    else if (viewMode === "day") d.setDate(d.getDate() + dir);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
    setSelectedDate(d);
  }

  function goToday() {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  }

  function setMonthYear(month: number, year: number) {
    const d = new Date(currentDate);
    const last = new Date(year, month + 1, 0).getDate();
    d.setFullYear(year, month, Math.min(d.getDate(), last));
    setCurrentDate(d);
    setSelectedDate(d);
  }

  const showingToday =
    viewMode === "day"
      ? isSameDay(currentDate, today)
      : viewMode === "week"
        ? weekDays.some((d) => isSameDay(d, today))
        : currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);

  return (
    <AppShell activeTab="/calendar" contentNoScroll>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden lg:flex-row lg:gap-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => navigate(-1)} className="rounded-xl p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button type="button" onClick={() => navigate(1)} className="rounded-xl p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <label className="relative">
                  <span className="pointer-events-none flex items-center gap-1 text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white md:text-xl">
                    {months[currentDate.getMonth()]}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                  <select
                    value={currentDate.getMonth()}
                    onChange={(e) => setMonthYear(Number(e.target.value), currentDate.getFullYear())}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={t("calendar.month")}
                  >
                    {months.map((name, i) => (
                      <option key={name} value={i}>{name}</option>
                    ))}
                  </select>
                </label>
                <label className="relative">
                  <span className="pointer-events-none flex items-center gap-1 text-lg font-semibold text-gray-400 dark:text-gray-500 md:text-xl">
                    {currentDate.getFullYear()}
                    <ChevronDown className="h-4 w-4" />
                  </span>
                  <select
                    value={currentDate.getFullYear()}
                    onChange={(e) => setMonthYear(currentDate.getMonth(), Number(e.target.value))}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={t("calendar.date")}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </label>
              </div>

              {loading && (
                <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-accent-purple dark:border-white/20" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToday}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  showingToday
                    ? "border-accent-purple bg-accent-purple text-gray-900"
                    : "border-white/60 bg-white/40 text-gray-700 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                )}
              >
                {t("calendar.today")}
              </button>
              {viewMode !== "month" && (
                <button
                  type="button"
                  onClick={scrollToNow}
                  className="rounded-full border border-accent-orange/40 px-3 py-1.5 text-xs font-medium text-accent-orange hover:bg-accent-orange/10"
                >
                  {t("calendar.now")}
                </button>
              )}
              <div className="flex items-center rounded-full bg-black/5 p-0.5 dark:bg-white/5">
                {(["month", "week", "day"] as ViewMode[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setViewMode(v)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      viewMode === v
                        ? "bg-white text-gray-900 shadow-sm dark:bg-white/15 dark:text-white"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    )}
                  >
                    {v === "month" ? t("calendar.month") : v === "week" ? t("calendar.week") : t("calendar.day")}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                disabled={calendarEntityIds.length === 0}
                className="flex items-center gap-1.5 rounded-full bg-accent-purple px-3.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm hover:opacity-90 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("calendar.add")}
              </button>
            </div>
          </div>

          {viewMode === "month" && (
            <MonthGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={visibleEvents}
              colorMap={colorMap}
              locale={locale}
              moreLabel={t("calendar.more")}
              onSelectDay={selectDay}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {viewMode === "week" && (
            <WeekGrid
              weekDays={weekDays}
              selectedDate={selectedDate}
              events={visibleEvents}
              colorMap={colorMap}
              locale={locale}
              onSelectDay={selectDay}
              onSelectEvent={setSelectedEvent}
              scrollRef={timeScrollRef}
            />
          )}
          {viewMode === "day" && (
            <DayGrid
              date={currentDate}
              events={visibleEvents}
              colorMap={colorMap}
              locale={locale}
              onSelectEvent={setSelectedEvent}
              scrollRef={timeScrollRef}
            />
          )}
        </div>

        <AgendaSidebar
          date={selectedDate}
          events={visibleEvents}
          colorMap={colorMap}
          calendarEntityIds={calendarEntityIds}
          entityNames={entityNames}
          hiddenCalendars={hiddenCalendars}
          locale={locale}
          t={t}
          onToggleCalendar={toggleCalendar}
          onSelectEvent={setSelectedEvent}
          onAdd={() => setCreateOpen(true)}
        />
      </div>

      {selectedEvent && (
        <EventDetail
          ev={selectedEvent}
          color={colorMap[selectedEvent.entityId] ?? CAL_COLORS[0]}
          locale={locale}
          t={t}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {createOpen && (
        <CreateEventModal
          calendarEntityIds={calendarEntityIds}
          colorMap={colorMap}
          entityNames={entityNames}
          defaultDate={selectedDate}
          locale={locale}
          t={t}
          onClose={() => setCreateOpen(false)}
          onAdded={loadEvents}
        />
      )}
    </AppShell>
  );
}
