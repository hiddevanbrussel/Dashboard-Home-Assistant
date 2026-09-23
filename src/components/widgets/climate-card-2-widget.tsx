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
  climateGaugeColor,
  climateGaugeProgress,
  climateGaugeTickFilled,
  climateHvacModesFromAttributes,
  climateStatusKind,
  climateStatusLabelKey,
  climateTempsDiffer,
  climateTileEnabled,
  climateTileFromHvacMode,
  climateCardDensity,
  CLIMATE_GAUGE_MAX,
  CLIMATE_GAUGE_MIN,
  CLIMATE_GAUGE_TICK_COUNT,
  isClimateOn,
  parseClimateTemp,
  preferredClimateOnMode,
  resolveHvacModeForTile,
  type ClimateModeTile,
} from "@/lib/climate-card";

const SELECTOR_STEP = 0.5;
const TEMP_MIN = 5;
const TEMP_MAX = 35;

const MODE_UI: { mode: ClimateModeTile; labelKey: string; Icon: typeof Wind }[] = [
  { mode: "auto", labelKey: "climateCard.auto", Icon: Wind },
  { mode: "heat", labelKey: "climateCard.heat", Icon: Flame },
  { mode: "cool", labelKey: "climateCard.cool", Icon: Snowflake },
];

const GAUGE_START_DEG = 150;
const GAUGE_SWEEP_DEG = 240;

