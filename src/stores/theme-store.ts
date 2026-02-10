import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "auto" | "light" | "dark";

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolved: "light" | "dark";
  setResolved: (resolved: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "auto",
      resolved: "light",
      setMode: (mode) => set({ mode }),
      setResolved: (resolved) => set({ resolved }),
    }),
    { name: "dashboard-theme" }
  )
);
