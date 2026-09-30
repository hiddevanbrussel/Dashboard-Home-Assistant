import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setUiClickEnabledGetter } from "@/lib/ui-click";

type UiSoundStore = {
  /** Soft click on primary controls. On by default. */
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export const useUiSoundStore = create<UiSoundStore>()(
  persist(
    (set) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: "dashboard-ui-sound" }
  )
);

setUiClickEnabledGetter(() => useUiSoundStore.getState().enabled);
