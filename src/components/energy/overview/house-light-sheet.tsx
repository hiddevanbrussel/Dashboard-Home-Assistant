"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Lightbulb } from "lucide-react";
import { callHouseLight } from "@/components/energy/overview/house-light-call";
import { HouseLightNotice } from "@/components/energy/overview/house-light-notice";
import { useTranslation } from "@/hooks/use-translation";
import {
  houseLightZoneNameKey,
  houseLightZoneState,
  type HouseLightZoneId,
} from "@/lib/energy-now";
import type { OverviewOrientation } from "@/lib/energy-house-anchors";
import { cn } from "@/lib/utils";
import { useEntityStateStore, type EntityState } from "@/stores/entity-state-store";
import { useEnergyStore } from "@/stores/energy-store";

const DRAG_GAP_MS = 250;
const KEY_WAIT_MS = 400;
const IGNORE_MS = 1500;

type Confirmed = {
  on: boolean;
  brightnessPct: number;
  kelvin: number;
  entity: EntityState | undefined;
};

function fill(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) out = out.split(`{${key}}`).join(value);
  return out;
}

function focusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter(
    (node) => !node.hasAttribute("disabled")
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function stepFromKey(key: string, current: number, min: number, max: number): number | null {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return clamp(current + 1, min, max);
    case "ArrowLeft":
    case "ArrowDown":
      return clamp(current - 1, min, max);
    case "PageUp":
      return clamp(current + 10, min, max);
    case "PageDown":
      return clamp(current - 10, min, max);
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return null;
  }
}

