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

function classNameAt(src: string, at: number): string {
  const opener = src[at + "className=".length];
  if (opener === '"') {
    const end = src.indexOf('"', at + "className=".length + 1);
    return src.slice(at, end + 1);
  }
  let depth = 0;
  for (let i = at + "className=".length; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(at, i + 1);
    }
  }
  return src.slice(at);
}

function rootAndClip(file: string): { root: string; clip: string } {
  const src = source(file);
  const marker = src.indexOf('"card-plot-in fixed');
  const rootStart = src.lastIndexOf("className={cn(", marker);
  const root = classNameAt(src, rootStart);
  const clipAt = src.indexOf("className=", rootStart + root.length);
  return { root, clip: classNameAt(src, clipAt) };
}

describe("floating tile shadow on the wrapper", () => {
  it("Team Tracker shadows the root and clips in the same radius", () => {
    const { root, clip } = rootAndClip("floating-teamtracker-card.tsx");
    expect(root).toContain("rounded-[1.35rem] shadow-tile dark:shadow-tile-dark");
    expect(clip).toContain("overflow-hidden");
    expect(clip).toContain("rounded-[1.35rem]");
  });

  it("trash shadows the root, clips in the same radius, and keeps layout paint", () => {
    const src = source("floating-trash-card.tsx");
    const { root, clip } = rootAndClip("floating-trash-card.tsx");
    expect(root).toContain("rounded-[1.35rem] shadow-tile dark:shadow-tile-dark");
    expect(root).toContain("[&_.glass-surface]:![backdrop-filter:none]");
    expect(clip).toContain("overflow-hidden");
    expect(clip).toContain("rounded-[1.35rem]");
    expect(clip).not.toContain("rounded-2xl");
    expect(src).toContain('contain: "layout paint"');
  });

  it("weather shadows the root and drops that shadow in edit mode", () => {
    const { root, clip } = rootAndClip("floating-weather-card.tsx");
    expect(root).toContain("rounded-[1.75rem]");
    expect(root).toContain("shadow-tile dark:shadow-tile-dark");
    expect(root).toContain('editMode ? "rounded-t-none shadow-none"');
    expect(clip).toContain("overflow-hidden");
    expect(clip).toContain("rounded-[1.75rem]");
    expect(clip).toContain("[&>div]:rounded-t-none [&>div]:shadow-none");
    expect(clip).not.toContain("rounded-2xl");
  });
});
