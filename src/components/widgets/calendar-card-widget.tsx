"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

/** Compact day label for the upcoming strip (fits narrow cards; never omit). */
function upcomingDayLabel(
  start: Date,
  end: Date,
  allDay: boolean,
  today: Date,
  locale: string,
  t: (key: string) => string
): string {
  if (allDay && today >= start && today < end) return t("calendar.today");
  if (isSameDay(start, today)) return t("calendar.today");
  if (isSameDay(start, addDays(today, 1))) return t("calendar.tomorrow");
  // Short weekday + day — month omitted so the right column stays readable when resized.
  return start.toLocaleDateString(locale, { weekday: "short", day: "numeric" });
}

/**
 * Day + time for the upcoming strip — always two lines so the right column
 * stays filled at every card width (title truncates; when never does).
 */
function upcomingWhenParts(
  ev: CalendarEvent,
  today: Date,
  locale: string,
  t: (key: string) => string
): { day: string; time: string } {
  const start = eventStart(ev);
  const end = eventEnd(ev);
  const day = upcomingDayLabel(start, end, ev.allDay, today, locale, t);
  if (ev.allDay) return { day, time: t("calendar.allDay") };
  return { day, time: formatTime(start, locale) };
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
  const propW = clampCalendarCardWidth(width);
  const propH = clampCalendarCardHeight(height);
  const shellRef = useRef<HTMLDivElement>(null);
  /** Prefer the visible box (smart-stack can be 250) over a clamped prop that would overflow-clip. */
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);
  const cardW = measured?.w ?? propW;
  const cardH = measured?.h ?? propH;
  const showUpcoming = isCalendarShowUpcoming(show_upcoming);
  const isPreview = previewEvents != null;
  const [liveNow, setLiveNow] = useState(() => new Date());
  const now = previewNow ?? liveNow;
  const narrow = cardW < 340;
  const compact = cardW < 300;

  useEffect(() => {
    if (!isPreview) hydrateCalendarStore();
  }, [isPreview]);

  useEffect(() => {
    const el = shellRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box || box.width < 1 || box.height < 1) return;
      const w = Math.round(box.width);
      const h = Math.round(box.height);
      setMeasured((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  /** First remaining-today row — must not be repeated in the upcoming footer. */
  const currentListed = dayEvents[0] ?? null;

  const upcoming = useMemo(
    () => (showUpcoming ? nextUpcomingEvent(events, now, currentListed) : null),
    [showUpcoming, events, now, currentListed]
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
      ref={shellRef}
      className="relative flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden"
      // Only set explicit size when parent does not already size us (preview / floating shell).
      style={{
        width: width != null ? propW : undefined,
        height: height != null ? propH : undefined,
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {onMoreClick ? (
        <button
          type="button"
          data-no-drag
          onClick={onMoreClick}
          className="tile-kebab-hit absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label={t("editPanel.editTile")}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            // FIX: column never narrower than its longest label (WEDNESDAY / DONDERDAG / SEPTEMBER)
            "flex min-w-max shrink-0 flex-col justify-center py-4",
            compact ? "w-[34%] max-w-[5.5rem] px-3" : narrow ? "w-[36%] max-w-[7.5rem] px-3.5" : "w-[38%] max-w-[9.5rem] px-5"
          )}
        >
          <p
            className={cn(
              "font-bold leading-none tracking-tight text-gray-900 tabular-nums dark:text-white",
              compact ? "text-[2.1rem]" : "text-[2.75rem]"
            )}
          >
            {today.getDate()}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 dark:text-gray-500">
            {formatWeekday(today, locale)}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#E06B5C]">
            {formatMonth(today, locale)}
          </p>
        </div>

        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-3 py-4",
            compact || narrow ? "pr-3" : "pr-5"
          )}
        >
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
            // Grid: when-column is max-content so resize/title never steal day+time.
            "relative z-[1] grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-end border-t border-gray-200/80 pt-2.5 pb-3.5 dark:border-white/10",
            compact ? "gap-x-1.5 px-2.5" : narrow ? "gap-x-2 px-3" : "gap-x-2.5 px-5"
          )}
        >
          <span
            className={cn(
              "mb-1 h-2 w-2 shrink-0 rounded-full",
              colorMap[upcoming.entityId] ?? CAL_DOT_COLORS[0]
            )}
            aria-hidden
          />
          <div className="min-w-0 overflow-hidden">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
              {t("calendar.upcoming")}
            </p>
            <p
              className={cn(
                "truncate font-semibold leading-snug text-gray-900 dark:text-white",
                compact ? "text-xs" : "text-sm"
              )}
            >
              <EventTitle summary={upcoming.summary} empty={t("calendar.emptyTitle")} />
            </p>
          </div>
          <div className="justify-self-end whitespace-nowrap text-right leading-tight [min-width:max-content]">
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              {upcomingWhen.day}
            </p>
            <p className="tabular-nums text-xs font-semibold text-gray-600 dark:text-gray-300">
              {upcomingWhen.time}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
