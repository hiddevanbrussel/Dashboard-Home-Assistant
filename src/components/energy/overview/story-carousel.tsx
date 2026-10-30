"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { StoryCardView, storyDotLabel } from "@/components/energy/overview/story-cards";
import { useTranslation } from "@/hooks/use-translation";
import { useEnergyOverviewData } from "@/hooks/use-energy-overview-data";
import { buildStoryCards } from "@/lib/energy-story/cards";
import { createStoryIdle, stepStoryIndex, storyArrowEnabled, storyIndexFromScroll, storyPagerVisible, storyScrollLeft } from "@/lib/energy-story/carousel";
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

  const scrollTo = useCallback((next: number, behavior: ScrollBehavior) => {
    const root = scroller.current;
    if (!root) return;
    const card = root.querySelectorAll("[data-story-card]")[next];
    if (!(card instanceof HTMLElement)) return;
    const pad = Number.parseFloat(getComputedStyle(root).paddingLeft) || 0;
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

  function onScroll() {
    const root = scroller.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll("[data-story-card]")];
    const measured = nodes.flatMap((node) => (node instanceof HTMLElement ? [{ offsetLeft: node.offsetLeft }] : []));
    const pad = Number.parseFloat(getComputedStyle(root).paddingLeft) || 0;
    const maxScroll = Math.max(0, root.scrollWidth - root.clientWidth);
    setIndex(storyIndexFromScroll(measured, root.scrollLeft, pad, maxScroll));
  }

  const arrows = storyArrowEnabled(index, cards.length);
  const pager = storyPagerVisible(cards.length);
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

  return (
    <section
      ref={section}
      aria-label={t("energy.story.region")}
      className="flex min-h-0 min-w-0 flex-1 flex-col portrait:w-[680px]"
    >
      {cards.length > 0 ? (
        <div className="flex h-11 shrink-0 items-center gap-2 px-4">
          <BookOpen className="h-[18px] w-[18px] shrink-0 text-[#4700B5] dark:text-[#8357be]" aria-hidden />
          <span className="shrink-0 text-[15px] font-semibold text-[#111827] dark:text-[#f3f4f6]">{t("energy.story.region")}</span>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            {pager
              ? cards.map((card, dot) => {
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
                      "block rounded-full",
                      active ? "h-2 w-[22px] bg-[#4700B5] dark:bg-[#c4b5fd]" : "h-2 w-2 bg-[#6B7280] dark:bg-[#9CA3AF]"
                    )}
                  />
                </button>
              );
            })
              : null}
          </div>
          {pager && arrows.prev ? (
          <button
            type="button"
            data-story-prev
            aria-label={t("energy.story.prev")}
            disabled={!arrows.prev}
            onClick={() => scrollTo(stepStoryIndex(index, cards.length, "prev"), behavior)}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(17,24,39,0.08)] bg-[var(--glass-strong)] text-[#111827] outline-none disabled:text-[#9CA3AF] dark:border-white/10 dark:text-[#f3f4f6] dark:disabled:text-[#6B7280]",
              FOCUS_RING_BRAND
            )}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          ) : null}
          {pager && arrows.next ? (
          <button
            type="button"
            data-story-next
            aria-label={t("energy.story.next")}
            disabled={!arrows.next}
            onClick={() => scrollTo(stepStoryIndex(index, cards.length, "next"), behavior)}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(17,24,39,0.08)] bg-[var(--glass-strong)] text-[#111827] outline-none disabled:text-[#9CA3AF] dark:border-white/10 dark:text-[#f3f4f6] dark:disabled:text-[#6B7280]",
              FOCUS_RING_BRAND
            )}
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
          ) : null}
        </div>
      ) : null}
      <div
        ref={scroller}
        data-story-scroller
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
