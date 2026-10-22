export function showMusicNavigation(input: {
  musicAssistantEnabled: boolean;
  mediaPlayerCount: number;
}): boolean {
  return input.musicAssistantEnabled || input.mediaPlayerCount > 0;
}

/** Count Home Assistant `media_player.*` entities. Other domains are ignored. */
export function countHaMediaPlayers(entities: unknown): number {
  if (!Array.isArray(entities)) return 0;
  let count = 0;
  for (const entity of entities) {
    if (!entity || typeof entity !== "object") continue;
    const id = (entity as { entity_id?: unknown }).entity_id;
    if (typeof id === "string" && id.startsWith("media_player.")) count += 1;
  }
  return count;
}
