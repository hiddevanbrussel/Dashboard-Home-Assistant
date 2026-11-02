import {
  HOUSE_LIGHT_BLUR,
  HOUSE_LIGHT_TINT,
  HOUSE_LIGHT_TINT_TRANSITION_MS,
  HOUSE_LIGHT_ZONES,
  type ActiveHouseLight,
  type HouseTheme,
} from "@/lib/energy-now";

const FILTER_ID = "house-light-tint-blur";

function polygonPoints(polygon: readonly (readonly [number, number])[]): string {
  return polygon.map(([x, y]) => `${x},${y}`).join(" ");
}

/** SVG window tint. Sits in the house frame, under the leader lines and the labels. */
export function HouseLightTint({
  theme,
  reducedMotion,
  zones,
}: {
  theme: HouseTheme;
  reducedMotion: boolean;
  zones: readonly ActiveHouseLight[];
}) {
  const drawn = zones.filter((zone) => HOUSE_LIGHT_ZONES[zone.id].length > 0);
  if (drawn.length === 0) return null;
  const palette = theme === "dark" ? HOUSE_LIGHT_TINT.dark : HOUSE_LIGHT_TINT.light;
  const transition = reducedMotion ? "none" : `opacity ${HOUSE_LIGHT_TINT_TRANSITION_MS}ms ease`;

  return (
    <svg
      aria-hidden
      data-house-light-tint=""
      data-house-light-motion={reducedMotion ? "reduce" : "ease"}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id={FILTER_ID} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={HOUSE_LIGHT_BLUR} />
        </filter>
      </defs>
      {drawn.map((zone) => (
        <g key={zone.id} data-house-light-zone={zone.id} data-house-light-factor={String(zone.factor)}>
          {HOUSE_LIGHT_ZONES[zone.id].map((polygon, index) => {
            const shape = polygonPoints(polygon);
            return (
              <g key={index}>
                <polygon
                  points={shape}
                  fill={palette.multiply.fill}
                  filter={`url(#${FILTER_ID})`}
                  style={{
                    mixBlendMode: "multiply",
                    opacity: palette.multiply.opacity * zone.factor,
                    transition,
                  }}
                />
                <polygon
                  points={shape}
                  fill={palette.screen.fill}
                  style={{
                    mixBlendMode: "screen",
                    opacity: palette.screen.opacity * zone.factor,
                    transition,
                  }}
                />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
