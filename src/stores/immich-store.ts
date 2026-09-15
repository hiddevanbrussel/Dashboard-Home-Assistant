"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.immich.enabled";
const STORAGE_KEY_BASE_URL = "dashboard.immich.baseUrl";
const STORAGE_KEY_API_KEY = "dashboard.immich.apiKey";
const STORAGE_KEY_ALBUM_ID = "dashboard.immich.albumId";
const STORAGE_KEY_MEDIA_TYPE = "dashboard.immich.mediaType";

function getStored(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function getStoredBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "true";
  } catch {
    return fallback;
  }
}

function persist(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function notifyScreensaver() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
}

export type ImmichMediaType = "photo" | "video";

type ImmichStore = {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  albumId: string;
  mediaType: ImmichMediaType;
  setEnabled: (v: boolean) => void;
  setBaseUrl: (v: string) => void;
  setApiKey: (v: string) => void;
  setAlbumId: (v: string) => void;
  setMediaType: (v: ImmichMediaType) => void;
};

export const useImmichStore = create<ImmichStore>((set) => ({
  enabled: getStoredBool(STORAGE_KEY_ENABLED, false),
  baseUrl: getStored(STORAGE_KEY_BASE_URL, ""),
  apiKey: getStored(STORAGE_KEY_API_KEY, ""),
  albumId: getStored(STORAGE_KEY_ALBUM_ID, ""),
  mediaType: getStored(STORAGE_KEY_MEDIA_TYPE, "photo") === "video" ? "video" : "photo",
  setEnabled: (v) => {
    persist(STORAGE_KEY_ENABLED, String(v));
    set({ enabled: v });
    notifyScreensaver();
  },
  setBaseUrl: (v) => {
    persist(STORAGE_KEY_BASE_URL, v);
    set({ baseUrl: v });
    notifyScreensaver();
  },
  setApiKey: (v) => {
    persist(STORAGE_KEY_API_KEY, v);
    set({ apiKey: v });
    notifyScreensaver();
  },
  setAlbumId: (v) => {
    persist(STORAGE_KEY_ALBUM_ID, v);
    set({ albumId: v });
    notifyScreensaver();
  },
  setMediaType: (v) => {
    persist(STORAGE_KEY_MEDIA_TYPE, v);
    set({ mediaType: v });
    notifyScreensaver();
  },
}));

export function hydrateImmichStore() {
  if (typeof window === "undefined") return;
  useImmichStore.setState({
    enabled: getStoredBool(STORAGE_KEY_ENABLED, false),
    baseUrl: getStored(STORAGE_KEY_BASE_URL, ""),
    apiKey: getStored(STORAGE_KEY_API_KEY, ""),
    albumId: getStored(STORAGE_KEY_ALBUM_ID, ""),
    mediaType: getStored(STORAGE_KEY_MEDIA_TYPE, "photo") === "video" ? "video" : "photo",
  });
}
