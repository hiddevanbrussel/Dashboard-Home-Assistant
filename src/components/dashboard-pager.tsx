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
    y: number;
    left: number;
    fromPage: number;
    claimed: boolean;
    target: EventTarget | null;
  } | null>(null);
  const suppressClickRef = useRef(false);

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

  useEffect(() => {
    if (pageCount < 2) return;
    let captured = false;
    let ignoreOwnCancel = false;

    const release = (pointerId: number) => {
      if (!captured) return;
      captured = false;
      try {
        document.documentElement.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (shouldIgnorePageSwipe(e.target, editMode)) return;
      const root = scrollerRef.current;
      if (!root) return;
      dragRef.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        left: root.scrollLeft,
        fromPage: pageRef.current,
        claimed: false,
        target: e.target,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      const root = scrollerRef.current;
      if (!drag || drag.id !== e.pointerId || !root) return;
      const dx = e.clientX - drag.x;
      // Same claim as Rooms: wait for horizontal travel, never drop the gesture on a diagonal start.
      if (!drag.claimed) {
        if (Math.abs(dx) < CLAIM_PX) return;
        drag.claimed = true;
        suppressClickRef.current = true;
        try {
          document.documentElement.setPointerCapture(e.pointerId);
          captured = true;
        } catch {
          // ignore
        }
        if (drag.target instanceof Element) {
          ignoreOwnCancel = true;
          drag.target.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true }));
          ignoreOwnCancel = false;
        }
      }
      e.preventDefault();
      root.scrollLeft = drag.left - dx;
    };

    const finish = (e: PointerEvent) => {
      if (e.type === "pointercancel" && ignoreOwnCancel) return;
      const drag = dragRef.current;
      if (!drag || drag.id !== e.pointerId) return;
      dragRef.current = null;
      release(e.pointerId);
      if (!drag.claimed) return;
      const root = scrollerRef.current;
      if (!root || root.clientWidth <= 0) return;
      pageRef.current = drag.fromPage;
      goTo(Math.round(root.scrollLeft / root.clientWidth));
    };

    const onClick = (e: MouseEvent) => {
      if (!suppressClickRef.current) return;
      suppressClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    };

    const onWheel = (e: WheelEvent) => {
      if (shouldIgnorePageSwipe(e.target, editMode)) return;
      if (Math.abs(e.deltaX) < 2 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      const root = scrollerRef.current;
      if (!root) return;
      e.preventDefault();
      root.scrollLeft += e.deltaX;
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove, { capture: true, passive: false });
    window.addEventListener("pointerup", finish, { capture: true });
    window.addEventListener("pointercancel", finish, { capture: true });
    window.addEventListener("click", onClick, true);
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", finish, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("wheel", onWheel, true);
    };
  }, [editMode, goTo, pageCount]);

  if (!mounted || typeof document === "undefined") return null;

  const showChrome = pageCount > 1 || editMode;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-30" style={{ overscrollBehaviorX: "none" }}>
      <div
        ref={scrollerRef}
        data-dashboard-pager
        className={cn(
          "flex h-full w-full min-w-0 overflow-y-hidden outline-none scrollbar-hide overscroll-x-contain",
          pageCount > 1 && "snap-x snap-mandatory overflow-x-auto touch-pan-x"
        )}
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
