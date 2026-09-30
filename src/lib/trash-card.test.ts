import {
  clampTrashCardHeight,
  clampTrashCardWidth,
  formatTrashPickupDate,
  formatTrashTypeLabel,
  mapWasteTypeToTheme,
  parseTrashDate,
  resizeTrashCardFromBottomRight,
  resolveTrashPickup,
  resolveTrashTheme,
  trashCardDensity,
  trashDemoPickup,
} from "./trash-card";

describe("trash-card helpers", () => {
  it("maps waste type synonyms to themes", () => {
    expect(mapWasteTypeToTheme("Gft")).toBe("gft");
    expect(mapWasteTypeToTheme("GROEN")).toBe("gft");
    expect(mapWasteTypeToTheme("organic")).toBe("gft");
    expect(mapWasteTypeToTheme("sensor.afvalwijzer_gft")).toBe("gft");
    expect(mapWasteTypeToTheme("Restafval")).toBe("restafval");
    expect(mapWasteTypeToTheme("rest")).toBe("restafval");
    expect(mapWasteTypeToTheme("PMD")).toBe("pmd");
    expect(mapWasteTypeToTheme("plastic")).toBe("pmd");
    expect(mapWasteTypeToTheme("drankenkartons")).toBe("pmd");
    expect(mapWasteTypeToTheme("unknown-fraction")).toBeNull();
  });

  it("resolves theme with fallbacks", () => {
    expect(resolveTrashTheme("nope", "gft")).toBe("gft");
    expect(resolveTrashTheme(null, undefined, "PMD")).toBe("pmd");
    expect(resolveTrashTheme()).toBe("gft");
  });

  it("parses common date formats and relative words", () => {
    const ref = new Date("2026-09-30T10:00:00");
    expect(parseTrashDate("2026-10-02", ref)?.toISOString().slice(0, 10)).toBe("2026-10-02");
    expect(parseTrashDate("02-10-2026", ref)?.getDate()).toBe(2);
    expect(parseTrashDate("morgen", ref)?.toISOString().slice(0, 10)).toBe("2026-10-01");
    expect(parseTrashDate("today", ref)?.toISOString().slice(0, 10)).toBe("2026-09-30");
    expect(parseTrashDate(7, ref)?.toISOString().slice(0, 10)).toBe("2026-10-07");
    expect(parseTrashDate("unavailable")).toBeNull();
  });

  it("formats weekday + date for nl and en", () => {
    const d = new Date(2026, 9, 2, 12, 0, 0); // Friday 2 Oct 2026
    expect(formatTrashPickupDate(d, "nl")).toMatch(/Vrijdag 2 [Oo]ktober/);
    expect(formatTrashPickupDate(d, "en")).toMatch(/Friday 2 [Oo]ctober/);
    expect(formatTrashPickupDate(null, "nl")).toBe("—");
  });

  it("formats type labels", () => {
    expect(formatTrashTypeLabel("gft", "Gft", "nl")).toBe("Gft");
    expect(formatTrashTypeLabel("gft", "Gft", "en")).toBe("Organic");
    expect(formatTrashTypeLabel("pmd", "PMD", "nl")).toBe("PMD");
    expect(formatTrashTypeLabel("restafval", "Restafval", "en")).toBe("General waste");
  });

  it("resolves Afvalwijzer-style date state + type from entity id", () => {
    const pickup = resolveTrashPickup({
      primaryEntity: {
        entity_id: "sensor.afvalwijzer_gft",
        state: "2026-10-02",
        attributes: { friendly_name: "GFT" },
      },
      ref: new Date("2026-09-30T12:00:00"),
    });
    expect(pickup?.theme).toBe("gft");
    expect(pickup?.date?.toISOString().slice(0, 10)).toBe("2026-10-02");
  });

  it("resolves separate type + date entities", () => {
    const pickup = resolveTrashPickup({
      typeEntity: {
        entity_id: "sensor.next_waste_type",
        state: "PMD",
        attributes: {},
      },
      dateEntity: {
        entity_id: "sensor.next_waste_date",
        state: "2026-10-16",
        attributes: {},
      },
    });
    expect(pickup?.theme).toBe("pmd");
    expect(pickup?.date?.getDate()).toBe(16);
  });

  it("resolves type-in-state with date attribute", () => {
    const pickup = resolveTrashPickup({
      primaryEntity: {
        entity_id: "sensor.waste_next",
        state: "restafval",
        attributes: { next_date: "09-10-2026" },
      },
    });
    expect(pickup?.theme).toBe("restafval");
    expect(pickup?.date?.getMonth()).toBe(9);
    expect(pickup?.date?.getDate()).toBe(9);
  });

  it("builds demo pickup on Fridays", () => {
    const demo = trashDemoPickup("gft", new Date("2026-09-30T12:00:00"));
    expect(demo.theme).toBe("gft");
    expect(demo.date?.getDay()).toBe(5);
  });

  it("clamps size and resizes from bottom-right", () => {
    expect(clampTrashCardWidth(100)).toBe(240);
    expect(clampTrashCardWidth(999)).toBe(480);
    expect(clampTrashCardHeight(100)).toBe(240);
    expect(trashCardDensity(250, 250)).toBe("compact");
    expect(trashCardDensity(320, 320)).toBe("comfortable");

    const next = resizeTrashCardFromBottomRight({
      startWidth: 320,
      startHeight: 320,
      startLeft: 40,
      startBottom: 40,
      dx: 40,
      dy: 40,
      viewportWidth: 1200,
      viewportHeight: 800,
    });
    expect(next.width).toBe(360);
    expect(next.height).toBe(360);
    expect(next.left).toBe(40);
  });
});
