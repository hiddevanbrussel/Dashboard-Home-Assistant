"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { VacuumControlView } from "@/components/vacuum/vacuum-control-view";
import { useTranslation } from "@/hooks/use-translation";

export function VacuumBottomSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80]"
      role="dialog"
      aria-modal="true"
      aria-label={t("vacuum.title")}
      data-no-page-swipe
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] dark:bg-black/55"
        aria-label={t("vacuum.close")}
        onClick={onClose}
      />
      <div className="animate-music-bar-in absolute inset-x-0 bottom-0 flex h-[min(92dvh,920px)] max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] border border-white/50 bg-white shadow-[0_-18px_60px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_-18px_60px_rgba(0,0,0,0.55)]">
        <div className="flex shrink-0 justify-center pb-1 pt-3">
          <span className="h-1.5 w-12 rounded-full bg-black/15 dark:bg-white/20" aria-hidden />
        </div>
        <VacuumControlView variant="sheet" onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}