/** Light controls for one room. The group entity is one light. */
export function HouseLightSheet({
  zoneId,
  orientation,
  reducedMotion,
  returnFocus,
  notice,
  flushRef,
  onClose,
  onNotice,
  onNoticeDone,
  onUserAction,
}: {
  zoneId: HouseLightZoneId;
  orientation: OverviewOrientation;
  reducedMotion: boolean;
  returnFocus: RefObject<HTMLElement | null>;
  notice: string | null;
  flushRef: RefObject<(() => void) | null>;
  onClose: () => void;
  onNotice: (message: string) => void;
  onNoticeDone: () => void;
  onUserAction: () => void;
}) {
  const { t, language } = useTranslation();
  const lighting = useEnergyStore((state) => state.lighting);
  const states = useEntityStateStore((state) => state.states);
  const updateEntityState = useEntityStateStore((state) => state.updateEntityState);
  const revertEntityState = useEntityStateStore((state) => state.revertEntityState);
  const zone = houseLightZoneState(lighting, states, zoneId);
  const unreachable = zone.status === "unavailable" || zone.status === "unlinked";
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const switchRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const mounted = useRef(true);
  const seq = useRef(0);
  const ignoreUntil = useRef(0);
  const dragging = useRef<"brightness" | "kelvin" | null>(null);
  const lastDragAt = useRef({ brightness: 0, kelvin: 0 });
  const keyTimer = useRef<number | null>(null);
  const fromKey = useRef(false);
  const brightnessRef = useRef(1);
  const kelvinRef = useRef(zone.kelvin);
  const [brightness, setBrightness] = useState(() => clamp(zone.brightnessPct || 1, 1, 100));
  const [kelvin, setKelvin] = useState(zone.kelvin);
  brightnessRef.current = brightness;
  kelvinRef.current = kelvin;
  const confirmed = useRef<Confirmed>({
    on: zone.status === "on",
    brightnessPct: clamp(zone.brightnessPct || 1, 1, 100),
    kelvin: zone.kelvin,
    entity: zone.entityId ? states[zone.entityId] : undefined,
  });

  const zoneName = t(houseLightZoneNameKey(zoneId));
  const percentWord = language === "nl" ? "procent" : "percent";

  function buildEntity(next: { on: boolean; brightnessPct: number; kelvin: number }): EntityState {
    const base = confirmed.current.entity ?? (zone.entityId ? useEntityStateStore.getState().states[zone.entityId] : undefined);
    return {
      entity_id: zone.entityId,
      state: next.on ? "on" : "off",
      attributes: {
        ...(base?.attributes ?? {}),
        brightness: Math.round((next.brightnessPct / 100) * 255),
        brightness_pct: next.brightnessPct,
        color_temp_kelvin: next.kelvin,
      },
    };
  }

  function paint(next: { on: boolean; brightnessPct: number; kelvin: number }) {
    setBrightness(next.brightnessPct);
    setKelvin(next.kelvin);
    brightnessRef.current = next.brightnessPct;
    kelvinRef.current = next.kelvin;
    if (!zone.entityId) return;
    const entity = buildEntity(next);
    updateEntityState(zone.entityId, { state: entity.state, attributes: entity.attributes });
    onUserAction();
  }

  async function send(
    service: "turn_on" | "turn_off",
    serviceData: Record<string, unknown> | undefined,
    next: { on: boolean; brightnessPct: number; kelvin: number },
    failureKey: "energy.overview.light.failedToggle" | "energy.overview.light.failedBrightness" | "energy.overview.light.failedColorTemp"
  ) {
    if (!zone.entityId || unreachable) return;
    const mine = ++seq.current;
    const previous = confirmed.current;
    ignoreUntil.current = Date.now() + IGNORE_MS;
    try {
      await callHouseLight(zone.entityId, service, serviceData);
      if (mine !== seq.current) return;
      confirmed.current = { ...next, entity: buildEntity(next) };
      ignoreUntil.current = Date.now() + IGNORE_MS;
    } catch {
      if (mine !== seq.current || !mounted.current) return;
      ignoreUntil.current = 0;
      dragging.current = null;
      revertEntityState(zone.entityId, previous.entity);
      setBrightness(previous.brightnessPct);
      setKelvin(previous.kelvin);
      brightnessRef.current = previous.brightnessPct;
      kelvinRef.current = previous.kelvin;
      onNotice(fill(t(failureKey), { zone: zoneName }));
    }
  }

  function pushBrightness(pct: number, mode: "drag" | "key" | "end") {
    if (unreachable || !zone.entityId) return;
    const next = { on: true, brightnessPct: pct, kelvin: kelvinRef.current };
    ignoreUntil.current = Date.now() + IGNORE_MS;
    paint(next);
    if (mode === "key") {
      if (keyTimer.current) window.clearTimeout(keyTimer.current);
      keyTimer.current = window.setTimeout(() => {
        keyTimer.current = null;
        void send("turn_on", { brightness_pct: pct }, next, "energy.overview.light.failedBrightness");
      }, KEY_WAIT_MS);
      return;
    }
    if (mode === "end") {
      if (keyTimer.current) window.clearTimeout(keyTimer.current);
      keyTimer.current = null;
      void send("turn_on", { brightness_pct: pct }, next, "energy.overview.light.failedBrightness");
      return;
    }
    const now = Date.now();
    if (now - lastDragAt.current.brightness >= DRAG_GAP_MS) {
      lastDragAt.current.brightness = now;
      void send("turn_on", { brightness_pct: pct }, next, "energy.overview.light.failedBrightness");
    }
  }

  function pushKelvin(value: number, mode: "drag" | "key" | "end") {
    if (unreachable || !zone.entityId) return;
    const next = { on: true, brightnessPct: brightnessRef.current, kelvin: value };
    ignoreUntil.current = Date.now() + IGNORE_MS;
    paint(next);
    if (mode === "key") {
      if (keyTimer.current) window.clearTimeout(keyTimer.current);
      keyTimer.current = window.setTimeout(() => {
        keyTimer.current = null;
        void send("turn_on", { color_temp_kelvin: value }, next, "energy.overview.light.failedColorTemp");
      }, KEY_WAIT_MS);
      return;
    }
    if (mode === "end") {
      if (keyTimer.current) window.clearTimeout(keyTimer.current);
      keyTimer.current = null;
      void send("turn_on", { color_temp_kelvin: value }, next, "energy.overview.light.failedColorTemp");
      return;
    }
    const now = Date.now();
    if (now - lastDragAt.current.kelvin >= DRAG_GAP_MS) {
      lastDragAt.current.kelvin = now;
      void send("turn_on", { color_temp_kelvin: value }, next, "energy.overview.light.failedColorTemp");
    }
  }

  flushRef.current = () => {
    if (keyTimer.current) {
      window.clearTimeout(keyTimer.current);
      keyTimer.current = null;
      void send(
        "turn_on",
        dragging.current === "kelvin"
          ? { color_temp_kelvin: kelvinRef.current }
          : { brightness_pct: brightnessRef.current },
        { on: true, brightnessPct: brightnessRef.current, kelvin: kelvinRef.current },
        dragging.current === "kelvin" ? "energy.overview.light.failedColorTemp" : "energy.overview.light.failedBrightness"
      );
      return;
    }
    if (dragging.current === "brightness") {
      void send(
        "turn_on",
        { brightness_pct: brightnessRef.current },
        { on: true, brightnessPct: brightnessRef.current, kelvin: kelvinRef.current },
        "energy.overview.light.failedBrightness"
      );
    } else if (dragging.current === "kelvin") {
      void send(
        "turn_on",
        { color_temp_kelvin: kelvinRef.current },
        { on: true, brightnessPct: brightnessRef.current, kelvin: kelvinRef.current },
        "energy.overview.light.failedColorTemp"
      );
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      flushRef.current = null;
      if (keyTimer.current) window.clearTimeout(keyTimer.current);
    };
  }, [flushRef]);

  useEffect(() => {
    if (dragging.current || Date.now() < ignoreUntil.current) return;
    const nextPct = clamp(zone.brightnessPct || 1, 1, 100);
    setBrightness(nextPct);
    setKelvin(zone.kelvin);
    brightnessRef.current = nextPct;
    kelvinRef.current = zone.kelvin;
    confirmed.current = {
      on: zone.status === "on",
      brightnessPct: nextPct,
      kelvin: zone.kelvin,
      entity: zone.entityId ? useEntityStateStore.getState().states[zone.entityId] : undefined,
    };
  }, [zone.brightnessPct, zone.kelvin, zone.status, zone.entityId]);

  useEffect(() => {
    const opener = returnFocus.current;
    switchRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const node = dialogRef.current;
      if (!node) return;
      const items = focusable(node);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node || !node.contains(active))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [returnFocus, zoneId]);

  if (typeof document === "undefined") return null;

  const on = zone.status === "on";
  const parts: string[] = [];
  if (unreachable) parts.push(t("energy.overview.light.notReachable"));
  else {
    parts.push(t(on ? "lightCard.on" : "lightCard.off"));
    if (on && zone.supportsBrightness) parts.push(`${zone.brightnessPct} %`);
    if (zone.groupSize != null) parts.push(fill(t("energy.overview.light.group"), { count: String(zone.groupSize) }));
  }
  const showBrightness = zone.supportsBrightness;
  const showKelvin = zone.supportsColorTemp;
  const onlyOnOff = !showBrightness && !showKelvin;

  function onSwitch() {
    if (unreachable || !zone.entityId) return;
    const nextOn = !on;
    const next = { on: nextOn, brightnessPct: brightnessRef.current, kelvin: kelvinRef.current };
    ignoreUntil.current = Date.now() + IGNORE_MS;
    updateEntityState(zone.entityId, { state: nextOn ? "on" : "off" });
    onUserAction();
    void send(nextOn ? "turn_on" : "turn_off", undefined, next, "energy.overview.light.failedToggle");
  }

  function onSliderKey(event: ReactKeyboardEvent<HTMLInputElement>, kind: "brightness" | "kelvin") {
    if (unreachable) return;
    const current = kind === "brightness" ? brightnessRef.current : kelvinRef.current;
    const min = kind === "brightness" ? 1 : zone.minK;
    const max = kind === "brightness" ? 100 : zone.maxK;
    const next = stepFromKey(event.key, current, min, max);
    if (next == null) return;
    event.preventDefault();
    fromKey.current = true;
    if (kind === "brightness") pushBrightness(next, "key");
    else pushKelvin(next, "key");
    window.setTimeout(() => {
      fromKey.current = false;
    }, 0);
  }

  return createPortal(
    <div
      ref={dialogRef}
      className="pointer-events-auto fixed inset-0 z-[130] outline-none"
      role="dialog"
      aria-modal="true"
      aria-label={fill(t("energy.overview.light.label"), { zone: zoneName })}
      tabIndex={-1}
      data-house-light-sheet=""
      data-no-page-swipe=""
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/15 dark:bg-black/30"
        aria-label={t("appShell.close")}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {notice ? <HouseLightNotice message={notice} placement="sheet" onDone={onNoticeDone} /> : null}
        <div
          className={cn(
            "energy-house-glass pointer-events-auto rounded-3xl border border-white/80 bg-white/[0.98] p-5 text-[#111827] dark:border-white/10 dark:bg-[#1c1626]/[0.98] dark:text-[#f3f4f6]",
            orientation === "portrait" ? "w-[420px]" : "w-[380px]",
            !reducedMotion && "energy-story-sheet-in"
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                on && !unreachable ? "bg-[#4700B5] dark:bg-[#8357be]" : "bg-[#e5e7eb] dark:bg-white/15"
              )}
              aria-hidden
            >
              <Lightbulb className={cn("h-5 w-5", on && !unreachable ? "text-white" : "text-[#6b7280]")} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[18px] font-semibold leading-6">{zoneName}</p>
              <p data-house-light-sheet-status="" className="truncate text-[14px] font-normal leading-5 text-[#374151] dark:text-[#d1d5db]">
                {parts.join(" · ")}
              </p>
            </div>
            <button
              ref={switchRef}
              type="button"
              role="switch"
              data-house-light-switch=""
              aria-checked={on}
              aria-disabled={unreachable || undefined}
              aria-label={t(on ? "lightCard.turnOff" : "lightCard.turnOn")}
              className="inline-flex h-11 shrink-0 items-center"
              onClick={onSwitch}
            >
              <span
                className={cn(
                  "relative h-8 w-[52px] rounded-full",
                  on && !unreachable ? "bg-[#4700B5] dark:bg-[#8357be]" : "bg-[#d1d5db] dark:bg-white/20"
                )}
              >
                <span className={cn("absolute top-1 h-6 w-6 rounded-full bg-white", on ? "left-6" : "left-1")} />
              </span>
            </button>
          </div>
          {showBrightness ? (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-[14px] text-[#374151] dark:text-[#d1d5db]">
                <span>{t("lightCard.brightness")}</span>
                <span>{brightness} %</span>
              </div>
              <div className="relative h-14 rounded-full focus-within:ring-2 focus-within:ring-brand">
                <div className="absolute inset-0 rounded-full bg-[#eceaf1] dark:bg-white/10" />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#4700B5] dark:bg-[#8357be]"
                  style={{ width: `${brightness}%` }}
                />
                <input
                  data-house-light-brightness=""
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={brightness}
                  aria-label={t("lightCard.brightness")}
                  aria-valuetext={`${brightness} ${percentWord}`}
                  aria-disabled={unreachable || undefined}
                  className="absolute inset-0 h-14 w-full cursor-pointer opacity-0"
                  onPointerDown={() => {
                    dragging.current = "brightness";
                  }}
                  onPointerUp={() => {
                    if (dragging.current !== "brightness") return;
                    dragging.current = null;
                    pushBrightness(brightnessRef.current, "end");
                  }}
                  onPointerCancel={() => {
                    dragging.current = null;
                  }}
                  onChange={(event) => {
                    if (fromKey.current) return;
                    const pct = clamp(Number(event.target.value), 1, 100);
                    pushBrightness(pct, dragging.current === "brightness" ? "drag" : "key");
                  }}
                  onKeyDown={(event) => onSliderKey(event, "brightness")}
                />
              </div>
            </div>
          ) : null}
          {showKelvin ? (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-[14px] text-[#374151] dark:text-[#d1d5db]">
                <span>{t("lightCard.colorTemp")}</span>
                <span>{kelvin} K</span>
              </div>
              <input
                data-house-light-kelvin=""
                type="range"
                min={zone.minK}
                max={zone.maxK}
                step={1}
                value={kelvin}
                aria-label={t("lightCard.colorTemp")}
                aria-valuetext={`${kelvin} kelvin`}
                aria-disabled={unreachable || undefined}
                className="house-light-kelvin w-full cursor-pointer"
                onPointerDown={() => {
                  dragging.current = "kelvin";
                }}
                onPointerUp={() => {
                  if (dragging.current !== "kelvin") return;
                  dragging.current = null;
                  pushKelvin(kelvinRef.current, "end");
                }}
                onPointerCancel={() => {
                  dragging.current = null;
                }}
                onChange={(event) => {
                  if (fromKey.current) return;
                  const value = clamp(Number(event.target.value), zone.minK, zone.maxK);
                  pushKelvin(value, dragging.current === "kelvin" ? "drag" : "key");
                }}
                onKeyDown={(event) => onSliderKey(event, "kelvin")}
              />
            </div>
          ) : null}
          {onlyOnOff ? (
            <p data-house-light-only="" className="mt-4 text-[14px] leading-5 text-[#374151] dark:text-[#d1d5db]">
              {t("energy.overview.light.onlyOnOff")}
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
