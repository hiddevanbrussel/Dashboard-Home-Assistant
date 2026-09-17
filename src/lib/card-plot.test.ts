import { describe, expect, it } from "vitest";
import { cardPlotShouldBeInstant, sortCardsForPlot } from "./card-plot";

describe("cardPlotShouldBeInstant", () => {
  it("skips plot animation while the dashboard is being edited", () => {
    expect(cardPlotShouldBeInstant(true)).toBe(true);
    expect(cardPlotShouldBeInstant(false)).toBe(false);
  });
});

describe("sortCardsForPlot", () => {
  it("plots top row first, then left to right", () => {
    const cards = [
      { id: "br", top: 400, left: 500 },
      { id: "tl", top: 80, left: 90 },
      { id: "tr", top: 90, left: 420 },
      { id: "bl", top: 410, left: 80 },
    ];
    expect(sortCardsForPlot(cards, (c) => c).map((c) => c.id)).toEqual(["tl", "tr", "bl", "br"]);
  });

  it("keeps nearly-aligned cards on the same row", () => {
    const cards = [
      { id: "b", top: 202, left: 300 },
      { id: "a", top: 190, left: 40 },
    ];
    expect(sortCardsForPlot(cards, (c) => c).map((c) => c.id)).toEqual(["a", "b"]);
  });
});
