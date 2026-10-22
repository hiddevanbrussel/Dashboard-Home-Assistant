"use client";

import { useEffect, useRef, useState } from "react";
import {
  consumeLayoutNotice,
  currentOrientation,
  floatingTilesFromWidgets,
  measuredSizeOverrides,
  readFloatingLayout,
  reconcileFloatingLayout,
  restoreBelowFoldStorage,
  revealBelowFoldTiles,
  type FloatingTile,
  type FloatingWidgetInput,
  type LayoutNotice,
  type Orientation,
} from "@/lib/floating-orientation-layout";

export type FloatingLayoutNoticeKey =
  | "dashboardLayout.landscapeOverlap"
  | "dashboardLayout.portraitBelowFold";

type Baseline = {
  positions: Record<string, string>;
  sizes: Record<string, string>;
};

type Action = {
  push: boolean;
  report: boolean;
  rederive: boolean;
  anchors: ReadonlySet<string> | undefined;
};

const IDLE_ACTION: Action = { push: false, report: false, rederive: false, anchors: undefined };

type Viewport = { width: number; height: number };

function readViewport(): Viewport {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function noticeKey(notice: LayoutNotice): FloatingLayoutNoticeKey {
  switch (notice) {
    case "landscape-overlap":
      return "dashboardLayout.landscapeOverlap";
    case "portrait-below-fold":
      return "dashboardLayout.portraitBelowFold";
    default: {
      const exhaustive: never = notice;
      return exhaustive;
    }
  }
}

function captureBaseline(tiles: readonly FloatingTile[]): Baseline {
  const positions: Record<string, string> = {};
  const sizes: Record<string, string> = {};
  for (const tile of tiles) {
    positions[tile.key] = window.localStorage.getItem(tile.key) ?? "";
    sizes[tile.key] = `${tile.w}x${tile.h}`;
  }
  return { positions, sizes };
}

function anchorsSince(baseline: Baseline | null, tiles: readonly FloatingTile[]): Set<string> {
  const anchors = new Set<string>();
  if (!baseline || typeof window === "undefined") return anchors;
  for (const tile of tiles) {
    const position = window.localStorage.getItem(tile.key) ?? "";
    const size = `${tile.w}x${tile.h}`;
    if (baseline.positions[tile.key] !== position || baseline.sizes[tile.key] !== size) anchors.add(tile.key);
  }
  return anchors;
}

function withOverrides(tiles: readonly FloatingTile[], overrides: Record<string, { w: number; h: number }>): FloatingTile[] {
  if (Object.keys(overrides).length === 0) return [...tiles];
  return tiles.map((tile) => {
    const override = overrides[tile.key];
    return override ? { ...tile, w: override.w, h: override.h } : tile;
  });
}

/**
 * Swaps the active floating-card keys when the screen rotates and builds the
 * portrait set. Widgets keep reading `dashboard.floating*`; this only runs in
 * the dashboard page, before those cards mount.
 */
export function useFloatingOrientation({
  dashboardId,
  ready,
  widgets,
  editMode,
}: {
  dashboardId: string | undefined;
  ready: boolean;
  widgets: readonly FloatingWidgetInput[];
  editMode: boolean;
}): {
  epoch: number;
  scrollOverflowPx: number;
  notice: FloatingLayoutNoticeKey | null;
  dismissNotice: () => void;
  commitEdits: () => void;
} {
  const [epoch, setEpoch] = useState(0);
  const [scrollOverflowPx, setScrollOverflowPx] = useState(0);
  const [notice, setNotice] = useState<FloatingLayoutNoticeKey | null>(null);
  const [generation, setGeneration] = useState(0);
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [sizeOverrides, setSizeOverrides] = useState<Record<string, { w: number; h: number }>>({});
  const actionRef = useRef<Action>(IDLE_ACTION);
  const baselineRef = useRef<Baseline | null>(null);
  const cardsMountedRef = useRef(false);
  const pointerDownRef = useRef(false);
  const deferredRef = useRef(false);
  const lastSigRef = useRef("");
  const orientationRef = useRef<Orientation | null>(null);
  const sizeSigRef = useRef("");
  const measuredRef = useRef(false);
  const tilesRef = useRef<FloatingTile[]>([]);

  const orientation = currentOrientation(viewport.width, viewport.height);
  const tiles = withOverrides(dashboardId ? floatingTilesFromWidgets(widgets, dashboardId) : [], sizeOverrides);
  tilesRef.current = tiles;
  const tileSig = tiles.map((tile) => `${tile.key}:${tile.page}:${tile.w}x${tile.h}`).join("|");
  const sizeSig = tiles.map((tile) => `${tile.key}:${tile.w}x${tile.h}`).join("|");
  const sig = `${dashboardId ?? ""}|${ready ? 1 : 0}|${orientation}|${viewport.width}x${viewport.height}|${tileSig}|${generation}`;

  if (
    ready &&
    dashboardId &&
    viewport.width > 0 &&
    viewport.height > 0 &&
    typeof window !== "undefined" &&
    !pointerDownRef.current &&
    lastSigRef.current !== sig
  ) {
    const action = actionRef.current;
    actionRef.current = IDLE_ACTION;
    const previous = orientationRef.current;
    const enteringPortrait = previous === "landscape" && orientation === "portrait";
    const leavingPortrait = previous === "portrait" && orientation === "landscape";
    const sizesChanged = sizeSigRef.current.length > 0 && sizeSigRef.current !== sizeSig;
    const push = action.push || enteringPortrait;
    const anchors = action.anchors ?? (push ? anchorsSince(baselineRef.current, tiles) : undefined);
    const result = reconcileFloatingLayout({
      storage: window.localStorage,
      dashboardId,
      orientation,
      viewport,
      tiles,
      push,
      reportNotice: action.report || enteringPortrait || leavingPortrait || (orientation === "landscape" && sizesChanged),
      anchorKeys: anchors,
      rederive: action.rederive,
      mounted: cardsMountedRef.current,
    });
    lastSigRef.current = sig;
    orientationRef.current = orientation;
    sizeSigRef.current = sizeSig;
    if (result.remount) setEpoch((value) => value + 1);
    if (result.scrollOverflowPx !== scrollOverflowPx) setScrollOverflowPx(result.scrollOverflowPx);
    const visible = consumeLayoutNotice(result.notice, window.sessionStorage);
    if (previous !== null && previous !== orientation) setNotice(visible ? noticeKey(visible) : null);
    else if (visible) setNotice(noticeKey(visible));
  }

  useEffect(() => {
    const onResize = () => {
      if (pointerDownRef.current) {
        deferredRef.current = true;
        return;
      }
      setViewport(readViewport());
    };
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  useEffect(() => {
    const down = () => {
      pointerDownRef.current = true;
    };
    const up = () => {
      const wasDown = pointerDownRef.current;
      pointerDownRef.current = false;
      if (!wasDown) return;
      if (deferredRef.current) {
        deferredRef.current = false;
        setViewport(readViewport());
      }
      setGeneration((value) => value + 1);
    };
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    return () => {
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
    };
  }, []);

  useEffect(() => {
    if (!ready || viewport.width <= 0) return;
    cardsMountedRef.current = true;
  }, [ready, viewport.width, viewport.height]);

  useEffect(() => {
    if (!editMode || !dashboardId || typeof window === "undefined") {
      if (!editMode) baselineRef.current = null;
      return;
    }
    if (!baselineRef.current) baselineRef.current = captureBaseline(tilesRef.current);
  }, [editMode, dashboardId]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 8000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!ready || !dashboardId || orientation !== "portrait" || measuredRef.current) return;
    let frame = 0;
    frame = window.requestAnimationFrame(() => {
      const layout = readFloatingLayout(window.localStorage, dashboardId);
      if (!layout || layout.portraitBron !== "afgeleid" || !layout.portrait) return;
      const nodes = document.querySelectorAll<HTMLElement>(".card-plot-in");
      if (nodes.length === 0) return;
      const known = tilesRef.current.flatMap((tile) => {
        const raw = layout.portrait?.[tile.key];
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw) as { left?: number };
          if (typeof parsed.left !== "number") return [];
          return [{ key: tile.key, left: parsed.left, w: tile.w, h: tile.h }];
        } catch {
          return [];
        }
      });
      const overrides = measuredSizeOverrides(
        [...nodes].map((node) => ({
          style: { left: node.style.left, width: node.style.width },
          offsetWidth: node.offsetWidth,
          offsetHeight: node.offsetHeight,
        })),
        known
      );
      measuredRef.current = true;
      if (Object.keys(overrides).length === 0) return;
      actionRef.current = { push: false, report: false, rederive: true, anchors: undefined };
      setSizeOverrides((current) => ({ ...current, ...overrides }));
      setGeneration((value) => value + 1);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [ready, dashboardId, orientation, epoch, viewport.width, viewport.height]);

  useEffect(() => {
    const root = document.documentElement;
    if (scrollOverflowPx > 0 && orientation === "portrait") root.setAttribute("data-portrait-scroll", "");
    else root.removeAttribute("data-portrait-scroll");
    return () => root.removeAttribute("data-portrait-scroll");
  }, [scrollOverflowPx, orientation]);

  useEffect(() => {
    if (scrollOverflowPx <= 0 || orientation !== "portrait") return;
    let frame = 0;
    let alive = true;
    const reveal = () => {
      if (!alive || pointerDownRef.current) return;
      const hanging = tilesRef.current.flatMap((tile) => {
        if (tile.persistsClamp) return [];
        const raw = window.localStorage.getItem(tile.key);
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw) as { left?: number; bottom?: number };
          if (typeof parsed.left !== "number" || typeof parsed.bottom !== "number" || parsed.bottom >= 0) return [];
          return [{ key: tile.key, left: parsed.left, bottom: parsed.bottom, w: tile.w }];
        } catch {
          return [];
        }
      });
      if (hanging.length === 0) return;
      const nodes = [...document.querySelectorAll<HTMLElement>(".card-plot-in")].map((node) => ({
        style: node.style,
        offsetWidth: node.offsetWidth,
      }));
      revealBelowFoldTiles(nodes, hanging);
      restoreBelowFoldStorage(window.localStorage, hanging);
    };
    const schedule = () => {
      if (!alive || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        reveal();
      });
    };
    const onStyle = (records: MutationRecord[]) => {
      for (const record of records) {
        const target = record.target;
        if (target instanceof Element && target.classList.contains("card-plot-in")) {
          schedule();
          return;
        }
      }
    };
    schedule();
    const mutations = new MutationObserver(onStyle);
    mutations.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["style"] });
    const sizes = new ResizeObserver(() => schedule());
    sizes.observe(document.documentElement);
    const onPointerUp = () => schedule();
    window.addEventListener("pointerup", onPointerUp, true);
    window.addEventListener("pointercancel", onPointerUp, true);
    return () => {
      alive = false;
      mutations.disconnect();
      sizes.disconnect();
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollOverflowPx, orientation, epoch]);

  const commitEdits = () => {
    if (typeof window === "undefined" || !dashboardId) return;
    const portrait = currentOrientation(window.innerWidth, window.innerHeight) === "portrait";
    actionRef.current = {
      push: portrait,
      report: true,
      rederive: false,
      anchors: portrait ? anchorsSince(baselineRef.current, tilesRef.current) : undefined,
    };
    setGeneration((value) => value + 1);
  };

  const dismissNotice = () => setNotice(null);

  return { epoch, scrollOverflowPx, notice, dismissNotice, commitEdits };
}
