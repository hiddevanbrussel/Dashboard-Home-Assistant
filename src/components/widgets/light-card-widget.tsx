"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderBrightness, setSliderBrightness] = useState(100);
  const brightnessDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [slidePosition, setSlidePosition] = useState<number | null>(null);
  const dragStartRef = useRef<{ y: number; position: number } | null>(null);

  const SWITCH_TRACK_PX = 72;
  const SWITCH_AREA_HEIGHT_PX = 200; /* hoogte van het sleepgebied; doos wordt hierop + padding berekend */
  const isOn = entity?.state === "on";
  const displayPosition = slidePosition ?? (isOn ? 1 : 0);
  /* 0 = bottom (uit), 1 = top (aan); transform uses (1 - position) so thumb moves up when on */

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
    const nextOn = !isOn;
    updateEntityState(entity_id, { state: nextOn ? "on" : "off" });
    callLight(nextOn ? "turn_on" : "turn_off", nextOn ? { brightness_pct: brightnessPct || 100 } : undefined);
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
        "flex w-full flex-col overflow-hidden rounded-2xl transition-colors duration-200",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        isOn
          ? "text-gray-900 dark:text-gray-900"
          : "text-gray-800 dark:text-gray-200 opacity-95",
        className
      )}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className="flex shrink-0 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70 h-10 w-10"
          aria-label={isOn ? "Lamp uitzetten" : "Lamp aanzetten"}
        >
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
              isOn
                ? "bg-[#FFD41D] shadow-sm dark:bg-[#FFD41D] dark:shadow-sm"
                : "bg-white/30 dark:bg-white/10 shadow-inner"
            )}
            aria-hidden
          >
            <IconComponent
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isOn ? "text-white drop-shadow dark:text-white dark:drop-shadow" : "text-gray-500 dark:text-gray-400"
              )}
              strokeWidth={1.5}
              fill={isOn ? "currentColor" : "none"}
              aria-hidden
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex flex-1 min-w-0 items-center gap-2 text-left rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 -mx-1 px-1 py-0.5 transition-colors"
          aria-label="Verlichting bedienen"
        >
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <p className="text-xs font-medium truncate text-inherit">{title}</p>
            <p className={cn(
              "text-xs truncate",
              isOn ? "text-gray-600 dark:text-gray-600" : "text-gray-500 dark:text-gray-400"
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

      {modalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
              type="button"
              className="absolute inset-0 z-[100] bg-black/40 dark:bg-black/50 backdrop-blur-md cursor-pointer"
              aria-label="Modal sluiten"
              onClick={() => setModalOpen(false)}
            />
            <div
              className={cn(
                "relative z-[101] w-full max-w-sm p-5 flex flex-col items-center text-center",
                isOn && supportsBrightness ? "min-h-[420px]" : "min-h-[380px]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {isOn && supportsBrightness ? (
                <>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-6">
                    {sliderBrightness}%
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative flex flex-col items-center w-20 h-64">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-64 rounded-2xl bg-gray-700/80 dark:bg-gray-800/80 flex flex-col justify-end overflow-hidden">
                        <div
                          className="w-full rounded-b-2xl bg-[#FFD41D] min-h-0 transition-[height] duration-150 ease-out"
                          style={{ height: `${sliderBrightness}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={sliderBrightness}
                        onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                        onInput={(e) => handleBrightnessChange(Number((e.target as HTMLInputElement).value))}
                        disabled={loading}
                        className="absolute top-1/2 left-1/2 w-64 h-20 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize opacity-0 [&::-webkit-slider-thumb]:cursor-ns-resize"
                        style={{ transform: "translate(-50%, -50%) rotate(-90deg)" }}
                        aria-label="Helderheid"
                      />
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center w-10 h-10 rounded-full bg-amber-400/40">
                        <IconComponent className="h-5 w-5 text-white drop-shadow" strokeWidth={1.5} fill="currentColor" aria-hidden />
                      </div>
                    </div>
                  </div>
                </>
              ) : supportsBrightness ? (
                <>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {isOn ? "Aan" : "Uit"}
                  </p>
                  <div className="flex gap-3 w-full max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => { if (!isOn) handleToggle(); setModalOpen(false); }}
                      disabled={loading}
                      className={cn(
                        "flex-1 rounded-xl py-3 px-4 text-sm font-medium transition-colors",
                        isOn ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : "bg-[#FFD41D] text-gray-900 hover:opacity-90"
                      )}
                    >
                      Aan
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (isOn) handleToggle(); setModalOpen(false); }}
                      disabled={loading}
                      className={cn(
                        "flex-1 rounded-xl py-3 px-4 text-sm font-medium transition-colors",
                        !isOn ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : "bg-gray-800 text-white dark:bg-gray-600 dark:text-white hover:opacity-90"
                      )}
                    >
                      Uit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-6">
                    {isOn ? "Aan" : "Uit"}
                  </p>
                  <div
                    className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-gray-600/60 to-gray-700/80 dark:from-gray-800/70 dark:to-gray-900/90 pt-3 pb-4 w-[100px]"
                    style={{ height: SWITCH_AREA_HEIGHT_PX + 12 + 16 }}
                  >
                    <div
                      className="relative w-[100px] flex flex-col justify-end select-none shrink-0"
                      style={{ height: SWITCH_AREA_HEIGHT_PX, paddingBottom: SWITCH_TRACK_PX, touchAction: "none" }}
                      onPointerDown={(e) => {
                        if (loading) return;
                        e.preventDefault();
                        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                        dragStartRef.current = { y: e.clientY, position: displayPosition };
                        setSlidePosition(displayPosition);
                      }}
                      onPointerMove={(e) => {
                        if (dragStartRef.current == null) return;
                        e.preventDefault();
                        const deltaY = dragStartRef.current.y - e.clientY;
                        const deltaPos = deltaY / SWITCH_TRACK_PX;
                        const next = Math.max(0, Math.min(1, dragStartRef.current.position + deltaPos));
                        setSlidePosition(next);
                      }}
                      onPointerUp={(e) => {
                        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
                        if (dragStartRef.current == null) return;
                        const startPos = dragStartRef.current.position;
                        const moved = Math.abs(displayPosition - startPos) > 0.15;
                        if (!moved) {
                          handleToggle();
                        } else {
                          const committedOn = displayPosition > 0.5;
                          if (committedOn !== isOn) {
                            updateEntityState(entity_id, { state: committedOn ? "on" : "off" });
                            callLight(committedOn ? "turn_on" : "turn_off", committedOn ? { brightness_pct: 100 } : undefined);
                          }
                        }
                        dragStartRef.current = null;
                        setSlidePosition(null);
                      }}
                      onPointerCancel={(e) => {
                        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
                        dragStartRef.current = null;
                        setSlidePosition(null);
                      }}
                    >
                      <div
                        className="absolute left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none"
                        style={{ height: SWITCH_TRACK_PX }}
                        aria-hidden
                      />
                      <button
                        type="button"
                        disabled={loading}
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2 w-20 h-[131px] rounded-xl flex items-center justify-center shadow-lg select-none touch-none",
                          "transition-colors duration-200 disabled:opacity-70",
                          displayPosition > 0.5 ? "bg-[#FFD41D]" : "bg-gray-600/80 dark:bg-gray-700/80"
                        )}
                        style={{
                          bottom: SWITCH_TRACK_PX,
                          transform: `translate(-50%, ${(1 - displayPosition) * SWITCH_TRACK_PX}px)`,
                          transition: slidePosition != null ? "none" : "transform 0.15s ease-out",
                        }}
                        aria-label={displayPosition > 0.5 ? "Lamp uitzetten" : "Lamp aanzetten"}
                      >
                        <IconComponent
                          className={cn(
                            "h-9 w-9 shrink-0 transition-colors",
                            displayPosition > 0.5 ? "text-white drop-shadow" : "text-white/70"
                          )}
                          strokeWidth={1.5}
                          fill={displayPosition > 0.5 ? "currentColor" : "none"}
                          aria-hidden
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body
        )}

      {isOn && supportsBrightness && (
        <div className="px-4 pb-3 pt-0 flex items-center gap-2">
          <span className={cn("text-xs shrink-0 w-10", isOn ? "text-gray-500 dark:text-gray-500" : "text-gray-500 dark:text-gray-600")}>Helderheid</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderBrightness}
            onChange={(e) => handleBrightnessChange(Number(e.target.value))}
            disabled={loading}
            className={cn(
              "flex-1 h-2 rounded-full appearance-none accent-amber-500 disabled:opacity-50",
              isOn ? "bg-gray-200 dark:bg-gray-200" : "bg-gray-200 dark:bg-gray-300"
            )}
            aria-label="Helderheid"
          />
          <span className={cn("text-xs tabular-nums w-8", isOn ? "text-gray-600 dark:text-gray-600" : "text-gray-600 dark:text-gray-700")}>{sliderBrightness}%</span>
        </div>
      )}
    </div>
  );
}
