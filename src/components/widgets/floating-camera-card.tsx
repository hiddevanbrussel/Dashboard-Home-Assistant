"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, floatingPositionFromElement } from "@/lib/floating-card-grid";
import { CameraCardWidget } from "./camera-card-widget";
import {
  clampCameraCardHeight,
  clampCameraCardWidth,
  resizeCameraCardFromBottomRight,
} from "@/lib/camera-card";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY = "dashboard.floatingCameraCardPosition";
const DEFAULT_OFFSET = 24;

type Position = { left: number; bottom: number };

function storageKeyForScope(scope: string | undefined, widgetId?: string): string {
  if (widgetId) return scope ? `${STORAGE_KEY}.${scope}.${widgetId}` : `${STORAGE_KEY}.${widgetId}`;
  return scope ? `${STORAGE_KEY}.${scope}` : STORAGE_KEY;
}

function loadPosition(scope: string | undefined, widgetId?: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(storageKeyForScope(scope, widgetId));
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - 270 };
    }
  } catch {
    // ignore
  }
  return null;
}

function savePosition(scope: string | undefined, p: Position, widgetId?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKeyForScope(scope, widgetId), JSON.stringify(p));
  } catch {
    // ignore
  }
}


function safeReleasePointerCapture(el: HTMLElement | null, pointerId: number) {
  if (!el || typeof el.releasePointerCapture !== "function") return;
  if (typeof el.hasPointerCapture === "function" && !el.hasPointerCapture(pointerId)) return;
  try {
    el.releasePointerCapture(pointerId);
  } catch {
    // ignore — already released or invalid id
  }
}

function defaultPosition(cardWidth: number, cardHeight: number, widgetId?: string): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  const maxLeft = Math.max(0, window.innerWidth - cardWidth);
  const maxBottom = Math.max(0, window.innerHeight - cardHeight);
  // Stagger multiple cameras so they do not stack and cover the whole dashboard.
  let hash = 0;
  if (widgetId) {
    for (let i = 0; i < widgetId.length; i++) hash = (hash * 31 + widgetId.charCodeAt(i)) | 0;
  }
  const slot = Math.abs(hash) % 4;
  const ox = (slot % 2) * Math.min(80, Math.floor(maxLeft * 0.15));
  const oy = Math.floor(slot / 2) * Math.min(80, Math.floor(maxBottom * 0.15));
  return {
    left: Math.max(0, Math.min(maxLeft, maxLeft / 2 + ox - 40)),
    bottom: Math.max(DEFAULT_OFFSET, Math.min(maxBottom, maxBottom / 2 + oy - 40)),
  };
}

const LONG_PRESS_MS = 500;

