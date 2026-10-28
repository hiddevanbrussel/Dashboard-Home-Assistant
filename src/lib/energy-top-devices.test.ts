import { readFileSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  filterTopDeviceCandidates,
  parseTopDeviceIds,
  serializeTopDeviceIds,
  validateTopDeviceIds,
} from "@/lib/energy-dashboard";
import {
  addTopDevice,
  moveTopDevice,
  moveTopDeviceBy,
  removeTopDevice,
  restoreTopDevice,
} from "@/lib/energy-top-devices-order";
import { getTranslations } from "@/lib/i18n";

const root = process.cwd();

function sensor(
  entityId: string,
  deviceClass: string | null,
  stateClass: string | null
) {
  return {
    entity_id: entityId,
    attributes: {
      friendly_name: entityId,
      ...(deviceClass ? { device_class: deviceClass } : {}),
      ...(stateClass ? { state_class: stateClass } : {}),
    },
  };
}

describe("parseTopDeviceIds / serializeTopDeviceIds", () => {
  it("drops invalid ids, duplicates and anything past 5, and keeps order", () => {
    expect(
      parseTopDeviceIds([
        "sensor.heatpump",
        "nope",
        "sensor.heatpump",
        "sensor.washer",
        "SENSOR.bad",
        "sensor.fridge",
        "sensor.car",
        "sensor.boiler",
        "sensor.dryer",
      ])
    ).toEqual(["sensor.heatpump", "sensor.washer", "sensor.fridge", "sensor.car", "sensor.boiler"]);
    expect(parseTopDeviceIds(null)).toEqual([]);
    expect(parseTopDeviceIds(undefined)).toEqual([]);
    expect(parseTopDeviceIds("{")).toEqual([]);
    expect(parseTopDeviceIds("")).toEqual([]);
    expect(parseTopDeviceIds({ ids: ["sensor.a"] })).toEqual([]);
    expect(parseTopDeviceIds('["sensor.b","sensor.a","sensor.b"]')).toEqual(["sensor.b", "sensor.a"]);
  });

  it("serializes a cleaned list and stores an empty choice as null", () => {
    expect(serializeTopDeviceIds(["sensor.b", "sensor.a", "sensor.b"])).toBe(
      '["sensor.b","sensor.a"]'
    );
    expect(serializeTopDeviceIds([])).toBeNull();
    expect(serializeTopDeviceIds(["switch.lamp"])).toBeNull();
  });
});

describe("validateTopDeviceIds", () => {
  it("rejects a non-array, an invalid id and more than 5, and strips duplicates", () => {
    expect(validateTopDeviceIds("sensor.a")).toEqual({ ok: false, code: "not_array" });
    expect(validateTopDeviceIds(null)).toEqual({ ok: false, code: "not_array" });
    expect(validateTopDeviceIds(["sensor.ok", "sensor.Bad"])).toEqual({ ok: false, code: "invalid_id" });
    expect(validateTopDeviceIds(["sensor.a", 1])).toEqual({ ok: false, code: "invalid_id" });
    expect(
      validateTopDeviceIds([
        "sensor.a",
        "sensor.b",
        "sensor.c",
        "sensor.d",
        "sensor.e",
        "sensor.f",
      ])
    ).toEqual({ ok: false, code: "too_many" });
    expect(validateTopDeviceIds(["sensor.c", "sensor.a", "sensor.a", "sensor.b"])).toEqual({
      ok: true,
      ids: ["sensor.c", "sensor.a", "sensor.b"],
    });
    expect(
      validateTopDeviceIds(["sensor.a", "sensor.a", "sensor.a", "sensor.b", "sensor.c", "sensor.d", "sensor.e"])
    ).toEqual({ ok: true, ids: ["sensor.a", "sensor.b", "sensor.c", "sensor.d", "sensor.e"] });
  });
});

