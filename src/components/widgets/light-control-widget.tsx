"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Lightbulb } from "lucide-react";
import type { LightControlProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

export function LightControlWidget({
  title = "Light",
  entity_id,
  state = "off",
  size = "md",
  className,
}: LightControlProps & { className?: string }) {
  const isOn = state === "on";
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderBrightness, setSliderBrightness] = useState(0);
  const setStates = useEntityStateStore((s) => s.setStates);
  const entityState = useEntityStateStore((s) => s.getState(entity_id));

  const brightnessRaw = (entityState?.attributes?.brightness as number | undefined) ?? 0;
  const brightnessPct = Math.round((brightnessRaw / 255) * 100);
  const displayBrightness = modalOpen ? sliderBrightness : brightnessPct;

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
      else {
        const data = await res.json().catch(() => ({}));
        console.error("Light service failed:", data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCardClick() {
    setModalOpen(true);
  }

  async function handleIconClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await callLight("toggle");
  }

  async function handleModalToggle() {
    await callLight(isOn ? "turn_off" : "turn_on", isOn ? undefined : { brightness_pct: brightnessPct || 100 });
  }

  const brightnessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleBrightnessChange(pct: number) {
    setSliderBrightness(pct);
    if (brightnessTimeoutRef.current) clearTimeout(brightnessTimeoutRef.current);
    brightnessTimeoutRef.current = setTimeout(() => {
      callLight("turn_on", { brightness_pct: pct });
      brightnessTimeoutRef.current = null;
    }, 120);
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(); } }}
        className={cn(
          "flex w-full items-start gap-3 rounded-2xl text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4D2FB2] cursor-pointer",
          isOn
            ? "bg-white shadow-sm dark:bg-white"
            : "bg-white/60 dark:bg-white/10 backdrop-blur-md",
          size === "sm" && "p-3",
          size === "md" && "p-4",
          size === "lg" && "p-5",
          className
        )}
        aria-label={`Open ${title} controls`}
      >
        <button
          type="button"
          onClick={handleIconClick}
          disabled={loading}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4D2FB2] disabled:opacity-70",
            isOn
              ? ""
              : "bg-white/50 dark:bg-white/10 backdrop-blur-md",
            size === "sm" && "h-9 w-9",
            size === "md" && "h-10 w-10",
            size === "lg" && "h-11 w-11"
          )}
          style={isOn ? { backgroundColor: "#FFD41D" } : undefined}
          aria-label={isOn ? `Turn off ${title}` : `Turn on ${title}`}
          aria-pressed={isOn}
        >
          <Lightbulb
            className={cn(
              iconSizes[size],
              "transition-colors duration-300 ease-out",
              isOn ? "text-white" : "text-[#FFD41D]"
            )}
            strokeWidth={1.5}
            fill={isOn ? "currentColor" : "none"}
          />
        </button>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-semibold truncate",
              isOn
                ? "text-gray-900"
                : "text-gray-900 dark:text-white",
              size === "sm" && "text-sm",
              size === "md" && "text-base",
              size === "lg" && "text-lg"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "font-medium",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base",
              isOn
                ? "text-gray-700"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {isOn ? "On" : "Off"}
        </p>
      </div>
    </div>

      {modalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-md transition-opacity duration-200 ease-out"
              aria-hidden
              onClick={() => setModalOpen(false)}
            />
            <div className="relative z-50 w-full max-w-sm rounded-2xl border-0 bg-gray-800 p-6 shadow-xl dark:bg-gray-900 transition-transform duration-300 ease-out">
              <div className="text-center mb-1">
                <h3 className="text-lg font-semibold text-white truncate">
                  {title}
                </h3>
                <p className="text-sm text-white/80 mt-0.5">
                  {displayBrightness}%
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 mt-6">
                {/* Vertical brightness slider with fill from bottom */}
                <div className="flex flex-col items-center gap-2 touch-none select-none">
                  <div className="relative w-24 h-56 flex flex-col items-center" style={{ touchAction: "none" }}>
                    {/* Track with fill from bottom */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-52 rounded-full bg-gray-600 flex flex-col justify-end overflow-hidden pointer-events-none">
                      <div
                        className="w-full rounded-full bg-white min-h-0 shrink-0 will-change-[height]"
                        style={{
                          height: `${displayBrightness}%`,
                          transition: "height 0.2s ease-out",
                        }}
                      />
                    </div>
                    {/* Vertical range: tall touch area (h-24 = 96px wide after rotate), rotated 0=bottom 100=top */}
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={displayBrightness}
                      onInput={(e) => handleBrightnessChange(Number((e.target as HTMLInputElement).value))}
                      onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                      disabled={loading}
                      className="absolute top-0 left-1/2 w-52 h-24 -translate-x-1/2 -rotate-90 origin-center opacity-0 cursor-ns-resize disabled:cursor-not-allowed"
                      style={{ pointerEvents: "auto" }}
                    />
                    {/* Bulb toggle at bottom of slider, no background */}
                    <button
                      type="button"
                      onClick={handleModalToggle}
                      disabled={loading}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full disabled:opacity-60 transition-opacity duration-300 ease-out"
                      aria-label={isOn ? "Turn off" : "Turn on"}
                    >
                      <Lightbulb
                        className="h-6 w-6 text-[#FFD41D] transition-opacity duration-300 ease-out"
                        strokeWidth={1.5}
                        fill="currentColor"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>,
          document.body
        )}
    </>
  );
}
