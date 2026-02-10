"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Lightbulb,
  Lamp,
  LampCeiling,
  LampDesk,
  LampFloor,
  LampWallDown,
  LampWallUp,
  MoreVertical,
} from "lucide-react";
import type { LightControlProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

const LIGHT_ICON_MAP: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  spotlight: Lamp,
  lamp: Lamp,
  "lamp-ceiling": LampCeiling,
  "lamp-desk": LampDesk,
  "lamp-floor": LampFloor,
  "lamp-wall-down": LampWallDown,
  "lamp-wall-up": LampWallUp,
};

export const LIGHT_ICON_OPTIONS = [
  "lightbulb",
  "spotlight",
  "lamp",
  "lamp-ceiling",
  "lamp-desk",
  "lamp-floor",
  "lamp-wall-down",
  "lamp-wall-up",
] as const;

/** HomeKit-style: horizontale kaart met icoon links, titel + status rechts. Duidelijke aan/uit-weergave. */
export function LightCardWidget({
  title = "Lamp",
  entity_id,
  icon: iconKey = "lightbulb",
  size = "md",
  className,
  onMoreClick,
}: LightControlProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const setStates = useEntityStateStore((s) => s.setStates);
  const [loading, setLoading] = useState(false);
  const [sliderBrightness, setSliderBrightness] = useState(100);
  const brightnessDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOn = entity?.state === "on";
  const brightnessRaw = (entity?.attributes?.brightness as number | undefined) ?? 255;
  const brightnessPct = Math.round((brightnessRaw / 255) * 100);
  const supportedFeatures = (entity?.attributes?.supported_features as number | undefined) ?? 0;
  const supportsBrightness = (supportedFeatures & 1) !== 0;

  useEffect(() => {
    setSliderBrightness(brightnessPct);
  }, [brightnessPct]);

  const refreshState = useCallback(async () => {
    const res = await fetch("/api/ha/state").then((r) => r.json());
    if (Array.isArray(res)) setStates(res);
  }, [setStates]);

  async function callLight(service: string, serviceData?: Record<string, unknown>) {
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id,
          domain: "light",
          service,
          service_data: serviceData,
        }),
      });
      if (res.ok) await refreshState();
    } finally {
      setLoading(false);
    }
  }

  function handleToggle() {
    callLight(isOn ? "turn_off" : "turn_on", isOn ? undefined : { brightness_pct: brightnessPct || 100 });
  }

  function handleBrightnessChange(pct: number) {
    setSliderBrightness(pct);
    if (brightnessDebounceRef.current) clearTimeout(brightnessDebounceRef.current);
    brightnessDebounceRef.current = setTimeout(() => {
      callLight("turn_on", { brightness_pct: pct });
      brightnessDebounceRef.current = null;
    }, 80);
  }

  useEffect(() => () => {
    if (brightnessDebounceRef.current) clearTimeout(brightnessDebounceRef.current);
  }, []);

  const IconComponent = LIGHT_ICON_MAP[iconKey] ?? Lightbulb;

  const statusText = isOn
    ? supportsBrightness
      ? `${brightnessPct}%`
      : "Aan"
    : "Uit";

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl shadow-xl border transition-colors duration-200",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        isOn
          ? "bg-white/95 dark:bg-gray-100/95 text-gray-900 border-white/40 dark:border-gray-200/40"
          : "bg-white/15 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 text-gray-800 dark:text-gray-200",
        className
      )}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="flex flex-1 min-w-0 items-center gap-4 text-left rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 -mx-1 px-1 py-0.5 transition-colors"
          aria-label={isOn ? "Lamp uitzetten" : "Lamp aanzetten"}
        >
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full transition-all duration-200",
              size === "sm" && "h-12 w-12",
              size === "md" && "h-14 w-14",
              size === "lg" && "h-16 w-16",
              isOn
                ? "bg-[#FFD41D] shadow-sm"
                : "bg-white/30 dark:bg-white/10 shadow-inner"
            )}
            aria-hidden
          >
            <IconComponent
              className={cn(
                "shrink-0 transition-colors",
                size === "sm" && "h-6 w-6",
                size === "md" && "h-7 w-7",
                size === "lg" && "h-8 w-8",
                isOn ? "text-white drop-shadow" : "text-gray-500 dark:text-gray-400"
              )}
              strokeWidth={1.5}
              fill={isOn ? "currentColor" : "none"}
              aria-hidden
            />
          </div>

          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <p className="font-semibold truncate text-inherit">{title}</p>
            <p className={cn(
              "text-sm font-medium truncate",
              isOn ? "text-gray-600 dark:text-gray-700" : "text-gray-500 dark:text-gray-400"
            )}>
              {statusText}
            </p>
          </div>
        </button>

        {onMoreClick && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
            className="p-1.5 rounded-lg shrink-0 text-inherit opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Opties"
          >
            <MoreVertical className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>

      {isOn && supportsBrightness && (
        <div className="px-4 pb-3 pt-0 flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-600 shrink-0 w-10">Helderheid</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderBrightness}
            onChange={(e) => handleBrightnessChange(Number(e.target.value))}
            disabled={loading}
            className="flex-1 h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-300 accent-amber-500 disabled:opacity-50"
            aria-label="Helderheid"
          />
          <span className="text-xs tabular-nums text-gray-600 dark:text-gray-700 w-8">{sliderBrightness}%</span>
        </div>
      )}
    </div>
  );
}
