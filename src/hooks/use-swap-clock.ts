"use client";

import { useLayoutEffect, useState } from "react";
import { msUntilSwapBoundary, swapPhase, type SwapPhase } from "@/lib/energy-day-band";

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | null = null;

function arm() {
  if (timer != null) clearTimeout(timer);
  timer = null;
  if (listeners.size === 0) return;
  const wait = msUntilSwapBoundary(Date.now());
  timer = setTimeout(() => {
    timer = null;
    for (const listener of [...listeners]) listener();
    arm();
  }, wait);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) arm();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer != null) {
      clearTimeout(timer);
      timer = null;
    }
  };
}

/** Drops the shared timer. Tests use this so a failed case cannot leak a timeout. */
export function resetSwapClockForTests(): void {
  listeners.clear();
  if (timer != null) clearTimeout(timer);
  timer = null;
}

/**
 * Phase of the shared 8s/5s clock.
 * One timeout reaches the next boundary and wakes every subscriber. Cells do not keep their own interval.
 */
export function useSwapClock(enabled: boolean): SwapPhase {
  const [phase, setPhase] = useState<SwapPhase>("primary");
  useLayoutEffect(() => {
    if (!enabled) return;
    const apply = () => setPhase(swapPhase(Date.now()));
    apply();
    return subscribe(apply);
  }, [enabled]);
  return phase;
}
