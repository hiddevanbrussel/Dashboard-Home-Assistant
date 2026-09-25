import { withBasePath } from "@/lib/base-path";

/** Cache key so artwork reloads when the track changes, even if entity_picture stays the same. */
export function mediaArtworkCacheKey(input: {
  entityPicture?: string | null;
  mediaTitle?: string | null;
  mediaArtist?: string | null;
  mediaContentId?: string | null;
}): string {
  return [
    input.entityPicture?.trim() ?? "",
    input.mediaTitle?.trim() ?? "",
    input.mediaArtist?.trim() ?? "",
    input.mediaContentId?.trim() ?? "",
  ].join("|");
}

export function mediaImageRequestUrl(entityId: string, cacheKey: string): string {
  const params = new URLSearchParams({ entity_id: entityId, t: cacheKey });
  return withBasePath(`/api/ha/media-image?${params.toString()}`);
}

export function mediaImageServerCacheKey(entityId: string, trackKey: string): string {
  return `${entityId}\n${trackKey}`;
}
