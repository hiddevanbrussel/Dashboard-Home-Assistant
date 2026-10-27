import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TILE_HAIRLINE_DARK } from "./tile-hairline";

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

  it("nuts shadows the root and clips in the same radius", () => {
    const { root, clip } = rootAndClip("floating-nuts-card.tsx");
    expect(root).toContain("rounded-2xl shadow-tile dark:shadow-tile-dark");
    expect(clip).toContain("overflow-hidden rounded-2xl");
  });
});

const HAIRLINE_CARDS = [
  "floating-teamtracker-card.tsx",
  "floating-trash-card.tsx",
  "floating-weather-card.tsx",
  "floating-nuts-card.tsx",
  "floating-climate-card.tsx",
] as const;

/** Opening markup of every ⋮ button, up to and including its icon. */
function kebabButtons(file: string): string[] {
  const lines = source(file).split(/\r?\n/);
  const found: string[] = [];
  lines.forEach((text, index) => {
    if (!text.includes("<MoreVertical")) return;
    let start = index;
    while (start >= 0 && !/<button\b/.test(lines[start])) start--;
    found.push(lines.slice(start, index + 1).join("\n"));
  });
  return found;
}

describe("dark hairline on five tiles", () => {
  it("is one literal class string, with after:z-20 and white at 0.08", () => {
    const file = read("src/lib/tile-hairline.ts");
    const literal =
      "after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:content-[''] dark:after:ring-1 dark:after:ring-inset dark:after:ring-white/[0.08]";
    expect(file).toContain(`"${literal}"`);
    expect(TILE_HAIRLINE_DARK).toBe(literal);
    expect(TILE_HAIRLINE_DARK).not.toContain("ring-white/8");
    expect(TILE_HAIRLINE_DARK).not.toMatch(/(^|\s)ring-1(\s|$)/);
    expect(TILE_HAIRLINE_DARK).not.toMatch(/(^|\s)ring-inset(\s|$)/);
  });

  it("adds the shared constant on the five outer layers only", () => {
    for (const file of HAIRLINE_CARDS) {
      const { root } = rootAndClip(file);
      expect(root, file).toContain("TILE_HAIRLINE_DARK");
      expect(root, file).not.toMatch(/\brelative\b/);
      expect(root, file).not.toContain("ring-white/8");
      expect(root, file).not.toContain("after:ring");
      expect(root, file).not.toMatch(/(^|[\s"])ring-1([\s"])/);
      expect(root, file).not.toMatch(/(^|[\s"])ring-inset([\s"])/);
    }
    const widgets = readdirSync(join(process.cwd(), "src/components/widgets")).filter((name) =>
      /^floating-.*\.tsx$/.test(name)
    );
    for (const file of widgets) {
      if ((HAIRLINE_CARDS as readonly string[]).includes(file)) continue;
      const src = source(file);
      expect(src, file).not.toContain("TILE_HAIRLINE_DARK");
      expect(src, file).not.toContain(TILE_HAIRLINE_DARK);
      expect(src, file).not.toContain("after:ring");
    }
  });

  it("keeps the weather hairline on the layer that still has the visible radius", () => {
    const { root, clip } = rootAndClip("floating-weather-card.tsx");
    expect(root).toContain('editMode ? "rounded-t-none shadow-none"');
    expect(root).toContain("shadow-tile dark:shadow-tile-dark");
    expect(root).toContain("!editMode && TILE_HAIRLINE_DARK");
    expect(clip).toContain("overflow-hidden");
    expect(clip).toContain("rounded-[1.75rem]");
    expect(clip).toContain("[&>div]:rounded-t-none [&>div]:shadow-none");
    expect(clip).toContain("editMode && TILE_HAIRLINE_DARK");
  });
});

describe("climate and nuts ⋮", () => {
  it("keeps both climate ⋮ buttons on the invisible 44px hit target", () => {
    const buttons = kebabButtons("climate-card-2-widget.tsx");
    expect(buttons).toHaveLength(2);
    for (const markup of buttons) {
      expect(markup).toContain("tile-kebab-hit");
      expect(markup).toContain("rounded-lg p-1");
      expect(markup).not.toMatch(/\bh-11\b|\bw-11\b|\bmin-h-\[44px\]|\bmin-w-\[44px\]/);
    }
  });

  it("marks the nuts ⋮ data-no-drag, and /energy uses that same card", () => {
    const [button] = kebabButtons("nuts-card-widget.tsx");
    expect(button).toContain("data-no-drag");
    expect(button).toContain("tile-kebab-hit");
    expect(source("trash-card-widget.tsx")).toContain("data-no-drag");
    expect(source("floating-nuts-card.tsx")).toContain("isFloatingCardNoDragTarget");
    expect(read("src/app/energy/page.tsx")).toContain("<FloatingNutsCard");
  });
});
