"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { NowHeroLayers } from "@/components/energy/overview/now-hero-layers";
import { useTranslation } from "@/hooks/use-translation";
import { labelLayout, type HeroLabelKind, type OverviewOrientation } from "@/lib/energy-house-anchors";
import {
  batteryKw,
  gridPowerKw,
  housePowerKw,
  solarPowerKw,
  type LiveSamples,
  type ManualLiveEntities,
} from "@/lib/energy-live";
import {
  batteryIsLinked,
  dayNightPair,
  flowStep,
  formatPowerKw,
  formatSoc,
  gridExportIsLinked,
  gridImportIsLinked,
  houseAssetPath,
  houseVariant,
  nowSentenceKey,
  powerIsFlowing,
  shouldAnimate,
  solarIsLinked,
  strongestFlowKw,
  type HouseVariantId,
} from "@/lib/energy-now";
import type { EnergyModel } from "@/lib/energy-prefs";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useEnergyStore } from "@/stores/energy-store";
import { useEnergyOverviewStore } from "@/stores/energy-overview-store";
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

function appendSample(previous: readonly number[], value: number | null): number[] {
  if (value == null) return [...previous];
  return [...previous, value].slice(-3);
}

function batteryStatSoc(model: EnergyModel | null): string {
  if (!model) return "";
  for (const source of model.energySources) {
    if (source.type === "battery" && source.statSoc) return source.statSoc;
  }
  return "";
}

