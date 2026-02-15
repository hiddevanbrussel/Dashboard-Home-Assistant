"use client";

import { useLanguageStore } from "@/stores/language-store";
import { getTranslations } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const t = (key: string): string => {
    const dict = getTranslations(language);
    return dict[key] ?? key;
  };
  return { t, language };
}
