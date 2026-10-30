"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { StoryCardView, storyDotLabel } from "@/components/energy/overview/story-cards";
import { useTranslation } from "@/hooks/use-translation";
import { useEnergyOverviewData } from "@/hooks/use-energy-overview-data";
import { buildStoryCards } from "@/lib/energy-story/cards";
import { createStoryIdle, stepStoryIndex, storyArrowEnabled } from "@/lib/energy-story/carousel";
import type { StoryCardModel } from "@/lib/energy-story/types";
import { cn } from "@/lib/utils";

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
    setIndex((current) => (cards.length === 0 ? 0 : Math.min(current, cards.length - 1)));
  }, [cards.length]);

  function scrollTo(next: number, behavior: ScrollBehavior) {
    const root = scroller.current;
    if (!root) return;
    const card = root.querySelectorAll("[data-story-card]")[next];
    if (!(card instanceof HTMLElement)) return;
    root.scrollTo({ left: card.offsetLeft, behavior });
    setIndex(next);
  }

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
  }, [reduced, cards.length]);

  useImperativeHandle(
    ref,
    () => ({
      open(kind) {
        const next = cards.findIndex((card) => card.kind === kind);
        if (next < 0) return;
        scrollTo(next, reduced ? "auto" : "smooth");
      },
    }),
    [cards, reduced]
  );

  function onScroll() {
    const root = scroller.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll("[data-story-card]")];
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    nodes.forEach((node, nodeIndex) => {
      if (!(node instanceof HTMLElement)) return;
      const distance = Math.abs(node.offsetLeft - root.scrollLeft);
      if (distance < bestDistance) {
        best = nodeIndex;
        bestDistance = distance;
      }
    });
    setIndex(best);
  }

  const arrows = storyArrowEnabled(index, cards.length);
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

  return (
    <section
      ref={section}
      aria-label={t("energy.story.region")}
      className="flex min-h-0 min-w-0 flex-1 flex-col portrait:min-h-[420px] portrait:w-[680px]"
    >
      <div
        ref={scroller}
        data-story-scroller
        onScroll={onScroll}
        className="flex min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] portrait:px-0"
      >
        {status === "loading" && cards.length === 0 ? <div data-story-loading className="min-h-[148px] flex-1" /> : null}
        {cards.map((card) => (
          <StoryCardView key={`${cardKind(card)}-${card.kind === "hint" ? card.mode : card.kind}`} card={card} />
        ))}
      </div>
      {cards.length > 0 ? (
        <div className="flex items-center justify-center gap-1 px-2 pb-3">
          <button
            type="button"
            data-story-prev
            aria-label={t("energy.story.prev")}
            disabled={!arrows.prev}
            onClick={() => scrollTo(stepStoryIndex(index, cards.length, "prev"), behavior)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full text-[#111827] outline-none disabled:text-[#9CA3AF] dark:text-[#f3f4f6] dark:disabled:text-[#6B7280]",
              FOCUS_RING_BRAND
            )}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <div className="flex items-center">
            {cards.map((card, dot) => {
              const active = dot === index;
              return (
                <button
                  key={`${cardKind(card)}-${dot}`}
                  type="button"
                  data-story-dot={dot}
                  aria-label={storyDotLabel(t("energy.story.dot"), dot, cards.length)}
                  aria-current={active ? "true" : undefined}
                  onClick={() => scrollTo(dot, behavior)}
                  className={cn("inline-flex h-11 w-11 items-center justify-center outline-none", FOCUS_RING_BRAND)}
                >
                  <span
                    className={cn(
                      "block rounded-full bg-[#4700B5] dark:bg-[#c4b5fd]",
                      active ? "h-2 w-[22px]" : "h-2 w-2 bg-[#6B7280] dark:bg-[#9CA3AF]"
                    )}
                  />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            data-story-next
            aria-label={t("energy.story.next")}
            disabled={!arrows.next}
            onClick={() => scrollTo(stepStoryIndex(index, cards.length, "next"), behavior)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full text-[#111827] outline-none disabled:text-[#9CA3AF] dark:text-[#f3f4f6] dark:disabled:text-[#6B7280]",
              FOCUS_RING_BRAND
            )}
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </div>
      ) : null}
    </section>
  );
});
