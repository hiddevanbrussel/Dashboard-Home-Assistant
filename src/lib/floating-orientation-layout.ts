/**
 * Portrait and landscape each keep their own floating-card positions.
 * Widgets keep reading and writing the existing `dashboard.floating*` keys.
 * This module swaps those keys and builds the portrait set outside the widgets.
 *
 * Climate persists its viewport clamp (`floating-climate-card.tsx` around the
 * saved-position and size-change effects). Portrait positions for that card are
 * written before it mounts and stay inside that clamp, so the write stores the
 * same value. Landscape bytes live in the layout record, not in the active key.
 */
import { snapToGrid } from "@/lib/floating-card-grid";
import { cardDefaultPosition } from "@/lib/floating-card-defaults";
import { TILE_SIDEBAR_INSET_PX } from "@/lib/tile-placement";
import {
  clampCalendarCardHeight,
  clampCalendarCardWidth,
  CALENDAR_CARD_DEFAULT_HEIGHT,
  CALENDAR_CARD_DEFAULT_WIDTH,
} from "@/lib/calendar-card";
import {
  clampCameraCardHeight,
  clampCameraCardWidth,
  CAMERA_CARD_DEFAULT_HEIGHT,
  CAMERA_CARD_DEFAULT_WIDTH,
} from "@/lib/camera-card";
import {
  clampClimateCardHeight,
  clampClimateCardWidth,
  climateCardDefaultSizeForMode,
  normalizeClimateDisplayMode,
} from "@/lib/climate-card";
import {
  clampEnergyMonitorCardHeight,
  clampEnergyMonitorCardWidth,
  ENERGY_MONITOR_CARD_DEFAULT_HEIGHT,
  ENERGY_MONITOR_CARD_DEFAULT_WIDTH,
} from "@/lib/energy-monitor-card";
import {
  clampMediaCardHeight,
  clampMediaCardWidth,
  MEDIA_CARD_DEFAULT_HEIGHT,
  MEDIA_CARD_DEFAULT_WIDTH,
} from "@/lib/media-card";
import {
  clampNutsCardHeight,
  clampNutsCardWidth,
  NUTS_CARD_DEFAULT_HEIGHT,
  NUTS_CARD_DEFAULT_WIDTH,
} from "@/lib/nuts-card";
import {
  clampRoomCardHeight,
  clampRoomCardWidth,
  ROOM_CARD_DEFAULT_HEIGHT,
  ROOM_CARD_DEFAULT_WIDTH,
} from "@/lib/room-card";
import {
  clampSmartStackHeight,
  clampSmartStackWidth,
  SMART_STACK_DEFAULT_HEIGHT,
  SMART_STACK_DEFAULT_WIDTH,
} from "@/lib/smart-stack";
import {
  clampTeamtrackerCardHeight,
  clampTeamtrackerCardWidth,
  TEAMTRACKER_CARD_DEFAULT_HEIGHT,
  TEAMTRACKER_CARD_DEFAULT_WIDTH,
} from "@/lib/teamtracker-card";
import {
  clampTrashCardHeight,
  clampTrashCardWidth,
  TRASH_CARD_DEFAULT_HEIGHT,
  TRASH_CARD_DEFAULT_WIDTH,
} from "@/lib/trash-card";
import {
  clampVacuumCard2Height,
  clampVacuumCard2Width,
  VACUUM_CARD_2_DEFAULT_HEIGHT,
  VACUUM_CARD_2_DEFAULT_WIDTH,
} from "@/lib/vacuum-card";
import {
  clampWeatherCardHeight,
  clampWeatherCardWidth,
  WEATHER_CARD_DEFAULT_HEIGHT,
  WEATHER_CARD_DEFAULT_WIDTH,
} from "@/lib/weather-card";
import type { PositionStorage } from "@/lib/dashboard-page-removal";

export const FLOATING_LAYOUT_PREFIX = "dashboard.floatingLayout.v1.";
export const GRID = 16;
export const GAP = 16;
export const MARGIN_LEFT = 96;
export const MARGIN_RIGHT = 16;
export const MARGIN_TOP = 80;

/**
 * Landscape placement top. `topInset` is the header bottom plus GAP.
 * A missing or shorter measurement stays on MARGIN_TOP, snapped up onto the grid.
 * Portrait placement does not call this.
 */
export function landscapeMarginTop(topInset: number | undefined): number {
  if (topInset == null || !Number.isFinite(topInset)) return MARGIN_TOP;
  const bounded = Math.max(MARGIN_TOP, topInset);
  return Math.ceil(bounded / GRID) * GRID;
}
/** Delete control sits about 10px outside the top and right of the card. */
export const REMOVE_BADGE_OUTSET_PX = 10;
/** Page bar is 28px. On-screen tiles stay at least 32px above the viewport bottom. */
export const MIN_VISIBLE_BOTTOM_PX = 32;
/** Shown once per browser session, not on every rotation. */
export const PORTRAIT_BELOW_FOLD_NOTICE_KEY = "dashboard.floatingLayout.portraitBelowFoldSeen";

export type Orientation = "landscape" | "portrait";
export type PortraitSource = "afgeleid" | "gebruiker";
export type LayoutNotice = "landscape-overlap" | "portrait-below-fold";

export type FloatingLayoutV1 = {
  v: 1;
  active: Orientation;
  landscape: Record<string, string>;
  portrait: Record<string, string> | null;
  portraitBron: PortraitSource | null;
  /**
   * Landscape placement line last used for automatic tiles.
   * Absent on older records; those stored tiles are left where they are.
   */
  landscapeTop?: number;
  /**
   * Positions last written by automatic landscape placement.
   * A stored string that differs is a tile the user moved, and it stays put.
   */
  auto?: Record<string, string>;
};

export type Box = { x: number; y: number; w: number; h: number };

export type PlacedTile = Box & {
  id: string;
  left: number;
  bottom: number;
  anchor?: boolean;
  persistsClamp?: boolean;
  bottomInset?: number;
};

export type FloatingTile = {
  id: string;
  key: string;
  page: number;
  shared: boolean;
  persistsClamp: boolean;
  w: number;
  h: number;
  bottomInset: number;
  legacyTopOffset: number;
  /**
   * Not on the floating layer right now (e.g. a stat pill pinned to the top bar).
   * Its keys are kept in both orientation sets and swapped like any other tile,
   * but it is ignored for placing, pushing and overlap/below-fold checks.
   */
  parked?: boolean;
  /**
   * First-mount position of a light or sensor card for the current viewport.
   * Only those two types set it. Reconcile uses it to recognize a stored card default.
   */
  cardDefault?: { left: number; bottom: number };
  /**
   * False when the widget width, height, or scale differs from the standard size.
   * A scaled tile is never moved off a stored card default.
   */
  defaultSize?: boolean;
};

/** Tiles that take part in placing and pushing (everything that is not parked). */
export function placingTiles<T extends { parked?: boolean }>(tiles: readonly T[]): T[] {
  return tiles.filter((tile) => !tile.parked);
}

export type FloatingWidgetInput = {
  id: string;
  type: string;
  page?: number;
  width?: number;
  height?: number;
  card_layout?: "horizontal" | "square";
  size?: string;
  display_mode?: string;
  /** See `FloatingTile.parked`. */
  parked?: boolean;
  /** User scale. 1 and absent both mean the card was not scaled. */
  scale?: number;
};

type KeyShape = "scope" | "widget" | "id";

type KeySpec = {
  prefix: string;
  shape: KeyShape;
  shared: boolean;
  persistsClamp: boolean;
  bottomInset: number;
  legacyTopOffset: number;
  types: readonly string[];
};

