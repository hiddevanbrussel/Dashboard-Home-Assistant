"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.musicAssistant.enabled";
const STORAGE_KEY_BASE_URL = "dashboard.musicAssistant.baseUrl";
const STORAGE_KEY_TOKEN = "dashboard.musicAssistant.token";

const DEFAULT_BASE_URL = "http://localhost:8095";

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    if (key === STORAGE_KEY_ENABLED) return (v === "true") as T;
    return v as T;
  } catch {
    return fallback;
  }
}

function setStored(key: string, value: string | boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(value));
    window.dispatchEvent(new CustomEvent("music-assistant-setting-changed"));
  } catch {
    // ignore
  }
}

export type MusicAssistantStore = {
  enabled: boolean;
  baseUrl: string;
  token: string;
  setEnabled: (v: boolean) => void;
  setBaseUrl: (v: string) => void;
  setToken: (v: string) => void;
};

export const useMusicAssistantStore = create<MusicAssistantStore>((set, get) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false),
  baseUrl: getStored(STORAGE_KEY_BASE_URL, DEFAULT_BASE_URL),
  token: getStored(STORAGE_KEY_TOKEN, ""),
  setEnabled: (v) => {
    setStored(STORAGE_KEY_ENABLED, v);
    set({ enabled: v });
  },
  setBaseUrl: (v) => {
    const url = (v || DEFAULT_BASE_URL).replace(/\/+$/, "");
    setStored(STORAGE_KEY_BASE_URL, url);
    set({ baseUrl: url });
  },
  setToken: (v) => {
    setStored(STORAGE_KEY_TOKEN, v || "");
    set({ token: v || "" });
  },
}));

/** Hydrate store from localStorage (call once in client, e.g. in layout or TopTabs). */
export function hydrateMusicAssistantStore() {
  useMusicAssistantStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false),
    baseUrl: getStored(STORAGE_KEY_BASE_URL, DEFAULT_BASE_URL),
    token: getStored(STORAGE_KEY_TOKEN, ""),
  });
}