describe("filterTopDeviceCandidates", () => {
  it("keeps energy sensors with total or total_increasing, in the given order", () => {
    const entities = [
      sensor("sensor.washer", "energy", "total_increasing"),
      sensor("sensor.power", "power", "measurement"),
      sensor("sensor.kwh_only", "energy", null),
      sensor("sensor.heatpump", "Energy", "Total"),
      sensor("switch.lamp", "energy", "total_increasing"),
      sensor("sensor.bad-id", "energy", "total"),
      sensor("sensor.fridge", "energy", "total"),
      sensor("sensor.meter", "energy", "measurement"),
    ];
    expect(filterTopDeviceCandidates(entities).map((entity) => entity.entity_id)).toEqual([
      "sensor.washer",
      "sensor.heatpump",
      "sensor.fridge",
    ]);
  });
});

describe("top device order", () => {
  const ids = ["sensor.a", "sensor.b", "sensor.c"];

  it("moves up and down and stays put at the edges", () => {
    expect(moveTopDeviceBy(ids, 0, -1)).toEqual(ids);
    expect(moveTopDeviceBy(ids, 2, 1)).toEqual(ids);
    expect(moveTopDeviceBy(ids, 1, -1)).toEqual(["sensor.b", "sensor.a", "sensor.c"]);
    expect(moveTopDeviceBy(ids, 0, 1)).toEqual(["sensor.b", "sensor.a", "sensor.c"]);
    expect(moveTopDevice(ids, 2, 0)).toEqual(["sensor.c", "sensor.a", "sensor.b"]);
  });

  it("refuses a sixth device and restores a removal at the old index", () => {
    const five = ["sensor.a", "sensor.b", "sensor.c", "sensor.d", "sensor.e"];
    expect(addTopDevice(five, "sensor.f")).toEqual({ ok: false, reason: "full" });
    expect(addTopDevice(ids, "sensor.a")).toEqual({ ok: false, reason: "duplicate" });
    expect(addTopDevice(ids, "lamp")).toEqual({ ok: false, reason: "invalid" });
    expect(addTopDevice(ids, "sensor.d")).toEqual({ ok: true, ids: [...ids, "sensor.d"] });

    const removed = removeTopDevice(ids, "sensor.b");
    expect(removed).toEqual({ ids: ["sensor.a", "sensor.c"], index: 1 });
    expect(restoreTopDevice(removed.ids, "sensor.b", removed.index)).toEqual({ ok: true, ids });
    expect(restoreTopDevice(["sensor.a"], "sensor.b", 0)).toEqual({
      ok: true,
      ids: ["sensor.b", "sensor.a"],
    });
    expect(restoreTopDevice(five, "sensor.f", 2)).toEqual({ ok: false, reason: "full" });
  });
});

describe("top device copy and migration", () => {
  it("has the same settings.energy.topDevices keys in English and Dutch", () => {
    const en = getTranslations("en");
    const nl = getTranslations("nl");
    const keys = Object.keys(en).filter((key) => key.startsWith("settings.energy.topDevices."));
    expect(keys.length).toBeGreaterThan(20);
    for (const key of keys) {
      expect(nl[key], key).toBeTruthy();
      expect(en[key], key).not.toBe(key);
      expect(nl[key]).not.toBe(en[key]);
    }
    expect(Object.keys(nl).filter((key) => key.startsWith("settings.energy.topDevices."))).toEqual(keys);
  });

  it("adds only the topDeviceIds column", () => {
    const dirs = readdirSync(path.join(root, "prisma/migrations")).filter((name) =>
      name.endsWith("_energy_top_device_ids")
    );
    expect(dirs).toEqual(["20261028010000_energy_top_device_ids"]);
    const sql = readFileSync(path.join(root, "prisma/migrations", dirs[0], "migration.sql"), "utf8").trim();
    expect(sql).toBe('ALTER TABLE "EnergyDashboard" ADD COLUMN "topDeviceIds" TEXT;');
    const schema = readFileSync(path.join(root, "prisma/schema.prisma"), "utf8");
    expect(schema).toMatch(/topDeviceIds\s+String\?/);
    const store = readFileSync(path.join(root, "src/stores/energy-store.ts"), "utf8");
    expect(store).not.toContain("topDeviceIds");
  });

  it("leaves existing widgets untouched versus origin/main", () => {
    const diff = execSync("git diff origin/main -- src/components/widgets", { encoding: "utf8" });
    expect(diff).toBe("");
  });
});
