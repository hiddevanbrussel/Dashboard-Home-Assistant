"use client";

import { useEffect, useState } from "react";
import { TrashCardWidget } from "@/components/widgets/trash-card-widget";
import {
  TRASH_CARD_DEFAULT_HEIGHT,
  TRASH_CARD_DEFAULT_WIDTH,
  type TrashTheme,
} from "@/lib/trash-card";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const THEMES: TrashTheme[] = ["gft", "restafval", "pmd"];
const LIVE_TYPE_ENTITY = "sensor.dev_trash_next_type";
const LIVE_DATE_ENTITY = "sensor.dev_trash_next_date";

const LIVE_LABELS: Record<TrashTheme, string> = {
  gft: "Gft",
  restafval: "Restafval",
  pmd: "PMD",
};

/** Dev-only preview of trash card themes (no HA required). */
export default function TrashPreviewPage() {
  const [size, setSize] = useState({ w: TRASH_CARD_DEFAULT_WIDTH, h: TRASH_CARD_DEFAULT_HEIGHT });
  const [liveTheme, setLiveTheme] = useState<TrashTheme>("gft");
  const setStates = useEntityStateStore((s) => s.setStates);
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const setResolved = useThemeStore((s) => s.setResolved);
  const resolved = useThemeStore((s) => s.resolved);

  useEffect(() => {
    setLanguage("nl");
  }, [setLanguage]);

  useEffect(() => {
    // Keep live preview dates in the future relative to "today" so the schedule
    // never features a stale past collection day.
    const fridayOffset = (weeks: number) => {
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      const daysUntilFri = (5 - d.getDay() + 7) % 7;
      d.setDate(d.getDate() + daysUntilFri + weeks * 7);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const dates: Record<TrashTheme, string> = {
      gft: fridayOffset(0),
      restafval: fridayOffset(1),
      pmd: fridayOffset(2),
    };
    setStates([
      {
        entity_id: LIVE_TYPE_ENTITY,
        state: LIVE_LABELS[liveTheme],
        attributes: { friendly_name: "Next waste type" },
      },
      {
        entity_id: LIVE_DATE_ENTITY,
        state: dates[liveTheme],
        attributes: { friendly_name: "Next waste date" },
      },
      // Sibling fraction sensors so upcoming rows use real future dates too.
      {
        entity_id: "sensor.dev_trash_gft",
        state: dates.gft,
        attributes: { friendly_name: "Gft" },
      },
      {
        entity_id: "sensor.dev_trash_restafval",
        state: dates.restafval,
        attributes: { friendly_name: "Restafval" },
      },
      {
        entity_id: "sensor.dev_trash_pmd",
        state: dates.pmd,
        attributes: { friendly_name: "PMD" },
      },
    ]);
  }, [liveTheme, setStates]);

  return (
    <div
      className={cn(
        "min-h-screen p-6 transition-colors",
        resolved === "dark" ? "bg-zinc-900 text-white" : "bg-[#E8ECF2] text-gray-900"
      )}
    >
      <h1 className="mb-2 text-xl font-semibold">Trash card preview</h1>
      <p className={cn("mb-4 text-sm", resolved === "dark" ? "text-zinc-400" : "text-gray-500")}>
        Quiet schedule layout in light and dark theme. Drag the size slider to check resize.
      </p>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-3 text-sm">
          Size {size.w}×{size.h}
          <input
            type="range"
            min={240}
            max={420}
            value={size.w}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSize({ w: v, h: v });
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            const next = resolved === "dark" ? "light" : "dark";
            setThemeMode(next);
            setResolved(next);
          }}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            resolved === "dark" ? "bg-white/10 text-white/80" : "bg-black/5 text-gray-700"
          )}
        >
          theme: {resolved}
        </button>
      </div>
      <div className="flex flex-wrap gap-6">
        {THEMES.map((theme) => (
          <div key={theme} className="flex flex-col gap-2">
            <span
              className={cn(
                "text-xs uppercase tracking-wide",
                resolved === "dark" ? "text-zinc-400" : "text-gray-500"
              )}
            >
              {theme}
            </span>
            <div style={{ width: size.w, height: size.h }}>
              <TrashCardWidget
                title=""
                entity_id=""
                demo_theme={theme}
                width={size.w}
                height={size.h}
                onMoreClick={() => undefined}
              />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-2 mt-10 text-lg font-semibold">Live type → schedule</h2>
      <p className={cn("mb-4 text-sm", resolved === "dark" ? "text-zinc-400" : "text-gray-500")}>
        Same card config; changing the mocked HA type entity updates the featured fraction.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme}
            type="button"
            onClick={() => {
              setLiveTheme(theme);
              updateEntityState(LIVE_TYPE_ENTITY, { state: LIVE_LABELS[theme] });
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm",
              liveTheme === theme
                ? "bg-white text-zinc-900 shadow-sm"
                : resolved === "dark"
                  ? "bg-zinc-800 text-zinc-200"
                  : "bg-black/5 text-gray-700"
            )}
          >
            {theme}
          </button>
        ))}
      </div>
      <div style={{ width: size.w, height: size.h }}>
        <TrashCardWidget
          title=""
          entity_id={LIVE_TYPE_ENTITY}
          date_entity_id={LIVE_DATE_ENTITY}
          demo_theme="gft"
          width={size.w}
          height={size.h}
        />
      </div>
    </div>
  );
}
