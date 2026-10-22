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

export type PageRemovalSession<T extends PageRemovalWidget, L> = {
  pending: PendingPageRemoval<T, L> | null;
  epoch: number;
  /** What the React refs currently hold. A render can roll these back. */
  refs: PageSnapshot<T, L>;
  /** Last snapshot applied by a removal step. Null before the first one. */
  mirror: PageSnapshot<T, L> | null;
};

export type PageRemovalSave<T extends PageRemovalWidget, L> = {
  /** Epoch at the time this snapshot was taken. A newer epoch must ignore it. */
  epoch: number;
  snapshot: PageSnapshot<T, L>;
};

export type PageRemovalStep<T extends PageRemovalWidget, L> = {
  pending: PendingPageRemoval<T, L> | null;
  current: PageSnapshot<T, L>;
  epoch: number;
  mirror: PageSnapshot<T, L> | null;
  saves: PageRemovalSave<T, L>[];
  undoOpen: boolean;
};

/**
 * While a removal is pending, a render that still has the previous page count
 * must not become the input of the next removal. Edits keep flowing when the
 * page count still matches the snapshot this removal applied.
 */
export function resolveLivePageSnapshot<T extends PageRemovalWidget, L>(
  refs: PageSnapshot<T, L>,
  mirror: PageSnapshot<T, L> | null,
  pending: boolean
): PageSnapshot<T, L> {
  if (!pending || !mirror) return refs;
  if (refs.pageCount !== mirror.pageCount) {
    return { ...mirror, positions: refs.positions };
  }
  return refs;
}

/** A save response may update the client only when no newer removal has started. */
export function shouldApplyPagedSave(saveEpoch: number, clientEpoch: number): boolean {
  return saveEpoch === clientEpoch;
}

function savesAtEpoch<T extends PageRemovalWidget, L>(
  effects: PageRemovalEffect<T, L>[],
  epoch: number
): PageRemovalSave<T, L>[] {
  return effects.flatMap((effect) => {
    switch (effect.type) {
      case "save":
        return [{ epoch, snapshot: effect.snapshot }];
      default: {
        const exhaustive: never = effect.type;
        throw new Error(`Unknown page removal effect: ${String(exhaustive)}`);
      }
    }
  });
}

/**
 * One toast, one pending removal. A new removal first records a save of the
 * previous snapshot (tagged with the epoch from before this step) and only
 * then deletes from that snapshot. Undo restores just that pending removal.
 */
export function stepPageRemoval<T extends PageRemovalWidget, L>(
  session: PageRemovalSession<T, L>,
  action: PageRemovalAction
): PageRemovalStep<T, L> {
  const current = resolveLivePageSnapshot(session.refs, session.mirror, session.pending != null);
  const state: PageRemovalState<T, L> = { current, pending: session.pending };

  switch (action) {
    case "remove": {
      if (current.pageCount <= 1) {
        return {
          pending: session.pending,
          current,
          epoch: session.epoch,
          mirror: session.mirror,
          saves: [],
          undoOpen: session.pending != null,
        };
      }
      const result = applyPageRemovalAction(state, "remove");
      return {
        pending: result.state.pending,
        current: result.state.current,
        epoch: session.epoch + 1,
        mirror: result.state.current,
        saves: savesAtEpoch(result.effects, session.epoch),
        undoOpen: result.state.pending != null,
      };
    }
    case "undo": {
      const result = applyPageRemovalAction(state, "undo");
      const changed = session.pending != null;
      return {
        pending: result.state.pending,
        current: result.state.current,
        epoch: changed ? session.epoch + 1 : session.epoch,
        mirror: changed ? result.state.current : session.mirror,
        saves: [],
        undoOpen: false,
      };
    }
    case "commit": {
      const result = applyPageRemovalAction(state, "commit");
      return {
        pending: result.state.pending,
        current: result.state.current,
        epoch: session.epoch,
        mirror: session.pending != null ? result.state.current : session.mirror,
        saves: savesAtEpoch(result.effects, session.epoch),
        undoOpen: false,
      };
    }
    default: {
      const exhaustive: never = action;
      throw new Error(`Unknown page removal action: ${String(exhaustive)}`);
    }
  }
}

/** Run dashboard PUTs one after another so an older body cannot land last. */
export function createSerializedSaveQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = tail.then(task, task);
    tail = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  };
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
