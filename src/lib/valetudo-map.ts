export type ValetudoMapLayerType = "floor" | "wall" | "segment";

export type ValetudoMapLayer = {
  type: ValetudoMapLayerType | string;
  pixels?: number[];
  compressedPixels?: number[];
  metaData?: {
    segmentId?: string | number;
    name?: string;
    active?: boolean;
    area?: number;
  };
};

export type ValetudoMapEntity = {
  type: string;
  points: number[];
  metaData?: { angle?: number; label?: string; id?: string };
};

export type ValetudoRawMap = {
  size?: { x: number; y: number };
  pixelSize?: number;
  layers?: ValetudoMapLayer[];
  entities?: ValetudoMapEntity[];
};

export type ValetudoSegment = {
  id: string;
  name?: string;
};

export type MapBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

/** Expand a Valetudo layer into x/y pixel pairs. compressedPixels are [x, y, count] runs. */
export function forEachLayerPixel(
  layer: ValetudoMapLayer,
  visit: (x: number, y: number) => void
): void {
  const compressed = layer.compressedPixels;
  if (compressed && compressed.length >= 3) {
    for (let i = 0; i + 2 < compressed.length; i += 3) {
      const x = compressed[i];
      const y = compressed[i + 1];
      const count = compressed[i + 2];
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(count)) continue;
      for (let n = 0; n < count; n++) visit(x + n, y);
    }
    return;
  }
  const pixels = layer.pixels ?? [];
  for (let i = 0; i + 1 < pixels.length; i += 2) {
    visit(pixels[i], pixels[i + 1]);
  }
}

export function layerPixelBounds(layers: ValetudoMapLayer[]): MapBounds | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const layer of layers) {
    forEachLayerPixel(layer, (x, y) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

export function normalizeSegmentId(id: unknown): string | null {
  if (id == null) return null;
  const value = String(id).trim();
  return value ? value : null;
}

export function segmentLayers(map: ValetudoRawMap): ValetudoMapLayer[] {
  return (map.layers ?? []).filter((layer) => layer.type === "segment" && normalizeSegmentId(layer.metaData?.segmentId));
}

export function segmentCentroid(layer: ValetudoMapLayer): { x: number; y: number } | null {
  let sx = 0;
  let sy = 0;
  let n = 0;
  forEachLayerPixel(layer, (x, y) => {
    sx += x;
    sy += y;
    n += 1;
  });
  if (n === 0) return null;
  return { x: sx / n, y: sy / n };
}

export function mapPixelSize(map: ValetudoRawMap): number {
  const size = map.pixelSize;
  return Number.isFinite(size) && size && size > 0 ? size : 5;
}

/** Convert a map entity coordinate in cm to pixel space. */
export function entityPointToPixel(
  points: number[],
  pixelSize: number,
  index = 0
): { x: number; y: number } | null {
  const x = points[index * 2];
  const y = points[index * 2 + 1];
  if (!Number.isFinite(x) || !Number.isFinite(y) || pixelSize <= 0) return null;
  return { x: x / pixelSize, y: y / pixelSize };
}

export function segmentLabel(layer: ValetudoMapLayer, fallbackId: string): string {
  const name = layer.metaData?.name?.trim();
  if (name) return name;
  return fallbackId;
}
