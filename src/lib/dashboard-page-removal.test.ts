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
  createSerializedSaveQueue,
  DASHBOARD_PAGE_UNDO_MS,
  readFloatingPositions,
  restoreFloatingPositions,
  shouldApplyPagedSave,
  stepPageRemoval,
  type PageRemovalSession,
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
    expect(toast).toContain("dark:text-[rgb(var(--brand-on-muted))]");
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
    expect(notificationSource).not.toContain("--brand-on-muted");
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

function fourPages(): PageSnapshot<Tile, LayoutItem> {
  return snapshot({
    pageCount: 4,
    activePage: 1,
    widgets: [
      { id: "tile-living", page: 0, title: "Woonkamer" },
      { id: "tile-kitchen", page: 1, title: "Keuken" },
      { id: "tile-bedroom", page: 2, title: "Slaapkamer" },
      { id: "tile-garden", page: 3, title: "Tuin" },
    ],
  });
}

/** Page slots in index order, each slot listing its tile ids. */
function pageOrder(current: PageSnapshot<Tile, LayoutItem>): string[][] {
  return Array.from({ length: current.pageCount }, (_, page) =>
    current.widgets.filter((tile) => (tile.page ?? 0) === page).map((tile) => tile.id)
  );
}

/**
 * Client session plus the server row. Saves stay in flight until flush, and
 * flush applies them in order. A late response updates the client page count
 * only when its epoch is still current.
 */
function createSession(initial: PageSnapshot<Tile, LayoutItem>) {
  const session: PageRemovalSession<Tile, LayoutItem> = {
    pending: null,
    epoch: 0,
    refs: structuredClone(initial),
    mirror: null,
  };
  let server = structuredClone(initial);
  let inflight: { epoch: number; snapshot: PageSnapshot<Tile, LayoutItem> }[] = [];

  function apply(action: "remove" | "undo" | "commit") {
    const step = stepPageRemoval(session, action);
    session.pending = step.pending;
    session.epoch = step.epoch;
    session.refs = step.current;
    session.mirror = step.mirror;
    inflight.push(...step.saves);
    return step;
  }

  return {
    get pending() {
      return session.pending;
    },
    get epoch() {
      return session.epoch;
    },
    get client() {
      return session.refs;
    },
    get server() {
      return server;
    },
    get inflight() {
      return inflight;
    },
    remove: () => apply("remove"),
    undo: () => apply("undo"),
    commit: () => apply("commit"),
    poisonRefs() {
      session.refs = structuredClone(initial);
    },
    flush() {
      for (const save of inflight) {
        server = structuredClone(save.snapshot);
        if (shouldApplyPagedSave(save.epoch, session.epoch)) {
          session.refs = {
            ...session.refs,
            widgets: structuredClone(save.snapshot.widgets),
            pageCount: save.snapshot.pageCount,
            activePage: save.snapshot.activePage,
            layout: structuredClone(save.snapshot.layout),
          };
        }
      }
      inflight = [];
    },
    reload() {
      session.pending = null;
      session.mirror = null;
      session.epoch = 0;
      session.refs = structuredClone(server);
    },
  };
}

