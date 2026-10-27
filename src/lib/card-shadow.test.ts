import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (name: string) => readFileSync(join(process.cwd(), "src/components/widgets", name), "utf8");
const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

/** White glass cards need the same shadow as the climate card, or they vanish on a white page. */
describe("card shadows on a light background", () => {
  const climateShadow = "shadow-[0_18px_50px_rgba(15,23,42,0.12)]";

  it("Team Tracker and trash use the climate card's shadow", () => {
    expect(source("climate-card-2-widget.tsx")).toContain(climateShadow);
    for (const file of ["teamtracker-card-widget.tsx", "trash-card-widget.tsx"]) {
      const card = source(file);
      expect(card).toContain(climateShadow);
      expect(card).toContain("dark:shadow-[0_18px_50px_rgba(0,0,0,0.65)]");
      expect(card).not.toContain("shadow-[0_12px_36px_rgba(15,23,42,0.08)]");
    }
  });
});

describe("shadow-tile token", () => {
  it("matches the climate wrapper shadow in light and dark", () => {
    const config = read("tailwind.config.ts");
    expect(config).toContain('tile: "0 18px 50px rgba(15, 23, 42, 0.12)"');
    expect(config).toContain('"tile-dark": "0 18px 50px rgba(0, 0, 0, 0.45)"');
  });

  it("leaves the climate wrapper on its own arbitrary shadow", () => {
    const climate = source("floating-climate-card.tsx");
    expect(climate).toContain("shadow-[0_18px_50px_rgba(15,23,42,0.12)]");
    expect(climate).toContain("dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]");
    expect(climate).not.toContain("shadow-tile");
  });

  it("keeps the four card components on their current shadow class", () => {
    expect(source("teamtracker-card-widget.tsx")).toContain("shadow-[0_18px_50px_rgba(15,23,42,0.12)]");
    expect(source("trash-card-widget.tsx")).toContain("shadow-[0_18px_50px_rgba(15,23,42,0.12)]");
    expect(source("weather-card-widget.tsx")).toContain("shadow-[0_14px_40px_rgba(15,23,42,0.08)]");
    expect(source("nuts-card-widget.tsx")).toContain("shadow-xl");
  });
});
