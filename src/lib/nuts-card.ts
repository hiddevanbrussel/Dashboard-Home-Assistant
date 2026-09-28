/** Nuts (utilities) card: weekly/monthly bar chart + period trend for consumption/production. */

export type NutsCardAccent = "consumption" | "production";

/** Overview period for the chart + comparison trend. Default: week. */
export type NutsCardPeriod = "week" | "month";

export type NutsDayPoint = { date: string; consumption: number };

export type NutsWeekBar = {
  /** ISO date YYYY-MM-DD */
  date: string;
  /** Mon=0 … Sun=6 */
  weekday: number;
  value: number;
};

/** Chart bar for either week (weekday) or month (day-of-month) overview. */
export type NutsChartBar = {
  /** ISO date YYYY-MM-DD */
  date: string;
  value: number;
  /** Week: Mon=0…Sun=6. Month: day of month 1…31. */
  tick: number;
};

export type NutsTrend = {
  percent: number;
  /** Raw change direction: positive = this period higher than previous */
  direction: "up" | "down" | "flat";
  /** Whether the change is favorable for this accent */
  favorable: boolean;
};

export const NUTS_CARD_DEFAULT_WIDTH = 320;
export const NUTS_CARD_DEFAULT_HEIGHT = 300;
/** Allow square 250×250 dashboards next to climate compact cards. */
export const NUTS_CARD_MIN_WIDTH = 250;
export const NUTS_CARD_MAX_WIDTH = 480;
export const NUTS_CARD_MIN_HEIGHT = 250;
export const NUTS_CARD_MAX_HEIGHT = 420;

/** Below this (width or height), use denser chrome so the chart still fits. */
export const NUTS_CARD_COMPACT_SIZE = 280;

/** History window for week overview (this + previous week). */
export const NUTS_HISTORY_DAYS_WEEK = 21;
/** History window for month overview (this + previous month). */
export const NUTS_HISTORY_DAYS_MONTH = 65;

export type NutsCardDensity = "comfortable" | "compact";

export function nutsCardDensity(width: number, height: number): NutsCardDensity {
  if (width <= NUTS_CARD_COMPACT_SIZE || height <= NUTS_CARD_COMPACT_SIZE) return "compact";
  return "comfortable";
}

export const NUTS_ACCENT_PRESETS: Record<
  NutsCardAccent,
  {
    icon: string;
    iconColor: string;
    barFrom: string;
    barTo: string;
  }
> = {
  consumption: {
    icon: "Zap",
    iconColor: "#F5C518",
    barFrom: "#F5C518",
    barTo: "#E85D04",
  },
  production: {
    icon: "Leaf",
    iconColor: "#3DDC97",
    barFrom: "#7CFFB2",
    barTo: "#0D9488",
  },
};

export function normalizeNutsAccent(raw: unknown): NutsCardAccent {
  return raw === "production" ? "production" : "consumption";
}

export function normalizeNutsPeriod(raw: unknown): NutsCardPeriod {
  return raw === "month" ? "month" : "week";
}

/** Flip between week and month overview. */
export function toggleNutsPeriod(period: NutsCardPeriod): NutsCardPeriod {
  return period === "week" ? "month" : "week";
}