describe("rapid page removals", () => {
  it("finalizes the first of two rapid removals and lets undo restore only the second", () => {
    const session = createSession(snapshot());

    const first = session.remove();
    expect(first.saves).toEqual([]);
    expect(first.undoOpen).toBe(true);
    expect(session.client.pageCount).toBe(2);
    expect(pageOrder(session.client)).toEqual([["tile-living", "tile-kitchen"], ["tile-garden"]]);

    const second = session.remove();
    expect(second.saves).toHaveLength(1);
    expect(second.saves[0]?.snapshot.pageCount).toBe(2);
    expect(second.saves[0]?.epoch).toBeLessThan(session.epoch);
    expect(second.undoOpen).toBe(true);
    expect(session.pending?.removedIndex).toBe(1);
    expect(session.client.pageCount).toBe(1);
    expect(pageOrder(session.client)).toEqual([["tile-living", "tile-kitchen", "tile-garden"]]);

    session.flush();
    expect(session.client.pageCount).toBe(1);
    expect(session.server.pageCount).toBe(2);

    session.undo();
    expect(session.pending).toBeNull();
    expect(session.client.pageCount).toBe(2);
    expect(session.client.activePage).toBe(1);
    expect(pageOrder(session.client)).toEqual([["tile-living", "tile-kitchen"], ["tile-garden"]]);
    expect(session.client.pageCount).not.toBe(3);
  });

  it("keeps count and order for three rapid removals, with and without undo", () => {
    const removed = createSession(fourPages());
    removed.remove();
    removed.remove();
    removed.remove();

    expect(removed.pending?.removedIndex).toBe(1);
    expect(removed.client.pageCount).toBe(1);
    expect(pageOrder(removed.client)).toEqual([
      ["tile-living", "tile-kitchen", "tile-bedroom", "tile-garden"],
    ]);
    expect(removed.inflight.map((save) => save.snapshot.pageCount)).toEqual([3, 2]);

    removed.commit();
    removed.flush();
    expect(removed.server.pageCount).toBe(1);
    expect(pageOrder(removed.server)).toEqual([
      ["tile-living", "tile-kitchen", "tile-bedroom", "tile-garden"],
    ]);

    const restored = createSession(fourPages());
    restored.remove();
    restored.remove();
    restored.remove();
    restored.undo();

    expect(restored.pending).toBeNull();
    expect(restored.client.pageCount).toBe(2);
    expect(restored.client.activePage).toBe(1);
    expect(pageOrder(restored.client)).toEqual([
      ["tile-living", "tile-kitchen", "tile-bedroom"],
      ["tile-garden"],
    ]);
    expect(restored.client.widgets.find((tile) => tile.id === "tile-garden")?.page).toBe(1);
  });

  it("still removes the next page when refs were rolled back to the previous snapshot", () => {
    const session = createSession(snapshot());
    session.remove();
    session.poisonRefs();

    const second = session.remove();
    expect(second.saves[0]?.snapshot.pageCount).toBe(2);
    expect(pageOrder(second.saves[0]!.snapshot)).toEqual([
      ["tile-living", "tile-kitchen"],
      ["tile-garden"],
    ]);
    expect(session.client.pageCount).toBe(1);
    expect(pageOrder(session.client)).toEqual([["tile-living", "tile-kitchen", "tile-garden"]]);

    session.flush();
    expect(session.client.pageCount).toBe(1);
    expect(session.server.pageCount).toBe(2);
  });

  it("reloads a committed removal and reloads the original pages after undo", () => {
    const deleted = createSession(snapshot());
    deleted.remove();
    expect(deleted.server.pageCount).toBe(3);
    deleted.commit();
    deleted.flush();
    deleted.reload();
    expect(deleted.pending).toBeNull();
    expect(deleted.client.pageCount).toBe(2);
    expect(pageOrder(deleted.client)).toEqual([["tile-living", "tile-kitchen"], ["tile-garden"]]);

    const undone = createSession(snapshot());
    undone.remove();
    undone.undo();
    undone.flush();
    undone.reload();
    expect(undone.client.pageCount).toBe(3);
    expect(pageOrder(undone.client)).toEqual([["tile-living"], ["tile-kitchen"], ["tile-garden"]]);
    expect(undone.client.activePage).toBe(1);
  });

  it("starts a fresh undo window when the next removal happens after the previous one committed", () => {
    const session = createSession(snapshot());
    session.remove();
    session.commit();
    session.flush();
    expect(session.server.pageCount).toBe(2);
    expect(session.pending).toBeNull();

    const next = session.remove();
    expect(next.saves).toEqual([]);
    expect(next.undoOpen).toBe(true);
    expect(session.client.pageCount).toBe(1);
    expect(session.pending?.removedIndex).toBe(1);

    session.undo();
    expect(session.client.pageCount).toBe(2);
    expect(pageOrder(session.client)).toEqual([["tile-living", "tile-kitchen"], ["tile-garden"]]);
  });

  it("does not delete the last page", () => {
    const session = createSession(snapshot({ pageCount: 1, activePage: 0, widgets: [tiles()[0]!] }));
    const step = session.remove();
    expect(step.saves).toEqual([]);
    expect(step.undoOpen).toBe(false);
    expect(session.client.pageCount).toBe(1);
    expect(session.pending).toBeNull();
    expect(session.epoch).toBe(0);
  });

  it("runs queued saves in call order even when an earlier request is slower", async () => {
    const enqueue = createSerializedSaveQueue();
    const order: string[] = [];
    let releaseFirst: () => void = () => {};
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });

    const first = enqueue(async () => {
      await firstGate;
      order.push("first");
    });
    const second = enqueue(async () => {
      order.push("second");
    });

    await Promise.resolve();
    expect(order).toEqual([]);
    releaseFirst();
    await first;
    await second;
    expect(order).toEqual(["first", "second"]);
  });
});
