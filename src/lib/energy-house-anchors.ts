/**
 * Anchor points and polygons from public/energy/house/ankers.json, in percent of the asset.
 * Label boxes sit in the gutters so they do not cover the house silhouette.
 * The silhouette is the panel polygon from the JSON plus a simplified body around the house,
 * door and battery anchors. The JSON has no separate silhouette key.
 */

import ankers from "../../public/energy/house/ankers.json";
import { HOUSE_VARIANTS, type HouseVariantId } from "@/lib/energy-now";

export const HERO_LABEL_KINDS = ["solar", "gridImport", "gridExport", "battery"] as const;

export type HeroLabelKind = (typeof HERO_LABEL_KINDS)[number];

export type OverviewOrientation = "landscape" | "portrait";

export type Point = { x: number; y: number };

export type PlacedLabel = {
  kind: HeroLabelKind;
  xPct: number;
  yPct: number;
  widthPx: number;
  heightPx: number;
  touchWidthPx: number;
  touchHeightPx: number;
};

type AnchorPoint = {
  aanwezig?: boolean;
  pct?: [number, number];
};

type VariantJson = {
  zon_panelen?: AnchorPoint;
  omvormer_kastje?: AnchorPoint;
  batterij?: AnchorPoint;
  net_voordeur?: AnchorPoint;
  huis?: AnchorPoint;
  polygonen_pct?: {
    panelen?: [number, number][];
    mint_lijn_dag?: [number, number][];
    mint_lijn_nacht?: [number, number][];
    batterij_led?: [number, number][];
  };
};

const variants = ankers.varianten as unknown as Record<string, VariantJson>;

/** Simplified house body, percent of the asset. Contains the house, door and battery anchors. */
export const HOUSE_BODY: Point[] = [
  { x: 28, y: 36 },
  { x: 74, y: 36 },
  { x: 74, y: 82 },
  { x: 28, y: 82 },
];

const LABEL_HEIGHT_PX = 50;

const LABEL_WIDTH_PX: Record<HeroLabelKind, number> = {
  solar: 150,
  gridExport: 160,
  gridImport: 180,
  battery: 220,
};

const ASSET_WIDTH = 960;
const ASSET_HEIGHT = 727;

export function heroImagePx(orientation: OverviewOrientation): { width: number; height: number } {
  if (orientation === "landscape") {
    const width = 560;
    return { width, height: (width * ASSET_HEIGHT) / ASSET_WIDTH };
  }
  const frameWidth = 680;
  const frameHeight = 560;
  const scale = Math.min(frameWidth / ASSET_WIDTH, frameHeight / ASSET_HEIGHT);
  return { width: ASSET_WIDTH * scale, height: ASSET_HEIGHT * scale };
}

function toPoints(raw: [number, number][] | undefined): Point[] {
  if (!raw) return [];
  return raw.map(([x, y]) => ({ x, y }));
}

export function variantAnchors(variant: HouseVariantId): VariantJson {
  return variants[variant] ?? {};
}

export function anchorPoint(variant: HouseVariantId, key: "zon_panelen" | "omvormer_kastje" | "batterij" | "net_voordeur" | "huis"): Point | null {
  const point = variantAnchors(variant)[key];
  if (!point?.aanwezig || !point.pct) return null;
  return { x: point.pct[0], y: point.pct[1] };
}

/** Panel polygon from the JSON, plus the simplified house body. */
export function silhouetteRings(variant: HouseVariantId): Point[][] {
  const rings: Point[][] = [HOUSE_BODY];
  const panels = toPoints(variantAnchors(variant).polygonen_pct?.panelen);
  if (panels.length >= 3) rings.push(panels);
  return rings;
}

export function mintLine(variant: HouseVariantId): Point[] {
  const polygons = variantAnchors(variant).polygonen_pct;
  if (!polygons) return [];
  const raw = variant.startsWith("nacht-") ? polygons.mint_lijn_nacht : polygons.mint_lijn_dag;
  return toPoints(raw);
}

export function panelPolygon(variant: HouseVariantId): Point[] {
  return toPoints(variantAnchors(variant).polygonen_pct?.panelen);
}

export function batteryLed(variant: HouseVariantId): Point[] {
  return toPoints(variantAnchors(variant).polygonen_pct?.batterij_led);
}

