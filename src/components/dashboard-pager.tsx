"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { SIDEBAR_INSET } from "@/components/layout/sidebar";
import {
  DASHBOARD_MAX_PAGES,
  dashboardPagerHistoryStep,
  historyHasDashboardPager,
  shouldConsumeHistoryBack,
  shouldIgnorePageSwipe,
} from "@/lib/dashboard-pages";

const CLAIM_PX = 12;

type DashboardPagerProps = {
  pageCount: number;
  page: number;
  onPageChange: (page: number) => void;
  editMode?: boolean;
  onAddPage?: () => void;
  onRemovePage?: () => void;
  children: (pageIndex: number) => React.ReactNode;
};

export function DashboardPager({
  pageCount,
  page,
  onPageChange,
  editMode = false,
  onAddPage,
  onRemovePage,
  children,
}: DashboardPagerProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(page);
  const pageCountRef = useRef(pageCount);
  const syncingHistoryRef = useRef(false);
  const dragRef = useRef<{
    id: number;
    x: number;
    left: number;
    fromPage: number;
    claimed: boolean;
  } | null>(null);
  const claimedRef = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    pageCountRef.current = pageCount;
  }, [pageCount]);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth", options?: { fromHistory?: boolean }) => {
      const max = Math.max(0, pageCountRef.current - 1);
      const clamped = Math.max(0, Math.min(max, index));
      const from = pageRef.current;
      pageRef.current = clamped;
      onPageChange(clamped);
      const root = scrollerRef.current;
      if (root && root.clientWidth > 0) {
        root.scrollTo({ left: clamped * root.clientWidth, behavior });
      }
      if (options?.fromHistory || clamped === from) return;
      const historyStep = dashboardPagerHistoryStep(from, clamped);
      if (historyStep === "push") {
        history.pushState({ dashboardPager: clamped }, "");
      } else if (historyStep === "back" && historyHasDashboardPager(history.state)) {
        syncingHistoryRef.current = true;
        history.back();
      }
    },
    [onPageChange]
  );

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !mounted || root.clientWidth <= 0) return;
    root.scrollTo({ left: pageRef.current * root.clientWidth, behavior: "auto" });
  }, [mounted, pageCount]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const onResize = () => {
      root.scrollTo({ left: pageRef.current * root.clientWidth, behavior: "auto" });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (pageCount < 2) return;
    const onPopState = () => {
      if (syncingHistoryRef.current) {
        syncingHistoryRef.current = false;
        return;
      }
      if (!shouldConsumeHistoryBack(pageRef.current)) return;
      goTo(pageRef.current - 1, "smooth", { fromHistory: true });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pageCount, goTo]);

  useEffect(() => {
    if (pageCount < 2) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("input, textarea, select, [contenteditable=true]")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(pageRef.current + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(pageRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, pageCount]);

  const onScrollerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pageCount < 2 || editMode) return;
    if (e.button !== 0) return;
    if (shouldIgnorePageSwipe(e.target, editMode)) return;
    claimedRef.current = false;
    dragRef.current = {
      id: e.pointerId,
      x: e.clientX,
      left: e.currentTarget.scrollLeft,
      fromPage: pageRef.current,
      claimed: false,
    };
  };

  const onScrollerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const root = e.currentTarget;
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    if (!drag.claimed && Math.abs(dx) < CLAIM_PX) return;
    if (!drag.claimed) {
      drag.claimed = true;
      claimedRef.current = true;
      root.setPointerCapture(e.pointerId);
    }
    root.scrollLeft = drag.left - dx;
  };

  const onScrollerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.claimed) return;
    const root = e.currentTarget;
    if (root.clientWidth <= 0) return;
    pageRef.current = drag.fromPage;
    goTo(Math.round(root.scrollLeft / root.clientWidth));
  };

  const onScrollerPointerCancel = () => {
    dragRef.current = null;
  };

  if (!mounted || typeof document === "undefined") return null;

  const showChrome = pageCount > 1 || editMode;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-30" style={{ overscrollBehaviorX: "none" }}>
      <div
        ref={scrollerRef}
        data-dashboard-pager
        tabIndex={pageCount > 1 ? 0 : undefined}
        className={cn(
          "flex h-full w-full min-w-0 overflow-y-hidden outline-none scrollbar-hide overscroll-x-contain",
          (pageCount > 1 || editMode) && "pointer-events-auto",
          pageCount > 1 && !editMode &&
            "cursor-grab snap-x snap-mandatory overflow-x-auto touch-pan-x active:cursor-grabbing",
          (pageCount < 2 || editMode) && "overflow-x-hidden"
        )}
        onPointerDown={onScrollerPointerDown}
        onPointerMove={onScrollerPointerMove}
        onPointerUp={onScrollerPointerUp}
        onPointerCancel={onScrollerPointerCancel}
        onClickCapture={(e) => {
          if (!claimedRef.current) return;
          claimedRef.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        onScroll={(e) => {
          const root = e.currentTarget;
          if (root.clientWidth <= 0) return;
          const next = Math.round(root.scrollLeft / root.clientWidth);
          if (next !== pageRef.current) {
            pageRef.current = next;
            onPageChange(next);
          }
        }}
      >
        {Array.from({ length: pageCount }, (_, index) => (
          <section
            key={index}
            data-dashboard-page
            data-dashboard-page-swipe={index === page ? true : undefined}
            className="relative box-border h-full w-full min-w-full shrink-0 basis-full snap-start"
            aria-hidden={index !== page}
          >
            {children(index)}
          </section>
        ))}
      </div>

      {showChrome ? (
        <div
          data-dashboard-pager-ui
          className="pointer-events-none absolute bottom-5 z-[80] flex justify-center"
          style={{ left: SIDEBAR_INSET, right: 0 }}
        >
          <div className="pointer-events-auto flex items-center gap-2">
            {editMode && onRemovePage ? (
              <button
                type="button"
                onClick={onRemovePage}
                disabled={pageCount <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black/5 disabled:opacity-30 dark:text-white/60 dark:hover:bg-white/10"
                aria-label={t("dashboardPages.remove")}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <div className="flex items-center gap-1.5 px-1" role="tablist" aria-label={t("dashboardPages.pages")}>
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === page}
                  aria-label={t("dashboardPages.pageN").replace("{n}", String(index + 1))}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
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
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black/5 disabled:opacity-30 dark:text-white/60 dark:hover:bg-white/10"
                aria-label={t("dashboardPages.add")}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>,
    document.body
  );
}