export function nutsHistoryDays(period: NutsCardPeriod): number {
  return period === "month" ? NUTS_HISTORY_DAYS_MONTH : NUTS_HISTORY_DAYS_WEEK;
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

function dayPointMap(points: NutsDayPoint[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of points) {
    if (!p?.date || !Number.isFinite(p.consumption)) continue;
    map.set(p.date.slice(0, 10), Math.max(0, p.consumption));
  }
  return map;
}

/** Build Mon–Sun bars for the current week from HA daily history. */
export function buildNutsWeekBars(
  points: NutsDayPoint[],
  ref: Date = new Date()
): NutsWeekBar[] {
  const map = dayPointMap(points);
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

/** Build day-of-month bars for the current calendar month (1…last day). */
export function buildNutsMonthBars(
  points: NutsDayPoint[],
  ref: Date = new Date()
): NutsChartBar[] {
  const map = dayPointMap(points);
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const bars: NutsChartBar[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = toDateKey(d);
    bars.push({ date: key, tick: day, value: map.get(key) ?? 0 });
  }
  return bars;
}

/** Chart bars for the selected overview period. */
export function buildNutsChartBars(
  points: NutsDayPoint[],
  period: NutsCardPeriod,
  ref: Date = new Date()
): NutsChartBar[] {
  if (period === "month") return buildNutsMonthBars(points, ref);
  return buildNutsWeekBars(points, ref).map((b) => ({
    date: b.date,
    tick: b.weekday,
    value: b.value,
  }));
}

/** Whether a month-axis day label should be shown (keeps dense charts readable). */
export function shouldShowNutsMonthTick(day: number, daysInMonth: number): boolean {
  if (day === 1 || day === daysInMonth) return true;
  return day % 5 === 0;
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

/** Sum daily points for a Mon–Sun week starting at `monday`. */
export function sumNutsWeek(points: NutsDayPoint[], monday: Date): number {
  const map = dayPointMap(points);
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    sum += map.get(toDateKey(d)) ?? 0;
  }
  return sum;
}

function trendFromTotals(
  current: number,
  previous: number,
  accent: NutsCardAccent
): NutsTrend | null {
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
  return trendFromTotals(current, previous, accent);
}

export function computeNutsWeekTrend(
  points: NutsDayPoint[],
  accent: NutsCardAccent,
  ref: Date = new Date()
): NutsTrend | null {
  const monday = startOfWeekMonday(ref);
  const prevMonday = new Date(monday);
  prevMonday.setDate(monday.getDate() - 7);
  const current = sumNutsWeek(points, monday);
  const previous = sumNutsWeek(points, prevMonday);
  return trendFromTotals(current, previous, accent);
}

export function computeNutsTrend(
  points: NutsDayPoint[],
  accent: NutsCardAccent,
  period: NutsCardPeriod,
  ref: Date = new Date()
): NutsTrend | null {
  return period === "month"
    ? computeNutsMonthTrend(points, accent, ref)
    : computeNutsWeekTrend(points, accent, ref);
}

/** Nice Y-axis max (≥ data max) with ~3 ticks. */
export function nutsChartScale(values: number[]): { max: number; ticks: number[] } {
  const dataMax = Math.max(0, ...values.filter((v) => Number.isFinite(v)));
  if (dataMax <= 0) return { max: 30, ticks: [0, 10, 20, 30] };
  const target = dataMax * 1.08;
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const normalized = target / magnitude;
  const niceNorm =
    normalized <= 1
      ? 1
      : normalized <= 1.5
        ? 1.5
        : normalized <= 2
          ? 2
          : normalized <= 3
            ? 3
            : normalized <= 5
              ? 5
              : 10;
  const max = niceNorm * magnitude;
  const divisions = max % 3 === 0 || niceNorm === 3 || niceNorm === 1.5 ? 3 : 2;
  const step = max / divisions;
  const ticks: number[] = [];
  for (let i = 0; i <= divisions; i++) {
    ticks.push(Math.round(step * i * 10) / 10);
  }
  return { max, ticks };
}

export function formatNutsValue(value: number | undefined, unit: string, digits = 1): string {
  const parts = formatNutsParts(value, unit, digits);
  if (parts.value === "—") return "—";
  return parts.unit ? `${parts.value} ${parts.unit}` : parts.value;
}

/** Split number + unit so compact layouts can stack or shrink independently. */
export function formatNutsParts(
  value: number | undefined,
  unit: string,
  digits = 1
): { value: string; unit: string } {
  if (value == null || Number.isNaN(value)) return { value: "—", unit: "" };
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(digits).replace(".", ",");
  return { value: text, unit: unit.trim() };
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

export function nutsDemoMonthBars(accent: NutsCardAccent, ref: Date = new Date()): NutsChartBar[] {
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const base = accent === "production" ? 18 : 14;
  const bars: NutsChartBar[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    // Gentle wave so demo chart has shape without looking random.
    const value = Math.max(
      2,
      Math.round((base + Math.sin(day / 2.2) * 8 + (day % 7) * 0.6) * 10) / 10
    );
    bars.push({ date: toDateKey(d), tick: day, value });
  }
  return bars;
}

export function nutsDemoChartBars(
  accent: NutsCardAccent,
  period: NutsCardPeriod,
  ref: Date = new Date()
): NutsChartBar[] {
  if (period === "month") return nutsDemoMonthBars(accent, ref);
  return nutsDemoWeekBars(accent).map((b) => ({
    date: b.date,
    tick: b.weekday,
    value: b.value,
  }));
}

export function nutsDemoTodayValue(accent: NutsCardAccent): number {
  return accent === "production" ? 14.7 : 8.4;
}

export function nutsDemoTrend(accent: NutsCardAccent, period: NutsCardPeriod = "week"): NutsTrend {
  if (period === "month") {
    return accent === "production"
      ? { percent: 54, direction: "up", favorable: true }
      : { percent: 24, direction: "up", favorable: false };
  }
  return accent === "production"
    ? { percent: 18, direction: "up", favorable: true }
    : { percent: 12, direction: "up", favorable: false };
}
