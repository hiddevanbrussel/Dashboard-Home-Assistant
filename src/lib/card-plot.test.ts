import { describe, expect, it } from "vitest";
import {
  CARD_PLOT_INSTANT_CLASS,
  CARD_PLOT_PLAYED_CLASS,
  cardPlotShouldBeInstant,
  markCardsPlotInstant,
  sortCardsForPlot,
} from "./card-plot";

describe("cardPlotShouldBeInstant", () => {
  it("skips plot animation while the dashboard is being edited", () => {
    expect(cardPlotShouldBeInstant(true)).toBe(true);
    expect(cardPlotShouldBeInstant(false)).toBe(false);
  });
});

describe("markCardsPlotInstant", () => {
  it("marks every plot card as already shown, without animation", () => {
    const added: string[] = [];
    const root = {
      querySelectorAll: () => [
        {
          classList: {
            add: (...cls: string[]) => {
              added.push(...cls);
            },
          },
        },
      ],
    };
    markCardsPlotInstant(root as unknown as ParentNode);
    expect(added).toEqual([CARD_PLOT_INSTANT_CLASS, CARD_PLOT_PLAYED_CLASS]);
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
