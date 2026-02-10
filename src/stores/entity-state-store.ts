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
  setError: (error) => set({ error }),
  getState: (entityId) => get().states[entityId],
  isOffline: () => get().error != null,
}));
