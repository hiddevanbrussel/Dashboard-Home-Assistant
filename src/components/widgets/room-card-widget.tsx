"use client";

import { useState, useCallback } from "react";
import { Lightbulb, Disc2, MoreVertical, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { CARD_ICONS } from "./card-icons";
import type { RoomCardProps } from "./widget-types";

function formatEntityValue(state: string | undefined, attributes: Record<string, unknown> | undefined): string {
  if (state == null || state === "unavailable" || state === "unknown") return "—";
  const num = Number(state);
  if (!Number.isNaN(num)) {
    const unit = (attributes?.unit as string) ?? "";
    if (Number.isInteger(num)) return `${num}${unit ? ` ${unit}` : ""}`;
    return `${Math.round(num * 100) / 100}${unit ? ` ${unit}` : ""}`;
  }
  return String(state);
}

const DEFAULT_ICON_BG = "#3B82F6";

const BASE_CARD_WIDTH = 280;
const BASE_CARD_HEIGHT = 120;
const BASE_ICON_CIRCLE = 130;
const BASE_ICON_SIZE = 52;

export function RoomCardWidget({
  title = "Kamer",
  entity_id,
  icon = "Home",
  light_entity_id,
  media_player_entity_id,
  climate_entity_id,
  background_image,
  icon_background_color,
  width,
  height,
  className,
  embedded,
  onMoreClick,
  onCardClick,
}: RoomCardProps & { className?: string; embedded?: boolean; width?: number; height?: number; onMoreClick?: () => void; onCardClick?: () => void }) {
  const entity = useEntityStateStore((s) => (entity_id ? s.getState(entity_id) : null));
  const lightEntity = useEntityStateStore((s) =>
    light_entity_id ? s.getState(light_entity_id) : null
  );
  const mediaEntity = useEntityStateStore((s) =>
    media_player_entity_id ? s.getState(media_player_entity_id) : null
  );
  const climateEntity = useEntityStateStore((s) =>
    climate_entity_id ? s.getState(climate_entity_id) : null
  );
  const setStates = useEntityStateStore((s) => s.setStates);
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);

  const [loading, setLoading] = useState(false);
  const isLightOn = lightEntity?.state === "on";
  const isMediaPlaying = mediaEntity && (mediaEntity.state === "playing" || mediaEntity.state === "paused");

  const refreshState = useCallback(async () => {
    const res = await fetch("/api/ha/state").then((r) => r.json());
    if (Array.isArray(res)) setStates(res);
  }, [setStates]);

  const toggleLight = useCallback(async () => {
    if (!light_entity_id) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: light_entity_id,
          domain: "light",
          service: isLightOn ? "turn_off" : "turn_on",
          service_data: isLightOn ? undefined : { brightness_pct: 100 },
        }),
      });
      if (res.ok) {
        updateEntityState(light_entity_id, { state: isLightOn ? "off" : "on" });
        await refreshState();
      }
    } finally {
      setLoading(false);
    }
  }, [light_entity_id, isLightOn, updateEntityState, refreshState]);

  const IconComponent = CARD_ICONS[icon] ?? CARD_ICONS.Home;
  const isConfigured = Boolean(entity_id?.trim());
  const w = width ?? BASE_CARD_WIDTH;
  const h = height ?? BASE_CARD_HEIGHT;
  const scale = Math.min(w / BASE_CARD_WIDTH, h / BASE_CARD_HEIGHT, 2);
  const iconCircleSize = Math.round(BASE_ICON_CIRCLE * scale);
  const iconSize = Math.round(BASE_ICON_SIZE * scale);
  const entityValue = isConfigured
    ? formatEntityValue(entity?.state, entity?.attributes)
    : null;

  const climateTemp = climateEntity?.attributes?.current_temperature ?? climateEntity?.state;
  const tempStr =
    climateTemp != null && !Number.isNaN(Number(climateTemp))
      ? `${Number(climateTemp).toFixed(1)}°`
      : null;

  return (
    <div
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={onCardClick ? (e) => { if (!(e.target as HTMLElement).closest("button")) onCardClick(); } : undefined}
      onKeyDown={onCardClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCardClick(); } } : undefined}
      className={cn(
        "relative flex h-full w-full min-h-0 overflow-hidden rounded-2xl",
        embedded
          ? "bg-transparent"
          : "bg-white/10 dark:bg-black/50 shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10",
        !embedded && !isConfigured && "border-2 border-dashed border-gray-300 dark:border-white/20",
        onCardClick && "cursor-pointer hover:ring-2 hover:ring-[#4D2FB2]/30 transition-shadow",
        className
      )}
      style={height != null ? { minHeight: height } : undefined}
    >
      {background_image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background_image})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/35 dark:bg-black/50" aria-hidden />
        </>
      )}
      <div
        className="absolute left-0 bottom-0 translate-x-[-20%] translate-y-[20%] flex items-center justify-center rounded-full text-white shadow-lg"
        style={{
          backgroundColor: icon_background_color || DEFAULT_ICON_BG,
          width: iconCircleSize,
          height: iconCircleSize,
        }}
        aria-hidden
      >
        <span className="inline-flex items-center justify-center" style={{ width: iconSize, height: iconSize }} aria-hidden>
          <IconComponent className="h-full w-full" />
        </span>
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div
          className="flex flex-1 flex-col items-end justify-between min-w-0 px-4 pt-3 pb-3 text-right min-h-0"
          style={{ paddingLeft: Math.max(24, iconCircleSize * 0.35) }}
        >
          <div className="flex items-center gap-2 w-full justify-end min-w-0 shrink-0">
            <div className="min-w-0 flex-1 flex flex-col items-end">
              <p className={cn(
                "text-base font-medium truncate w-full drop-shadow-sm",
                background_image ? "text-white" : embedded ? "text-gray-900 dark:text-white/90" : "text-gray-900 dark:text-white"
              )}>
                {title}
              </p>
              <p className={cn(
                "text-xs truncate w-full mt-0.5",
                background_image ? "text-white/90" : embedded ? "text-gray-600 dark:text-white/70" : "text-gray-500 dark:text-gray-400"
              )}>
                {isConfigured ? entityValue : (!entity_id && !light_entity_id && !media_player_entity_id ? "Kies entiteiten in bewerken" : null)}
              </p>
            </div>
            {onMoreClick && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
                className={cn(
                  "p-1.5 rounded-lg shrink-0 transition-colors",
                  background_image ? "text-white/80 hover:text-white hover:bg-white/20" : embedded ? "text-gray-500 hover:text-gray-800 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
                )}
                aria-label="Bewerken"
              >
                <MoreVertical className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
          <div className="mt-auto flex shrink-0 items-center gap-2">
            {climate_entity_id && (
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full h-9 px-2.5 transition-all duration-200",
                  embedded
                    ? "bg-gray-300 text-gray-600 dark:bg-white/20 dark:text-white/60"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                )}
                title={tempStr ?? "Klimaat"}
                aria-hidden
              >
                <Thermometer className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                {tempStr && <span className="text-xs font-medium">{tempStr}</span>}
              </div>
            )}
            {media_player_entity_id && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full h-9 w-9 transition-all duration-200",
                  isMediaPlaying
                    ? embedded
                      ? "bg-[#4D2FB2] text-white"
                      : "bg-[#4D2FB2] text-white shadow-sm"
                    : embedded
                      ? "bg-gray-300 text-gray-600 dark:bg-white/20 dark:text-white/60"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                )}
                aria-hidden
                title={isMediaPlaying ? "Media speelt af" : "Geen media"}
              >
                <Disc2
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isMediaPlaying && "animate-spin"
                  )}
                  strokeWidth={isMediaPlaying ? 2 : 1.5}
                  fill="none"
                  aria-hidden
                />
              </div>
            )}
            {light_entity_id && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleLight(); }}
                disabled={loading}
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full h-9 w-9 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70",
                  embedded
                    ? isLightOn
                      ? "bg-[#FFD41D] text-white"
                      : "bg-gray-300 text-gray-600 dark:bg-white/20 dark:text-white/60"
                    : isLightOn
                      ? "bg-[#FFD41D] text-white shadow-sm"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                )}
                aria-label={isLightOn ? "Lamp uitzetten" : "Lamp aanzetten"}
              >
                <Lightbulb
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.5}
                  fill={isLightOn ? "currentColor" : "none"}
                  aria-hidden
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
