"use client";

import { useEffect, useRef, useState } from "react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { callHouseLight } from "@/components/energy/overview/house-light-call";
import { useLongPress, type LongPressPoint } from "@/components/energy/overview/use-long-press";
import { useTranslation } from "@/hooks/use-translation";
import {
  houseLightHitRects,
  houseLightZoneNameKey,
  houseLightZoneState,
  type HouseLightHitRect,
  type HouseLightZoneId,
  type HouseLighting,
  type HouseSide,
} from "@/lib/energy-now";
import { playUiClick } from "@/lib/ui-click";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

function fill(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) out = out.split(`{${key}}`).join(value);
  return out;
}

const PRESS_CIRC = 2 * Math.PI * 24;
const TAP_GAP_MS = 400;

function HouseLightHit({
  zoneId,
  rect,
  primary,
  label,
  hintId,
  checked,
  unavailable,
  blocked,
  pending,
  reducedMotion,
  dark,
  onTap,
  onOpen,
}: {
  zoneId: HouseLightZoneId;
  rect: HouseLightHitRect;
  primary: boolean;
  label: string;
  hintId: string;
  checked: boolean;
  unavailable: boolean;
  blocked: boolean;
  pending: boolean;
  reducedMotion: boolean;
  dark: boolean;
  onTap: () => void;
  onOpen: (source: HTMLButtonElement) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [wait, setWait] = useState<LongPressPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const rippleId = useRef(0);

  const press = useLongPress({
    blocked,
    onTap: (point) => {
      if (unavailable) {
        onTap();
        return;
      }
      if (pending) return;
      if (!reducedMotion) {
        const id = rippleId.current + 1;
        rippleId.current = id;
        setRipples((current) => [...current, { id, x: point.x, y: point.y }]);
        window.setTimeout(() => {
          setRipples((current) => current.filter((ripple) => ripple.id !== id));
        }, 300);
      }
      setWait(point);
      onTap();
    },
    onFire: () => {
      const node = buttonRef.current;
      if (node) onOpen(node);
    },
  });

  useEffect(() => {
    if (!wait || !pending) {
      setLoading(false);
      if (!pending) setWait(null);
      return;
    }
    const id = window.setTimeout(() => setLoading(true), 600);
    return () => window.clearTimeout(id);
  }, [wait, pending]);

  const disabled = blocked || unavailable;

  return (
    <button
      ref={buttonRef}
      type="button"
      data-house-light-hit={zoneId}
      data-house-light-primary={primary ? "1" : "0"}
      role={primary ? "switch" : undefined}
      aria-checked={primary ? checked : undefined}
      aria-label={primary ? label : undefined}
      aria-describedby={primary ? hintId : undefined}
      aria-disabled={disabled || undefined}
      aria-hidden={primary ? undefined : true}
      tabIndex={primary ? 0 : -1}
      className={cn(
        "absolute rounded-[10px] bg-transparent p-0 outline-none",
        FOCUS_RING_BRAND,
        "focus-visible:ring-offset-1 focus-visible:ring-offset-white"
      )}
      style={{
        left: `${rect.left}%`,
        top: `${rect.top}%`,
        width: `${rect.width}%`,
        height: `${rect.height}%`,
        touchAction: "manipulation",
        WebkitTouchCallout: "none",
        userSelect: "none",
      }}
      onPointerDown={press.onPointerDown}
      onPointerMove={press.onPointerMove}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerCancel}
      onPointerLeave={press.onPointerLeave}
      onClick={press.onClick}
      onContextMenu={press.onContextMenu}
      onKeyDown={press.onKeyDown}
    >
      {press.pressPoint ? (
        <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-white/[0.18]" />
      ) : null}
      {press.pressPoint ? (
        <svg
          data-house-light-press=""
          className="pointer-events-none absolute"
          width={52}
          height={52}
          style={{
            left: press.pressPoint.x,
            top: press.pressPoint.y,
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden
        >
          <circle cx={26} cy={26} r={24} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={4} />
          <circle
            cx={26}
            cy={26}
            r={24}
            fill="none"
            stroke={dark ? "#c4b5fd" : "#4700B5"}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={PRESS_CIRC}
            strokeDashoffset={reducedMotion ? 0 : PRESS_CIRC}
            className={reducedMotion ? undefined : "house-light-press-arc"}
            style={{ ["--press-circ" as string]: String(PRESS_CIRC) }}
            transform="rotate(-90 26 26)"
          />
        </svg>
      ) : null}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          data-house-light-ripple=""
          className="house-light-ripple pointer-events-none absolute h-12 w-12 rounded-full bg-white/70"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
      {loading && wait ? (
        <span
          data-house-light-loading=""
          className="energy-house-glass pointer-events-none absolute flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/75 dark:border-white/10 dark:bg-[rgba(28,22,38,0.8)]"
          style={{ left: wait.x, top: wait.y, transform: "translate(-50%, -50%)" }}
        >
          <svg
            width={36}
            height={36}
            viewBox="0 0 36 36"
            className={reducedMotion ? undefined : "house-light-spin"}
            aria-hidden
          >
            <circle cx={18} cy={18} r={12} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={3} />
            <circle
              cx={18}
              cy={18}
              r={12}
              fill="none"
              stroke={dark ? "#c4b5fd" : "#4700B5"}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 12}
              strokeDashoffset={2 * Math.PI * 12 * 0.72}
            />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

/** Invisible window targets. A short tap switches the room. A long press opens the sheet. */
export function HouseLightHotspots({
  side,
  frameWidth,
  frameHeight,
  lighting,
  reducedMotion,
  dark,
  busy,
  inert,
  onOpen,
  onNotice,
  onUserAction,
}: {
  side: HouseSide;
  frameWidth: number;
  frameHeight: number;
  lighting: HouseLighting;
  reducedMotion: boolean;
  dark: boolean;
  busy: boolean;
  inert: boolean;
  onOpen: (id: HouseLightZoneId, source: HTMLButtonElement) => void;
  onNotice: (message: string) => void;
  onUserAction: () => void;
}) {
  const { t } = useTranslation();
  const states = useEntityStateStore((state) => state.states);
  const updateEntityState = useEntityStateStore((state) => state.updateEntityState);
  const revertEntityState = useEntityStateStore((state) => state.revertEntityState);
  const pendingRef = useRef(new Set<string>());
  const acceptedTapAt = useRef(new Map<string, number>());
  const [pendingZones, setPendingZones] = useState<ReadonlySet<string>>(new Set());
  const mounted = useRef(true);
  const hits = houseLightHitRects(side, frameWidth, frameHeight);
  const blocked = busy || inert;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function zoneLabel(id: HouseLightZoneId): string {
    return t(houseLightZoneNameKey(id));
  }

  function syncPending() {
    if (!mounted.current) return;
    setPendingZones(new Set(pendingRef.current));
  }

  async function toggle(id: HouseLightZoneId) {
    if (blocked || pendingRef.current.has(id)) return;
    const zone = houseLightZoneState(lighting, useEntityStateStore.getState().states, id);
    const name = zoneLabel(id);
    if (!zone.entityId || zone.status === "unlinked") return;
    if (zone.status === "unavailable") {
      onNotice(fill(t("energy.overview.light.unavailable"), { zone: name }));
      return;
    }
    const now = Date.now();
    const lastTap = acceptedTapAt.current.get(id) ?? 0;
    if (now - lastTap < TAP_GAP_MS) return;
    acceptedTapAt.current.set(id, now);
    const next = zone.status === "on" ? "off" : "on";
    const previous = useEntityStateStore.getState().states[zone.entityId];
    pendingRef.current.add(id);
    syncPending();
    playUiClick();
    onUserAction();
    updateEntityState(zone.entityId, { state: next });
    try {
      await callHouseLight(zone.entityId, next === "on" ? "turn_on" : "turn_off");
    } catch {
      revertEntityState(zone.entityId, previous);
      onNotice(fill(t("energy.overview.light.failedToggle"), { zone: name }));
    } finally {
      pendingRef.current.delete(id);
      syncPending();
    }
  }

  function open(id: HouseLightZoneId, source: HTMLButtonElement) {
    if (blocked) return;
    const zone = houseLightZoneState(lighting, useEntityStateStore.getState().states, id);
    if (!zone.entityId || zone.status === "unavailable" || zone.status === "unlinked") {
      onNotice(fill(t("energy.overview.light.unavailable"), { zone: zoneLabel(id) }));
      return;
    }
    onOpen(id, source);
  }

  return (
    <div
      data-house-light-hotspots=""
      className={cn("absolute inset-0 z-[4]", blocked && "pointer-events-none")}
      inert={inert ? true : undefined}
    >
      {hits.map((zone) => {
        const reading = houseLightZoneState(lighting, states, zone.id);
        if (reading.status === "unlinked") return null;
        const adjustable =
          reading.status !== "unavailable" && (reading.supportsBrightness || reading.supportsColorTemp);
        const hint = t(adjustable ? "energy.overview.light.hint" : "energy.overview.light.hintOnOff");
        const hintId = `house-light-hint-${zone.id}`;
        const label = fill(t("energy.overview.light.label"), { zone: zoneLabel(zone.id) });
        return (
          <div key={zone.id}>
            <p id={hintId} className="sr-only">
              {hint}
            </p>
            {zone.rects.map((rect, index) => (
              <HouseLightHit
                key={`${zone.id}-${index}`}
                zoneId={zone.id}
                rect={rect}
                primary={index === zone.primary}
                label={label}
                hintId={hintId}
                checked={reading.status === "on"}
                unavailable={reading.status === "unavailable"}
                blocked={blocked}
                pending={pendingZones.has(zone.id)}
                reducedMotion={reducedMotion}
                dark={dark}
                onTap={() => void toggle(zone.id)}
                onOpen={(source) => open(zone.id, source)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