const KEY_SPECS: readonly KeySpec[] = [
  spec("dashboard.floatingClimateCardPosition", "scope", ["climate_card", "climate_card_2"], { shared: true, persistsClamp: true, bottomInset: 24, legacyTopOffset: 200 }),
  spec("dashboard.floatingWeatherCardPosition", "scope", ["weather_card"], { shared: true, bottomInset: 24, legacyTopOffset: 200 }),
  spec("dashboard.floatingSolarCardPosition", "scope", ["solar_card"], { shared: true, legacyTopOffset: 200 }),
  spec("dashboard.floatingVacuumCardPosition", "scope", ["vacuum_card"], { shared: true, legacyTopOffset: 200 }),
  spec("dashboard.floatingDeviceConsumptionCardPosition", "scope", ["device_consumption_card"], { shared: true, legacyTopOffset: 320 }),
  spec("dashboard.floatingPowerUsageCardPosition", "scope", ["power_usage_card"], { shared: true, legacyTopOffset: 380 }),
  spec("dashboard.floatingMediaCardPosition", "widget", ["media_card"], { legacyTopOffset: 200 }),
  spec("dashboard.floatingCameraCardPosition", "widget", ["camera_card"], { legacyTopOffset: 270 }),
  spec("dashboard.floatingEnergyMonitorCardPosition", "widget", ["energy_monitor_card"], { legacyTopOffset: 260 }),
  spec("dashboard.floatingTeamtrackerCardPosition", "widget", ["teamtracker_card"], { legacyTopOffset: 200 }),
  spec("dashboard.floatingAlarmCardPosition.", "widget", ["alarm_card"], { legacyTopOffset: 200 }),
  spec("dashboard.floatingCalendarCardPosition.", "widget", ["calendar_card"], { legacyTopOffset: 0 }),
  spec("dashboard.floatingLightCardPosition.", "widget", ["light_card"], { legacyTopOffset: 80 }),
  spec("dashboard.floatingSensorCardPosition.", "widget", ["sensor_card"], { legacyTopOffset: 200 }),
  spec("dashboard.floatingTextCardPosition.", "widget", ["text_card", "title_card", "title_only_card", "subtitle_card"], { legacyTopOffset: 120 }),
  spec("dashboard.floatingPillCardPosition.", "widget", ["pill_card"], { legacyTopOffset: 80 }),
  spec("dashboard.floatingRoomCardPosition.", "widget", ["room_card"], { legacyTopOffset: 200 }),
  spec("dashboard.floatingNutsCardPosition.", "widget", ["nuts_card"], { legacyTopOffset: 0 }),
  spec("dashboard.floatingCardGroupPosition.", "widget", ["card_group"], { legacyTopOffset: 120 }),
  spec("dashboard.floatingChoreCard.", "widget", ["chore_card"], { legacyTopOffset: 120 }),
  spec("dashboard.floatingTimerCard.", "widget", ["timer_card"], { legacyTopOffset: 120 }),
  spec("dashboard.floatingTrashCardPosition.", "widget", ["trash_card"], { legacyTopOffset: 0 }),
  spec("dashboard.floatingSmartStackPosition.", "widget", ["smart_stack"], { legacyTopOffset: 200 }),
  spec("dashboard.floatingStatPillCardPosition.", "widget", ["stat_pill_card"], { legacyTopOffset: 44 }),
  spec("dashboard.floatingVacuumHeroCardPosition.v2.", "widget", ["vacuum_card_2"], { legacyTopOffset: 0 }),
  spec("dashboard.floatingEnergyMetricPosition.", "widget", ["energy_metric"], { legacyTopOffset: 56 }),
  spec("dashboard.floatingWelcomeCardPosition.", "id", [], { legacyTopOffset: 120 }),
];

const SPEC_BY_TYPE = new Map<string, KeySpec>();
for (const entry of KEY_SPECS) {
  for (const type of entry.types) SPEC_BY_TYPE.set(type, entry);
}

function spec(
  prefix: string,
  shape: KeyShape,
  types: readonly string[],
  extra: Partial<Pick<KeySpec, "shared" | "persistsClamp" | "bottomInset" | "legacyTopOffset">> = {}
): KeySpec {
  return {
    prefix,
    shape,
    types,
    shared: extra.shared ?? false,
    persistsClamp: extra.persistsClamp ?? false,
    bottomInset: extra.bottomInset ?? 0,
    legacyTopOffset: extra.legacyTopOffset ?? 200,
  };
}

/** Every storage prefix declared by a floating card, without a trailing dot. */
export function floatingStoragePrefixes(): string[] {
  return KEY_SPECS.map((entry) => entry.prefix.replace(/\.$/, ""));
}

export function layoutStorageKey(dashboardId: string): string {
  return `${FLOATING_LAYOUT_PREFIX}${dashboardId}`;
}

export function currentOrientation(width: number, height: number): Orientation {
  return height > width ? "portrait" : "landscape";
}

export function floatingStorageKey(type: string, scope: string, widgetId: string): string | null {
  const entry = SPEC_BY_TYPE.get(type);
  if (!entry) return null;
  if (entry.shape === "scope") return `${entry.prefix}.${scope}`;
  if (entry.shape === "id") return `${entry.prefix}${widgetId}`;
  const dot = entry.prefix.endsWith(".") ? "" : ".";
  return `${entry.prefix}${dot}${scope}.${widgetId}`;
}

export function floatingTilesFromWidgets(
  widgets: readonly FloatingWidgetInput[],
  scope: string,
  viewport?: { width: number; height: number }
): FloatingTile[] {
  const tiles: FloatingTile[] = [];
  // Same order as the dashboard render: filter by type and page, keep widgets order.
  // page.tsx light map is widgetIndex i (around 3096-3097); sensor map is the same (around 3257-3258).
  const indexOnPage = new Map<string, number>();
  for (const widget of widgets) {
    const entry = SPEC_BY_TYPE.get(widget.type);
    const key = floatingStorageKey(widget.type, scope, widget.id);
    if (!entry || !key) continue;
    const size = sizeForWidget(widget);
    const legacyTopOffset = entry.legacyTopOffset > 0 ? entry.legacyTopOffset : size.h;
    const page = pageOf(widget.page);
    const cardDefault = cardDefaultForWidget(widget, page, size, viewport, indexOnPage);
    tiles.push({
      id: widget.id,
      key,
      page,
      shared: entry.shared,
      persistsClamp: entry.persistsClamp,
      w: size.w,
      h: size.h,
      bottomInset: entry.bottomInset,
      legacyTopOffset,
      ...(widget.parked ? { parked: true } : {}),
      ...(cardDefault ? { cardDefault: cardDefault.position, defaultSize: cardDefault.defaultSize } : {}),
    });
  }
  return tiles;
}

function cardDefaultForWidget(
  widget: FloatingWidgetInput,
  page: number,
  size: { w: number; h: number },
  viewport: { width: number; height: number } | undefined,
  indexOnPage: Map<string, number>
): { position: { left: number; bottom: number }; defaultSize: boolean } | null {
  if (widget.type !== "light_card" && widget.type !== "sensor_card") return null;
  const bucket = `${widget.type}:${page}`;
  const index = indexOnPage.get(bucket) ?? 0;
  indexOnPage.set(bucket, index + 1);
  if (!viewport || viewport.width <= 0 || viewport.height <= 0) return null;
  const position = cardDefaultPosition(widget.type, index, size, viewport);
  if (!position) return null;
  return { position, defaultSize: widgetHasDefaultSize(widget, size) };
}

/** True when width, height, and scale still match the sizeForWidget standard. */
function widgetHasDefaultSize(widget: FloatingWidgetInput, standard: { w: number; h: number }): boolean {
  if (typeof widget.scale === "number" && Number.isFinite(widget.scale) && widget.scale !== 1) return false;
  if (typeof widget.width === "number" && Number.isFinite(widget.width) && widget.width > 0 && widget.width !== standard.w) return false;
  if (typeof widget.height === "number" && Number.isFinite(widget.height) && widget.height > 0 && widget.height !== standard.h) return false;
  return true;
}

function pageOf(page: number | undefined): number {
  if (typeof page !== "number" || !Number.isFinite(page)) return 0;
  return Math.max(0, Math.round(page));
}

