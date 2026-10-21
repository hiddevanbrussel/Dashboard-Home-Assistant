import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardEditBar } from "@/components/dashboard-edit-bar";
import {
  DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX,
  DASHBOARD_PAGE_UNDO_TOAST_GAP_PX,
  DashboardPageUndoToastView,
} from "@/components/dashboard-page-undo-toast";
import { DASHBOARD_EDIT_BAR_HEIGHT_PX } from "@/lib/dashboard-edit-bar";
import { getTranslations } from "@/lib/i18n";
import { useLanguageStore } from "@/stores/language-store";
import {
  applyPageRemovalAction,
  DASHBOARD_PAGE_UNDO_MS,
  readFloatingPositions,
  restoreFloatingPositions,
  type PageRemovalState,
  type PageSnapshot,
  type PositionStorage,
} from "@/lib/dashboard-page-removal";

type Tile = { id: string; page?: number; title: string; entity_id?: string };
type LayoutItem = { i: string; x: number; y: number; w: number; h: number };

const KITCHEN_POSITION_KEY = "dashboard.floatingLightCardPosition.home.tile-kitchen";
const KITCHEN_POSITION = JSON.stringify({ left: 128, bottom: 360 });

class MemoryStorage implements PositionStorage {
  private map = new Map<string, string>();

  get length(): number {
    return this.map.size;
  }

  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }

  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) ?? null) : null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

function tiles(): Tile[] {
  return [
    { id: "tile-living", page: 0, title: "Woonkamer", entity_id: "weather.home" },
    { id: "tile-kitchen", page: 1, title: "Keuken", entity_id: "light.keuken" },
    { id: "tile-garden", page: 2, title: "Tuin", entity_id: "sensor.tuin_temperatuur" },
  ];
}

function snapshot(overrides: Partial<PageSnapshot<Tile, LayoutItem>> = {}): PageSnapshot<Tile, LayoutItem> {
  return {
    widgets: tiles(),
    pageCount: 3,
    activePage: 1,
    layout: [{ i: "tile-kitchen", x: 2, y: 3, w: 4, h: 2 }],
    positions: { [KITCHEN_POSITION_KEY]: KITCHEN_POSITION },
    ...overrides,
  };
}

function stateFrom(current: PageSnapshot<Tile, LayoutItem>): PageRemovalState<Tile, LayoutItem> {
  return { current, pending: null };
}

