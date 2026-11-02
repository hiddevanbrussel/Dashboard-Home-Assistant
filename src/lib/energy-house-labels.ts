/**
 * House labels for the energy overview (V6c).
 * The render stays 560:424 and is only scaled. Positions are percentages of that box.
 */

import type { OverviewOrientation } from "@/lib/energy-house-anchors";
import { FLOW_GATE_ON_KW } from "@/lib/energy-now";

export const HOUSE_LABELS = ["solar", "house", "grid", "battery"] as const;

export type HouseLabelKind = (typeof HOUSE_LABELS)[number];

export type EnergyStage = {
  orientation: OverviewOrientation;
  columnWidth: number;
  padLeft: number;
  padRight: number;
  houseWidth: number;
  houseHeight: number;
  houseTop: number;
  houseLeft: number;
  sentenceTop: number;
  bandTop: number;
  kickerTop: number;
  bandHeight: number;
};

const SENTENCE_HEIGHT = 22;
const SENTENCE_GAP = 8;
const BAND_GAP = 16;

/** 'Huis' / 'House' is aria-only, approved for this label. */
export function houseAriaName(language: "nl" | "en"): string {
  return language === "nl" ? "Huis" : "House";
}

export function labelPosition(
  kind: HouseLabelKind,
  orientation: OverviewOrientation
): { left: number; top: number } {
  const portrait = orientation === "portrait";
  switch (kind) {
    case "solar":
      return portrait ? { left: 66, top: 6 } : { left: 67, top: 6 };
    case "house":
      return portrait ? { left: 6, top: 22 } : { left: 10, top: 24 };
    case "grid":
      return portrait ? { left: 4, top: 70 } : { left: 8, top: 70 };
    case "battery":
      return portrait ? { left: 78, top: 66 } : { left: 80, top: 62 };
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

/** Anchor on the render, in percent of the house box. */
export function labelAnchor(
  kind: HouseLabelKind,
  orientation: OverviewOrientation
): { x: number; y: number } {
  switch (kind) {
    case "solar":
      return { x: 60, y: 24 };
    case "house":
      return { x: 30, y: 46 };
    case "grid":
      return orientation === "portrait" ? { x: 45, y: 72 } : { x: 37, y: 76 };
    case "battery":
      return { x: 66, y: 57 };
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

export const LABEL_ACCENT: Record<HouseLabelKind, { light: string; dark: string }> = {
  solar: { light: "#B45309", dark: "#FBBF24" },
  house: { light: "#C2410C", dark: "#FB923C" },
  grid: { light: "#4700B5", dark: "#A98AE0" },
  battery: { light: "#0369A1", dark: "#38BDF8" },
};

export function labelAccent(kind: HouseLabelKind, dark: boolean): string {
  const tone = LABEL_ACCENT[kind];
  return dark ? tone.dark : tone.light;
}

/**
 * Stage inside the content column (already past the sidebar).
 * Landscape 1192×800 → house 758×574. Portrait 712×1280 → house 680×515.
 */
export function energyStageFromContent(input: {
  contentWidth: number;
  viewportHeight: number;
  orientation: OverviewOrientation;
}): EnergyStage {
  const portrait = input.orientation === "portrait";
  const padLeft = portrait ? 8 : 24;
  const padRight = 24;
  const columnWidth = Math.max(0, input.contentWidth - padLeft - padRight);
  const bandHeight = portrait ? 212 : 107;
  const houseTop = portrait ? 98 : 64;
  const bottom = portrait ? 16 : 9;
  const availableHeight =
    input.viewportHeight - houseTop - SENTENCE_GAP - SENTENCE_HEIGHT - BAND_GAP - bandHeight - bottom;
  const houseWidth = Math.min(columnWidth, Math.max(0, Math.round(availableHeight * 560 / 424)));
  const houseHeight = Math.round((houseWidth * 424) / 560);
  const houseLeft = padLeft + Math.max(0, Math.round((columnWidth - houseWidth) / 2));
  const sentenceTop = houseTop + houseHeight + SENTENCE_GAP;
  const bandTop = sentenceTop + SENTENCE_HEIGHT + BAND_GAP;
  return {
    orientation: input.orientation,
    columnWidth,
    padLeft,
    padRight,
    houseWidth,
    houseHeight,
    houseTop,
    houseLeft,
    sentenceTop,
    bandTop,
    kickerTop: 72,
    bandHeight,
  };
}

export function fallbackEnergyStage(orientation: OverviewOrientation): EnergyStage {
  if (orientation === "portrait") {
    return energyStageFromContent({ contentWidth: 712, viewportHeight: 1280, orientation });
  }
  return energyStageFromContent({ contentWidth: 1192, viewportHeight: 800, orientation });
}

/** Point on the label rectangle closest to the anchor. That point sits on an edge. */
export function labelEdgePoint(
  label: { left: number; top: number; right: number; bottom: number },
  anchor: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: Math.min(Math.max(anchor.x, label.left), label.right),
    y: Math.min(Math.max(anchor.y, label.top), label.bottom),
  };
}

/**
 * True when the dash travels from the label toward the anchor on the house.
 * Solar always runs from the roof to the house, including while exporting.
 * Grid export and battery charging run the other way: from the house out to the connection.
 */
export function flowRunsTowardHouse(
  kind: HouseLabelKind,
  input: { gridKw: number | null; batteryKw: number | null }
): boolean {
  switch (kind) {
    case "solar":
      return true;
    case "grid":
      return (input.gridKw ?? 0) >= 0;
    case "battery":
      return (input.batteryKw ?? 0) >= 0;
    case "house":
      return true;
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

export function labelFlowEnabled(
  kind: HouseLabelKind,
  input: {
    animate: boolean;
    solarOn: boolean;
    gridOn: boolean;
    batteryOn: boolean;
    houseKw: number | null;
  }
): boolean {
  if (!input.animate) return false;
  switch (kind) {
    case "solar":
      return input.solarOn;
    case "grid":
      return input.gridOn;
    case "battery":
      return input.batteryOn;
    case "house":
      return input.houseKw != null && Math.abs(input.houseKw) >= FLOW_GATE_ON_KW;
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

export function flowPath(
  edge: { x: number; y: number },
  anchor: { x: number; y: number },
  towardHouse: boolean
): string {
  const from = towardHouse ? edge : anchor;
  const to = towardHouse ? anchor : edge;
  const n = (value: number) => value.toFixed(1);
  return `M${n(from.x)} ${n(from.y)} L${n(to.x)} ${n(to.y)}`;
}
