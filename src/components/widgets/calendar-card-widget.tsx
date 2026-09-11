"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MoreVertical } from "lucide-react";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";
import { useTranslation } from "@/hooks/use-translation";
import { formatCalendarTitle, subjectCodesFor } from "@/lib/calendar-titles";
import {
  addDays,
  currentOrNextActivity,
  eventsOnDay,
  eventEnd,
  eventStart,
  formatTime,
  highlightedEventIndex,
  isSameDay,
  localeOf,
  startOfWeek,
  toDateKey,
  weekDayNames,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { hydrateCalendarStore, useCalendarStore } from "@/stores/calendar-store";
import { getScreensaverClock24h } from "@/stores/screensaver-store";

const CAL_COLORS = [
  "bg-accent-purple",
  "bg-accent-orange",
  "bg-accent-green",
  "bg-accent-yellow",
  "bg-cyan-400",
  "bg-pink-400",
] as const;

function useFormattedEventTitle(summary: string) {
  const { language } = useTranslation();
  const custom = useCalendarStore((s) => s.titleCodes);
  return useMemo(
    () => formatCalendarTitle(summary, subjectCodesFor(language, custom)),
    [summary, language, custom]
  );
}

function EventTitle({ summary, empty }: { summary: string; empty: string }) {
  const formatted = useFormattedEventTitle(summary);
  return <>{formatted.title || empty || summary}</>;
}

function EventTitleDetail({ summary }: { summary: string }) {
  const formatted = useFormattedEventTitle(summary);
  if (!formatted.detail) return null;
  return <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">{formatted.detail}</p>;
}

function timeParts(date: Date, locale: string): { time: string; period?: string } {
  const parts = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const period = parts.find((p) => p.type === "dayPeriod")?.value;
  return { time: `${hour}:${minute}`, period };
}

function formatClock(now: Date, locale: string, use24h: boolean): string {
  return now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24h,
  });
}

