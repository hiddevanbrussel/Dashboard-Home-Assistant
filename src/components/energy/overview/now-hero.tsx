"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Battery, House, Sun, UtilityPole } from "lucide-react";
import { HouseLabel } from "@/components/energy/overview/house-labels";
import { NowHeroLayers, type HouseLineSpec } from "@/components/energy/overview/now-hero-layers";
import { useTranslation } from "@/hooks/use-translation";
import { ENERGY_MY_TILES_ENABLED } from "@/lib/energy-tab";
import { heroOfflineState, offlinePowerText } from "@/lib/energy-story/offline";
import { type OverviewOrientation } from "@/lib/energy-house-anchors";
import {
  fallbackEnergyStage,
  flowRunsTowardHouse,
  houseAriaName,
  labelAccent,
  labelAnchor,
  labelFlowEnabled,
  labelPosition,
  type EnergyStage,
  type HouseLabelKind,
} from "@/lib/energy-house-labels";
import {
  batteryPowerNow,
  gridPowerNow,
  housePowerNow,
  solarPowerNow,
  type LiveSamples,
  type ManualLiveEntities,
} from "@/lib/energy-live";
import {
  batteryIsLinked,
  dayNightPair,
  consumptionIsLinked,
  formatLivePower,
  formatSoc,
  gridExportIsLinked,
  gridImportIsLinked,
  houseAssetPath,
  houseVariant,
  nowSentenceKey,
  overviewIsLinked,
  shouldAnimate,
  solarIsLinked,
  solarPillOn,
  splitLivePower,
  stepHeroGates,
  stepPowerFlowing,
  type HeroGates,
  type HouseVariantId,
} from "@/lib/energy-now";
import type { EnergyModel } from "@/lib/energy-prefs";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useEnergyStore } from "@/stores/energy-store";
import { useEnergyOverviewStore } from "@/stores/energy-overview-store";
import { FALLBACK_TIME_ZONE } from "@/lib/local-date";
import { useThemeStore } from "@/stores/theme-store";

function fill(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}

function asModel(value: unknown): EnergyModel | null {
  if (!value || typeof value !== "object") return null;
  const model = value as EnergyModel;
  if (model.source !== "prefs" && model.source !== "manual") return null;
  if (!Array.isArray(model.energySources)) return null;
  return model;
}

function sampleFromState(
  states: Record<string, { state: string; attributes?: Record<string, unknown> } | undefined>,
  id: string
): { value: number; unit?: string | null } | undefined {
  if (!id) return undefined;
  const entity = states[id];
  if (!entity) return undefined;
  const value = Number(entity.state);
  if (!Number.isFinite(value)) return undefined;
  const unit = entity.attributes?.unit_of_measurement;
  return { value, unit: typeof unit === "string" ? unit : null };
}

function batteryStatSoc(model: EnergyModel | null): string {
  if (!model) return "";
  for (const source of model.energySources) {
    if (source.type === "battery" && source.statSoc) return source.statSoc;
  }
  return "";
}

