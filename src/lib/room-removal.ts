/**
 * Deferred room deletion, same window as dashboard page removal:
 * the room leaves the list immediately, the DELETE runs after the undo
 * window, or immediately when another room is deleted. Undo sends nothing.
 */

export type RoomIdentity = { areaId: string; name: string };

export type RoomListState<T extends RoomIdentity> = {
  rooms: T[];
  pending: T | null;
  /** Deletes already sent. Stay hidden until that request settles. */
  deleting: string[];
};

export type RoomListEffect = { type: "delete"; areaId: string };

export type RoomListAction<T extends RoomIdentity> =
  | { type: "loaded"; rooms: T[] }
  | { type: "remove"; room: T }
  | { type: "undo" }
  | { type: "commit" }
  | { type: "settled"; areaId: string; rooms: T[] };

export function visibleRooms<T extends RoomIdentity>(state: RoomListState<T>): T[] {
  const hidden = new Set(state.deleting);
  if (state.pending) hidden.add(state.pending.areaId);
  return state.rooms.filter((room) => !hidden.has(room.areaId));
}

export function stepRoomList<T extends RoomIdentity>(
  state: RoomListState<T>,
  action: RoomListAction<T>
): { state: RoomListState<T>; effects: RoomListEffect[] } {
  switch (action.type) {
    case "loaded": {
      const present = new Set(action.rooms.map((room) => room.areaId));
      return {
        state: {
          rooms: action.rooms,
          pending: state.pending && present.has(state.pending.areaId) ? state.pending : null,
          deleting: state.deleting.filter((areaId) => present.has(areaId)),
        },
        effects: [],
      };
    }
    case "remove": {
      const effects: RoomListEffect[] = state.pending
        ? [{ type: "delete", areaId: state.pending.areaId }]
        : [];
      const deleting = state.pending
        ? [...state.deleting, state.pending.areaId]
        : state.deleting;
      return {
        state: { rooms: state.rooms, pending: action.room, deleting },
        effects,
      };
    }
    case "undo":
      return { state: { ...state, pending: null }, effects: [] };
    case "commit": {
      if (!state.pending) return { state, effects: [] };
      return {
        state: {
          rooms: state.rooms,
          pending: null,
          deleting: [...state.deleting, state.pending.areaId],
        },
        effects: [{ type: "delete", areaId: state.pending.areaId }],
      };
    }
    case "settled": {
      const present = new Set(action.rooms.map((room) => room.areaId));
      return {
        state: {
          rooms: action.rooms,
          pending: state.pending && present.has(state.pending.areaId) ? state.pending : null,
          deleting: state.deleting.filter((areaId) => areaId !== action.areaId && present.has(areaId)),
        },
        effects: [],
      };
    }
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}

export type RoomDeleteHandoff = {
  areaId: string;
  name: string;
  commitAt: number;
};

export const ROOM_DELETE_HANDOFF_KEY = "rooms.pending-delete";

type SetItem = { setItem(key: string, value: string): void };
type GetItem = { getItem(key: string): string | null };
type RemoveItem = { removeItem(key: string): void };

export function writeRoomDeleteHandoff(storage: SetItem, handoff: RoomDeleteHandoff): void {
  storage.setItem(ROOM_DELETE_HANDOFF_KEY, JSON.stringify(handoff));
}

export function readRoomDeleteHandoff(storage: GetItem): RoomDeleteHandoff | null {
  const raw = storage.getItem(ROOM_DELETE_HANDOFF_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<RoomDeleteHandoff>;
    if (typeof parsed.areaId !== "string" || !parsed.areaId) return null;
    if (typeof parsed.name !== "string" || !parsed.name) return null;
    if (typeof parsed.commitAt !== "number" || !Number.isFinite(parsed.commitAt)) return null;
    return { areaId: parsed.areaId, name: parsed.name, commitAt: parsed.commitAt };
  } catch {
    return null;
  }
}

export function clearRoomDeleteHandoff(storage: RemoveItem): void {
  storage.removeItem(ROOM_DELETE_HANDOFF_KEY);
}
