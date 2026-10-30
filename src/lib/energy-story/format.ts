/**
 * Rounding and notation for the story cards.
 * kWh uses one decimal (whole numbers from 100), power uses 10 W steps,
 * percents are whole numbers. Differences use the rounded figures that are shown.
 * Money is not formatted here.
 */

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

export type StoryLang = "nl" | "en";

export function storyLocale(language: StoryLang): "nl-NL" | "en-GB" {
  return language === "nl" ? "nl-NL" : "en-GB";
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function roundPowerKw(kw: number): number {
  const abs = Math.abs(kw);
  if (abs < 1) return (Math.round(abs * 100) * 10) / 1000;
  if (abs < 10) return Math.round(abs * 100) / 100;
  return Math.round(abs * 10) / 10;
}

/** Watts below 1 kW, two decimals up to 10 kW, one decimal above that. */
export function formatPower(kw: number, language: StoryLang): string {
  const locale = storyLocale(language);
  const abs = Math.abs(kw);
  if (abs < 1) {
    const watts = Math.round(abs * 100) * 10;
    return `${watts} W`;
  }
  if (abs < 10) {
    const text = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(abs * 100) / 100);
    return `${text} kW`;
  }
  const text = new Intl.NumberFormat(locale, ONE_DECIMAL).format(Math.round(abs * 10) / 10);
  return `${text} kW`;
}

/** One decimal, or a whole number from 100 kWh. */
export function formatKwh(value: number, language: StoryLang): string {
  const locale = storyLocale(language);
  if (value >= 100) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value))} kWh`;
  }
  return `${new Intl.NumberFormat(locale, ONE_DECIMAL).format(round1(value))} kWh`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** 24-hour clock. Quarter-hour rounding is for "leeg sinds". */
export function formatClock(hour: number, quarter = false): string {
  const snapped = quarter ? Math.round(hour * 4) / 4 : hour;
  const whole = Math.floor(snapped);
  const minutes = Math.round((snapped - whole) * 60);
  const carry = minutes === 60 ? 1 : 0;
  const hh = String(whole + carry).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatHourSpan(startHour: number): string {
  const start = Math.floor(startHour);
  const end = start + 1;
  return `${formatClock(start)}–${formatClock(end === 24 ? 0 : end)}`;
}

/**
 * Self-sufficiency shown on card 2.
 * 100% only when grid import is under 0.05 kWh. 0% only when solar and battery added nothing.
 * Anything in between is clamped to 1–99.
 */
export function selfPctShown(selfPct: number | null, loadKwh: number, importKwh: number): number | null {
  if (selfPct == null || loadKwh < 0.5) return null;
  if (importKwh < 0.05) return 100;
  const rounded = Math.round(selfPct);
  const floor = loadKwh - importKwh > 0.05 ? 1 : 0;
  return Math.min(99, Math.max(floor, rounded));
}

/** Integer percents that add up to 100. The largest remainders get the extra points. */
export function largestRemainder(values: readonly number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return values.map(() => 0);
  const raw = values.map((value) => (value / total) * 100);
  const floors = raw.map((value) => Math.floor(value));
  let rest = 100 - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - (floors[index] ?? 0) }))
    .sort((a, b) => b.fraction - a.fraction);
  for (const entry of order) {
    if (rest <= 0) break;
    floors[entry.index] = (floors[entry.index] ?? 0) + 1;
    rest -= 1;
  }
  return floors;
}

/** Lower median, matching the example day (index floor((n-1)/2) of the sorted hours). */
export function lowerMedian(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)] ?? null;
}
