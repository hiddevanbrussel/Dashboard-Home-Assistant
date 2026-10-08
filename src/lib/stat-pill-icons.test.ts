import { describe, expect, it } from "vitest";
import {
  CARD_ICONS,
  STAT_PILL_ICON_OPTIONS,
  normalizeStatPillIconKey,
} from "@/components/widgets/card-icons";

describe("stat pill icons", () => {
  it("exposes the curated kebab-case set", () => {
    expect([...STAT_PILL_ICON_OPTIONS]).toEqual([
      "plug-zap",
      "zap",
      "sun",
      "solar-panel",
      "circle-arrow-up",
      "circle-arrow-down",
      "lightbulb",
      "zap-off",
      "air-vent",
    ]);
  });

  it("resolves every curated key to a Lucide component", () => {
    for (const key of STAT_PILL_ICON_OPTIONS) {
      expect(CARD_ICONS[key]).toBeTruthy();
    }
  });

  it("normalizes PascalCase and kebab-case to curated keys", () => {
    expect(normalizeStatPillIconKey("Zap")).toBe("zap");
    expect(normalizeStatPillIconKey("PlugZap")).toBe("plug-zap");
    expect(normalizeStatPillIconKey("CircleArrowUp")).toBe("circle-arrow-up");
    expect(normalizeStatPillIconKey("solar-panel")).toBe("solar-panel");
    expect(normalizeStatPillIconKey(undefined)).toBe("sun");
    expect(normalizeStatPillIconKey("Unknown")).toBe("sun");
  });
});
