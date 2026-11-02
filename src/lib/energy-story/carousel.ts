/** Scroll position of the story carousel. One step per card, no loop, no autoplay. */

export const STORY_IDLE_MS = 120_000;
export const STORY_CARD_WIDTH = { landscape: 252, portrait: 248 } as const;

export function clampStoryIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, index));
}

export function stepStoryIndex(index: number, count: number, move: "next" | "prev"): number {
  const current = clampStoryIndex(index, count);
  if (move === "next") return clampStoryIndex(current + 1, count);
  return clampStoryIndex(current - 1, count);
}

export function storyArrowEnabled(index: number, count: number): { prev: boolean; next: boolean } {
  return {
    prev: count > 0 && index > 0,
    next: count > 0 && index < count - 1,
  };
}

/** After two quiet minutes the story returns to the first card. */
export function storyIndexAfterIdle(): 0 {
  return 0;
}

export type IdleClock = {
  schedule: (callback: () => void, ms: number) => ReturnType<typeof setTimeout>;
  clear: (timer: ReturnType<typeof setTimeout>) => void;
};

/** Distance from the scroller's content start, after its padding. */
export function storyScrollLeft(offsetLeft: number, paddingLeft: number): number {
  return offsetLeft - paddingLeft;
}

/**
 * Which card sits at the left edge. Uses the same padding correction as scrolling.
 * Max scroll is the last card only when the card before it still stops short of that edge.
 * When both land on the same max, the nearer unclamped target wins (the earlier card).
 */
export function storyIndexFromScroll(
  cards: readonly { offsetLeft: number }[],
  scrollLeft: number,
  paddingLeft: number,
  maxScroll = Number.POSITIVE_INFINITY
): number {
  if (cards.length === 0) return 0;
  const atMax = Number.isFinite(maxScroll) && scrollLeft >= maxScroll - 1;
  if (atMax && cards.length >= 2) {
    const previous = storyScrollLeft(cards[cards.length - 2]!.offsetLeft, paddingLeft);
    if (previous < maxScroll - 1) return cards.length - 1;
  }
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  cards.forEach((card, index) => {
    const distance = Math.abs(storyScrollLeft(card.offsetLeft, paddingLeft) - scrollLeft);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

export type StoryScrollHold = {
  /** True after an arrow or a dot chose the index. A swipe clears it. */
  fromControl: boolean;
  heldIndex: number;
};

/** Arrow and dot clicks keep their index. A swipe uses the scroll position. */
export function storyIndexAfterScroll(
  cards: readonly { offsetLeft: number }[],
  scrollLeft: number,
  paddingLeft: number,
  maxScroll: number,
  hold: StoryScrollHold
): number {
  if (hold.fromControl) return clampStoryIndex(hold.heldIndex, cards.length);
  return storyIndexFromScroll(cards, scrollLeft, paddingLeft, maxScroll);
}

/** Dots and arrows only when there is more than one card. */
export function storyPagerVisible(count: number): boolean {
  return count > 1;
}

/**
 * `setTimeout` must be called as a method of `window`.
 * Passing the bare function throws Illegal invocation in Chromium.
 */
function windowClock(): IdleClock {
  return {
    schedule: (callback, ms) => window.setTimeout(callback, ms) as unknown as ReturnType<typeof setTimeout>,
    clear: (timer) => window.clearTimeout(timer as unknown as number),
  };
}

/** Restarts a single timer. Calling `touch` never stacks timers. */
export function createStoryIdle(onReset: () => void, clock: IdleClock = windowClock()) {
  let timer = clock.schedule(onReset, STORY_IDLE_MS);
  return {
    touch() {
      clock.clear(timer);
      timer = clock.schedule(onReset, STORY_IDLE_MS);
    },
    stop() {
      clock.clear(timer);
    },
  };
}