async function fetchRangeEvents(entityIds: string[], start: Date, end: Date): Promise<CalendarEvent[]> {
  const res = await fetch(
    `/api/ha/calendar?entityIds=${encodeURIComponent(entityIds.join(","))}&start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.events) ? (data.events as CalendarEvent[]) : [];
}

export function CalendarCardWidget({
  title,
  onMoreClick,
}: {
  title?: string;
  onMoreClick?: () => void;
}) {
  const { t, language } = useTranslation();
  const locale = localeOf(language);
  const calendarEntityIds = useCalendarStore((s) => s.calendarEntityIds);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [now, setNow] = useState(() => new Date());
  const [use24h, setUse24h] = useState(true);

  useEffect(() => {
    hydrateCalendarStore();
  }, []);

  useEffect(() => {
    const sync = () => setUse24h(getScreensaverClock24h());
    sync();
    const onSetting = () => sync();
    window.addEventListener("screensaver-setting-changed", onSetting);
    return () => window.removeEventListener("screensaver-setting-changed", onSetting);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekdayLabels = useMemo(() => weekDayNames(locale, "short"), [locale]);
  const today = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);

  const rangeStart = weekStart.getTime() <= startOfWeek(today).getTime() ? weekStart : startOfWeek(today);
  const rangeEnd = addDays(weekStart.getTime() >= startOfWeek(today).getTime() ? weekStart : startOfWeek(today), 7);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["dashboard-calendar", calendarEntityIds, toDateKey(rangeStart), toDateKey(rangeEnd)],
    queryFn: () => fetchRangeEvents(calendarEntityIds, rangeStart, rangeEnd),
    enabled: calendarEntityIds.length > 0,
    refetchInterval: 60_000,
  });

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    calendarEntityIds.forEach((id, i) => {
      map[id] = CAL_COLORS[i % CAL_COLORS.length];
    });
    return map;
  }, [calendarEntityIds]);

  const dayEvents = useMemo(() => eventsOnDay(events, selectedDate), [events, selectedDate]);
  const highlightIndex = useMemo(
    () => highlightedEventIndex(events, selectedDate, now),
    [events, selectedDate, now]
  );
  const nowActivity = useMemo(
    () => currentOrNextActivity(events, today, now),
    [events, today, now]
  );
  const daysWithEvents = useMemo(() => {
    const keys = new Set<string>();
    for (const day of weekDays) {
      if (eventsOnDay(events, day).length > 0) keys.add(toDateKey(day));
    }
    return keys;
  }, [events, weekDays]);

  const dateLabel = selectedDate.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const customTitle = title?.trim() ?? "";
  const heading =
    !customTitle || /^(activity|activiteit|calendar|kalender|calendar card)$/i.test(customTitle)
      ? t("calendar.activity")
      : customTitle;
  const clockLabel = formatClock(now, locale, use24h);
  const nowStatusLabel =
    nowActivity?.status === "current"
      ? t("calendar.now")
      : nowActivity?.status === "next"
        ? t("calendar.upNext")
        : null;

  const shiftWeek = useCallback((delta: number) => {
    setSelectedDate((prev) => addDays(prev, delta * 7));
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="shrink-0 px-6 pb-1 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-white" aria-live="polite">
              {clockLabel}
            </p>
            {nowActivity && nowStatusLabel ? (
              <div className="mt-2 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {nowStatusLabel}
                </p>
                <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                  <EventTitle summary={nowActivity.event.summary} empty={t("calendar.emptyTitle")} />
                </p>
                <EventTitleDetail summary={nowActivity.event.summary} />
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {nowActivity.event.allDay
                    ? t("calendar.allDay")
                    : `${formatTime(eventStart(nowActivity.event), locale)} – ${formatTime(eventEnd(nowActivity.event), locale)}`}
                </p>
              </div>
            ) : calendarEntityIds.length > 0 && !isLoading ? (
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{t("calendar.noCurrentActivity")}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <Link
              href="/calendar"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-black/5 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-200"
              aria-label={t("calendar.openCalendar")}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <CalendarDays className="h-4 w-4" />
            </Link>
            {onMoreClick && (
              <button
                type="button"
                onClick={onMoreClick}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={t("editPanel.editTile")}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 px-5 pb-1 pt-5">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{heading}</h2>
          <p className="mt-0.5 text-xs capitalize text-gray-500 dark:text-gray-400">{dateLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 px-3 pb-3 pt-2">
        <button
          type="button"
          onClick={() => shiftWeek(-1)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
          aria-label={t("calendar.prevWeek")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="grid min-w-0 flex-1 grid-cols-7 gap-0.5" role="tablist" aria-label={t("calendar.week")}>
          {weekDays.map((day, i) => {
            const selected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);
            const hasEvents = daysWithEvents.has(toDateKey(day));
            return (
              <button
                key={toDateKey(day)}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center rounded-xl px-0.5 py-1.5 transition-colors",
                  selected ? "text-gray-900 dark:text-white" : "text-gray-400 hover:bg-black/5 dark:text-gray-500 dark:hover:bg-white/10",
                  isToday && !selected && "text-gray-700 dark:text-gray-200"
                )}
              >
                <span className={cn("text-sm font-semibold tabular-nums leading-none", selected && "text-gray-900 dark:text-white")}>
                  {day.getDate()}
                </span>
                <span className="mt-1 text-[10px] font-medium capitalize leading-none">
                  {weekdayLabels[i]}
                </span>
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 rounded-full",
                    selected ? "bg-accent-green" : hasEvents ? "bg-gray-300 dark:bg-white/25" : "bg-transparent"
                  )}
                />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => shiftWeek(1)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
          aria-label={t("calendar.nextWeek")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {!isSameDay(selectedDate, today) && (
        <div className="px-5 pb-2">
          <button
            type="button"
            onClick={() => setSelectedDate(today)}
            className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-black/[0.07] dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15"
          >
            {t("calendar.today")}
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 scrollbar-hide">
        {calendarEntityIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-2 py-10 text-center text-gray-400 dark:text-white/30">
            <CalendarDays className="h-8 w-8 opacity-40" />
            <p className="text-sm">{t("calendar.noCalendars")}</p>
            <p className="text-xs">{t("calendar.noCalendarsHint")}</p>
            <Link
              href="/settings"
              className="mt-1 text-xs font-medium text-accent-purple hover:underline"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {t("nav.settings")}
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-purple border-t-transparent" />
          </div>
        ) : dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-2 py-10 text-center text-gray-400 dark:text-white/30">
            <Clock className="h-8 w-8 opacity-40" />
            <p className="text-sm">{t("calendar.noEvents")}</p>
          </div>
        ) : (
          <ol className="relative space-y-3 pt-1">
            <span className="absolute bottom-2 left-[3.1rem] top-2 w-px bg-gray-200/80 dark:bg-white/10" aria-hidden />
            {dayEvents.map((ev, i) => {
              const colorBar = colorMap[ev.entityId] ?? CAL_COLORS[0];
              const start = eventStart(ev);
              const end = eventEnd(ev);
              const highlighted = i === highlightIndex;
              const parts = ev.allDay ? null : timeParts(start, locale);
              return (
                <li key={`${ev.entityId}-${ev.start}-${i}`} className="relative flex gap-3">
                  <div className="w-12 shrink-0 pt-2 text-right">
                    {ev.allDay ? (
                      <p className="text-[10px] font-medium leading-tight text-gray-400">{t("calendar.allDay")}</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold tabular-nums leading-none text-gray-700 dark:text-gray-200">
                          {parts?.time}
                        </p>
                        {parts?.period && (
                          <p className="mt-0.5 text-[10px] capitalize leading-none text-gray-400">{parts.period}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="relative min-w-0 flex-1">
                    {highlighted && (
                      <span className="absolute -left-[calc(0.75rem+5px)] top-5 z-10 h-2.5 w-2.5 rounded-full bg-accent-purple" />
                    )}
                    <div
                      className={cn(
                        "overflow-hidden rounded-2xl border text-left shadow-sm",
                        highlighted
                          ? "border-accent-purple/30 bg-[repeating-linear-gradient(-45deg,rgba(180,139,255,0.22),rgba(180,139,255,0.22)_10px,rgba(180,139,255,0.08)_10px,rgba(180,139,255,0.08)_20px)] dark:border-accent-purple/25 dark:bg-[repeating-linear-gradient(-45deg,rgba(180,139,255,0.18),rgba(180,139,255,0.18)_10px,rgba(180,139,255,0.06)_10px,rgba(180,139,255,0.06)_20px)]"
                          : "border-black/[0.06] bg-white/80 dark:border-white/10 dark:bg-white/[0.06]"
                      )}
                    >
                      <span className={cn("block h-1 w-full", colorBar)} />
                      <div className="px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          <EventTitle summary={ev.summary} empty={t("calendar.emptyTitle")} />
                        </p>
                        <EventTitleDetail summary={ev.summary} />
                        {!ev.allDay && (
                          <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">
                            {formatTime(start, locale)} – {formatTime(end, locale)}
                          </p>
                        )}
                        {ev.location && !/^https?:\/\//i.test(ev.location) && (
                          <p className="mt-0.5 truncate text-[11px] text-gray-400">{ev.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
