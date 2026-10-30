/**
 * @vitest-environment happy-dom
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EnergyMyTilesSetting } from "@/components/settings/energy-my-tiles-setting";
import { useLanguageStore } from "@/stores/language-store";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("My tiles on Energy setting", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  beforeEach(() => {
    useLanguageStore.setState({ language: "nl", ready: true });
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root?.unmount());
    host?.remove();
    root = null;
    host = null;
  });

  it("is visible, off and disabled in Dutch and English", async () => {
    await act(async () => {
      root?.render(createElement(EnergyMyTilesSetting));
    });
    const toggle = document.querySelector("[role='switch']");
    expect(toggle).toBeInstanceOf(HTMLButtonElement);
    const button = toggle as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-checked")).toBe("false");
    expect(button.className).toContain("opacity-40");
    expect(document.body.textContent).toContain("Mijn tegels op Energie");
    expect(document.body.textContent).toContain("Voorlopig niet beschikbaar.");
    expect(document.body.textContent).not.toContain("€");
    await act(async () => {
      button.click();
    });
    expect(button.getAttribute("aria-checked")).toBe("false");
    expect(button.disabled).toBe(true);

    await act(async () => {
      useLanguageStore.setState({ language: "en", ready: true });
      root?.render(createElement(EnergyMyTilesSetting));
    });
    expect(document.body.textContent).toContain("My tiles on Energy");
    expect(document.body.textContent).toContain("Unavailable for now.");
    expect(document.body.textContent).not.toContain("€");
    const page = readFileSync(path.join(process.cwd(), "src/app/settings/page.tsx"), "utf8");
    expect(page).toContain("<EnergyMyTilesSetting />");
    expect(page).toContain('selectedPage === "energy"');
  });
});
