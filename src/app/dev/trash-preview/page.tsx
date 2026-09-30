"use client";

import { useState } from "react";
import { TrashCardWidget } from "@/components/widgets/trash-card-widget";
import {
  TRASH_CARD_DEFAULT_HEIGHT,
  TRASH_CARD_DEFAULT_WIDTH,
  type TrashTheme,
} from "@/lib/trash-card";

const THEMES: TrashTheme[] = ["gft", "restafval", "pmd"];

/** Dev-only preview of trash card themes (no HA required). */
export default function TrashPreviewPage() {
  const [size, setSize] = useState({ w: TRASH_CARD_DEFAULT_WIDTH, h: TRASH_CARD_DEFAULT_HEIGHT });

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
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
