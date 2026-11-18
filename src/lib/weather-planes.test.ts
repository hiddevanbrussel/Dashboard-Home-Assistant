import { compositeHex, contrastRatio } from "./weather-sky";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  createPlanePlanner, flightHash, parseFlights, planeAllowed, planeContrail, planeGeometry,
  planeLabel, planeLabelAllowed, planeContrailLength, planePalette, planeSensors, planeSilhouette, planeWeather,
  resolvePlaneOptions, type Flight, type PlanePolicy, type PlaneSensor,
} from "./weather-planes";
const sensor = (flights: unknown = [], state = "1"): PlaneSensor => ({ entity_id: "sensor.flightradar24_current_in_area", state, attributes: { flights } });
const raw = (id = "fictional-alpha", extra = {}) => ({ id, callsign: "FKE1234", aircraft_code: "B738", altitude: 30000, heading: 90, ground_speed: 420, ...extra });
const flight = (extra = {}): Flight => parseFlights(sensor([raw("fictional-alpha", extra)]))[0];
const policy: PlanePolicy = { mode: "animated-full", performanceStep: 0, paused: false, compact: false, stacked: false, condition: "sunny", precipitation: 0 };
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(0); });
afterEach(() => { vi.useRealTimers(); });
function planner(options = {}) {
  const start = vi.fn(), remove = vi.fn();
  const p = createPlanePlanner({ now: () => Date.now(), setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: id => clearTimeout(id as ReturnType<typeof setTimeout>) }, { start, remove });
  p.updatePolicy({ ...policy, ...options });
  return { p, start, remove };
}
describe("plane sensor discovery and parsing", () => {
  it("auto-links one in-area sensor and never mutates saved options", () => {
    const original = {}; const s = sensor();
    expect(resolvePlaneOptions(original, [])).toEqual({ show_planes: false, planes_entity_id: "" });
    expect(resolvePlaneOptions(original, [s])).toEqual({ show_planes: true, planes_entity_id: s.entity_id });
    expect(original).toEqual({});
    expect(planeSensors([sensor(null)])).toEqual([]);
    const two = [s, { ...s, entity_id: s.entity_id + "_2" }];
    expect(resolvePlaneOptions({}, two)).toEqual({ show_planes: false, planes_entity_id: "" });
    expect(planeSensors(two).map(s => s.entity_id)).toEqual(two.map(s => s.entity_id));
    expect(resolvePlaneOptions({ planes_entity_id: two[1].entity_id, show_planes: true }, two).show_planes).toBe(true);
    expect(resolvePlaneOptions({ show_planes: false }, [s]).show_planes).toBe(false);
  });
  it("uses the fallback recognition marker only if no named sensor exists", () => {
    const fallback = { ...sensor(), entity_id: "sensor.flight_mock", attributes: { flights: [], bounds: "10.0,20.0,9.0,19.0" } };
    expect(resolvePlaneOptions({}, [fallback]).planes_entity_id).toBe(fallback.entity_id);
    expect(resolvePlaneOptions({}, [fallback, sensor()]).planes_entity_id).toBe(sensor().entity_id);
    expect(planeSensors([fallback, sensor()])[0].entity_id).toBe(sensor().entity_id);
  });
  it.each([undefined, null, "bad", {}, 3, []])("handles malformed flight lists: %s", flights => {
    expect(parseFlights(sensor(flights))).toEqual([]);
  });
  it("filters ground, low, scheduled, malformed and duplicate flights", () => {
    expect(parseFlights(sensor([null, {}, raw("ground", { on_ground: "1" }), raw("low", { altitude: "300" }), raw("edge", { altitude: 500 }), raw("later", { tracked_type: "scheduled" }), raw(), raw()]))).toHaveLength(1);
    expect(parseFlights(sensor([raw()], "unavailable"))).toEqual([]);
    expect(parseFlights(sensor([raw()], "unknown"))).toEqual([]);
    expect(parseFlights()).toEqual([]);
  });
  it("coerces numeric strings and uses safe missing-value defaults", () => {
    expect(flight({ altitude: "28000", heading: "270", ground_speed: "400" })).toMatchObject({ altitude: 28000, heading: 270, groundSpeed: 400 });
    expect(flight({ altitude: undefined, on_ground: undefined, ground_speed: "invalid" })).toMatchObject({ altitude: undefined, groundSpeed: 420 });
  });
  it("uses partial labels, a fallback number and the approved trim", () => {
    expect(planeLabel(flight())).toBe("FKE1234 · B738");
    expect(planeLabel(flight({ callsign: "", flight_number: "FKE5678" }))).toBe("FKE5678 · B738");
    expect(planeLabel(flight({ callsign: "" }))).toBe("B738");
    expect(planeLabel(flight({ aircraft_code: "" }))).toBe("FKE1234");
    expect(planeLabel(flight({ callsign: "", aircraft_code: "" }))).toBe("");
    expect(planeLabel(flight({ callsign: "FICTIONAL-LONG-FLIGHT" }))).toHaveLength(18);
    expect(planeLabel(flight({ callsign: "FICTIONAL-LONG-FLIGHT" })).endsWith("…")).toBe(true);
    expect(planeLabelAllowed(300, false)).toBe(true); expect(planeLabelAllowed(160, false)).toBe(false); expect(planeLabelAllowed(300, true)).toBe(false);
  });
});
describe("plane geometry, assets and weather", () => {
  it.each(["B744", "B763", "B77W", "B789", "A333", "A346", "A359", "A388", "MD11", "IL96"])("selects wide %s", c => expect(planeSilhouette(c)).toBe("breed"));
  it.each(["AT72", "DH8D", "C172", "PA28", "SR22", "BE20", "PC12", "E170", "E175", "E145", "E75S", "EC35", "AW139", "R44"])("selects small %s", c => expect(planeSilhouette(c)).toBe("klein"));
  it.each(["B738", "A20N", "E190", "E195", "E290", "unknown"])("selects narrow %s", c => expect(planeSilhouette(c)).toBe("smal"));
  it("preserves the supplied source bytes and geometry", () => {
    const hashes = { breed: "44fb158173d185de5871bfedee3e2de5a1cfa644a716386754d545d797f5be86", klein: "505e7181e31ac026359ec8d86093c9be2cd2e51654446a91a41eeac3938e6d97", smal: "5be05fa62b703a253cdf4a81b8426bfa26c874b66c9df5f010a80b40aeaf9c18" };
    for (const [name, hash] of Object.entries(hashes)) {
      const source = readFileSync(`src/components/weather/planes/plane-${name}.tsx`, "utf8").match(/SOURCE = `([\s\S]*?)`;/)![1];
      expect(createHash("sha256").update(source).digest("hex")).toBe(hash);
    }
  });
  it("uses degrees, mirrored heading and stable north/south hashing", () => {
    expect(planeGeometry(flight({ heading: 90 }), 320, 300, false).eastbound).toBe(true);
    expect(planeGeometry(flight({ heading: 270 }), 320, 300, false).eastbound).toBe(false);
    for (const heading of [0, 10, 15, 165, 180, 190, 195, 345, 350, 375, -15]) expect(planeGeometry(flight({ heading }), 320, 300, false).eastbound).toBe(flightHash(flight().id) % 2 === 0);
  });
  it("clamps duration, scale and pitch and starts fully off-tile", () => {
    const normal = planeGeometry(flight({ altitude: undefined, ground_speed: undefined }), 320, 300, false);
    expect(normal.duration).toBe(16); expect(normal.scale).toBe(1); expect(normal.startX + normal.length / 2).toBe(0);
    expect(normal.endX - normal.length / 2).toBe(320);
    expect(planeGeometry(flight({ ground_speed: 20, altitude: 60000 }), 320, 300, false)).toMatchObject({ duration: 24, scale: .65 });
    expect(planeGeometry(flight({ ground_speed: 900 }), 320, 160, true).duration).toBe(10);
    expect(planeGeometry(flight({ heading: 180, vertical_speed: 900 }), 320, 300, false).pitch).toBe(9);
    expect(planeGeometry(flight(), 500, 420, false).duration).toBeCloseTo(16 * Math.sqrt(500 / 320));

  });
  it.each(["pouring", "fog", "mist", "hail", "snowy-rainy", "lightning", "lightning-rainy", "exceptional", "unavailable"])("blocks %s", c => expect(planeWeather(c, 0).chance).toBe(0));
  it("caps and altitude-scales contrails and uses theme-specific twilight colours", () => {
    expect(planeContrailLength(320, .8)).toBeCloseTo(107.52);
    expect(planeContrailLength(500, .65)).toBe(91);
    expect(planePalette("dusk", "light").trail).toBe("rgba(255,236,228,.7)");
    expect(planePalette("dawn", "dark").trail).toBe("rgba(230,200,205,.32)");
    expect(planeContrail(flight(), "windy", 0, "day")).toBe(false);
  });
  it("keeps the label at WCAG text contrast on worst-case backgrounds", () => {
    const light = compositeHex("#F7FAFD", "#000000", .90);
    const dark = compositeHex("#121826", "#FFFFFF", .86);
    expect(contrastRatio("#435066", light)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(compositeHex("#FFFFFF", dark, .8), dark)).toBeGreaterThanOrEqual(4.5);
  });
  it("uses deterministic weather chance and limits contrails to approved phases and conditions", () => {
    expect(planeAllowed(flight(), "sunny", 0)).toBe(true);
    expect(planeWeather("cloudy", 0)).toEqual({ chance: 60, contrail: false });
    expect(planeWeather("rainy", 1).chance).toBe(70); expect(planeWeather("rainy", 3).chance).toBe(0);
    expect(planeWeather("snowy", 0).chance).toBe(70); expect(planeWeather("snowy", .5).chance).toBe(0);
    expect(planeAllowed(flight(), "cloudy", 0)).toBe(flightHash(flight().id) % 100 < 60);
    expect(planeContrail(flight(), "sunny", 0, "day")).toBe(true);
    expect(planeContrail(flight(), "sunny", 0, "dusk")).toBe(true);
    for (const c of ["windy", "cloudy", "clear-night"]) expect(planeContrail(flight(), c, 0, "night")).toBe(false);
    expect(planeContrail(flight({ altitude: 10000 }), "sunny", 0, "day")).toBe(false);
    expect(planePalette("night", "dark").opacity).toBe(.30);
  });
});
describe("timer-only plane planner", () => {
  it("starts one page-load flight after 3s, deduplicates and expires a burst queue", () => {
    const { p, start } = planner(); p.updateSensor(sensor([raw()]));
    vi.advanceTimersByTime(2999); expect(start).not.toHaveBeenCalled(); vi.advanceTimersByTime(1); expect(start).toHaveBeenCalledTimes(1);
    p.finish(flight().id); p.updateSensor(sensor(Array.from({ length: 5 }, (_, i) => raw(`fictional-${i}`))));
    expect(p.inspect().queued).toBe("fictional-0"); vi.advanceTimersByTime(90000); expect(start).toHaveBeenCalledTimes(1); expect(p.inspect().queued).toBeUndefined();
    p.updateSensor(sensor([raw()])); expect(start).toHaveBeenCalledTimes(1); p.dispose(); expect(vi.getTimerCount()).toBe(0);
  });
  it("keeps starts at least 90s apart and never exceeds twelve per hour", () => {
    const { p, start } = planner(); p.updateSensor(sensor([]));
    for (let i = 0; i < 40; i++) { p.updateSensor(sensor([raw(`fictional-${i}`)])); vi.advanceTimersByTime(24000); for (const id of p.inspect().active) p.finish(id); vi.advanceTimersByTime(66000); }
    expect(start).toHaveBeenCalledTimes(12);
    const starts = p.inspect().starts; for (let i = 1; i < starts.length; i++) expect(starts[i] - starts[i - 1]).toBeGreaterThanOrEqual(90000);
  });
  it.each([{ compact: true }, { stacked: true }, { mode: "animated-calm" as const }, { performanceStep: 1 }])("limits concurrent crossings %s", options => {
    const { p, start } = planner(options); p.updateSensor(sensor([])); p.updateSensor(sensor([raw()])); vi.advanceTimersByTime(90000);
    p.updateSensor(sensor([raw("fictional-next")])); expect(start).toHaveBeenCalledTimes(1); expect(p.inspect().active).toHaveLength(1);
  });
  it("keeps On's 90s spacing when performance step one reduces density", () => {
    const { p, start } = planner({ mode: "animated-calm", calm: false, performanceStep: 1 });
    p.updateSensor(sensor([])); p.updateSensor(sensor([raw()])); p.finish(flight().id);
    vi.advanceTimersByTime(90000); p.updateSensor(sensor([raw("fictional-later")])); expect(start).toHaveBeenCalledTimes(2);
  });
  it("never overlaps crossings even if the first is still active after ninety seconds", () => {
    const { p, start } = planner(); p.updateSensor(sensor([])); p.updateSensor(sensor([raw()]));
    vi.advanceTimersByTime(90000); p.updateSensor(sensor([raw("fictional-next")]));
    expect(start).toHaveBeenCalledTimes(1); expect(p.inspect().active).toHaveLength(1);
    p.finish(flight().id); expect(start).toHaveBeenCalledTimes(2);
    expect(p.inspect().starts[1] - p.inspect().starts[0]).toBeGreaterThanOrEqual(90000);
  });
  it("requests one visible 300ms pause exit, then cancels immediately if it becomes hidden", () => {
    const { p, remove } = planner({ visible: true }); p.updateSensor(sensor([raw()])); vi.advanceTimersByTime(3000);
    p.updatePolicy({ ...policy, visible: true, paused: true }); vi.advanceTimersByTime(5001);
    expect(remove).toHaveBeenCalledWith(flight().id, true, 300, "pause");
    const count = remove.mock.calls.length; p.updatePolicy({ ...policy, visible: true, paused: true });
    expect(remove).toHaveBeenCalledTimes(count);
    p.updatePolicy({ ...policy, visible: false, paused: true });
    expect(remove).toHaveBeenCalledWith(flight().id, false); expect(p.inspect().active).toHaveLength(0);
  });
  it("uses a five-minute Calm cooldown", () => {
    const { p, start } = planner({ mode: "animated-calm" }); p.updateSensor(sensor([])); p.updateSensor(sensor([raw()])); p.finish(flight().id);
    vi.advanceTimersByTime(90000); p.updateSensor(sensor([raw("fictional-too-soon")])); vi.advanceTimersByTime(60000); expect(start).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(150000); p.updateSensor(sensor([raw("fictional-later")])); expect(start).toHaveBeenCalledTimes(2);
  });
  it("pauses without catch-up, clears nodes and queue after five seconds, and does not replay load", () => {
    const { p, start, remove } = planner(); p.updateSensor(sensor([raw()])); vi.advanceTimersByTime(3000);
    p.updatePolicy({ ...policy, paused: true }); p.updateSensor(sensor([raw("fictional-paused")])); vi.advanceTimersByTime(5001);
    expect(remove).toHaveBeenCalledWith(flight().id, false); expect(p.inspect().queued).toBeUndefined();
    p.updatePolicy(policy); vi.advanceTimersByTime(90000); expect(start).toHaveBeenCalledTimes(1);
    p.updateSensor(sensor([raw("fictional-paused")])); expect(start).toHaveBeenCalledTimes(1);
  });
  it("defers an initial flight through short plot-in pauses but cancels a long initial pause", () => {
    const { p, start } = planner({ paused: true }); p.updateSensor(sensor([raw()])); vi.advanceTimersByTime(800); p.updatePolicy(policy); vi.advanceTimersByTime(2200); expect(start).toHaveBeenCalledTimes(1);
    const another = planner({ paused: true }); another.p.updateSensor(sensor([raw()])); vi.advanceTimersByTime(5001); another.p.updatePolicy(policy); vi.advanceTimersByTime(3000); expect(another.start).not.toHaveBeenCalled();
  });
  it("fades unavailable sensors and newly blocked weather, cancels static modes", () => {
    const { p, remove } = planner(); p.updateSensor(sensor([])); p.updateSensor(sensor([raw()])); p.updateSensor(sensor([], "unavailable")); expect(remove).toHaveBeenCalledWith(flight().id, true, 1500); p.finish(flight().id);
    vi.advanceTimersByTime(90000); p.updateSensor(sensor([raw("fictional-storm")])); p.updatePolicy({ ...policy, condition: "pouring" }); expect(remove).toHaveBeenCalledWith("fictional-storm", true, 1500);
    p.updatePolicy({ ...policy, mode: "static" }); expect(p.inspect().active).toEqual([]);
  });
  it("bounds the id cache to fifty and expires old ids after thirty minutes", () => {
    const { p } = planner(); p.updateSensor(sensor(Array.from({ length: 60 }, (_, i) => raw(`fictional-${i}`))));
    expect(p.inspect().cache).toHaveLength(50); expect(p.inspect().cache[0]).toBe("fictional-10");
    vi.advanceTimersByTime(1803000); p.updateSensor(sensor([])); expect(p.inspect().cache).toHaveLength(0);
  });
});


describe("plane pause exit reason", () => {
  it("marks long-pause exits explicitly, without marking unavailable-sensor exits", () => {
    const { p, remove } = planner({ visible: true }); p.updateSensor(sensor([raw()])); vi.advanceTimersByTime(3000);
    p.updatePolicy({ ...policy, visible: true, paused: true }); vi.advanceTimersByTime(5001);
    expect(remove).toHaveBeenLastCalledWith(flight().id, true, 300, "pause");
    const other = planner(); other.p.updateSensor(sensor([raw()])); vi.advanceTimersByTime(3000);
    other.p.updateSensor(sensor([], "unavailable"));
    expect(other.remove).toHaveBeenLastCalledWith(flight().id, true, 1500);
  });
});
