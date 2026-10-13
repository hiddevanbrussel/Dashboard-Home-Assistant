"use client";

import { useEffect, useMemo, useState } from "react";
import { MediaCardWidget } from "@/components/widgets/media-card-widget";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const ENTITY_ID = "media_player.preview";

/** Dev-only preview of the media card idle / playing layouts (no Home Assistant required). */
export default function MediaCardPreviewPage() {
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setResolved = useThemeStore((s) => s.setResolved);
  const resolved = useThemeStore((s) => s.resolved);
  const [mode, setMode] = useState<"idle" | "playing">("idle");

  const entity = useMemo(() => {
    if (mode === "idle") {
      return {
        entity_id: ENTITY_ID,
        state: "idle",
        attributes: {
          friendly_name: "Roam 2",
        },
      };
    }
    return {
      entity_id: ENTITY_ID,
      state: "playing",
      attributes: {
        friendly_name: "Roam 2",
        media_title: "Midnight City",
        media_artist: "M83",
        // No entity_picture — keeps preview offline; playing layout still shows metadata.
      },
    };
  }, [mode]);

  useEffect(() => {
    setLanguage("nl");
  }, [setLanguage]);

  useEffect(() => {
    const seed = () =>
      updateEntityState(entity.entity_id, {
        state: entity.state,
        attributes: entity.attributes,
      });
    seed();
    const id = setInterval(seed, 2500);
    return () => clearInterval(id);
  }, [entity, updateEntityState]);

  return (
    <div className="min-h-screen bg-[#12141a] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-lg font-semibold">Media card preview</h1>
        <p className="mt-1 text-sm text-white/60">
          Idle lifestyle background + ready-to-play layout. No Home Assistant required.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["idle", "playing"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                mode === value ? "bg-white text-gray-900" : "bg-white/10 text-white/80"
              )}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setResolved(resolved === "dark" ? "light" : "dark")}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
          >
            theme: {resolved}
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <MediaCardWidget title="Roam 2" entity_id={ENTITY_ID} width={320} height={360} />
        </div>
      </div>
    </div>
  );
}
