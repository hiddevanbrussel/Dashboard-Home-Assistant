import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyGlassDensity,
  DEFAULT_GLASS_DENSITY,
  getGlassDensityOrDefault,
  type GlassDensity,
} from "@/lib/glass-density";

type GlassDensityStore = {
  density: GlassDensity;
  setDensity: (density: GlassDensity) => void;
};

export const useGlassDensityStore = create<GlassDensityStore>()(
  persist(
    (set) => ({
      density: DEFAULT_GLASS_DENSITY,
      setDensity: (density) => {
        const next = getGlassDensityOrDefault(density);
        applyGlassDensity(next);
        set({ density: next });
      },
    }),
    {
      name: "dashboard-glass-density",
      partialize: (state) => ({ density: state.density }),
      onRehydrateStorage: () => (state) => {
        if (state) applyGlassDensity(getGlassDensityOrDefault(state.density));
      },
    }
  )
);

/** Apply immediately when the module loads (before React hydrate when possible). */
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("dashboard-glass-density");
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { density?: unknown } };
      applyGlassDensity(getGlassDensityOrDefault(parsed?.state?.density));
    } else {
      applyGlassDensity(DEFAULT_GLASS_DENSITY);
    }
  } catch {
    applyGlassDensity(DEFAULT_GLASS_DENSITY);
  }
}
