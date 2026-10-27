import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");
const pill = readFileSync("src/components/widgets/stat-pill-card-widget.tsx", "utf8");
const header = readFileSync("src/components/layout/header-stat-pills.tsx", "utf8");

describe("header stat pill hit target", () => {
  it("restores pointer-events on the pinned pill slot in edit mode", () => {
    const block = css.match(
      /html\[data-dashboard-edit\] \[data-app-header\] button,[\s\S]*?pointer-events:\s*auto;/
    )?.[0];
    expect(block).toBeTruthy();
    expect(block).toContain(
      "html[data-dashboard-edit] [data-app-header] [data-header-statpill-id]"
    );
  });

  it("does not make the stat pill itself 44px tall", () => {
    expect(pill).not.toContain("min-h-11");
    expect(pill).not.toContain("h-11");
  });

  it("passes pr-4 to the pill only in edit mode", () => {
    const widgetCall = header.slice(
      header.indexOf("<StatPillCardWidget"),
      header.indexOf("/>", header.indexOf("<StatPillCardWidget"))
    );
    expect(widgetCall).toContain('className={editMode ? "pr-4" : undefined}');
    expect(header.replace('editMode ? "pr-4"', "")).not.toContain("pr-4");
    const overflow = header.slice(header.indexOf("function OverflowList"));
    expect(overflow).toContain("<PinnedPill");
    expect(overflow).toContain('className="px-2"');
    expect(overflow).not.toContain("pr-4");
  });
});
