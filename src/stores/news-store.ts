import { create } from "zustand";
import { persist } from "zustand/middleware";

type NewsStore = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  rssUrls: string[];
  setRssUrls: (urls: string[]) => void;
};

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      enabled: false,
      setEnabled: (v) => set({ enabled: v }),
      rssUrls: [],
      setRssUrls: (urls) => set({ rssUrls: urls }),
    }),
    { name: "dashboard-news" }
  )
);
