"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/app/api/ha/calendar/route";
import { CalendarCardWidget } from "@/components/widgets/calendar-card-widget";
import {
  CALENDAR_CARD_DEFAULT_HEIGHT,
  CALENDAR_CARD_DEFAULT_WIDTH,
} from "@/lib/calendar-card";
import { addDays, toDateKey } from "@/lib/calendar-utils";
import { useLanguageStore } from "@/stores/language-store";
import { cn } from "@/lib/utils";

function fixtureEvents(now: Date): CalendarEvent[] {
  const today = toDateKey(now);
  const tomorrow = toDateKey(addDays(now, 1));
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const laterHour = Math.min(22, Math.max(now.getHours() + 2, 15));
  const later = `${y}-${m}-${d}T${String(laterHour).padStart(2, "0")}:00:00`;
  const laterEnd = `${y}-${m}-${d}T${String(laterHour + 1).padStart(2, "0")}:00:00`;
  return [
    {
      entityId: "calendar.home",
      summary: "Team sync",
      start: later,
      end: laterEnd,
      allDay: false,
    },
    {
      entityId: "calendar.home",
      summary: "School pickup",
      start: `${y}-${m}-${d}T${String(Math.min(23, laterHour + 3)).padStart(2, "0")}:30:00`,
      end: `${y}-${m}-${d}T${String(Math.min(23, laterHour + 4)).padStart(2, "0")}:00:00`,
      allDay: false,
    },
    {
      entityId: "calendar.family",
      summary: "Dentist",
      start: `${tomorrow}T10:00:00`,
      end: `${tomorrow}T10:45:00`,
      allDay: false,
    },
    {
      entityId: "calendar.family",
      summary: "All-day note",
      start: today,
      end: tomorrow,
      allDay: true,
    },
  ];
}

/** Empty today + tomorrow morning — matches narrow stack footer case (“Morgen · 08:30”). */
function emptyTodayTomorrowEvents(now: Date): CalendarEvent[] {
  const tomorrow = toDateKey(addDays(now, 1));
  return [
    {
      entityId: "calendar.school",
      summary: "Filosofie",
      start: `${tomorrow}T08:30:00`,
      end: `${tomorrow}T09:20:00`,
      allDay: false,
    },
  ];
}

/** Dev-only calendar card preview with upcoming strip (no HA). */
export default function CalendarCardPreviewPage() {
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const now = useMemo(() => new Date(), []);
  const events = useMemo(() => fixtureEvents(now), [now]);

  useEffect(() => {
    setLanguage("nl");
  }, [setLanguage]);

  const narrowEmptyToday = useMemo(() => emptyTodayTomorrowEvents(now), [now]);

  const cards = [
    {
      key: "default",
      label: "Default",
      w: CALENDAR_CARD_DEFAULT_WIDTH,
      h: CALENDAR_CARD_DEFAULT_HEIGHT + 40,
      events,
    },
    {
      key: "narrow-tomorrow",
      label: "280 empty-today (stack)",
      w: 280,
      h: 280,
      events: narrowEmptyToday,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#ece7df] p-6 text-gray-900">
      <h1 className="mb-1 text-xl font-semibold">Calendar card preview</h1>
      <p className="mb-4 text-sm text-gray-600">Upcoming strip toggle + day’s agenda (fixture data).</p>
      <label className="mb-4 flex w-fit items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={showUpcoming}
          onChange={(e) => setShowUpcoming(e.target.checked)}
        />
        Opkomende afspraak tonen
      </label>
      <div className="flex flex-wrap gap-6">
        {cards.map((card) => (
          <div key={card.key}>
            <p className="mb-2 text-xs font-medium text-gray-500">
              {card.label} · {card.w}×{card.h}
            </p>
            <div
              className={cn(
                "glass-surface overflow-hidden rounded-2xl shadow-xl",
                "bg-white/80 dark:bg-black/40"
              )}
            >
              <CalendarCardWidget
                width={card.w}
                height={card.h}
                show_upcoming={showUpcoming}
                previewEvents={card.events}
                previewNow={now}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
