import { describe, expect, it } from "vitest";
import {
  migrateScreensaverMediaSource,
  resolveScreensaverPlayback,
} from "./screensaver-media-source";

describe("migrateScreensaverMediaSource", () => {
  it("keeps an explicit stored source", () => {
    expect(
      migrateScreensaverMediaSource({ stored: "immich", customUrl: "/x.png", pexelsEnabled: true })
    ).toBe("immich");
  });

  it("uses a custom image when no source was stored", () => {
    expect(
      migrateScreensaverMediaSource({ stored: null, customUrl: "/uploads/bg.png", pexelsEnabled: true })
    ).toBe("custom");
  });

  it("falls back to Pexels when that app was already enabled", () => {
    expect(
      migrateScreensaverMediaSource({ stored: null, customUrl: "", pexelsEnabled: true })
    ).toBe("pexels");
  });

  it("defaults to custom", () => {
    expect(
      migrateScreensaverMediaSource({ stored: "nope", customUrl: "", pexelsEnabled: false })
    ).toBe("custom");
  });
});

describe("resolveScreensaverPlayback", () => {
  const base = {
    customUrl: "",
    pexelsEnabled: false,
    pexelsKey: "",
    pexelsType: "photo" as const,
    immichEnabled: false,
    immichUrl: "",
    immichKey: "",
    immichType: "photo" as const,
  };

  it("uses the uploaded image for the custom source", () => {
    expect(
      resolveScreensaverPlayback({ ...base, source: "custom", customUrl: "/uploads/bg.png" })
    ).toEqual({ mode: "custom", url: "/uploads/bg.png" });
  });

  it("falls back to the default image when custom has no upload", () => {
    expect(resolveScreensaverPlayback({ ...base, source: "custom" })).toEqual({ mode: "default" });
  });

  it("uses Pexels photos when that source is ready", () => {
    expect(
      resolveScreensaverPlayback({
        ...base,
        source: "pexels",
        pexelsEnabled: true,
        pexelsKey: "abc",
      })
    ).toEqual({ mode: "pexels-photo" });
  });

  it("uses Pexels videos when that type is selected", () => {
    expect(
      resolveScreensaverPlayback({
        ...base,
        source: "pexels",
        pexelsEnabled: true,
        pexelsKey: "abc",
        pexelsType: "video",
      })
    ).toEqual({ mode: "pexels-video" });
  });

  it("does not keep using a custom image when Pexels is selected", () => {
    expect(
      resolveScreensaverPlayback({
        ...base,
        source: "pexels",
        customUrl: "/uploads/bg.png",
        pexelsEnabled: true,
        pexelsKey: "abc",
      })
    ).toEqual({ mode: "pexels-photo" });
  });

  it("falls back when Pexels is selected but not configured", () => {
    expect(resolveScreensaverPlayback({ ...base, source: "pexels" })).toEqual({ mode: "default" });
  });

  it("uses Immich videos when that source is ready", () => {
    expect(
      resolveScreensaverPlayback({
        ...base,
        source: "immich",
        immichEnabled: true,
        immichUrl: "http://photos.lan:2283",
        immichKey: "key",
        immichType: "video",
      })
    ).toEqual({ mode: "immich-video" });
  });
});
