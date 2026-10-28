import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const FILES = [
  "src/lib/energy-time.ts",
  "src/lib/energy-prefs.ts",
  "src/lib/energy-stats.ts",
  "src/lib/energy-cache.ts",
  "src/lib/ha/ws-commands.ts",
  "src/lib/ha/ha-config.ts",
  "src/lib/ha/mock-ha.ts",
  "src/app/api/ha/energy/prefs/route.ts",
  "src/app/api/ha/energy/statistics/route.ts",
  "scripts/mock-ha.mjs",
];

describe("energy server dates", () => {
  it("does not slice a UTC date or read the process clock hour", () => {
    const forbidden = ["toISOString().slice(0, 10)", "toISOString().slice(0,10)", ".setHours(", ".getHours("];
    for (const file of FILES) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      for (const snippet of forbidden) {
        expect(source, file).not.toContain(snippet);
      }
    }
  });
});
