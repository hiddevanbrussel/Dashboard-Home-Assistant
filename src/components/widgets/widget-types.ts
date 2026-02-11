import type { WidgetConfig } from "@/stores/onboarding-store";

export type WidgetBaseProps = {
  title: string;
  entity_id: string;
  size?: "sm" | "md" | "lg";
  icon?: string;
  unit?: string;
  refresh?: number;
};

export type EnergyUsageProps = WidgetBaseProps & {
  value?: number;
  label?: string;
  thresholds?: string;
};

export type LightControlProps = WidgetBaseProps & {
  value?: number;
  /** "on" | "off" for display and toggle */
  state?: "on" | "off";
  /** Icoon voor light card: lightbulb (default), spotlight, lamp, lamp-ceiling, lamp-desk, lamp-floor, lamp-wall-down, lamp-wall-up */
  icon?: string;
};

export type WifiProps = WidgetBaseProps & {
  value?: "on" | "off";
};

export type SolarChargeProps = WidgetBaseProps & {
  value?: number;
  data?: { date: string; value: number }[];
};

export type ClimateProps = WidgetBaseProps & {
  value?: number;
  unit?: string;
  state?: string;
  /** Optioneel: sensor entity voor luchtvochtigheid (bijv. sensor.x_humidity). */
  humidity_entity_id?: string;
};

export type LightingBrightnessProps = WidgetBaseProps & {
  value?: number;
};

export type SolarCardProps = WidgetBaseProps & {
  value?: number;
  unit?: string;
  /** Optioneel: toont verbruik naast opbrengst (gecombineerde kaart). */
  consumption_entity_id?: string;
};

export type WeatherCardProps = WidgetBaseProps & {
  temperature?: number;
  humidity?: number;
  condition?: string;
  /** Toon weersicoon (default true). */
  show_icon?: boolean;
};

export type VacuumCardProps = WidgetBaseProps & {
  /** Script entity_ids om als knoppen te tonen (script.turn_on). */
  script_ids?: string[];
  /** Aangepaste weergavenaam per script (entity_id -> naam). */
  script_names?: Record<string, string>;
  /** Optionele sensor entity_id om onder de status te tonen (bijv. cleaned area). */
  cleaned_area_entity_id?: string;
};

export type MediaCardProps = WidgetBaseProps & {
  state?: "on" | "off" | "playing" | "paused" | "idle";
  media_title?: string;
  media_artist?: string;
  entity_picture?: string;
  media_duration?: number;
  media_position?: number;
};

/** Eén voorwaarde: als sensorwaarde aan operator + value voldoet, toon kleur. Eerste match wint. */
export type SensorCondition = {
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
  value: string;
  color: string;
};

export type SensorCardProps = WidgetBaseProps & {
  /** Optioneel icoon (Lucide-naam); default Gauge. */
  icon?: string;
  /** Conditionele kleuren: eerste voorwaarde die klopt bepaalt de kaartkleur. */
  conditions?: SensorCondition[];
};

export type TitleCardProps = {
  title: string;
};

/** Pill/badge card: compact weergave van entity met icoon, waarde en optioneel aan/uit. */
export type PillCardProps = WidgetBaseProps & {
  /** Optioneel icoon (Lucide-naam uit card-icons). */
  icon?: string;
  /** Conditionele kleuren op basis van state (eerste match wint). */
  conditions?: SensorCondition[];
  /** Toon entiteitstatus (aan/uit of waarde); default true. */
  show_state?: boolean;
};

/** Card group: container met uitlijning en geneste kaarten (bijv. pills). */
export type CardGroupProps = {
  id: string;
  type: "card_group";
  title?: string;
  alignment?: "start" | "center" | "end" | "between";
  children?: WidgetConfig[];
};
