/** Nuts (utilities) card: weekly bar chart + month trend for consumption/production. */

export type NutsCardAccent = "consumption" | "production";

export type NutsDayPoint = { date: string; consumption: number };

export type NutsWeekBar = {
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Mon=0 … Sun=6 */
  weekday: number;
  value: number;
};

export type NutsTrend = {
  percent: number;
  /** Raw change direction: positive = this month higher than last */
  direction: "up" | "down" | "flat";
  /** Whether the change is favorable for this accent */
  favorable: boolean;
};

export const NUTS_CARD_DEFAULT_WIDTH = 320;
export const NUTS_CARD_DEFAULT_HEIGHT = 300;
export const NUTS_CARD_MIN_WIDTH = 260;
export const NUTS_CARD_MAX_WIDTH = 480;
export const NUTS_CARD_MIN_HEIGHT = 240;
export const NUTS_CARD_MAX_HEIGHT = 420;

export const NUTS_ACCENT_PRESETS: Record<
  NutsCardAccent,
  {
    icon: string;
    iconColor: string;
    barFrom: string;
    barTo: string;
    glow: string;
  }
> = {
  consumption: {
    icon: "Zap",
    iconColor: "#F5C518",
    barFrom: "#F5C518",
    barTo: "#E85D04",
    glow: "rgba(245, 197, 24, 0.35)",
  },
  production: {
    icon: "Leaf",
    iconColor: "#3DDC97",
    barFrom: "#7CFFB2",
    barTo: "#0D9488",
    glow: "rgba(61, 220, 151, 0.35)",
  },
};

export function normalizeNutsAccent(raw: unknown): NutsCardAccent {
  return raw === "production" ? "production" : "consumption";
}

export function clampNutsCardWidth(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return NUTS_CARD_DEFAULT_WIDTH;
  return Math.min(NUTS_CARD_MAX_WIDTH, Math.max(NUTS_CARD_MIN_WIDTH, Math.round(n)));
}

export function clampNutsCardHeight(h: unknown): number {
  const n = Number(h);
  if (!Number.isFinite(n)) return NUTS_CARD_DEFAULT_HEIGHT;
  return Math.min(NUTS_CARD_MAX_HEIGHT, Math.max(NUTS_CARD_MIN_HEIGHT, Math.round(n)));
}

/** Monday-start ISO date string for the week containing `ref`. */
export function startOfWeekMonday(ref: Date = new Date()): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // Sun=0
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Build Mon–Sun bars for the current week from HA daily history. */
export function buildNutsWeekBars(
  points: NutsDayPoint[],
  ref: Date = new Date()
): NutsWeekBar[] {
  const map = new Map<string, number>();
  for (const p of points) {
    if (!p?.date || !Number.isFinite(p.consumption)) continue;
    map.set(p.date.slice(0, 10), Math.max(0, p.consumption));
  }
  const monday = startOfWeekMonday(ref);
  const bars: NutsWeekBar[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = toDateKey(d);
    bars.push({ date: key, weekday: i, value: map.get(key) ?? 0 });
  }
  return bars;
}

/** Sum points whose date falls in year/month (0-based month). */
export function sumNutsMonth(points: NutsDayPoint[], year: number, month: number): number {
  let sum = 0;
  for (const p of points) {
    const dt = new Date(`${p.date.slice(0, 10)}T12:00:00`);
    if (Number.isNaN(dt.getTime())) continue;
    if (dt.getFullYear() === year && dt.getMonth() === month) {
      sum += Math.max(0, p.consumption);
    }
  }
  return sum;
}

export function computeNutsMonthTrend(
  points: NutsDayPoint[],
  accent: NutsCardAccent,
  ref: Date = new Date()
): NutsTrend | null {
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const prev = new Date(year, month - 1, 1);
  const current = sumNutsMonth(points, year, month);
  const previous = sumNutsMonth(points, prev.getFullYear(), prev.getMonth());
  if (previous <= 0 && current <= 0) return null;
  if (previous <= 0) {
    return {
      percent: 100,
      direction: "up",
      favorable: accent === "production",
    };
  }
  const delta = ((current - previous) / previous) * 100;
  const percent = Math.round(Math.abs(delta));
  const direction: NutsTrend["direction"] =
    Math.abs(delta) < 0.5 ? "flat" : delta > 0 ? "up" : "down";
  const favorable =
    direction === "flat"
      ? true
      : accent === "production"
        ? direction === "up"
        : direction === "down";
  return { percent, direction, favorable };
}

/** Nice Y-axis max (≥ data max) with ~3 ticks. */
export function nutsChartScale(values: number[]): { max: number; ticks: number[] } {
  const dataMax = Math.max(0, ...values.filter((v) => Number.isFinite(v)));
  if (dataMax <= 0) return { max: 30, ticks: [0, 10, 20, 30] };
  const raw = dataMax * 1.15;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const max = nice * magnitude;
  const step = max / 3;
  return { max, ticks: [0, step, step * 2, max].map((n) => Math.round(n * 10) / 10) };
}

export function formatNutsValue(value: number | undefined, unit: string, digits = 1): string {
  if (value == null || Number.isNaN(value)) return "—";
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(digits).replace(".", ",");
  return unit ? `${text} ${unit}` : text;
}

/** Demo series matching the mockup look when HA history is unavailable. */
export function nutsDemoWeekBars(accent: NutsCardAccent): NutsWeekBar[] {
  const consumption = [12, 18, 9, 22, 26, 14, 11];
  const production = [16, 26, 14, 20, 18, 22, 10];
  const values = accent === "production" ? production : consumption;
  const monday = startOfWeekMonday();
  return values.map((value, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { date: toDateKey(d), weekday: i, value };
  });
}

export function nutsDemoTodayValue(accent: NutsCardAccent): number {
  return accent === "production" ? 14.7 : 8.4;
}

export function nutsDemoTrend(accent: NutsCardAccent): NutsTrend {
  return accent === "production"
    ? { percent: 54, direction: "up", favorable: true }
    : { percent: 24, direction: "up", favorable: false };
}
