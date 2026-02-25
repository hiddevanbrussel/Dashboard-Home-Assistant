"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.musicAssistant.enabled";
const STORAGE_KEY_BASE_URL = "dashboard.musicAssistant.baseUrl";
const STORAGE_KEY_TOKEN = "dashboard.musicAssistant.token";
const STORAGE_KEY_ALLOW_SPEAKER_SELECTION = "dashboard.musicAssistant.allowSpeakerSelection";
const STORAGE_KEY_ALLOWED_SPEAKER_IDS = "dashboard.musicAssistant.allowedSpeakerIds";
const STORAGE_KEY_SECTION_RADIO = "dashboard.musicAssistant.sectionRadioEnabled";
const STORAGE_KEY_SECTION_RECENTLY_PLAYED = "dashboard.musicAssistant.sectionRecentlyPlayedEnabled";
const STORAGE_KEY_SECTION_ORDER = "dashboard.musicAssistant.sectionOrder";
const STORAGE_KEY_FEATURED_PLAYLIST_IDS = "dashboard.musicAssistant.featuredPlaylistIds";
const STORAGE_KEY_SECTION_FEATURED_PLAYLIST = "dashboard.musicAssistant.sectionFeaturedPlaylistEnabled";
const STORAGE_KEY_HERO_SLIDER_INTERVAL = "dashboard.musicAssistant.heroSliderIntervalMs";
const STORAGE_KEY_HERO_SLIDER_SOURCES = "dashboard.musicAssistant.heroSliderSources";

const DEFAULT_BASE_URL = "http://localhost:8095";

export const HERO_SLIDER_SOURCE_IDS = ["featuredPlaylist", "recentlyPlayed", "libraryAlbums"] as const;
export type HeroSliderSourceId = (typeof HERO_SLIDER_SOURCE_IDS)[number];

export const MUSIC_SECTION_IDS = ["featuredPlaylist", "radio", "recentlyPlayed"] as const;
export type MusicSectionId = (typeof MUSIC_SECTION_IDS)[number];

const DEFAULT_SECTION_ORDER: MusicSectionId[] = ["featuredPlaylist", "recentlyPlayed", "radio"];

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    if (key === STORAGE_KEY_ENABLED || key === STORAGE_KEY_ALLOW_SPEAKER_SELECTION || key === STORAGE_KEY_SECTION_RADIO || key === STORAGE_KEY_SECTION_RECENTLY_PLAYED || key === STORAGE_KEY_SECTION_FEATURED_PLAYLIST) return (v === "true") as T;
    if (key === STORAGE_KEY_FEATURED_PLAYLIST_IDS) {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          const list = parsed.filter((id): id is string => typeof id === "string" && String(id).trim() !== "");
          return (list.length > 0 ? list : ["30"]) as T;
        }
        return ["30"] as T;
      } catch {
        const legacy = localStorage.getItem("dashboard.musicAssistant.featuredPlaylistId");
        if (legacy && legacy.trim()) return [legacy.trim()] as T;
        return ["30"] as T;
      }
    }
    if (key === STORAGE_KEY_ALLOWED_SPEAKER_IDS) {
      const parsed = JSON.parse(v);
      return (Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []) as T;
    }
    if (key === STORAGE_KEY_SECTION_ORDER) {
      const parsed = JSON.parse(v);
      if (!Array.isArray(parsed)) return DEFAULT_SECTION_ORDER as T;
      const mapped = parsed as string[];
      const valid = mapped.filter((id): id is MusicSectionId => MUSIC_SECTION_IDS.includes(id as MusicSectionId));
      const seen = new Set<MusicSectionId>();
      const deduped = valid.filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      const missing = MUSIC_SECTION_IDS.filter((id) => !deduped.includes(id));
      return ([...deduped, ...missing] as MusicSectionId[]) as T;
    }
    if (key === STORAGE_KEY_HERO_SLIDER_INTERVAL) {
      const n = parseInt(v, 10);
      return (Number.isFinite(n) && n >= 1000 && n <= 120000 ? n : 5000) as T;
    }
    if (key === STORAGE_KEY_HERO_SLIDER_SOURCES) {
      const parsed = JSON.parse(v);
      if (!Array.isArray(parsed)) return ([...HERO_SLIDER_SOURCE_IDS] as HeroSliderSourceId[]) as T;
      const valid = (parsed as string[]).filter((id): id is HeroSliderSourceId => HERO_SLIDER_SOURCE_IDS.includes(id as HeroSliderSourceId));
      return (valid.length > 0 ? valid : [...HERO_SLIDER_SOURCE_IDS]) as T;
    }
    return v as T;
  } catch {
    return fallback;
  }
}

