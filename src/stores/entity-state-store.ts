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
  setStates: (entities: EntityState[]) => void;
  /** Optimistic update voor één entity (bijv. direct aan/uit tonen). */
  updateEntityState: (entityId: string, patch: Partial<Pick<EntityState, "state" | "attributes">>) => void;
  setError: (error: string | null) => void;
  getState: (entityId: string) => EntityState | undefined;
  isOffline: () => boolean;
};

export const useEntityStateStore = create<EntityStateStore>((set, get) => ({
  states: {},
  updatedAt: null,
  error: null,
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
}));
