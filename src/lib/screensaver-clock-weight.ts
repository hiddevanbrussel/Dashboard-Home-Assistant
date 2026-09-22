export const SCREENSAVER_CLOCK_WEIGHTS = ["medium", "bold", "extrabold", "black"] as const;

export type ScreensaverClockWeight = (typeof SCREENSAVER_CLOCK_WEIGHTS)[number];

export const DEFAULT_SCREENSAVER_CLOCK_WEIGHT: ScreensaverClockWeight = "extrabold";

export function isScreensaverClockWeight(value: unknown): value is ScreensaverClockWeight {
  return SCREENSAVER_CLOCK_WEIGHTS.some((weight) => weight === value);
}

export function getScreensaverClockWeightOrDefault(
  value: string | null | undefined
): ScreensaverClockWeight {
  return isScreensaverClockWeight(value) ? value : DEFAULT_SCREENSAVER_CLOCK_WEIGHT;
}

/** Tailwind font-weight class for lock-screen digits. */
export function clockWeightClass(weight: ScreensaverClockWeight): string {
  switch (weight) {
    case "medium":
      return "font-medium";
    case "bold":
      return "font-bold";
    case "black":
      return "font-black";
    default:
      return "font-extrabold";
  }
}
