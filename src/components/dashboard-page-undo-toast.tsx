"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/hooks/use-translation";
import { DASHBOARD_EDIT_BAR_HEIGHT_PX } from "@/lib/dashboard-edit-bar";

/** Clearance between this toast and the top of the 28px edit bar. */
export const DASHBOARD_PAGE_UNDO_TOAST_GAP_PX = 10;

/**
 * `bottom-14` (56px) would leave 28px above the bar. 38px leaves the 10px gap.
 */
export const DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX =
  DASHBOARD_EDIT_BAR_HEIGHT_PX + DASHBOARD_PAGE_UNDO_TOAST_GAP_PX;

type DashboardPageUndoToastViewProps = {
  message: string;
  undoLabel: string;
  onUndo: () => void;
};

/**
 * Page-removal undo only. Light chrome matches the previous toast.
 * Dark chrome matches the bell panel (solid surface, no blur) and the
 * settings primary button (`--brand-muted`, white label). Notification
 * toasts keep their own classes.
 */
export function DashboardPageUndoToastView({
  message,
  undoLabel,
  onUndo,
}: DashboardPageUndoToastViewProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[200] flex justify-center px-3"
      data-dashboard-page-undo
      style={{ bottom: DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX }}
    >
      <div
        role="status"
        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#1b1a21] dark:shadow-[0_16px_40px_rgba(0,0,0,0.55)] dark:backdrop-blur-none"
      >
        <p className="min-w-0 flex-1 text-sm font-semibold text-gray-900 dark:text-white">{message}</p>
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white hover:opacity-90 dark:bg-brand-muted dark:text-white"
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
