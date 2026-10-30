/**
 * Which house render to show, whether the mint flow may run, and the one-line sentence.
 * The story engine in a later step replaces the sentence. This one only picks a key.
 */

import type { EnergyModel } from "@/lib/energy-prefs";
import type { EnergyTab } from "@/lib/energy-tab";

export const HOUSE_VARIANTS = [
  "dag-licht",
  "dag-donker",
  "nacht-licht",
  "nacht-donker",
  "zonder-licht",
  "zonder-donker",
] as const;

export type HouseVariantId = (typeof HOUSE_VARIANTS)[number];

export type HouseTheme = "light" | "dark";

const FLOW_EPSILON_KW = 0.05;

/** Panel glow and the solar “on” gate. */
export const SOLAR_GATE_ON_KW = 0.06;
export const SOLAR_GATE_OFF_KW = 0.04;
/** Grid pill around zero. Same band as the sun, so it does not blink back. */
export const GRID_GATE_ON_KW = 0.06;
export const GRID_GATE_OFF_KW = 0.04;
/** Battery leaves idle at 10 W and returns below 5 W. */
export const BATTERY_GATE_ON_KW = 0.01;
export const BATTERY_GATE_OFF_KW = 0.005;

export type HeroGates = { solar: boolean; grid: boolean; battery: boolean };

/** Keep the previous on/off while the absolute power sits between the two thresholds. A missing reading turns the gate off. */
export function holdMagnitude(active: boolean, kw: number | null, onKw: number, offKw: number): boolean {
  if (kw == null || !Number.isFinite(kw)) return false;
  const abs = Math.abs(kw);
  return active ? abs >= offKw : abs >= onKw;
}

export function stepHeroGates(
  previous: HeroGates,
  input: { solarKw: number | null; gridKw: number | null; batteryKw: number | null }
): HeroGates {
  return {
    solar: holdMagnitude(previous.solar, input.solarKw, SOLAR_GATE_ON_KW, SOLAR_GATE_OFF_KW),
    grid: holdMagnitude(previous.grid, input.gridKw, GRID_GATE_ON_KW, GRID_GATE_OFF_KW),
    battery: holdMagnitude(previous.battery, input.batteryKw, BATTERY_GATE_ON_KW, BATTERY_GATE_OFF_KW),
  };
}

export function houseVariant(input: {
  theme: HouseTheme;
  sunAboveHorizon: boolean;
  solarLinked: boolean;
  batteryLinked: boolean;
}): HouseVariantId {
  const tone = input.theme === "dark" ? "donker" : "licht";
  if (!input.solarLinked && !input.batteryLinked) {
    return tone === "donker" ? "zonder-donker" : "zonder-licht";
  }
  if (input.sunAboveHorizon) return tone === "donker" ? "dag-donker" : "dag-licht";
  return tone === "donker" ? "nacht-donker" : "nacht-licht";
}

/** The other time of day for the same theme. The "zonder" renders have no pair. */
export function dayNightPair(variant: HouseVariantId): HouseVariantId | null {
  switch (variant) {
    case "dag-licht":
      return "nacht-licht";
    case "dag-donker":
      return "nacht-donker";
    case "nacht-licht":
      return "dag-licht";
    case "nacht-donker":
      return "dag-donker";
    case "zonder-licht":
    case "zonder-donker":
      return null;
    default: {
      const neverVariant: never = variant;
      return neverVariant;
    }
  }
}

export function houseAssetPath(variant: HouseVariantId, ext: "avif" | "webp"): string {
  return `/energy/house/huis-${variant}.${ext}`;
}

export function solarIsLinked(model: EnergyModel | null, manualPowerId: string, manualYieldId: string): boolean {
  if (manualPowerId.trim() || manualYieldId.trim()) return true;
  if (!model) return false;
  return model.energySources.some(
    (source) => source.type === "solar" && Boolean(source.statEnergyFrom || source.statRate)
  );
}

export function batteryIsLinked(model: EnergyModel | null, manualSocId: string, manualPowerId: string): boolean {
  if (manualSocId.trim() || manualPowerId.trim()) return true;
  if (!model) return false;
  return model.energySources.some((source) => {
    if (source.type !== "battery") return false;
    return Boolean(
      source.statSoc || source.statRate || source.statEnergyFrom || source.statEnergyTo || source.powerConfig
    );
  });
}

export function gridImportIsLinked(
  model: EnergyModel | null,
  signedId: string,
  importId: string
): boolean {
  if (signedId.trim() || importId.trim()) return true;
  if (!model) return false;
  return model.energySources.some(
    (source) => source.type === "grid" && Boolean(source.statEnergyFrom || source.statRate || source.powerConfig)
  );
}

export function gridExportIsLinked(
  model: EnergyModel | null,
  signedId: string,
  exportId: string
): boolean {
  if (signedId.trim() || exportId.trim()) return true;
  if (!model) return false;
  return model.energySources.some(
    (source) => source.type === "grid" && Boolean(source.statEnergyTo || source.statRate || source.powerConfig)
  );
}

export type AnimateInput = {
  reducedMotion: boolean;
  glassOff: boolean;
  hidden: boolean;
  tab: EnergyTab;
  visible: boolean;
  flowing: boolean;
  screensaver: boolean;
};

/** Mint dots and the panel glow run only while power flows and nothing has asked them to hold still. */
export function shouldAnimate(input: AnimateInput): boolean {
  if (input.reducedMotion || input.glassOff) return false;
  if (input.hidden || input.screensaver) return false;
  if (input.tab !== "overview" || !input.visible) return false;
  return input.flowing;
}

export function powerIsFlowing(kilowatts: readonly (number | null)[]): boolean {
  return kilowatts.some((value) => value != null && Math.abs(value) >= FLOW_EPSILON_KW);
}

