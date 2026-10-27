import { clampVolume } from "@/lib/music-now-playing";

/** A tap on the track may rise by at most 10. A tap below the current level goes straight there. */
export function trackTapVolume(current: number, target: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(target)) return 0;
  const next = target > current ? Math.min(target, current + 10) : target;
  return clampVolume(next);
}

/** Step used by the −/+ buttons. The result stays inside 0–100. */
export function stepVolume(current: number, delta: number): number {
  return clampVolume(current + delta);
}

/** Muted playback shows 0. The stored level is left unchanged. */
export function displayedVolume(volume: number, muted: boolean): number {
  if (muted) return 0;
  return clampVolume(volume);
}

/** Shown next to the slider. Unknown stays a dash; 80 is never filled in. */
export function volumeFigure(volume: number | null, muted: boolean): string {
  if (volume == null || !Number.isFinite(volume)) return "–";
  return String(displayedVolume(volume, muted));
}

/** Screen reader text while the level is still unknown. A draft replaces it. */
export function volumeValueText(volume: number | null, draft: number | null): string | undefined {
  if (draft != null) return undefined;
  if (volume == null || !Number.isFinite(volume)) return "–";
  return undefined;
}

/** Panel heading. An unknown level is a dash, without a percent sign. */
export function volumePanelText(figure: string, percentTemplate: string): string {
  if (figure === "–") return "–";
  return percentTemplate.replace("{n}", figure);
}
