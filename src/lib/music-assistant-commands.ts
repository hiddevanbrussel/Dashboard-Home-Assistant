/**
 * Exact Music Assistant commands that POST /api/music-assistant may forward.
 * Match is case-sensitive and does not trim. There is no prefix or wildcard.
 *
 * config/* is rejected except one read: `config/players/get`. The player bar
 * preloads volume_level and volume_muted with that command
 * (src/hooks/use-music-player-actions.ts). It is not a prefix, so
 * config/players/save, config/providers/* and config/core/* stay blocked.
 * Volume changes use players/cmd/volume_* and players/cmd/group_volume.
 * The bar reads the live 0..100 level from players/all (volume_level and group_volume).
 *
 * Queue view, remove, and clear are three exact commands. `player_queues/items_x`
 * and `player_queues/clear/extra` are different strings and stay rejected.
 * Reorder (`player_queues/move_item`) and repeat stay off the list.
 */
export const MUSIC_ASSISTANT_PLAYER_VOLUME_COMMAND = "config/players/get" as const;

/** `PlayerQueuesController.items(queue_id, limit, offset)`. */
export const MUSIC_ASSISTANT_QUEUE_ITEMS_COMMAND = "player_queues/items" as const;
/** `PlayerQueuesController.delete_item(queue_id, item_id_or_index)`. */
export const MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND = "player_queues/delete_item" as const;
/** `PlayerQueuesController.clear(queue_id)`. */
export const MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND = "player_queues/clear" as const;

export const MUSIC_ASSISTANT_ALLOWED_COMMANDS = [
  MUSIC_ASSISTANT_PLAYER_VOLUME_COMMAND,
  "music/albums/album_tracks",
  "music/albums/get",
  "music/artists/artist_albums",
  "music/artists/artist_tracks",
  "music/artists/top_tracks",
  "music/favorites/add_item",
  "music/playlists/add_playlist_tracks",
  "music/playlists/library_items",
  "music/podcasts/library_items",
  "music/podcasts/podcast_episodes",
  "music/recently_played_items",
  "music/search",
  "player_queues/all",
  MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND,
  MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND,
  "player_queues/dont_stop_the_music",
  "player_queues/get",
  MUSIC_ASSISTANT_QUEUE_ITEMS_COMMAND,
  "player_queues/next",
  "player_queues/pause",
  "player_queues/play",
  "player_queues/play_media",
  "player_queues/previous",
  "player_queues/seek",
  "player_queues/shuffle",
  "players/all",
  "players/cmd/group_volume",
  "players/cmd/volume_down",
  "players/cmd/volume_mute",
  "players/cmd/volume_set",
  "players/cmd/volume_up",
  "search",
] as const;

export type MusicAssistantAllowedCommand = (typeof MUSIC_ASSISTANT_ALLOWED_COMMANDS)[number];

const ALLOWED: ReadonlySet<string> = new Set(MUSIC_ASSISTANT_ALLOWED_COMMANDS);

const LOG_MAX = 120;

export function isAllowedMusicAssistantCommand(command: unknown): command is MusicAssistantAllowedCommand {
  return typeof command === "string" && ALLOWED.has(command);
}

/**
 * One-line command label for logs. Non-strings are not serialized.
 * Known secrets that appear inside the command text are redacted.
 */
export function musicAssistantCommandForLog(command: unknown, secrets: readonly string[] = []): string {
  if (typeof command !== "string") return "<non-string>";
  const singleLine = command.replace(/[\u0000-\u001f\u007f]/g, "?");
  const clipped = singleLine.length > LOG_MAX ? `${singleLine.slice(0, LOG_MAX)}…` : singleLine;
  let safe = clipped;
  for (const secret of secrets) {
    if (secret.length < 8 || !safe.includes(secret)) continue;
    safe = safe.split(secret).join("[redacted]");
  }
  return JSON.stringify(safe);
}
