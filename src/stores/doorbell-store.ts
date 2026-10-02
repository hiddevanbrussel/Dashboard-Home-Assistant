"use client";

import { create } from "zustand";
import {
  DOORBELL_STORAGE_KEY,
  defaultDoorbellSettings,
  parseDoorbellSettings,
  type DoorbellRingEvent,
  type DoorbellSettings,
} from "@/lib/doorbell";

function readSettings(): DoorbellSettings {
  if (typeof window === "undefined") return defaultDoorbellSettings();
  try {
    const raw = localStorage.getItem(DOORBELL_STORAGE_KEY);
    if (raw == null || raw === "") return defaultDoorbellSettings();
    return parseDoorbellSettings(JSON.parse(raw));
  } catch {
    return defaultDoorbellSettings();
  }
}

function writeSettings(settings: DoorbellSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DOORBELL_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

type DoorbellStore = {
  settings: DoorbellSettings;
  /** Active ring popup, or null when closed. */
  activeRing: DoorbellRingEvent | null;
  lastRingAtMs: number | null;
  setSettings: (patch: Partial<DoorbellSettings>) => void;
  replaceSettings: (settings: DoorbellSettings) => void;
  triggerRing: (event?: Partial<DoorbellRingEvent>) => void;
  dismissRing: () => void;
  markRingAt: (atMs: number) => void;
};

export const useDoorbellStore = create<DoorbellStore>((set, get) => ({
  settings: readSettings(),
  activeRing: null,
  lastRingAtMs: null,
  setSettings: (patch) => {
    const next = { ...get().settings, ...patch };
    writeSettings(next);
    set({ settings: next });
  },
  replaceSettings: (settings) => {
    writeSettings(settings);
    set({ settings });
  },
  triggerRing: (event) => {
    const s = get().settings;
    const atMs = event?.atMs ?? Date.now();
    set({
      activeRing: {
        sensorEntityId: event?.sensorEntityId ?? s.sensorEntityId,
        cameraEntityId: event?.cameraEntityId ?? s.cameraEntityId,
        webrtcStreamUrl: event?.webrtcStreamUrl ?? s.webrtcStreamUrl,
        atMs,
      },
      lastRingAtMs: atMs,
    });
  },
  dismissRing: () => set({ activeRing: null }),
  markRingAt: (atMs) => set({ lastRingAtMs: atMs }),
}));

export function hydrateDoorbellStore() {
  if (typeof window === "undefined") return;
  useDoorbellStore.setState({ settings: readSettings() });
}
