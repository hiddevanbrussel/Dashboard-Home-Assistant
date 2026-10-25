"use client";

import { createContext, useEffect, type ReactNode } from "react";
import { useLanguageStore } from "@/stores/language-store";
import { readPersistedLanguage, type Language } from "@/lib/language";

/** The language the server rendered with; used until the store is ready. */
export const ServerLanguageContext = createContext<Language | null>(null);

/**
 * Renders children with the server's language, then settles the store after mount:
 * the cookie when the server had one, otherwise the choice saved in localStorage by
 * older versions (written to the cookie from then on), otherwise the server default.
 */
export function LanguageBootstrap({
  language,
  fromCookie,
  children,
}: {
  language: Language;
  fromCookie: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    const store = useLanguageStore.getState();
    if (store.ready) return;
    let stored: Language | null = null;
    try {
      stored = readPersistedLanguage(window.localStorage.getItem(useLanguageStore.persist.getOptions().name ?? ""));
    } catch {
      stored = null;
    }
    store.setLanguage(fromCookie ? language : stored ?? language);
  }, [language, fromCookie]);

  return <ServerLanguageContext.Provider value={language}>{children}</ServerLanguageContext.Provider>;
}
