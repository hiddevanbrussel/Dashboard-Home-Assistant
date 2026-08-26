"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Cone,
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
import { useTranslation } from "@/hooks/use-translation";

const LIGHT_ICON_MAP: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  cone: Cone,
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
  "cone",
  "spotlight",
  "lamp",
  "lamp-ceiling",
  "lamp-desk",
  "lamp-floor",
  "lamp-wall-down",
  "lamp-wall-up",
] as const;

// ─── Color wheel ────────────────────────────────────────────────────────────

function ColorWheelPicker({
  hue,
  saturation,
  onChange,
}: {
  hue: number;
  saturation: number;
  onChange: (h: number, s: number) => void;
}) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const SIZE = 200;
  const RADIUS = SIZE / 2;
  const dragging = useRef(false);

  function pickAt(clientX: number, clientY: number) {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const x = clientX - rect.left - RADIUS;
    const y = clientY - rect.top - RADIUS;
    const dist = Math.sqrt(x * x + y * y);
    // Hue: angle from top clockwise (matches conic-gradient from 0deg)
    const h = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
    const s = Math.min(100, (dist / RADIUS) * 100);
    onChange(h, s);
  }

  // Indicator position (hue from top clockwise → sin/cos flipped vs standard)
  const hRad = (hue * Math.PI) / 180;
  const satFrac = saturation / 100;
  const indX = RADIUS + Math.sin(hRad) * satFrac * RADIUS;
  const indY = RADIUS - Math.cos(hRad) * satFrac * RADIUS;

  return (
    <div
      ref={wheelRef}
      className="relative rounded-full cursor-crosshair select-none shrink-0"
      style={{
        width: SIZE,
        height: SIZE,
        background:
          "conic-gradient(from 0deg, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        pickAt(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        pickAt(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        dragging.current = false;
        pickAt(e.clientX, e.clientY);
      }}
      onPointerCancel={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        dragging.current = false;
      }}
    >
      {/* White center for saturation */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 68%)" }}
        aria-hidden
      />
      {/* Dark edge vignette */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.3) 100%)" }}
        aria-hidden
      />
      {/* Indicator */}
      <div
        className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none"
        style={{
          left: indX - 10,
          top: indY - 10,
          backgroundColor: `hsl(${hue}, ${saturation}%, ${50 + (100 - saturation) * 0.2}%)`,
        }}
        aria-hidden
      />
    </div>
  );
}

// ─── Main widget ────────────────────────────────────────────────────────────