export function FloatingCameraCard({
  title,
  entity_id,
  refresh = 10,
  show_title = true,
  width,
  height,
  editMode = false,
  storageScope,
  widgetId,
  onRemove,
  onEdit,
  onEnterEditMode,
  onResize,
}: {
  title: string;
  entity_id: string;
  refresh?: number;
  show_title?: boolean;
  width?: number;
  height?: number;
  editMode?: boolean;
  /** Dashboard/room id so position is stored per page. */
  storageScope?: string;
  /** Unieke id van de widget (nodig bij meerdere camera-kaarten voor aparte posities). */
  widgetId?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}) {
  const { t } = useTranslation();
  const cardWidth = clampCameraCardWidth(width);
  const cardHeight = clampCameraCardHeight(height);
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const totalWidth = liveSize?.width ?? cardWidth;
  const totalHeight = liveSize?.height ?? cardHeight;
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope, widgetId) ?? { left: 0, bottom: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardElRef = useRef<HTMLDivElement | null>(null);

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (e: React.PointerEvent) => {
      if (editMode || !onEnterEditMode) return;
      if ((e.target as HTMLElement)?.closest?.("button, a, [role=button], input, select, textarea")) return;
      // #region agent log
      fetch('/api/debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'A',location:'floating-camera-card.tsx:startLongPress',message:'long-press pointerdown (no capture)',data:{pointerId:e.pointerId,targetTag:(e.target as HTMLElement)?.tagName,width:totalWidth,height:totalHeight,left:position.left,bottom:position.bottom},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
      // #endregion
      clearLongPress();
      // Do not setPointerCapture here — capturing on a large camera card redirects
      // all dashboard pointer events to this element until release, which makes the
      // whole dashboard feel dead if release is delayed or missed.
      const pointerId = e.pointerId;
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        // #region agent log
        fetch('/api/debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'A',location:'floating-camera-card.tsx:longPressFire',message:'long-press fired enterEditMode',data:{pointerId},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
        // #endregion
        safeReleasePointerCapture(cardElRef.current, pointerId);
        onEnterEditMode();
      }, LONG_PRESS_MS);
    },
    [editMode, onEnterEditMode, clearLongPress, totalWidth, totalHeight, position.left, position.bottom]
  );

  const endLongPress = useCallback(
    (e: React.PointerEvent) => {
      // #region agent log
      const el = e.currentTarget as HTMLElement;
      const has = typeof el.hasPointerCapture === 'function' ? el.hasPointerCapture(e.pointerId) : null;
      fetch('/api/debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'A',location:'floating-camera-card.tsx:endLongPress',message:'long-press end/release',data:{pointerId:e.pointerId,type:e.type,hasCapture:has},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
      // #endregion
      safeReleasePointerCapture(e.currentTarget as HTMLElement, e.pointerId);
      clearLongPress();
    },
    [clearLongPress]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope, widgetId);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(totalWidth, totalHeight, widgetId), bounds);
    setPosition(p);
    savePosition(storageScope, p, widgetId);
  }, [totalWidth, totalHeight, storageScope, widgetId]);

  useEffect(() => {
    if (!initialized.current || isResizing) return;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight : 400;
    setPosition((prev) =>
      snapToGrid(
        {
          left: Math.max(0, Math.min(prev.left, maxLeft)),
          bottom: Math.max(0, Math.min(prev.bottom, maxBottom)),
        },
        { maxLeft, maxBottom }
      )
    );
  }, [cardWidth, cardHeight, totalWidth, totalHeight, isResizing]);

  useEffect(() => {
    if (!liveSize || isResizing) return;
    if (cardWidth === liveSize.width && cardHeight === liveSize.height) setLiveSize(null);
  }, [cardWidth, cardHeight, liveSize, isResizing]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode || isResizingRef.current) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      setIsDragging(true);
      const measured = floatingPositionFromElement(e.currentTarget as HTMLElement);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        left: measured.left,
        bottom: measured.bottom,
      };
      // #region agent log
      fetch('/api/debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'A',location:'floating-camera-card.tsx:handlePointerDown',message:'drag start capture',data:{pointerId:e.pointerId,measured,totalWidth,totalHeight},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
      // #endregion
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [editMode, totalWidth, totalHeight]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [totalWidth, totalHeight]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
        const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight : 400;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(storageScope, next, widgetId);
      }
      // #region agent log
      {
        const el = e.currentTarget as HTMLElement;
        const has = typeof el.hasPointerCapture === 'function' ? el.hasPointerCapture(e.pointerId) : null;
        fetch('/api/debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'A',location:'floating-camera-card.tsx:handlePointerUp',message:'drag pointer up',data:{pointerId:e.pointerId,type:e.type,isDragging:isDraggingRef.current,hasCapture:has},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
      }
      // #endregion
      safeReleasePointerCapture(e.currentTarget as HTMLElement, e.pointerId);
    },
    [totalWidth, totalHeight, storageScope, widgetId]
  );

  const applyResizeDelta = useCallback((clientX: number, clientY: number) => {
    const start = resizeStart.current;
    const next = resizeCameraCardFromBottomRight({
      startWidth: start.width,
      startHeight: start.height,
      startLeft: start.left,
      startBottom: start.bottom,
      dx: clientX - start.x,
      dy: clientY - start.y,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1200,
      viewportHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    });
    setLiveSize({ width: next.width, height: next.height });
    setPosition({ left: next.left, bottom: next.bottom });
    return next;
  }, []);

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = false;
      setIsDragging(false);
      isResizingRef.current = true;
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: totalWidth,
        height: totalHeight,
        left: position.left,
        bottom: position.bottom,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [editMode, totalWidth, totalHeight, position.left, position.bottom]
  );

  const handleResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizingRef.current) return;
      applyResizeDelta(e.clientX, e.clientY);
    },
    [applyResizeDelta]
  );

  const handleResizePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isResizingRef.current) {
        const next = applyResizeDelta(e.clientX, e.clientY);
        isResizingRef.current = false;
        setIsResizing(false);
        setPosition({ left: next.left, bottom: next.bottom });
        savePosition(storageScope, { left: next.left, bottom: next.bottom }, widgetId);
        onResize?.({ width: next.width, height: next.height });
        if (!onResize) setLiveSize(null);
      }
      // #region agent log
      fetch('/api/debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'A',location:'floating-camera-card.tsx:handleResizePointerUp',message:'resize pointer up',data:{pointerId:e.pointerId,type:e.type,isResizing:isResizingRef.current},timestamp:Date.now(),runId:'post-fix'})}).catch(()=>{});
      // #endregion
      safeReleasePointerCapture(e.currentTarget as HTMLElement, e.pointerId);
    },
    [applyResizeDelta, storageScope, widgetId, onResize]
  );

  // #region agent log
  useEffect(() => {
    try {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
      const coverPct = vw && vh ? Math.round(100 * (totalWidth * totalHeight) / (vw * vh)) : null;
      fetch('/api/debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hypothesisId:'B',location:'floating-camera-card.tsx:renderSize',message:'camera card geometry',data:{widgetId,editMode,isDragging,isResizing,totalWidth,totalHeight,left:position.left,bottom:position.bottom,vw,vh,coverPct,touchNone:!editMode && !!onEnterEditMode},timestamp:Date.now()})}).catch(()=>{})
    } catch {}
  }, [widgetId, editMode, isDragging, isResizing, totalWidth, totalHeight, position.left, position.bottom, onEnterEditMode]);
  // #endregion

  return (
    <div
      ref={cardElRef}
      className={cn(
        "card-plot-in fixed z-40",
        editMode && !isResizing && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && !isResizing && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
        height: totalHeight,
        ...(!editMode && onEnterEditMode ? { touchAction: "none" } : {}),
      }}
      {...(!editMode &&
        onEnterEditMode && {
          onPointerDown: startLongPress,
          onPointerUp: endLongPress,
          onPointerLeave: endLongPress,
          onPointerCancel: endLongPress,
        })}
      {...(editMode && {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerUp,
      })}
    >
      <div
        className={cn("h-full w-full overflow-hidden rounded-2xl shadow-xl", editMode && "[&>div]:shadow-none")}
        style={{ width: totalWidth, height: totalHeight }}
      >
        <CameraCardWidget
          title={title}
          entity_id={entity_id}
          refresh={refresh}
          show_title={show_title}
          size="md"
          onMoreClick={editMode ? onEdit : undefined}
          className="h-full min-h-0"
        />
      </div>
      {editMode && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -right-2 -top-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
          aria-label={t("editPanel.remove")}
        >
          ×
        </button>
      )}
      {editMode ? (
        <button
          type="button"
          aria-label={t("cameraCard.resize")}
          className="absolute -bottom-0.5 -right-0.5 z-30 flex h-6 w-6 cursor-nwse-resize touch-none items-center justify-center rounded-md bg-white/70 shadow-sm ring-1 ring-black/[0.08] backdrop-blur-sm dark:bg-zinc-800/75 dark:ring-white/15"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onPointerCancel={handleResizePointerUp}
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-gray-500/80 dark:text-white/55" aria-hidden>
            <path
              d="M3.5 10.5h7M10.5 3.5v7M6 10.5h4.5M10.5 6v4.5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
