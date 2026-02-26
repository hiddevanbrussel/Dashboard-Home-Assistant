"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.energy.enabled";

function getStored(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "true";
  } catch {
    return fallback;
  }
}

function setStored(key: string, value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

type EnergyStore = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
};

export const useEnergyStore = create<EnergyStore>((set) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false),
  setEnabled: (v) => {
    setStored(STORAGE_KEY_ENABLED, v);
    set({ enabled: v });
  },
}));

export function hydrateEnergyStore() {
  if (typeof window === "undefined") return;
  useEnergyStore.setState({ enabled: getStored(STORAGE_KEY_ENABLED, false) });
}
