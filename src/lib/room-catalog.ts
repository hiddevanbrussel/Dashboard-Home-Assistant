/**
 * Room list and editor constants that must not rewrite stored room data.
 * Colors outside the preset set stay as stored and are still shown.
 */

export const ROOM_ICON_OPTIONS = [
  "trees",
  "popcorn",
  "utensils-crossed",
  "towel-rack",
  "baby",
  "rocket",
  "gamepad",
  "tent-tree",
  "footprints",
  "eye-closed",
  "drill",
  "shelving-unit",
  "tool-case",
] as const;

/** Each preset is at least 4.5:1 with a white icon. */
export const ROOM_ICON_COLORS = [
  "#4700B5",
  "#4F46E5",
  "#0369A1",
  "#0F766E",
  "#047857",
  "#B45309",
  "#BE123C",
  "#BE185D",
  "#475569",
] as const;

export const ROOM_ICON_COLOR_DEFAULT = ROOM_ICON_COLORS[0];

/** Spoken name per preset (i18n `roomsUi.colorName.<name>`), so a screen reader does not read a hex code. */
export const ROOM_ICON_COLOR_NAMES: Record<(typeof ROOM_ICON_COLORS)[number], string> = {
  "#4700B5": "purple",
  "#4F46E5": "indigo",
  "#0369A1": "blue",
  "#0F766E": "teal",
  "#047857": "green",
  "#B45309": "amber",
  "#BE123C": "red",
  "#BE185D": "pink",
  "#475569": "slate",
};

/** i18n key for a preset colour (any letter case), or null for a colour outside the set. */
export function roomColorNameKey(color: string | null | undefined): string | null {
  if (!color) return null;
  const preset = ROOM_ICON_COLORS.find((entry) => entry.toLowerCase() === color.trim().toLowerCase());
  return preset ? `roomsUi.colorName.${ROOM_ICON_COLOR_NAMES[preset]}` : null;
}

/**
 * Darkens the bottom of a photo enough that white type stays at least 6:1
 * over a white photograph through the two-line name and the climate row.
 */
export const ROOM_PHOTO_SCRIM =
  "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.78) 42%, rgba(0,0,0,0.45) 68%, rgba(0,0,0,0) 100%)";

/** Alpha of the scrim at 42% of the tile height, where the top of the name can sit. */
export const ROOM_PHOTO_SCRIM_TEXT_ALPHA = 0.78;

export const ROOM_FLOORS = [
  { value: "Kelder", labelKey: "rooms.floorBasement" },
  { value: "Begane grond", labelKey: "rooms.floorGround" },
  { value: "1e verdieping", labelKey: "rooms.floor1st" },
  { value: "2e verdieping", labelKey: "rooms.floor2nd" },
  { value: "3e verdieping", labelKey: "rooms.floor3rd" },
  { value: "Zolder", labelKey: "rooms.floorAttic" },
] as const;

const FLOOR_ORDER = ROOM_FLOORS.map((floor) => floor.value);

export function groupRoomsByFloor<T extends { floor?: string | null }>(
  rooms: T[]
): { floor: string; rooms: T[] }[] {
  const byFloor = new Map<string, T[]>();
  for (const room of rooms) {
    const key = room.floor?.trim() || "";
    const group = byFloor.get(key);
    if (group) group.push(room);
    else byFloor.set(key, [room]);
  }
  const grouped: { floor: string; rooms: T[] }[] = [];
  for (const floor of FLOOR_ORDER) {
    const roomsOnFloor = byFloor.get(floor);
    if (!roomsOnFloor) continue;
    grouped.push({ floor, rooms: roomsOnFloor });
    byFloor.delete(floor);
  }
  for (const [floor, roomsOnFloor] of byFloor) {
    grouped.push({ floor, rooms: roomsOnFloor });
  }
  return grouped;
}

