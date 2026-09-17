"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CARD_PLOT_CLASS,
  CARD_PLOT_FALLBACK_MS,
  CARD_PLOT_INSTANT_CLASS,
  CARD_PLOT_PLAYED_CLASS,
  DASHBOARD_EDIT_ATTR,
  isDashboardEditFlagSet,
  markCardsPlotInstant,
  sortCardsForPlot,
} from "@/lib/card-plot";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markPlayed(el: Element, index: number, instant = false, seen?: WeakSet<Element>) {
  seen?.add(el);
  if (instant) el.classList.add(CARD_PLOT_INSTANT_CLASS);
  if (el.classList.contains(CARD_PLOT_PLAYED_CLASS)) return;
  (el as HTMLElement).style.setProperty("--card-plot-i", String(index));
  el.classList.add(CARD_PLOT_PLAYED_CLASS);
}

export function CardPlotController() {
  const pathname = usePathname();

  useEffect(() => {
    const seen = new WeakSet<Element>();

    const revealVisible = () => {
      if (isDashboardEditFlagSet()) {
        markCardsPlotInstant();
        return;
      }
      document.querySelectorAll(`.${CARD_PLOT_CLASS}:not(.${CARD_PLOT_PLAYED_CLASS})`).forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visible =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth;
        if (visible) markPlayed(el, 0, false, seen);
      });
    };

    if (prefersReducedMotion()) {
      const reveal = () => {
        document.querySelectorAll(`.${CARD_PLOT_CLASS}`).forEach((el) => markPlayed(el, 0, true, seen));
      };
      reveal();
      const mo = new MutationObserver(reveal);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    let nextIndex = 0;
    const pending = new Set<Element>();
    let frame = 0;

    const flush = () => {
      frame = 0;
      if (isDashboardEditFlagSet()) {
        pending.clear();
        markCardsPlotInstant();
        return;
      }
      const batch = sortCardsForPlot(Array.from(pending), (el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
      });
      pending.clear();
      for (const el of batch) {
        markPlayed(el, nextIndex, false, seen);
        nextIndex += 1;
      }
    };

    const restoreOrObserve = (el: Element) => {
      if (seen.has(el) || el.classList.contains(CARD_PLOT_PLAYED_CLASS)) {
        markPlayed(el, 0, true, seen);
        return;
      }
      io.observe(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (isDashboardEditFlagSet()) {
          markCardsPlotInstant();
          return;
        }
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target.classList.contains(CARD_PLOT_PLAYED_CLASS) || seen.has(entry.target)) continue;
          pending.add(entry.target);
          io.unobserve(entry.target);
        }
        if (!frame && pending.size) {
          frame = requestAnimationFrame(flush);
        }
      },
      { threshold: 0.16, rootMargin: "0px" }
    );

    const observeNew = () => {
      if (isDashboardEditFlagSet()) {
        markCardsPlotInstant();
        return;
      }
      document.querySelectorAll(`.${CARD_PLOT_CLASS}`).forEach((el) => restoreOrObserve(el));
    };

    const onEditFlag = () => {
      if (!isDashboardEditFlagSet()) return;
      markCardsPlotInstant();
    };

    observeNew();
    onEditFlag();
    const mo = new MutationObserver(observeNew);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    const attrMo = new MutationObserver(onEditFlag);
    attrMo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [DASHBOARD_EDIT_ATTR],
    });
    const fallback = window.setTimeout(revealVisible, CARD_PLOT_FALLBACK_MS);

    return () => {
      io.disconnect();
      mo.disconnect();
      attrMo.disconnect();
      window.clearTimeout(fallback);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