/** Same band as the solar glow, so noise around one threshold does not start and stop the mint line. */
export const FLOW_GATE_ON_KW = 0.06;
export const FLOW_GATE_OFF_KW = 0.04;
/** The sun icon comes on at 10 W during the day. The glow gate stays at 60/40 W. */
export const SOLAR_ICON_ON_KW = 0.01;

export function peakAbsKw(kilowatts: readonly (number | null)[]): number | null {
  let peak: number | null = null;
  for (const value of kilowatts) {
    if (value == null || !Number.isFinite(value)) continue;
    const abs = Math.abs(value);
    if (peak == null || abs > peak) peak = abs;
  }
  return peak;
}

/** Hysteresis only. There is no extra wait before the animation follows a real change. */
export function stepPowerFlowing(previous: boolean, kilowatts: readonly (number | null)[]): boolean {
  return holdMagnitude(previous, peakAbsKw(kilowatts), FLOW_GATE_ON_KW, FLOW_GATE_OFF_KW);
}

export function solarPillOn(input: { night: boolean; solarKw: number | null; gate: boolean }): boolean {
  if (!input.night && input.solarKw != null && Number.isFinite(input.solarKw) && input.solarKw >= SOLAR_ICON_ON_KW) {
    return true;
  }
  if (input.night) return input.gate;
  return false;
}

export function consumptionIsLinked(consumptionEntityId: string): boolean {
  return consumptionEntityId.trim().length > 0;
}

export function overviewIsLinked(input: {
  solar: boolean;
  battery: boolean;
  grid: boolean;
  consumption: boolean;
}): boolean {
  return input.solar || input.battery || input.grid || input.consumption;
}

/** Three duration steps so a 5s poll inside the same band does not restart the animation. */
export function flowStep(kilowatts: number): 1 | 2 | 3 {
  const value = Math.abs(kilowatts);
  if (value >= 3) return 3;
  if (value >= 0.8) return 2;
  return 1;
}

/**
 * Roof-to-house mint flow. Durations are twice the previous 4200 / 2400 / 1400 ms.
 * prefers-reduced-motion and glass off still skip the animation in shouldAnimate.
 */
export function flowDurationMs(step: 1 | 2 | 3): number {
  switch (step) {
    case 1:
      return 8400;
    case 2:
      return 4800;
    case 3:
      return 2800;
    default: {
      const neverStep: never = step;
      return neverStep;
    }
  }
}

/** Dot opacity along the flow. Was 1 in the middle and 0.35 at the ends. */
export const FLOW_DOT_OPACITY = 0.55;
export const FLOW_DOT_EDGE_OPACITY = 0.19;
/** Stroke opacity of the mint line. Was 0.95. */
export const FLOW_LINE_OPACITY = 0.52;

export function strongestFlowKw(kilowatts: readonly (number | null)[]): number {
  let best = 0;
  for (const value of kilowatts) {
    if (value == null) continue;
    const abs = Math.abs(value);
    if (abs > best) best = abs;
  }
  return best;
}

export function nowSentenceKey(input: {
  linked: boolean;
  night: boolean;
  solarOn: boolean;
  batteryOn: boolean;
  gridOn: boolean;
  solarKw: number | null;
  batteryKw: number | null;
  gridKw: number | null;
  houseKw: number | null;
  /** True only when the house sensor is the sole link. */
  consumptionOnly?: boolean;
}): string | null {
  if (!input.linked) return "energy.overview.now.sentenceSetup";
  const solar = input.solarOn && input.solarKw != null ? input.solarKw : 0;
  const house = input.houseKw;
  const discharge = input.batteryOn && input.batteryKw != null && input.batteryKw > 0 ? input.batteryKw : 0;
  const imported = input.gridOn && input.gridKw != null && input.gridKw > 0 ? input.gridKw : 0;
  const exported = input.gridOn && input.gridKw != null && input.gridKw < 0 ? -input.gridKw : 0;
  if (input.night && solar < FLOW_EPSILON_KW && discharge > 0) return "energy.overview.now.sentenceBatteryOut";
  if (house != null && solar >= house && solar > 0 && exported > 0) return "energy.overview.now.sentenceCoverExport";
  if (house != null && solar >= house && solar > 0) return "energy.overview.now.sentenceCover";
  if (solar > 0) return house != null ? "energy.overview.now.sentenceSolar" : null;
  if (imported > 0) return "energy.overview.now.sentenceImport";
  if (input.consumptionOnly && house != null && house > 0) return "energy.overview.now.sentenceHouse";
  return null;
}

/** Watts below 1 kW, two decimals from 1 kW up to 10 kW, one decimal above that. */
export function formatLivePower(kw: number, language: "nl" | "en"): string {
  const locale = language === "nl" ? "nl-NL" : "en-GB";
  const abs = Math.abs(kw);
  if (abs < 1) {
    const watts = Math.round(abs * 100) * 10;
    return `${watts} W`;
  }
  if (abs < 10) {
    const text = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(abs * 100) / 100);
    return `${text} kW`;
  }
  const text = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.round(abs * 10) / 10);
  return `${text} kW`;
}

export function splitLivePower(kw: number, language: "nl" | "en"): { value: string; unit: string } {
  const text = formatLivePower(kw, language);
  const splitAt = text.lastIndexOf(" ");
  if (splitAt < 0) return { value: text, unit: "" };
  return { value: text.slice(0, splitAt), unit: text.slice(splitAt + 1) };
}

export function formatSoc(value: number, language: "nl" | "en"): string {
  const formatted = new Intl.NumberFormat(language === "nl" ? "nl-NL" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return `${formatted}%`;
}
