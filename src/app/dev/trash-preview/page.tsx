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

  // Preview matches the NL mockup typography ("Eerstvolgende" / "ophaalmoment").
  useEffect(() => {
    setLanguage("nl");
  }, [setLanguage]);

  useEffect(() => {
    const dates: Record<TrashTheme, string> = {
      gft: "2026-10-02",
      restafval: "2026-10-09",
      pmd: "2026-10-16",
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
    ]);
  }, [liveTheme, setStates]);

  return (
    <div className="min-h-screen bg-zinc-900 p-6 text-white">
      <h1 className="mb-2 text-xl font-semibold">Trash card preview</h1>
      <p className="mb-4 text-sm text-zinc-400">
        Demo themes without Home Assistant. Drag the size slider to check resize layout.
      </p>
      <label className="mb-6 flex items-center gap-3 text-sm">
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
      <div className="flex flex-wrap gap-6">
        {THEMES.map((theme) => (
          <div key={theme} className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-zinc-400">{theme}</span>
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

      <h2 className="mb-2 mt-10 text-lg font-semibold">Live type → background</h2>
      <p className="mb-4 text-sm text-zinc-400">
        Same card config; changing the mocked HA type entity must swap background / person / icon.
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
            className={`rounded-lg px-3 py-1.5 text-sm ${
              liveTheme === theme ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-200"
            }`}
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