function setStored(key: string, value: string | boolean | string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
    window.dispatchEvent(new CustomEvent("music-assistant-setting-changed"));
  } catch {
    // ignore
  }
}

export type MusicAssistantStore = {
  enabled: boolean;
  baseUrl: string;
  token: string;
  allowSpeakerSelection: boolean;
  /** When non-empty, only these queue_ids may be chosen. Empty = all allowed. */
  allowedSpeakerIds: string[];
  /** MA playlist IDs to show on homepage (e.g. ["30"] for playlists/library/30). */
  featuredPlaylistIds: string[];
  /** Music page: show Featured playlists section. Default on. */
  sectionFeaturedPlaylistEnabled: boolean;
  sectionRadioEnabled: boolean;
  sectionRecentlyPlayedEnabled: boolean;
  /** Order of sections on music page. */
  sectionOrder: MusicSectionId[];
  /** Hero slider: interval in ms (1000–120000). Default 5000. */
  heroSliderIntervalMs: number;
  /** Hero slider: which sources to use (featuredPlaylist, recentlyPlayed, libraryAlbums). */
  heroSliderSources: HeroSliderSourceId[];
  setEnabled: (v: boolean) => void;
  setBaseUrl: (v: string) => void;
  setToken: (v: string) => void;
  setAllowSpeakerSelection: (v: boolean) => void;
  setAllowedSpeakerIds: (ids: string[]) => void;
  setFeaturedPlaylistIds: (ids: string[]) => void;
  addFeaturedPlaylistId: (id: string) => void;
  removeFeaturedPlaylistId: (index: number) => void;
  setSectionFeaturedPlaylistEnabled: (v: boolean) => void;
  setSectionRadioEnabled: (v: boolean) => void;
  setSectionRecentlyPlayedEnabled: (v: boolean) => void;
  setSectionOrder: (order: MusicSectionId[]) => void;
  setHeroSliderIntervalMs: (ms: number) => void;
  setHeroSliderSources: (sources: HeroSliderSourceId[]) => void;
  toggleHeroSliderSource: (id: HeroSliderSourceId) => void;
};

