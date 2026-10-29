"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  BatteryCharging,
  BatteryMedium,
  ChevronRight,
  House,
  Moon,
  Sun,
  UtilityPole,
} from "lucide-react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { NowHeroLayers } from "@/components/energy/overview/now-hero-layers";
import { useTranslation } from "@/hooks/use-translation";
import { type HeroLabelKind, type OverviewOrientation } from "@/lib/energy-house-anchors";
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
  flowStep,
  formatLivePower,
  formatSoc,
  gridExportIsLinked,
  gridImportIsLinked,
  houseAssetPath,
  houseVariant,
  nowSentenceKey,
  powerIsFlowing,
  roundSentenceKw,
  shouldAnimate,
  solarIsLinked,
  splitLivePower,
  stepHeroGates,
  strongestFlowKw,
  type HeroGates,
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
  const [prefsStatus, setPrefsStatus] = useState<"loading" | "ready" | "error">("loading");
  const frameRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const gatesRef = useRef<HeroGates>({ solar: false, grid: false, battery: false });

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

  const kinds: HeroLabelKind[] = [];
  if (solarLinked && solarKw != null) kinds.push("solar");
  if (gridLinked && gridKw != null && gates.grid) kinds.push("grid");
  if (batteryLinked && batteryPower != null) kinds.push("battery");

  const sentenceKey = nowSentenceKey({
    linked: solarLinked || batteryLinked || gridLinked,
    night,
    solarOn: gates.solar,
    batteryOn: gates.battery,
    gridOn: gates.grid,
    solarKw,
    batteryKw: batteryPower,
    gridKw,
    houseKw,
  });
  const sentenceKw =
    sentenceKey === "energy.overview.now.sentenceBatteryOut"
      ? knownPower(batteryPower == null ? null : roundSentenceKw(batteryPower))
      : sentenceKey === "energy.overview.now.sentenceImport"
        ? knownPower(gridKw != null && gridKw > 0 ? roundSentenceKw(gridKw) : null)
        : null;
  const sentenceSolar = solarKw == null ? "" : knownPower(roundSentenceKw(solarKw)) ?? "";
  const sentenceHouse = houseKw == null ? "" : knownPower(roundSentenceKw(houseKw)) ?? "";
  const sentence = sentenceKey
    ? fill(t(sentenceKey), {
        kw: sentenceKw ?? "",
        solar: sentenceSolar,
        house: sentenceHouse,
      })
    : "";

  const flowing = powerIsFlowing([solarKw, gridKw, batteryPower, houseKw]);
  const motion = useMotionFlags(frameRef);
  const animate = shouldAnimate({ ...motion, flowing });
  const step = flowStep(strongestFlowKw([solarKw, gridKw, batteryPower, houseKw]));
  const holdGlow = motion.reducedMotion || motion.glassOff;
  const panelGlow = Boolean(variant?.startsWith("dag-")) && gates.solar && !holdGlow;
  const batteryGlow = batteryLinked && gates.battery && !holdGlow;
  const houseParts = houseKw == null ? null : splitLivePower(Math.max(houseKw, 0), locale);
  const labelSig = [
    `solar:${solarKw ?? ""}:${gates.solar ? 0 : 1}`,
    `grid:${gridKw ?? ""}:${gates.grid ? 0 : 1}`,
    `battery:${batteryPower ?? ""}:${gates.battery ? 0 : 1}:${soc ?? ""}`,
  ].join("|");
  const dark = theme === "dark";

  return (
    <div className="flex h-full min-h-0 w-full flex-col" data-now-hero={variant ?? "pending"} data-orientation={orientation}>
      <p className="flex h-6 items-center gap-2 text-[15px] font-semibold text-[#374151] dark:text-[#d1d5db]">
        <span>{t("energy.overview.now.kicker")}</span>
        <span className="inline-block h-2 w-2 rounded-full bg-[#047857] shadow-[0_0_0_4px_rgba(4,120,87,0.25)]" aria-hidden />
        <span className="text-sm font-semibold text-[#047857] dark:text-[#6EE7B7]">{t("energy.overview.now.live")}</span>
      </p>
      <p data-now-house className="mt-1 text-[64px] font-bold leading-none tabular-nums tracking-tight text-[#111827] portrait:text-[56px] dark:text-[#f3f4f6]">
        {houseParts ? (
          <>
            {houseParts.value}
            <small className="ml-1 text-[26px] font-semibold tracking-normal text-[#374151] dark:text-[#d1d5db]">{houseParts.unit}</small>
          </>
        ) : (
          "–"
        )}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-[15px] font-semibold text-[#374151] dark:text-[#d1d5db]">
        <House className="h-4 w-4 text-[#4700B5] dark:text-[#c4b5fd]" aria-hidden />
        {t("energy.overview.now.house")}
      </p>
      <div ref={stageRef} data-now-stage className="relative min-h-0 w-full flex-1">
        <div className="absolute inset-x-0 top-16 bottom-16 flex items-center justify-center" style={{ containerType: "size" }}>
        <div
          ref={frameRef}
          data-now-frame
          className="relative mx-auto aspect-[960/727] h-full max-h-full max-w-full"
          style={{ width: "min(100cqw, calc(100cqh * 960 / 727))" }}
        >
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
          {variant ? (
            <NowHeroLayers
              variant={variant}
              animate={animate}
              step={step}
              panelGlow={panelGlow}
              batteryGlow={batteryGlow}
              dark={dark}
              labelSig={labelSig}
            />
          ) : null}
        </div>
        </div>
        {kinds.map((kind) => (
          <HeroPill
            key={kind}
            kind={kind}
            solarKw={solarKw}
            gridKw={gridKw}
            batteryPower={batteryPower}
            soc={soc}
            night={night}
            solarOn={gates.solar}
            batteryOn={gates.battery}
          />
        ))}
      </div>
      <p data-now-sentence className="flex min-h-10 items-end justify-center text-center text-base leading-snug text-[#374151] dark:text-[#d1d5db]">
        {sentence}
      </p>
    </div>
  );
}

