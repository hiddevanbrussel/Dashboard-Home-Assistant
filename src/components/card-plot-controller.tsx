"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CARD_PLOT_CLASS,
  CARD_PLOT_FALLBACK_MS,
  CARD_PLOT_PLAYED_CLASS,
  sortCardsForPlot,
} from "@/lib/card-plot";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markPlayed(el: Element, index: number) {
  if (el.classList.contains(CARD_PLOT_PLAYED_CLASS)) return;
  (el as HTMLElement).style.setProperty("--card-plot-i", String(index));
  el.classList.add(CARD_PLOT_PLAYED_CLASS);
}

export function CardPlotController() {
  const pathname = usePathname();

  useEffect(() => {
    const revealVisible = () => {
      document.querySelectorAll(`.${CARD_PLOT_CLASS}:not(.${CARD_PLOT_PLAYED_CLASS})`).forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visible =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth;
        if (visible) markPlayed(el, 0);
      });
    };

    if (prefersReducedMotion()) {
      const reveal = () => {
        document.querySelectorAll(`.${CARD_PLOT_CLASS}`).forEach((el) => markPlayed(el, 0));
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
      const batch = sortCardsForPlot(Array.from(pending), (el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
      });
      pending.clear();
      for (const el of batch) {
        markPlayed(el, nextIndex);
        nextIndex += 1;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target.classList.contains(CARD_PLOT_PLAYED_CLASS)) continue;
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
      document.querySelectorAll(`.${CARD_PLOT_CLASS}:not(.${CARD_PLOT_PLAYED_CLASS})`).forEach((el) => {
        io.observe(el);
      });
    };

    observeNew();
    const mo = new MutationObserver(observeNew);
    mo.observe(document.body, { childList: true, subtree: true });
    const fallback = window.setTimeout(revealVisible, CARD_PLOT_FALLBACK_MS);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(fallback);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
