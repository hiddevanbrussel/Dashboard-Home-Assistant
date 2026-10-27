import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  forgetTilePosition,
  isSingletonTileType,
  serializeTilePosition,
  sharedPositionStillUsed,
  tilePositionStorageKey,
  writeTilePosition,
} from "./tile-position-storage";

const SCOPE = "dash";
const WIDGET = "w1";

/** Key each card builds for storageScope "dash" and this widget id. */
const EXPECTED_KEYS: Record<string, string> = {
  text_card: "dashboard.floatingTextCardPosition.dash.w1",
  title_card: "dashboard.floatingTextCardPosition.dash.w1",
  title_only_card: "dashboard.floatingTextCardPosition.dash.w1",
  subtitle_card: "dashboard.floatingTextCardPosition.dash.w1",
  light_card: "dashboard.floatingLightCardPosition.dash.w1",
  alarm_card: "dashboard.floatingAlarmCardPosition.dash.w1",
  calendar_card: "dashboard.floatingCalendarCardPosition.dash.w1",
  card_group: "dashboard.floatingCardGroupPosition.dash.w1",
  chore_card: "dashboard.floatingChoreCard.dash.w1",
  nuts_card: "dashboard.floatingNutsCardPosition.dash.w1",
  pill_card: "dashboard.floatingPillCardPosition.dash.w1",
  room_card: "dashboard.floatingRoomCardPosition.dash.w1",
  sensor_card: "dashboard.floatingSensorCardPosition.dash.w1",
  smart_stack: "dashboard.floatingSmartStackPosition.dash.w1",
  stat_pill_card: "dashboard.floatingStatPillCardPosition.dash.w1",
  timer_card: "dashboard.floatingTimerCard.dash.w1",
  trash_card: "dashboard.floatingTrashCardPosition.dash.w1",
  vacuum_card_2: "dashboard.floatingVacuumHeroCardPosition.v2.dash.w1",
  energy_metric: "dashboard.floatingEnergyMetricPosition.dash.w1",
  media_card: "dashboard.floatingMediaCardPosition.dash.w1",
  camera_card: "dashboard.floatingCameraCardPosition.dash.w1",
  energy_monitor_card: "dashboard.floatingEnergyMonitorCardPosition.dash.w1",
  teamtracker_card: "dashboard.floatingTeamtrackerCardPosition.dash.w1",
  weather_card: "dashboard.floatingWeatherCardPosition.dash",
  solar_card: "dashboard.floatingSolarCardPosition.dash",
  vacuum_card: "dashboard.floatingVacuumCardPosition.dash",
  power_usage_card: "dashboard.floatingPowerUsageCardPosition.dash",
  climate_card: "dashboard.floatingClimateCardPosition.dash",
  climate_card_2: "dashboard.floatingClimateCardPosition.dash",
  device_consumption_card: "dashboard.floatingDeviceConsumptionCardPosition.dash-w1",
};

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key: string, value: string) {
      data[key] = value;
    },
    removeItem(key: string) {
      delete data[key];
    },
  };
}

