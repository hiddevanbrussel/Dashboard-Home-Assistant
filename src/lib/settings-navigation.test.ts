import { describe, expect, it } from "vitest";
import {
  applyNav,
  backNav,
  createNavHistory,
  EMPTY_SETTINGS_LOCATION,
  locationFromHref,
  parseSettingsSearch,
  seedListBehindDetail,
  settingsHref,
  settingsSearch,
} from "./settings-navigation";

describe("parseSettingsSearch", () => {
  it("reads the Dutch sectie param", () => {
    expect(parseSettingsSearch("?sectie=uiterlijk")).toEqual({
      sectie: "uiterlijk",
      page: null,
      app: null,
    });
    expect(parseSettingsSearch("sectie=homeassistant")).toEqual({
      sectie: "homeassistant",
      page: null,
      app: null,
    });
  });

  it("keeps a page or app only on its section", () => {
    expect(parseSettingsSearch("?sectie=paginas&page=calendar")).toEqual({
      sectie: "paginas",
      page: "calendar",
      app: null,
    });
    expect(parseSettingsSearch("?sectie=apps&app=pexels")).toEqual({
      sectie: "apps",
      page: null,
      app: "pexels",
    });
    expect(parseSettingsSearch("?sectie=uiterlijk&page=calendar&app=news").page).toBeNull();
    expect(parseSettingsSearch("?sectie=uiterlijk&app=news").app).toBeNull();
  });

  it("maps legacy section ids onto the mockup sections", () => {
    expect(parseSettingsSearch("?section=appearance").sectie).toBe("uiterlijk");
    expect(parseSettingsSearch("?section=language").sectie).toBe("taal");
    expect(parseSettingsSearch("?section=dashboard").sectie).toBe("bediening");
    expect(parseSettingsSearch("?section=screensaver").sectie).toBe("schermbeveiliging");
    expect(parseSettingsSearch("?section=notifications").sectie).toBe("meldingen");
    expect(parseSettingsSearch("?section=connection").sectie).toBe("homeassistant");
    expect(parseSettingsSearch("?section=entities").sectie).toBe("homeassistant");
    expect(parseSettingsSearch("?section=calendar")).toEqual({
      sectie: "paginas",
      page: "calendar",
      app: null,
    });
    expect(parseSettingsSearch("?sectie=appearance").sectie).toBe("uiterlijk");
  });

  it("ignores unknown sections", () => {
    expect(parseSettingsSearch("?sectie=nope")).toEqual(EMPTY_SETTINGS_LOCATION);
    expect(parseSettingsSearch("")).toEqual(EMPTY_SETTINGS_LOCATION);
  });
});

describe("settingsHref", () => {
  it("preserves the add-on ingress placeholder", () => {
    expect(
      settingsHref("/__ha_ingress__/settings", { sectie: "uiterlijk", page: null, app: null })
    ).toBe("/__ha_ingress__/settings?sectie=uiterlijk");
  });

  it("preserves a Supervisor ingress path", () => {
    expect(
      settingsHref("/api/hassio_ingress/abc123/settings", {
        sectie: "homeassistant",
        page: null,
        app: null,
      })
    ).toBe("/api/hassio_ingress/abc123/settings?sectie=homeassistant");
  });

  it("writes no query for the portrait list", () => {
    expect(settingsHref("/settings", EMPTY_SETTINGS_LOCATION)).toBe("/settings");
    expect(settingsSearch(EMPTY_SETTINGS_LOCATION)).toBe("");
  });

  it("does not keep the legacy section param", () => {
    expect(
      settingsSearch({ sectie: "paginas", page: "energy", app: null })
    ).toBe("?sectie=paginas&page=energy");
  });
});

describe("back navigation", () => {
  it("returns from a portrait detail to the list, including under ingress", () => {
    const path = "/__ha_ingress__/settings";
    let history = createNavHistory(settingsHref(path, EMPTY_SETTINGS_LOCATION));
    history = applyNav(history, path, { sectie: "uiterlijk", page: null, app: null }, "push");
    expect(locationFromHref(history.entries[history.index]).sectie).toBe("uiterlijk");
    history = backNav(history);
    expect(history.entries[history.index]).toBe("/__ha_ingress__/settings");
    expect(locationFromHref(history.entries[history.index]).sectie).toBeNull();
  });

  it("returns from an app to Apps, then to the list", () => {
    const path = "/api/hassio_ingress/token/settings";
    let history = createNavHistory(path);
    history = applyNav(history, path, { sectie: "apps", page: null, app: null }, "push");
    history = applyNav(history, path, { sectie: "apps", page: null, app: "immich" }, "push");
    history = backNav(history);
    expect(locationFromHref(history.entries[history.index])).toEqual({
      sectie: "apps",
      page: null,
      app: null,
    });
    history = backNav(history);
    expect(history.entries[history.index]).toBe(path);
    expect(locationFromHref(history.entries[history.index]).sectie).toBeNull();
  });

  it("seeds the list behind a deep-linked detail so the first back stays in settings", () => {
    const path = "/__ha_ingress__/settings";
    let history = createNavHistory(`${path}?section=appearance`);
    history = seedListBehindDetail(history, path, { sectie: "uiterlijk", page: null, app: null });
    expect(history.entries).toEqual([
      "/__ha_ingress__/settings",
      "/__ha_ingress__/settings?sectie=uiterlijk",
    ]);
    history = backNav(history);
    expect(locationFromHref(history.entries[history.index]).sectie).toBeNull();
  });

  it("replaces the landscape section without stacking history", () => {
    const path = "/settings";
    let history = createNavHistory(`${path}?sectie=uiterlijk`);
    history = applyNav(history, path, { sectie: "meldingen", page: null, app: null }, "replace");
    expect(history.entries).toEqual(["/settings?sectie=meldingen"]);
    expect(history.index).toBe(0);
  });
});
