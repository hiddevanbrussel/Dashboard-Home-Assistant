"use client";

import { useRef, useState } from "react";
import {
  Flame,
  Minus,
  MoreVertical,
  Plus,
  Power,
  Snowflake,
  Wind,
} from "lucide-react";
import type { ClimateProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  clampClimateCardHeight,
  clampClimateCardWidth,
  climateHvacModesFromAttributes,
  climateRingTone,
  climateStatusKind,
  climateStatusLabelKey,
  climateTempsDiffer,
  climateTileEnabled,
  climateTileFromHvacMode,
  CLIMATE_MODE_TILES,
  isClimateOn,
  parseClimateTemp,
  preferredClimateOnMode,
  resolveHvacModeForTile,
  type ClimateModeTile,
  type ClimateRingTone,
} from "@/lib/climate-card";

const SELECTOR_STEP = 0.5;
const TEMP_MIN = 5;
const TEMP_MAX = 35;

const MODE_UI: { mode: ClimateModeTile; labelKey: string; Icon: typeof Wind }[] = [
  { mode: "auto", labelKey: "climateCard.auto", Icon: Wind },
  { mode: "heat", labelKey: "climateCard.heat", Icon: Flame },
  { mode: "cool", labelKey: "climateCard.cool", Icon: Snowflake },
];

const RING_CLASS: Record<ClimateRingTone, { outer: string; mid: string; inner: string }> = {
  sky: {
    outer: "border-sky-200/80 dark:border-sky-400/30",
    mid: "border-sky-100 dark:border-sky-400/20",
    inner: "border-sky-50 dark:border-sky-400/10",
  },
  amber: {
    outer: "border-amber-200/80 dark:border-amber-400/30",
    mid: "border-amber-100 dark:border-amber-400/20",
    inner: "border-amber-50 dark:border-amber-400/10",
  },
  teal: {
    outer: "border-teal-200/70 dark:border-teal-400/25",
    mid: "border-teal-100/90 dark:border-teal-400/15",
    inner: "border-cyan-50 dark:border-white/10",
  },
  gray: {
    outer: "border-gray-200/80 dark:border-white/15",
    mid: "border-gray-100 dark:border-white/10",
    inner: "border-gray-50 dark:border-white/5",
  },
};

function formatTempParts(value: number | undefined): { int: number; dec: string | null; empty?: boolean } {
  if (value == null || Number.isNaN(value)) return { int: 0, dec: null, empty: true };
  const rounded = Math.round(value * 2) / 2;
  const int = Math.trunc(rounded);
  const dec = Math.abs(rounded % 1) === 0.5 ? "5" : null;
  return { int, dec };
}

