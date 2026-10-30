/**
 * Nu hero when Home Assistant cannot be reached, or when a linked sensor has no reading.
 * Last numbers stay, unknown numbers become a dash, and nothing animates.
 */

export type HeroOfflineInput = {
  haReachable: boolean;
  prefsReady: boolean;
  linked: boolean;
  hasMeasurement: boolean;
  houseKw: number | null;
  lastAt: Date | null;
  timeZone: string;
};

export type HeroOfflineState = {
  offline: boolean;
  badge: "live" | "offline";
  /** Clock already filled in, or a dash when the last poll time is unknown. */
  time: string;
  houseDash: boolean;
  animate: boolean;
  glow: boolean;
  mintLine: boolean;
  leadersDotted: boolean;
  /** Idle copy such as "rust" is not shown. */
  hideIdle: boolean;
};

export function formatClockInstant(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const hh = hour === "24" ? "00" : hour;
  return `${hh}:${minute}`;
}

export function isHeroOffline(input: Pick<HeroOfflineInput, "haReachable" | "prefsReady" | "linked" | "hasMeasurement">): boolean {
  if (!input.haReachable) return true;
  return input.prefsReady && input.linked && !input.hasMeasurement;
}

export function heroOfflineState(input: HeroOfflineInput): HeroOfflineState {
  const offline = isHeroOffline(input);
  if (!offline) {
    return {
      offline: false,
      badge: "live",
      time: "",
      houseDash: input.houseKw == null,
      animate: true,
      glow: true,
      mintLine: true,
      leadersDotted: false,
      hideIdle: false,
    };
  }
  const time = input.lastAt ? formatClockInstant(input.lastAt, input.timeZone) : "–";
  return {
    offline: true,
    badge: "offline",
    time,
    houseDash: input.houseKw == null || input.houseKw === 0,
    animate: false,
    glow: false,
    mintLine: false,
    leadersDotted: true,
    hideIdle: true,
  };
}

/** A power figure while offline. Zero and unknown both become a dash, never a fake zero. */
export function offlinePowerText(kw: number | null, offline: boolean, format: (kw: number) => string): string | null {
  if (kw == null || !Number.isFinite(kw)) return null;
  if (offline && kw === 0) return null;
  return format(kw);
}

