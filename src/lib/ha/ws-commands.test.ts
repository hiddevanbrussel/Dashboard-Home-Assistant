import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { startMockHa, type MockHaHandle } from "./mock-ha";
import { HA_WS_COMMAND_ALLOWLIST, HA_WS_COMMAND_TIMEOUT_MS, haWsCommands } from "./ws-commands";

const TOKEN = "llat-ws-token-do-not-leak-44aa";

describe("haWsCommands", () => {
  let server: MockHaHandle | undefined;
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const info = vi.spyOn(console, "info").mockImplementation(() => {});
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
  const spies = [log, info, warn, error, debug];

  afterEach(async () => {
    for (const spy of spies) {
      for (const call of spy.mock.calls) expect(JSON.stringify(call)).not.toContain(TOKEN);
      spy.mockClear();
    }
    await server?.close();
    server = undefined;
  });

  afterAll(() => {
    for (const spy of spies) spy.mockRestore();
  });

  it("rejects a command outside the allowlist before opening a socket", async () => {
    server = await startMockHa();
    expect(HA_WS_COMMAND_ALLOWLIST).not.toContain("energy/save_prefs");
    expect(HA_WS_COMMAND_TIMEOUT_MS).toBe(15_000);
    await expect(haWsCommands({ baseUrl: server.baseUrl, token: TOKEN }, [{ type: "energy/save_prefs" }])).rejects.toThrow(
      /Disallowed websocket command: energy\/save_prefs/
    );
    expect(server.connections).toBe(0);
    expect(server.calls).toEqual([]);
  });

  it("sends the allowlisted commands together on one socket and then closes", async () => {
    server = await startMockHa({ releaseAfter: 2 });
    const results = await haWsCommands(
      { baseUrl: server.baseUrl, token: TOKEN },
      [{ type: "energy/get_prefs" }, { type: "recorder/list_statistic_ids" }],
      { timeoutMs: 1000 }
    );
    expect(results.map((result) => result.success)).toEqual([true, true]);
    expect(server.connections).toBe(1);
    expect(server.calls.map((call) => call.type)).toEqual(["energy/get_prefs", "recorder/list_statistic_ids"]);
    if (results[0]?.success) {
      expect(JSON.stringify(results[0].result)).not.toContain(TOKEN);
    }
  });

  it("times out and does not echo the token", async () => {
    server = await startMockHa({ silent: true });
    await expect(
      haWsCommands({ baseUrl: server.baseUrl, token: TOKEN }, [{ type: "energy/info" }], { timeoutMs: 40 })
    ).rejects.toThrow(/timeout/i);
  });
});
