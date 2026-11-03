/**
 * Day band under the house. Cells reuse the story-card facts.
 * A cell without a card is left out. No cells leaves the link card.
 */

import { buildStoryCards } from "@/lib/energy-story/cards";
import { line } from "@/lib/energy-story/types";
import type { StoryCardModel, StoryFacts, StoryLine } from "@/lib/energy-story/types";
import type { HouseLabelKind } from "@/lib/energy-house-labels";

export type BandCellKind = "solar" | "grid" | "peak" | "week";

export type BandCellModel = {
  kind: BandCellKind;
  labelKey: "energy.story.sun" | "energy.story.gridLabel" | "energy.story.peak" | "energy.story.week";
  value: string;
  unit: string;
  time: boolean;
  detail: string;
  card: StoryCardModel;
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

export function bandCells(facts: StoryFacts, language: "nl" | "en"): BandCellModel[] {
  const cards = buildStoryCards(facts);
  const cells: BandCellModel[] = [];
  for (const card of cards) {
    switch (card.kind) {
      case "solar": {
        const shown = splitShown(card.big);
        cells.push({
          kind: "solar",
          labelKey: "energy.story.sun",
          value: shown.value,
          unit: shown.unit,
          time: false,
          detail: say(card.tail, language),
          card,
        });
        break;
      }
      case "grid": {
        const shown = splitShown(say(card.big, language));
        cells.push({
          kind: "grid",
          labelKey: "energy.story.gridLabel",
          value: shown.value,
          unit: shown.unit,
          time: false,
          detail: say(card.lead, language),
          card,
        });
        break;
      }
      case "peak": {
        const shown = splitShown(card.big);
        cells.push({
          kind: "peak",
          labelKey: "energy.story.peak",
          value: shown.value,
          unit: "",
          time: shown.time,
          detail: say(card.lead, language),
          card,
        });
        break;
      }
      case "week": {
        const shown = splitShown(say(card.big, language));
        cells.push({
          kind: "week",
          labelKey: "energy.story.week",
          value: shown.value,
          unit: shown.unit,
          time: false,
          detail: say(card.lead, language),
          card,
        });
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
