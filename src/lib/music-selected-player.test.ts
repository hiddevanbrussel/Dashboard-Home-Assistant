import { describe, expect, it } from "vitest";
import type { MAPlayer } from "@/stores/music-player-store";
import {
  SELECTED_QUEUE_STORAGE_KEY,
  readStoredQueueId,
  resolveInitialQueueId,
  writeStoredQueueId,
  type QueueIdStorage,
} from "./music-selected-player";

const living: MAPlayer = { queue_id: "living", display_name: "Living room" };
const kitchen: MAPlayer = { queue_id: "kitchen", display_name: "Kitchen" };

function memoryStorage(initial?: Record<string, string>): QueueIdStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = value;
    },
  };
}

describe("selected queue storage", () => {
  it("uses the exact key dashboard.musicAssistant.selectedQueueId", () => {
    expect(SELECTED_QUEUE_STORAGE_KEY).toBe("dashboard.musicAssistant.selectedQueueId");
    const storage = memoryStorage();
    writeStoredQueueId(storage, "kitchen");
    expect(storage.data).toEqual({ "dashboard.musicAssistant.selectedQueueId": "kitchen" });
    expect(readStoredQueueId(storage)).toBe("kitchen");
  });

  it("falls back to the first allowed player when the stored id is unknown or not allowed", () => {
    expect(resolveInitialQueueId("missing", [living, kitchen], ["kitchen"])).toBe("kitchen");
    expect(resolveInitialQueueId("living", [living, kitchen], ["kitchen"])).toBe("kitchen");
    expect(resolveInitialQueueId(null, [living, kitchen], ["kitchen"])).toBe("kitchen");
    expect(resolveInitialQueueId("kitchen", [living, kitchen], ["kitchen"])).toBe("kitchen");
    expect(resolveInitialQueueId("missing", [living, kitchen], [])).toBe("living");
  });

  it("returns null for an empty player list", () => {
    expect(resolveInitialQueueId("kitchen", [], [])).toBeNull();
    expect(resolveInitialQueueId("kitchen", [], ["kitchen"])).toBeNull();
  });

  it("returns null and does not throw when storage throws", () => {
    const storage: QueueIdStorage = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    };
    expect(readStoredQueueId(storage)).toBeNull();
    expect(() => writeStoredQueueId(storage, "kitchen")).not.toThrow();
    expect(resolveInitialQueueId(readStoredQueueId(storage), [], [])).toBeNull();
  });
});
