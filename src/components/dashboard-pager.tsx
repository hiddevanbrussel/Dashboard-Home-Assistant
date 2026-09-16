"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { SIDEBAR_INSET } from "@/components/layout/sidebar";
import {
  applyDashboardPageDrag,
  DASHBOARD_MAX_PAGES,
  dashboardPageSettleDurationMs,
  pageSwipeClaimPx,
  settleDashboardPage,
  shouldIgnorePageSwipe,
  velocityFromPointerSamples,
} from "@/lib/dashboard-pages";

const WHEEL_LOCK_MS = 420;

type DashboardPagerProps = {
  pageCount: number;
  page: number;
  onPageChange: (page: number) => void;
  editMode?: boolean;
  onAddPage?: () => void;
  onRemovePage?: () => void;
  children: (pageIndex: number) => React.ReactNode;
};

function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 3);
}

function viewportWidth(): number {
  if (typeof window === "undefined") return 1200;
  return window.innerWidth || 1200;
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
  const [animTarget, setAnimTarget] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState(1200);
  const dragPxRef = useRef(0);
  const draggingRef = useRef(false);
  const pageRef = useRef(page);
  const pageCountRef = useRef(pageCount);
  const wheelLockRef = useRef(false);
  const animatingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    pageCountRef.current = pageCount;
  }, [pageCount]);
  useEffect(() => {
    const measure = () => setPageWidth(viewportWidth());
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const stopAnimation = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    animatingRef.current = false;
    setAnimTarget(null);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(pageCountRef.current - 1, Math.max(0, next));
      const from = pageRef.current;
      const startDrag = dragPxRef.current;
      const width = viewportWidth();
      const endDrag = clamped === from ? 0 : (from - clamped) * width;
      if (clamped === from && Math.abs(startDrag) < 0.5) return;
      stopAnimation();
      animatingRef.current = true;
      setAnimTarget(clamped === from ? null : clamped);
      setDragging(false);
      draggingRef.current = false;
      const t0 = performance.now();
      const duration = dashboardPageSettleDurationMs(endDrag - startDrag);
      const step = (now: number) => {
        const t = easeOutCubic((now - t0) / duration);
        const px = startDrag + (endDrag - startDrag) * t;
        dragPxRef.current = px;
        setDragPx(px);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
          return;
        }
        rafRef.current = null;
        flushSync(() => {
          pageRef.current = clamped;
          dragPxRef.current = 0;
          setDragPx(0);
          animatingRef.current = false;
          setAnimTarget(null);
          if (clamped !== from) onPageChange(clamped);
        });
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [onPageChange, stopAnimation]
  );

  useEffect(() => {
    const start = { x: 0, y: 0, drag: 0, pointerId: -1 };
    const samples: { x: number; t: number }[] = [];
    let suppressClick = false;
    let captured = false;

    const releaseCapture = (pointerId: number) => {
      if (!captured) return;
      captured = false;
      try {
        document.documentElement.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (pageCountRef.current < 2) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (shouldIgnorePageSwipe(e.target, editMode)) return;
      const resume = animatingRef.current;
      if (resume) stopAnimation();
      start.x = e.clientX;
      start.y = e.clientY;
      start.drag = dragPxRef.current;
      start.pointerId = e.pointerId;
      const now = performance.now();
      samples.length = 0;
      samples.push({ x: e.clientX, t: now });
      draggingRef.current = resume;
      if (resume) setDragging(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (start.pointerId !== e.pointerId) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!draggingRef.current) {
        const claimPx = pageSwipeClaimPx(e.pointerType);
        if (Math.abs(dx) < claimPx && Math.abs(dy) < claimPx) return;
        if (Math.abs(dy) >= Math.abs(dx)) {
          start.pointerId = -1;
          return;
        }
        draggingRef.current = true;
        setDragging(true);
        try {
          document.documentElement.setPointerCapture(e.pointerId);
          captured = true;
        } catch {
          // ignore
        }
      }
      e.preventDefault();
      const now = performance.now();
      samples.push({ x: e.clientX, t: now });
      while (samples.length > 1 && now - samples[0].t > 120) samples.shift();
      const next = applyDashboardPageDrag({
        page: pageRef.current,
        pageCount: pageCountRef.current,
        dragPx: start.drag + dx,
        pageWidth: viewportWidth(),
      });
      dragPxRef.current = next;
      setDragPx(next);
    };

    const finish = (e: PointerEvent) => {
      if (start.pointerId !== e.pointerId) return;
      start.pointerId = -1;
      releaseCapture(e.pointerId);
      if (!draggingRef.current) return;
      suppressClick = true;
      e.preventDefault();
      const now = performance.now();
      const velocity = velocityFromPointerSamples(samples, e.clientX, now);
      const nextPage = settleDashboardPage({
        page: pageRef.current,
        pageCount: pageCountRef.current,
        dragPx: dragPxRef.current,
        velocityPxPerMs: velocity,
        pageWidth: viewportWidth(),
      });
      draggingRef.current = false;
      setDragging(false);
      goTo(nextPage);
    };

    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true, passive: false });
    window.addEventListener("pointermove", onPointerMove, { capture: true, passive: false });
    window.addEventListener("pointerup", finish, { capture: true });
    window.addEventListener("pointercancel", finish, { capture: true });
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", finish, true);
      window.removeEventListener("pointercancel", finish, true);
      window.removeEventListener("click", onClick, true);
    };
  }, [editMode, goTo, stopAnimation]);

  useEffect(() => {
    if (pageCount < 2) return;
    const onWheel = (e: WheelEvent) => {
      if (wheelLockRef.current || animatingRef.current) return;
      if (shouldIgnorePageSwipe(e.target, editMode)) return;
      if (Math.abs(e.deltaX) < 28 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      wheelLockRef.current = true;
      goTo(pageRef.current + (e.deltaX > 0 ? 1 : -1));
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, WHEEL_LOCK_MS);
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, true);
  }, [editMode, goTo, pageCount]);

  useEffect(() => {
    if (pageCount < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (animatingRef.current) return;
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
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" style={{ overscrollBehaviorX: "none" }}>
      {Array.from({ length: pageCount }, (_, index) => {
        const active = index === page;
        const visible =
          active || index === animTarget || ((dragging || Math.abs(dragPx) > 0.5) && Math.abs(index - page) <= 1);
        const x = (index - page) * pageWidth + dragPx;
        return (
          <div
            key={index}
            className="absolute inset-0 overflow-hidden"
            style={{
              transform: `translate3d(${x}px, 0, 0)`,
              pointerEvents: "none",
              visibility: visible ? "visible" : "hidden",
              zIndex: active ? 1 : 0,
            }}
            aria-hidden={!active}
          >
            {visible ? (
              <>
                <div
                  data-dashboard-page-swipe={active ? true : undefined}
                  className="absolute inset-0 z-0"
                  style={{
                    left: SIDEBAR_INSET,
                    top: "4.5rem",
                    pointerEvents: editMode && active && pageCount > 1 ? "auto" : "none",
                  }}
                  aria-hidden
                />
                <div
                  className="relative z-[1]"
                  style={{ pointerEvents: active ? "auto" : "none" }}
                >
                  {children(index)}
                </div>
              </>
            ) : null}
          </div>
        );
      })}

      {showChrome ? (
        <div
          data-dashboard-pager-ui
          className="pointer-events-none absolute bottom-5 z-[80] flex justify-center"
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
                  aria-selected={index === (animTarget ?? page)}
                  aria-label={t("dashboardPages.pageN").replace("{n}", String(index + 1))}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === (animTarget ?? page)
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
