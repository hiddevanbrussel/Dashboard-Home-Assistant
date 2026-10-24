/**
 * Top bar clock: hh:mm without seconds, so the bar only changes once a minute.
 * The screensaver keeps its own clock (screensaver-lock-clock.ts).
 */

export function headerClockLocale(language: string): string {
  return language === "nl" ? "nl-NL" : "en-US";
}

export function formatHeaderClock(date: Date, language: string, use24h: boolean): string {
  return date.toLocaleTimeString(
    headerClockLocale(language),
    use24h
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : { hour: "numeric", minute: "2-digit", hour12: true }
  );
}

/** Milliseconds until the next whole minute (:00), at least 1 ms. */
export function msUntilNextMinute(date: Date): number {
  const ms = 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds());
  return Math.max(1, ms);
}
