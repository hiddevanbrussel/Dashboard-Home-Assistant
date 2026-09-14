"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.valetudo.enabled";
const STORAGE_KEY_BASE_URL = "dashboard.valetudo.baseUrl";
const STORAGE_KEY_USERNAME = "dashboard.valetudo.username";
const STORAGE_KEY_PASSWORD = "dashboard.valetudo.password";

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

type ValetudoStore = {
  enabled: boolean;
  baseUrl: string;
  username: string;
  password: string;
  setEnabled: (v: boolean) => void;
  setBaseUrl: (v: string) => void;
  setUsername: (v: string) => void;
  setPassword: (v: string) => void;
};

export const useValetudoStore = create<ValetudoStore>((set) => ({
  enabled: getStoredBool(STORAGE_KEY_ENABLED, false),
  baseUrl: getStored(STORAGE_KEY_BASE_URL, ""),
  username: getStored(STORAGE_KEY_USERNAME, ""),
  password: getStored(STORAGE_KEY_PASSWORD, ""),
  setEnabled: (v) => {
    persist(STORAGE_KEY_ENABLED, String(v));
    set({ enabled: v });
  },
  setBaseUrl: (v) => {
    persist(STORAGE_KEY_BASE_URL, v);
    set({ baseUrl: v });
  },
  setUsername: (v) => {
    persist(STORAGE_KEY_USERNAME, v);
    set({ username: v });
  },
  setPassword: (v) => {
    persist(STORAGE_KEY_PASSWORD, v);
    set({ password: v });
  },
}));

export function hydrateValetudoStore() {
  if (typeof window === "undefined") return;
  useValetudoStore.setState({
    enabled: getStoredBool(STORAGE_KEY_ENABLED, false),
    baseUrl: getStored(STORAGE_KEY_BASE_URL, ""),
    username: getStored(STORAGE_KEY_USERNAME, ""),
    password: getStored(STORAGE_KEY_PASSWORD, ""),
  });
}
