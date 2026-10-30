/** Scroll position of the story carousel. One step per card, no loop, no autoplay. */

export const STORY_IDLE_MS = 120_000;
export const STORY_CARD_WIDTH = { landscape: 280, portrait: 332 } as const;

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

/** Restarts a single timer. Calling `touch` never stacks timers. */
export function createStoryIdle(onReset: () => void, clock: IdleClock = { schedule: setTimeout, clear: clearTimeout }) {
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
