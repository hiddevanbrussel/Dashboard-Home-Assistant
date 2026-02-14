import { create } from "zustand";

export type EntityState = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

type EntityStateStore = {
  states: Record<string, EntityState>;
  updatedAt: number | null;
  error: string | null;
  /** Verhoog om directe refresh aan te vragen (bv. bij dashboard met stat pills). */
  refreshRequested: number;
  setStates: (entities: EntityState[]) => void;
  /** Optimistic update voor één entity (bijv. direct aan/uit tonen). */
  updateEntityState: (entityId: string, patch: Partial<Pick<EntityState, "state" | "attributes">>) => void;
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
  setStates: (entities) => {
    const states: Record<string, EntityState> = {};
    for (const e of entities) {
      states[e.entity_id] = e;
    }
    set({ states, updatedAt: Date.now(), error: null });
  },
  updateEntityState: (entityId, patch) => {
    const current = get().states[entityId];
    if (!current) return;
    set({
      states: {
        ...get().states,
        [entityId]: { ...current, ...patch },
      },
      updatedAt: Date.now(),
    });
  },
  setError: (error) => set({ error }),
  getState: (entityId) => get().states[entityId],
  isOffline: () => get().error != null,
  requestRefresh: () => set((s) => ({ refreshRequested: s.refreshRequested + 1 })),
}));
