"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { StoryCardView } from "@/components/energy/overview/story-cards";
import { useTranslation } from "@/hooks/use-translation";
import { useEnergyOverviewData } from "@/hooks/use-energy-overview-data";
import { buildStoryCards } from "@/lib/energy-story/cards";
import { createStoryIdle, storyIndexAfterScroll, storyScrollLeft } from "@/lib/energy-story/carousel";
import type { StoryCardModel } from "@/lib/energy-story/types";

export type StoryOpenKind = "solar" | "grid" | "battery";

export type StoryCarouselHandle = {
  open: (kind: StoryOpenKind) => void;
};

function cardKind(card: StoryCardModel): string {
  return card.kind;
}

export const StoryCarousel = forwardRef<StoryCarouselHandle>(function StoryCarousel(_props, ref) {
  const { t } = useTranslation();
  const { facts, status } = useEnergyOverviewData();
  const cards = useMemo(() => (facts ? buildStoryCards(facts) : []), [facts]);
  const scroller = useRef<HTMLDivElement | null>(null);
  const section = useRef<HTMLElement | null>(null);
  const fromControl = useRef(false);
  const heldIndex = useRef(0);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const indexRef = useRef(0);
  indexRef.current = index;

  useLayoutEffect(() => {
    const node = section.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const query = window.matchMedia("(orientation: portrait)");
    const apply = () => {
      if (!query.matches) {
        node.style.width = "";
        node.style.marginRight = "";
        return;
      }
      const house = node.closest("[data-energy-overview]")?.querySelector("[data-now-housebox]");
      if (!(house instanceof HTMLElement)) {
        node.style.width = "";
        node.style.marginRight = "";
        return;
      }
      const left = house.getBoundingClientRect().left;
      const width = Math.max(house.offsetWidth, window.innerWidth - left);
      node.style.width = `${width}px`;
      const overflow = width - house.offsetWidth;
      node.style.marginRight = overflow > 0 ? `${-overflow}px` : "";
    };
    apply();
    const observer = new ResizeObserver(apply);
    const overview = node.closest("[data-energy-overview]");
    if (overview) observer.observe(overview);
    observer.observe(document.documentElement);
    query.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, [cards.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setIndex((current) => {
      const next = cards.length === 0 ? 0 : Math.min(current, cards.length - 1);
      heldIndex.current = next;
      return next;
    });
  }, [cards.length]);

  const scrollTo = useCallback((next: number, behavior: ScrollBehavior) => {
    const root = scroller.current;
    if (!root) return;
    const card = root.querySelectorAll("[data-story-card]")[next];
    if (!(card instanceof HTMLElement)) return;
    const pad = Number.parseFloat(getComputedStyle(root).paddingLeft) || 0;
    fromControl.current = true;
    heldIndex.current = next;
    root.scrollTo({ left: storyScrollLeft(card.offsetLeft, pad), behavior });
    setIndex(next);
  }, []);

  useEffect(() => {
    const idle = createStoryIdle(() => {
      if (indexRef.current === 0) return;
      scrollTo(0, reduced ? "auto" : "smooth");
    });
    const root = section.current;
    const touch = () => idle.touch();
    root?.addEventListener("pointerdown", touch);
    root?.addEventListener("wheel", touch, { passive: true });
    root?.addEventListener("keydown", touch);
    return () => {
      idle.stop();
      root?.removeEventListener("pointerdown", touch);
      root?.removeEventListener("wheel", touch);
      root?.removeEventListener("keydown", touch);
    };
  }, [reduced, cards.length, scrollTo]);

  useImperativeHandle(
    ref,
    () => ({
      open(kind) {
        const next = cards.findIndex((card) => card.kind === kind);
        if (next < 0) return;
        scrollTo(next, reduced ? "auto" : "smooth");
      },
    }),
    [cards, reduced, scrollTo]
  );

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const noteSwipe = () => {
      fromControl.current = false;
    };
    root.addEventListener("pointerdown", noteSwipe);
    root.addEventListener("wheel", noteSwipe, { passive: true });
    return () => {
      root.removeEventListener("pointerdown", noteSwipe);
      root.removeEventListener("wheel", noteSwipe);
    };
  }, [cards.length]);

  function onScroll() {
    const root = scroller.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll("[data-story-card]")];
    const measured = nodes.flatMap((node) => (node instanceof HTMLElement ? [{ offsetLeft: node.offsetLeft }] : []));
    const pad = Number.parseFloat(getComputedStyle(root).paddingLeft) || 0;
    const maxScroll = Math.max(0, root.scrollWidth - root.clientWidth);
    setIndex(
      storyIndexAfterScroll(measured, root.scrollLeft, pad, maxScroll, {
        fromControl: fromControl.current,
        heldIndex: heldIndex.current,
      })
    );
  }

  return (
    <section
      ref={section}
      aria-label={t("energy.story.region")}
      data-story-carousel
      className="col-start-2 row-start-2 flex min-w-0 flex-col self-center portrait:col-start-1 portrait:row-start-4 portrait:mt-6 portrait:justify-self-start portrait:self-start"
    >
      <div
        ref={scroller}
        data-story-scroller
        data-story-index={index}
        onScroll={onScroll}
        className="relative flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto pe-6 [scrollbar-width:none]"
      >
        {status === "loading" && cards.length === 0 ? <div data-story-loading className="h-[280px] flex-1 portrait:h-[272px]" /> : null}
        {cards.map((card) => (
          <StoryCardView key={`${cardKind(card)}-${card.kind === "hint" ? card.mode : card.kind}`} card={card} />
        ))}
      </div>
    </section>
  );
});