export function ClimateCard2Widget({
  title = "Climate",
  entity_id,
  humidity_entity_id,
  size = "md",
  width,
  height,
  className,
  onMoreClick,
}: ClimateProps & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const humidityEntity = useEntityStateStore((s) =>
    humidity_entity_id ? s.getState(humidity_entity_id) : null
  );
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const revertEntityState = useEntityStateStore((s) => s.revertEntityState);
  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);
  const pendingRef = useRef(false);
  const [busyMode, setBusyMode] = useState<ClimateModeTile | null>(null);

  const attrs = entity?.attributes ?? {};
  const state = (entity?.state as string | undefined) ?? "";
  const hvacModes = climateHvacModesFromAttributes(attrs);
  const hvacModeFromAttr = typeof attrs.hvac_mode === "string" ? attrs.hvac_mode : undefined;
  const hvacAction = typeof attrs.hvac_action === "string" ? attrs.hvac_action : undefined;
  const resolvedMode = hvacModeFromAttr || state;
  const isOn = isClimateOn(state, resolvedMode);
  const activeTile = isOn ? climateTileFromHvacMode(resolvedMode) : null;
  const statusKind = climateStatusKind({ hvacAction, hvacMode: resolvedMode, state });
  const ringTone = climateRingTone(statusKind);
  const ringClass = RING_CLASS[ringTone];

  const currentTemperature = parseClimateTemp(attrs.current_temperature);
  const targetTemperature =
    parseClimateTemp(attrs.temperature) ?? parseClimateTemp(attrs.target_temp_high);
  const minTemp = parseClimateTemp(attrs.min_temp) ?? TEMP_MIN;
  const maxTemp = parseClimateTemp(attrs.max_temp) ?? TEMP_MAX;
  const setpoint = targetTemperature ?? currentTemperature ?? 20;
  const showTarget = climateTempsDiffer(currentTemperature, targetTemperature);
  const { int, dec, empty } = formatTempParts(currentTemperature ?? targetTemperature);

  const humidityFromAttr = parseClimateTemp(attrs.humidity);
  const humidityFromSensor = parseClimateTemp(humidityEntity?.state);
  const humidity = humidityFromSensor ?? humidityFromAttr;
  const showHumidity = humidity != null;

  const cardWidth = clampClimateCardWidth(width);
  const cardHeight = clampClimateCardHeight(height);
  const subtitle = title?.trim() || (attrs.friendly_name as string | undefined) || entity_id;

  async function callClimate(service: string, serviceData?: Record<string, unknown>) {
    const res = await fetch("/api/ha/call-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity_id,
        domain: "climate",
        service,
        service_data: serviceData,
      }),
    });
    if (!res.ok) throw new Error(`call-service failed: ${res.status}`);
  }

  function handlePower() {
    if (!entity_id || pendingRef.current) return;
    pendingRef.current = true;
    const previous = entity;
    if (isOn) {
      updateEntityState(entity_id, {
        state: "off",
        attributes: { ...attrs, hvac_mode: "off", hvac_action: "off" },
      });
      callClimate("turn_off")
        .then(() => requestRefresh())
        .catch(() => revertEntityState(entity_id, previous))
        .finally(() => {
          pendingRef.current = false;
        });
      return;
    }
    const nextMode = preferredClimateOnMode(hvacModes);
    updateEntityState(entity_id, {
      state: nextMode,
      attributes: { ...attrs, hvac_mode: nextMode, hvac_action: "idle" },
    });
    callClimate("turn_on")
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
      });
  }

  function handleMode(tile: ClimateModeTile) {
    if (!entity_id || pendingRef.current) return;
    if (!climateTileEnabled(tile, hvacModes)) return;
    const hvac_mode = resolveHvacModeForTile(tile, hvacModes);
    pendingRef.current = true;
    setBusyMode(tile);
    const previous = entity;
    updateEntityState(entity_id, {
      state: hvac_mode,
      attributes: { ...attrs, hvac_mode, hvac_action: tile === "heat" ? "heating" : tile === "cool" ? "cooling" : "idle" },
    });
    callClimate("set_hvac_mode", { hvac_mode })
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
        setBusyMode(null);
      });
  }

  function handleTemperature(next: number) {
    if (!entity_id || pendingRef.current || !isOn) return;
    const rounded = Math.round(next * 2) / 2;
    const clamped = Math.min(maxTemp, Math.max(minTemp, rounded));
    pendingRef.current = true;
    const previous = entity;
    updateEntityState(entity_id, {
      attributes: { ...attrs, temperature: clamped },
    });
    callClimate("set_temperature", { temperature: clamped })
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
      });
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:bg-zinc-900 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
        size === "sm" && "text-sm",
        size === "lg" && "text-lg",
        className
      )}
      style={{ width: cardWidth, height: cardHeight, minHeight: cardHeight }}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-gray-400 dark:text-white/50">{subtitle}</p>
          <h2 className="truncate text-[1.35rem] font-semibold leading-tight tracking-tight text-gray-950 dark:text-white">
            {t("climateCard.climate")}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1 pt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePower();
            }}
            disabled={!entity_id}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-1 py-0.5 text-sm font-semibold transition-colors disabled:opacity-40",
              isOn ? "text-teal-500" : "text-gray-400 dark:text-white/40"
            )}
            aria-label={isOn ? t("climateCard.powerOff") : t("climateCard.powerOn")}
            aria-pressed={isOn}
          >
            <Power className="h-5 w-5" aria-hidden />
            {isOn ? t("climateCard.on") : t("climateCard.off")}
          </button>
          {onMoreClick ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label={t("climateCard.moreOptions")}
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
        <div className="relative aspect-square w-[min(78%,12.25rem)]">
          <div className={cn("absolute inset-0 rounded-full border-[1.5px]", ringClass.outer)} />
          <div className={cn("absolute inset-[11%] rounded-full border", ringClass.mid)} />
          <div className={cn("absolute inset-[22%] rounded-full border", ringClass.inner)} />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTemperature(setpoint - SELECTOR_STEP);
            }}
            disabled={!entity_id || !isOn || setpoint <= minTemp}
            className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-x-1/4 -translate-y-1/2 items-center justify-center rounded-full text-gray-300 transition-colors hover:text-gray-500 disabled:opacity-30 dark:text-white/30 dark:hover:text-white/60"
            aria-label={t("climateCard.tempDown")}
          >
            <Minus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTemperature(setpoint + SELECTOR_STEP);
            }}
            disabled={!entity_id || !isOn || setpoint >= maxTemp}
            className="absolute right-0 top-1/2 z-10 flex h-8 w-8 translate-x-1/4 -translate-y-1/2 items-center justify-center rounded-full text-gray-300 transition-colors hover:text-gray-500 disabled:opacity-30 dark:text-white/30 dark:hover:text-white/60"
            aria-label={t("climateCard.tempUp")}
          >
            <Plus className="h-5 w-5" />
          </button>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-[3.15rem] font-semibold leading-none tracking-tight tabular-nums text-gray-950 dark:text-white">
              {empty ? (
                "—"
              ) : (
                <>
                  {int}
                  {dec != null ? <sup className="ml-0.5 text-2xl font-semibold">{dec}</sup> : null}
                </>
              )}
            </p>
            <p className="mt-1.5 text-[11px] font-medium tracking-wide text-gray-400 dark:text-white/45">
              {showHumidity
                ? `°C · ${Math.round(humidity)}%`
                : t("climateCard.unit")}
            </p>
            {showTarget && targetTemperature != null ? (
              <p className="mt-0.5 text-[11px] font-medium tabular-nums text-gray-400 dark:text-white/40">
                {t("climateCard.targetArrow").replace("{n}", String(Math.round(targetTemperature * 2) / 2))}
              </p>
            ) : null}
            <span
              className={cn(
                "mt-2.5 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                statusKind === "off"
                  ? "bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-white/40"
                  : statusKind === "heating" || statusKind === "heat"
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300"
                    : "bg-sky-50 text-sky-500 dark:bg-sky-400/15 dark:text-sky-300"
              )}
            >
              {t(climateStatusLabelKey(statusKind))}
            </span>
          </div>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-2 px-5 pb-5 pt-1">
        {MODE_UI.map(({ mode, labelKey, Icon }) => {
          const selected = activeTile === mode;
          const enabled = climateTileEnabled(mode, hvacModes);
          return (
            <button
              key={mode}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleMode(mode);
              }}
              disabled={!entity_id || !enabled || busyMode != null}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[11px] font-medium transition-colors disabled:opacity-50",
                selected
                  ? "bg-sky-50 text-sky-500 dark:bg-sky-400/15 dark:text-sky-300"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white/70"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="truncate">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
