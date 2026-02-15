import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "nl";

function getDefaultLanguage(): Language {
  const env = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE?.toLowerCase();
  if (env === "nl" || env === "en") return env;
  return "en";
}

type LanguageStore = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: getDefaultLanguage(),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "dashboard-language",
      partialize: (s) => ({ language: s.language }),
    }
  )
);
