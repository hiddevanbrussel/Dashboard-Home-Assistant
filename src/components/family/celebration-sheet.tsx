"use client";

import { createPortal } from "react-dom";
import { CelebrationArt } from "./task-art";

export type CelebrationState = {
  points: number;
  title: string;
  childName: string;
};

export function CelebrationSheet({
  celebration,
  onClose,
  t,
}: {
  celebration: CelebrationState | null;
  onClose: () => void;
  t: (key: string) => string;
}) {
  if (!celebration || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t("family.greatJob")}>
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-label={t("family.getIt")} onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[2rem] bg-white px-6 pb-6 pt-8 text-center shadow-2xl dark:bg-gray-900">
        <div className="mx-auto h-40 w-56">
          <CelebrationArt />
        </div>
        <h2 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">{t("family.greatJob")}</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t("family.greatJobBody").replace("{n}", String(celebration.points)).replace("{task}", celebration.title).replace("{name}", celebration.childName)}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-gray-900 py-3.5 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-gray-900"
        >
          {t("family.getIt")}
        </button>
      </div>
    </div>,
    document.body
  );
}
