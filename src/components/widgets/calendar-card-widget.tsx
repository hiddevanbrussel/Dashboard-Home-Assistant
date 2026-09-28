"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MoreVertical } from "lucide-react";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";
import { useTranslation } from "@/hooks/use-translation";
import { formatCalendarTitle, subjectCodesFor } from "@/lib/calendar-titles";
import {
  calendarVisibleEventCount,
  clampCalendarCardHeight,
  clampCalendarCardWidth,
} from "@/lib/calendar-card";
import {
  eventStart,
  eventsFromNowOnDay,
  formatTime,
  localeOf,
  toDateKey,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { hydrateCalendarStore, useCalendarStore } from "@/stores/calendar-store";

const CAL_DOT_COLORS = [
  "bg-rose-500",
  "bg-emerald-500",
  "bg-accent-orange",
  "bg-brand",
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

async function fetchRangeEvents(entityIds: string[], start: Date, end: Date): Promise<CalendarEvent[]> {
  const res = await fetch(
    `/api/ha/calendar?entityIds=${encodeURIComponent(entityIds.join(","))}&start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.events) ? (data.events as CalendarEvent[]) : [];
}

function formatWeekday(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { weekday: "long" }).toUpperCase();
}

function formatMonth(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { month: "long" }).toUpperCase();
}

export function CalendarCardWidget({
  width,
  height,
  onMoreClick,
}: {
  title?: string;
  width?: number;
  height?: number;
  onMoreClick?: () => void;
}) {
  const { t, language } = useTranslation();
  const locale = localeOf(language);
  const calendarEntityIds = useCalendarStore((s) => s.calendarEntityIds);
  const cardW = clampCalendarCardWidth(width);
  const cardH = clampCalendarCardHeight(height);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    hydrateCalendarStore();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const today = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);

  const rangeEnd = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["dashboard-calendar-card", calendarEntityIds, toDateKey(today)],
    queryFn: () => fetchRangeEvents(calendarEntityIds, today, rangeEnd),
    enabled: calendarEntityIds.length > 0,
    refetchInterval: 60_000,
  });

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    calendarEntityIds.forEach((id, i) => {
      map[id] = CAL_DOT_COLORS[i % CAL_DOT_COLORS.length];
    });
    return map;
  }, [calendarEntityIds]);

  const dayEvents = useMemo(
    () => eventsFromNowOnDay(events, today, now),
    [events, today, now]
  );

  const visibleLimit = calendarVisibleEventCount(cardH);
  const visibleEvents = dayEvents.slice(0, visibleLimit);
  const overflowCount = Math.max(0, dayEvents.length - visibleEvents.length);

  return (
    <div
      className="relative flex h-full min-h-0 w-full overflow-hidden"
      style={{ width: cardW, height: cardH }}
    >
      {onMoreClick ? (
        <button
          type="button"
          data-no-drag
          onClick={onMoreClick}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label={t("editPanel.editTile")}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      ) : null}

      <div className="flex w-[38%] max-w-[9.5rem] shrink-0 flex-col justify-center px-5 py-4 sm:px-6">
        <p className="text-[2.75rem] font-bold leading-none tracking-tight text-gray-900 tabular-nums dark:text-white">
          {today.getDate()}
        </p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 dark:text-gray-500">
          {formatWeekday(today, locale)}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#E06B5C]">
          {formatMonth(today, locale)}
        </p>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-3 py-4 pr-5 sm:pr-6">
        {calendarEntityIds.length === 0 ? (
          <div className="flex flex-col gap-1.5 text-gray-400 dark:text-white/35">
            <CalendarDays className="h-5 w-5 opacity-50" aria-hidden />
            <p className="text-sm font-medium text-gray-600 dark:text-white/70">{t("calendar.noCalendars")}</p>
            <p className="text-xs">{t("calendar.noCalendarsHint")}</p>
            <Link
              href="/settings"
              draggable={false}
              className={cn(
                "mt-0.5 text-xs font-medium text-brand hover:underline",
                onMoreClick && "pointer-events-none"
              )}
              onPointerDown={(e) => e.stopPropagation()}
              onDragStart={(e) => e.preventDefault()}
            >
              {t("nav.settings")}
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : dayEvents.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">{t("calendar.noEvents")}</p>
        ) : (
          <>
            <ul className="flex min-h-0 flex-col gap-3">
              {visibleEvents.map((ev, i) => {
                  const start = eventStart(ev);
                  const dot = colorMap[ev.entityId] ?? CAL_DOT_COLORS[0];
                return (
                  <li key={`${ev.entityId}-${ev.start}-${i}`} className="flex min-w-0 items-start gap-2.5">
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold leading-snug text-gray-900 dark:text-white">
                        <EventTitle summary={ev.summary} empty={t("calendar.emptyTitle")} />
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
                        {ev.allDay ? t("calendar.allDay") : formatTime(start, locale)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            {overflowCount > 0 ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-300 dark:text-gray-600">
                {t(overflowCount === 1 ? "calendar.moreEvent" : "calendar.moreEvents").replace(
                  "{n}",
                  String(overflowCount)
                )}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
