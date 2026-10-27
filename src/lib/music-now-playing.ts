/**
 * Title and artist lines for the current Music Assistant queue item.
 * Shared by the floating player sheet and the docked bar on /music.
 */

export type NowPlayingItem = {
  name?: unknown;
  artist?: unknown;
  artists?: unknown;
  stream_title?: unknown;
  uri?: unknown;
  media_item?: unknown;
  [key: string]: unknown;
};

function trimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function artistNames(item: NowPlayingItem): string {
  const { artists } = item;
  if (artists != null) {
    if (Array.isArray(artists)) {
      return artists
        .map((artist) => trimmed((artist as { name?: unknown } | null)?.name))
        .filter(Boolean)
        .join(", ");
    }
    return trimmed((artists as { name?: unknown }).name);
  }
  return trimmed(item.artist);
}

/**
 * MA first; Home Assistant's media_player only fills a line MA leaves empty
 * (HA can lag behind or show another speaker after a switch).
 * Radio: the stream title is the song, the station name becomes the second line.
 * "Artist - Title" in one name is split when MA gives no artist.
 */
export function describeNowPlaying(
  item: NowPlayingItem | null | undefined,
  ha: { title?: string; artist?: string } = {}
): { title: string; artist: string } {
  let artist = item ? artistNames(item) : "";
  const streamTitle = item ? trimmed(item.stream_title) : "";
  const stationName = item ? trimmed(item.name) : "";
  let title = streamTitle || stationName;

  if (streamTitle && stationName && !artist) artist = stationName;
  if (title && !artist && !streamTitle) {
    const sep = title.match(/\s*[-–—]\s+|\s*:\s+/)?.index;
    if (typeof sep === "number" && sep > 0) {
      artist = title.slice(0, sep).trim();
      title = title.slice(sep).replace(/^\s*[-–—:]+\s*/, "").trim();
    }
  }

  const haArtist = ha.artist?.trim() ?? "";
  const haTitle = ha.title?.trim() ?? "";
  if (haArtist && !artist) artist = haArtist;
  if (haTitle && !title) title = haTitle;
  return { title, artist };
}

/** URI to favourite: the queue item's media item, else the item itself. Null when there is none. */
export function nowPlayingFavoriteUri(item: NowPlayingItem | null | undefined): string | null {
  if (!item) return null;
  const media = item.media_item as { uri?: unknown } | null | undefined;
  return trimmed(media?.uri) || trimmed(item.uri) || null;
}

/** Slider value 0–100, whole numbers. */
export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.min(100, Math.max(0, value)));
}

/** `player_queues/seek` for the Now playing screen. Position is seconds. */
export function seekPayload(
  queueId: string,
  positionSeconds: number
): { command: "player_queues/seek"; args: { queue_id: string; position: number } } {
  return {
    command: "player_queues/seek",
    args: {
      queue_id: queueId,
      position: Number.isFinite(positionSeconds) ? positionSeconds : 0,
    },
  };
}
