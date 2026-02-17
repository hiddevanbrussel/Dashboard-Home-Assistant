"use client";

import {
  Activity,
  Baby,
  Bath,
  BedDouble,
  Bot,
  Box,
  Briefcase,
  Building2,
  Car,
  Circle,
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
  GaugeCircle,
  Home,
  Lamp,
  Library,
  Lightbulb,
  Popcorn,
  Rocket,
  Shirt,
  Sofa,
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
} from "lucide-react";

export type CardIconComponent = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

/** Eén gedeelde iconenset voor kaarten (vacuum, sensor, etc.) zodat overal dezelfde keuze is. */
export const CARD_ICONS: Record<string, CardIconComponent> = {
  Activity,
  Baby,
  Bath,
  BedDouble,
  Bot,
  Box,
  Briefcase,
  Building2,
  Car,
  Circle,
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
  GaugeCircle,
  Home,
  Lamp,
  Library,
  Lightbulb,
  Popcorn,
  Rocket,
  Shirt,
  Sofa,
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
};

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

export const CARD_ICON_OPTIONS = Object.keys(CARD_ICONS).sort();
