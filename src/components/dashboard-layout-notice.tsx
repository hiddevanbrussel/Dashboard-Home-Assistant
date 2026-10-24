"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX } from "@/components/dashboard-page-undo-toast";

type DashboardLayoutNoticeViewProps = {
  message: string;
  onDismiss: () => void;
};

/** One line, same bottom offset as the page-removal undo toast. */
export function DashboardLayoutNoticeView({ message, onDismiss }: DashboardLayoutNoticeViewProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 z-[200] flex justify-center px-3"
      data-dashboard-layout-notice
      style={{ bottom: DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX }}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="pointer-events-auto flex h-11 max-w-full items-center whitespace-nowrap rounded-2xl border border-white/60 bg-white/95 px-4 text-sm font-semibold text-gray-900 shadow-lg dark:border-white/10 dark:bg-[#1b1a21] dark:text-white"
      >
        {message}
      </button>
    </div>
  );
}

export function DashboardLayoutNotice({ message, onDismiss }: DashboardLayoutNoticeViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <DashboardLayoutNoticeView message={message} onDismiss={onDismiss} />,
    document.body
  );
}
