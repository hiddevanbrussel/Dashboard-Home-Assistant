"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { SIDEBAR_INSET } from "@/components/layout/sidebar";
import { DASHBOARD_MAX_PAGES } from "@/lib/dashboard-pages";
import {
  DASHBOARD_EDIT_BAR_HEIGHT_PX,
  DASHBOARD_EDIT_BAR_LEGACY_OFFSET_PX,
} from "@/lib/dashboard-edit-bar";

type DashboardEditBarProps = {
  pageCount: number;
  page: number;
  editMode?: boolean;
  onAddPage?: () => void;
  onRemovePage?: () => void;
  onSelectPage: (page: number) => void;
};

/**
 * Page controls under the dashboard. Outside edit mode the cluster keeps
 * main's `bottom-5` position. In edit mode the bar is 28px tall at `bottom: 0`
 * and only the buttons take hits, so it stays under a bottom tile's resize handle.
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

  const dots = (
    <div
      className={cn("flex items-center gap-1.5 px-1", editMode && "pointer-events-none")}
      style={editMode ? { pointerEvents: "none" } : undefined}
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
          style={editMode ? { pointerEvents: "auto" } : undefined}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            editMode && "pointer-events-auto",
            index === page
              ? "w-5 bg-brand"
              : "w-2 bg-black/25 hover:bg-black/40 dark:bg-white/35 dark:hover:bg-white/55"
          )}
        />
      ))}
    </div>
  );

  if (!editMode) {
    return (
      <div
        data-dashboard-pager-ui
        className="pointer-events-none absolute bottom-5 z-[80] flex justify-center"
        style={{
          left: SIDEBAR_INSET,
          right: 0,
          bottom: DASHBOARD_EDIT_BAR_LEGACY_OFFSET_PX,
          pointerEvents: "none",
        }}
      >
        <div className="pointer-events-auto flex items-center gap-2" style={{ pointerEvents: "auto" }}>
          {dots}
        </div>
      </div>
    );
  }

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
        {onRemovePage ? (
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
        {dots}
        {onAddPage ? (
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