export function samplePolyline(points: readonly Point[], count: number): Point[] {
  if (count <= 0 || points.length === 0) return [];
  if (points.length === 1 || count === 1) return Array.from({ length: count }, () => points[0] as Point);
  const lengths = [0];
  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1] as Point;
    const next = points[index] as Point;
    lengths.push(lengths[index - 1] + Math.hypot(next.x - prev.x, next.y - prev.y));
  }
  const total = lengths[lengths.length - 1] || 1;
  const sampled: Point[] = [];
  for (let step = 0; step < count; step += 1) {
    const distance = (step / (count - 1)) * total;
    let index = 1;
    while (index < lengths.length - 1 && (lengths[index] ?? 0) < distance) index += 1;
    const start = lengths[index - 1] ?? 0;
    const end = lengths[index] ?? start;
    const span = end - start || 1;
    const t = (distance - start) / span;
    const a = points[index - 1] as Point;
    const b = points[index] as Point;
    sampled.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return sampled;
}

function cross(origin: Point, a: Point, b: Point): number {
  return (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
}

function segmentsCross(a: Point, b: Point, c: Point, d: Point): boolean {
  const d1 = cross(c, d, a);
  const d2 = cross(c, d, b);
  const d3 = cross(a, b, c);
  const d4 = cross(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

export function pointInPolygon(point: Point, polygon: readonly Point[]): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const current = polygon[index] as Point;
    const prior = polygon[previous] as Point;
    const crosses = current.y > point.y !== prior.y > point.y;
    if (!crosses) continue;
    const x = ((prior.x - current.x) * (point.y - current.y)) / (prior.y - current.y) + current.x;
    if (point.x < x) inside = !inside;
  }
  return inside;
}

export function rectOverlapsPolygon(
  rect: { x: number; y: number; w: number; h: number },
  polygon: readonly Point[]
): boolean {
  if (polygon.length < 3 || rect.w <= 0 || rect.h <= 0) return false;
  const corners: Point[] = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x + rect.w, y: rect.y + rect.h },
    { x: rect.x, y: rect.y + rect.h },
  ];
  if (corners.some((corner) => pointInPolygon(corner, polygon))) return true;
  if (polygon.some((point) => point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h)) {
    return true;
  }
  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index] as Point;
    const end = polygon[(index + 1) % polygon.length] as Point;
    for (let edge = 0; edge < corners.length; edge += 1) {
      const c = corners[edge] as Point;
      const d = corners[(edge + 1) % corners.length] as Point;
      if (segmentsCross(start, end, c, d)) return true;
    }
  }
  return false;
}

function percentBox(originXPct: number, originYPct: number, widthPx: number, heightPx: number, image: { width: number; height: number }) {
  return {
    x: originXPct,
    y: originYPct,
    w: (widthPx / image.width) * 100,
    h: (heightPx / image.height) * 100,
  };
}

/**
 * At most four pills. Landscape is the tighter frame; boxes stay in the top and bottom gutters,
 * outside the silhouette, with a 50px height and a touch target of at least 44px.
 */
export function labelLayout(
  variant: HouseVariantId,
  orientation: OverviewOrientation,
  labels: readonly HeroLabelKind[]
): PlacedLabel[] {
  const image = heroImagePx(orientation);
  if (silhouetteRings(variant).length === 0) return [];
  const unique: HeroLabelKind[] = [];
  for (const kind of HERO_LABEL_KINDS) {
    if (labels.includes(kind)) unique.push(kind);
    if (unique.length >= 4) break;
  }
  const heightPct = (LABEL_HEIGHT_PX / image.height) * 100;
  const placed: PlacedLabel[] = [];
  for (const kind of unique) {
    const widthPx = LABEL_WIDTH_PX[kind];
    const widthPct = (widthPx / image.width) * 100;
    const top = kind === "solar" || kind === "gridExport";
    const left = kind === "solar" || kind === "gridImport";
    const xPct = left ? 0 : Math.max(0, 100 - widthPct);
    const yPct = top ? 0 : Math.max(0, 100 - heightPct);
    placed.push({
      kind,
      xPct,
      yPct,
      widthPx,
      heightPx: LABEL_HEIGHT_PX,
      touchWidthPx: Math.max(widthPx, 44),
      touchHeightPx: Math.max(LABEL_HEIGHT_PX, 44),
    });
  }
  return placed;
}

export function labelOverlapsSilhouette(
  variant: HouseVariantId,
  orientation: OverviewOrientation,
  label: PlacedLabel
): boolean {
  const image = heroImagePx(orientation);
  const rect = percentBox(label.xPct, label.yPct, label.widthPx, label.heightPx, image);
  return silhouetteRings(variant).some((ring) => rectOverlapsPolygon(rect, ring));
}

export function isHouseVariant(value: string): value is HouseVariantId {
  return (HOUSE_VARIANTS as readonly string[]).includes(value);
}
