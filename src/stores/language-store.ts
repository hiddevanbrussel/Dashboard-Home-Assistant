import { create } from "zustand";
import { persist } from "zustand/middleware";
import { languageCookie, parseLanguage, type Language } from "@/lib/language";

export type { Language } from "@/lib/language";

function getDefaultLanguage(): Language {
  return parseLanguage(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE) ?? "en";
}

type LanguageStore = {
  language: Language;
  /**
   * False until LanguageBootstrap has settled the language after mount. Until then
   * useTranslation renders the server's language, so hydration matches (#278).
   */
  ready: boolean;
  setLanguage: (lang: Language) => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: getDefaultLanguage(),
      ready: false,
      setLanguage: (language) => {
        set({ language, ready: true });
        if (typeof document !== "undefined") {
          document.cookie = languageCookie(language);
          document.documentElement.lang = language;
        }
      },
    }),
    {
      name: "dashboard-language",
      partialize: (s) => ({ language: s.language }),
      // Reading localStorage while the store is created would change the first client render.
      skipHydration: true,
    }
  )
);
