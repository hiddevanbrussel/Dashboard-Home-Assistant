/**
 * Day band under the house. Cells reuse the story-card facts.
 * A cell without a card is left out. No cells leaves the link card.
 */

import { toKwh } from "@/lib/energy-dashboard";
import { buildStoryCards } from "@/lib/energy-story/cards";
import { formatKwh } from "@/lib/energy-story/format";
import { solarSentence } from "@/lib/energy-story/sentences";
import { getTranslations } from "@/lib/i18n";
import { line } from "@/lib/energy-story/types";
import type { StoryCardModel, StoryFacts, StoryLine } from "@/lib/energy-story/types";
import type { HouseLabelKind } from "@/lib/energy-house-labels";

/** Percent face of the solar swap, then the kWh face. One shared clock for every future swap. */
export const BAND_SWAP_PRIMARY_MS = 8000;
export const BAND_SWAP_ALT_MS = 5000;
/** Below this, formatKwh would show 0,0 / 0.0. The cell stays as it is today. */
export const SOLAR_TODAY_MIN_KWH = 0.05;

export type BandSwap = "static" | "swap" | "todayOnly";
export type SwapPhase = "primary" | "alt";

export type BandCellAlt = {
  value: string;
  unit: string;
  detail: string;
};

export type BandCellKind = "solar" | "grid" | "peak" | "week";

export type BandCellModel = {
  kind: BandCellKind;
  labelKey: "energy.story.sun" | "energy.story.gridLabel" | "energy.story.peak" | "energy.story.week";
  value: string;
  unit: string;
  time: boolean;
  detail: string;
  card: StoryCardModel;
  /** Second face. Present only while the cell actually swaps. */
  alt?: BandCellAlt;
  swap: BandSwap;
  /** Both faces, in a stable order. Empty when the cell has nothing extra to announce. */
  ariaLabel: string;
};

export type BandCellsOptions = {
  solarTodayKwh?: number | null;
  reducedMotion?: boolean;
};

export type SolarBandModeInput = {
  night: boolean;
  yesterday: boolean;
  solarTodayKwh: number | null;
  reducedMotion: boolean;
};

export function splitShown(text: string): { value: string; unit: string; time: boolean } {
  if (text.includes(":") && text.includes("–")) return { value: text, unit: "", time: true };
  if (text.endsWith("%")) return { value: text.slice(0, -1), unit: "%", time: false };
  const space = text.lastIndexOf(" ");
  if (space <= 0) return { value: text, unit: "", time: false };
  return { value: text.slice(0, space), unit: text.slice(space + 1), time: false };
}

function say(value: StoryLine | string, language: "nl" | "en"): string {
  return typeof value === "string" ? value : line(value, language);
}

function fill(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}

function cycleMs(): number {
  return BAND_SWAP_PRIMARY_MS + BAND_SWAP_ALT_MS;
}

/** Shared phase. `nowMs` is milliseconds on the shared clock, not a cell-local timer. */
export function swapPhase(nowMs: number): SwapPhase {
  const cycle = cycleMs();
  const mod = ((nowMs % cycle) + cycle) % cycle;
  return mod < BAND_SWAP_PRIMARY_MS ? "primary" : "alt";
}

export function msUntilSwapBoundary(nowMs: number): number {
  const cycle = cycleMs();
  const mod = ((nowMs % cycle) + cycle) % cycle;
  if (mod < BAND_SWAP_PRIMARY_MS) return BAND_SWAP_PRIMARY_MS - mod;
  return cycle - mod;
}

/** Wh and kWh go through `toKwh`. MWh/GWh are scaled onto kWh here; `toKwh` leaves them untouched. */
export function solarYieldToKwh(value: number, unit?: string | null): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  const key = (unit ?? "").trim().toLowerCase().replace(/\s+/g, "");
  const kwh = key === "mwh" ? value * 1000 : key === "gwh" ? value * 1_000_000 : toKwh(value, unit);
  if (!Number.isFinite(kwh) || kwh < 0) return null;
  return kwh;
}

/**
 * Live yield sensor first. `unknown` / `unavailable` / a non-numeric state counts as no live
 * reading and falls through to the energy statistic. Neither one means no swap.
 */
export function resolveSolarTodayKwh(input: {
  state?: string | null;
  unit?: string | null;
  factsKwh?: number | null;
}): number | null {
  const state = input.state?.trim() ?? "";
  if (state !== "" && state !== "unknown" && state !== "unavailable") {
    const parsed = Number(state);
    if (Number.isFinite(parsed)) {
      const live = solarYieldToKwh(parsed, input.unit);
      if (live != null) return live;
    }
  }
  const factsKwh = input.factsKwh;
  if (factsKwh != null && Number.isFinite(factsKwh) && factsKwh >= 0) return factsKwh;
  return null;
}

/** Day swap, evening kWh only, or the cell as it is today. */
export function solarBandMode(input: SolarBandModeInput): BandSwap {
  if (input.yesterday) return "static";
  if (
    input.solarTodayKwh == null ||
    !Number.isFinite(input.solarTodayKwh) ||
    input.solarTodayKwh < SOLAR_TODAY_MIN_KWH
  ) {
    return "static";
  }
  if (input.night) return "todayOnly";
  if (input.reducedMotion) return "static";
  return "swap";
}

