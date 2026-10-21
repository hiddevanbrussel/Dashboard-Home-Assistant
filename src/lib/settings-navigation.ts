/**
 * Settings section is stored in the query string (`?sectie=uiterlijk`).
 * History helpers keep the browser pathname as-is, so Android/browser back
 * stays inside Settings under Supervisor ingress (`/api/hassio_ingress/…`)
 * and the add-on placeholder (`/__ha_ingress__`). Do not rebuild the path
 * with `withBasePath` — the live pathname already includes the prefix.
 */

export const SETTINGS_SECTIONS = [
  "uiterlijk",
  "taal",
  "schermbeveiliging",
  "paginas",
  "bediening",
  "meldingen",
  "homeassistant",
  "apps",
  "over",
] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number];

export const SETTINGS_PAGE_IDS = ["calendar", "energy", "tasks"] as const;
export type SettingsPageId = (typeof SETTINGS_PAGE_IDS)[number];

export const SETTINGS_APP_IDS = [
  "news",
  "music-assistant",
  "valetudo",
  "pexels",
  "immich",
  "voice-satellite",
  "doorbell",
] as const;
export type SettingsAppId = (typeof SETTINGS_APP_IDS)[number];

export type SettingsLocation = {
  sectie: SettingsSectionId | null;
  page: SettingsPageId | null;
  app: SettingsAppId | null;
};

export const EMPTY_SETTINGS_LOCATION: SettingsLocation = {
  sectie: null,
  page: null,
  app: null,
};

const SECTION_SET = new Set<string>(SETTINGS_SECTIONS);
const PAGE_SET = new Set<string>(SETTINGS_PAGE_IDS);
const APP_SET = new Set<string>(SETTINGS_APP_IDS);

/** Old `?section=` ids, including sections that used to be one screen. */
const LEGACY_SECTION: Record<string, SettingsLocation> = {
  appearance: { sectie: "uiterlijk", page: null, app: null },
  language: { sectie: "taal", page: null, app: null },
  dashboard: { sectie: "bediening", page: null, app: null },
  screensaver: { sectie: "schermbeveiliging", page: null, app: null },
  pages: { sectie: "paginas", page: null, app: null },
  calendar: { sectie: "paginas", page: "calendar", app: null },
  energy: { sectie: "paginas", page: "energy", app: null },
  tasks: { sectie: "paginas", page: "tasks", app: null },
  notifications: { sectie: "meldingen", page: null, app: null },
  connection: { sectie: "homeassistant", page: null, app: null },
  entities: { sectie: "homeassistant", page: null, app: null },
  apps: { sectie: "apps", page: null, app: null },
};

export function isSettingsSectionId(value: string | null | undefined): value is SettingsSectionId {
  return !!value && SECTION_SET.has(value);
}

export function isSettingsPageId(value: string | null | undefined): value is SettingsPageId {
  return !!value && PAGE_SET.has(value);
}

export function isSettingsAppId(value: string | null | undefined): value is SettingsAppId {
  return !!value && APP_SET.has(value);
}

function legacyLocation(value: string | null): SettingsLocation | null {
  if (!value || !Object.prototype.hasOwnProperty.call(LEGACY_SECTION, value)) return null;
  return LEGACY_SECTION[value];
}

export function parseSettingsSearch(search: string): SettingsLocation {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  const sectieParam = params.get("sectie");
  const legacyParam = params.get("section");

  let loc: SettingsLocation = { ...EMPTY_SETTINGS_LOCATION };

  if (isSettingsSectionId(sectieParam)) {
    loc.sectie = sectieParam;
  } else {
    const fromSectie = legacyLocation(sectieParam);
    const fromSection = legacyLocation(legacyParam);
    if (fromSectie) loc = { ...fromSectie };
    else if (isSettingsSectionId(legacyParam)) loc.sectie = legacyParam;
    else if (fromSection) loc = { ...fromSection };
  }

  const pageParam = params.get("page");
  const appParam = params.get("app");
  if (isSettingsPageId(pageParam)) loc.page = pageParam;
  if (isSettingsAppId(appParam)) loc.app = appParam;

  if (loc.sectie !== "paginas") loc.page = null;
  if (loc.sectie !== "apps") loc.app = null;
  return loc;
}

/** Query string including the leading `?`, or `""` for the portrait list. */
export function settingsSearch(loc: SettingsLocation): string {
  const params = new URLSearchParams();
  if (loc.sectie) params.set("sectie", loc.sectie);
  if (loc.sectie === "paginas" && loc.page) params.set("page", loc.page);
  if (loc.sectie === "apps" && loc.app) params.set("app", loc.app);
  const value = params.toString();
  return value ? `?${value}` : "";
}

/**
 * Join a browser pathname (already prefixed by ingress or basePath) with the
 * settings query. The pathname is not rewritten.
 */
export function settingsHref(pathname: string, loc: SettingsLocation): string {
  const path = (pathname.split("?")[0].split("#")[0] || "/").replace(/\/+$/, "") || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${normalized}${settingsSearch(loc)}`;
}

export type NavHistory = {
  entries: string[];
  index: number;
};

export function createNavHistory(href: string): NavHistory {
  return { entries: [href], index: 0 };
}

export function applyNav(
  history: NavHistory,
  pathname: string,
  loc: SettingsLocation,
  mode: "push" | "replace"
): NavHistory {
  const href = settingsHref(pathname, loc);
  const kept = history.entries.slice(0, history.index + 1);
  if (mode === "replace") {
    kept[history.index] = href;
    return { entries: kept, index: history.index };
  }
  kept.push(href);
  return { entries: kept, index: kept.length - 1 };
}

export function backNav(history: NavHistory): NavHistory {
  return { ...history, index: Math.max(0, history.index - 1) };
}

/**
 * Deep-linked portrait detail: put the list URL under the current entry so
 * the first back stays on Settings instead of leaving the screen.
 */
export function seedListBehindDetail(
  history: NavHistory,
  pathname: string,
  loc: SettingsLocation
): NavHistory {
  if (!loc.sectie) return history;
  const withList = applyNav(history, pathname, EMPTY_SETTINGS_LOCATION, "replace");
  return applyNav(withList, pathname, loc, "push");
}

export function locationFromHref(href: string): SettingsLocation {
  const query = href.includes("?") ? href.slice(href.indexOf("?")) : "";
  return parseSettingsSearch(query);
}
