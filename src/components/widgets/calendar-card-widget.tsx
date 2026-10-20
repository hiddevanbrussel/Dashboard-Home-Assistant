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
  isCalendarShowUpcoming,
} from "@/lib/calendar-card";
import {
  addDays,
  eventEnd,
  eventStart,
  eventsFromNowOnDay,
  formatTime,
  isSameDay,
  localeOf,
  nextUpcomingEvent,
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

/** How far ahead to look for the upcoming footer when enabled. */
const UPCOMING_LOOKAHEAD_DAYS = 14;

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

/** Day / time for the upcoming strip — day above time when not today (fits narrow cards). */
function upcomingWhenParts(
  ev: CalendarEvent,
  today: Date,
  locale: string,
  t: (key: string) => string
): { day?: string; time: string } {
  const start = eventStart(ev);
  if (ev.allDay) {
    if (today >= start && today < eventEnd(ev)) {
      return { time: t("calendar.allDay") };
    }
    if (isSameDay(start, addDays(today, 1))) {
      return { day: t("calendar.tomorrow"), time: t("calendar.allDay") };
    }
    return {
      time: start.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }),
    };
  }
  const time = formatTime(start, locale);
  if (isSameDay(start, today)) return { time };
  if (isSameDay(start, addDays(today, 1))) {
    return { day: t("calendar.tomorrow"), time };
  }
  return {
    day: start.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }),
    time,
  };
}

export function CalendarCardWidget({
  width,
  height,
  show_upcoming,
  previewEvents,
  previewNow,
  onMoreClick,
}: {
  title?: string;
  width?: number;
  height?: number;
  /** Show next appointment strip at the bottom (default on). */
  show_upcoming?: boolean;
  /** Dev/preview: skip HA fetch and render these events. */
  previewEvents?: CalendarEvent[];
  /** Dev/preview: fixed “now” for stable upcoming selection. */
  previewNow?: Date;
  onMoreClick?: () => void;
}) {
  const { t, language } = useTranslation();
  const locale = localeOf(language);
  const calendarEntityIds = useCalendarStore((s) => s.calendarEntityIds);
  const cardW = clampCalendarCardWidth(width);
  const cardH = clampCalendarCardHeight(height);
  const showUpcoming = isCalendarShowUpcoming(show_upcoming);
  const isPreview = previewEvents != null;
  const [liveNow, setLiveNow] = useState(() => new Date());
  const now = previewNow ?? liveNow;

  useEffect(() => {
    if (!isPreview) hydrateCalendarStore();
  }, [isPreview]);

  useEffect(() => {
    if (isPreview || previewNow) return;
    const id = window.setInterval(() => setLiveNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, [isPreview, previewNow]);

  const today = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);

  const rangeEnd = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + (showUpcoming ? UPCOMING_LOOKAHEAD_DAYS : 1));
    return d;
  }, [today, showUpcoming]);

  const entityIds = isPreview
    ? Array.from(new Set(previewEvents.map((ev) => ev.entityId)))
    : calendarEntityIds;

  const { data: fetchedEvents = [], isLoading } = useQuery({
    queryKey: [
      "dashboard-calendar-card",
      entityIds,
      toDateKey(today),
      showUpcoming ? UPCOMING_LOOKAHEAD_DAYS : 1,
    ],
    queryFn: () => fetchRangeEvents(entityIds, today, rangeEnd),
    enabled: !isPreview && entityIds.length > 0,
    refetchInterval: 60_000,
  });

  const events = isPreview ? previewEvents : fetchedEvents;

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    entityIds.forEach((id, i) => {
      map[id] = CAL_DOT_COLORS[i % CAL_DOT_COLORS.length];
    });
    return map;
  }, [entityIds]);

  const dayEvents = useMemo(
    () => eventsFromNowOnDay(events, today, now),
    [events, today, now]
  );

  const upcoming = useMemo(
    () => (showUpcoming ? nextUpcomingEvent(events, now) : null),
    [showUpcoming, events, now]
  );

  const upcomingWhen = useMemo(
    () => (upcoming ? upcomingWhenParts(upcoming, today, locale, t) : null),
    [upcoming, today, locale, t]
  );

  const visibleLimit = calendarVisibleEventCount(cardH, { showUpcoming: showUpcoming && !!upcoming });
  const visibleEvents = dayEvents.slice(0, visibleLimit);
  const overflowCount = Math.max(0, dayEvents.length - visibleEvents.length);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
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

      <div className="flex min-h-0 flex-1">
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
          {entityIds.length === 0 ? (
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

      {showUpcoming && upcoming && upcomingWhen ? (
        <div
          className={cn(
            "relative z-[1] flex shrink-0 items-end gap-2 border-t border-gray-200/80 py-2 dark:border-white/10",
            // Narrow stack frames (~250–300): tighter padding; day stacks above time on the right.
            cardW < 340 ? "px-3" : "px-5 sm:px-6"
          )}
        >
          <span
            className={cn(
              "mb-1.5 h-2 w-2 shrink-0 rounded-full",
              colorMap[upcoming.entityId] ?? CAL_DOT_COLORS[0]
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
              {t("calendar.upcoming")}
            </p>
            <p className="truncate text-sm font-semibold leading-snug text-gray-900 dark:text-white">
              <EventTitle summary={upcoming.summary} empty={t("calendar.emptyTitle")} />
            </p>
          </div>
          <div className="shrink-0 self-end text-right leading-tight">
            {upcomingWhen.day ? (
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                {upcomingWhen.day}
              </p>
            ) : null}
            <p className="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
              {upcomingWhen.time}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
