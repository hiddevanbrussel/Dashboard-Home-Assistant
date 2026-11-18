import { describe, expect, it } from "vitest";
import { previewLanguage } from "./dev-preview-language";

describe("weather preview language", () => {
  it("opts into English only for lang=en", () => {
    expect(previewLanguage("en")).toBe("en");
  });
  it("keeps a missing language Dutch", () => {
    expect(previewLanguage(null)).toBe("nl");
  });
  it("keeps all other values Dutch", () => {
    for (const value of ["nl", "", "EN", "fr", " en "]) expect(previewLanguage(value)).toBe("nl");
  });
});
