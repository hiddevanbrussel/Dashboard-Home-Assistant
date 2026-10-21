import { describe, expect, it } from "vitest";
import {
  clearTilePositionStorage,
  planCancelPendingAdd,
  planConfirmPendingAdd,
  planUndoAddedTile,
  tileDefersSave,
  tilePositionStorageKeys,
} from "./add-tile-commit";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    removeItem(key: string) {
      delete data[key];
    },
  };
}

describe("deferred save", () => {
  it("defers the types that open a settings step and saves the others immediately", () => {
    expect(tileDefersSave("text_card")).toBe(true);
    expect(tileDefersSave("room_card")).toBe(true);
    expect(tileDefersSave("nuts_card")).toBe(true);
    expect(tileDefersSave("smart_stack")).toBe(true);
    expect(tileDefersSave("energy_monitor_card")).toBe(true);
    expect(tileDefersSave("power_usage_card")).toBe(true);
    expect(tileDefersSave("stat_pill_card")).toBe(true);
    expect(tileDefersSave("trash_card")).toBe(true);
    expect(tileDefersSave("light_card")).toBe(false);
    expect(tileDefersSave("calendar_card")).toBe(false);
    expect(tileDefersSave("timer_card")).toBe(false);
  });

  it("cancel removes the pending tile and does not persist or touch a shared position", () => {
    const widgets = [
      { id: "weather", type: "weather_card" },
      { id: "draft", type: "text_card" },
    ];
    const layout = [{ i: "weather" }, { i: "draft" }];
    const storage = memoryStorage({
      "dashboard.floatingTextCardPosition.dash.draft": "{\"left\":10}",
      "dashboard.floatingPowerUsageCardPosition.dash": "{\"left\":20}",
      "dashboard.floatingTextCardPosition.dash.keep": "{\"left\":30}",
    });
    const plan = planCancelPendingAdd(widgets, layout, "draft", "text_card", "dash");
    expect(plan.persist).toBe(false);
    expect(plan.widgets.map((widget) => widget.id)).toEqual(["weather"]);
    expect(plan.layout.map((item) => item.i)).toEqual(["weather"]);
    clearTilePositionStorage(storage, "text_card", "dash", "draft", "cancel");
    expect(storage.data["dashboard.floatingTextCardPosition.dash.draft"]).toBeUndefined();
    expect(storage.data["dashboard.floatingTextCardPosition.dash.keep"]).toBe("{\"left\":30}");
    expect(storage.data["dashboard.floatingPowerUsageCardPosition.dash"]).toBe("{\"left\":20}");
    expect(tilePositionStorageKeys("power_usage_card", "dash", "draft", "cancel")).toEqual([]);
  });

  it("confirm persists only when the pending tile is still present", () => {
    expect(planConfirmPendingAdd([{ id: "draft" }], "draft").persist).toBe(true);
    expect(planConfirmPendingAdd([{ id: "other" }], "draft").persist).toBe(false);
  });

  it("undo removes a saved tile, persists, and clears that tile's position", () => {
    const widgets = [
      { id: "keep", type: "light_card" },
      { id: "added", type: "power_usage_card" },
    ];
    const plan = planUndoAddedTile(widgets, [{ i: "keep" }, { i: "added" }], "added", "power_usage_card", "dash");
    expect(plan.persist).toBe(true);
    expect(plan.widgets.map((widget) => widget.id)).toEqual(["keep"]);
    expect(plan.storageKeys).toEqual(["dashboard.floatingPowerUsageCardPosition.dash"]);
    const storage = memoryStorage({
      "dashboard.floatingPowerUsageCardPosition.dash": "{\"left\":40}",
      "dashboard.floatingLightCardPosition.dash.keep": "{\"left\":50}",
    });
    clearTilePositionStorage(storage, "power_usage_card", "dash", "added", "undo");
    expect(storage.data["dashboard.floatingPowerUsageCardPosition.dash"]).toBeUndefined();
    expect(storage.data["dashboard.floatingLightCardPosition.dash.keep"]).toBe("{\"left\":50}");
  });

  it("undo of a shared card leaves the key when a sibling still uses it", () => {
    const storage = memoryStorage({
      "dashboard.floatingClimateCardPosition.dash": "{\"left\":96,\"bottom\":200}",
    });
    clearTilePositionStorage(storage, "climate_card_2", "dash", "added", "undo", ["climate_card"]);
    expect(storage.data["dashboard.floatingClimateCardPosition.dash"]).toBe("{\"left\":96,\"bottom\":200}");
    clearTilePositionStorage(storage, "climate_card", "dash", "added", "undo", ["light_card"]);
    expect(storage.data["dashboard.floatingClimateCardPosition.dash"]).toBeUndefined();
  });

  it("device consumption uses the per-card scope the page passes", () => {
    expect(tilePositionStorageKeys("device_consumption_card", "dash", "w1", "cancel")).toEqual([
      "dashboard.floatingDeviceConsumptionCardPosition.dash-w1",
    ]);
    expect(tilePositionStorageKeys("device_consumption_card", "dash", "w1", "undo")).toEqual([
      "dashboard.floatingDeviceConsumptionCardPosition.dash-w1",
    ]);
  });
});