function ClimateTempGauge({
  value,
  active,
}: {
  value: number | undefined;
  active: boolean;
}) {
  const progress = active ? climateGaugeProgress(value) : 0;
  const ticks = Array.from({ length: CLIMATE_GAUGE_TICK_COUNT }, (_, index) => {
    const t = CLIMATE_GAUGE_TICK_COUNT <= 1 ? 0 : index / (CLIMATE_GAUGE_TICK_COUNT - 1);
    const rad = ((GAUGE_START_DEG + t * GAUGE_SWEEP_DEG) * Math.PI) / 180;
    const filled = active && climateGaugeTickFilled(index, CLIMATE_GAUGE_TICK_COUNT, progress);
    const temp = CLIMATE_GAUGE_MIN + t * (CLIMATE_GAUGE_MAX - CLIMATE_GAUGE_MIN);
    const inner = filled ? 37.2 : 44;
    const outer = 47.4;
    return {
      key: index,
      filled,
      color: filled ? climateGaugeColor(temp) : undefined,
      x1: 50 + inner * Math.cos(rad),
      y1: 50 + inner * Math.sin(rad),
      x2: 50 + outer * Math.cos(rad),
      y2: 50 + outer * Math.sin(rad),
      cx: 50 + 45.4 * Math.cos(rad),
      cy: 50 + 45.4 * Math.sin(rad),
    };
  });

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
      {ticks.map((tick) =>
        tick.filled ? (
          <line
            key={tick.key}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.color}
            strokeWidth="2.35"
            strokeLinecap="round"
          />
        ) : (
          <circle
            key={tick.key}
            cx={tick.cx}
            cy={tick.cy}
            r="0.95"
            className="fill-gray-300 dark:fill-white/25"
          />
        )
      )}
    </svg>
  );
}

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
  const [previewTemp, setPreviewTemp] = useState(21);

  const attrs = entity?.attributes ?? {};
  const state = (entity?.state as string | undefined) ?? "";
  const hvacModes = climateHvacModesFromAttributes(attrs);
  const hvacModeFromAttr = typeof attrs.hvac_mode === "string" ? attrs.hvac_mode : undefined;
  const hvacAction = typeof attrs.hvac_action === "string" ? attrs.hvac_action : undefined;
  const resolvedMode = hvacModeFromAttr || state;
  const previewing = !entity_id;
  const isOn = previewing || isClimateOn(state, resolvedMode);
  const activeTile = isOn ? climateTileFromHvacMode(resolvedMode) : null;
  const statusKind = previewing
    ? "heat"
    : climateStatusKind({ hvacAction, hvacMode: resolvedMode, state });

  const currentTemperature = parseClimateTemp(attrs.current_temperature);
  const targetTemperature =
    parseClimateTemp(attrs.temperature) ?? parseClimateTemp(attrs.target_temp_high);
  const minTemp = parseClimateTemp(attrs.min_temp) ?? TEMP_MIN;
  const maxTemp = parseClimateTemp(attrs.max_temp) ?? TEMP_MAX;
  const setpoint = targetTemperature ?? currentTemperature ?? (previewing ? previewTemp : 21);
  const showCurrent = climateTempsDiffer(currentTemperature, targetTemperature);
  const { int, dec, empty } = formatTempParts(isOn ? setpoint : currentTemperature ?? targetTemperature);

  const humidityFromAttr = parseClimateTemp(attrs.humidity);
  const humidityFromSensor = parseClimateTemp(humidityEntity?.state);
  const humidity = humidityFromSensor ?? humidityFromAttr;
  const showHumidity = humidity != null;

  const cardWidth = clampClimateCardWidth(width);
  const cardHeight = clampClimateCardHeight(height);
  const density = climateCardDensity(cardHeight);
  const isDense = density === "dense";
  const isCompact = density === "compact" || isDense;
  const showModeLabels = density === "comfortable";
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
    const rounded = Math.round(next * 2) / 2;
    const clamped = Math.min(maxTemp, Math.max(minTemp, rounded));
    if (previewing) {
      setPreviewTemp(clamped);
      return;
    }
    if (!entity_id || pendingRef.current || !isOn) return;
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
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white text-gray-900 shadow-[0_18px_50px_rgba(15,23,42,0.12)] isolate dark:bg-zinc-900 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
        size === "sm" && "text-sm",
        size === "lg" && "text-lg",
        className
      )}
      style={{ width: cardWidth, height: cardHeight, minHeight: cardHeight }}
    >
      <div
        className={cn(
          "flex shrink-0 items-start justify-between gap-3",
          isDense ? "px-4 pt-3" : isCompact ? "px-4 pt-3.5" : "px-5 pt-4"
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-medium text-gray-400 dark:text-white/50",
              isDense ? "text-[11px]" : "text-[13px]"
            )}
          >
            {subtitle}
          </p>
          <h2
            className={cn(
              "truncate font-semibold leading-tight tracking-tight text-gray-950 dark:text-white",
              isDense ? "text-lg" : "text-[1.35rem]"
            )}
          >
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
            <Power className={cn(isDense ? "h-4 w-4" : "h-5 w-5")} aria-hidden />
            {isDense ? null : isOn ? t("climateCard.on") : t("climateCard.off")}
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
              <MoreVertical className={cn(isDense ? "h-4 w-4" : "h-5 w-5")} aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3" style={{ containerType: "size" }}>
        <div
          className="relative aspect-square"
          style={{
            width: isDense
              ? "min(92cqw, 98cqh)"
              : isCompact
                ? "min(88cqw, 94cqh, 12.5rem)"
                : "min(86cqw, 90cqh, 14rem)",
          }}
          role="meter"
          aria-label={t("climateCard.gauge").replace("{n}", String(Math.round((setpoint ?? 0) * 2) / 2))}
          aria-valuemin={CLIMATE_GAUGE_MIN}
          aria-valuemax={CLIMATE_GAUGE_MAX}
          aria-valuenow={Math.round(Math.min(CLIMATE_GAUGE_MAX, Math.max(CLIMATE_GAUGE_MIN, setpoint)) * 2) / 2}
        >
          <div className="absolute inset-0 rounded-full bg-gray-50 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)] dark:bg-zinc-800/90 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
          <ClimateTempGauge value={setpoint} active={isOn} />

          <div
            className={cn(
              "absolute inset-[22%] bottom-[30%] flex flex-col items-center justify-center overflow-hidden px-2 text-center",
              isDense && "inset-[18%] bottom-[28%]"
            )}
          >
            <p
              className={cn(
                "font-semibold uppercase tracking-[0.16em]",
                isDense ? "text-[9px]" : "text-[10px]",
                statusKind === "off"
                  ? "text-gray-400 dark:text-white/40"
                  : statusKind === "heating" || statusKind === "heat"
                    ? "text-orange-500 dark:text-orange-300"
                    : statusKind === "cooling" || statusKind === "cool"
                      ? "text-sky-500 dark:text-sky-300"
                      : "text-gray-400 dark:text-white/45"
              )}
            >
              {t(climateStatusLabelKey(statusKind))}
            </p>
            <p
              className={cn(
                "font-semibold leading-none tracking-tight tabular-nums text-gray-950 dark:text-white",
                isDense ? "mt-0 text-[1.85rem]" : isCompact ? "mt-0.5 text-[2.1rem]" : "mt-0.5 text-[2.45rem]"
              )}
            >
              {empty ? (
                "—"
              ) : (
                <>
                  {int}
                  {dec != null ? (
                    <sup className={cn("ml-0.5 font-semibold", isDense ? "text-base" : "text-[1.35rem]")}>
                      {dec}
                    </sup>
                  ) : null}
                  <span
                    className={cn(
                      "ml-0.5 font-semibold text-gray-400 dark:text-white/40",
                      isDense ? "text-base" : "text-[1.35rem]"
                    )}
                  >
                    °
                  </span>
                </>
              )}
            </p>
            {!isDense ? (
              <p className="mt-1.5 text-[11px] font-medium tracking-wide text-gray-400 dark:text-white/45">
                {showCurrent && currentTemperature != null
                  ? t("climateCard.currentNow").replace("{n}", String(Math.round(currentTemperature * 2) / 2))
                  : showHumidity
                    ? `${Math.round(humidity)}%`
                    : t("climateCard.unit")}
              </p>
            ) : null}
          </div>

          <div
            className={cn(
              "absolute left-0 right-0 z-10 flex items-center justify-center",
              isDense ? "bottom-[6%] gap-3" : "bottom-[10%] gap-4"
            )}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTemperature(setpoint - SELECTOR_STEP);
              }}
              disabled={(!entity_id && !previewing) || !isOn || setpoint <= minTemp}
              className={cn(
                "flex items-center justify-center rounded-full bg-white text-[#3B9EFF] shadow-[0_6px_16px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06] transition-colors hover:bg-sky-50 disabled:opacity-30 dark:bg-zinc-800 dark:text-sky-400 dark:ring-white/10 dark:hover:bg-zinc-700",
                isDense ? "h-7 w-7" : "h-9 w-9"
              )}
              aria-label={t("climateCard.tempDown")}
            >
              <Minus className={cn(isDense ? "h-3.5 w-3.5" : "h-4 w-4")} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTemperature(setpoint + SELECTOR_STEP);
              }}
              disabled={(!entity_id && !previewing) || !isOn || setpoint >= maxTemp}
              className={cn(
                "flex items-center justify-center rounded-full bg-white text-[#F97316] shadow-[0_6px_16px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06] transition-colors hover:bg-orange-50 disabled:opacity-30 dark:bg-zinc-800 dark:text-orange-400 dark:ring-white/10 dark:hover:bg-zinc-700",
                isDense ? "h-7 w-7" : "h-9 w-9"
              )}
              aria-label={t("climateCard.tempUp")}
            >
              <Plus className={cn(isDense ? "h-3.5 w-3.5" : "h-4 w-4")} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid shrink-0 grid-cols-3 gap-2",
          isDense ? "px-3 pb-2.5 pt-0" : isCompact ? "px-4 pb-3 pt-0" : "px-5 pb-4 pt-0"
        )}
      >
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
                "flex min-w-0 flex-col items-center rounded-2xl px-2 text-[11px] font-medium transition-colors disabled:opacity-50",
                showModeLabels ? "gap-1.5 py-3" : "gap-0 py-2",
                selected
                  ? "bg-sky-50 text-sky-500 dark:bg-sky-400/15 dark:text-sky-300"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white/70"
              )}
              aria-label={t(labelKey)}
            >
              <Icon className={cn(isDense ? "h-4 w-4" : "h-5 w-5")} aria-hidden />
              {showModeLabels ? <span className="truncate">{t(labelKey)}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
