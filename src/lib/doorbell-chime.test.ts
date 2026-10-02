import { describe, expect, it } from "vitest";
import {
  DOORBELL_CHIME_FREQUENCIES,
  DOORBELL_CHIME_GAIN,
  DOORBELL_CHIME_GAP_SECONDS,
  DOORBELL_CHIME_NOTE_SECONDS,
} from "./doorbell-chime";

describe("doorbell chime constants", () => {
  it("uses a two-note ding-dong pattern", () => {
    expect(DOORBELL_CHIME_FREQUENCIES).toHaveLength(2);
    expect(DOORBELL_CHIME_FREQUENCIES[0]).toBeLessThan(DOORBELL_CHIME_FREQUENCIES[1]);
  });

  it("keeps gain and note length in a pleasant range", () => {
    expect(DOORBELL_CHIME_GAIN).toBeGreaterThan(0.05);
    expect(DOORBELL_CHIME_GAIN).toBeLessThan(0.5);
    expect(DOORBELL_CHIME_NOTE_SECONDS).toBeGreaterThan(0.2);
    expect(DOORBELL_CHIME_GAP_SECONDS).toBeGreaterThan(0);
  });
});