describe("dashboard page removal undo", () => {
  it("undo restores the page at the same index with its tiles, layout and localStorage positions", () => {
    const storage = new MemoryStorage();
    storage.setItem(KITCHEN_POSITION_KEY, KITCHEN_POSITION);
    storage.setItem("dashboard.theme", "dark");

    const removed = applyPageRemovalAction(stateFrom(snapshot(readPositions(storage))), "remove");
    expect(removed.effects).toEqual([]);
    expect(removed.state.pending?.removedIndex).toBe(1);
    expect(removed.state.current.pageCount).toBe(2);
    expect(removed.state.current.widgets.find((tile) => tile.id === "tile-kitchen")?.page).toBe(0);

    storage.setItem(KITCHEN_POSITION_KEY, JSON.stringify({ left: 0, bottom: 0 }));
    storage.removeItem("dashboard.floatingTrashCardPosition.home.tile-living");

    const undone = applyPageRemovalAction(removed.state, "undo");
    expect(undone.effects).toEqual([]);
    expect(undone.state.pending).toBeNull();
    expect(undone.state.current.pageCount).toBe(3);
    expect(undone.state.current.activePage).toBe(1);
    expect(undone.state.current.widgets.map((tile) => tile.page)).toEqual([0, 1, 2]);
    expect(undone.state.current.widgets.find((tile) => tile.id === "tile-kitchen")).toMatchObject({
      title: "Keuken",
      entity_id: "light.keuken",
      page: 1,
    });
    expect(undone.state.current.layout).toEqual([{ i: "tile-kitchen", x: 2, y: 3, w: 4, h: 2 }]);

    restoreFloatingPositions(storage, undone.state.current.positions);
    expect(storage.getItem(KITCHEN_POSITION_KEY)).toBe(KITCHEN_POSITION);
    expect(storage.getItem("dashboard.theme")).toBe("dark");
  });

  it("commits the removal when the undo window expires", () => {
    expect(DASHBOARD_PAGE_UNDO_MS).toBe(5000);
    const removed = applyPageRemovalAction(stateFrom(snapshot()), "remove");
    const committed = applyPageRemovalAction(removed.state, "commit");

    expect(committed.state.pending).toBeNull();
    expect(committed.effects).toHaveLength(1);
    expect(committed.effects[0]?.snapshot.pageCount).toBe(2);
    expect(committed.effects[0]?.snapshot.widgets.find((tile) => tile.id === "tile-kitchen")?.page).toBe(0);
    expect(committed.effects[0]?.snapshot.widgets.map((tile) => tile.id)).toEqual([
      "tile-living",
      "tile-kitchen",
      "tile-garden",
    ]);

    const ignored = applyPageRemovalAction(committed.state, "undo");
    expect(ignored.effects).toEqual([]);
    expect(ignored.state.current.pageCount).toBe(2);
    expect(ignored.state.pending).toBeNull();
  });

  it("finalizes the first removal when a second removal starts during the undo window", () => {
    const fourPages = snapshot({
      pageCount: 4,
      activePage: 1,
      widgets: [
        { id: "tile-living", page: 0, title: "Woonkamer" },
        { id: "tile-kitchen", page: 1, title: "Keuken" },
        { id: "tile-bedroom", page: 2, title: "Slaapkamer" },
        { id: "tile-garden", page: 3, title: "Tuin" },
      ],
    });

    const first = applyPageRemovalAction(stateFrom(fourPages), "remove");
    expect(first.effects).toEqual([]);
    expect(first.state.current.pageCount).toBe(3);
    expect(first.state.current.activePage).toBe(1);

    const second = applyPageRemovalAction(first.state, "remove");
    expect(second.effects).toHaveLength(1);
    expect(second.effects[0]?.snapshot.pageCount).toBe(3);
    expect(second.effects[0]?.snapshot.widgets.find((tile) => tile.id === "tile-kitchen")?.page).toBe(0);
    expect(second.effects[0]?.snapshot.widgets.find((tile) => tile.id === "tile-bedroom")?.page).toBe(1);
    expect(second.state.current.pageCount).toBe(2);
    expect(second.state.pending?.removedIndex).toBe(1);

    const undone = applyPageRemovalAction(second.state, "undo");
    expect(undone.effects).toEqual([]);
    expect(undone.state.current.pageCount).toBe(3);
    expect(undone.state.current.widgets.find((tile) => tile.id === "tile-kitchen")?.page).toBe(0);
    expect(undone.state.current.widgets.find((tile) => tile.id === "tile-bedroom")?.page).toBe(1);
    expect(undone.state.current.pageCount).not.toBe(4);
  });

  it("keeps the undo copy in Dutch and English and leaves the page-bar control at 28px", () => {
    const nl = getTranslations("nl");
    const en = getTranslations("en");
    expect(nl["dashboardPages.undo"]).toBe("Ongedaan maken");
    expect(en["dashboardPages.undo"]).toBe("Undo");
    expect(nl["dashboardPages.removed"]).toBe("Pagina verwijderd");
    expect(en["dashboardPages.removed"]).toBe("Page removed");

    const toast = renderToStaticMarkup(
      createElement(DashboardPageUndoToastView, {
        message: nl["dashboardPages.removed"],
        undoLabel: nl["dashboardPages.undo"],
        onUndo: () => {},
      })
    );
    expect(toast).toContain("Ongedaan maken");
    expect(toast).toContain("Pagina verwijderd");
    expect(toast).toContain('role="status"');
    expect(toast).toContain("min-h-11");
    expect(toast).toContain("px-4");
    expect(toast).toContain("dark:bg-[#1b1a21]");
    expect(toast).toContain("dark:border-white/10");
    expect(toast).toContain("dark:shadow-[0_16px_40px_rgba(0,0,0,0.55)]");
    expect(toast).toContain("dark:bg-brand-muted");
    expect(toast).toContain("dark:backdrop-blur-none");
    expect(toast).toContain("backdrop-blur-md");
    expect(toast).toContain("bg-white/95");
    expect(toast).toContain(`bottom:${DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX}px`);
    expect(toast).not.toContain("h-7 w-7");
    expect(toast).not.toContain("dark:bg-black/80");
    expect(toast).not.toContain("top-20");
    expect(DASHBOARD_PAGE_UNDO_TOAST_GAP_PX).toBeGreaterThanOrEqual(8);
    expect(DASHBOARD_PAGE_UNDO_TOAST_GAP_PX).toBeLessThanOrEqual(12);
    expect(DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX).toBe(
      DASHBOARD_EDIT_BAR_HEIGHT_PX + DASHBOARD_PAGE_UNDO_TOAST_GAP_PX
    );

    const notificationSource = readFileSync(
      new URL("../components/notifications/notification-toasts.tsx", import.meta.url),
      "utf8"
    );
    expect(notificationSource).toContain("backdrop-blur-md");
    expect(notificationSource).toContain("dark:bg-black/80");
    expect(notificationSource).toContain("bg-white/95");
    expect(notificationSource).not.toContain("dark:bg-[#1b1a21]");
    expect(notificationSource).not.toContain("min-h-11");
    expect(notificationSource).not.toContain("dark:bg-brand-muted");
    expect(notificationSource).not.toContain("Ongedaan maken");

    useLanguageStore.setState({ language: "en" });
    const bar = renderToStaticMarkup(
      createElement(DashboardEditBar, {
        pageCount: 3,
        page: 1,
        editMode: true,
        onAddPage: () => {},
        onRemovePage: () => {},
        onSelectPage: () => {},
      })
    );
    expect(bar).toContain("h-7 w-7");
    expect(bar).toContain("height:28px");
    expect(bar).toContain("Remove page");
    expect(bar).not.toContain("Ongedaan maken");
    expect(bar).not.toContain("Undo");
  });
});

function readPositions(storage: MemoryStorage): { positions: Record<string, string> } {
  return { positions: readFloatingPositions(storage) };
}
