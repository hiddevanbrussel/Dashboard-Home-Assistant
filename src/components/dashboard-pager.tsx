"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { SIDEBAR_INSET } from "@/components/layout/sidebar";
import {
  applyDashboardPageDrag,
  DASHBOARD_MAX_PAGES,
  settleDashboardPage,
  velocityFromPointerSamples,
} from "@/lib/dashboard-pages";

const SETTLE_MS = 520;
const SETTLE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

type DashboardPagerProps = {
  pageCount: number;
  page: number;
  onPageChange: (page: number) => void;
  editMode?: boolean;
  onAddPage?: () => void;
  onRemovePage?: () => void;
  children: (pageIndex: number) => React.ReactNode;
};

function shouldIgnorePageSwipe(target: EventTarget | null, editMode: boolean): boolean {
  const el = target instanceof HTMLElement ? target : null;
  if (!el) return true;
  if (el.closest("button, a, input, textarea, select, [data-no-page-swipe], [data-dashboard-pager-ui]")) {
    return true;
  }
  if (el.closest("[data-app-sidebar], [data-app-header]")) return true;
  if (editMode && !el.closest("[data-dashboard-page-swipe]")) return true;
  return false;
}

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
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [pageWidth, setPageWidth] = useState(1200);
  const dragPxRef = useRef(0);
  const draggingRef = useRef(false);
  const pageRef = useRef(page);
  const pageCountRef = useRef(pageCount);
  const wheelLockRef = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    pageCountRef.current = pageCount;
  }, [pageCount]);

  useEffect(() => {
    const measure = () => setPageWidth(window.innerWidth || 1200);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(pageCountRef.current - 1, Math.max(0, next));
      onPageChange(clamped);
    },
    [onPageChange]
  );

  useEffect(() => {
    const start = { x: 0, y: 0, pointerId: -1 };
    const samples: { x: number; t: number }[] = [];

    const onPointerDown = (e: PointerEvent) => {
      if (pageCountRef.current < 2) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (shouldIgnorePageSwipe(e.target, editMode)) return;
      start.x = e.clientX;
      start.y = e.clientY;
      start.pointerId = e.pointerId;
      const now = performance.now();
      samples.length = 0;
      samples.push({ x: e.clientX, t: now });
      draggingRef.current = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (start.pointerId !== e.pointerId) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!draggingRef.current) {
        if (Math.abs(dx) < 16 && Math.abs(dy) < 16) return;
        if (Math.abs(dy) >= Math.abs(dx)) {
          start.pointerId = -1;
          return;
        }
        draggingRef.current = true;
        setDragging(true);
      }
      e.preventDefault();
      const now = performance.now();
      samples.push({ x: e.clientX, t: now });
      while (samples.length > 1 && now - samples[0].t > 120) samples.shift();
      const next = applyDashboardPageDrag({
        page: pageRef.current,
        pageCount: pageCountRef.current,
        dragPx: dx,
        pageWidth: window.innerWidth || 1200,
      });
      dragPxRef.current = next;
      setDragPx(next);
    };

    const finish = (e: PointerEvent) => {
      if (start.pointerId !== e.pointerId) return;
      start.pointerId = -1;
      if (!draggingRef.current) return;
      const now = performance.now();
      const velocity = velocityFromPointerSamples(samples, e.clientX, now);
      const nextPage = settleDashboardPage({
        page: pageRef.current,
        pageCount: pageCountRef.current,
        dragPx: dragPxRef.current,
        velocityPxPerMs: velocity,
        pageWidth: window.innerWidth || 1200,
      });
      draggingRef.current = false;
      setDragging(false);
      setDragPx(0);
      dragPxRef.current = 0;
      goTo(nextPage);
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove, { capture: true, passive: false });
    window.addEventListener("pointerup", finish, { capture: true });
    window.addEventListener("pointercancel", finish, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", finish, true);
    };
  }, [editMode, goTo]);

  useEffect(() => {
    if (pageCount < 2) return;
    const onWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) return;
      if (shouldIgnorePageSwipe(e.target, editMode)) return;
      if (Math.abs(e.deltaX) < 28 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      wheelLockRef.current = true;
      goTo(pageRef.current + (e.deltaX > 0 ? 1 : -1));
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, SETTLE_MS);
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, true);
  }, [editMode, goTo, pageCount]);

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

  if (!mounted || typeof document === "undefined") return null;

  const showChrome = pageCount > 1 || editMode;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {Array.from({ length: pageCount }, (_, index) => {
        const x = (index - page) * pageWidth + dragPx;
        const visible = Math.abs(index - page) <= 1 || dragging;
        return (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              transform: `translate3d(${x}px, 0, 0)`,
              transition: dragging ? "none" : `transform ${SETTLE_MS}ms ${SETTLE_EASING}`,
              pointerEvents: "none",
              visibility: visible ? "visible" : "hidden",
              willChange: "transform",
            }}
            aria-hidden={index !== page}
          >
            {index === page ? (
              <div
                data-dashboard-page-swipe
                className="absolute inset-0"
                style={{
                  left: SIDEBAR_INSET,
                  top: "4.5rem",
                  pointerEvents: editMode ? "auto" : "none",
                }}
                aria-hidden
              />
            ) : null}
            {children(index)}
          </div>
        );
      })}

      {showChrome ? (
        <div
          data-dashboard-pager-ui
          className="pointer-events-none absolute bottom-5 z-40 flex justify-center"
          style={{ left: SIDEBAR_INSET, right: 0 }}
        >
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/80 px-2 py-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06] backdrop-blur-md dark:bg-zinc-900/80 dark:ring-white/10">
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
                      ? "w-5 bg-gray-800 dark:bg-white"
                      : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-white/30 dark:hover:bg-white/50"
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
