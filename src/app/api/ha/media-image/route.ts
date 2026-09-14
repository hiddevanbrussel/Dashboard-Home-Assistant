import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getEntities } from "@/lib/ha/rest";
import { mediaImageServerCacheKey } from "@/lib/media-image";

const MEDIA_IMAGE_CACHE_MAX = 100;
const mediaImageCache = new Map<string, { body: ArrayBuffer; contentType: string }>();

/**
 * GET /api/ha/media-image?entity_id=media_player.xxx&t=cache-key
 * Returns the entity_picture image for the entity (proxied from HA if relative path).
 * Cached per player + track so a new song does not keep showing the previous cover.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityId = searchParams.get("entity_id");
  if (!entityId) {
    return NextResponse.json({ error: "entity_id required" }, { status: 400 });
  }
  const trackKey = searchParams.get("t") ?? "";
  const cacheKey = mediaImageServerCacheKey(entityId, trackKey);
  const cached = mediaImageCache.get(cacheKey);
  if (cached) {
    return new NextResponse(cached.body, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "private, max-age=300, stale-while-revalidate=60",
      },
    });
  }
  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }
  try {
    const entities = await getEntities(config);
    const entity = entities.find((e) => e.entity_id === entityId);
    const picture =
      (entity?.attributes?.entity_picture as string | undefined) ??
      (entity?.attributes?.entity_picture_local as string | undefined);
    if (!picture) {
      return new NextResponse(null, { status: 404 });
    }
    const imageUrl = picture.startsWith("http")
      ? picture
      : `${config.baseUrl.replace(/\/+$/, "")}${picture.startsWith("/") ? "" : "/"}${picture}`;

    const res = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${config.token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (mediaImageCache.size >= MEDIA_IMAGE_CACHE_MAX) {
      const firstKey = mediaImageCache.keys().next().value;
      if (firstKey !== undefined) mediaImageCache.delete(firstKey);
    }
    mediaImageCache.set(cacheKey, { body: arrayBuffer, contentType });
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=300, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
