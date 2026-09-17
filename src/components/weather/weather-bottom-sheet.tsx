"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { WeatherSheetPanel } from "@/components/weather/weather-sheet-panel";
import { useTranslation } from "@/hooks/use-translation";

export function WeatherBottomSheet({
  open,
  onClose,
  entityId,
}: {
  open: boolean;
  onClose: () => void;
  entityId: string;
}) {
  const { t } = useTranslation();
  const openedAtRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    openedAtRef.current = Date.now();
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
      className="pointer-events-auto fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label={t("weatherSheet.title")}
      data-no-page-swipe
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] dark:bg-black/50"
        aria-label={t("weatherSheet.close")}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
        <div className="animate-music-bar-in pointer-events-auto flex w-full max-w-[400px] max-h-[min(92dvh,760px)] flex-col overflow-hidden rounded-[1.75rem] bg-[#F4F6FA] shadow-[0_-18px_60px_rgba(15,23,42,0.28)] dark:bg-zinc-900 dark:shadow-[0_-18px_60px_rgba(0,0,0,0.55)]">
          <div className="flex shrink-0 justify-center pb-1 pt-3">
            <span className="h-1.5 w-12 rounded-full bg-black/15 dark:bg-white/20" aria-hidden />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <WeatherSheetPanel entityId={entityId} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
