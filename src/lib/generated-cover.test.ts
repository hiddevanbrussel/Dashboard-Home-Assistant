import { describe, expect, it } from "vitest";
import { coverInitials, generatedCoverDataUri, hashTitle } from "./generated-cover";

describe("generated covers", () => {
  it("keeps the same artwork for the same playlist title", () => {
    expect(generatedCoverDataUri("Weekend mix")).toBe(generatedCoverDataUri("Weekend mix"));
    expect(hashTitle("Weekend mix")).not.toBe(hashTitle("Chill"));
  });

  it("uses two letters from multi-word titles", () => {
    expect(coverInitials("Weekend mix")).toBe("WM");
    expect(coverInitials("Focus")).toBe("FO");
  });
});
