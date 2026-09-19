import { mediaArtworkCacheKey, mediaImageRequestUrl } from "@/lib/media-image";

export const SCREENSAVER_MUSIC_OFF = "off";

export type ScreensaverMusicEntityChoice = string | null;

export function isActiveMediaPlayerState(state: string | undefined | null): boolean {
  return state === "playing" || state === "paused";
}

export function isScreensaverMusicOff(value: string | null | undefined): boolean {
  return value === SCREENSAVER_MUSIC_OFF;
}

export function pickScreensaverMusicPlayer<T extends { entity_id: string; state: string }>(
  entities: T[],
  preferredEntityId: string | null | undefined
): T | null {
  if (isScreensaverMusicOff(preferredEntityId)) return null;
  const players = entities.filter(
    (entity) => entity.entity_id.startsWith("media_player.") && isActiveMediaPlayerState(entity.state)
  );
  if (preferredEntityId) {
    return players.find((entity) => entity.entity_id === preferredEntityId) ?? null;
  }
  return players[0] ?? null;
}

export function shouldShowScreensaverMusic(input: {
  preferredEntityId: string | null | undefined;
  preferredPlayerActive: boolean;
  musicAssistantPlaying: boolean;
}): boolean {
  if (isScreensaverMusicOff(input.preferredEntityId)) return false;
  if (input.preferredEntityId) return input.preferredPlayerActive;
  return input.preferredPlayerActive || input.musicAssistantPlaying;
}

export function screensaverMusicFromHaEntity(entity: {
  entity_id: string;
  attributes?: Record<string, unknown>;
}): { title: string; artist: string; coverUrl: string | null } {
  const attrs = entity.attributes ?? {};
  const title = typeof attrs.media_title === "string" ? attrs.media_title.trim() : "";
  const artist = typeof attrs.media_artist === "string" ? attrs.media_artist.trim() : "";
  const picture = typeof attrs.entity_picture === "string" ? attrs.entity_picture.trim() : "";
  const coverUrl = picture
    ? mediaImageRequestUrl(
        entity.entity_id,
        mediaArtworkCacheKey({
          entityPicture: picture,
          mediaTitle: title,
          mediaArtist: artist,
          mediaContentId: typeof attrs.media_content_id === "string" ? attrs.media_content_id : "",
        })
      )
    : null;
  return { title, artist, coverUrl };
}
