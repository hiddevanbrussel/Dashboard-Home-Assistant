"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.tasks.enabled";

function getStored<T>(key: string, fallback: T, parse: (s: string) => T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null || v === "") return fallback;
    return parse(v);
  } catch {
    return fallback;
  }
}

type ChoresStore = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
};

export const useChoresStore = create<ChoresStore>((set) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false, (v) => v === "true"),
  setEnabled: (v) => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY_ENABLED, String(v)); } catch { /* ignore */ }
    }
    set({ enabled: v });
  },
}));

export function hydrateChoresStore() {
  if (typeof window === "undefined") return;
  useChoresStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false, (v) => v === "true"),
  });
}
