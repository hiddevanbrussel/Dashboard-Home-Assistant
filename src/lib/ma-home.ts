import { callMaServerSafe } from "@/lib/ma-server";
import { parseMaItemList, parseMaPlaylist, parseMaPlaylistTracks, parseMaRecentItems } from "@/lib/ma-parse";
import {
  folderItems,
  parseRecommendationFolders,
  pickStationsForYouFolder,
  stationsRequestArgs,
} from "@/lib/ma-recommendations";

export const MA_HOME_ALBUM_LIMIT = 80;
export const MA_HOME_ARTIST_LIMIT = 80;
export const MA_HOME_PLAYLIST_LIMIT = 60;
export const MA_HOME_RADIO_LIMIT = 30;
export const MA_HOME_STATION_LIMIT = 16;
export const MA_HOME_RECENT_LIMIT = 24;
export const MA_HOME_FEATURED_TRACK_LIMIT = 16;

export type MaHomeRequest = {
  baseUrl: string;
  token: string;
  featuredPlaylistIds?: string[];
  includeRadio?: boolean;
  includeRecent?: boolean;
};

export type MaHomeFeatured = {
  id: string;
  playlist: Record<string, unknown> | null;
  tracks: unknown[];
};

export type MaHomePayload = {
  albums: unknown[];
  artists: unknown[];
  playlists: unknown[];
  radios: unknown[];
  stations: unknown[];
  recent: unknown[];
  featured: MaHomeFeatured[];
};

export function featuredPlaylistIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => String(id).trim()).filter(Boolean);
}

export function maHomeJobs(input: Pick<MaHomeRequest, "featuredPlaylistIds" | "includeRadio" | "includeRecent">): {
  key: string;
  command: string;
  args: Record<string, unknown>;
}[] {
  const featuredIds = featuredPlaylistIds(input.featuredPlaylistIds);
  const jobs: { key: string; command: string; args: Record<string, unknown> }[] = [
    {
      key: "albums",
      command: "music/albums/library_items",
      args: { limit: MA_HOME_ALBUM_LIMIT, in_library_only: true, order_by: "timestamp_added_desc" },
    },
    { key: "artists", command: "music/artists/library_items", args: { limit: MA_HOME_ARTIST_LIMIT, in_library_only: true } },
    { key: "playlists", command: "music/playlists/library_items", args: { limit: MA_HOME_PLAYLIST_LIMIT, in_library_only: true } },
  ];
  if (input.includeRadio !== false) {
    jobs.push({ key: "radios", command: "music/radios/library_items", args: { limit: MA_HOME_RADIO_LIMIT, in_library_only: true } });
  }
  if (input.includeRecent !== false) {
    jobs.push({
      key: "recent",
      command: "music/recently_played_items",
      args: { limit: MA_HOME_RECENT_LIMIT, media_types: ["track", "album"], in_library_only: true },
    });
  }
  for (const id of featuredIds) {
    jobs.push({
      key: `playlist:${id}`,
      command: "music/playlists/get",
      args: { item_id: id, provider_instance_id_or_domain: "library" },
    });
    jobs.push({
      key: `tracks:${id}`,
      command: "music/playlists/playlist_tracks",
      args: { item_id: id, provider_instance_id_or_domain: "library", limit: MA_HOME_FEATURED_TRACK_LIMIT },
    });
  }
  return jobs;
}

async function fetchStationsForYou(baseUrl: string, token: string, recommendationsData: unknown): Promise<unknown[]> {
  const folders = parseRecommendationFolders(recommendationsData);
  const folder = pickStationsForYouFolder(folders);
  const embedded = folderItems(folder);
  if (embedded.length > 0) return embedded.slice(0, MA_HOME_STATION_LIMIT);

  const args = stationsRequestArgs(folder);
  if (!args) return [];
  const itemsData = await callMaServerSafe(baseUrl, token, "music/recommendations/items", args);
  return parseMaItemList(itemsData, ["items"]).slice(0, MA_HOME_STATION_LIMIT);
}

export async function fetchMaHome(input: MaHomeRequest): Promise<MaHomePayload> {
  const { baseUrl, token } = input;
  const featuredIds = featuredPlaylistIds(input.featuredPlaylistIds);
  const jobs = maHomeJobs(input);
  const recJob = { key: "recommendations", command: "music/recommendations", args: {} };
  const allJobs = [...jobs, recJob];
  const results = await Promise.all(allJobs.map((job) => callMaServerSafe(baseUrl, token, job.command, job.args)));
  const byKey = new Map(allJobs.map((job, index) => [job.key, results[index]]));

  return {
    albums: parseMaItemList(byKey.get("albums"), ["albums"]),
    artists: parseMaItemList(byKey.get("artists"), ["artists"]),
    playlists: parseMaItemList(byKey.get("playlists"), ["playlists"]),
    radios: byKey.has("radios") ? parseMaItemList(byKey.get("radios"), ["radios"]) : [],
    stations: await fetchStationsForYou(baseUrl, token, byKey.get("recommendations")),
    recent: byKey.has("recent") ? parseMaRecentItems(byKey.get("recent")) : [],
    featured: featuredIds.map((id) => ({
      id,
      playlist: parseMaPlaylist(byKey.get(`playlist:${id}`)),
      tracks: parseMaPlaylistTracks(byKey.get(`tracks:${id}`)).slice(0, MA_HOME_FEATURED_TRACK_LIMIT),
    })),
  };
}
