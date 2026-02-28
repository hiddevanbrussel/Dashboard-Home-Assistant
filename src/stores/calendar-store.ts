"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.calendar.enabled";
const STORAGE_KEY_ENTITY_IDS = "dashboard.calendar.entityIds";

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

type CalendarStore = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  calendarEntityIds: string[];
  setCalendarEntityIds: (ids: string[]) => void;
};

export const useCalendarStore = create<CalendarStore>((set) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false, (v) => v === "true"),
  setEnabled: (v) => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY_ENABLED, String(v)); } catch { /* ignore */ }
    }
    set({ enabled: v });
  },
  calendarEntityIds: getStored(STORAGE_KEY_ENTITY_IDS, [], (v) => {
    try { return JSON.parse(v) as string[]; } catch { return []; }
  }),
  setCalendarEntityIds: (ids) => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY_ENTITY_IDS, JSON.stringify(ids)); } catch { /* ignore */ }
    }
    set({ calendarEntityIds: ids });
  },
}));

export function hydrateCalendarStore() {
  if (typeof window === "undefined") return;
  useCalendarStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false, (v) => v === "true"),
    calendarEntityIds: getStored(STORAGE_KEY_ENTITY_IDS, [], (v) => {
      try { return JSON.parse(v) as string[]; } catch { return []; }
    }),
  });
}
