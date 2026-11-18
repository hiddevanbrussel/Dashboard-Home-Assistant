import { PARTICLE_CAP } from "../weather-sky";
import type { SkyMode } from "./sky-motion";

export type Rect = { x: number; y: number; width: number; height: number };
export type OverflowMargins = { left: number; right: number; bottom: number };
export type OverflowGate = "on" | "fading-out" | "off";
export function overflowEnabled(input: {
  mode: SkyMode; performanceStep: number; condition: string; floating: boolean; stacked: boolean;
  reducedMotion: boolean; paused: boolean; editMode?: boolean; dragging?: boolean; resizing?: boolean;
  plotIn?: boolean; sheetOpen?: boolean; popupOpen?: boolean; hidden?: boolean; visible?: boolean; screensaver?: boolean;
}): OverflowGate {
  if (!input.floating || input.stacked || input.mode !== "animated-full" || input.performanceStep !== 0 || input.reducedMotion
    || !["rainy", "pouring", "lightning-rainy", "snowy", "snowy-rainy", "hail"].includes(input.condition.trim().toLowerCase())
    || input.hidden || input.visible === false || input.screensaver) return "off";
  if (input.editMode || input.dragging || input.resizing || input.plotIn || input.sheetOpen || input.popupOpen) return "fading-out";
  return input.paused ? "off" : "on";
}
export function overflowRect(tile: Rect, margins: OverflowMargins): Rect {
  return { x: tile.x - margins.left, y: tile.y, width: tile.width + margins.left + margins.right, height: tile.height + margins.bottom };
}
export function overflowStrips(width: number, height: number, margins: OverflowMargins): Rect[] {
  return [
    { x: 0, y: 0, width: margins.left, height: height + margins.bottom },
    { x: margins.left + width, y: 0, width: margins.right, height: height + margins.bottom },
    { x: margins.left, y: height, width, height: margins.bottom },
    { x: margins.left, y: height - 28, width: 28, height: 28 },
    { x: margins.left + width - 28, y: height - 28, width: 28, height: 28 },
  ];
}
export function overflowParticleCount(inTile: number, width: number, height: number, margins: OverflowMargins): number {
  if (width <= 0 || height <= 0) return 0;
  return Math.min(PARTICLE_CAP, Math.round(inTile * (width + margins.left + margins.right) * (height + margins.bottom) / (width * height)));
}
/** Rebuilt only on measurement. Coordinates are local to the overflow canvas. */
export function writeOccluders(canvas: Rect, rects: readonly Rect[], output: Float32Array): number {
  let count = 0;
  for (const rect of rects) {
    const x = Math.max(canvas.x, rect.x), y = Math.max(canvas.y, rect.y);
    const right = Math.min(canvas.x + canvas.width, rect.x + rect.width);
    const bottom = Math.min(canvas.y + canvas.height, rect.y + rect.height);
    if (right <= x || bottom <= y) continue;
    if ((count + 1) * 4 > output.length) break;
    const at = count++ * 4;
    output[at] = x - canvas.x; output[at + 1] = y - canvas.y;
    output[at + 2] = right - x; output[at + 3] = bottom - y;
  }
  return count;
}
/** Allocation-free conservative bounds filter; clipping handles the exact U. */
export function touchesOverflow(kind: number, left: number, top: number, right: number, bottom: number,
  width: number, height: number, margins: OverflowMargins): boolean {
  if (kind === 3 || bottom < 0 || top > height + margins.bottom || right < -margins.left || left > width + margins.right) return false;
  return left < 0 || right > width || bottom > height || (bottom > height - 28 && (left < 28 || right > width - 28));
}
/** A static intersected side/bottom mask; no text scrim belongs on this target. */
export function overflowMask(width: number, height: number, margins: OverflowMargins): string {
  return `linear-gradient(90deg, transparent 0, #000 ${margins.left}px, #000 ${margins.left + width}px, transparent 100%), linear-gradient(180deg, #000 0, #000 ${height + 12}px, transparent ${height + margins.bottom}px)`;
}
