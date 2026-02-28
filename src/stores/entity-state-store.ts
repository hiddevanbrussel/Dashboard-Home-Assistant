import { create } from "zustand";

export type EntityState = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

// How long (ms) to protect an optimistically-updated entity from being
// overwritten by a background poll. Gives HA time to process the command.
const OPTIMISTIC_LOCK_MS = 4000;

type EntityStateStore = {
  states: Record<string, EntityState>;
  updatedAt: number | null;
  error: string | null;
  /** Verhoog om directe refresh aan te vragen (bv. bij dashboard met stat pills). */
  refreshRequested: number;
  /** entity_id → timestamp until which poll results should not overwrite optimistic state */
  optimisticLockUntil: Record<string, number>;
  setStates: (entities: EntityState[]) => void;
  /** Optimistic update voor één entity (bijv. direct aan/uit tonen). */
  updateEntityState: (entityId: string, patch: Partial<Pick<EntityState, "state" | "attributes">>) => void;
  /** Revert an optimistic update (e.g. when the API call failed). */
  revertEntityState: (entityId: string, previous: EntityState | undefined) => void;
  setError: (error: string | null) => void;
  getState: (entityId: string) => EntityState | undefined;
  isOffline: () => boolean;
  /** Vraag directe entity state refresh aan (voor betrouwbare stat pill weergave). */
  requestRefresh: () => void;
};

export const useEntityStateStore = create<EntityStateStore>((set, get) => ({
  states: {},
  updatedAt: null,
  error: null,
  refreshRequested: 0,
  optimisticLockUntil: {},
  setStates: (entities) => {
    const now = Date.now();
    const current = get().states;
    const locks = get().optimisticLockUntil;
    const states: Record<string, EntityState> = {};
    for (const e of entities) {
      // Keep optimistic state if the lock is still active
      if (locks[e.entity_id] && locks[e.entity_id] > now) {
        states[e.entity_id] = current[e.entity_id] ?? e;
      } else {
        states[e.entity_id] = e;
      }
    }
    set({ states, updatedAt: Date.now(), error: null });
  },
  updateEntityState: (entityId, patch) => {
    const current = get().states[entityId];
    const next = current
      ? { ...current, ...patch }
      : { entity_id: entityId, state: (patch.state as string) ?? "unknown", attributes: patch.attributes ?? {} };
    set({
      states: { ...get().states, [entityId]: next },
      optimisticLockUntil: {
        ...get().optimisticLockUntil,
        [entityId]: Date.now() + OPTIMISTIC_LOCK_MS,
      },
      updatedAt: Date.now(),
    });
  },
  revertEntityState: (entityId, previous) => {
    const locks = { ...get().optimisticLockUntil };
    delete locks[entityId];
    if (previous) {
      set({ states: { ...get().states, [entityId]: previous }, optimisticLockUntil: locks });
    } else {
      set({ optimisticLockUntil: locks });
    }
  },
  setError: (error) => set({ error }),
  getState: (entityId) => get().states[entityId],
  isOffline: () => get().error != null,
  requestRefresh: () => set((s) => ({ refreshRequested: s.refreshRequested + 1 })),
}));
