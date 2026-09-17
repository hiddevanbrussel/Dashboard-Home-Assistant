"use client";

import { useRef, useState } from "react";
import { Leaf, MoreVertical, Power, AudioLines, Zap } from "lucide-react";
import type { VacuumCard2Props } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  batteryFromAttributes,
  clampVacuumCard2Height,
  clampVacuumCard2Width,
  currentFanSpeedFromAttributes,
  fanModeFromSpeed,
  fanSpeedListFromAttributes,
  isVacuumOn,
  parsePercent,
  progressFromAttributes,
  resolveFanSpeedForMode,
  VACUUM_CARD_2_DEFAULT_IMAGE,
  vacuumHeadlineKind,
  type VacuumFanMode,
} from "@/lib/vacuum-card";

const MODE_UI: { mode: VacuumFanMode; labelKey: string; Icon: typeof Leaf }[] = [
  { mode: "eco", labelKey: "vacuumCard.eco", Icon: Leaf },
  { mode: "standard", labelKey: "vacuumCard.standard", Icon: AudioLines },
  { mode: "turbo", labelKey: "vacuumCard.turbo", Icon: Zap },
];

function BatteryMeter({ level, label }: { level: number; label: string }) {
  const low = level < 20;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-gray-800 shadow-sm dark:bg-zinc-900/85 dark:text-white",
        low && "text-red-500 dark:text-red-400"
      )}
      aria-label={label}
    >
      <span className="flex items-center" aria-hidden>
        <span className="h-3.5 w-[22px] rounded-[3px] border-2 border-current p-[1.5px]">
          <span
            className={cn("block h-full rounded-[1px]", low ? "bg-red-400" : "bg-emerald-400")}
            style={{ width: `${Math.max(10, level)}%` }}
          />
        </span>
        <span className="h-1.5 w-[3px] rounded-r-[1px] bg-current" />
      </span>
      <span className="tabular-nums text-[11px] font-semibold">{level}%</span>
    </div>
  );
}

function VacuumRobotArt({ active, src }: { active: boolean; src: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-full w-[118%] -translate-x-1/2 -translate-y-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block w-full h-auto object-contain" />
        <span
          className={cn(
            "absolute left-1/2 top-[38%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
            active ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,126,0.95)]" : "bg-gray-300 dark:bg-white/35"
          )}
          aria-hidden
        >
          {active ? <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/80" /> : null}
        </span>
      </div>
    </div>
  );
}

export function VacuumCard2Widget({
  title,
  entity_id,
  progress_entity_id,
  background_image,
  size = "md",
  width,
  height,
  className,
  onMoreClick,
}: VacuumCard2Props & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const progressEntity = useEntityStateStore((s) =>
    progress_entity_id ? s.getState(progress_entity_id) : null
  );
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const revertEntityState = useEntityStateStore((s) => s.revertEntityState);
  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);
  const pendingRef = useRef(false);
  const [busyMode, setBusyMode] = useState<VacuumFanMode | null>(null);

  const state = (entity?.state as string | undefined) ?? "";
  const attrs = entity?.attributes ?? {};
  const battery = batteryFromAttributes(attrs);
  const progress = parsePercent(progressEntity?.state) ?? progressFromAttributes(attrs);
  const fanList = fanSpeedListFromAttributes(attrs);
  const fanSpeed = currentFanSpeedFromAttributes(attrs);
  const activeMode = fanModeFromSpeed(fanSpeed, fanList);
  const isOn = isVacuumOn(state);
  const headlineKind = vacuumHeadlineKind(state, progress);
  const headline =
    headlineKind === "cleaningProgress"
      ? t("vacuumCard.cleaningProgress").replace("{n}", String(progress ?? 0))
      : headlineKind === "unknown"
        ? t("cardType.vacuum_card_2")
        : t(`vacuumCard.${headlineKind}`);
  const vacuumName =
    title?.trim() ||
    (typeof attrs.friendly_name === "string" && attrs.friendly_name.trim()
      ? attrs.friendly_name
      : t("cardType.vacuum_card_2"));
  const artSrc = background_image?.trim() || VACUUM_CARD_2_DEFAULT_IMAGE;
  const cardWidth = clampVacuumCard2Width(width);
  const cardHeight = clampVacuumCard2Height(height);

  async function callVacuum(service: string, serviceData?: Record<string, unknown>) {
    const res = await fetch("/api/ha/call-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity_id,
        domain: "vacuum",
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
    const nextState = isOn ? "returning" : "cleaning";
    updateEntityState(entity_id, { state: nextState });
    callVacuum(isOn ? "return_to_base" : "start")
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
      });
  }

  function handleMode(mode: VacuumFanMode) {
    if (!entity_id || pendingRef.current) return;
    const fan_speed = resolveFanSpeedForMode(mode, fanList);
    pendingRef.current = true;
    setBusyMode(mode);
    const previous = entity;
    updateEntityState(entity_id, {
      attributes: { ...attrs, fan_speed },
    });
    callVacuum("set_fan_speed", { fan_speed })
      .then(() => requestRefresh())
      .catch(() => revertEntityState(entity_id, previous))
      .finally(() => {
        pendingRef.current = false;
        setBusyMode(null);
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
      <div className="shrink-0 px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[1.35rem] font-semibold leading-tight tracking-tight text-gray-950 dark:text-white">
              {vacuumName}
            </h2>
            <p className="mt-0.5 truncate text-sm font-medium text-gray-500 dark:text-white/60">{headline}</p>
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
              aria-label={isOn ? t("vacuumCard.powerOff") : t("vacuumCard.powerOn")}
              aria-pressed={isOn}
            >
              <Power className="h-5 w-5" aria-hidden />
              {isOn ? t("vacuumCard.on") : t("vacuumCard.off")}
            </button>
            {onMoreClick ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreClick();
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={t("common.options")}
              >
                <MoreVertical className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex rounded-[1.35rem] bg-gray-100 p-1 dark:bg-white/10">
          {MODE_UI.map(({ mode, labelKey, Icon }) => {
            const selected = activeMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMode(mode);
                }}
                disabled={!entity_id || busyMode != null}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[1.1rem] px-2 py-2.5 text-[11px] font-medium transition-colors disabled:opacity-60",
                  selected
                    ? "bg-gray-200 text-gray-800 shadow-sm dark:bg-white/20 dark:text-white"
                    : "text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/70"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="truncate">{t(labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-2 min-h-0 flex-1 overflow-hidden">
        <VacuumRobotArt active={isOn} src={artSrc} />
        {battery != null ? (
          <div className="absolute right-3 top-3 z-10">
            <BatteryMeter
              level={battery}
              label={t("vacuumCard.battery").replace("{n}", String(battery))}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
