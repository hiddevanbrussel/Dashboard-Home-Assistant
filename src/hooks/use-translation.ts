"use client";

import { useCallback } from "react";
import { useLanguageStore } from "@/stores/language-store";
import { getTranslations } from "@/lib/i18n";

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const t = useCallback(
    (key: string): string => {
      const dict = getTranslations(language);
      return dict[key] ?? key;
    },
    [language]
  );
  return { t, language };
}