function solarAlt(kwh: number, language: "nl" | "en"): BandCellAlt {
  const shown = splitShown(formatKwh(kwh, language));
  return {
    value: shown.value,
    unit: shown.unit,
    detail: getTranslations(language)["energy.band.solarToday"] ?? "",
  };
}

function solarAria(language: "nl" | "en", usage: string, today: string, evening: boolean): string {
  const dict = getTranslations(language);
  const key = evening ? "energy.band.solarAriaEvening" : "energy.band.solarAria";
  return fill(dict[key] ?? "", { sun: dict["energy.story.sun"] ?? "", usage, today });
}

function staticCell(
  partial: Omit<BandCellModel, "swap" | "ariaLabel" | "alt">
): BandCellModel {
  return { ...partial, swap: "static", ariaLabel: "" };
}

export function storySheetLabelKey(card: StoryCardModel): string {
  switch (card.kind) {
    case "solar":
      return card.label === "today" ? "energy.story.today" : "energy.story.sun";
    case "grid":
      return "energy.story.gridLabel";
    case "peak":
      return "energy.story.peak";
    case "battery":
      return "energy.story.battery";
    case "devices":
    case "hint":
      return "energy.story.devices";
    case "link":
      return "energy.story.gridLabel";
    case "week":
      return "energy.story.week";
    case "aircon":
      return "energy.story.aircon";
    default: {
      const neverCard: never = card;
      return neverCard;
    }
  }
}

export function cardForHouseLabel(facts: StoryFacts, kind: HouseLabelKind): StoryCardModel | null {
  const cards = buildStoryCards(facts);
  switch (kind) {
    case "solar":
      return cards.find((card) => card.kind === "solar") ?? null;
    case "house":
      return cards.find((card) => card.kind === "devices") ?? cards.find((card) => card.kind === "hint") ?? null;
    case "grid": {
      const grid = cards.find((card) => card.kind === "grid");
      if (grid) return grid;
      if (facts.manualWithoutImport) return cards.find((card) => card.kind === "link") ?? null;
      return null;
    }
    case "battery":
      return cards.find((card) => card.kind === "battery") ?? null;
    case "aircon":
      return facts.airconKwh == null || !Number.isFinite(facts.airconKwh)
        ? null
        : { kind: "aircon", todayKwh: facts.airconKwh };
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

export function bandCells(
  facts: StoryFacts,
  language: "nl" | "en",
  options: BandCellsOptions = {}
): BandCellModel[] {
  const cards = buildStoryCards(facts);
  const cells: BandCellModel[] = [];
  for (const card of cards) {
    switch (card.kind) {
      case "solar": {
        const shown = splitShown(card.big);
        const detail = say(card.tail, language);
        const solarTodayKwh = options.solarTodayKwh ?? null;
        const yesterday = solarSentence(facts)?.yesterday === true;
        const mode = solarBandMode({
          night: facts.night,
          yesterday,
          solarTodayKwh,
          reducedMotion: options.reducedMotion === true,
        });
        const alt =
          mode === "static" && yesterday
            ? undefined
            : solarTodayKwh != null && Number.isFinite(solarTodayKwh) && solarTodayKwh >= SOLAR_TODAY_MIN_KWH
              ? solarAlt(solarTodayKwh, language)
              : undefined;
        const todayText = alt ? `${alt.value} ${alt.unit} ${alt.detail}` : "";
        const ariaLabel = alt ? solarAria(language, `${shown.value}${shown.unit} ${detail}`, todayText, mode === "todayOnly") : "";
        if (mode === "todayOnly" && alt) {
          cells.push({
            kind: "solar",
            labelKey: "energy.story.sun",
            value: alt.value,
            unit: alt.unit,
            time: false,
            detail: alt.detail,
            card,
            swap: "todayOnly",
            ariaLabel,
          });
          break;
        }
        cells.push({
          kind: "solar",
          labelKey: "energy.story.sun",
          value: shown.value,
          unit: shown.unit,
          time: false,
          detail,
          card,
          alt: mode === "swap" ? alt : undefined,
          swap: mode === "swap" ? "swap" : "static",
          ariaLabel: mode === "swap" || (options.reducedMotion === true && alt != null) ? ariaLabel : "",
        });
        break;
      }
      case "grid": {
        const shown = splitShown(say(card.big, language));
        cells.push(
          staticCell({
            kind: "grid",
            labelKey: "energy.story.gridLabel",
            value: shown.value,
            unit: shown.unit,
            time: false,
            detail: say(card.lead, language),
            card,
          })
        );
        break;
      }
      case "peak": {
        const shown = splitShown(card.big);
        cells.push(
          staticCell({
            kind: "peak",
            labelKey: "energy.story.peak",
            value: shown.value,
            unit: "",
            time: shown.time,
            detail: say(card.lead, language),
            card,
          })
        );
        break;
      }
      case "week": {
        const shown = splitShown(say(card.big, language));
        cells.push(
          staticCell({
            kind: "week",
            labelKey: "energy.story.week",
            value: shown.value,
            unit: shown.unit,
            time: false,
            detail: say(card.lead, language),
            card,
          })
        );
        break;
      }
      case "battery":
      case "devices":
      case "hint":
      case "link":
      case "aircon":
        break;
      default: {
        const neverCard: never = card;
        return neverCard;
      }
    }
  }
  return cells;
}
