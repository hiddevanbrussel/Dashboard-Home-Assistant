"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { SIDEBAR_INSET } from "@/components/layout/sidebar";
import { DASHBOARD_MAX_PAGES } from "@/lib/dashboard-pages";
import { DASHBOARD_EDIT_BAR_HEIGHT_PX } from "@/lib/dashboard-edit-bar";

type DashboardEditBarProps = {
  pageCount: number;
  page: number;
  editMode?: boolean;
  onAddPage?: () => void;
  onRemovePage?: () => void;
  onSelectPage: (page: number) => void;
};

/**
 * Page controls pinned to the viewport bottom. The wrapper does not take
 * hits — only the buttons do — and the bar is 28px tall at `bottom: 0` so it
 * stays under the resize handle of a tile at `bottom: 32px`.
 */
export function DashboardEditBar({
  pageCount,
  page,
  editMode = false,
  onAddPage,
  onRemovePage,
  onSelectPage,
}: DashboardEditBarProps) {
  const { t } = useTranslation();

  return (
    <div
      data-dashboard-pager-ui
      className="pointer-events-none absolute z-[80] flex items-center justify-center"
      style={{
        position: "absolute",
        left: SIDEBAR_INSET,
        right: 0,
        bottom: 0,
        height: DASHBOARD_EDIT_BAR_HEIGHT_PX,
        pointerEvents: "none",
      }}
    >
      <div
        className="pointer-events-none flex h-7 items-center gap-2"
        style={{ pointerEvents: "none", height: DASHBOARD_EDIT_BAR_HEIGHT_PX }}
      >
        {editMode && onRemovePage ? (
          <button
            type="button"
            onClick={onRemovePage}
            disabled={pageCount <= 1}
            style={{ pointerEvents: "auto" }}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black/5 disabled:opacity-30 dark:text-white/60 dark:hover:bg-white/10"
            aria-label={t("dashboardPages.remove")}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        ) : null}
        <div
          className="pointer-events-none flex items-center gap-1.5 px-1"
          style={{ pointerEvents: "none" }}
          role="tablist"
          aria-label={t("dashboardPages.pages")}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === page}
              aria-label={t("dashboardPages.pageN").replace("{n}", String(index + 1))}
              onClick={() => onSelectPage(index)}
              style={{ pointerEvents: "auto" }}
              className={cn(
                "pointer-events-auto h-2 rounded-full transition-all duration-300",
                index === page
                  ? "w-5 bg-brand"
                  : "w-2 bg-black/25 hover:bg-black/40 dark:bg-white/35 dark:hover:bg-white/55"
              )}
            />
          ))}
        </div>
        {editMode && onAddPage ? (
          <button
            type="button"
            onClick={onAddPage}
            disabled={pageCount >= DASHBOARD_MAX_PAGES}
            style={{ pointerEvents: "auto" }}
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black/5 disabled:opacity-30 dark:text-white/60 dark:hover:bg-white/10"
            aria-label={t("dashboardPages.add")}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
