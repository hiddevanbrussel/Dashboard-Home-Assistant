import { create } from "zustand";
import { persist } from "zustand/middleware";
import { applyThemeAccent, DEFAULT_THEME_ACCENT, type ThemeAccentId } from "@/lib/theme-accents";

export type ThemeMode = "auto" | "light" | "dark";

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolved: "light" | "dark";
  setResolved: (resolved: "light" | "dark") => void;
  accent: ThemeAccentId;
  setAccent: (accent: ThemeAccentId) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "auto",
      resolved: "light",
      accent: DEFAULT_THEME_ACCENT,
      setMode: (mode) => set({ mode }),
      setResolved: (resolved) => set({ resolved }),
      setAccent: (accent) => {
        applyThemeAccent(accent);
        set({ accent });
      },
    }),
    { name: "dashboard-theme" }
  )
);
