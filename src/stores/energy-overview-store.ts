"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { ENERGY_MY_TILES_ENABLED, readEnergyTab, writeEnergyTab, type EnergyTab } from "@/lib/energy-tab";

type EnergyOverviewStore = {
  tab: EnergyTab;
  /** False until the stored tab has been read in an effect. The first paint is a skeleton. */
  ready: boolean;
  setTab: (tab: EnergyTab) => void;
  hydrate: () => void;
};

export const useEnergyOverviewStore = create<EnergyOverviewStore>((set, get) => ({
  tab: "overview",
  ready: false,
  setTab: (tab) => {
    writeEnergyTab(tab);
    set({ tab, ready: true });
  },
  hydrate: () => {
    if (get().ready) return;
    const stored = readEnergyTab();
    set({ tab: ENERGY_MY_TILES_ENABLED ? stored : "overview", ready: true });
  },
}));

/** Read the saved tab after mount. The first render stays on the skeleton. */
export function useEnergyTab(): { tab: EnergyTab; ready: boolean; setTab: (tab: EnergyTab) => void } {
  const tab = useEnergyOverviewStore((state) => state.tab);
  const ready = useEnergyOverviewStore((state) => state.ready);
  const setTab = useEnergyOverviewStore((state) => state.setTab);
  const hydrate = useEnergyOverviewStore((state) => state.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return { tab, ready, setTab };
}
