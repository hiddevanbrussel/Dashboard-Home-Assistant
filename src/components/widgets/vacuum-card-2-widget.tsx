"use client";

import { useRef, useState } from "react";
import { Battery, Leaf, MoreVertical, Zap } from "lucide-react";
import type { VacuumCard2Props } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  clampVacuumCard2Height,
  clampVacuumCard2Width,
  currentFanSpeedFromAttributes,
  fanModeFromSpeed,
  fanSpeedListFromAttributes,
  parsePercent,
  progressFromAttributes,
  resolveFanSpeedForMode,
  resolveVacuumBattery,
  resolveVacuumDisplayState,
  vacuumCard2ArtSrc,
  vacuumCard2Density,
  vacuumHeadlineKind,
  humanizeVacuumState,
  type VacuumFanMode,
} from "@/lib/vacuum-card";

function StandardModeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 20V12" />
      <path d="M12 20V7" />
      <path d="M18 20V10" />
    </svg>
  );
}

const MODE_UI: {
  mode: VacuumFanMode;
  labelKey: string;
  Icon: typeof Leaf | typeof StandardModeIcon;
}[] = [
  { mode: "eco", labelKey: "vacuumCard.eco", Icon: Leaf },
  { mode: "standard", labelKey: "vacuumCard.standard", Icon: StandardModeIcon },
  { mode: "turbo", labelKey: "vacuumCard.turbo", Icon: Zap },
];

function BatteryPill({ percent }: { percent: number }) {
  const fill = Math.min(100, Math.max(0, percent));
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-emerald-500 dark:text-emerald-400">
      <span className="relative inline-flex h-3 w-6 items-center rounded-[3px] border border-emerald-500/90 p-[1px] dark:border-emerald-400/90">
        <span
          className="h-full rounded-[1px] bg-emerald-500 dark:bg-emerald-400"
          style={{ width: `${fill}%` }}
          aria-hidden
        />
        <span
          className="absolute -right-[3px] top-1/2 h-1.5 w-[2px] -translate-y-1/2 rounded-r-sm bg-emerald-500/90 dark:bg-emerald-400/90"
          aria-hidden
        />
      </span>
      {fill}%
    </span>
  );
}

export function VacuumCard2Widget({
  title = "Vacuum",
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
  const displayState = resolveVacuumDisplayState(state, attrs);
  const allStates = useEntityStateStore((s) => s.states);
  const battery = resolveVacuumBattery({
    entityId: entity_id,
    attributes: attrs,
    entities: Object.values(allStates).map((e) => ({
      entity_id: e.entity_id,
      state: String(e.state ?? ""),
      attributes: e.attributes,
    })),
  });
  const progress = parsePercent(progressEntity?.state) ?? progressFromAttributes(attrs);
  const fanList = fanSpeedListFromAttributes(attrs);
  const fanSpeed = currentFanSpeedFromAttributes(attrs);
  const activeMode = fanModeFromSpeed(fanSpeed, fanList);
  const headlineKind = vacuumHeadlineKind(displayState, progress);
  const statusLabel =
    headlineKind === "cleaningProgress"
      ? t("vacuumCard.cleaningProgress").replace("{n}", String(progress ?? 0))
      : headlineKind === "unknown"
        ? humanizeVacuumState(displayState) ||
          (entity ? t("vacuumCard.ready") : t("vacuumCard.unavailable"))
        : t(`vacuumCard.${headlineKind}`);
  const artSrc = vacuumCard2ArtSrc({
    backgroundImage: background_image,
    isDark,
    displayState,
  });
  const cardWidth = clampVacuumCard2Width(width);
  const cardHeight = clampVacuumCard2Height(height);
  const density = vacuumCard2Density(cardHeight);
  const isDense = density === "dense";
  const isCompact = density === "compact" || isDense;

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
        "relative flex w-full flex-col overflow-hidden rounded-[1.5rem] text-[#1B2437] shadow-[0_14px_40px_rgba(15,23,42,0.1)] outline-none dark:text-white dark:shadow-[0_14px_40px_rgba(0,0,0,0.45)]",
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
      {/* Full-bleed theme product art */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(artSrc)}
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      {/* Soft fades so header / modes stay readable on the photo */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-white/75 via-white/35 to-transparent dark:from-black/55 dark:via-black/25 dark:to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-white/80 via-white/40 to-transparent dark:from-black/60 dark:via-black/30 dark:to-transparent"
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 flex shrink-0 items-start justify-between gap-3",
          isDense ? "px-4 pt-3.5" : "px-5 pt-5"
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1">
            <h2
              className={cn(
                "truncate font-semibold tracking-tight text-[#1B2437] dark:text-white",
                isDense ? "text-base" : isCompact ? "text-lg" : "text-xl"
              )}
            >
              {title}
            </h2>
            {onMoreClick ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreClick();
                }}
                className="ml-0.5 shrink-0 rounded-lg p-1 text-[#1B2437]/40 hover:bg-black/5 hover:text-[#1B2437]/70 dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={t("common.options")}
              >
                <MoreVertical className={cn(isDense ? "h-4 w-4" : "h-5 w-5")} aria-hidden />
              </button>
            ) : null}
          </div>
          <p
            className={cn(
              "mt-0.5 truncate font-medium text-[#5B6B82] dark:text-white/60",
              isDense ? "text-xs" : "text-sm"
            )}
            title={displayState || state || undefined}
          >
            {statusLabel}
          </p>
        </div>
        <div className="shrink-0 pt-0.5">
          {battery != null ? (
            <BatteryPill percent={battery} />
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B2437]/35 dark:text-white/40">
              <Battery className="h-4 w-4" aria-hidden />
              —
            </span>
          )}
        </div>
      </div>

      <div className="relative z-0 min-h-0 flex-1" aria-hidden />

      <div className={cn("relative z-10 shrink-0", isDense ? "px-3 pb-3 pt-1" : "px-4 pb-4 pt-1")}>
        <div
          className={cn("grid grid-cols-3", isDense ? "gap-1.5" : "gap-2.5")}
          role="group"
          aria-label={t("vacuum.fan")}
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
                  "flex min-w-0 flex-col items-center justify-center rounded-2xl transition-colors disabled:opacity-60",
                  isDense ? "gap-0.5 px-1 py-2" : "gap-1 px-2 py-3",
                  "bg-white/75 backdrop-blur-sm dark:bg-white/10",
                  selected
                    ? "text-[#1B2437] shadow-[inset_0_0_0_1px_rgba(27,36,55,0.08)] dark:text-white dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                    : "text-[#5B6B82] hover:bg-white/90 hover:text-[#1B2437] dark:text-white/55 dark:hover:bg-white/14 dark:hover:text-white/80"
                )}
                aria-label={t(labelKey)}
                aria-pressed={selected}
              >
                <Icon
                  className={cn(
                    isDense ? "h-4 w-4" : "h-[18px] w-[18px]",
                    selected ? "stroke-[2.25]" : "stroke-2"
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "truncate",
                    isDense ? "text-[10px]" : "text-[11px]",
                    selected ? "font-semibold" : "font-medium"
                  )}
                >
                  {t(labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