function sizeForWidget(widget: FloatingWidgetInput): { w: number; h: number } {
  switch (widget.type) {
    case "climate_card":
    case "climate_card_2": {
      const defaults = climateCardDefaultSizeForMode(normalizeClimateDisplayMode(widget.display_mode));
      return {
        w: clampClimateCardWidth(widget.width ?? defaults.width),
        h: clampClimateCardHeight(widget.height ?? defaults.height),
      };
    }
    case "weather_card":
      return {
        w: clampWeatherCardWidth(widget.width ?? WEATHER_CARD_DEFAULT_WIDTH),
        h: clampWeatherCardHeight(widget.height ?? WEATHER_CARD_DEFAULT_HEIGHT),
      };
    case "media_card":
      return {
        w: clampMediaCardWidth(widget.width ?? MEDIA_CARD_DEFAULT_WIDTH),
        h: clampMediaCardHeight(widget.height ?? MEDIA_CARD_DEFAULT_HEIGHT),
      };
    case "camera_card":
      return {
        w: clampCameraCardWidth(widget.width ?? CAMERA_CARD_DEFAULT_WIDTH),
        h: clampCameraCardHeight(widget.height ?? CAMERA_CARD_DEFAULT_HEIGHT),
      };
    case "calendar_card":
      return {
        w: clampCalendarCardWidth(widget.width ?? CALENDAR_CARD_DEFAULT_WIDTH),
        h: clampCalendarCardHeight(widget.height ?? CALENDAR_CARD_DEFAULT_HEIGHT),
      };
    case "energy_monitor_card":
      return {
        w: clampEnergyMonitorCardWidth(widget.width ?? ENERGY_MONITOR_CARD_DEFAULT_WIDTH),
        h: clampEnergyMonitorCardHeight(widget.height ?? ENERGY_MONITOR_CARD_DEFAULT_HEIGHT),
      };
    case "teamtracker_card":
      return {
        w: clampTeamtrackerCardWidth(widget.width ?? TEAMTRACKER_CARD_DEFAULT_WIDTH),
        h: clampTeamtrackerCardHeight(widget.height ?? TEAMTRACKER_CARD_DEFAULT_HEIGHT),
      };
    case "nuts_card":
      return {
        w: clampNutsCardWidth(widget.width ?? NUTS_CARD_DEFAULT_WIDTH),
        h: clampNutsCardHeight(widget.height ?? NUTS_CARD_DEFAULT_HEIGHT),
      };
    case "room_card":
      return {
        w: clampRoomCardWidth(widget.width ?? ROOM_CARD_DEFAULT_WIDTH),
        h: clampRoomCardHeight(widget.height ?? ROOM_CARD_DEFAULT_HEIGHT),
      };
    case "trash_card":
      return {
        w: clampTrashCardWidth(widget.width ?? TRASH_CARD_DEFAULT_WIDTH),
        h: clampTrashCardHeight(widget.height ?? TRASH_CARD_DEFAULT_HEIGHT),
      };
    case "vacuum_card_2":
      return {
        w: clampVacuumCard2Width(widget.width ?? VACUUM_CARD_2_DEFAULT_WIDTH),
        h: clampVacuumCard2Height(widget.height ?? VACUUM_CARD_2_DEFAULT_HEIGHT),
      };
    case "smart_stack":
      return {
        w: clampSmartStackWidth(widget.width ?? SMART_STACK_DEFAULT_WIDTH),
        h: clampSmartStackHeight(widget.height ?? SMART_STACK_DEFAULT_HEIGHT),
      };
    case "light_card":
      return widget.card_layout === "square" ? { w: 160, h: 160 } : { w: 240, h: 70 };
    case "sensor_card": {
      const width = widget.size === "sm" ? 180 : widget.size === "lg" ? 320 : 260;
      const height = widget.size === "sm" ? 96 : widget.size === "lg" ? 124 : 108;
      return { w: width, h: height };
    }
    case "text_card":
    case "title_card":
    case "title_only_card":
    case "subtitle_card":
      return { w: finite(widget.width, 280), h: finite(widget.height, 72) };
    case "pill_card":
    case "chore_card":
    case "timer_card":
      return { w: 280, h: finite(widget.height, 72) };
    case "alarm_card":
      return { w: 300, h: finite(widget.height, 160) };
    case "solar_card":
    case "vacuum_card":
      return { w: 320, h: finite(widget.height, 200) };
    case "device_consumption_card":
      return { w: 320, h: 320 };
    case "power_usage_card":
      return { w: 400, h: 380 };
    case "card_group":
      return { w: finite(widget.width, 280), h: finite(widget.height, 120) };
    case "stat_pill_card":
      return { w: 140, h: 44 };
    case "energy_metric":
      return { w: 140, h: 56 };
    default: {
      const exhaustive: never = widget.type as never;
      return { w: finite(widget.width, 240), h: finite(widget.height, 120) || exhaustive };
    }
  }
}

function finite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

export function positionString(left: number, bottom: number): string {
  return JSON.stringify({ left, bottom });
}

