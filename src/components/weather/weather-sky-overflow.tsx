"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { overflowMask, writeOccluders, type OverflowGate, type OverflowMargins, type Rect } from "@/lib/sky/overflow";

export type SkyOverflowPlacement = {
  anchor: RefObject<HTMLElement | null>; left: number; bottom: number;
  editMode?: boolean; dragging?: boolean; resizing?: boolean; plotIn?: boolean; sheetOpen?: boolean;
};
export type OverflowTarget = {
  canvas: HTMLCanvasElement | null; redraw: (() => void) | null; context: CanvasRenderingContext2D | null; active: boolean; drawing: boolean; margins: OverflowMargins;
  width: number; height: number; dpr: number; occluders: Float32Array; occluderCount: number;
  times: Float64Array; work: Float64Array; first: number; count: number; sum: number;
};
export function createOverflowTarget(): OverflowTarget {
  return { canvas: null, redraw: null, context: null, active: false, drawing: false, margins: { left: 8, right: 8, bottom: 40 }, width: 0, height: 0, dpr: 1,
    occluders: new Float32Array(12 * 4), occluderCount: 0, times: new Float64Array(256), work: new Float64Array(256), first: 0, count: 0, sum: 0 };
}
let averageWorkMs = 0;
let lastPublish = -Infinity;
const listeners = new Set<() => void>();
export const subscribeSkyOverflowWork = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const publishWork = (value: number) => { if (value === 0) lastPublish = -Infinity; averageWorkMs = value; for (const listener of listeners) listener(); };
export const getSkyOverflowWorkMs = () => averageWorkMs;
export function recordOverflowWork(target: OverflowTarget, time: number, work: number): void {
  while (target.count && (target.times[target.first] <= time - 3000 || target.count === 256)) {
    target.sum -= target.work[target.first]; target.first = (target.first + 1) % 256; target.count--;
  }
  const at = (target.first + target.count) % 256;
  target.times[at] = time; target.work[at] = work; target.sum += work; target.count++;
  if (time - lastPublish >= 250 || target.count === 1) {
    lastPublish = time; publishWork(target.sum / target.count);
  }
}
export function clearOverflow(target: OverflowTarget): void {
  const node = target.canvas;
  if (!node) return;
  target.context?.clearRect(0, 0, target.width + target.margins.left + target.margins.right, target.height + target.margins.bottom);
}

