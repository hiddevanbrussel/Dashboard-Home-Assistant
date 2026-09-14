"use client";

import { create } from "zustand";
import { timerRemainingMs, timerShouldRing, type TimerStatus } from "@/lib/timer";

const STORAGE_KEY = "dashboard.kitchenTimer";

type PersistedTimer = {
  status: TimerStatus;
  durationSeconds: number;
  endsAt: number | null;
  remainingMs: number;
};

function loadPersisted(): PersistedTimer {
  const idle: PersistedTimer = { status: "idle", durationSeconds: 0, endsAt: null, remainingMs: 0 };
  if (typeof window === "undefined") return idle;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return idle;
    const parsed = JSON.parse(raw) as PersistedTimer;
    if (parsed.status === "running" && timerShouldRing(parsed.status, parsed.endsAt)) {
      return { ...parsed, status: "ringing", endsAt: null, remainingMs: 0 };
    }
    if (parsed.status === "running" || parsed.status === "paused" || parsed.status === "ringing") {
      return parsed;
    }
    return idle;
  } catch {
    return idle;
  }
}

function savePersisted(state: PersistedTimer) {
  if (typeof window === "undefined") return;
  try {
    if (state.status === "idle") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

let ringTimer: ReturnType<typeof setTimeout> | null = null;

function clearRingTimer() {
  if (ringTimer != null) {
    clearTimeout(ringTimer);
    ringTimer = null;
  }
}

type TimerStore = PersistedTimer & {
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  dismiss: () => void;
  finish: () => void;
};

function scheduleFinish(endsAt: number) {
  clearRingTimer();
  const wait = Math.max(0, endsAt - Date.now());
  ringTimer = setTimeout(() => {
    useTimerStore.getState().finish();
  }, wait);
}

export const useTimerStore = create<TimerStore>((set, get) => {
  const initial = loadPersisted();
  if (initial.status === "running" && initial.endsAt != null && typeof window !== "undefined") {
    queueMicrotask(() => scheduleFinish(initial.endsAt!));
  }

  return {
    ...initial,
    start: (seconds) => {
      const durationSeconds = Math.max(1, Math.round(seconds));
      const endsAt = Date.now() + durationSeconds * 1000;
      const next: PersistedTimer = {
        status: "running",
        durationSeconds,
        endsAt,
        remainingMs: durationSeconds * 1000,
      };
      savePersisted(next);
      scheduleFinish(endsAt);
      set(next);
    },
    pause: () => {
      const current = get();
      if (current.status !== "running") return;
      clearRingTimer();
      const remainingMs = timerRemainingMs(current.status, current.endsAt, current.remainingMs);
      const next: PersistedTimer = {
        status: "paused",
        durationSeconds: current.durationSeconds,
        endsAt: null,
        remainingMs,
      };
      savePersisted(next);
      set(next);
    },
    resume: () => {
      const current = get();
      if (current.status !== "paused" || current.remainingMs <= 0) return;
      const endsAt = Date.now() + current.remainingMs;
      const next: PersistedTimer = {
        status: "running",
        durationSeconds: current.durationSeconds,
        endsAt,
        remainingMs: current.remainingMs,
      };
      savePersisted(next);
      scheduleFinish(endsAt);
      set(next);
    },
    cancel: () => {
      clearRingTimer();
      const next: PersistedTimer = { status: "idle", durationSeconds: 0, endsAt: null, remainingMs: 0 };
      savePersisted(next);
      set(next);
    },
    dismiss: () => {
      clearRingTimer();
      const next: PersistedTimer = { status: "idle", durationSeconds: 0, endsAt: null, remainingMs: 0 };
      savePersisted(next);
      set(next);
    },
    finish: () => {
      clearRingTimer();
      const current = get();
      if (current.status !== "running" && current.status !== "paused") return;
      const next: PersistedTimer = {
        status: "ringing",
        durationSeconds: current.durationSeconds,
        endsAt: null,
        remainingMs: 0,
      };
      savePersisted(next);
      set(next);
    },
  };
});