function HeroPill({
  kind,
  solarKw,
  gridKw,
  batteryPower,
  soc,
  night,
  solarOn,
  batteryOn,
}: {
  kind: HeroLabelKind;
  solarKw: number | null;
  gridKw: number | null;
  batteryPower: number | null;
  soc: number | null;
  night: boolean;
  solarOn: boolean;
  batteryOn: boolean;
}) {
  const { t, language } = useTranslation();
  const locale = language === "nl" ? "nl" : "en";
  const power = (value: number | null) => (value == null ? null : formatLivePower(Math.abs(value), locale));
  let value = "";
  let sub = "";
  let tone = "text-[#111827] dark:text-[#f3f4f6]";
  let off = false;
  let icon = <Sun className="h-[19px] w-[19px]" aria-hidden />;
  switch (kind) {
    case "solar": {
      const producing = solarOn;
      value = producing ? (power(solarKw) ?? "") : night ? t("energy.overview.now.solarDown") : (power(solarKw ?? 0) ?? "");
      sub = t("energy.overview.now.solarRoof");
      tone = "text-[#92400E] dark:text-[#FCD34D]";
      off = !producing;
      icon = producing ? <Sun className="h-[19px] w-[19px]" aria-hidden /> : <Moon className="h-[19px] w-[19px]" aria-hidden />;
      break;
    }
    case "grid": {
      const exporting = (gridKw ?? 0) < 0;
      value = power(gridKw) ?? "";
      sub = exporting ? t("energy.overview.now.gridBack") : t("energy.overview.now.gridFrom");
      tone = exporting ? "text-[#047857] dark:text-[#6EE7B7]" : "text-[#4700B5] dark:text-[#c4b5fd]";
      icon = <UtilityPole className="h-[19px] w-[19px]" aria-hidden />;
      break;
    }
    case "battery": {
      if (batteryPower == null) return null;
      const charging = batteryOn && batteryPower < 0;
      const supplying = batteryOn && batteryPower > 0;
      value = soc == null ? "–" : formatSoc(soc, locale);
      sub = charging
        ? fill(t("energy.overview.now.batteryCharge"), { kw: power(batteryPower) ?? "" })
        : supplying
          ? fill(t("energy.overview.now.batterySupply"), { kw: power(batteryPower) ?? "" })
          : t("energy.overview.now.batteryIdle");
      tone = "text-[#075985] dark:text-[#7DD3FC]";
      off = !charging && !supplying;
      icon = charging ? (
        <BatteryCharging className="h-[19px] w-[19px]" aria-hidden />
      ) : (
        <BatteryMedium className="h-[19px] w-[19px]" aria-hidden />
      );
      break;
    }
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
  const place = kind === "solar" ? "right-0 top-0" : kind === "grid" ? "bottom-0 left-0" : "bottom-0 right-0";
  return (
    <button
      type="button"
      data-now-label={kind}
      data-now-off={off ? "1" : "0"}
      onClick={() => {
        // The story card opens in a later step.
      }}
      className={cn(
        "absolute z-[5] inline-flex min-h-[50px] min-w-11 items-center gap-[9px] rounded-[16px] border border-[rgba(17,24,39,0.08)] bg-[var(--glass-strong)] py-[5px] pl-[6px] pr-[10px] text-left text-[#111827] shadow-[0_8px_22px_-12px_rgba(15,10,40,0.40)] outline-none dark:border-white/10 dark:bg-[rgba(27,26,33,0.88)] dark:text-[#f3f4f6]",
        place,
        FOCUS_RING_BRAND
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,currentColor_14%,transparent)]",
          tone
        )}
      >
        {icon}
      </span>
      <span className="flex flex-col leading-none">
        <b className={cn("text-[20px] font-bold tabular-nums tracking-tight", off && "text-[#374151] dark:text-[#d1d5db]")}>{value}</b>
        <small className="mt-0.5 text-[13px] font-medium text-[#374151] dark:text-[#d1d5db]">{sub}</small>
      </span>
      <ChevronRight className="h-[15px] w-[15px] shrink-0 text-[#4b5563] dark:text-[#b4b4bd]" aria-hidden />
    </button>
  );
}
