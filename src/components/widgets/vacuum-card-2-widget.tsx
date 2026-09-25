"use client";

import { useRef, useState } from "react";
import {
  AudioLines,
  Battery,
  Clock3,
  Home,
  Leaf,
  MoreVertical,
  Power,
  Settings2,
  Sparkles,
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
  resolveVacuumCleanedAreaM2,
  resolveVacuumLastCleanAt,
  vacuumCard2ArtSrc,
  vacuumCard2Density,
  vacuumHeadlineKind,
  vacuumRelativeTimeKind,
  vacuumSessionStatusKey,
  VACUUM_CARD_2_FOOTER_MIN_HEIGHT,
  type VacuumFanMode,
} from "@/lib/vacuum-card";
import { useVacuumSession } from "@/hooks/use-vacuum-session";

const MODE_UI: { mode: VacuumFanMode; labelKey: string; Icon: typeof Leaf }[] = [
  { mode: "eco", labelKey: "vacuumCard.eco", Icon: Leaf },
  { mode: "standard", labelKey: "vacuumCard.standard", Icon: AudioLines },
  { mode: "turbo", labelKey: "vacuumCard.turbo", Icon: Zap },
];

function TargetingFrame({ compact }: { compact?: boolean }) {
  const arm = compact ? "h-3.5 w-3.5 border-l-[1.5px] border-t-[1.5px]" : "h-5 w-5 border-l-2 border-t-2";
  const armBR = compact ? "h-3.5 w-3.5 border-b-[1.5px] border-r-[1.5px]" : "h-5 w-5 border-b-2 border-r-2";
  const armBL = compact ? "h-3.5 w-3.5 border-b-[1.5px] border-l-[1.5px]" : "h-5 w-5 border-b-2 border-l-2";
  const armTR = compact ? "h-3.5 w-3.5 border-r-[1.5px] border-t-[1.5px]" : "h-5 w-5 border-r-2 border-t-2";
  return (
    <div className={cn("pointer-events-none absolute z-20", compact ? "inset-[4%]" : "inset-[6%]")} aria-hidden>
      <span className={cn("absolute left-0 top-0 border-sky-400", arm)} />
      <span className={cn("absolute right-0 top-0 border-sky-400", armTR)} />
      <span className={cn("absolute bottom-0 left-0 border-sky-400", armBL)} />
      <span className={cn("absolute bottom-0 right-0 border-sky-400", armBR)} />
    </div>
  );
}

