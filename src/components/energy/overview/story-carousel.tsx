"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
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
      className="flex min-h-0 min-w-0 flex-1 flex-col portrait:w-[680px]"
    >
      <div
        ref={scroller}
        data-story-scroller
        data-story-index={index}
        onScroll={onScroll}
        className="relative flex min-h-0 flex-1 snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] portrait:scroll-px-0 portrait:px-0"
      >
        {status === "loading" && cards.length === 0 ? <div data-story-loading className="min-h-[148px] flex-1" /> : null}
        {cards.map((card) => (
          <StoryCardView key={`${cardKind(card)}-${card.kind === "hint" ? card.mode : card.kind}`} card={card} />
        ))}
      </div>
    </section>
  );
});