export function parseStoredPosition(
  raw: string,
  legacyTopOffset: number,
  viewportHeight: number
): { left: number; bottom: number; top: number | null } | null {
  try {
    const parsed = JSON.parse(raw) as { left?: unknown; bottom?: unknown; top?: unknown };
    if (typeof parsed.left !== "number" || !Number.isFinite(parsed.left)) return null;
    if (typeof parsed.bottom === "number" && Number.isFinite(parsed.bottom)) {
      return { left: parsed.left, bottom: parsed.bottom, top: null };
    }
    if (typeof parsed.top === "number" && Number.isFinite(parsed.top)) {
      return {
        left: parsed.left,
        bottom: viewportHeight - parsed.top - legacyTopOffset,
        top: parsed.top,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function readingOrder<T extends Box>(tiles: readonly T[]): T[] {
  const sorted = [...tiles].sort((a, b) => a.y - b.y || a.x - b.x);
  const rows: { top: number; bottom: number; tiles: T[] }[] = [];
  for (const tile of sorted) {
    const tileBottom = tile.y + tile.h;
    const row = rows.find((candidate) => {
      const overlap = Math.min(candidate.bottom, tileBottom) - Math.max(candidate.top, tile.y);
      const minHeight = Math.min(candidate.bottom - candidate.top, tile.h);
      return minHeight > 0 && overlap >= 0.5 * minHeight;
    });
    if (!row) {
      rows.push({ top: tile.y, bottom: tileBottom, tiles: [tile] });
    } else {
      row.top = Math.min(row.top, tile.y);
      row.bottom = Math.max(row.bottom, tileBottom);
      row.tiles.push(tile);
    }
  }
  rows.sort((a, b) => a.top - b.top);
  return rows.flatMap((row) => row.tiles.sort((a, b) => a.x - b.x || a.y - b.y));
}

function separated(a: Box, b: Box, gap: number): boolean {
  return (
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  );
}

function inflateBadge(box: Box): Box {
  return {
    x: box.x,
    y: box.y - REMOVE_BADGE_OUTSET_PX,
    w: box.w + REMOVE_BADGE_OUTSET_PX,
    h: box.h + REMOVE_BADGE_OUTSET_PX,
  };
}

/** Card edges stay at least GAP apart, and the delete badge stays inside that margin. */
export function blocksPlacement(a: Box, b: Box): boolean {
  if (!separated(a, b, GAP)) return true;
  return !separated(inflateBadge(a), inflateBadge(b), 0);
}

export function rectsIntersect(a: Box, b: Box): boolean {
  return !separated(a, b, 0);
}

/** True when card rectangles or their delete badges occupy the same pixels. */
export function visuallyOverlaps(a: Box, b: Box): boolean {
  return rectsIntersect(inflateBadge(a), inflateBadge(b));
}

export function overlapPairs<T extends Box & { id: string }>(tiles: readonly T[], mode: "pixels" | "gap" = "pixels"): [string, string][] {
  const pairs: [string, string][] = [];
  for (let index = 0; index < tiles.length; index += 1) {
    for (let other = index + 1; other < tiles.length; other += 1) {
      const hit = mode === "gap" ? blocksPlacement(tiles[index], tiles[other]) : visuallyOverlaps(tiles[index], tiles[other]);
      if (hit) pairs.push([tiles[index].id, tiles[other].id]);
    }
  }
  return pairs;
}

export function floorBottom(viewportHeight: number, y: number, height: number): number {
  return Math.floor((viewportHeight - y - height) / GRID) * GRID;
}

export function scrollOverflowPx(bottoms: readonly number[]): number {
  if (bottoms.length === 0) return 0;
  const lowest = Math.min(...bottoms);
  if (!Number.isFinite(lowest) || lowest >= 0) return 0;
  return Math.ceil((-lowest + GAP) / GRID) * GRID;
}

type FitInput = { id: string; w: number; h: number; persistsClamp?: boolean; bottomInset?: number };

export function firstFit(
  tiles: readonly FitInput[],
  viewport: { width: number; height: number },
  fixed: readonly Box[] = [],
  marginTop: number = MARGIN_TOP
): PlacedTile[] {
  const obstacles: Box[] = fixed.map((box) => ({ ...box }));
  const placed: PlacedTile[] = [];
  for (const tile of tiles) {
    const spot = findSpot(tile, viewport, obstacles, marginTop);
    let y = spot.y;
    let bottom = floorBottom(viewport.height, y, tile.h);
    y = viewport.height - bottom - tile.h;
    let guard = 0;
    while (hits(tile, spot.x, y, obstacles) && guard < 500) {
      y += GRID;
      bottom = floorBottom(viewport.height, y, tile.h);
      y = viewport.height - bottom - tile.h;
      guard += 1;
    }
    let settled = settleClamp(tile, spot.x, bottom, viewport);
    let settleGuard = 0;
    while (hits(tile, settled.x, settled.y, obstacles) && settleGuard < 500) {
      bottom = settled.bottom - GRID;
      if (bottom >= 0 && bottom < MIN_VISIBLE_BOTTOM_PX) bottom = -GRID;
      settled = settleClamp(tile, spot.x, bottom, viewport);
      settleGuard += 1;
    }
    placed.push(settled);
    obstacles.push(settled);
  }
  return placed;
}

function findSpot(
  tile: FitInput,
  viewport: { width: number; height: number },
  obstacles: readonly Box[],
  marginTop: number
): { x: number; y: number } {
  const maxX = viewport.width - MARGIN_RIGHT - tile.w;
  if (maxX < MARGIN_LEFT) {
    const maxLeft = Math.max(0, viewport.width - tile.w);
    const preferred = Math.min(MARGIN_LEFT, maxLeft);
    const x = Math.floor(preferred / GRID) * GRID;
    const yLimit = Math.max(viewport.height * 4, marginTop);
    for (let y = marginTop; y <= yLimit; y += GRID) {
      if (!hits(tile, x, y, obstacles)) return { x, y };
    }
    return { x, y: marginTop };
  }
  const yLimit = Math.max(viewport.height * 4, marginTop);
  for (let y = marginTop; y <= yLimit; y += GRID) {
    for (let x = MARGIN_LEFT; x <= maxX; x += GRID) {
      if (!hits(tile, x, y, obstacles)) return { x, y };
    }
  }
  return { x: MARGIN_LEFT, y: yLimit };
}

function hits(tile: FitInput, x: number, y: number, obstacles: readonly Box[]): boolean {
  const box = { x, y, w: tile.w, h: tile.h };
  return obstacles.some((obstacle) => blocksPlacement(box, obstacle));
}

function settleClamp(
  tile: FitInput,
  left: number,
  bottom: number,
  viewport: { width: number; height: number }
): PlacedTile {
  const maxLeft = Math.max(0, viewport.width - tile.w);
  const inset = tile.bottomInset ?? 0;
  const maxBottom = Math.max(0, viewport.height - tile.h - inset);
  let nextLeft = Math.max(0, Math.min(left, maxLeft));
  let nextBottom = bottom;
  const minBottom = maxBottom >= MIN_VISIBLE_BOTTOM_PX ? MIN_VISIBLE_BOTTOM_PX : 0;
  if (tile.persistsClamp) {
    const snapped = snapToGrid(
      { left: nextLeft, bottom: Math.max(minBottom, nextBottom) },
      { maxLeft, maxBottom, minBottom }
    );
    nextLeft = snapped.left;
    nextBottom = snapped.bottom;
  } else if (nextBottom > maxBottom) {
    nextBottom = Math.floor(maxBottom / GRID) * GRID;
  } else if (nextBottom >= 0 && nextBottom < MIN_VISIBLE_BOTTOM_PX && maxBottom >= MIN_VISIBLE_BOTTOM_PX) {
    nextBottom = MIN_VISIBLE_BOTTOM_PX;
  }
  return {
    id: tile.id,
    x: nextLeft,
    y: viewport.height - nextBottom - tile.h,
    w: tile.w,
    h: tile.h,
    left: nextLeft,
    bottom: nextBottom,
    persistsClamp: tile.persistsClamp,
    bottomInset: inset,
  };
}

/** Same place in one pass: the later id moves, so the earlier tile stays. */
function yieldsTo(tile: PlacedTile, other: PlacedTile): boolean {
  if (other.anchor) return true;
  if (other.y !== tile.y) return other.y < tile.y;
  if (other.x !== tile.x) return other.x < tile.x;
  return other.id < tile.id;
}

function clearBottom(
  tile: PlacedTile,
  minY: number,
  viewportHeight: number
): number {
  let bottom = floorBottom(viewportHeight, minY, tile.h);
  if (viewportHeight - bottom - tile.h < minY) bottom -= GRID;
  if (tile.persistsClamp) return Math.max(MIN_VISIBLE_BOTTOM_PX, bottom);
  if (bottom < 0 || bottom >= MIN_VISIBLE_BOTTOM_PX) return bottom;
  const raisedY = viewportHeight - MIN_VISIBLE_BOTTOM_PX - tile.h;
  if (raisedY >= minY) return MIN_VISIBLE_BOTTOM_PX;
  let dropped = -GRID;
  let guard = 0;
  while (viewportHeight - dropped - tile.h < minY && guard < 500) {
    dropped -= GRID;
    guard += 1;
  }
  return dropped;
}

function applySettled(tile: PlacedTile, settled: PlacedTile): boolean {
  const changed = settled.left !== tile.left || settled.bottom !== tile.bottom || settled.y !== tile.y;
  tile.left = settled.left;
  tile.x = settled.x;
  tile.bottom = settled.bottom;
  tile.y = settled.y;
  return changed;
}

function nudgePastOverlap(tile: PlacedTile, viewportHeight: number): boolean {
  let bottom = tile.bottom - GRID;
  if (tile.persistsClamp) bottom = Math.max(MIN_VISIBLE_BOTTOM_PX, bottom);
  else if (bottom >= 0 && bottom < MIN_VISIBLE_BOTTOM_PX) bottom = -GRID;
  if (bottom === tile.bottom) return false;
  tile.bottom = bottom;
  tile.y = viewportHeight - bottom - tile.h;
  tile.left = tile.x;
  return true;
}

function blockersOf(items: readonly PlacedTile[], tile: PlacedTile): PlacedTile[] {
  return items.filter((other) => other !== tile && blocksPlacement(tile, other));
}

/** One grid down for a tile that still overlaps, skipping the page-bar band. */
function nudgeOneYielder(items: readonly PlacedTile[], viewportHeight: number): boolean {
  const ordered = [...items].sort((a, b) => a.y - b.y || a.x - b.x || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (const tile of ordered) {
    if (tile.anchor) continue;
    const blockers = blockersOf(items, tile);
    if (blockers.length === 0 || !blockers.some((other) => yieldsTo(tile, other))) continue;
    if (nudgePastOverlap(tile, viewportHeight)) return true;
  }
  return false;
}

export function pushDown(
  tiles: readonly PlacedTile[],
  viewport: { width: number; height: number }
): { tiles: PlacedTile[]; belowFold: boolean } {
  const items = tiles.map((tile) => ({ ...tile }));
  const limit = items.length * 80 + 8;
  for (let pass = 0; pass < limit; pass += 1) {
    let moved = false;
    const ordered = [...items].sort((a, b) => a.y - b.y || a.x - b.x || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    for (const tile of ordered) {
      if (tile.anchor) continue;
      const blockers = items.filter((other) => other !== tile && blocksPlacement(tile, other));
      if (blockers.length === 0) continue;
      if (!blockers.some((other) => yieldsTo(tile, other))) continue;
      let minY = tile.y;
      for (const other of blockers) {
        const borderClear = other.y + other.h + GAP;
        const badgeClear = other.y + other.h + REMOVE_BADGE_OUTSET_PX;
        minY = Math.max(minY, borderClear, badgeClear);
      }
      if (minY <= tile.y) continue;
      let bottom = clearBottom(tile, minY, viewport.height);
      if (bottom === tile.bottom) {
        if (!nudgePastOverlap(tile, viewport.height)) continue;
        moved = true;
        continue;
      }
      tile.bottom = bottom;
      tile.y = viewport.height - bottom - tile.h;
      tile.left = tile.x;
      moved = true;
    }
    for (const tile of items) {
      if (applySettled(tile, settleClamp(tile, tile.left, tile.bottom, viewport))) moved = true;
    }
    if (overlapPairs(items, "gap").length === 0) break;
    if (!moved && !nudgeOneYielder(items, viewport.height)) break;
  }
  return { tiles: items, belowFold: items.some((tile) => tile.bottom < 0) };
}

export type DerivedPortrait = {
  positions: Record<string, string>;
  source: PortraitSource;
};

type StoredTile = FloatingTile & { raw: string };

export function derivePortrait(
  tiles: readonly FloatingTile[],
  stored: Readonly<Record<string, string>>,
  portrait: { width: number; height: number },
  landscape: { width: number; height: number },
  forceFit = false
): DerivedPortrait {
  const ready = tiles.flatMap((tile) => {
    const raw = stored[tile.key];
    return raw ? [{ ...tile, raw }] : [];
  });
  const pages = pageNumbers(ready);
  if (!forceFit && pages.every((page) => !pageOverlaps(ready, page, portrait))) {
    return { positions: clampedPositions(ready, portrait), source: "gebruiker" };
  }
  return { positions: fitPages(ready, portrait, landscape.height), source: "afgeleid" };
}

function pageNumbers(tiles: readonly StoredTile[]): number[] {
  return [...new Set(tiles.map((tile) => tile.page))].sort((a, b) => a - b);
}

function tilesVisibleOnPage(tiles: readonly StoredTile[], page: number): StoredTile[] {
  const seen = new Set<string>();
  const visible: StoredTile[] = [];
  for (const tile of tiles) {
    if (tile.page !== page && !tile.shared) continue;
    if (seen.has(tile.key)) continue;
    seen.add(tile.key);
    visible.push(tile);
  }
  return visible;
}

function pageOverlaps(
  tiles: readonly StoredTile[],
  page: number,
  portrait: { width: number; height: number }
): boolean {
  const boxes = tilesVisibleOnPage(tiles, page)
    .map((tile) => clampedBox(tile, portrait))
    .filter((box): box is PlacedTile => box != null);
  return overlapPairs(boxes, "pixels").length > 0;
}

function clampedPositions(
  tiles: readonly StoredTile[],
  portrait: { width: number; height: number }
): Record<string, string> {
  const positions: Record<string, string> = {};
  for (const tile of tiles) {
    const box = clampedBox(tile, portrait);
    if (!box) continue;
    positions[tile.key] = positionString(box.left, box.bottom);
  }
  return positions;
}

function clampedBox(
  tile: StoredTile,
  portrait: { width: number; height: number }
): PlacedTile | null {
  const parsed = parseStoredPosition(tile.raw, tile.legacyTopOffset, portrait.height);
  if (!parsed) return null;
  const maxLeft = Math.max(0, portrait.width - tile.w);
  const maxBottom = Math.max(0, portrait.height - tile.h - tile.bottomInset);
  const clamped = snapToGrid(
    { left: parsed.left, bottom: parsed.bottom },
    { maxLeft, maxBottom }
  );
  return {
    id: tile.key,
    left: clamped.left,
    bottom: clamped.bottom,
    x: clamped.left,
    y: portrait.height - clamped.bottom - tile.h,
    w: tile.w,
    h: tile.h,
  };
}

function fitPages(
  tiles: readonly StoredTile[],
  portrait: { width: number; height: number },
  landscapeHeight: number
): Record<string, string> {
  const shared = new Map<string, Box>();
  const positions: Record<string, string> = {};
  const pages = pageNumbers(tiles);
  for (const page of pages) {
    const group = tiles.filter((tile) => tile.page === page);
    const ordered = readingOrder(group.flatMap((tile) => {
      const box = landscapeBox(tile, landscapeHeight);
      return box ? [{ ...tile, ...box }] : [];
    }));
    const batch: (StoredTile & Box)[] = [];
    for (const tile of ordered) {
      if (tile.shared && shared.has(tile.key)) continue;
      if (positions[tile.key]) continue;
      batch.push(tile);
    }
    const fixed = [...shared.values()];
    const fitted = firstFit(
      batch.map((tile) => ({
        id: tile.key,
        w: tile.w,
        h: tile.h,
        persistsClamp: tile.persistsClamp,
        bottomInset: tile.bottomInset,
      })),
      portrait,
      fixed
    );
    for (const item of fitted) {
      positions[item.id] = positionString(item.left, item.bottom);
      const source = batch.find((tile) => tile.key === item.id);
      if (source?.shared) shared.set(item.id, item);
    }
  }
  if (pages.length > 1 && shared.size > 0) {
    for (const page of pages) {
      const group = tiles.filter((tile) => tile.page === page && !shared.has(tile.key));
      const ordered = readingOrder(group.flatMap((tile) => {
        const box = landscapeBox(tile, landscapeHeight);
        return box ? [{ ...tile, ...box }] : [];
      }));
      const fitted = firstFit(
        ordered.map((tile) => ({
          id: tile.key,
          w: tile.w,
          h: tile.h,
          persistsClamp: tile.persistsClamp,
          bottomInset: tile.bottomInset,
        })),
        portrait,
        [...shared.values()]
      );
      for (const item of fitted) positions[item.id] = positionString(item.left, item.bottom);
    }
  }
  return positions;
}

function landscapeBox(tile: StoredTile, landscapeHeight: number): Box | null {
  const parsed = parseStoredPosition(tile.raw, tile.legacyTopOffset, landscapeHeight);
  if (!parsed) return null;
  const y = parsed.top ?? landscapeHeight - parsed.bottom - tile.h;
  return { x: parsed.left, y, w: tile.w, h: tile.h };
}

export function placeMissingTiles(
  positions: Record<string, string>,
  tiles: readonly FloatingTile[],
  portrait: { width: number; height: number },
  topInset?: number
): Record<string, string> {
  const marginTop = landscapeMarginTop(topInset);
  const next = { ...positions };
  const pages = [...new Set(tiles.map((tile) => tile.page))].sort((a, b) => a - b);
  for (const page of pages) {
    const missing = tiles.filter((tile) => tile.page === page && !(tile.key in next));
    if (missing.length === 0) continue;
    const fixed = tiles.flatMap((tile) => {
      if (tile.page !== page && !tile.shared) return [];
      const raw = next[tile.key];
      if (!raw) return [];
      const parsed = parseStoredPosition(raw, tile.legacyTopOffset, portrait.height);
      if (!parsed) return [];
      return [{ x: parsed.left, y: portrait.height - parsed.bottom - tile.h, w: tile.w, h: tile.h }];
    });
    const fitted = firstFit(
      missing.map((tile) => ({
        id: tile.key,
        w: tile.w,
        h: tile.h,
        persistsClamp: tile.persistsClamp,
        bottomInset: tile.bottomInset,
      })),
      portrait,
      fixed,
      marginTop
    );
    for (const item of fitted) next[item.id] = positionString(item.left, item.bottom);
  }
  return next;
}

function boxesFromPositions(
  positions: Record<string, string>,
  tiles: readonly FloatingTile[],
  viewport: { width: number; height: number },
  anchors: ReadonlySet<string> | undefined
): PlacedTile[] {
  const seen = new Set<string>();
  const placed: PlacedTile[] = [];
  for (const tile of tiles) {
    if (seen.has(tile.key)) continue;
    const raw = positions[tile.key];
    if (!raw) continue;
    const parsed = parseStoredPosition(raw, tile.legacyTopOffset, viewport.height);
    if (!parsed) continue;
    seen.add(tile.key);
    placed.push({
      id: tile.key,
      left: parsed.left,
      bottom: parsed.bottom,
      x: parsed.left,
      y: viewport.height - parsed.bottom - tile.h,
      w: tile.w,
      h: tile.h,
      anchor: anchors?.has(tile.key) ?? false,
      persistsClamp: tile.persistsClamp,
      bottomInset: tile.bottomInset,
    });
  }
  return placed;
}

export function portraitBelowFold(
  positions: Record<string, string>,
  tiles: readonly FloatingTile[],
  viewport: { width: number; height: number }
): boolean {
  return boxesFromPositions(positions, tiles, viewport, undefined).some((tile) => tile.bottom < 0);
}

/** Portrait below-fold is announced once per session. Landscape overlap is unchanged. */
export function consumeLayoutNotice(
  notice: LayoutNotice | null,
  session: { getItem(key: string): string | null; setItem(key: string, value: string): void }
): LayoutNotice | null {
  if (notice !== "portrait-below-fold") return notice;
  try {
    if (session.getItem(PORTRAIT_BELOW_FOLD_NOTICE_KEY) === "1") return null;
    session.setItem(PORTRAIT_BELOW_FOLD_NOTICE_KEY, "1");
  } catch {
    return notice;
  }
  return notice;
}

export function landscapeOverlaps(
  positions: Record<string, string>,
  tiles: readonly FloatingTile[],
  viewport: { width: number; height: number }
): boolean {
  const boxes = boxesFromPositions(positions, tiles, viewport, undefined);
  const pages = [...new Set(tiles.map((tile) => tile.page))];
  return pages.some((page) => {
    const keys = new Set(
      tiles.filter((tile) => tile.page === page || tile.shared).map((tile) => tile.key)
    );
    return overlapPairs(boxes.filter((box) => keys.has(box.id)), "pixels").length > 0;
  });
}

export function readFloatingLayout(storage: PositionStorage, dashboardId: string): FloatingLayoutV1 | null {
  const raw = storage.getItem(layoutStorageKey(dashboardId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FloatingLayoutV1;
    if (parsed?.v !== 1 || (parsed.active !== "landscape" && parsed.active !== "portrait")) return null;
    if (!parsed.landscape || typeof parsed.landscape !== "object") return null;
    const auto = readAuto(parsed.auto);
    const landscapeTop = typeof parsed.landscapeTop === "number" && Number.isFinite(parsed.landscapeTop)
      ? parsed.landscapeTop
      : undefined;
    return {
      v: 1,
      active: parsed.active,
      landscape: { ...parsed.landscape },
      portrait: parsed.portrait ? { ...parsed.portrait } : null,
      portraitBron: parsed.portraitBron === "afgeleid" || parsed.portraitBron === "gebruiker" ? parsed.portraitBron : null,
      ...(landscapeTop !== undefined ? { landscapeTop } : {}),
      ...(auto ? { auto } : {}),
    };
  } catch {
    return null;
  }
}

export function writeFloatingLayout(storage: PositionStorage, dashboardId: string, layout: FloatingLayoutV1): void {
  storage.setItem(layoutStorageKey(dashboardId), JSON.stringify(layout));
}

/** Drop keys of widgets that are gone from both orientation sets and from the active keys. */
export function pruneMissingWidgetKeys(
  storage: PositionStorage,
  dashboardId: string,
  liveKeys: ReadonlySet<string>
): string[] {
  const layout = readFloatingLayout(storage, dashboardId);
  if (!layout) return [];
  const removed = new Set<string>();
  layout.landscape = withoutMissing(layout.landscape, liveKeys, removed);
  if (layout.portrait) layout.portrait = withoutMissing(layout.portrait, liveKeys, removed);
  if (removed.size === 0) return [];
  for (const key of removed) {
    if (layout.active === "landscape" || layout.active === "portrait") storage.removeItem(key);
  }
  writeFloatingLayout(storage, dashboardId, layout);
  return [...removed];
}

function withoutMissing(
  positions: Record<string, string>,
  liveKeys: ReadonlySet<string>,
  removed: Set<string>
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(positions)) {
    if (liveKeys.has(key)) next[key] = value;
    else removed.add(key);
  }
  return next;
}

function snapshotLive(storage: PositionStorage, tiles: readonly FloatingTile[]): Record<string, string> {
  const snap: Record<string, string> = {};
  const seen = new Set<string>();
  for (const tile of tiles) {
    if (seen.has(tile.key)) continue;
    seen.add(tile.key);
    const value = storage.getItem(tile.key);
    if (value != null) snap[tile.key] = value;
  }
  return snap;
}

function applyPositions(storage: PositionStorage, previous: Record<string, string> | null, next: Record<string, string>): boolean {
  let changed = false;
  if (previous) {
    for (const key of Object.keys(previous)) {
      if (!(key in next)) {
        storage.removeItem(key);
        changed = true;
      }
    }
  }
  for (const [key, value] of Object.entries(next)) {
    if (storage.getItem(key) !== value) {
      storage.setItem(key, value);
      changed = true;
    }
  }
  return changed;
}

function sameMap(a: Record<string, string> | null, b: Record<string, string> | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

/**
 * Tiles passed to placeMissingTiles for a landscape fill.
 * Parked tiles are not given a slot, but a stored position still blocks one,
 * the same way placeMissingTiles already blocks a shared key.
 */
function landscapeTilesToPlace(
  positions: Record<string, string>,
  tiles: readonly FloatingTile[],
  placing: readonly FloatingTile[]
): readonly FloatingTile[] {
  const parkedObstacles = tiles.filter((tile) => tile.parked && tile.key in positions);
  if (parkedObstacles.length === 0) return placing;
  return [...placing, ...parkedObstacles];
}

/**
 * Landscape only. A light or sensor tile is placed again when its stored point
 * is still the card default and the user did not scale it, and either it sits
 * under the rail, or every tile it overlaps is also still on that exact default.
 * A default that overlaps a tile the user placed stays where it is.
 * Every other key is copied through.
 */
function relocateStoredCardDefaults(
  positions: Record<string, string>,
  tiles: readonly FloatingTile[],
  placing: readonly FloatingTile[],
  viewport: { width: number; height: number },
  topInset?: number
): Record<string, string> {
  const drop = new Set<string>();
  for (const tile of placing) {
    if (tile.defaultSize === false || !tile.cardDefault) continue;
    const raw = positions[tile.key];
    if (!raw) continue;
    const parsed = parseStoredPosition(raw, tile.legacyTopOffset, viewport.height);
    if (!parsed) continue;
    if (parsed.left !== tile.cardDefault.left || parsed.bottom !== tile.cardDefault.bottom) continue;
    const underRail = parsed.left < TILE_SIDEBAR_INSET_PX;
    if (!underRail && !overlapsOnlyExactDefaults(tile, parsed, placing, positions, viewport)) continue;
    drop.add(tile.key);
  }
  if (drop.size === 0) return positions;
  const stripped: Record<string, string> = {};
  for (const [key, value] of Object.entries(positions)) {
    if (!drop.has(key)) stripped[key] = value;
  }
  return placeMissingTiles(stripped, landscapeTilesToPlace(stripped, tiles, placing), viewport, topInset);
}

function isExactCardDefault(
  tile: FloatingTile,
  positions: Record<string, string>,
  viewport: { width: number; height: number }
): boolean {
  if (tile.defaultSize === false || !tile.cardDefault) return false;
  const raw = positions[tile.key];
  if (!raw) return false;
  const parsed = parseStoredPosition(raw, tile.legacyTopOffset, viewport.height);
  if (!parsed) return false;
  return parsed.left === tile.cardDefault.left && parsed.bottom === tile.cardDefault.bottom;
}

/** Overlap move only when every overlapping tile is still on its exact card default. */
function overlapsOnlyExactDefaults(
  tile: FloatingTile,
  parsed: { left: number; bottom: number },
  placing: readonly FloatingTile[],
  positions: Record<string, string>,
  viewport: { width: number; height: number }
): boolean {
  const box = {
    x: parsed.left,
    y: viewport.height - parsed.bottom - tile.h,
    w: tile.w,
    h: tile.h,
  };
  let found = false;
  for (const other of placing) {
    if (other.key === tile.key) continue;
    if (other.page !== tile.page && !other.shared && !tile.shared) continue;
    const raw = positions[other.key];
    if (!raw) continue;
    const otherParsed = parseStoredPosition(raw, other.legacyTopOffset, viewport.height);
    if (!otherParsed) continue;
    const otherBox = {
      x: otherParsed.left,
      y: viewport.height - otherParsed.bottom - other.h,
      w: other.w,
      h: other.h,
    };
    if (!visuallyOverlaps(box, otherBox)) continue;
    found = true;
    if (!isExactCardDefault(other, positions, viewport)) return false;
  }
  return found;
}

function readAuto(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const auto: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string") auto[key] = raw;
  }
  return Object.keys(auto).length > 0 ? auto : undefined;
}

function sameAuto(a: Record<string, string> | undefined, b: Record<string, string> | undefined): boolean {
  const aEmpty = !a || Object.keys(a).length === 0;
  const bEmpty = !b || Object.keys(b).length === 0;
  if (aEmpty && bEmpty) return true;
  return sameMap(a ?? {}, b ?? {});
}

/**
 * Landscape placement, including a later header line.
 * Tiles this pass (or an earlier pass) placed automatically move when the line
 * changes. A tile the user moved or scaled keeps its stored string.
 */
function applyLandscapePlacement(
  positions: Record<string, string>,
  auto: Record<string, string> | undefined,
  landscapeTop: number | undefined,
  tiles: readonly FloatingTile[],
  placing: readonly FloatingTile[],
  viewport: { width: number; height: number },
  topInset: number | undefined
): { positions: Record<string, string>; auto?: Record<string, string>; landscapeTop?: number } {
  const margin = landscapeMarginTop(topInset);
  const owned: Record<string, string> = {};
  for (const [key, value] of Object.entries(auto ?? {})) {
    if (positions[key] === value) owned[key] = value;
  }
  const scaled = new Set(placing.filter((tile) => tile.defaultSize === false).map((tile) => tile.key));
  for (const key of scaled) delete owned[key];

  const lineChanged = landscapeTop !== undefined && landscapeTop !== margin;
  const base: Record<string, string> = {};
  for (const [key, value] of Object.entries(positions)) {
    if (lineChanged && owned[key] === value) continue;
    base[key] = value;
  }
  const placed = placeMissingTiles(base, landscapeTilesToPlace(base, tiles, placing), viewport, topInset);
  const corrected = relocateStoredCardDefaults(placed, tiles, placing, viewport, topInset);
  const unchanged = sameMap(corrected, positions);
  if (unchanged && !lineChanged) {
    return { positions, auto, landscapeTop };
  }

  const nextAuto: Record<string, string> = {};
  for (const [key, value] of Object.entries(owned)) {
    if (corrected[key] === value) nextAuto[key] = value;
  }
  for (const tile of placing) {
    if (tile.defaultSize === false) continue;
    const now = corrected[tile.key];
    if (!now || positions[tile.key] === now) continue;
    nextAuto[tile.key] = now;
  }
  const autoOut = Object.keys(nextAuto).length > 0 ? nextAuto : undefined;
  return { positions: corrected, auto: autoOut, landscapeTop: margin };
}

function assignLandscapePlacement(
  layout: FloatingLayoutV1,
  applied: { positions: Record<string, string>; auto?: Record<string, string>; landscapeTop?: number }
): void {
  layout.landscape = applied.positions;
  if (applied.landscapeTop === undefined) delete layout.landscapeTop;
  else layout.landscapeTop = applied.landscapeTop;
  if (!applied.auto) delete layout.auto;
  else layout.auto = applied.auto;
}

function swappedViewport(viewport: { width: number; height: number }): { width: number; height: number } {
  return { width: viewport.height, height: viewport.width };
}

export type ReconcileInput = {
  storage: PositionStorage;
  dashboardId: string;
  orientation: Orientation;
  viewport: { width: number; height: number };
  tiles: readonly FloatingTile[];
  push: boolean;
  reportNotice: boolean;
  anchorKeys?: ReadonlySet<string>;
  rederive: boolean;
  mounted: boolean;
  /** Header bottom plus GAP. Landscape placement only; portrait ignores it. */
  topInset?: number;
};

export type ReconcileResult = {
  wrote: boolean;
  remount: boolean;
  notice: LayoutNotice | null;
  scrollOverflowPx: number;
  source: PortraitSource | null;
};

const EMPTY_RESULT: ReconcileResult = {
  wrote: false,
  remount: false,
  notice: null,
  scrollOverflowPx: 0,
  source: null,
};

export function reconcileFloatingLayout(input: ReconcileInput): ReconcileResult {
  const { storage, dashboardId, orientation, viewport, tiles } = input;
  if (!dashboardId || viewport.width <= 0 || viewport.height <= 0) return EMPTY_RESULT;
  switch (orientation) {
    case "landscape":
    case "portrait":
      break;
    default: {
      const exhaustive: never = orientation;
      throw new Error(`Unknown orientation ${String(exhaustive)}`);
    }
  }

  // Parked tiles stay live (their keys are kept and swapped) but never place, push or count for checks.
  const liveKeys = new Set(tiles.map((tile) => tile.key));
  const placing = placingTiles(tiles);
  let layout = readFloatingLayout(storage, dashboardId);
  // No record yet: landscape storage stays untouched when every placing tile
  // already has a key and none of those keys is still a card default under the
  // rail or in an overlap. A missing key is placed beside the rail, as in portrait.
  if (!layout && (orientation === "landscape" || tiles.length === 0)) {
    const missingLandscapeKey =
      orientation === "landscape" && placing.some((tile) => storage.getItem(tile.key) == null);
    let defaultsNeedMove = false;
    if (orientation === "landscape" && !missingLandscapeKey) {
      const positions: Record<string, string> = {};
      for (const tile of tiles) {
        const value = storage.getItem(tile.key);
        if (value != null) positions[tile.key] = value;
      }
      defaultsNeedMove = !sameMap(
        relocateStoredCardDefaults(positions, tiles, placing, viewport, input.topInset),
        positions
      );
    }
    if (!missingLandscapeKey && !defaultsNeedMove) return EMPTY_RESULT;
  }

  const landscapeViewport = orientation === "landscape" ? viewport : swappedViewport(viewport);
  const portraitViewport = orientation === "portrait" ? viewport : swappedViewport(viewport);
  let wrote = false;
  let remount = false;
  let notice: LayoutNotice | null = null;

  if (!layout) {
    layout = {
      v: 1,
      active: "landscape",
      landscape: snapshotLive(storage, tiles),
      portrait: null,
      portraitBron: null,
    };
    wrote = true;
  }

  const removed = collectMissing(layout, liveKeys);
  if (removed.length > 0) {
    layout.landscape = dropKeys(layout.landscape, removed);
    if (layout.portrait) layout.portrait = dropKeys(layout.portrait, removed);
    for (const key of removed) storage.removeItem(key);
    wrote = true;
  }

  if (layout.active !== orientation) {
    const leaving = snapshotLive(storage, tiles);
    if (layout.active === "landscape") layout.landscape = leaving;
    if (layout.active === "portrait") {
      const portraitEdited = !sameMap(leaving, layout.portrait) && !sameMap(leaving, layout.landscape);
      if (portraitEdited) {
        layout.portrait = leaving;
        layout.portraitBron = "gebruiker";
      }
    }
    if (orientation === "portrait" && layout.portrait == null) {
      const derived = derivePortrait(placing, layout.landscape, portraitViewport, landscapeViewport, false);
      layout.portrait = derived.positions;
      layout.portraitBron = derived.source;
    }
    if (orientation === "portrait" && layout.portrait) {
      layout.portrait = placeMissingTiles(layout.portrait, placing, portraitViewport);
      if (input.push) {
        const pushed = applyPush(layout.portrait, placing, portraitViewport, input.anchorKeys);
        layout.portrait = pushed.positions;
        if (pushed.belowFold && input.reportNotice) notice = "portrait-below-fold";
        if (input.anchorKeys && input.anchorKeys.size > 0) layout.portraitBron = "gebruiker";
      }
    }
    if (orientation === "landscape") {
      assignLandscapePlacement(
        layout,
        applyLandscapePlacement(
          layout.landscape,
          layout.auto,
          layout.landscapeTop,
          tiles,
          placing,
          viewport,
          input.topInset
        )
      );
    }
    const next = orientation === "portrait" ? layout.portrait ?? {} : layout.landscape;
    const previous = orientation === "portrait" ? layout.landscape : layout.portrait;
    layout.active = orientation;
    // The master is durable before the shared keys change, so a crash or a
    // second tab cannot mistake portrait bytes for the landscape layout.
    writeFloatingLayout(storage, dashboardId, layout);
    wrote = true;
    if (applyPositions(storage, previous, next)) remount = input.mounted;
  } else if (orientation === "portrait" && layout.portrait) {
    const current = snapshotLive(storage, tiles);
    if (sameMap(current, layout.landscape) && !sameMap(current, layout.portrait)) {
      if (applyPositions(storage, null, layout.portrait)) {
        wrote = true;
        remount = input.mounted;
      }
    } else if (!sameMap(current, layout.portrait) && !input.rederive && !input.push) {
      layout.portrait = { ...layout.portrait, ...current };
      layout.portraitBron = "gebruiker";
      wrote = true;
    }
    const missing = placeMissingTiles(layout.portrait, placing, viewport);
    if (!sameMap(missing, layout.portrait)) {
      layout.portrait = missing;
      if (applyPositions(storage, null, missing)) {
        wrote = true;
        remount = input.mounted;
      }
    }
    if (input.rederive && layout.portraitBron === "afgeleid") {
      const derived = derivePortrait(placing, layout.landscape, viewport, landscapeViewport, true);
      if (!sameMap(derived.positions, layout.portrait)) {
        layout.portrait = derived.positions;
        layout.portraitBron = "afgeleid";
        if (applyPositions(storage, null, derived.positions)) {
          wrote = true;
          remount = input.mounted;
        }
      }
    }
    if (input.push) {
      const pushed = applyPush(layout.portrait, placing, viewport, input.anchorKeys);
      if (!sameMap(pushed.positions, layout.portrait)) {
        layout.portrait = pushed.positions;
        if (applyPositions(storage, null, pushed.positions)) {
          wrote = true;
          remount = input.mounted;
        }
      }
      if (pushed.belowFold && input.reportNotice) notice = "portrait-below-fold";
      if (input.anchorKeys && input.anchorKeys.size > 0 && layout.portraitBron !== "gebruiker") {
        layout.portraitBron = "gebruiker";
        wrote = true;
      }
    }
  } else if (orientation === "landscape") {
    const current = snapshotLive(storage, tiles);
    const keysArePortrait = layout.portrait != null && sameMap(current, layout.portrait) && !sameMap(current, layout.landscape);
    if (keysArePortrait) {
      if (applyPositions(storage, null, layout.landscape)) {
        wrote = true;
        remount = input.mounted;
      }
    } else if (!sameMap(current, layout.landscape)) {
      layout.landscape = current;
      wrote = true;
    }
    const applied = applyLandscapePlacement(
      layout.landscape,
      layout.auto,
      layout.landscapeTop,
      tiles,
      placing,
      viewport,
      input.topInset
    );
    const positionsChanged = !sameMap(applied.positions, layout.landscape);
    const metaChanged = applied.landscapeTop !== layout.landscapeTop || !sameAuto(applied.auto, layout.auto);
    if (positionsChanged || metaChanged) {
      assignLandscapePlacement(layout, applied);
      if (positionsChanged && applyPositions(storage, null, applied.positions)) {
        wrote = true;
        remount = input.mounted;
      } else if (metaChanged) {
        wrote = true;
      }
    }
  }

  if (orientation === "landscape" && input.reportNotice && landscapeOverlaps(layout.landscape, placing, viewport)) {
    notice = "landscape-overlap";
  }
  if (orientation === "portrait" && layout.portrait && input.reportNotice && portraitBelowFold(layout.portrait, placing, viewport)) {
    notice = "portrait-below-fold";
  }

  if (wrote) writeFloatingLayout(storage, dashboardId, layout);

  const active = orientation === "portrait" ? layout.portrait : layout.landscape;
  const bottoms = active
    ? boxesFromPositions(active, placing, viewport, undefined).map((tile) => tile.bottom)
    : [];
  return {
    wrote,
    remount,
    notice,
    scrollOverflowPx: orientation === "portrait" ? scrollOverflowPx(bottoms) : 0,
    source: layout.portraitBron,
  };
}

function collectMissing(layout: FloatingLayoutV1, liveKeys: ReadonlySet<string>): string[] {
  const removed = new Set<string>();
  for (const key of Object.keys(layout.landscape)) {
    if (!liveKeys.has(key)) removed.add(key);
  }
  if (layout.portrait) {
    for (const key of Object.keys(layout.portrait)) {
      if (!liveKeys.has(key)) removed.add(key);
    }
  }
  return [...removed];
}

function dropKeys(positions: Record<string, string>, removed: readonly string[]): Record<string, string> {
  const next = { ...positions };
  for (const key of removed) delete next[key];
  return next;
}

function applyPush(
  positions: Record<string, string>,
  tiles: readonly FloatingTile[],
  viewport: { width: number; height: number },
  anchors: ReadonlySet<string> | undefined
): { positions: Record<string, string>; belowFold: boolean } {
  const boxes = boxesFromPositions(positions, tiles, viewport, anchors);
  const pushed = pushDown(boxes, viewport);
  const next = { ...positions };
  for (const tile of pushed.tiles) next[tile.id] = positionString(tile.left, tile.bottom);
  return { positions: next, belowFold: pushed.belowFold };
}

export type BelowFoldNode = {
  style: { left: string; bottom: string; width: string };
  offsetWidth: number;
};

/** After a card clamps `bottom` to 0, put below-fold tiles back on their stored position. */
export function revealBelowFoldTiles(nodes: Iterable<BelowFoldNode>, tiles: readonly { left: number; bottom: number; w: number }[]): number {
  const pending = tiles.filter((tile) => tile.bottom < 0);
  let changed = 0;
  for (const node of nodes) {
    const left = Number.parseFloat(node.style.left);
    const width = Number.parseFloat(node.style.width) || node.offsetWidth;
    if (!Number.isFinite(left) || !Number.isFinite(width)) continue;
    const match = closestWidth(pending, left, width, 4);
    if (!match) continue;
    if (node.style.bottom !== `${match.bottom}px`) {
      node.style.bottom = `${match.bottom}px`;
      changed += 1;
    }
  }
  return changed;
}

export type MeasurableCard = {
  style: { left: string; width: string };
  offsetWidth: number;
  offsetHeight: number;
};

/** Sizes that differ from the widget config, matched by the card's stored left edge. */
export function measuredSizeOverrides(
  nodes: Iterable<MeasurableCard>,
  tiles: readonly { key: string; left: number; w: number; h: number }[]
): Record<string, { w: number; h: number }> {
  const list = [...nodes];
  const overrides: Record<string, { w: number; h: number }> = {};
  for (const tile of tiles) {
    const match = closestWidth(
      list.map((node) => ({
        left: Number.parseFloat(node.style.left),
        w: Number.parseFloat(node.style.width) || node.offsetWidth,
        node,
      })),
      tile.left,
      tile.w,
      4
    );
    if (!match || match.node.offsetWidth <= 0 || match.node.offsetHeight <= 0) continue;
    if (Math.abs(match.node.offsetWidth - tile.w) >= 8 || Math.abs(match.node.offsetHeight - tile.h) >= 8) {
      overrides[tile.key] = { w: match.node.offsetWidth, h: match.node.offsetHeight };
    }
  }
  return overrides;
}

function closestWidth<T extends { left: number; w: number }>(
  tiles: readonly T[],
  left: number,
  width: number,
  tolerance: number
): T | null {
  let best: T | null = null;
  let bestDelta = tolerance + 1;
  for (const tile of tiles) {
    if (!Number.isFinite(tile.left) || !Number.isFinite(tile.w)) continue;
    if (Math.abs(tile.left - left) > 1.5) continue;
    const delta = Math.abs(tile.w - width);
    if (delta > tolerance || delta >= bestDelta) continue;
    best = tile;
    bestDelta = delta;
  }
  return best;
}

export function restoreBelowFoldStorage(
  storage: PositionStorage,
  tiles: readonly { key: string; left: number; bottom: number }[]
): void {
  for (const tile of tiles) {
    if (tile.bottom >= 0) continue;
    const next = positionString(tile.left, tile.bottom);
    if (storage.getItem(tile.key) !== next) storage.setItem(tile.key, next);
  }
}
