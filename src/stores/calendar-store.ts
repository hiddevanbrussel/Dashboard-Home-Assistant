"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.calendar.enabled";
const STORAGE_KEY_ENTITY_IDS = "dashboard.calendar.entityIds";
const STORAGE_KEY_TITLE_CODES = "dashboard.calendar.titleCodes";

function parseTitleCodes(s: string): Record<string, string> {
  try {
    const parsed = JSON.parse(s) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const code = key.trim().toUpperCase();
      const label = typeof value === "string" ? value.trim() : "";
      if (code && label) out[code] = label;
    }
    return out;
  } catch {
    return {};
  }
}

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
  titleCodes: Record<string, string>;
  setTitleCodes: (codes: Record<string, string>) => void;
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
  titleCodes: getStored(STORAGE_KEY_TITLE_CODES, {}, parseTitleCodes),
  setTitleCodes: (codes) => {
    const next = parseTitleCodes(JSON.stringify(codes));
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY_TITLE_CODES, JSON.stringify(next)); } catch { /* ignore */ }
    }
    set({ titleCodes: next });
  },
}));

export function hydrateCalendarStore() {
  if (typeof window === "undefined") return;
  useCalendarStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false, (v) => v === "true"),
    calendarEntityIds: getStored(STORAGE_KEY_ENTITY_IDS, [], (v) => {
      try { return JSON.parse(v) as string[]; } catch { return []; }
    }),
    titleCodes: getStored(STORAGE_KEY_TITLE_CODES, {}, parseTitleCodes),
  });
}
