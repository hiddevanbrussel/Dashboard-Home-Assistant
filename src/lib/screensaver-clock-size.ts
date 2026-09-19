export const SCREENSAVER_CLOCK_SIZES = ["sm", "md", "lg", "xl"] as const;

export type ScreensaverClockSize = (typeof SCREENSAVER_CLOCK_SIZES)[number];

export const DEFAULT_SCREENSAVER_CLOCK_SIZE: ScreensaverClockSize = "xl";

export function isScreensaverClockSize(value: unknown): value is ScreensaverClockSize {
  return SCREENSAVER_CLOCK_SIZES.some((size) => size === value);
}

export function getScreensaverClockSizeOrDefault(value: string | null | undefined): ScreensaverClockSize {
  return isScreensaverClockSize(value) ? value : DEFAULT_SCREENSAVER_CLOCK_SIZE;
}

export function clockSizeTimeClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "text-6xl sm:text-7xl";
    case "lg":
      return "text-[6.5rem] sm:text-[8rem]";
    case "xl":
      return "text-[clamp(7rem,22vw,15rem)]";
    default:
      return "text-8xl sm:text-9xl";
  }
}

export function clockSizeAmpmClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "text-base sm:text-lg";
    case "lg":
      return "text-2xl sm:text-3xl";
    case "xl":
      return "text-4xl sm:text-5xl";
    default:
      return "text-lg sm:text-xl";
  }
}

export function clockSizeDateClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "text-base";
    case "lg":
      return "text-2xl";
    case "xl":
      return "text-4xl";
    default:
      return "text-xl";
  }
}

/**
 * Date sits above the minutes, weather below. Large display fonts leave empty
 * space in the glyph box; pull the meta lines into that padding.
 */
export function clockSizeMetaAboveClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "-mb-1.5";
    case "lg":
      return "-mb-6";
    case "xl":
      return "-mb-12";
    default:
      return "-mb-4";
  }
}

export function clockSizeMetaBelowClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "-mt-1";
    case "lg":
      return "-mt-5";
    case "xl":
      return "-mt-10";
    default:
      return "-mt-3";
  }
}

/** Relative digit size for the settings preview cards, not the live screensaver. */
export function clockSizePreviewDigitClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "text-xl";
    case "lg":
      return "text-3xl";
    case "xl":
      return "text-5xl";
    default:
      return "text-2xl";
  }
}
