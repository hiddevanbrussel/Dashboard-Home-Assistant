"use client";

import { useRef } from "react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { clampVolume } from "@/lib/music-now-playing";
import { stepVolume, trackTapVolume } from "@/lib/music-volume";
import { cn } from "@/lib/utils";

type MusicVolumeSliderProps = {
  value: number;
  width: number;
  disabled?: boolean;
  label: string;
  onDraft: (value: number) => void;
  onCommit: () => void;
};

/**
 * Custom volume slider. A drag starts on the thumb. A tap on the track uses
 * trackTapVolume. The parent commits once, on release.
 */
export function MusicVolumeSlider({ value, width, disabled = false, label, onDraft, onCommit }: MusicVolumeSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const live = useRef(value);
  live.current = value;

  function valueFromClientX(clientX: number): number {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return clampVolume(value);
    return clampVolume(((clientX - rect.left) / rect.width) * 100);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-volume-thumb]")) {
      dragging.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      const next = valueFromClientX(event.clientX);
      live.current = next;
      onDraft(next);
      return;
    }
    const next = trackTapVolume(value, valueFromClientX(event.clientX));
    live.current = next;
    onDraft(next);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const next = valueFromClientX(event.clientX);
    live.current = next;
    onDraft(next);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onCommit();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const current = live.current;
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = stepVolume(current, 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = stepVolume(current, -1);
        break;
      case "PageUp":
        next = stepVolume(current, 10);
        break;
      case "PageDown":
        next = stepVolume(current, -10);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        return;
    }
    event.preventDefault();
    live.current = next;
    onDraft(next);
  }

  const shown = clampVolume(value);

  return (
    <div
      ref={rootRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={shown}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cn("relative flex h-11 items-center rounded-full outline-none", FOCUS_RING_BRAND, disabled && "opacity-50")}
      style={{ width }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      onKeyUp={onCommit}
      onBlur={onCommit}
    >
      <div className="pointer-events-none relative h-2 w-full rounded-full bg-gray-500 dark:bg-white/40" aria-hidden>
        <div className="h-full rounded-full bg-gray-800 dark:bg-white/90" style={{ width: `${shown}%` }} />
      </div>
      <span
        data-volume-thumb
        className="absolute top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${shown}%` }}
      >
        <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 shadow ring-2 ring-white dark:bg-white dark:ring-gray-900" />
      </span>
    </div>
  );
}
