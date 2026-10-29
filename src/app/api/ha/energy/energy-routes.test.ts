import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { clearEnergyStatisticsCache } from "@/lib/energy-cache";
import { clearHaTimeZoneCache } from "@/lib/ha/ha-config";
import { startMockHa, type MockHaHandle } from "@/lib/ha/mock-ha";
import { SESSION_COOKIE, signSession } from "@/lib/session";
import { GET as getPrefs } from "./prefs/route";
import { GET as getStatistics } from "./statistics/route";

const SECRET = "k7Qx-9mP2vL4nR8wT6yH3cF5bN1aZ0eD";
const TOKEN = "llat-route-token-do-not-leak-77bb";

const db = vi.hoisted(() => ({
  getHaConnection: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getHaConnection: db.getHaConnection,
}));

function sessionCookie(): string {
  return `${SESSION_COOKIE}=${signSession(SECRET)}`;
}

describe("energy api routes", () => {
  let full: MockHaHandle;
  let bare: MockHaHandle;
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const info = vi.spyOn(console, "info").mockImplementation(() => {});
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const debug = vi.spyOn(console, "debug").mockImplementation(() => {});

  beforeAll(async () => {
    full = await startMockHa({ fixtureSet: "full" });
    bare = await startMockHa({ fixtureSet: "no-prefs" });
  });

  beforeEach(() => {
    process.env.APP_SECRET = SECRET;
    clearEnergyStatisticsCache();
    clearHaTimeZoneCache();
    full.calls.length = 0;
    bare.calls.length = 0;
    log.mockClear();
    info.mockClear();
    warn.mockClear();
    error.mockClear();
    debug.mockClear();
    db.getHaConnection.mockReset();
  });

  afterAll(async () => {
    delete process.env.APP_SECRET;
    log.mockRestore();
    info.mockRestore();
    warn.mockRestore();
    error.mockRestore();
    debug.mockRestore();
    await full.close();
    await bare.close();
  });

  function use(server: MockHaHandle) {
    db.getHaConnection.mockResolvedValue({ baseUrl: server.baseUrl, token: TOKEN });
  }

  it("returns 401 without a session", async () => {
    const prefs = await getPrefs(new Request("http://dashboard.local/api/ha/energy/prefs"));
    const stats = await getStatistics(new Request("http://dashboard.local/api/ha/energy/statistics?view=day"));
    expect(prefs.status).toBe(401);
    expect(stats.status).toBe(401);
    expect(db.getHaConnection).not.toHaveBeenCalled();
  });

  it("ignores manual and device ids outside the allowlist and keeps the token out of the response", async () => {
    use(bare);
    const response = await getStatistics(
      new Request(
        "http://dashboard.local/api/ha/energy/statistics?view=day&manual=sensor.solar_yield_mwh,sensor.temperature,sensor.NOT_VALID,sensor.battery_soc&devices=sensor.fridge,bogus",
        { headers: { cookie: sessionCookie() } }
      )
    );
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).not.toContain(TOKEN);
    expect(body).not.toContain("access_token");
    expect(body).not.toContain(bare.baseUrl);
    const stats = JSON.parse(body) as { series: { gridImport: Array<number | null> }; devices?: { items: Array<{ id: string }> } };
    expect(stats.series.gridImport.some((value) => value != null)).toBe(true);
    expect(stats.devices?.items.map((item) => item.id)).toEqual(["sensor.fridge"]);
    const ids = bare.calls
      .filter((call) => call.type === "recorder/statistics_during_period")
      .flatMap((call) => call.statisticIds ?? []);
    expect(ids).toContain("sensor.solar_yield_mwh");
    expect(ids).toContain("sensor.fridge");
    expect(ids).not.toContain("sensor.temperature");
    expect(ids).not.toContain("sensor.NOT_VALID");
    expect(ids).not.toContain("sensor.battery_soc");
    for (const spy of [log, info, warn, error, debug]) {
      for (const call of spy.mock.calls) expect(JSON.stringify(call)).not.toContain(TOKEN);
    }
  });

  it("reads ids from prefs and ignores a manual id when prefs exist", async () => {
    use(full);
    const prefsResponse = await getPrefs(
      new Request("http://dashboard.local/api/ha/energy/prefs", { headers: { cookie: sessionCookie() } })
    );
    const prefsBody = await prefsResponse.text();
    expect(prefsResponse.status).toBe(200);
    expect(prefsBody).toContain("\"source\":\"prefs\"");
    expect(prefsBody).toContain("sensor.grid_import");
    expect(prefsBody).not.toContain(TOKEN);

    const statsResponse = await getStatistics(
      new Request("http://dashboard.local/api/ha/energy/statistics?view=day&manual=sensor.solar_yield_mwh", {
        headers: { cookie: sessionCookie() },
      })
    );
    expect(statsResponse.status).toBe(200);
    const ids = full.calls
      .filter((call) => call.type === "recorder/statistics_during_period")
      .flatMap((call) => call.statisticIds ?? []);
    expect(ids).toContain("sensor.grid_import");
    expect(ids).not.toContain("sensor.solar_yield_mwh");
    expect(await statsResponse.text()).not.toContain(TOKEN);
  });

  it("returns cached prefs without a websocket when Home Assistant is down", async () => {
    const server = await startMockHa({ fixtureSet: "full" });
    db.getHaConnection.mockResolvedValue({ baseUrl: server.baseUrl, token: TOKEN });
    const headers = { cookie: sessionCookie() };
    const first = await getPrefs(new Request("http://dashboard.local/api/ha/energy/prefs", { headers }));
    const firstBody = await first.json();
    expect(first.status).toBe(200);
    expect(firstBody.source).toBe("prefs");
    expect(server.connections).toBe(1);
    const second = await getPrefs(new Request("http://dashboard.local/api/ha/energy/prefs", { headers }));
    expect(second.status).toBe(200);
    expect(await second.json()).toEqual(firstBody);
    expect(server.connections).toBe(1);
    await server.close();
    const duringOutage = await getPrefs(new Request("http://dashboard.local/api/ha/energy/prefs", { headers }));
    const outageBody = await duringOutage.text();
    expect(duringOutage.status).toBe(200);
    expect(JSON.parse(outageBody)).toEqual(firstBody);
    expect(outageBody).not.toContain(TOKEN);
    const unknown = await startMockHa({ fixtureSet: "full" });
    await unknown.close();
    db.getHaConnection.mockResolvedValue({ baseUrl: unknown.baseUrl, token: TOKEN });
    const missing = await getPrefs(new Request("http://dashboard.local/api/ha/energy/prefs", { headers }));
    expect(missing.status).toBe(502);
  });
});
