export const SCREENSAVER_CLOCK_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

export type ScreensaverClockPosition = (typeof SCREENSAVER_CLOCK_POSITIONS)[number];

export const DEFAULT_SCREENSAVER_CLOCK_POSITION: ScreensaverClockPosition = "bottom-right";

export function isScreensaverClockPosition(value: unknown): value is ScreensaverClockPosition {
  return SCREENSAVER_CLOCK_POSITIONS.some((position) => position === value);
}

export function getScreensaverClockPositionOrDefault(value: string | null | undefined): ScreensaverClockPosition {
  return isScreensaverClockPosition(value) ? value : DEFAULT_SCREENSAVER_CLOCK_POSITION;
}

export function clockPositionAxis(position: ScreensaverClockPosition): {
  x: "left" | "center" | "right";
  y: "top" | "middle" | "bottom";
} {
  const y =
    position.startsWith("top") ? "top" : position.startsWith("bottom") ? "bottom" : "middle";
  const x = position.endsWith("left") ? "left" : position.endsWith("right") ? "right" : "center";
  return { x, y };
}

export function clockPositionOverlayClass(position: ScreensaverClockPosition): string {
  const { x, y } = clockPositionAxis(position);
  return [
    y === "top" ? "items-start" : y === "bottom" ? "items-end" : "items-center",
    x === "left" ? "justify-start" : x === "right" ? "justify-end" : "justify-center",
  ].join(" ");
}

/** Keep media/football away from a clock that sits in the bottom-left. */
export function screensaverMediaSide(position: ScreensaverClockPosition): "left" | "right" {
  return position === "bottom-left" || position === "middle-left" ? "right" : "left";
}
