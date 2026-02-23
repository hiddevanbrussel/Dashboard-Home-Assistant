import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getEntities } from "@/lib/ha/rest";

const MEDIA_IMAGE_CACHE_MAX = 100;
const mediaImageCache = new Map<string, { body: ArrayBuffer; contentType: string }>();

/**
 * GET /api/ha/media-image?entity_id=media_player.xxx
 * Returns the entity_picture image for the entity (proxied from HA if relative path).
 * Cached in memory and with long-lived browser Cache-Control for faster repeat loads.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityId = searchParams.get("entity_id");
  if (!entityId) {
    return NextResponse.json({ error: "entity_id required" }, { status: 400 });
  }
  const cached = mediaImageCache.get(entityId);
  if (cached) {
    return new NextResponse(cached.body, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "private, max-age=3600, stale-while-revalidate=600",
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
    const picture = entity?.attributes?.entity_picture as string | undefined;
    if (!picture) {
      return new NextResponse(null, { status: 404 });
    }
    const imageUrl = picture.startsWith("http")
      ? picture
      : `${config.baseUrl.replace(/\/+$/, "")}${picture.startsWith("/") ? "" : "/"}${picture}`;

    const res = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${config.token}` },
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
    mediaImageCache.set(entityId, { body: arrayBuffer, contentType });
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
