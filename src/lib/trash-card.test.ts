import {
  clampTrashCardHeight,
  clampTrashCardWidth,
  buildTrashSchedule,
  discoverTrashDaysUntilEntity,
  discoverTrashFractionEntities,
  formatTrashDaysUntil,
  formatTrashPickupDate,
  formatTrashPickupDateShort,
  trashContainerImageSrc,
  trashThemeChipStyle,
  formatTrashTypeLabel,
  isLikelyTrashEntityId,
  isTrashDaysUntilEntityId,
  isTrashPickupPast,
  mapWasteTypeToTheme,
  mergeTrashFractionEntities,
  normalizeTrashFractionEntityIds,
  trashEntityTheme,
  parseTrashDate,
  parseTrashDaysUntil,
  resizeTrashCardFromBottomRight,
  resolveTrashDaysUntil,
  resolveTrashPickup,
  resolveTrashTheme,
  splitTrashCardHeading,
  trashCardDensity,
  trashDaysUntilFromDate,
  trashDemoPickup,
  trashDemoSchedule,
  trashThemeAssets,
} from "./trash-card";

describe("trash-card helpers", () => {
  it("maps waste type synonyms to themes", () => {
    expect(mapWasteTypeToTheme("Gft")).toBe("gft");
    expect(mapWasteTypeToTheme("GROEN")).toBe("gft");
    expect(mapWasteTypeToTheme("organic")).toBe("gft");
    expect(mapWasteTypeToTheme("GFT-afval")).toBe("gft");
    expect(mapWasteTypeToTheme("sensor.afvalwijzer_gft")).toBe("gft");
    expect(mapWasteTypeToTheme("Restafval")).toBe("restafval");
    expect(mapWasteTypeToTheme("rest")).toBe("restafval");
    expect(mapWasteTypeToTheme("PMD")).toBe("pmd");
    expect(mapWasteTypeToTheme("pmd-afval")).toBe("pmd");
    expect(mapWasteTypeToTheme("PBD")).toBe("pmd");
    expect(mapWasteTypeToTheme("plastic")).toBe("pmd");
    expect(mapWasteTypeToTheme("drankenkartons")).toBe("pmd");
    expect(mapWasteTypeToTheme("unknown-fraction")).toBeNull();
  });

  it("prefers specific fraction tokens over generic waste words in entity ids", () => {
    expect(mapWasteTypeToTheme("sensor.waste_gft")).toBe("gft");
    expect(mapWasteTypeToTheme("sensor.waste_pmd")).toBe("pmd");
    expect(mapWasteTypeToTheme("sensor.afvalwijzer_pmd_waste")).toBe("pmd");
    expect(mapWasteTypeToTheme("sensor.next_waste")).toBe("restafval");
  });

  it("resolves theme with fallbacks", () => {
    expect(resolveTrashTheme("nope", "gft")).toBe("gft");
    expect(resolveTrashTheme(null, undefined, "PMD")).toBe("pmd");
    expect(resolveTrashTheme()).toBe("gft");
  });

  it("uses fallbackTheme when date is known but type is not", () => {
    const pickup = resolveTrashPickup({
      primaryEntity: {
        entity_id: "sensor.next_pickup",
        state: "2026-10-09",
        attributes: {},
      },
      fallbackTheme: "pmd",
      ref: new Date("2026-09-30T12:00:00"),
    });
    expect(pickup?.theme).toBe("pmd");
    expect(pickup?.date?.toISOString().slice(0, 10)).toBe("2026-10-09");
  });

  it("switches theme when HA type state changes", () => {
    const gft = resolveTrashPickup({
      typeEntity: {
        entity_id: "sensor.next_waste_type",
        state: "Gft",
        attributes: {},
      },
      dateEntity: {
        entity_id: "sensor.next_waste_date",
        state: "2026-10-02",
        attributes: {},
      },
    });
    const rest = resolveTrashPickup({
      typeEntity: {
        entity_id: "sensor.next_waste_type",
        state: "Restafval",
        attributes: {},
      },
      dateEntity: {
        entity_id: "sensor.next_waste_date",
        state: "2026-10-09",
        attributes: {},
      },
    });
    const pmd = resolveTrashPickup({
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
    expect(gft?.theme).toBe("gft");
    expect(rest?.theme).toBe("restafval");
    expect(pmd?.theme).toBe("pmd");
  });

  it("exposes distinct container assets and accents per theme", () => {
    expect(trashThemeAssets("gft").container).toContain("container-gft.webp");
    expect(trashThemeAssets("restafval").container).toContain("container-restafval.webp");
    expect(trashThemeAssets("pmd").container).toContain("container-pmd.webp");
    expect(new Set([
      trashThemeAssets("gft").container,
      trashThemeAssets("restafval").container,
      trashThemeAssets("pmd").container,
    ]).size).toBe(3);
    expect(trashThemeAssets("gft").accent).toBe("#2F7D3A");
    expect(trashThemeAssets("pmd").accent).toBe("#E07A2F");
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

  it("uses shorter labels for compact upcoming cells", () => {
    expect(formatTrashTypeLabel("restafval", "Restafval", "nl", { compact: true })).toBe("Rest");
    expect(formatTrashTypeLabel("restafval", "Restafval", "en", { compact: true })).toBe("General");
    expect(formatTrashTypeLabel("restafval", "Restafval", "nl")).toBe("Restafval");
  });

  it("formats abbreviated weekday + month for nl and en", () => {
    const d = new Date(2026, 9, 2, 12, 0, 0); // Friday 2 Oct 2026
    expect(formatTrashPickupDate(d, "nl")).toMatch(/^Vr 2 [Oo]kt$/);
    expect(formatTrashPickupDate(d, "en")).toMatch(/^Fri 2 [Oo]ct$/);
    expect(formatTrashPickupDate(null, "nl")).toBe("—");
    expect(formatTrashPickupDateShort(d, "nl")).toMatch(/^Vr 2 [Oo]kt$/);
    expect(formatTrashPickupDateShort(d, "en")).toMatch(/^Fri 2 [Oo]ct$/);
  });

  it("builds a quiet schedule from live entity dates without inventing demo Fridays", () => {
    const schedule = buildTrashSchedule({
      primary: {
        theme: "gft",
        typeRaw: "Gft",
        date: new Date(2026, 9, 23, 12, 0, 0),
      },
      entities: [
        {
          entity_id: "sensor.afvalwijzer_pmd",
          state: "2026-11-06",
          attributes: { friendly_name: "PMD" },
        },
        {
          entity_id: "sensor.afvalwijzer_restafval",
          state: "2026-10-30",
          attributes: { friendly_name: "Restafval" },
        },
      ],
      ref: new Date(2026, 9, 20, 12, 0, 0),
      fillMissingWithDemo: false,
    });
    expect(schedule.featured.theme).toBe("gft");
    expect(schedule.featured.date?.getDate()).toBe(23);
    expect(schedule.upcoming).toHaveLength(2);
    expect(schedule.upcoming.map((p) => p.theme)).toEqual(["restafval", "pmd"]);
    expect(schedule.upcoming[0].date?.getDate()).toBe(30);
    expect(schedule.upcoming[1].date?.getDate()).toBe(6);
  });

  it("does not fill missing fractions with demo dates when live HA data exists", () => {
    const schedule = buildTrashSchedule({
      primary: {
        theme: "gft",
        typeRaw: "Gft",
        date: new Date(2026, 9, 23, 12, 0, 0),
      },
      entities: [
        {
          entity_id: "sensor.afvalwijzer_pmd",
          state: "2026-11-06",
          attributes: { friendly_name: "PMD" },
        },
      ],
      ref: new Date(2026, 9, 20, 12, 0, 0),
    });
    expect(schedule.featured.theme).toBe("gft");
    expect(schedule.upcoming).toHaveLength(1);
    expect(schedule.upcoming[0].theme).toBe("pmd");
    expect(schedule.upcoming[0].date?.getDate()).toBe(6);
    // No invented restafval demo row.
    expect(schedule.upcoming.some((p) => p.theme === "restafval")).toBe(false);
  });

  it("prefers per-fraction entity dates over a generic next-type primary when no date binding", () => {
    const schedule = buildTrashSchedule({
      primary: {
        theme: "gft",
        typeRaw: "Gft",
        // Wrong / shared "next" date — must not override the gft sensor.
        date: new Date(2026, 9, 21, 12, 0, 0),
      },
      entities: [
        {
          entity_id: "sensor.afvalwijzer_gft",
          state: "2026-10-23",
          attributes: { friendly_name: "Gft" },
        },
        {
          entity_id: "sensor.afvalwijzer_restafval",
          state: "2026-10-30",
          attributes: { friendly_name: "Restafval" },
        },
      ],
      ref: new Date(2026, 9, 20, 12, 0, 0),
      fillMissingWithDemo: false,
    });
    expect(schedule.featured.theme).toBe("gft");
    expect(schedule.featured.date?.getDate()).toBe(23);
    expect(schedule.upcoming[0].theme).toBe("restafval");
    expect(schedule.upcoming[0].date?.getDate()).toBe(30);
  });

  it("uses date_entity / primary as featured when preferPrimaryAsFeatured is set", () => {
    const schedule = buildTrashSchedule({
      primary: {
        theme: "pmd",
        typeRaw: "PMD",
        // Volgende ophaaldatum — must win for featured even if fraction differs.
        date: new Date(2026, 9, 25, 12, 0, 0),
      },
      entities: [
        {
          entity_id: "sensor.afvalwijzer_pmd",
          state: "2026-10-23",
          attributes: { friendly_name: "PMD" },
        },
        {
          entity_id: "sensor.afvalwijzer_gft",
          state: "2026-10-30",
          attributes: { friendly_name: "Gft" },
        },
        {
          entity_id: "sensor.afvalwijzer_restafval",
          state: "2026-11-06",
          attributes: { friendly_name: "Restafval" },
        },
      ],
      ref: new Date(2026, 9, 20, 12, 0, 0),
      fillMissingWithDemo: false,
      preferPrimaryAsFeatured: true,
    });
    expect(schedule.featured.theme).toBe("pmd");
    expect(schedule.featured.date?.getDate()).toBe(25);
    // Upcoming other types come from fraction sensors only — not the next-date stamped on each row.
    expect(schedule.upcoming.map((p) => p.theme)).toEqual(["gft", "restafval"]);
    expect(schedule.upcoming[0].date?.getDate()).toBe(30);
    expect(schedule.upcoming[1].date?.getDate()).toBe(6);
    expect(schedule.upcoming.every((p) => p.date?.getDate() !== 25)).toBe(true);
  });

  it("discovers next_in_days and formats a days-until counter", () => {
    expect(isTrashDaysUntilEntityId("sensor.afvalwijzer_next_in_days")).toBe(true);
    expect(isTrashDaysUntilEntityId("sensor.afvalwijzer_gft")).toBe(false);
    expect(
      discoverTrashDaysUntilEntity([
        {
          entity_id: "sensor.afvalwijzer_gft",
          state: "2026-10-23",
          attributes: { days_until_collection_date: 3 },
        },
        {
          entity_id: "sensor.afvalwijzer_next_in_days",
          state: "3",
          attributes: { friendly_name: "Next in days" },
        },
      ])
    ).toBe("sensor.afvalwijzer_next_in_days");
    expect(parseTrashDaysUntil("3")).toBe(3);
    expect(parseTrashDaysUntil("unavailable")).toBeNull();
    expect(
      resolveTrashDaysUntil({
        daysEntity: {
          entity_id: "sensor.afvalwijzer_next_in_days",
          state: "2",
          attributes: {},
        },
        featuredDate: new Date(2026, 9, 30, 12, 0, 0),
        ref: new Date(2026, 9, 20, 12, 0, 0),
      })
    ).toBe(2);
    expect(
      resolveTrashDaysUntil({
        featuredDate: new Date(2026, 9, 23, 12, 0, 0),
        ref: new Date(2026, 9, 20, 12, 0, 0),
      })
    ).toBe(3);
    expect(trashDaysUntilFromDate(new Date(2026, 9, 20, 12, 0, 0), new Date(2026, 9, 20, 8, 0, 0))).toBe(
      0
    );
    expect(formatTrashDaysUntil(0, "nl")).toBe("Vandaag");
    expect(formatTrashDaysUntil(1, "en")).toBe("Tomorrow");
    expect(formatTrashDaysUntil(3, "nl")).toBe("over 3 dagen");
    expect(formatTrashDaysUntil(3, "en")).toBe("in 3 days");
  });

  it("does not treat next_type / next_in_days as fraction sensors", () => {
    const discovered = discoverTrashFractionEntities([
      {
        entity_id: "sensor.afvalwijzer_next_type",
        state: "gft",
        attributes: { friendly_name: "Next type" },
      },
      {
        entity_id: "sensor.afvalwijzer_next_in_days",
        state: "2",
        attributes: {},
      },
      {
        entity_id: "sensor.afvalwijzer_gft",
        state: "2026-10-23",
        attributes: { friendly_name: "Gft" },
      },
    ]);
    expect(discovered).toEqual({ gft: "sensor.afvalwijzer_gft" });
  });

  it("still fills a full demo schedule when nothing live is bound", () => {
    const schedule = buildTrashSchedule({
      primary: null,
      ref: new Date(2026, 9, 20, 12, 0, 0),
      fillMissingWithDemo: true,
    });
    expect(schedule.featured.date).toBeTruthy();
    expect(schedule.upcoming).toHaveLength(2);
  });

  it("discovers one sensor per waste fraction and allows manual overrides", () => {
    const discovered = discoverTrashFractionEntities([
      {
        entity_id: "sensor.temperature_living",
        state: "21",
        attributes: { friendly_name: "Living" },
      },
      {
        entity_id: "sensor.afvalwijzer_gft",
        state: "2026-10-23",
        attributes: { friendly_name: "Gft" },
      },
      {
        entity_id: "sensor.afvalwijzer_pmd",
        state: "2026-11-06",
        attributes: { friendly_name: "PMD" },
      },
      {
        entity_id: "sensor.afvalwijzer_restafval",
        state: "2026-10-30",
        attributes: { friendly_name: "Restafval" },
      },
    ]);
    expect(discovered).toEqual({
      gft: "sensor.afvalwijzer_gft",
      pmd: "sensor.afvalwijzer_pmd",
      restafval: "sensor.afvalwijzer_restafval",
    });
    expect(
      mergeTrashFractionEntities(discovered, { gft: "sensor.custom_gft" })
    ).toEqual({
      gft: "sensor.custom_gft",
      pmd: "sensor.afvalwijzer_pmd",
      restafval: "sensor.afvalwijzer_restafval",
    });
    expect(normalizeTrashFractionEntityIds({ gft: "  ", pmd: "sensor.x" })).toEqual({
      pmd: "sensor.x",
    });
    expect(normalizeTrashFractionEntityIds({})).toBeUndefined();
  });

  it("recognizes waste entity ids and ignores unrelated sensors in the schedule", () => {
    expect(isLikelyTrashEntityId("sensor.afvalwijzer_gft")).toBe(true);
    expect(isLikelyTrashEntityId("sensor.temperature_living")).toBe(false);
    expect(
      trashEntityTheme({
        entity_id: "sensor.afvalwijzer_pmd",
        state: "2026-11-06",
        attributes: { friendly_name: "PMD" },
      })
    ).toBe("pmd");

    const schedule = buildTrashSchedule({
      primary: {
        theme: "gft",
        typeRaw: "Gft",
        date: new Date(2026, 9, 23, 12, 0, 0),
      },
      entities: [
        {
          entity_id: "sensor.random_counter",
          state: "2026-10-21",
          attributes: { friendly_name: "Counter" },
        },
        {
          entity_id: "sensor.afvalwijzer_pmd",
          state: "2026-11-06",
          attributes: { friendly_name: "PMD" },
        },
      ],
      ref: new Date(2026, 9, 20, 12, 0, 0),
      fillMissingWithDemo: false,
    });
    expect(schedule.featured.theme).toBe("gft");
    expect(schedule.upcoming.some((p) => p.theme === "pmd")).toBe(true);
    // Unrelated counter must not become a fake earlier GFT/restafval pickup.
    expect(schedule.featured.date?.getDate()).toBe(23);
    expect(schedule.upcoming).toHaveLength(1);
  });

  it("ignores past pickup dates when building the schedule", () => {
    const schedule = buildTrashSchedule({
      primary: {
        theme: "gft",
        typeRaw: "Gft",
        date: new Date(2026, 9, 2, 12, 0, 0), // before ref
      },
      entities: [
        {
          entity_id: "sensor.afvalwijzer_pmd",
          state: "2026-11-06",
          attributes: { friendly_name: "PMD" },
        },
      ],
      ref: new Date(2026, 9, 20, 12, 0, 0),
      fillMissingWithDemo: false,
    });
    expect(schedule.featured.theme).toBe("pmd");
    expect(isTrashPickupPast(schedule.featured.date, new Date(2026, 9, 20, 12, 0, 0))).toBe(
      false
    );
    expect(schedule.featured.date!.getTime()).toBeGreaterThan(
      new Date(2026, 9, 2, 12, 0, 0).getTime()
    );
  });

  it("keeps demo upcoming dates after the featured theme", () => {
    const schedule = trashDemoSchedule("restafval", new Date(2026, 9, 19, 12, 0, 0));
    expect(schedule.featured.theme).toBe("restafval");
    expect(schedule.upcoming).toHaveLength(2);
    const featuredTime = schedule.featured.date!.getTime();
    for (const pickup of schedule.upcoming) {
      expect(pickup.date!.getTime()).toBeGreaterThan(featuredTime);
    }
    expect(schedule.upcoming[0].date!.getTime()).toBeLessThan(
      schedule.upcoming[1].date!.getTime()
    );
  });

  it("exposes light and dark chip classes per waste theme", () => {
    expect(trashThemeChipStyle("gft").bg).toContain("dark:bg-emerald-400/15");
    expect(trashThemeChipStyle("pmd").fg).toContain("dark:text-orange-300");
    expect(trashThemeChipStyle("restafval").bg).toContain("dark:bg-white/10");
  });

  it("maps each waste theme to a distinct container image", () => {
    expect(trashContainerImageSrc("gft")).toContain("container-gft.webp");
    expect(trashContainerImageSrc("pmd")).toContain("container-pmd.webp");
    expect(trashContainerImageSrc("restafval")).toContain("container-restafval.webp");
    expect(
      new Set([
        trashContainerImageSrc("gft"),
        trashContainerImageSrc("pmd"),
        trashContainerImageSrc("restafval"),
      ]).size
    ).toBe(3);
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

  it("splits title into bold first word + light remainder", () => {
    expect(splitTrashCardHeading("Eerstvolgende ophaalmoment")).toEqual({
      primary: "Eerstvolgende",
      secondary: "ophaalmoment",
    });
    expect(splitTrashCardHeading("Next collection")).toEqual({
      primary: "Next",
      secondary: "collection",
    });
    expect(splitTrashCardHeading("Afval")).toEqual({
      primary: "Afval",
      secondary: null,
    });
    expect(splitTrashCardHeading("  Next   pickup day  ")).toEqual({
      primary: "Next",
      secondary: "pickup day",
    });
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