/** Portal geometry is measured on events; the shared particle draw never reads layout. */
export function WeatherSkyOverflow({ placement, target, gate, width, height, dpr, margins, frozen, onActive, onPopup, onPageHidden }: {
  placement: SkyOverflowPlacement; target: OverflowTarget; gate: OverflowGate; width: number; height: number; dpr: number;
  margins: OverflowMargins; frozen: boolean; onActive: (active: boolean) => void; onPopup: (open: boolean) => void; onPageHidden: (hidden: boolean) => void;
}) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [paint, setPaint] = useState({ width, height, dpr, margins, left: placement.left, bottom: placement.bottom });
  const [opaque, setOpaque] = useState(false);
  const node = useRef<HTMLCanvasElement>(null);
  const pageRef = useRef<HTMLElement | null>(null);
  const last = useRef({ left: placement.left, bottom: placement.bottom, width, height, blocked: false });
  const notify = useRef({ onActive, onPopup, onPageHidden }); notify.current = { onActive, onPopup, onPageHidden };
  const measureRef = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    const page = placement.anchor.current?.closest<HTMLElement>("[data-dashboard-page-frame], [data-dashboard-page]") ?? null;
    pageRef.current = page;
    setSlot(page?.querySelector<HTMLElement>(":scope > [data-sky-overflow-slot]") ?? null);
  }, [placement.anchor]);
  useLayoutEffect(() => {
    const page = placement.anchor.current?.closest("[data-dashboard-page]");
    if (!page) return;
    const read = () => notify.current.onPageHidden(page.getAttribute("aria-hidden") === "true");
    read(); const observer = new MutationObserver(read); observer.observe(page, { attributes: true, attributeFilter: ["aria-hidden"] });
    return () => { observer.disconnect(); notify.current.onPageHidden(false); };
  }, [placement.anchor]);
  useEffect(() => {
    const read = () => notify.current.onPopup(!!document.body.querySelector('[role="dialog"], [aria-modal="true"]'));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["role", "aria-modal"] });
    return () => { observer.disconnect(); notify.current.onPopup(false); };
  }, []);
  useLayoutEffect(() => {
    const old = last.current;
    const moved = old.left !== placement.left || old.bottom !== placement.bottom || old.width !== width || old.height !== height;
    last.current = { left: placement.left, bottom: placement.bottom, width, height, blocked: gate !== "on" };
    let timer: ReturnType<typeof setTimeout> | undefined;
    let paint: ReturnType<typeof setTimeout> | undefined;
    if (!slot || gate === "off") {
      target.active = false; target.drawing = false; clearOverflow(target); setOpaque(false); setMounted(false); notify.current.onActive(false); publishWork(0);
    } else if (gate === "fading-out") {
      target.drawing = false; setOpaque(false);
      timer = setTimeout(() => {
        target.active = false; target.drawing = false; clearOverflow(target); setMounted(false); notify.current.onActive(false);
      }, 150);
    } else {
      const show = () => {
        setPaint({ width, height, dpr, margins, left: placement.left, bottom: placement.bottom });
        setMounted(true);
        // A second commit gives opacity:0 a painted starting state.
        paint = setTimeout(() => { measureRef.current(); setOpaque(true); }, 0);
      };
      if (moved || old.blocked) {
        target.active = false; target.drawing = false; clearOverflow(target); notify.current.onActive(false); setOpaque(false); setMounted(false);
        timer = setTimeout(show, 400);
      } else show();
    }
    return () => { if (timer != null) clearTimeout(timer); if (paint != null) clearTimeout(paint); };
  }, [gate, slot, placement.left, placement.bottom, width, height, dpr, margins, target]);
  useLayoutEffect(() => {
    const canvas = node.current;
    if (!canvas || !mounted) return;
    target.canvas = canvas; target.width = paint.width; target.height = paint.height; target.dpr = Math.min(paint.dpr, 1.5); target.margins = paint.margins;
    const backingWidth = Math.round((paint.width + paint.margins.left + paint.margins.right) * target.dpr);
    const backingHeight = Math.round((paint.height + paint.margins.bottom) * target.dpr);
    if (canvas.width !== backingWidth) canvas.width = backingWidth;
    if (canvas.height !== backingHeight) canvas.height = backingHeight;
    target.context = canvas.getContext("2d", { alpha: true });
    target.context?.setTransform(target.dpr, 0, 0, target.dpr, 0, 0);
    measureRef.current();
    target.active = true; target.drawing = true; notify.current.onActive(true);
  }, [mounted, paint, target]);
  useLayoutEffect(() => {
    const canvas = node.current;
    if (!canvas || !mounted) return;
    return () => {
      target.active = false; target.drawing = false; clearOverflow(target); target.canvas = null; target.context = null; publishWork(0);
      canvas.width = canvas.height = 0; notify.current.onActive(false);
    };
  }, [mounted, target]);
  useLayoutEffect(() => {
    const page = pageRef.current, anchor = placement.anchor.current;
    if (!page || !anchor || !mounted) return;
    const scroller = page.closest("[data-dashboard-pager]");
    const box = { x: 0, y: 0, width: 0, height: 0 };
    let measuredX = 0, measuredY = 0, scrollLeft = 0, scrollTop = 0;
    const measure = (headerOnly = false) => {
      const canvas = node.current;
      if (!canvas) return;
      if (headerOnly) {
        box.x = measuredX - ((scroller?.scrollLeft ?? 0) - scrollLeft);
        box.y = measuredY - ((scroller?.scrollTop ?? 0) - scrollTop);
      } else {
        const rect = canvas.getBoundingClientRect();
        box.x = measuredX = rect.x; box.y = measuredY = rect.y; box.width = rect.width; box.height = rect.height;
        scrollLeft = scroller?.scrollLeft ?? 0; scrollTop = scroller?.scrollTop ?? 0;
      }
      const headers: Rect[] = [];
      for (const header of document.querySelectorAll<HTMLElement>("[data-app-chrome]")) {
        const rect = header.getBoundingClientRect(); headers.push({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
      }
      // Reserve slot zero for the header, whose viewport position changes on scroll.
      target.occluders.fill(0, 0, 4);
      writeOccluders(box, headers, target.occluders.subarray(0, 4));
      if (headerOnly) { target.redraw?.(); return; }
      const rects: Rect[] = [];
      for (const other of page.querySelectorAll<HTMLElement>(".card-plot-in, [data-energy-board], [data-energy-house]")) {
        if (other === anchor || anchor.contains(other)) continue;
        const rect = other.getBoundingClientRect(); rects.push({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
      }
      target.occluderCount = 1 + writeOccluders(box, rects, target.occluders.subarray(4));
      target.redraw?.();
    };
    measureRef.current = () => measure(); measure();
    let debounce: ReturnType<typeof setTimeout> | undefined;
    let scrollFrame: number | undefined;
    const changed = () => { if (debounce != null) clearTimeout(debounce); debounce = setTimeout(() => measure(), 150); };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(changed);
    observer?.observe(page); observer?.observe(anchor);
    const pageObserver = new MutationObserver(changed);
    pageObserver.observe(page, { attributes: true, subtree: true, attributeFilter: ["aria-hidden", "style", "class"] });
    window.addEventListener("resize", changed); window.addEventListener("orientationchange", changed);
    const scroll = () => { if (gate !== "on" || scrollFrame != null) return; scrollFrame = requestAnimationFrame(() => { scrollFrame = undefined; measure(true); }); };
    scroller?.addEventListener("scroll", scroll, { passive: true });
    return () => {
      observer?.disconnect(); pageObserver.disconnect(); if (debounce != null) clearTimeout(debounce);
      if (scrollFrame != null) cancelAnimationFrame(scrollFrame);
      window.removeEventListener("resize", changed); window.removeEventListener("orientationchange", changed); scroller?.removeEventListener("scroll", scroll);
      measureRef.current = () => {};
    };
  }, [mounted, placement.anchor, target, gate]);
  if (!slot || !mounted) return null;
  return createPortal(<canvas ref={node} aria-hidden="true" className="weather-sky-overflow fixed" data-sky-overflow-frozen={frozen}
    style={{ zIndex: 29, pointerEvents: "none", left: paint.left - paint.margins.left, bottom: paint.bottom - paint.margins.bottom,
      width: paint.width + paint.margins.left + paint.margins.right, height: paint.height + paint.margins.bottom, opacity: opaque ? 1 : 0,
      transitionDuration: gate === "fading-out" ? "150ms" : "300ms", maskImage: overflowMask(paint.width, paint.height, paint.margins),
      WebkitMaskImage: overflowMask(paint.width, paint.height, paint.margins), maskComposite: "intersect", WebkitMaskComposite: "source-in" }} />, slot);
}