/** HomeKit accessory tile: square card, icon top-left, name + status at the bottom. */
export function LightCardWidget({
  title,
  entity_id,
  icon: iconKey = "lightbulb",
  size = "md",
  className,
  onMoreClick,
  editMode = false,
}: LightControlProps & { className?: string; onMoreClick?: () => void; editMode?: boolean }) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const revertEntityState = useEntityStateStore((s) => s.revertEntityState);
  const pendingRef = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"brightness" | "colortemp" | "color">("brightness");

  // Brightness
  const [sliderBrightness, setSliderBrightness] = useState(100);
  const brightnessDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBrightnessPctRef = useRef<number | null>(null);

  // Color temp
  const [sliderColorTemp, setSliderColorTemp] = useState(4000);
  const colorTempDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastColorTempRef = useRef<number | null>(null);

  // Color (HS)
  const [pickedHue, setPickedHue] = useState(0);
  const [pickedSat, setPickedSat] = useState(100);
  const colorDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Switch drag
  const [slidePosition, setSlidePosition] = useState<number | null>(null);
  const dragStartRef = useRef<{ y: number; position: number } | null>(null);

  const SWITCH_TRACK_PX = 72;
  const SWITCH_AREA_HEIGHT_PX = 200;

  // ── Entity attributes ──────────────────────────────────────────────────────
  const isOn = entity?.state === "on";
  const displayPosition = slidePosition ?? (isOn ? 1 : 0);

  const brightnessRaw = entity?.state === "on" ? ((entity?.attributes?.brightness as number | undefined) ?? 255) : 0;
  const brightnessPct = Math.round((brightnessRaw / 255) * 100);

  const supportedColorModes = (entity?.attributes?.supported_color_modes as string[] | undefined) ?? [];
  const supportedFeatures = (entity?.attributes?.supported_features as number | undefined) ?? 0;
  const supportsBrightness =
    supportedColorModes.length > 0
      ? supportedColorModes.some((m) => !["onoff"].includes(m))
      : (supportedFeatures & 1) !== 0;
  const supportsColorTemp = supportedColorModes.includes("color_temp");
  const supportsColor = supportedColorModes.some((m) => ["xy", "hs", "rgb"].includes(m));

  const colorMode = entity?.attributes?.color_mode as string | undefined;
  const hsColor = entity?.attributes?.hs_color as [number, number] | undefined;
  const colorTempK = entity?.attributes?.color_temp_kelvin as number | undefined;
  const minTempK = (entity?.attributes?.min_color_temp_kelvin as number | undefined) ?? 2000;
  const maxTempK = (entity?.attributes?.max_color_temp_kelvin as number | undefined) ?? 6500;
  const rgbColor = entity?.attributes?.rgb_color as [number, number, number] | undefined;

  // ── Sync sliders from entity ───────────────────────────────────────────────
  useEffect(() => { setSliderBrightness(brightnessPct); }, [brightnessPct]);
  useEffect(() => { if (colorTempK) setSliderColorTemp(colorTempK); }, [colorTempK]);
  useEffect(() => {
    if (hsColor) { setPickedHue(hsColor[0]); setPickedSat(hsColor[1]); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hsColor?.[0], hsColor?.[1]]);

  useEffect(() => () => {
    if (brightnessDebounceRef.current) clearTimeout(brightnessDebounceRef.current);
    if (colorTempDebounceRef.current) clearTimeout(colorTempDebounceRef.current);
    if (colorDebounceRef.current) clearTimeout(colorDebounceRef.current);
  }, []);

  // ── HA service ─────────────────────────────────────────────────────────────
  async function callLight(service: string, serviceData?: Record<string, unknown>) {
    const res = await fetch("/api/ha/call-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity_id, domain: "light", service, service_data: serviceData }),
    });
    if (!res.ok) throw new Error(`call-service failed: ${res.status}`);
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleToggle() {
    if (pendingRef.current) return;
    pendingRef.current = true;
    const nextOn = !isOn;
    const previous = entity;
    updateEntityState(entity_id, { state: nextOn ? "on" : "off" });
    callLight(nextOn ? "turn_on" : "turn_off", nextOn ? { brightness_pct: brightnessPct || 100 } : undefined)
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => { pendingRef.current = false; });
  }

  function handleBrightnessChange(pct: number) {
    setSliderBrightness(pct);
    lastBrightnessPctRef.current = pct;
    if (brightnessDebounceRef.current) clearTimeout(brightnessDebounceRef.current);
    brightnessDebounceRef.current = setTimeout(() => {
      callLight("turn_on", { brightness_pct: pct });
      brightnessDebounceRef.current = null;
      lastBrightnessPctRef.current = null;
    }, 150);
  }

  function flushBrightness() {
    if (brightnessDebounceRef.current) {
      clearTimeout(brightnessDebounceRef.current);
      brightnessDebounceRef.current = null;
    }
    const toSend = lastBrightnessPctRef.current ?? sliderBrightness;
    if (toSend != null) { lastBrightnessPctRef.current = null; callLight("turn_on", { brightness_pct: toSend }); }
  }

  function handleColorTempChange(k: number) {
    setSliderColorTemp(k);
    lastColorTempRef.current = k;
    if (colorTempDebounceRef.current) clearTimeout(colorTempDebounceRef.current);
    colorTempDebounceRef.current = setTimeout(() => {
      callLight("turn_on", { color_temp_kelvin: k });
      colorTempDebounceRef.current = null;
      lastColorTempRef.current = null;
    }, 150);
  }

  function flushColorTemp() {
    if (colorTempDebounceRef.current) {
      clearTimeout(colorTempDebounceRef.current);
      colorTempDebounceRef.current = null;
    }
    const toSend = lastColorTempRef.current ?? sliderColorTemp;
    if (toSend != null) { lastColorTempRef.current = null; callLight("turn_on", { color_temp_kelvin: toSend }); }
  }

  function handleColorChange(h: number, s: number) {
    setPickedHue(h);
    setPickedSat(s);
    if (colorDebounceRef.current) clearTimeout(colorDebounceRef.current);
    colorDebounceRef.current = setTimeout(() => {
      callLight("turn_on", { hs_color: [Math.round(h), Math.round(s)] });
      colorDebounceRef.current = null;
    }, 150);
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const IconComponent = LIGHT_ICON_MAP[iconKey] ?? Lightbulb;
  const displayName = title || t("cardType.light_card");

  const statusText = isOn
    ? colorMode === "color_temp" && colorTempK
      ? `${Math.round(colorTempK)}K`
      : supportsBrightness
        ? `${brightnessPct}%`
        : t("lightCard.on")
    : t("lightCard.off");

  const showColorDot = isOn && rgbColor && (colorMode === "xy" || colorMode === "hs");
  const accentRgb = showColorDot && rgbColor ? rgbColor : ([255, 212, 29] as const);
  const accentCss = `rgb(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]})`;
  const colorDotStyle = showColorDot ? { backgroundColor: accentCss } : undefined;
  const badgeGlow = isOn
    ? {
        backgroundColor: accentCss,
        boxShadow: `0 4px 16px rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, 0.42), inset 0 1px 0 rgba(255,255,255,0.45)`,
      }
    : undefined;

  // ── Tab configuration ──────────────────────────────────────────────────────
  const tabs = [
    ...(supportsBrightness ? [{ id: "brightness" as const, label: t("lightCard.brightness") }] : []),
    ...(supportsColorTemp ? [{ id: "colortemp" as const, label: t("lightCard.temperature") }] : []),
    ...(supportsColor ? [{ id: "color" as const, label: t("lightCard.color") }] : []),
  ];

  function openModal() {
    const defaultTab = supportsBrightness ? "brightness" : supportsColorTemp ? "colortemp" : "color";
    setActiveTab(defaultTab as "brightness" | "colortemp" | "color");
    setModalOpen(true);
  }

  // Color temp position: 0 (minK/warm) → 1 (maxK/cool)
  const tempFraction = Math.max(0, Math.min(1, (sliderColorTemp - minTempK) / (maxTempK - minTempK)));

  const iconBadge = (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
        isOn ? "text-white" : "bg-white/25 text-white/70 shadow-inner dark:bg-white/[0.14] dark:text-white/55"
      )}
      style={badgeGlow}
      aria-hidden
    >
      <IconComponent
        className="h-[22px] w-[22px] shrink-0"
        strokeWidth={isOn ? 1.75 : 1.6}
        fill="currentColor"
        aria-hidden
      />
    </div>
  );

  const titleBlock = (
    <div className="flex min-w-0 flex-col items-start text-left">
      <p className="line-clamp-2 text-[13px] font-semibold leading-tight tracking-[-0.01em] text-inherit">
        {displayName}
      </p>
      <p
        className={cn(
          "mt-0.5 truncate text-[12px] font-medium leading-none",
          isOn ? "text-gray-500" : "text-white/55"
        )}
      >
        {statusText}
      </p>
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-card p-3.5 transition-[background-color,border-color,box-shadow,color,transform] duration-200",
        size === "sm" && "min-h-[8.25rem]",
        size === "md" && "min-h-[10rem]",
        size === "lg" && "min-h-[11.75rem]",
        isOn
          ? "border border-white/70 bg-white/95 text-gray-900 shadow-[0_8px_28px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/40 dark:bg-[#f3f3f5] dark:text-gray-900"
          : "border border-white/20 bg-white/[0.12] text-white/90 shadow-[0_8px_28px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/45 dark:text-white/90",
        !editMode && "select-none",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {editMode ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center">{iconBadge}</div>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95"
            aria-label={isOn ? t("lightCard.turnOff") : t("lightCard.turnOn")}
          >
            {iconBadge}
          </button>
        )}

        {onMoreClick && (
          <button
            type="button"
            data-no-drag
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className={cn(
              "shrink-0 rounded-full p-1 opacity-70 transition-colors",
              isOn ? "text-gray-600 hover:bg-black/5 hover:opacity-100" : "text-white/80 hover:bg-white/10 hover:opacity-100"
            )}
            aria-label={t("lightCard.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {editMode ? (
        <div className="min-w-0">{titleBlock}</div>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="min-w-0 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          aria-label={t("lightCard.control")}
        >
          {titleBlock}
        </button>
      )}

      {modalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
              type="button"
              className="absolute inset-0 z-[100] bg-black/40 dark:bg-black/50 backdrop-blur-md cursor-pointer"
              aria-label={t("lightCard.closeModal")}
              onClick={() => setModalOpen(false)}
            />
            <div
              className="relative z-[101] w-full max-w-sm p-5 flex flex-col items-center text-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title + status */}
              <div>
                <h3 className="text-[22px] font-semibold tracking-tight text-white">{displayName}</h3>
                <p className="text-sm text-white/60 mt-1 flex items-center justify-center gap-1.5">
                  {showColorDot && (
                    <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" style={colorDotStyle} aria-hidden />
                  )}
                  {activeTab === "brightness" ? `${sliderBrightness}%` : activeTab === "colortemp" ? `${Math.round(sliderColorTemp)}K` : t("lightCard.color")}
                </p>
              </div>

              {/* Tab bar (only when multiple capabilities) */}
              {tabs.length > 1 && (
                <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-3.5 py-1 rounded-full text-xs font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-white/70 hover:text-white"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Brightness tab ── */}
              {activeTab === "brightness" && supportsBrightness && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative flex flex-col items-center w-36 h-72">
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 flex w-24 h-72 flex-col justify-end overflow-hidden rounded-[48px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_12px_40px_rgba(0,0,0,0.35)]"
                      style={{ background: "rgba(40,40,44,0.82)" }}
                    >
                      <div
                        className="w-full min-h-0 rounded-b-[48px] transition-[height] duration-150 ease-out"
                        style={{ height: `${sliderBrightness}%`, backgroundColor: accentCss }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderBrightness}
                      onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                      onInput={(e) => handleBrightnessChange(Number((e.target as HTMLInputElement).value))}
                      onPointerUp={flushBrightness}
                      onPointerLeave={flushBrightness}
                      className="absolute top-1/2 left-1/2 w-72 h-24 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize opacity-0 [&::-webkit-slider-thumb]:cursor-ns-resize"
                      style={{ transform: "translate(-50%, -50%) rotate(-90deg)" }}
                      aria-label={t("lightCard.brightness")}
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white drop-shadow" strokeWidth={1.6} fill="currentColor" aria-hidden />
                    </div>
                  </div>
                </div>
              )}

              {/* ── No-brightness toggle (only tab) ── */}
              {activeTab === "brightness" && !supportsBrightness && (
                <div
                  className="flex flex-col items-center rounded-[38px] bg-gradient-to-br from-gray-600/60 to-gray-700/80 dark:from-gray-800/70 dark:to-gray-900/90 pt-3 pb-4 w-[100px]"
                  style={{ height: SWITCH_AREA_HEIGHT_PX + 12 + 16 }}
                >
                  <div
                    className="relative w-[100px] flex flex-col justify-end select-none shrink-0"
                    style={{ height: SWITCH_AREA_HEIGHT_PX, paddingBottom: SWITCH_TRACK_PX, touchAction: "none" }}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                      dragStartRef.current = { y: e.clientY, position: displayPosition };
                      setSlidePosition(displayPosition);
                    }}
                    onPointerMove={(e) => {
                      if (dragStartRef.current == null) return;
                      e.preventDefault();
                      const deltaY = dragStartRef.current.y - e.clientY;
                      const next = Math.max(0, Math.min(1, dragStartRef.current.position + deltaY / SWITCH_TRACK_PX));
                      setSlidePosition(next);
                    }}
                    onPointerUp={(e) => {
                      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
                      if (dragStartRef.current == null) return;
                      const moved = Math.abs(displayPosition - dragStartRef.current.position) > 0.15;
                      if (!moved) {
                        handleToggle();
                      } else {
                        const committedOn = displayPosition > 0.5;
                        if (committedOn !== isOn) {
                          const previous = entity;
                          updateEntityState(entity_id, { state: committedOn ? "on" : "off" });
                          callLight(committedOn ? "turn_on" : "turn_off", committedOn ? { brightness_pct: 100 } : undefined)
                            .catch(() => revertEntityState(entity_id, previous));
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
                    <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none" style={{ height: SWITCH_TRACK_PX }} aria-hidden />
                    <button
                      type="button"
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 w-20 h-[131px] rounded-[28px] flex items-center justify-center shadow-lg select-none touch-none",
                        "transition-colors duration-200 disabled:opacity-70",
                        displayPosition > 0.5 ? "bg-[#FFD41D]" : "bg-gray-600/80 dark:bg-gray-700/80"
                      )}
                      style={{
                        bottom: SWITCH_TRACK_PX,
                        transform: `translate(-50%, ${(1 - displayPosition) * SWITCH_TRACK_PX}px)`,
                        transition: slidePosition != null ? "none" : "transform 0.15s ease-out",
                      }}
                      aria-label={displayPosition > 0.5 ? t("lightCard.turnOff") : t("lightCard.turnOn")}
                    >
                      <IconComponent
                        className={cn("h-9 w-9 shrink-0 transition-colors", displayPosition > 0.5 ? "text-white drop-shadow" : "text-white/70")}
                        strokeWidth={1.5}
                        fill={displayPosition > 0.5 ? "currentColor" : "none"}
                        aria-hidden
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Color temperature tab ── */}
              {activeTab === "colortemp" && supportsColorTemp && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative flex flex-col items-center w-36 h-72">
                    {/* Gradient bar: warm (bottom) → cool (top) */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-72 overflow-hidden rounded-[48px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_12px_40px_rgba(0,0,0,0.35)]"
                      style={{
                        background: "linear-gradient(to top, #FF8C00, #FFB347, #FFD580, #FFFAE0, #FFFFFF, #D0E8FF, #A8D0FF)",
                      }}
                    />
                    {/* Indicator dot at current position */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white shadow-xl pointer-events-none transition-[top] duration-150"
                      style={{
                        top: `calc(${(1 - tempFraction) * 100}% - 16px)`,
                        backgroundColor: `hsl(${30 + tempFraction * 180}, ${90 - tempFraction * 40}%, ${60 + tempFraction * 10}%)`,
                      }}
                      aria-hidden
                    />
                    {/* Transparent range input */}
                    <input
                      type="range"
                      min={minTempK}
                      max={maxTempK}
                      step={50}
                      value={sliderColorTemp}
                      onChange={(e) => handleColorTempChange(Number(e.target.value))}
                      onInput={(e) => handleColorTempChange(Number((e.target as HTMLInputElement).value))}
                      onPointerUp={flushColorTemp}
                      onPointerLeave={flushColorTemp}
                      className="absolute top-1/2 left-1/2 w-64 h-28 opacity-0 cursor-ns-resize"
                      style={{ transform: "translate(-50%, -50%) rotate(-90deg)" }}
                      aria-label={t("lightCard.colorTemp")}
                    />
                  </div>
                  {/* Min / max labels */}
                  <div className="flex w-28 justify-between text-xs text-white/50">
                    <span>{minTempK}K</span>
                    <span>{maxTempK}K</span>
                  </div>
                </div>
              )}

              {/* ── Color tab ── */}
              {activeTab === "color" && supportsColor && (
                <div className="flex flex-col items-center gap-3">
                  <ColorWheelPicker hue={pickedHue} saturation={pickedSat} onChange={handleColorChange} />
                  <p className="text-xs text-white/50">
                    {Math.round(pickedHue)}° · {Math.round(pickedSat)}%
                  </p>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
