"use client";

import {
  Activity,
  AirVent,
  Baby,
  Bath,
  BedDouble,
  Bot,
  Box,
  Briefcase,
  Building2,
  Car,
  Circle,
  CircleArrowDown,
  CircleArrowUp,
  CircleDot,
  CircleGauge,
  DoorOpen,
  Drill,
  Droplets,
  Eye,
  EyeOff,
  Footprints,
  Fuel,
  Gamepad2,
  Gauge,
  Home,
  Lamp,
  Leaf,
  Library,
  Lightbulb,
  PlugZap,
  Popcorn,
  RobotVacuum,
  Rocket,
  Shirt,
  Sofa,
  SolarPanel,
  Sparkles,
  Star,
  Sun,
  Tent,
  Thermometer,
  TreePine,
  Trees,
  Trash2,
  Type,
  UtensilsCrossed,
  Wind,
  Zap,
  ZapOff,
} from "lucide-react";

export type CardIconComponent = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

/** Eén gedeelde iconenset voor kaarten (vacuum, sensor, etc.) zodat overal dezelfde keuze is. */
export const CARD_ICONS: Record<string, CardIconComponent> = {
  Activity,
  AirVent,
  Baby,
  Bath,
  BedDouble,
  Bot,
  Box,
  Briefcase,
  Building2,
  Car,
  Circle,
  CircleArrowDown,
  CircleArrowUp,
  CircleDot,
  DoorOpen,
  Drill,
  Droplets,
  Eye,
  EyeOff,
  Footprints,
  Fuel,
  Gamepad2,
  Gauge,
  GaugeCircle: CircleGauge,
  Home,
  Lamp,
  Leaf,
  Library,
  Lightbulb,
  PlugZap,
  Popcorn,
  RobotVacuum,
  Rocket,
  Shirt,
  Sofa,
  SolarPanel,
  Sparkles,
  Star,
  Sun,
  Tent,
  Thermometer,
  TreePine,
  Trees,
  Trash2,
  Type,
  UtensilsCrossed,
  Wind,
  Zap,
  ZapOff,
};

/** Stat pill card: curated Lucide set (kebab-case keys for WidgetConfig.icon). */
export const STAT_PILL_ICON_OPTIONS = [
  "plug-zap",
  "zap",
  "sun",
  "solar-panel",
  "circle-arrow-up",
  "circle-arrow-down",
  "lightbulb",
  "zap-off",
  "air-vent",
] as const;

export type StatPillIconKey = (typeof STAT_PILL_ICON_OPTIONS)[number];

const STAT_PILL_ICON_SET = new Set<string>(STAT_PILL_ICON_OPTIONS);

/** Normalize stored icon (PascalCase or kebab) to a STAT_PILL_ICON_OPTIONS key. */
export function normalizeStatPillIconKey(icon?: string | null): StatPillIconKey {
  if (!icon) return "sun";
  if (STAT_PILL_ICON_SET.has(icon)) return icon as StatPillIconKey;
  const kebab = icon
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
  if (STAT_PILL_ICON_SET.has(kebab)) return kebab as StatPillIconKey;
  return "sun";
}

/** Kebab-case aliases voor kamers (towel-rack, tent-tree, eye-closed, shelving-unit, tool-case) */
(CARD_ICONS as Record<string, CardIconComponent>).trees = Trees;
(CARD_ICONS as Record<string, CardIconComponent>).popcorn = Popcorn;
(CARD_ICONS as Record<string, CardIconComponent>)["utensils-crossed"] = UtensilsCrossed;
(CARD_ICONS as Record<string, CardIconComponent>)["towel-rack"] = Bath;
(CARD_ICONS as Record<string, CardIconComponent>).baby = Baby;
(CARD_ICONS as Record<string, CardIconComponent>).rocket = Rocket;
(CARD_ICONS as Record<string, CardIconComponent>).gamepad = Gamepad2;
(CARD_ICONS as Record<string, CardIconComponent>)["tent-tree"] = Tent;
(CARD_ICONS as Record<string, CardIconComponent>).footprints = Footprints;
(CARD_ICONS as Record<string, CardIconComponent>)["eye-closed"] = EyeOff;
(CARD_ICONS as Record<string, CardIconComponent>).drill = Drill;
(CARD_ICONS as Record<string, CardIconComponent>)["shelving-unit"] = Library;
(CARD_ICONS as Record<string, CardIconComponent>)["tool-case"] = Briefcase;
(CARD_ICONS as Record<string, CardIconComponent>)["robot-vacuum"] = RobotVacuum;

/** Kebab-case aliases for stat pill (and lightbulb shared with light card). */
(CARD_ICONS as Record<string, CardIconComponent>)["plug-zap"] = PlugZap;
(CARD_ICONS as Record<string, CardIconComponent>).zap = Zap;
(CARD_ICONS as Record<string, CardIconComponent>).sun = Sun;
(CARD_ICONS as Record<string, CardIconComponent>)["solar-panel"] = SolarPanel;
(CARD_ICONS as Record<string, CardIconComponent>)["circle-arrow-up"] = CircleArrowUp;
(CARD_ICONS as Record<string, CardIconComponent>)["circle-arrow-down"] = CircleArrowDown;
(CARD_ICONS as Record<string, CardIconComponent>).lightbulb = Lightbulb;
(CARD_ICONS as Record<string, CardIconComponent>)["zap-off"] = ZapOff;
(CARD_ICONS as Record<string, CardIconComponent>)["air-vent"] = AirVent;

export const CARD_ICON_OPTIONS = Object.keys(CARD_ICONS).sort();
