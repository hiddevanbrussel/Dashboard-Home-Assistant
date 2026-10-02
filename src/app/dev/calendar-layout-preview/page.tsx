"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";
import {
  addDays,
  ALL_DAY_ROW_H,
  CALENDAR_FOCUS_HOUR,
  DEFAULT_HOUR_H,
  eventEnd,
  eventStart,
  formatTime,
  gridHours,
  hoursFromFocus,
  layoutAllDayWeek,
  layoutTimedOverlaps,
  startOfWeek,
  timedEventFrame,
  timedOnDay,
  toDateKey,
  weekDayNames,
} from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

const COLORS = [
  { bar: "bg-brand", soft: "bg-brand/15" },
  { bar: "bg-accent-orange", soft: "bg-accent-orange/20" },
];

/** Fixture week matching the reported tablet screenshot (Mon 28 Sep – Sun 4 Oct 2026). */
function fixtureEvents(): CalendarEvent[] {
  return [
    {
      entityId: "calendar.henm",
      summary: "Marieke training",
      start: "2026-09-30T09:00:00",
      end: "2026-09-30T12:00:00",
      allDay: false,
    },
    {
      entityId: "calendar.henm",
      summary: "Belletje bellen",
      start: "2026-09-30T10:00:00",
      end: "2026-09-30T10:30:00",
      allDay: false,
    },
    {
      entityId: "calendar.magister",
      summary: "Melanie Zijlstra-Hofmeijer jarig",
      start: "2026-10-01",
      end: "2026-10-02",
      allDay: true,
    },
    {
      entityId: "calendar.henm",
      summary: "Sanne naar John jarig",
      start: "2026-10-01",
      end: "2026-10-02",
      allDay: true,
    },
    {
      entityId: "calendar.henm",
      summary: "Optie weekendje Karin",
      start: "2026-10-02",
      end: "2026-10-05",
      allDay: true,
    },
    {
      entityId: "calendar.magister",
      summary: "Latijn",
      start: "2026-10-02T08:30:00",
      end: "2026-10-02T09:20:00",
      allDay: false,
    },
    {
      entityId: "calendar.magister",
      summary: "Franse taal",
      start: "2026-10-02T09:25:00",
      end: "2026-10-02T10:15:00",
      allDay: false,
    },
  ];
}

const WEEK_GRID_COLS = "grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]";

/** Dev-only week layout preview (no Home Assistant). */
export default function CalendarLayoutPreviewPage() {
  const locale = "nl-NL";
  const labels = weekDayNames(locale, "short");
  const weekStart = startOfWeek(new Date(2026, 8, 30));
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const events = useMemo(() => fixtureEvents(), []);
  const allDay = useMemo(() => layoutAllDayWeek(events, weekDays), [events, weekDays]);
  const hours = gridHours().slice(0, 8); // 06–13 for compact preview
  const hourH = DEFAULT_HOUR_H;

  return (
    <div className="min-h-screen bg-[#ece7df] p-6 text-gray-900">
      <h1 className="mb-2 text-xl font-semibold">Calendar layout preview</h1>
      <p className="mb-4 max-w-3xl text-sm text-gray-600">
        Fixture week with overlapping timed events (WO 30) and a multi-day all-day bar (VR–ZO).
        Columns must stay equal width; overlaps render side-by-side.
      </p>

      <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/50 shadow-sm backdrop-blur">
        <div className={cn("grid border-b border-black/5", WEEK_GRID_COLS)}>
          <div />
          {weekDays.map((day, i) => (
            <div key={toDateKey(day)} className="flex min-w-0 flex-col items-center gap-1 border-l border-black/5 px-1 py-2">
              <span className="text-[10px] font-medium uppercase text-gray-400">{labels[i]}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold">{day.getDate()}</span>
            </div>
          ))}
        </div>

        <div className={cn("grid border-b border-black/5", WEEK_GRID_COLS)}>
          <div className="flex items-start justify-end px-1 py-1">
            <span className="text-[9px] text-gray-400">Hele dag</span>
          </div>
          <div className="relative col-span-7 min-w-0" style={{ height: Math.max(allDay.rowCount, 1) * ALL_DAY_ROW_H }}>
            <div className="pointer-events-none absolute inset-0 grid grid-cols-7">
              {weekDays.map((day) => (
                <div key={`bg-${toDateKey(day)}`} className="min-w-0 border-l border-black/5" />
              ))}
            </div>
            {allDay.items.map((item, i) => {
              const color = item.event.entityId.includes("magister") ? COLORS[0] : COLORS[1];
              const leftPct = (item.startDay / 7) * 100;
              const widthPct = ((item.endDay - item.startDay + 1) / 7) * 100;
              return (
                <div
                  key={i}
                  className={cn("absolute overflow-hidden rounded-md", color.soft)}
                  style={{
                    top: item.row * ALL_DAY_ROW_H + 1,
                    height: ALL_DAY_ROW_H - 3,
                    left: `calc(${leftPct}% + 2px)`,
                    width: `calc(${widthPct}% - 4px)`,
                  }}
                >
                  <span className={cn("absolute inset-y-0 left-0 w-0.5", color.bar)} />
                  <span className="block truncate px-1.5 pl-2 text-[9px] font-medium leading-[18px]">{item.event.summary}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={cn("grid", WEEK_GRID_COLS)} style={{ minHeight: hours.length * hourH }}>
          <div className="relative min-w-0">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: hourH }}>
                <span className="absolute right-2 -top-2.5 text-[10px] text-gray-400">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>
          {weekDays.map((day) => {
            const laidOut = layoutTimedOverlaps(timedOnDay(events, day));
            return (
              <div key={toDateKey(day)} className="relative min-w-0 border-l border-black/5" style={{ minHeight: hours.length * hourH }}>
                {hours.map((h) => (
                  <div
                    key={h}
                    className="absolute w-full border-t border-black/[0.04]"
                    style={{ top: hoursFromFocus(h) * hourH }}
                  />
                ))}
                {laidOut.map((item, ei) => {
                  const start = eventStart(item.event);
                  const end = eventEnd(item.event);
                  const { top, height } = timedEventFrame(start, end, hourH, 22);
                  const color = item.event.entityId.includes("magister") ? COLORS[0] : COLORS[1];
                  return (
                    <div
                      key={ei}
                      className={cn("absolute overflow-hidden rounded-lg", color.soft)}
                      style={{
                        top,
                        height,
                        left: `calc(${item.left * 100}% + 2px)`,
                        width: `calc(${item.width * 100}% - 4px)`,
                      }}
                      data-testid={item.columns > 1 ? "overlap-event" : "solo-event"}
                    >
                      <span className={cn("absolute inset-y-0 left-0 w-0.5", color.bar)} />
                      <div className="px-1.5 py-0.5 pl-2">
                        <p className="truncate text-[10px] font-semibold">{item.event.summary}</p>
                        {height > 30 && (
                          <p className="text-[9px] text-gray-500">{formatTime(start, locale)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Focus hour {CALENDAR_FOCUS_HOUR}:00 · all-day rows {allDay.rowCount} · overlapping WO events side-by-side
      </p>
    </div>
  );
}
