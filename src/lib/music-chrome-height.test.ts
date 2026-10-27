import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const music = readFileSync("src/app/music/page.tsx", "utf8");
const shell = readFileSync("src/components/layout/app-shell.tsx", "utf8");

describe("music chrome spacer", () => {
  it("uses the measured chrome height instead of a fixed 6.85rem block", () => {
    expect(music).not.toContain("h-[6.85rem]");
    expect(music).toContain("var(--app-chrome-height");
    expect(music).toContain('style={{ height: "calc(var(--app-chrome-height, 6.85rem) + 0.5rem)" }}');
  });

  it("publishes and removes --app-chrome-height from the document element", () => {
    expect(shell).toContain('setProperty("--app-chrome-height"');
    expect(shell).toContain('removeProperty("--app-chrome-height")');
  });
});
