import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getEntities } from "@/lib/ha/rest";

/**
 * GET /api/ha/media-image?entity_id=media_player.xxx
 * Returns the entity_picture image for the entity (proxied from HA if relative path).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityId = searchParams.get("entity_id");
  if (!entityId) {
    return NextResponse.json({ error: "entity_id required" }, { status: 400 });
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
    const blob = await res.blob();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
