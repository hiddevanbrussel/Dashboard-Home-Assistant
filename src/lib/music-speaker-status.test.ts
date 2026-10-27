import { describe, expect, it } from "vitest";
import { getTranslations } from "./i18n";
import { speakerStatus } from "./music-speaker-status";

const nl = getTranslations("nl");

function label(state: string | undefined, inGroupAsMember = false): string {
  return nl[speakerStatus(state, { inGroupAsMember }).labelKey];
}

describe("speakerStatus", () => {
  it("maps every Home Assistant state", () => {
    expect(label("playing")).toBe("Speelt");
    expect(label("paused")).toBe("Gepauzeerd");
    expect(label("idle")).toBe("Niet actief");
    expect(label("on")).toBe("Niet actief");
    expect(label("standby")).toBe("Niet actief");
    expect(label("off")).toBe("Uit");
    expect(label("unavailable")).toBe("Uit");
  });

  it("shows Speelt for a playing leader and Speelt mee in groep for a member playing along", () => {
    expect(label("playing", false)).toBe("Speelt");
    expect(label("playing", true)).toBe("Speelt mee in groep");
  });

  it("falls back to Niet actief for an unknown or missing state", () => {
    expect(label("buffering")).toBe("Niet actief");
    expect(label(undefined)).toBe("Niet actief");
  });

  it("dims only unavailable and picks a dot per status", () => {
    expect(speakerStatus("playing")).toMatchObject({ dot: "green", dimmed: false });
    expect(speakerStatus("playing", { inGroupAsMember: true })).toMatchObject({ dot: "green", dimmed: false });
    expect(speakerStatus("paused")).toMatchObject({ dot: "amber", dimmed: false });
    expect(speakerStatus("idle")).toMatchObject({ dot: "gray", dimmed: false });
    expect(speakerStatus("on")).toMatchObject({ dot: "gray", dimmed: false });
    expect(speakerStatus("standby")).toMatchObject({ dot: "gray", dimmed: false });
    expect(speakerStatus("buffering")).toMatchObject({ dot: "gray", dimmed: false });
    expect(speakerStatus(undefined)).toMatchObject({ dot: "gray", dimmed: false });
    expect(speakerStatus("off")).toMatchObject({ dot: "ring", dimmed: false });
    expect(speakerStatus("unavailable")).toMatchObject({ dot: "ring", dimmed: true });
    expect(speakerStatus("playing").dimmed).toBe(false);
    expect(speakerStatus("paused").dimmed).toBe(false);
    expect(speakerStatus("idle").dimmed).toBe(false);
    expect(speakerStatus("off").dimmed).toBe(false);
  });
});
