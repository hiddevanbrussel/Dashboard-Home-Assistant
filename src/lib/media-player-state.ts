/** Header and room-card now-playing indicators. Paused media is not "playing". */
export function isPlayingMediaPlayerState(state: string | undefined | null): boolean {
  return state === "playing";
}

export function selectPlayingMediaPlayers<T extends { entity_id: string; state: string }>(
  entities: Iterable<T>
): T[] {
  return [...entities].filter(
    (entity) => entity.entity_id.startsWith("media_player.") && isPlayingMediaPlayerState(entity.state)
  );
}
