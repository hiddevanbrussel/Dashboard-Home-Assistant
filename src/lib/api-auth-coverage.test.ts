import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.join(process.cwd(), "src/app/api");
const PUBLIC = new Set([
  "src/app/api/health/route.ts",
  "src/app/api/auth/login/route.ts",
  "src/app/api/auth/logout/route.ts",
  "src/app/api/pwa-icon/route.tsx",
]);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry === "route.ts" || entry === "route.tsx") out.push(full);
  }
  return out;
}

describe("API auth coverage", () => {
  it("requires a session on every route except the public allowlist", () => {
    const missing: string[] = [];
    for (const file of walk(ROOT)) {
      const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
      if (PUBLIC.has(rel)) continue;
      const source = readFileSync(file, "utf8");
      if (!source.includes("requireApiAuth")) missing.push(rel);
    }
    expect(missing).toEqual([]);
  });
});
