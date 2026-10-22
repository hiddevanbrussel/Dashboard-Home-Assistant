import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getTranslations } from "@/lib/i18n";

const board = readFileSync(new URL("./child-task-board.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../../app/family/page.tsx", import.meta.url), "utf8");
const art = readFileSync(new URL("./task-art.tsx", import.meta.url), "utf8");

describe("Taken v2 illustration contract", () => {
  it("keeps Hidde's TaskArt classes, plate and points label, with no checked-card opacity", () => {
    expect(board).toContain('className="px-3 pt-1"');
    expect(board).toContain("relative h-36 bg-[#F7F8FC] dark:bg-white/5");
    expect(board).toContain("h-7 min-w-7");
    expect(board).toContain("text-xs font-bold");
    expect(board).not.toContain("opacity-70");
    expect(board).not.toContain("opacity-");
    expect(art).toContain('viewBox="0 0 200 140"');
  });

  it("uses two cards per row from the lg breakpoint and one below it", () => {
    expect(board).toContain("grid-cols-1 gap-3 lg:grid-cols-2");
    expect(board).not.toContain("sm:grid-cols-2");
  });

  it("puts a 44px check on the card and an Afgerond section", () => {
    expect(board).toContain("h-11 w-11");
    expect(board).toContain("familyX.done");
    expect(board).toContain("familyX.doneLabel");
    expect(board).toContain("dark:bg-[#1b1a21]");
  });
});

describe("Taken v2 undo and edit panel", () => {
  it("shows the undo toast only after the save succeeds, for five seconds", () => {
    const complete = page.slice(page.indexOf("const completeMutation"), page.indexOf("const uncompleteMutation"));
    const handle = page.slice(page.indexOf("const handleComplete"), page.indexOf("const handleUncomplete"));
    expect(complete).toContain("savedCompletionId");
    expect(complete).toContain("setUndo");
    expect(handle).not.toContain("setUndo");
    expect(handle).not.toContain("setCelebration");
    expect(page).toContain("UNDO_TOAST_DURATION_MS");
    expect(page).toContain("<UndoToast");
    expect(page).toContain('method: "DELETE"');
  });

  it("keeps the edit panel above the header and the sidebar", () => {
    expect(page).toContain("z-[90]");
    expect(page).toContain("z-[91]");
  });

  it("does not take over the date logic from the other draft", () => {
    expect(page).toContain("toISOString().slice(0, 10)");
    expect(page).not.toContain("resolveChoreDay");
    expect(page).not.toContain("localDateKey");
    expect(board).not.toContain("resolveChoreDay");
    expect(board).not.toContain("localDateKey");
  });
});

describe("Taken v2 copy", () => {
  it("has the Dutch and English strings for the toast and Afgerond", () => {
    const nl = getTranslations("nl");
    const en = getTranslations("en");
    expect(nl["familyX.done"]).toBe("Afgerond");
    expect(nl["familyX.doneLabel"]).toBe("Klaar — tik om terug te zetten");
    expect(nl["familyX.checked"]).toBe("{task} afgevinkt · +{n} pt");
    expect(nl["familyX.pts"]).toBe("pt");
    expect(en["familyX.done"]).toBe("Done");
    expect(en["familyX.checked"]).toContain("{task}");
    expect(en["dashboardPages.undo"]).toBe("Undo");
    expect(nl["dashboardPages.undo"]).toBe("Ongedaan maken");
  });
});