describe("tile position storage keys", () => {
  for (const [type, expected] of Object.entries(EXPECTED_KEYS)) {
    it(`${type} uses ${expected}`, () => {
      expect(tilePositionStorageKey(type, SCOPE, WIDGET)?.key).toBe(expected);
    });
  }

  it("matches a card with no dashboard scope", () => {
    expect(tilePositionStorageKey("light_card", undefined, WIDGET)?.key).toBe(
      "dashboard.floatingLightCardPosition.w1"
    );
    expect(tilePositionStorageKey("weather_card", undefined, WIDGET)?.key).toBe(
      "dashboard.floatingWeatherCardPosition"
    );
    expect(tilePositionStorageKey("media_card", undefined, WIDGET)?.key).toBe(
      "dashboard.floatingMediaCardPosition.w1"
    );
    expect(tilePositionStorageKey("device_consumption_card", undefined, WIDGET)?.key).toBe(
      "dashboard.floatingDeviceConsumptionCardPosition"
    );
  });

  it("has no key for a type without a saved path", () => {
    expect(tilePositionStorageKey("not_a_card", SCOPE, WIDGET)).toBeNull();
  });

  it("writes the same JSON shape as savePosition and does not overwrite a shared key", () => {
    const storage = memoryStorage({
      "dashboard.floatingWeatherCardPosition.dash": "{\"left\":16,\"bottom\":32}",
    });
    const weather = writeTilePosition(storage, "weather_card", SCOPE, WIDGET, { left: 96, bottom: 400 });
    expect(weather.written).toBe(false);
    expect(storage.data["dashboard.floatingWeatherCardPosition.dash"]).toBe("{\"left\":16,\"bottom\":32}");

    const light = writeTilePosition(storage, "light_card", SCOPE, WIDGET, { left: 96, bottom: 400 });
    expect(light).toEqual({
      written: true,
      key: "dashboard.floatingLightCardPosition.dash.w1",
      shared: false,
    });
    expect(storage.data[light.key!]).toBe(serializeTilePosition({ left: 96, bottom: 400 }));
    expect(serializeTilePosition({ left: 96, bottom: 400 })).toBe("{\"left\":96,\"bottom\":400}");
  });

  it("writes a shared key only when that card does not already have one", () => {
    const storage = memoryStorage();
    const first = writeTilePosition(storage, "climate_card_2", SCOPE, "climate-1", { left: 112, bottom: 240 });
    expect(first.written).toBe(true);
    expect(first.key).toBe("dashboard.floatingClimateCardPosition.dash");
    const second = writeTilePosition(storage, "climate_card", SCOPE, "climate-2", { left: 200, bottom: 80 });
    expect(second.written).toBe(false);
    expect(storage.data[first.key!]).toBe("{\"left\":112,\"bottom\":240}");
  });

  it("drops a key that a failed save, cancel, or undo must not leave behind", () => {
    const storage = memoryStorage({
      "dashboard.floatingSensorCardPosition.dash.w1": "{\"left\":96,\"bottom\":400}",
      "dashboard.floatingLightCardPosition.dash.keep": "{\"left\":32,\"bottom\":32}",
    });
    forgetTilePosition(storage, "dashboard.floatingSensorCardPosition.dash.w1");
    expect(storage.data["dashboard.floatingSensorCardPosition.dash.w1"]).toBeUndefined();
    expect(storage.data["dashboard.floatingLightCardPosition.dash.keep"]).toBe("{\"left\":32,\"bottom\":32}");
    forgetTilePosition(storage, null);
  });

  it("keeps a shared key when another card of that type remains", () => {
    expect(sharedPositionStillUsed("climate_card_2", ["climate_card"])).toBe(true);
    expect(sharedPositionStillUsed("weather_card", ["light_card"])).toBe(false);
    expect(sharedPositionStillUsed("light_card", ["light_card"])).toBe(false);
    expect(sharedPositionStillUsed("vacuum_card", ["vacuum_card_2"])).toBe(false);
  });
});

describe("isSingletonTileType", () => {
  it("is true for the four types that only render the first card per page", () => {
    expect(isSingletonTileType("weather_card")).toBe(true);
    expect(isSingletonTileType("solar_card")).toBe(true);
    expect(isSingletonTileType("power_usage_card")).toBe(true);
    expect(isSingletonTileType("vacuum_card")).toBe(true);
  });

  it("is false for vacuum v2, climate, and every other type", () => {
    expect(isSingletonTileType("vacuum_card_2")).toBe(false);
    expect(isSingletonTileType("climate_card")).toBe(false);
    expect(isSingletonTileType("climate_card_2")).toBe(false);
    expect(isSingletonTileType("light_card")).toBe(false);
    expect(isSingletonTileType("stat_pill_card")).toBe(false);
  });
});

describe("duplicate is hidden for singleton tiles", () => {
  const page = readFileSync("src/app/dashboards/[id]/page.tsx", "utf8");

  it("guards the duplicate menu item and handleDuplicateTile", () => {
    expect(page).toMatch(
      /if \(!isSingletonTileType\(tileMenuWidget\.type\)\) \{\s*tileMenuItems\.push\(\{\s*key: "duplicate"/
    );
    const handler = page.slice(page.indexOf("function handleDuplicateTile"), page.indexOf("function handleUpdateTile"));
    expect(handler).toContain("if (isSingletonTileType(original.type)) return undefined;");
    expect(page).toContain("!addingTile && !isSingletonTileType(editingWidget.type)");
  });
});
