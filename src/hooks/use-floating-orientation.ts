"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  consumeLayoutNotice,
  currentOrientation,
  floatingTilesFromWidgets,
  GAP,
  landscapeMarginTop,
  MARGIN_TOP,
  measuredSizeOverrides,
  placingTiles,
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

const PLACEMENT_SELECTORS = ["[data-app-heading-edit]", "[data-app-page-heading]", "[data-app-header]"] as const;

type PlacementSelector = (typeof PLACEMENT_SELECTORS)[number];

function placementMatch(root: ParentNode): { node: HTMLElement; selector: PlacementSelector } | null {
  for (const selector of PLACEMENT_SELECTORS) {
    const node = root.querySelector<HTMLElement>(selector);
    if (!node) continue;
    const bottom = node.getBoundingClientRect().bottom;
    if (!Number.isFinite(bottom) || bottom <= 0) continue;
    return { node, selector };
  }
  return null;
}

/**
 * Element whose bottom is the landscape placement line, measured after layout.
 * An editable title exposes `[data-app-heading-edit]` (the edit-heading box),
 * including while edit mode is off, so the line does not jump when that mode toggles.
 * Otherwise the visible heading. The chrome bar is only a signal that no heading
 * is on screen; its height is not the line.
 */
export function placementElement(root: ParentNode): HTMLElement | null {
  return placementMatch(root)?.node ?? null;
}

/**
 * Heading bottom plus GAP, snapped. With only the chrome bar, the line is fixed
 * at MARGIN_TOP: that bar grows in edit mode and must not move tiles.
 * Undefined when nothing on screen has a box yet.
 */
export function measurePlacementInset(root: ParentNode): number | undefined {
  const match = placementMatch(root);
  if (!match) return undefined;
  if (match.selector === "[data-app-header]") return MARGIN_TOP;
  return landscapeMarginTop(match.node.getBoundingClientRect().bottom + GAP);
}

/** Landscape overlap is reported on a fresh landscape load, not only after a rotation. */
export function reportLayoutNotice(input: {
  previous: Orientation | null;
  orientation: Orientation;
  sizesChanged: boolean;
  actionReport: boolean;
}): boolean {
  const enteringPortrait = input.previous === "landscape" && input.orientation === "portrait";
  const leavingPortrait = input.previous === "portrait" && input.orientation === "landscape";
  const freshLandscape = input.previous === null && input.orientation === "landscape";
  return (
    input.actionReport ||
    enteringPortrait ||
    leavingPortrait ||
    (input.orientation === "landscape" && (input.sizesChanged || freshLandscape))
  );
}

type HeadingWatch = { phase: "pending" } | { phase: "absent" } | { phase: "ready"; inset: number };

function sameHeading(current: HeadingWatch, next: HeadingWatch): boolean {
  if (current.phase !== next.phase) return false;
  if (current.phase === "ready" && next.phase === "ready") return current.inset === next.inset;
  return true;
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
    // A measured size is a user scale. Leave a stored card default where it is.
    return override ? { ...tile, w: override.w, h: override.h, defaultSize: false } : tile;
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
  /** Landscape tiles with no stored slot. The page does not mount them. */
  withheldIds: readonly string[];
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
  const [heading, setHeading] = useState<HeadingWatch>({ phase: "pending" });
  const sizeSigRef = useRef("");
  const measuredRef = useRef(false);
  const tilesRef = useRef<FloatingTile[]>([]);

  const orientation = currentOrientation(viewport.width, viewport.height);
  const tiles = withOverrides(
    dashboardId ? floatingTilesFromWidgets(widgets, dashboardId, viewport) : [],
    sizeOverrides
  );
  tilesRef.current = tiles;
  // `parked` is in the signature so pinning or unpinning a tile reconciles again.
  const tileSig = tiles.map((tile) => `${tile.key}:${tile.page}:${tile.w}x${tile.h}${tile.parked ? ":parked" : ""}`).join("|");
  const sizeSig = tiles.map((tile) => `${tile.key}:${tile.w}x${tile.h}`).join("|");
  // Landscape waits until useLayoutEffect has seen the heading (or seen that there is none).
  // The edit sizer, when present, is the line outside edit mode too, so toggling it does not move tiles.
  const topInset = orientation === "landscape" && heading.phase === "ready" ? heading.inset : undefined;
  const landscapeReady = orientation !== "landscape" || heading.phase !== "pending";
  const headingSig = heading.phase === "ready" ? `ready:${heading.inset}` : heading.phase;
  const sig = `${dashboardId ?? ""}|${ready ? 1 : 0}|${orientation}|${viewport.width}x${viewport.height}|${tileSig}|${headingSig}|${generation}`;

  if (
    ready &&
    dashboardId &&
    viewport.width > 0 &&
    viewport.height > 0 &&
    typeof window !== "undefined" &&
    landscapeReady &&
    !pointerDownRef.current &&
    lastSigRef.current !== sig
  ) {
    const action = actionRef.current;
    actionRef.current = IDLE_ACTION;
    const previous = orientationRef.current;
    const enteringPortrait = previous === "landscape" && orientation === "portrait";
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
      reportNotice: reportLayoutNotice({
        previous,
        orientation,
        sizesChanged,
        actionReport: action.report,
      }),
      anchorKeys: anchors,
      rederive: action.rederive,
      mounted: cardsMountedRef.current,
      topInset,
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

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    let resize: ResizeObserver | null = null;
    let watching: HTMLElement | null = null;

    const publish = (next: HeadingWatch) => {
      setHeading((current) => (sameHeading(current, next) ? current : next));
    };
    const sync = () => {
      const node = placementElement(document);
      if (node !== watching) {
        resize?.disconnect();
        resize = null;
        watching = node;
        if (node && typeof ResizeObserver !== "undefined") {
          resize = new ResizeObserver(() => sync());
          resize.observe(node);
        }
      }
      const inset = measurePlacementInset(document);
      publish(inset == null ? { phase: "absent" } : { phase: "ready", inset });
    };

    sync();
    const mutations = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => sync());
    if (mutations && document.body) mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      resize?.disconnect();
      mutations?.disconnect();
    };
  }, [dashboardId]);

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
      // Parked tiles are not rendered, so they cannot be matched to a measured node.
      const known = placingTiles(tilesRef.current).flatMap((tile) => {
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
      const hanging = placingTiles(tilesRef.current).flatMap((tile) => {
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

  const withheldIds =
    typeof window !== "undefined" && landscapeReady && viewport.width > 0 && viewport.height > 0 && orientation === "landscape"
      ? placingTiles(tiles).flatMap((tile) => (window.localStorage.getItem(tile.key) == null ? [tile.id] : []))
      : [];

  return { epoch, scrollOverflowPx, notice, dismissNotice, commitEdits, withheldIds };
}
