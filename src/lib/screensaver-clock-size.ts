export const SCREENSAVER_CLOCK_SIZES = ["sm", "md", "lg", "xl"] as const;

export type ScreensaverClockSize = (typeof SCREENSAVER_CLOCK_SIZES)[number];

export const DEFAULT_SCREENSAVER_CLOCK_SIZE: ScreensaverClockSize = "md";

export function isScreensaverClockSize(value: unknown): value is ScreensaverClockSize {
  return SCREENSAVER_CLOCK_SIZES.some((size) => size === value);
}

export function getScreensaverClockSizeOrDefault(value: string | null | undefined): ScreensaverClockSize {
  return isScreensaverClockSize(value) ? value : DEFAULT_SCREENSAVER_CLOCK_SIZE;
}

export function clockSizeTimeClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "text-4xl sm:text-5xl";
    case "lg":
      return "text-7xl sm:text-8xl";
    case "xl":
      return "text-8xl sm:text-9xl";
    default:
      return "text-5xl sm:text-6xl";
  }
}

export function clockSizeAmpmClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "text-base sm:text-lg";
    case "lg":
      return "text-2xl sm:text-3xl";
    case "xl":
      return "text-3xl sm:text-4xl";
    default:
      return "text-lg sm:text-xl";
  }
}

export function clockSizeDateClass(size: ScreensaverClockSize): string {
  switch (size) {
    case "sm":
      return "text-xs";
    case "lg":
      return "text-base";
    case "xl":
      return "text-lg";
    default:
      return "text-sm";
  }
}