function useMotionFlags(frame: RefObject<HTMLElement | null>) {
  const storedTab = useEnergyOverviewStore((state) => state.tab);
  const tab = ENERGY_MY_TILES_ENABLED ? storedTab : "overview";
  const [flags, setFlags] = useState({
    reducedMotion: false,
    glassOff: false,
    hidden: false,
    visible: true,
    screensaver: false,
  });

  useEffect(() => {
    const read = () => {
      setFlags((current) => ({
        ...current,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        glassOff: document.documentElement.getAttribute("data-glass-density") === "off",
        hidden: document.hidden,
        screensaver: Boolean(document.querySelector(".fixed.inset-0.z-\\[9999\\]")),
      }));
    };
    read();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", read);
    document.addEventListener("visibilitychange", read);
    const glass = new MutationObserver(read);
    glass.observe(document.documentElement, { attributes: true, attributeFilter: ["data-glass-density"] });
    const body = new MutationObserver(read);
    body.observe(document.body, { childList: true });
    return () => {
      motion.removeEventListener("change", read);
      document.removeEventListener("visibilitychange", read);
      glass.disconnect();
      body.disconnect();
    };
  }, []);

  useEffect(() => {
    const node = frame.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setFlags((current) => ({ ...current, visible: Boolean(entry?.isIntersecting) }));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [frame]);

  return { ...flags, tab };
}

export function NowHero({
  orientation,
  stage,
  onOpenLabel,
  labelOpens,
}: {
  orientation: OverviewOrientation;
  stage?: EnergyStage | null;
  onOpenLabel?: (kind: HouseLabelKind, source: HTMLElement) => void;
  labelOpens?: (kind: HouseLabelKind) => boolean;
}) {
  const { t, language } = useTranslation();
  const locale = language === "nl" ? "nl" : "en";
  const theme = useThemeStore((state) => state.resolved);
  const entities = useEnergyStore((state) => state.entities);
  const gridPowerInverted = useEnergyStore((state) => state.gridPowerInverted);
  const states = useEntityStateStore((state) => state.states);
  const haError = useEntityStateStore((state) => state.error);
  const updatedAt = useEntityStateStore((state) => state.updatedAt);
  const [model, setModel] = useState<EnergyModel | null>(null);
  const [prefsStatus, setPrefsStatus] = useState<"loading" | "ready" | "error">("loading");
  const frameRef = useRef<HTMLDivElement | null>(null);
  const gatesRef = useRef<HeroGates>({ solar: false, grid: false, battery: false });
  const flowRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ha/energy/prefs", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("prefs");
        return response.json() as Promise<unknown>;
      })
      .then((body) => {
        if (cancelled) return;
        setModel(asModel(body));
        setPrefsStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setModel(null);
        setPrefsStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const manual = useMemo<ManualLiveEntities>(
    () => ({
      gridPowerEntityId: entities.gridPowerEntityId,
      gridImportPowerEntityId: entities.gridImportPowerEntityId,
      gridExportPowerEntityId: entities.gridExportPowerEntityId,
      gridPowerInverted,
      consumptionEntityId: entities.consumptionEntityId,
      solarPowerEntityId: entities.solarPowerEntityId,
      batteryPowerEntityId: entities.batteryPowerEntityId,
    }),
    [entities, gridPowerInverted]
  );

  const samples = useMemo<LiveSamples>(() => {
    const ids = [
      manual.gridPowerEntityId,
      manual.gridImportPowerEntityId,
      manual.gridExportPowerEntityId,
      manual.consumptionEntityId,
      manual.solarPowerEntityId,
      manual.batteryPowerEntityId,
      batteryStatSoc(model),
      entities.batterySocEntityId,
    ];
    const next: Record<string, { value: number; unit?: string | null }> = {};
    for (const source of model?.energySources ?? []) {
      if (source.type === "solar" && source.statRate) ids.push(source.statRate);
      if (source.type === "grid") {
        if (source.statRate) ids.push(source.statRate);
        if (source.powerConfig?.statRate) ids.push(source.powerConfig.statRate);
        if (source.powerConfig?.statRateInverted) ids.push(source.powerConfig.statRateInverted);
        if (source.powerConfig?.statRateFrom) ids.push(source.powerConfig.statRateFrom);
        if (source.powerConfig?.statRateTo) ids.push(source.powerConfig.statRateTo);
      }
      if (source.type === "battery") {
        if (source.statRate) ids.push(source.statRate);
        if (source.powerConfig?.statRate) ids.push(source.powerConfig.statRate);
        if (source.powerConfig?.statRateInverted) ids.push(source.powerConfig.statRateInverted);
        if (source.powerConfig?.statRateFrom) ids.push(source.powerConfig.statRateFrom);
        if (source.powerConfig?.statRateTo) ids.push(source.powerConfig.statRateTo);
      }
    }
    for (const id of ids) {
      const value = sampleFromState(states, id);
      if (value) next[id] = value;
    }
    return next;
  }, [entities.batterySocEntityId, manual, model, states]);

  const solarKw = solarPowerNow({ model, manual, samples });
  const gridKw = gridPowerNow({ model, manual, samples });
  const batteryPower = batteryPowerNow({ model, manual, samples });
  const houseKw = housePowerNow({ model, manual, samples });

  const solarLinked = solarIsLinked(model, manual.solarPowerEntityId, entities.solarYieldTodayEntityId);
  const batteryLinked = batteryIsLinked(model, entities.batterySocEntityId, manual.batteryPowerEntityId);
  const importLinked = gridImportIsLinked(model, manual.gridPowerEntityId, manual.gridImportPowerEntityId);
  const exportLinked = gridExportIsLinked(model, manual.gridPowerEntityId, manual.gridExportPowerEntityId);
  const gridLinked = importLinked || exportLinked;
  const consumptionLinked = consumptionIsLinked(entities.consumptionEntityId);
  const linked = overviewIsLinked({
    solar: solarLinked,
    battery: batteryLinked,
    grid: gridLinked,
    consumption: consumptionLinked,
  });
  const linksKnown = prefsStatus !== "loading" || solarLinked || batteryLinked;
  const sun = states["sun.sun"]?.state;
  const night = sun === "below_horizon";
  const variant: HouseVariantId | null = linksKnown
    ? houseVariant({
        theme: theme === "dark" ? "dark" : "light",
        sunAboveHorizon: !night,
        solarLinked,
        batteryLinked,
      })
    : null;

  useEffect(() => {
    if (!variant) return;
    const pair = dayNightPair(variant);
    if (!pair) return;
    const preload = () => {
      const image = new Image();
      image.src = houseAssetPath(pair, "avif");
    };
    if (typeof window.requestIdleCallback !== "function") {
      preload();
      return;
    }
    const id = window.requestIdleCallback(preload);
    return () => window.cancelIdleCallback(id);
  }, [variant]);

  const socId = batteryStatSoc(model) || entities.batterySocEntityId;
  const socRaw = Number(states[socId]?.state);
  const soc = Number.isFinite(socRaw) ? socRaw : null;
  const knownPower = (value: number | null) => (value == null || !Number.isFinite(value) ? null : formatLivePower(value, locale));

  const gates = stepHeroGates(gatesRef.current, { solarKw, gridKw, batteryKw: batteryPower });
  gatesRef.current = gates;

  const hasMeasurement = [solarKw, gridKw, batteryPower, houseKw].some((value) => value != null && Number.isFinite(value));
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIME_ZONE;
  const presence = heroOfflineState({
    haReachable: haError == null,
    prefsReady: prefsStatus !== "loading",
    linked,
    hasMeasurement,
    houseKw,
    lastAt: updatedAt == null ? null : new Date(updatedAt),
    timeZone,
  });
  const sentenceKey = presence.offline
    ? null
    : nowSentenceKey({
        linked,
        night,
        solarOn: gates.solar,
        batteryOn: gates.battery,
        gridOn: gates.grid,
        solarKw,
        batteryKw: batteryPower,
        gridKw,
        houseKw,
        consumptionOnly: consumptionLinked && !solarLinked && !batteryLinked && !gridLinked,
      });
  const sentenceKw =
    sentenceKey === "energy.overview.now.sentenceBatteryOut"
      ? knownPower(batteryPower)
      : sentenceKey === "energy.overview.now.sentenceImport"
        ? knownPower(gridKw != null && gridKw > 0 ? gridKw : null)
        : sentenceKey === "energy.overview.now.sentenceHouse"
          ? knownPower(houseKw)
          : null;
  const sentence = presence.offline
    ? presence.time
      ? fill(t("energy.story.offlineSentence"), { time: presence.time })
      : t("energy.story.offlineSentenceBare")
    : sentenceKey
      ? fill(t(sentenceKey), {
          kw: sentenceKw ?? "",
          power: sentenceKw ?? "",
          solar: knownPower(solarKw) ?? "",
          house: knownPower(houseKw) ?? "",
        })
      : "";

  const flowing = presence.offline ? false : stepPowerFlowing(flowRef.current, [solarKw, gridKw, batteryPower, houseKw]);
  flowRef.current = presence.offline ? flowRef.current : flowing;
  const motion = useMotionFlags(frameRef);
  const animate = presence.offline ? false : shouldAnimate({ ...motion, flowing });
  const dark = theme === "dark";
  const frame = stage ?? fallbackEnergyStage(orientation);
  const powerText = (value: number | null) => (value == null ? null : formatLivePower(Math.abs(value), locale));
  const shownPower = (value: number | null) => {
    if (value == null || !Number.isFinite(value)) return null;
    if (presence.offline && value === 0) return null;
    return splitLivePower(Math.abs(value), locale);
  };
  const solarVisible = solarLinked && solarPillOn({ night, solarKw, gate: gates.solar });
  const solarParts = solarVisible ? shownPower(solarKw) : null;
  const housePartsShown = consumptionLinked ? shownPower(houseKw) : null;
  const gridParts = gridLinked ? shownPower(gridKw) : null;
  const socText = soc == null ? "" : formatSoc(soc, locale).replace("%", "");
  const flowInput = {
    animate,
    solarOn: gates.solar,
    gridOn: gates.grid,
    batteryOn: gates.battery,
    houseKw,
  };
  const directionInput = { gridKw, batteryKw: batteryPower };
  const charging = gates.battery && (batteryPower ?? 0) < 0;
  const supplying = gates.battery && (batteryPower ?? 0) > 0;
  const batteryStatus =
    presence.offline && !charging && !supplying
      ? t("energy.overview.now.offlineBattery")
      : charging
        ? fill(t("energy.overview.now.batteryCharge"), { kw: powerText(batteryPower) ?? "" })
        : supplying
          ? fill(t("energy.overview.now.batterySupply"), { kw: powerText(batteryPower) ?? "" })
          : t("energy.overview.now.batteryIdle");
  const labelSig = [
    `solar:${solarParts?.value ?? ""}`,
    `house:${housePartsShown?.value ?? ""}`,
    `grid:${gridParts?.value ?? ""}:${gridKw ?? ""}`,
    `battery:${socText}:${batteryPower ?? ""}:${gates.battery ? 1 : 0}`,
    `flow:${animate ? 1 : 0}:${dark ? 1 : 0}:${orientation}`,
  ].join("|");
  const specs: HouseLineSpec[] = [];
  if (solarParts) {
    specs.push({
      kind: "solar",
      accent: labelAccent("solar", dark),
      anchor: labelAnchor("solar", orientation),
      towardHouse: flowRunsTowardHouse("solar", directionInput),
      flow: labelFlowEnabled("solar", flowInput),
    });
  }
  if (housePartsShown) {
    specs.push({
      kind: "house",
      accent: labelAccent("house", dark),
      anchor: labelAnchor("house", orientation),
      towardHouse: true,
      flow: labelFlowEnabled("house", flowInput),
    });
  }
  if (gridParts) {
    specs.push({
      kind: "grid",
      accent: labelAccent("grid", dark),
      anchor: labelAnchor("grid", orientation),
      towardHouse: flowRunsTowardHouse("grid", directionInput),
      flow: labelFlowEnabled("grid", flowInput),
    });
  }
  if (batteryLinked && soc != null) {
    specs.push({
      kind: "battery",
      accent: labelAccent("battery", dark),
      anchor: labelAnchor("battery", orientation),
      towardHouse: flowRunsTowardHouse("battery", directionInput),
      flow: labelFlowEnabled("battery", flowInput),
    });
  }
  const interactive = (kind: HouseLabelKind) => Boolean(labelOpens?.(kind));

  return (
    <div
      className="contents"
      data-now-hero={variant ?? "pending"}
      data-now-offline={presence.offline ? "1" : "0"}
      data-orientation={orientation}
    >
      <p
        data-now-head
        className="absolute z-10 flex h-6 items-center gap-2 text-[15px] font-semibold text-[#374151] dark:text-[#d1d5db]"
        style={{ top: frame.kickerTop, left: frame.padLeft }}
      >
        {presence.offline ? (
          <span>
            {presence.time
              ? fill(t("energy.story.offlineBadge"), { time: presence.time })
              : t("energy.story.offlineOnly")}
          </span>
        ) : (
          <span>{t("energy.overview.now.kicker")}</span>
        )}
        <span
          data-now-live={presence.badge}
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            presence.offline
              ? "bg-[#6B7280] shadow-[0_0_0_4px_rgba(107,114,128,0.18)] dark:bg-[#9CA3AF] dark:shadow-[0_0_0_4px_rgba(156,163,175,0.18)]"
              : "bg-[#047857] shadow-[0_0_0_4px_rgba(4,120,87,0.25)]"
          )}
          aria-hidden
        />
        {presence.offline ? null : (
          <span className="text-sm font-semibold text-[#047857] dark:text-[#6EE7B7]">
            {t("energy.overview.now.live")}
          </span>
        )}
      </p>
      <div
        data-now-housebox
        data-house-width={frame.houseWidth}
        data-house-height={frame.houseHeight}
        className="absolute"
        style={{
          top: frame.houseTop,
          left: frame.houseLeft,
          width: frame.houseWidth,
          height: frame.houseHeight,
        }}
      >
        <div ref={frameRef} data-now-frame className="relative h-full w-full">
          {variant ? (
            <picture>
              <source type="image/avif" srcSet={houseAssetPath(variant, "avif")} />
              <img
                src={houseAssetPath(variant, "webp")}
                width={960}
                height={727}
                alt=""
                decoding="async"
                className="h-full w-full object-contain"
              />
            </picture>
          ) : null}
          {variant ? <NowHeroLayers specs={specs} sig={labelSig} /> : null}
          {solarParts ? (
            <HouseLabel
              kind="solar"
              value={solarParts.value}
              unit={solarParts.unit}
              accent={labelAccent("solar", dark)}
              left={labelPosition("solar", orientation).left}
              top={labelPosition("solar", orientation).top}
              ariaLabel={`${t("energy.story.sun")}, ${powerText(solarKw) ?? ""}, ${t("energy.overview.now.solarRoof")}`}
              interactive={interactive("solar")}
              offline={presence.offline}
              active
              icon={<Sun className="h-4 w-4" aria-hidden />}
              onOpen={(source) => onOpenLabel?.("solar", source)}
            />
          ) : null}
          {housePartsShown ? (
            <HouseLabel
              kind="house"
              value={housePartsShown.value}
              unit={housePartsShown.unit}
              accent={labelAccent("house", dark)}
              left={labelPosition("house", orientation).left}
              top={labelPosition("house", orientation).top}
              ariaLabel={`${houseAriaName(locale)}, ${powerText(houseKw) ?? ""}, ${t("energy.overview.now.house")}`}
              interactive={interactive("house")}
              offline={presence.offline}
              active={labelFlowEnabled("house", flowInput)}
              icon={<House className="h-4 w-4" aria-hidden />}
              onOpen={(source) => onOpenLabel?.("house", source)}
            />
          ) : null}
          {gridParts ? (
            <HouseLabel
              kind="grid"
              value={gridParts.value}
              unit={gridParts.unit}
              accent={labelAccent("grid", dark)}
              left={labelPosition("grid", orientation).left}
              top={labelPosition("grid", orientation).top}
              ariaLabel={`${t("energy.story.gridLabel")}, ${powerText(gridKw) ?? ""}, ${(gridKw ?? 0) < 0 ? t("energy.overview.now.gridBack") : t("energy.overview.now.gridFrom")}`}
              interactive={interactive("grid")}
              offline={presence.offline}
              active={gates.grid}
              icon={<UtilityPole className="h-4 w-4" aria-hidden />}
              onOpen={(source) => onOpenLabel?.("grid", source)}
            />
          ) : null}
          {batteryLinked && soc != null ? (
            <HouseLabel
              kind="battery"
              value={socText}
              unit="%"
              accent={labelAccent("battery", dark)}
              left={labelPosition("battery", orientation).left}
              top={labelPosition("battery", orientation).top}
              ariaLabel={`${t("energy.story.battery")}, ${formatSoc(soc, locale)}, ${batteryStatus}`}
              interactive={interactive("battery")}
              offline={presence.offline}
              active={gates.battery}
              icon={<Battery className="h-4 w-4" aria-hidden />}
              onOpen={(source) => onOpenLabel?.("battery", source)}
            />
          ) : null}
        </div>
      </div>
      <p
        data-now-sentence
        className="absolute truncate text-center text-[16px] leading-[22px] text-[#374151] dark:text-[#d1d5db]"
        style={{ top: frame.sentenceTop, left: frame.padLeft, width: frame.columnWidth, height: 22 }}
      >
        {sentence}
      </p>
    </div>
  );
}

