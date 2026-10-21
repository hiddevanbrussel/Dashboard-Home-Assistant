"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/hooks/use-translation";

type DashboardPageUndoToastViewProps = {
  message: string;
  undoLabel: string;
  onUndo: () => void;
};

/**
 * Same chrome as the notification toast (rounded card, blur, light/dark),
 * with an undo action instead of a dismiss icon. It sits under the header
 * so the page bar and resize handles stay clear.
 */
export function DashboardPageUndoToastView({
  message,
  undoLabel,
  onUndo,
}: DashboardPageUndoToastViewProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-20 z-[200] flex justify-center px-3"
      data-dashboard-page-undo
    >
      <div
        role="status"
        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/80"
      >
        <p className="min-w-0 flex-1 text-sm font-semibold text-gray-900 dark:text-white">{message}</p>
        <button
          type="button"
          onClick={onUndo}
          className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
        >
          {undoLabel}
        </button>
      </div>
    </div>
  );
}

export function DashboardPageUndoToast({ open, onUndo }: { open: boolean; onUndo: () => void }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!open || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <DashboardPageUndoToastView
      message={t("dashboardPages.removed")}
      undoLabel={t("dashboardPages.undo")}
      onUndo={onUndo}
    />,
    document.body
  );
}
