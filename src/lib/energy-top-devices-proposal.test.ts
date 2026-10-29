import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { energyModelFromCommand, parseEnergyPrefs } from "./energy-prefs";
import { topDeviceLabel } from "./energy-top-devices-order";
import {
  formatKwh1,
  listOverflows,
  mergeProposedCandidates,
  needsDeviceSetupGuide,
  proposalFromModel,
  roundKwh1,
  visibleStatisticIds,
} from "./energy-top-devices-proposal";

const FIXTURES = path.join(process.cwd(), "src/lib/ha/__fixtures__/energy");

function readFixture(name: string): unknown {
  return JSON.parse(readFileSync(path.join(FIXTURES, name), "utf8")) as unknown;
}

describe("device consumption proposal", () => {
  it("reads a proposal from each prefs generation and a setup guide when it is empty", () => {
    expect(proposalFromModel(parseEnergyPrefs(readFixture("prefs-2025.11.json"))).map((device) => device.id)).toEqual([
      "sensor.fridge",
    ]);
    expect(needsDeviceSetupGuide(proposalFromModel(parseEnergyPrefs(readFixture("prefs-2025.12.json"))))).toBe(true);
    expect(proposalFromModel(parseEnergyPrefs(readFixture("prefs-2026.2.json"))).map((device) => device.id)).toEqual([
      "sensor.fridge",
    ]);
    const current = proposalFromModel(parseEnergyPrefs(readFixture("prefs-2026.3.json")));
    expect(current).toEqual([{ id: "sensor.fridge", name: "Fridge" }]);
    expect(needsDeviceSetupGuide(current)).toBe(false);
    const missing = energyModelFromCommand(readFixture("prefs-not-found.json") as never);
    expect(needsDeviceSetupGuide(proposalFromModel(missing))).toBe(true);
  });

  it("places the proposal above other energy sensors", () => {
    const entities = [
      { entity_id: "sensor.oven", attributes: { device_class: "energy", state_class: "total" } },
      { entity_id: "sensor.fridge", attributes: { friendly_name: "Koelkast", device_class: "energy", state_class: "total_increasing" } },
      { entity_id: "light.keuken", attributes: { device_class: "energy", state_class: "total" } },
    ];
    const merged = mergeProposedCandidates(entities, [
      { id: "sensor.fridge", name: "Fridge" },
      { id: "sensor.boiler", name: "Boiler" },
    ]);
    expect(merged.map((entity) => entity.entity_id)).toEqual(["sensor.fridge", "sensor.boiler", "sensor.oven"]);
    expect(merged[0]?.attributes?.friendly_name).toBe("Koelkast");
    expect(merged[1]?.attributes?.friendly_name).toBe("Boiler");
  });

  it("labels a nameless prefs-only device as missing and keeps a named one", () => {
    const unnamed = mergeProposedCandidates([], [{ id: "sensor.spook", name: null }]);
    expect(topDeviceLabel("sensor.spook", unnamed, "Energy sensor", "Not found")).toBe("Not found");
    const named = mergeProposedCandidates([], [{ id: "sensor.spook", name: "QA Spookapparaat" }]);
    expect(topDeviceLabel("sensor.spook", named, "Energy sensor", "Not found")).toBe("QA Spookapparaat");
    const inHomeAssistant = mergeProposedCandidates(
      [{ entity_id: "sensor.meter", attributes: { device_class: "energy", state_class: "total_increasing" } }],
      []
    );
    expect(topDeviceLabel("sensor.meter", inHomeAssistant, "Energy sensor", "Not found")).toBe("Energy sensor");
  });

  it("rounds today to one decimal and asks for at most five statistic ids", () => {
    expect(roundKwh1(1.26)).toBe(1.3);
    expect(roundKwh1(1.24)).toBe(1.2);
    expect(formatKwh1(1.26, "nl")).toBe("1,3");
    expect(formatKwh1(1.26, "en")).toBe("1.3");
    const ids = ["sensor.a", "sensor.b", "sensor.c", "sensor.d", "sensor.e", "sensor.f", "light.x", "sensor.a"];
    expect(visibleStatisticIds(ids)).toEqual(["sensor.a", "sensor.b", "sensor.c", "sensor.d", "sensor.e"]);
    expect(listOverflows(400, 320)).toBe(true);
    expect(listOverflows(320, 320)).toBe(false);
  });
});