function VacuumRobotArt({ src, compact }: { src: string; compact?: boolean }) {
  return (
    <div className={cn("relative mx-auto flex max-h-full items-center justify-center", compact ? "w-[90%]" : "w-[84%]")}>
      <div className="relative max-h-full w-full">
        <TargetingFrame compact={compact} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath(src)} alt="" className="relative z-10 mx-auto max-h-full w-full object-contain" />
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
  const entityStates = useEntityStateStore((s) => s.states);
  const progressEntity = useEntityStateStore((s) =>
    progress_entity_id ? s.getState(progress_entity_id) : null
  );
  const valetudo = useVacuumSession({ active: Boolean(entity_id), includeMaintenance: false });
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
  const artSrc = vacuumCard2ArtSrc({ backgroundImage: background_image, isDark });
  const cardWidth = clampVacuumCard2Width(width);
  const cardHeight = clampVacuumCard2Height(height);
  const density = vacuumCard2Density(cardHeight);
  const isDense = density === "dense";
  const isCompact = density === "compact" || isDense;
  const showModes = !isDense;
  const showModeLabels = density === "comfortable";
  const showArtStatus = density === "comfortable";
  const showFooter = cardHeight >= VACUUM_CARD_2_FOOTER_MIN_HEIGHT;
  const lastCleanAt = resolveVacuumLastCleanAt({
    attrs,
    entities: Object.values(entityStates),
    vacuumEntityId: entity_id,
  });
  const lastSession = lastCleanAt
    ? vacuumRelativeTimeKind(lastCleanAt, Date.now())
    : null;
  const lastSessionLabel = lastSession
    ? lastSession.key === "justNow"
      ? t("vacuumCard.justNow")
      : lastSession.key === "hoursAgo" && lastSession.n === 1
        ? t("vacuumCard.hourAgo")
        : lastSession.key === "daysAgo" && lastSession.n === 1
          ? t("vacuumCard.dayAgo")
          : t(`vacuumCard.${lastSession.key}`).replace("{n}", String(lastSession.n))
    : "—";
  const area = resolveVacuumCleanedAreaM2({
    attrs,
    entities: Object.values(entityStates),
    vacuumEntityId: entity_id,
    valetudoAreaCm2: valetudo.stats.areaCm2,
  });
  const areaLabel = area != null ? `${area} m²` : "—";
  const sessionStatusKey = vacuumSessionStatusKey(state);
  const sessionStatusLabel =
    sessionStatusKey === "ready" ? t("vacuumCard.ready") : t(`vacuumCard.${sessionStatusKey}`);

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
        "flex w-full flex-col overflow-hidden rounded-2xl border-0 bg-white text-gray-900 shadow-[0_18px_50px_rgba(15,23,42,0.12)] outline-none dark:bg-zinc-950 dark:text-white dark:shadow-[0_18px_50px_rgba(0,0,0,0.65)]",
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
      <div className={cn("shrink-0", isDense ? "px-4 pt-3" : isCompact ? "px-4 pt-4" : "px-5 pt-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              className={cn(
                "truncate font-semibold leading-tight tracking-tight text-gray-950 dark:text-white",
                isDense ? "text-lg" : "text-[1.35rem]"
              )}
            >
              {vacuumName}
            </h2>
            <p
              className={cn(
                "truncate font-medium text-gray-500 dark:text-white/60",
                isDense ? "mt-0 text-xs" : "mt-0.5 text-sm"
              )}
            >
              {headline}
              {isDense && battery != null
                ? ` · ${t("vacuumCard.batteryShort").replace("{n}", String(battery))}`
                : null}
            </p>
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
                "inline-flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-sm font-semibold transition-colors disabled:opacity-40",
                isOn ? "text-teal-500" : "text-gray-400 dark:text-white/45"
              )}
              aria-label={isOn ? t("vacuumCard.powerOff") : t("vacuumCard.powerOn")}
              aria-pressed={isOn}
            >
              <Power className={cn(isDense ? "h-4 w-4" : "h-5 w-5")} aria-hidden />
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

        {showModes ? (
          <div className={cn("grid grid-cols-3 gap-2", isCompact ? "mt-2.5" : "mt-4")}>
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
                    "flex min-w-0 flex-col items-center rounded-xl px-1.5 text-[11px] font-medium transition-colors disabled:opacity-60",
                    showModeLabels ? "gap-1 py-3" : "gap-0 py-2",
                    selected
                      ? "bg-white text-gray-900 shadow-sm ring-2 ring-sky-400 dark:bg-zinc-900 dark:text-white dark:ring-sky-400"
                      : "bg-gray-100 text-gray-400 hover:text-gray-600 dark:bg-white/[0.04] dark:text-white/40 dark:hover:text-white/70"
                  )}
                  aria-label={t(labelKey)}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {showModeLabels ? <span className="truncate">{t(labelKey)}</span> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col items-center justify-center px-4",
          isDense ? "pt-1 pb-2" : "pt-3"
        )}
      >
        <VacuumRobotArt src={artSrc} compact={isCompact} />
        {showArtStatus ? (
          <div className="mt-2 flex flex-col items-center gap-0.5 text-sm font-medium text-gray-700 dark:text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-gray-400 dark:text-white/45" aria-hidden />
              {headline}
            </span>
            {battery != null ? (
              <span
                className="inline-flex items-center gap-1.5 text-gray-500 dark:text-white/60"
                aria-label={t("vacuumCard.battery").replace("{n}", String(battery))}
              >
                <Battery className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                {t("vacuumCard.batteryShort").replace("{n}", String(battery))}
              </span>
            ) : null}
          </div>
        ) : !isDense && battery != null ? (
          <span
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-white/60"
            aria-label={t("vacuumCard.battery").replace("{n}", String(battery))}
          >
            <Battery className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
            {t("vacuumCard.batteryShort").replace("{n}", String(battery))}
          </span>
        ) : null}
      </div>

      {showFooter ? (
        <div className="grid shrink-0 grid-cols-3 gap-1 border-t border-gray-100 px-3 py-3 dark:border-white/10">
          <FooterStat icon={Clock3} label={t("vacuumCard.lastSession")} value={lastSessionLabel} />
          <FooterStat icon={Sparkles} label={t("vacuumCard.area")} value={areaLabel} />
          <FooterStat icon={Settings2} label={t("vacuumCard.status")} value={sessionStatusLabel} />
        </div>
      ) : null}
    </div>
  );
}

function FooterStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-gray-400 dark:text-white/40">
        <Icon className="h-3 w-3" aria-hidden />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-0.5 truncate text-xs font-semibold text-gray-800 dark:text-white/85">{value}</p>
    </div>
  );
}