export function floorLabelKey(floor: string): string | null {
  return ROOM_FLOORS.find((entry) => entry.value === floor)?.labelKey ?? null;
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function normalizeHex(color: string): string | null {
  const match = /^#([0-9a-fA-F]{6})$/.exec(color.trim());
  if (!match?.[1]) return null;
  return `#${match[1].toUpperCase()}`;
}

export function relativeLuminance(hex: string): number | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const n = Number.parseInt(normalized.slice(1), 16);
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number | null {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  if (fg == null || bg == null) return null;
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

/** White when it clears 4.5:1, otherwise near-black. Does not change the stored color. */
export function iconForeground(background: string | null | undefined): "#ffffff" | "#111827" {
  if (!background) return "#ffffff";
  const ratio = contrastRatio("#ffffff", background);
  if (ratio == null) return "#ffffff";
  return ratio >= 4.5 ? "#ffffff" : "#111827";
}

/** Case-insensitive for hex. Other strings compare trimmed, without rewriting either value. */
export function sameRoomColor(a: string, b: string): boolean {
  const left = normalizeHex(a);
  const right = normalizeHex(b);
  if (left && right) return left === right;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function isPresetRoomColor(color: string | null | undefined): boolean {
  const normalized = color ? normalizeHex(color) : null;
  if (!normalized) return false;
  return ROOM_ICON_COLORS.some((preset) => preset.toUpperCase() === normalized);
}

/**
 * Preset swatches, plus the stored color when it is outside the set.
 * The extra swatch keeps the original string so a save does not normalize it.
 */
export function roomColorOptions(current: string | null | undefined): string[] {
  const presets: string[] = [...ROOM_ICON_COLORS];
  const trimmed = current?.trim() ?? "";
  if (!trimmed || isPresetRoomColor(trimmed)) return presets;
  return [trimmed, ...presets];
}

export type RoomAppearance = {
  name: string;
  icon?: string | null;
  iconBackgroundColor?: string | null;
  background?: string | null;
};

export type RoomCardAppearance = {
  title?: string;
  icon?: string;
  icon_background_color?: string;
  background_image?: string;
  area_id?: string;
};

export type RoomCardLinkAction =
  | { type: "select"; areaId: string | undefined }
  | { type: "adopt"; room: RoomAppearance };

/**
 * Linking a dashboard tile selects the room only.
 * Name, icon and photo change when the user presses the adopt action.
 */
export function reduceRoomCardLink<T extends RoomCardAppearance>(
  form: T,
  action: RoomCardLinkAction
): T {
  switch (action.type) {
    case "select":
      return { ...form, area_id: action.areaId ?? "" };
    case "adopt":
      return {
        ...form,
        title: action.room.name,
        icon: action.room.icon ?? form.icon,
        icon_background_color: action.room.iconBackgroundColor ?? form.icon_background_color,
        background_image: action.room.background ?? form.background_image,
      };
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}

export function orderLinkedRooms<T extends { areaId: string }>(
  rooms: T[],
  selectedId: string | undefined
): T[] {
  if (!selectedId) return rooms;
  const selected = rooms.find((room) => room.areaId === selectedId);
  if (!selected) return rooms;
  return [selected, ...rooms.filter((room) => room.areaId !== selectedId)];
}

type WidgetNode = {
  type?: string;
  area_id?: string;
  children?: unknown;
};

function countInNode(node: unknown, areaId: string): number {
  if (Array.isArray(node)) {
    return node.reduce((sum, item) => sum + countInNode(item, areaId), 0);
  }
  if (!node || typeof node !== "object") return 0;
  const widget = node as WidgetNode;
  const self = widget.type === "room_card" && widget.area_id === areaId ? 1 : 0;
  return self + countInNode(widget.children, areaId);
}

/** How many room cards in these widget JSON blobs open one room. */
export function countRoomCardLinks(
  sources: Array<string | null | undefined>,
  areaId: string
): number {
  let total = 0;
  for (const source of sources) {
    if (!source) continue;
    try {
      total += countInNode(JSON.parse(source) as unknown, areaId);
    } catch {
      continue;
    }
  }
  return total;
}

/** Counts per area id, across every widget payload. */
export function roomCardLinkCounts(
  sources: Array<string | null | undefined>
): Record<string, number> {
  const counts: Record<string, number> = {};
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!node || typeof node !== "object") return;
    const widget = node as WidgetNode;
    if (widget.type === "room_card" && widget.area_id) {
      counts[widget.area_id] = (counts[widget.area_id] ?? 0) + 1;
    }
    visit(widget.children);
  };
  for (const source of sources) {
    if (!source) continue;
    try {
      visit(JSON.parse(source) as unknown);
    } catch {
      continue;
    }
  }
  return counts;
}

export function compositeOnWhite(alpha: number): string {
  const channelValue = Math.round(255 * (1 - alpha));
  const hex = channelValue.toString(16).padStart(2, "0");
  return `#${hex}${hex}${hex}`;
}
