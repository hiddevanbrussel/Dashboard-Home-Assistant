import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { UndoToast } from "./undo-toast";

function render(message: string) {
  return renderToStaticMarkup(createElement(UndoToast, { message, actionLabel: "Ongedaan maken", onAction: () => {} }));
}

function rootClasses(html: string): string[] {
  const match = html.match(/^<div[^>]*class="([^"]+)"/);
  return match ? match[1].split(/\s+/) : [];
}

describe("UndoToast width", () => {
  it("sizes to its content instead of the half viewport left of a centred fixed box", () => {
    // Centred with left-1/2 + -translate-x-1/2: without w-max an auto width is capped at 50vw,
    // which cut off "Tanden poetsen afgevinkt · +2 pt" in portrait.
    const classes = rootClasses(render("Tanden poetsen afgevinkt · +2 pt"));
    expect(classes).toContain("left-1/2");
    expect(classes).toContain("-translate-x-1/2");
    expect(classes).toContain("w-max");
  });

  it("still never grows past the screen and only truncates really long messages", () => {
    const html = render("Een heel lange taaknaam die echt niet meer op één regel past · +12 pt");
    expect(rootClasses(html)).toContain("max-w-[calc(100vw-2rem)]");
    expect(html).toMatch(/<span class="[^"]*\btruncate\b/);
  });

  it("keeps the 44px undo action", () => {
    expect(render("x")).toMatch(/<button[^>]*class="[^"]*\bh-11\b[^"]*"[^>]*>Ongedaan maken<\/button>/);
  });
});
