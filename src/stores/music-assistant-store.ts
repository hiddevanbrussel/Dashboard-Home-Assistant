"use client";

import { create } from "zustand";

const STORAGE_KEY_ENABLED = "dashboard.musicAssistant.enabled";
const STORAGE_KEY_BASE_URL = "dashboard.musicAssistant.baseUrl";
const STORAGE_KEY_TOKEN = "dashboard.musicAssistant.token";
const STORAGE_KEY_ALLOW_SPEAKER_SELECTION = "dashboard.musicAssistant.allowSpeakerSelection";
const STORAGE_KEY_ALLOWED_SPEAKER_IDS = "dashboard.musicAssistant.allowedSpeakerIds";
const STORAGE_KEY_SECTION_RADIO = "dashboard.musicAssistant.sectionRadioEnabled";
const STORAGE_KEY_SECTION_RECENTLY_PLAYED = "dashboard.musicAssistant.sectionRecentlyPlayedEnabled";
const STORAGE_KEY_SECTION_RECENTLY_ADDED_ALBUMS = "dashboard.musicAssistant.sectionRecentlyAddedAlbumsEnabled";
const STORAGE_KEY_SECTION_RECENTLY_ADDED_TRACKS = "dashboard.musicAssistant.sectionRecentlyAddedTracksEnabled";
const STORAGE_KEY_SECTION_RECENTLY_ADDED_PLAYLISTS = "dashboard.musicAssistant.sectionRecentlyAddedPlaylistsEnabled";
const STORAGE_KEY_SECTION_ORDER = "dashboard.musicAssistant.sectionOrder";

const DEFAULT_BASE_URL = "http://localhost:8095";

export const MUSIC_SECTION_IDS = ["recentlyAddedPlaylists", "recentlyAddedAlbums", "recentlyAddedTracks", "radio", "recentlyPlayed"] as const;
export type MusicSectionId = (typeof MUSIC_SECTION_IDS)[number];

const DEFAULT_SECTION_ORDER: MusicSectionId[] = ["recentlyPlayed", "radio", "recentlyAddedPlaylists"];

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    if (key === STORAGE_KEY_ENABLED || key === STORAGE_KEY_ALLOW_SPEAKER_SELECTION || key === STORAGE_KEY_SECTION_RADIO || key === STORAGE_KEY_SECTION_RECENTLY_PLAYED || key === STORAGE_KEY_SECTION_RECENTLY_ADDED_ALBUMS || key === STORAGE_KEY_SECTION_RECENTLY_ADDED_TRACKS || key === STORAGE_KEY_SECTION_RECENTLY_ADDED_PLAYLISTS) return (v === "true") as T;
    if (key === STORAGE_KEY_ALLOWED_SPEAKER_IDS) {
      const parsed = JSON.parse(v);
      return (Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []) as T;
    }
    if (key === STORAGE_KEY_SECTION_ORDER) {
      const parsed = JSON.parse(v);
      if (!Array.isArray(parsed)) return DEFAULT_SECTION_ORDER as T;
      const mapped = (parsed as string[]).flatMap((id) =>
        id === "recentlyAdded" ? ["recentlyAddedPlaylists"] : [id]
      );
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
  /** Music page: show Recently added albums section. Default on. */
  sectionRecentlyAddedAlbumsEnabled: boolean;
  /** Music page: show Recently added tracks section. Default on. */
  sectionRecentlyAddedTracksEnabled: boolean;
  /** Music page: show Recently added playlists section (Apple Music). Default on. */
  sectionRecentlyAddedPlaylistsEnabled: boolean;
  sectionRadioEnabled: boolean;
  sectionRecentlyPlayedEnabled: boolean;
  /** Order of sections on music page. */
  sectionOrder: MusicSectionId[];
  setEnabled: (v: boolean) => void;
  setBaseUrl: (v: string) => void;
  setToken: (v: string) => void;
  setAllowSpeakerSelection: (v: boolean) => void;
  setAllowedSpeakerIds: (ids: string[]) => void;
  setSectionRecentlyAddedAlbumsEnabled: (v: boolean) => void;
  setSectionRecentlyAddedTracksEnabled: (v: boolean) => void;
  setSectionRadioEnabled: (v: boolean) => void;
  setSectionRecentlyPlayedEnabled: (v: boolean) => void;
  setSectionRecentlyAddedPlaylistsEnabled: (v: boolean) => void;
  setSectionOrder: (order: MusicSectionId[]) => void;
};

export const useMusicAssistantStore = create<MusicAssistantStore>((set, get) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false),
  baseUrl: getStored(STORAGE_KEY_BASE_URL, DEFAULT_BASE_URL),
  token: getStored(STORAGE_KEY_TOKEN, ""),
  allowSpeakerSelection: getStored(STORAGE_KEY_ALLOW_SPEAKER_SELECTION, true),
  allowedSpeakerIds: getStored<string[]>(STORAGE_KEY_ALLOWED_SPEAKER_IDS, []),
  sectionRecentlyAddedAlbumsEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_ALBUMS, true),
  sectionRecentlyAddedTracksEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_TRACKS, true),
    sectionRadioEnabled: getStored(STORAGE_KEY_SECTION_RADIO, true),
    sectionRecentlyPlayedEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_PLAYED, true),
    sectionRecentlyAddedPlaylistsEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_PLAYLISTS, true),
  sectionOrder: getStored<MusicSectionId[]>(STORAGE_KEY_SECTION_ORDER, [...DEFAULT_SECTION_ORDER]),
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
  setSectionRecentlyAddedAlbumsEnabled: (v) => {
    setStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_ALBUMS, v);
    set({ sectionRecentlyAddedAlbumsEnabled: v });
  },
  setSectionRecentlyAddedTracksEnabled: (v) => {
    setStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_TRACKS, v);
    set({ sectionRecentlyAddedTracksEnabled: v });
  },
  setSectionRecentlyAddedPlaylistsEnabled: (v) => {
    setStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_PLAYLISTS, v);
    set({ sectionRecentlyAddedPlaylistsEnabled: v });
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
}));

/** Hydrate store from localStorage (call once in client, e.g. in layout or TopTabs). */
export function hydrateMusicAssistantStore() {
  useMusicAssistantStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false),
    baseUrl: getStored(STORAGE_KEY_BASE_URL, DEFAULT_BASE_URL),
    token: getStored(STORAGE_KEY_TOKEN, ""),
    allowSpeakerSelection: getStored(STORAGE_KEY_ALLOW_SPEAKER_SELECTION, true),
    allowedSpeakerIds: getStored<string[]>(STORAGE_KEY_ALLOWED_SPEAKER_IDS, []),
    sectionRecentlyAddedAlbumsEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_ALBUMS, true),
    sectionRecentlyAddedTracksEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_TRACKS, true),
    sectionRecentlyAddedPlaylistsEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_ADDED_PLAYLISTS, true),
    sectionRadioEnabled: getStored(STORAGE_KEY_SECTION_RADIO, true),
    sectionRecentlyPlayedEnabled: getStored(STORAGE_KEY_SECTION_RECENTLY_PLAYED, true),
    sectionOrder: getStored<MusicSectionId[]>(STORAGE_KEY_SECTION_ORDER, [...DEFAULT_SECTION_ORDER]),
  });
}
