import { snapToGrid } from "@/lib/floating-card-grid";

/**
 * Position a light or sensor card writes on first mount when no key is stored.
 *
 * Sensor formula: `defaultPosition` in floating-sensor-card.tsx:44-50.
 * Sensor snap bounds: the init effect at floating-sensor-card.tsx:120-133
 * (`maxLeft = innerWidth - cardWidth`, `maxBottom = innerHeight - 120`).
 * Light formula: `defaultPosition` in floating-light-card.tsx:49-56.
 * Light snap bounds: the init effect at floating-light-card.tsx:122-138
 * (`maxLeft = innerWidth - width`, `maxBottom = innerHeight - height`).
 * `size` is that width and height. Snap itself is `snapToGrid` in
 * src/lib/floating-card-grid.ts:14-27.
 * Other widget types have no card default and return null.
 */
export function cardDefaultPosition(
  type: string,
  indexOnPage: number,
  size: { w: number; h: number },
  viewport: { width: number; height: number }
): { left: number; bottom: number } | null {
  switch (type) {
    case "sensor_card":
      return snapSensorDefault(indexOnPage, size.w, viewport);
    case "light_card":
      return snapLightDefault(indexOnPage, size, viewport);
    default:
      return null;
  }
}

function snapSensorDefault(
  indexOnPage: number,
  cardWidth: number,
  viewport: { width: number; height: number }
): { left: number; bottom: number } {
  const maxLeft = viewport.width - cardWidth;
  const maxBottom = viewport.height - 120;
  const offset = indexOnPage * (cardWidth + 16);
  return snapToGrid(
    { left: Math.min(offset, maxLeft / 2), bottom: maxBottom / 2 },
    { maxLeft, maxBottom }
  );
}

function snapLightDefault(
  indexOnPage: number,
  size: { w: number; h: number },
  viewport: { width: number; height: number }
): { left: number; bottom: number } {
  const maxLeft = viewport.width - size.w;
  const maxBottom = viewport.height - size.h;
  const left = Math.min(maxLeft, 24 + indexOnPage * (size.w + 16));
  return snapToGrid(
    { left, bottom: Math.max(24, maxBottom / 2) },
    { maxLeft, maxBottom }
  );
}