export const useMusicAssistantStore = create<MusicAssistantStore>((set, get) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false),
  baseUrl: getStored(STORAGE_KEY_BASE_URL, DEFAULT_BASE_URL),
  token: getStored(STORAGE_KEY_TOKEN, ""),
  allowSpeakerSelection: getStored(STORAGE_KEY_ALLOW_SPEAKER_SELECTION, true),
  allowedSpeakerIds: getStored<string[]>(STORAGE_KEY_ALLOWED_SPEAKER_IDS, []),
  featuredPlaylistIds: getStored<string[]>(STORAGE_KEY_FEATURED_PLAYLIST_IDS, ["30"]),
  sectionFeaturedPlaylistEnabled: getStored(STORAGE_KEY_SECTION_FEATURED_PLAYLIST, true),
  sectionRadioEnabled: getStored(STORAGE_KEY_SECTION_RADIO, true),
  sectionRecentlyPlayedEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_PLAYED, true),
  sectionOrder: getStored<MusicSectionId[]>(STORAGE_KEY_SECTION_ORDER, [...DEFAULT_SECTION_ORDER]),
  heroSliderIntervalMs: getStored<number>(STORAGE_KEY_HERO_SLIDER_INTERVAL, 5000),
  heroSliderSources: getStored<HeroSliderSourceId[]>(STORAGE_KEY_HERO_SLIDER_SOURCES, [...HERO_SLIDER_SOURCE_IDS]),
  setEnabled: (v) => {
    setStored(STORAGE_KEY_ENABLED, v);
    set({ enabled: v });
  },
  setBaseUrl: (v) => {
    const url = (v || DEFAULT_BASE_URL).replace(/\/+$/, "");
    setStored(STORAGE_KEY_BASE_URL, url);
    set({ baseUrl: url });
  },
  setToken: (v) => {
    setStored(STORAGE_KEY_TOKEN, v || "");
    set({ token: v || "" });
  },
  setAllowSpeakerSelection: (v) => {
    setStored(STORAGE_KEY_ALLOW_SPEAKER_SELECTION, v);
    set({ allowSpeakerSelection: v });
  },
  setAllowedSpeakerIds: (ids) => {
    const list = Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
    setStored(STORAGE_KEY_ALLOWED_SPEAKER_IDS, list);
    set({ allowedSpeakerIds: list });
  },
  setFeaturedPlaylistIds: (ids) => {
    const list = Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string" && id.trim() !== "") : ["30"];
    setStored(STORAGE_KEY_FEATURED_PLAYLIST_IDS, list);
    set({ featuredPlaylistIds: list });
  },
  addFeaturedPlaylistId: (id) => {
    const trimmed = (id || "").trim();
    if (!trimmed) return;
    const list = [...get().featuredPlaylistIds];
    if (list.includes(trimmed)) return;
    list.push(trimmed);
    setStored(STORAGE_KEY_FEATURED_PLAYLIST_IDS, list);
    set({ featuredPlaylistIds: list });
  },
  removeFeaturedPlaylistId: (index) => {
    const list = [...get().featuredPlaylistIds];
    list.splice(index, 1);
    setStored(STORAGE_KEY_FEATURED_PLAYLIST_IDS, list.length ? list : ["30"]);
    set({ featuredPlaylistIds: list.length ? list : ["30"] });
  },
  setSectionFeaturedPlaylistEnabled: (v) => {
    setStored(STORAGE_KEY_SECTION_FEATURED_PLAYLIST, v);
    set({ sectionFeaturedPlaylistEnabled: v });
  },
  setSectionRadioEnabled: (v) => {
    setStored(STORAGE_KEY_SECTION_RADIO, v);
    set({ sectionRadioEnabled: v });
  },
  setSectionRecentlyPlayedEnabled: (v) => {
    setStored(STORAGE_KEY_SECTION_RECENTLY_PLAYED, v);
    set({ sectionRecentlyPlayedEnabled: v });
  },
  setSectionOrder: (order) => {
    const list = Array.isArray(order) ? order.filter((id): id is MusicSectionId => MUSIC_SECTION_IDS.includes(id)) : [...DEFAULT_SECTION_ORDER];
    if (list.length !== MUSIC_SECTION_IDS.length) {
      const missing = MUSIC_SECTION_IDS.filter((id) => !list.includes(id));
      list.push(...missing);
    }
    setStored(STORAGE_KEY_SECTION_ORDER, list);
    set({ sectionOrder: list });
  },
  setHeroSliderIntervalMs: (ms) => {
    const val = Math.max(1000, Math.min(120000, Math.round(ms)));
    setStored(STORAGE_KEY_HERO_SLIDER_INTERVAL, String(val));
    set({ heroSliderIntervalMs: val });
  },
  setHeroSliderSources: (sources) => {
    const list = Array.isArray(sources) ? sources.filter((id): id is HeroSliderSourceId => HERO_SLIDER_SOURCE_IDS.includes(id)) : [...HERO_SLIDER_SOURCE_IDS];
    if (list.length === 0) return;
    setStored(STORAGE_KEY_HERO_SLIDER_SOURCES, list);
    set({ heroSliderSources: list });
  },
  toggleHeroSliderSource: (id) => {
    const current = get().heroSliderSources;
    const has = current.includes(id);
    const next = has ? current.filter((x) => x !== id) : [...current, id];
    if (next.length === 0) return;
    setStored(STORAGE_KEY_HERO_SLIDER_SOURCES, next);
    set({ heroSliderSources: next });
  },
}));

/** Hydrate store from localStorage (call once in client, e.g. in layout or TopTabs). */
export function hydrateMusicAssistantStore() {
  useMusicAssistantStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false),
    baseUrl: getStored(STORAGE_KEY_BASE_URL, DEFAULT_BASE_URL),
    token: getStored(STORAGE_KEY_TOKEN, ""),
    allowSpeakerSelection: getStored(STORAGE_KEY_ALLOW_SPEAKER_SELECTION, true),
    allowedSpeakerIds: getStored<string[]>(STORAGE_KEY_ALLOWED_SPEAKER_IDS, []),
    featuredPlaylistIds: getStored<string[]>(STORAGE_KEY_FEATURED_PLAYLIST_IDS, ["30"]),
    sectionFeaturedPlaylistEnabled: getStored(STORAGE_KEY_SECTION_FEATURED_PLAYLIST, true),
    sectionRadioEnabled: getStored(STORAGE_KEY_SECTION_RADIO, true),
    sectionRecentlyPlayedEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_PLAYED, true),
    sectionOrder: getStored<MusicSectionId[]>(STORAGE_KEY_SECTION_ORDER, [...DEFAULT_SECTION_ORDER]),
    heroSliderIntervalMs: getStored<number>(STORAGE_KEY_HERO_SLIDER_INTERVAL, 5000),
    heroSliderSources: getStored<HeroSliderSourceId[]>(STORAGE_KEY_HERO_SLIDER_SOURCES, [...HERO_SLIDER_SOURCE_IDS]),
  });
}