function useMotionFlags(frame: RefObject<HTMLElement | null>) {
  const tab = useEnergyOverviewStore((state) => state.tab);
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

export function NowHero({ orientation }: { orientation: OverviewOrientation }) {
  const { t, language } = useTranslation();
  const locale = language === "nl" ? "nl" : "en";
  const theme = useThemeStore((state) => state.resolved);
  const entities = useEnergyStore((state) => state.entities);
  const gridPowerInverted = useEnergyStore((state) => state.gridPowerInverted);
  const states = useEntityStateStore((state) => state.states);
  const [model, setModel] = useState<EnergyModel | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const previous = useRef({ solar: [] as number[], grid: [] as number[], battery: [] as number[], house: [] as number[] });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ha/energy/prefs", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("prefs");
        return response.json() as Promise<unknown>;
      })
      .then((body) => {
        if (!cancelled) setModel(asModel(body));
      })
      .catch(() => {
        if (!cancelled) setModel(null);
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

  const solarKw = solarPowerKw({ model, manual, samples, previous: previous.current.solar });
  const gridKw = gridPowerKw({ model, manual, samples, previous: previous.current.grid });
  const batteryPower = batteryKw({ model, manual, samples, previous: previous.current.battery });
  const houseKw = housePowerKw({ model, manual, samples, previous: previous.current.house });

  useEffect(() => {
    previous.current = {
      solar: appendSample(previous.current.solar, solarKw),
      grid: appendSample(previous.current.grid, gridKw),
      battery: appendSample(previous.current.battery, batteryPower),
      house: appendSample(previous.current.house, houseKw),
    };
  }, [solarKw, gridKw, batteryPower, houseKw]);

  const solarLinked = solarIsLinked(model, manual.solarPowerEntityId, entities.solarYieldTodayEntityId);
  const batteryLinked = batteryIsLinked(model, entities.batterySocEntityId, manual.batteryPowerEntityId);
  const importLinked = gridImportIsLinked(model, manual.gridPowerEntityId, manual.gridImportPowerEntityId);
  const exportLinked = gridExportIsLinked(model, manual.gridPowerEntityId, manual.gridExportPowerEntityId);
  const sun = states["sun.sun"]?.state;
  const variant: HouseVariantId = houseVariant({
    theme: theme === "dark" ? "dark" : "light",
    sunAboveHorizon: sun !== "below_horizon",
    solarLinked,
    batteryLinked,
  });

  useEffect(() => {
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

  const kinds: HeroLabelKind[] = [];
  if (solarLinked) kinds.push("solar");
  if (importLinked) kinds.push("gridImport");
  if (exportLinked) kinds.push("gridExport");
  if (batteryLinked) kinds.push("battery");
  const placed = labelLayout(variant, orientation, kinds);

  const socId = batteryStatSoc(model) || entities.batterySocEntityId;
  const socRaw = Number(states[socId]?.state);
  const soc = Number.isFinite(socRaw) ? socRaw : null;
  const kwText = (value: number | null) => formatPowerKw(value ?? 0, locale);
  const flowWord =
    batteryPower != null && batteryPower <= -0.05
      ? t("energy.overview.now.charging")
      : t("energy.overview.now.discharging");

  function labelText(kind: HeroLabelKind): string {
    switch (kind) {
      case "solar":
        return fill(t("energy.overview.now.solar"), { kw: kwText(solarKw) });
      case "gridImport":
        return fill(t("energy.overview.now.import"), { kw: kwText(gridKw != null ? Math.max(gridKw, 0) : 0) });
      case "gridExport":
        return fill(t("energy.overview.now.export"), { kw: kwText(gridKw != null ? Math.max(-gridKw, 0) : 0) });
      case "battery":
        if (soc != null && batteryPower != null && Math.abs(batteryPower) >= 0.05) {
          return fill(t("energy.overview.now.batteryFlow"), { soc: formatSoc(soc, locale), flow: flowWord });
        }
        if (soc != null) return fill(t("energy.overview.now.battery"), { soc: formatSoc(soc, locale) });
        return t("energy.overview.now.batteryPlain");
      default: {
        const neverKind: never = kind;
        return neverKind;
      }
    }
  }

  const sentenceKey = nowSentenceKey({
    solarLinked,
    batteryLinked,
    gridLinked: importLinked || exportLinked,
    solarKw,
    batteryKw: batteryPower,
    gridKw,
  });
  const sentenceKw =
    sentenceKey === "energy.overview.now.sentenceSolar"
      ? kwText(solarKw)
      : sentenceKey === "energy.overview.now.sentenceExport"
        ? kwText(gridKw != null ? Math.abs(gridKw) : 0)
        : kwText(gridKw);
  const sentence = fill(t(sentenceKey), { kw: sentenceKw });

  const flowing = powerIsFlowing([solarKw, gridKw, batteryPower, houseKw]);
  const motion = useMotionFlags(frameRef);
  const animate = shouldAnimate({ ...motion, flowing });
  const step = flowStep(strongestFlowKw([solarKw, gridKw, batteryPower, houseKw]));

  return (
    <div className="flex h-full min-h-0 flex-col px-2" data-now-hero={variant}>
      <p className="text-sm font-semibold text-[#111827] dark:text-[#f3f4f6]">
        <span>{t("energy.overview.now.kicker")}</span>
        <span aria-hidden> · </span>
        <span>{t("energy.overview.now.live")}</span>
      </p>
      <p className="mt-1 text-sm text-[#4b5563] dark:text-[#c4c4cc]">{t("energy.overview.now.house")}</p>
      <p
        data-now-house
        className="min-h-[64px] text-[64px] font-semibold leading-none tabular-nums text-[#111827] portrait:min-h-[56px] portrait:text-[56px] dark:text-[#f3f4f6]"
      >
        {houseKw == null ? "" : formatPowerKw(Math.max(houseKw, 0), locale)}
      </p>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div ref={frameRef} className="relative aspect-[960/727] w-full max-w-full">
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
          <NowHeroLayers variant={variant} animate={animate} step={step} />
          {placed.map((label) => (
            <button
              key={label.kind}
              type="button"
              data-now-label={label.kind}
              onClick={() => {
                // The story card opens in a later step.
              }}
              className={cn(
                "absolute flex h-[50px] min-h-11 min-w-11 items-center justify-center rounded-full border border-black/10 bg-[var(--glass-strong)] px-3 text-[15px] font-semibold text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,0.12)] outline-none dark:border-white/15 dark:text-[#f3f4f6] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
                FOCUS_RING_BRAND
              )}
              style={{ left: `${label.xPct}%`, top: `${label.yPct}%`, width: label.widthPx }}
            >
              {labelText(label.kind)}
            </button>
          ))}
        </div>
      </div>
      <p data-now-sentence className="pb-2 text-sm leading-snug text-[#111827] dark:text-[#f3f4f6]">
        {sentence}
      </p>
    </div>
  );
}
