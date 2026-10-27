import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const WIDGETS = "src/components/widgets";

/** Every <button> that wraps a ⋮ (MoreVertical) icon, with its opening markup up to the icon. */
function kebabButtons(): { file: string; line: number; markup: string }[] {
  const found: { file: string; line: number; markup: string }[] = [];
  for (const name of readdirSync(WIDGETS).filter((f) => f.endsWith(".tsx"))) {
    const lines = readFileSync(path.join(WIDGETS, name), "utf8").split(/\r?\n/);
    lines.forEach((text, i) => {
      if (!text.includes("<MoreVertical")) return;
      let start = i;
      while (start >= 0 && !/<button\b/.test(lines[start])) start--;
      found.push({ file: name, line: start + 1, markup: lines.slice(start, i).join("\n") });
    });
  }
  return found;
}

describe("44px touch target on the ⋮ in tiles", () => {
  it("covers every ⋮ button in the widgets", () => {
    const buttons = kebabButtons();
    expect(buttons.length).toBeGreaterThanOrEqual(28);
    const missing = buttons.filter((b) => !b.markup.includes("tile-kebab-hit")).map((b) => `${b.file}:${b.line}`);
    expect(missing).toEqual([]);
  });

  it("is an invisible ::after of at least 44×44px in the components layer", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const layer = css.slice(css.indexOf("@layer components"));
    expect(layer).toContain(".tile-kebab-hit {");
    expect(layer).toMatch(/\.tile-kebab-hit::after\s*\{[^}]*content:\s*"";/);
    expect(layer).toMatch(/width:\s*max\(100%,\s*44px\)/);
    expect(layer).toMatch(/height:\s*max\(100%,\s*44px\)/);
    // Padding grows the border box past the 44px edge so ±22px is inside it.
    expect(layer).toMatch(/box-sizing:\s*content-box/);
    expect(layer).toMatch(/padding:\s*4px/);
    // No background, border or shadow: the hit area must not be visible.
    const after = layer.match(/\.tile-kebab-hit::after\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(after).not.toMatch(/background|border|box-shadow/);
  });

  it("lets the header ⋮ stack above the next pill by splitting the edit wiggle", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toContain("html[data-dashboard-edit] [data-header-statpill-id] > .animate-edit-wiggle");
    expect(css).toMatch(
      /html\[data-dashboard-edit\] \[data-header-statpill-id\] > \.animate-edit-wiggle \{\s*animation:\s*none;/
    );
    expect(css).toContain("html[data-dashboard-edit] [data-header-statpill-id] .tile-kebab-hit");
  });
});
