"use client";

import { useRef, useState } from "react";
import {
  AudioLines,
  Battery,
  Leaf,
  MoreVertical,
  Power,
  Zap,
} from "lucide-react";
import type { VacuumCard2Props } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
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
  vacuumCard2ArtSrc,
  vacuumCard2Density,
  vacuumHeadlineKind,
  type VacuumFanMode,
} from "@/lib/vacuum-card";

const MODE_UI: { mode: VacuumFanMode; labelKey: string; Icon: typeof Leaf }[] = [
  { mode: "eco", labelKey: "vacuumCard.eco", Icon: Leaf },
  { mode: "standard", labelKey: "vacuumCard.standard", Icon: AudioLines },
  { mode: "turbo", labelKey: "vacuumCard.turbo", Icon: Zap },
];

function BatteryPill({ percent }: { percent: number }) {
  const fill = Math.min(100, Math.max(0, percent));
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-teal-500">
      <span className="relative inline-flex h-3 w-6 items-center rounded-[3px] border border-teal-500/80 p-[1px]">
        <span
          className="h-full rounded-[1px] bg-teal-500"
          style={{ width: `${fill}%` }}
          aria-hidden
        />
        <span className="absolute -right-[3px] top-1/2 h-1.5 w-[2px] -translate-y-1/2 rounded-r-sm bg-teal-500/80" aria-hidden />
      </span>
      {fill}%
    </span>
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
  interactive = false,
  onCardClick,
}: VacuumCard2Props & {
  className?: string;
  onMoreClick?: () => void;
  interactive?: boolean;
  onCardClick?: () => void;
}) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.resolved) === "dark";
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
        ? title?.trim() || t("cardType.vacuum_card_2")
        : t(`vacuumCard.${headlineKind}`);
  const artSrc = vacuumCard2ArtSrc({ backgroundImage: background_image, isDark });
  const cardWidth = clampVacuumCard2Width(width);
  const cardHeight = clampVacuumCard2Height(height);
  const density = vacuumCard2Density(cardHeight);
  const isDense = density === "dense";
  const isCompact = density === "compact" || isDense;
  const showModes = !isDense;
  const showModeLabels = density === "comfortable";

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
        "relative flex w-full flex-col overflow-hidden rounded-[28px] border-0 bg-white text-gray-900 shadow-[0_18px_50px_rgba(15,23,42,0.12)] outline-none dark:bg-zinc-950 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.65)]",
        size === "sm" && "text-sm",
        size === "lg" && "text-lg",
        interactive && "cursor-pointer",
        className
      )}
      style={{ width: cardWidth, height: cardHeight, minHeight: cardHeight }}
      onClick={
        onCardClick
          ? (e) => {
              if ((e.target as HTMLElement).closest?.("button")) return;
              onCardClick();
            }
          : undefined
      }
    >
      <div className={cn("relative z-10 shrink-0", isDense ? "px-4 pt-3" : "px-5 pt-5")}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {battery != null ? (
              <BatteryPill percent={battery} />
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400">
                <Battery className="h-4 w-4" aria-hidden />
                —
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePower();
              }}
              disabled={!entity_id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-1 py-0.5 text-sm font-semibold transition-colors disabled:opacity-40",
                isOn ? "text-teal-500" : "text-gray-400 dark:text-white/45"
              )}
              aria-label={isOn ? t("vacuumCard.powerOff") : t("vacuumCard.powerOn")}
              aria-pressed={isOn}
            >
              <Power className={cn(isDense ? "h-4 w-4" : "h-[18px] w-[18px]")} aria-hidden />
              {isDense ? null : isOn ? t("vacuumCard.on") : t("vacuumCard.off")}
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
                <MoreVertical className={cn(isDense ? "h-4 w-4" : "h-5 w-5")} aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <h2
          className={cn(
            "font-semibold leading-snug tracking-tight text-gray-950 dark:text-white",
            isDense ? "mt-2 text-base" : isCompact ? "mt-3 text-xl" : "mt-3 text-[1.65rem]"
          )}
        >
          {headline}
        </h2>

        {showModes ? (
          <div
            className={cn(
              "grid grid-cols-3 rounded-2xl bg-gray-100/90 p-1 dark:bg-white/[0.06]",
              isCompact ? "mt-3" : "mt-4"
            )}
            role="group"
            aria-label={t("vacuumCard.standard")}
          >
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
                    "flex min-w-0 flex-col items-center rounded-xl px-1 text-[11px] font-medium transition-colors disabled:opacity-60",
                    showModeLabels ? "gap-1 py-2.5" : "gap-0 py-2",
                    selected
                      ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "bg-transparent text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/70"
                  )}
                  aria-label={t(labelKey)}
                  aria-pressed={selected}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {showModeLabels ? <span className="truncate">{t(labelKey)}</span> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath(artSrc)}
          alt=""
          className={cn(
            "pointer-events-none absolute left-1/2 w-[118%] max-w-none -translate-x-1/2 object-cover object-top",
            isDense ? "bottom-[-28%] h-[95%]" : "bottom-[-18%] h-[108%]"
          )}
          draggable={false}
        />
      </div>
    </div>
  );
}
