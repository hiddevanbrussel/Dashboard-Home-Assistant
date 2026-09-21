import { afterEach, describe, expect, it, vi } from "vitest";
import { callMaServer, resetMaServerCache } from "./ma-server";

describe("ma server cache", () => {
  afterEach(() => {
    resetMaServerCache();
    vi.unstubAllGlobals();
  });

  it("reuses in-flight and cached library calls", async () => {
    let hits = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        hits += 1;
        return new Response(JSON.stringify({ result: { items: [{ name: "A" }] } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    const first = callMaServer("http://ma:8095", "", "music/albums/library_items", { limit: 10 });
    const second = callMaServer("http://ma:8095", "", "music/albums/library_items", { limit: 10 });
    await Promise.all([first, second]);
    await callMaServer("http://ma:8095", "", "music/albums/library_items", { limit: 10 });
    expect(hits).toBe(1);
  });
});
