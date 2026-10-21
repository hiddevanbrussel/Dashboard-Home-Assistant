import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { stripHaIngressPrefix } from "./ha-ingress-prefix";

describe("stripHaIngressPrefix", () => {
  it("strips the add-on basePath only on a slash boundary", () => {
    expect(stripHaIngressPrefix("/__ha_ingress__")).toBe("");
    expect(stripHaIngressPrefix("/__ha_ingress__/")).toBe("/");
    expect(stripHaIngressPrefix("/__ha_ingress__/energy")).toBe("/energy");
    expect(stripHaIngressPrefix("/__ha_ingress__/energy/")).toBe("/energy/");
    expect(stripHaIngressPrefix("/__ha_ingress__/uploads/ok.png?v=1")).toBe("/uploads/ok.png?v=1");
    expect(stripHaIngressPrefix("/energy")).toBe("/energy");
    expect(stripHaIngressPrefix("/")).toBe("/");
    expect(stripHaIngressPrefix("")).toBe("");
  });

  it("does not strip a prefix that is only a prefix of a longer segment", () => {
    expect(stripHaIngressPrefix("/__ha_ingress__foo")).toBe("/__ha_ingress__foo");
    expect(stripHaIngressPrefix("/__ha_ingress__energy")).toBe("/__ha_ingress__energy");
  });
});

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      out.push(...sourceFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry) && !/\.spec\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe("ingress placeholder in app source", () => {
  it("never puts /__ha_ingress__ inside a regex literal", () => {
    const root = join(process.cwd(), "src");
    const escaped = String.raw`\/__ha_ingress__`;
    const hits = sourceFiles(root).filter((file) => readFileSync(file, "utf8").includes(escaped));
    expect(hits).toEqual([]);
  });
});
