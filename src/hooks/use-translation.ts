"use client";

import { useCallback, useContext } from "react";
import { useLanguageStore } from "@/stores/language-store";
import { ServerLanguageContext } from "@/components/language-bootstrap";
import { getTranslations } from "@/lib/i18n";

/** Until LanguageBootstrap has run, render the server's language so hydration matches (#278). */
export function useActiveLanguage() {
  const serverLanguage = useContext(ServerLanguageContext);
  const storeLanguage = useLanguageStore((s) => s.language);
  const ready = useLanguageStore((s) => s.ready);
  return ready || !serverLanguage ? storeLanguage : serverLanguage;
}

export function useTranslation() {
  const language = useActiveLanguage();
  const t = useCallback(
    (key: string): string => {
      const dict = getTranslations(language);
      return dict[key] ?? key;
    },
    [language]
  );
  return { t, language };
}
