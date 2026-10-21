import { clampPageIndex, reindexWidgetsAfterRemovedPage } from "@/lib/dashboard-pages";

/** How long the undo toast stays up before a page removal is saved. */
export const DASHBOARD_PAGE_UNDO_MS = 5000;

/** Floating-card positions live under this localStorage prefix. */
export const FLOATING_POSITION_PREFIX = "dashboard.floating";

export type PageRemovalWidget = { id: string; page?: number };

export type PageSnapshot<T extends PageRemovalWidget, L> = {
  widgets: T[];
  pageCount: number;
  activePage: number;
  layout: L[];
  positions: Record<string, string>;
};

export type PendingPageRemoval<T extends PageRemovalWidget, L> = {
  /** Index that disappeared. Undo puts this page back here. */
  removedIndex: number;
  before: PageSnapshot<T, L>;
  after: PageSnapshot<T, L>;
};

export type PageRemovalState<T extends PageRemovalWidget, L> = {
  current: PageSnapshot<T, L>;
  pending: PendingPageRemoval<T, L> | null;
};

export type PageRemovalEffect<T extends PageRemovalWidget, L> = {
  type: "save";
  snapshot: PageSnapshot<T, L>;
};

export type PageRemovalAction = "remove" | "undo" | "commit";

export type PositionStorage = {
  length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function cloneSnapshot<T extends PageRemovalWidget, L>(snapshot: PageSnapshot<T, L>): PageSnapshot<T, L> {
  return structuredClone(snapshot);
}

/**
 * Same end state as an immediate page removal: the page slot is gone and
 * widgets are reindexed onto the remaining pages. Nothing is saved yet.
 */
function removalAfter<T extends PageRemovalWidget, L>(
  before: PageSnapshot<T, L>
): { removedIndex: number; after: PageSnapshot<T, L> } | null {
  if (before.pageCount <= 1) return null;
  const removedIndex = clampPageIndex(before.activePage, before.pageCount);
  const pageCount = before.pageCount - 1;
  return {
    removedIndex,
    after: {
      widgets: structuredClone(reindexWidgetsAfterRemovedPage(before.widgets, removedIndex)),
      pageCount,
      activePage: clampPageIndex(removedIndex, pageCount),
      layout: structuredClone(before.layout),
      positions: { ...before.positions },
    },
  };
}

function requestPageRemoval<T extends PageRemovalWidget, L>(
  state: PageRemovalState<T, L>
): { state: PageRemovalState<T, L>; effects: PageRemovalEffect<T, L>[] } {
  const effects: PageRemovalEffect<T, L>[] = [];
  const current = cloneSnapshot(state.current);
  if (state.pending) {
    effects.push({ type: "save", snapshot: cloneSnapshot(current) });
  }
  const next = removalAfter(current);
  if (!next) {
    return { state: { current, pending: null }, effects };
  }
  return {
    state: {
      current: next.after,
      pending: { removedIndex: next.removedIndex, before: current, after: next.after },
    },
    effects,
  };
}

function undoPageRemoval<T extends PageRemovalWidget, L>(
  state: PageRemovalState<T, L>
): { state: PageRemovalState<T, L>; effects: PageRemovalEffect<T, L>[] } {
  if (!state.pending) return { state, effects: [] };
  return {
    state: { current: cloneSnapshot(state.pending.before), pending: null },
    effects: [],
  };
}

function commitPageRemoval<T extends PageRemovalWidget, L>(
  state: PageRemovalState<T, L>
): { state: PageRemovalState<T, L>; effects: PageRemovalEffect<T, L>[] } {
  if (!state.pending) return { state, effects: [] };
  const current = cloneSnapshot(state.current);
  return {
    state: { current, pending: null },
    effects: [{ type: "save", snapshot: current }],
  };
}

export function applyPageRemovalAction<T extends PageRemovalWidget, L>(
  state: PageRemovalState<T, L>,
  action: PageRemovalAction
): { state: PageRemovalState<T, L>; effects: PageRemovalEffect<T, L>[] } {
  switch (action) {
    case "remove":
      return requestPageRemoval(state);
    case "undo":
      return undoPageRemoval(state);
    case "commit":
      return commitPageRemoval(state);
    default: {
      const exhaustive: never = action;
      throw new Error(`Unknown page removal action: ${String(exhaustive)}`);
    }
  }
}

export function readFloatingPositions(storage: PositionStorage): Record<string, string> {
  const positions: Record<string, string> = {};
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key || !key.startsWith(FLOATING_POSITION_PREFIX)) continue;
    const value = storage.getItem(key);
    if (value != null) positions[key] = value;
  }
  return positions;
}

/** Put snapshotted floating-card coordinates back, including keys cleared while the toast was up. */
export function restoreFloatingPositions(storage: PositionStorage, positions: Record<string, string>): void {
  const current = readFloatingPositions(storage);
  for (const key of Object.keys(current)) {
    if (!(key in positions)) storage.removeItem(key);
  }
  for (const [key, value] of Object.entries(positions)) {
    storage.setItem(key, value);
  }
}
