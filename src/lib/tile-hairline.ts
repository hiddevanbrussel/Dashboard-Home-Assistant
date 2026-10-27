/**
 * 1px white hairline at 8% opacity, dark mode only.
 * One literal string so Tailwind emits every class (`src/lib` is in `content`).
 * `after:z-20` paints above z-10 card content and under the z-30 scale handle.
 * `pointer-events-none` keeps taps on the card, the ⋮ and the handle.
 */
export const TILE_HAIRLINE_DARK =
  "after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:content-[''] dark:after:ring-1 dark:after:ring-inset dark:after:ring-white/[0.08]";
