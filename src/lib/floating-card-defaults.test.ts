import { describe, expect, it } from "vitest";
import { cardDefaultPosition } from "@/lib/floating-card-defaults";

const VIEWPORT = { width: 1280, height: 800 };

describe("card default position", () => {
  it("matches the measured sensor and lamp defaults at 1280x800", () => {
    expect(cardDefaultPosition("sensor_card", 0, { w: 260, h: 108 }, VIEWPORT)).toEqual({ left: 0, bottom: 336 });
    expect(cardDefaultPosition("light_card", 0, { w: 240, h: 70 }, VIEWPORT)).toEqual({ left: 32, bottom: 368 });
  });

  it("steps index 1 by w+16 before snap", () => {
    const sensor = cardDefaultPosition("sensor_card", 1, { w: 260, h: 108 }, VIEWPORT);
    const lamp = cardDefaultPosition("light_card", 1, { w: 240, h: 70 }, VIEWPORT);
    // 276 snaps to 272. The lamp step 256 lands on the grid, so left moves by exactly w+16.
    expect(sensor).toEqual({ left: 272, bottom: 336 });
    expect(lamp).toEqual({ left: 288, bottom: 368 });
    expect(lamp?.left).toBe(32 + 240 + 16);
  });

  it("returns null for every other widget type", () => {
    expect(cardDefaultPosition("media_card", 0, { w: 280, h: 340 }, VIEWPORT)).toBeNull();
    expect(cardDefaultPosition("climate_card", 0, { w: 300, h: 340 }, VIEWPORT)).toBeNull();
  });
});
