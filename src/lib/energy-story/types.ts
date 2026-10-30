import type { StoryLang } from "./format";

export type StoryLine = Record<StoryLang, string>;

export type StoryDeviceFact = {
  name: StoryLine;
  kwh: number | null;
  /** Energy this device used during the peak hour. */
  peakKwh: number | null;
};

/**
 * One solved moment for the story cards.
 * Energy is in kWh, power in kW, `hour` is the local decimal hour in the Home Assistant zone.
 */
export type StoryFacts = {
  hour: number;
  sunsetHour: number;
  night: boolean;
  hasSolar: boolean;
  hasBattery: boolean;
  hasGrid: boolean;
  /** At least one energy sensor is linked, including a consumption-only sensor. */
  linked: boolean;
  /** Manual install with no grid-import energy. The setup hint becomes the link card. */
  manualWithoutImport: boolean;
  solarKwh: number | null;
  loadKwh: number | null;
  importKwh: number | null;
  exportKwh: number | null;
  chargeKwh: number | null;
  dischargeKwh: number | null;
  /** Full previous day, used when card 2 still talks about yesterday. */
  yesterday: {
    solarKwh: number;
    loadKwh: number;
    selfPct: number;
  } | null;
  /** Grid import yesterday up to the same clock time. */
  yesterdayImportKwh: number | null;
  /** Completed hours only. */
  hours: Array<{ hour: number; loadKwh: number }>;
  /** Chosen devices, in the user's order. */
  devices: StoryDeviceFact[];
  /** Home Assistant energy prefs list individual devices. */
  hasDeviceConsumption: boolean;
  /** False while prefs are still loading, so the hint does not flash. */
  devicesKnown: boolean;
  soc: number | null;
  chargeKw: number;
  dischargeKw: number;
  /** Decimal hour, already the moment the battery reached its minimum. */
  emptySinceHour: number | null;
  /** False when the battery is charging while the house is importing. */
  chargesFromSolarOnly: boolean;
  weekKwh: number | null;
  lastWeekKwh: number | null;
  /** Monday-first daily grid import for the bars. */
  weekDays: Array<{ weekday: number; kwh: number; current: boolean }>;
  ltsDays: number | null;
  tariffFixed: boolean;
  live: {
    solarKw: number;
    homeKw: number;
    gridImportKw: number;
    gridExportKw: number;
    chargeKw: number;
    dischargeKw: number;
  };
};

export type SolarPartKey = "direct" | "battery" | "grid";

export type StoryCardModel =
  | {
      kind: "solar";
      label: "sun" | "today";
      lead: StoryLine;
      big: string;
      tail: StoryLine;
      parts: Array<{ key: SolarPartKey; pct: number }>;
    }
  | {
      kind: "grid";
      lead: StoryLine;
      big: StoryLine;
      tail: StoryLine | null;
      todayKwh: number;
      yesterdayKwh: number | null;
    }
  | {
      kind: "peak";
      lead: StoryLine;
      big: string;
      sub: StoryLine;
      tail: StoryLine;
      bars: Array<{ hour: number; height: number; peak: boolean; faded: boolean }>;
    }
  | {
      kind: "battery";
      soc: number;
      tail: StoryLine;
      charging: boolean;
    }
  | {
      kind: "devices";
      lead: StoryLine;
      big: StoryLine;
      tail: StoryLine;
      rows: Array<{ name: StoryLine; pct: number }>;
    }
  | { kind: "hint"; mode: "choose" | "setup" }
  | {
      kind: "week";
      lead: StoryLine;
      big: StoryLine;
      tail: StoryLine | null;
      days: Array<{ weekday: number; kwh: number; current: boolean }>;
    }
  | { kind: "link" };

export function line(model: StoryLine, language: StoryLang): string {
  return model[language];
}
