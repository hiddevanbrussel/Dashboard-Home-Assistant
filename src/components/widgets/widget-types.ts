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
  /** Icoon voor light card: lightbulb (default), cone, spotlight, lamp, lamp-ceiling, lamp-desk, lamp-floor, lamp-wall-down, lamp-wall-up */
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

/** Voorwaarde voor afbeeldingskaart: als entity state matcht, toon deze afbeelding. */
export type ImageCondition = {
  operator: "eq" | "neq" | "contains" | "gt" | "gte" | "lt" | "lte";
  value: string;
  /** URL van afbeelding bij match (light mode). */
  image: string;
  /** Optionele URL voor dark mode. Valt terug op image indien niet ingesteld. */
  image_dark?: string;
};

/** Afbeeldingskaart: alleen een afbeelding, geen entity-overlays. */
export type EnergyMonitorCardProps = Omit<WidgetBaseProps, "entity_id"> & {
  entity_id?: string;
  /** Optionele achtergrondafbeelding (URL) voor light mode. Valt terug bij geen match. */
  background_image?: string;
  /** Optionele achtergrondafbeelding (URL) voor dark mode. Valt terug op background_image indien niet ingesteld. */
  background_image_dark?: string;
  /** Voorwaarden: eerste match bepaalt getoonde afbeelding (bijv. weer: sunny → zon, rainy → regen). */
  image_conditions?: ImageCondition[];
  /** Zonder kaart-styling: geen achtergrond en rand om de floating card. */
  minimal?: boolean;
  /** Schaalfactor voor de kaart (0.5–1.5). */
  scale?: number;
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

/** Camera card: toont live snapshot van een camera-entity. */
export type CameraCardProps = WidgetBaseProps & {
  /** Vernieuwinterval in seconden (0 = handmatig). Default 10. */
  refresh?: number;
  /** Toon titelbalk (default true). */
  show_title?: boolean;
};

export type MediaCardProps = WidgetBaseProps & {
  state?: "on" | "off" | "playing" | "paused" | "idle";
  media_title?: string;
  media_artist?: string;
  entity_picture?: string;
  media_duration?: number;
  media_position?: number;
  /** Breedte kaart in px (standaard 320). */
  width?: number;
  /** Hoogte kaart in px (standaard auto). */
  height?: number;
};

/** Eén voorwaarde: als sensorwaarde aan operator + value voldoet, toon kleur. Eerste match wint. */
export type SensorCondition = {
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
  value: string;
  color: string;
};

export type SensorCardProps = WidgetBaseProps & {
  /** Optioneel icoon (Lucide-naam); default Gauge. Leeg of "none" = geen icoon. */
  icon?: string;
  /** Toon icoon; default true. false = icoon verbergen. */
  show_icon?: boolean;
  /** Conditionele kleuren: eerste voorwaarde die klopt bepaalt de kaartkleur. */
  conditions?: SensorCondition[];
};

export type TitleCardProps = {
  title: string;
};

/** Stat pill card: één waarde in Energy Monitor pill-stijl (icoon + waarde boven, label onder). */
export type StatPillCardProps = WidgetBaseProps & {
  /** Label onder de waarde (bijv. "Opbrengst", "Verbruik"). */
  label?: string;
  /** Icoon (Lucide-naam uit card-icons); default Sun. */
  icon?: string;
  /** Kleurthema: amber, purple, emerald, red. */
  color?: "amber" | "purple" | "emerald" | "red";
  /** Conditionele kleuren: eerste voorwaarde die klopt bepaalt de pillkleur. */
  conditions?: SensorCondition[];
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

/** Nuts/utility card: gas, water, etc. met icoon, naam, huidig verbruik, dagtotaal en verticale bar. */
export type NutsCardProps = WidgetBaseProps & {
  /** Optioneel icoon (Lucide-naam); default Fuel. */
  icon?: string;
  /** Achtergrondkleur van het icoon (hex, bijv. #3B82F6). */
  icon_background_color?: string;
  /** Entity voor dagverbruik (totaal over de dag). */
  entity_id: string;
  /** Optioneel: entity voor huidig/actueel verbruik. Zonder: toont 0 voor huidig. */
  current_entity_id?: string;
  /** Maxwaarde voor schaal van de verticale bar (optioneel). */
  max_value?: number;
  /** Breedte kaart in px (standaard 250). */
  width?: number;
  /** Hoogte kaart in px (standaard 130). */
  height?: number;
};

/** Power usage card: dagelijks verbruik, bar chart, per-apparaat breakdown. */
export type PowerUsageCardProps = WidgetBaseProps & {
  /** Hoofdentity voor totaal verbruik (kWh, cumulative). */
  entity_id: string;
  /** Entity IDs voor per-apparaat verbruik. */
  device_entity_ids?: string[];
  /** Kosten per kWh voor expense weergave. */
  cost_per_kwh?: number;
};

/** Room card: kamer met icoon, naam, entity-waarde, lichtstatus en optionele mediaplayer. */
export type RoomCardProps = WidgetBaseProps & {
  /** Optioneel icoon (Lucide-naam uit card-icons). */
  icon?: string;
  /** Entity voor lichtstatus (bijv. light.badkamer of group.badkamer_lights). */
  light_entity_id?: string;
  /** Lampen om in de modal afzonderlijk te kunnen schakelen (los van de kaart). @deprecated Gebruik modal_cards */
  modal_light_entity_ids?: string[];
  /** Kaarten in de modal: light, climate, media_player. */
  modal_cards?: { id: string; type: "light" | "climate" | "media_player"; entity_id: string }[];
  /** Entity voor mediaplayer; toont music-icoon wanneer er iets wordt afgespeeld. */
  media_player_entity_id?: string;
  /** Entity voor klimaat; toont temperatuur/thermometer-icoon. */
  climate_entity_id?: string;
  /** Optionele achtergrondafbeelding voor de kaart (URL). */
  background_image?: string;
  /** Achtergrondkleur van het icoon-badge (hex, bijv. #3B82F6). */
  icon_background_color?: string;
  /** Breedte van de kaart in pixels (bijv. 240–500). */
  width?: number;
  /** Hoogte van de kaart in pixels (bijv. 80–300). */
  height?: number;
};
