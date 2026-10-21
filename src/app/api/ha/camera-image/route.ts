import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { isCameraEntityId } from "@/lib/ha-service-policy";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * GET /api/ha/camera-image?entity_id=camera.xxx
 * Proxies the camera snapshot from Home Assistant's camera_proxy API.
 */
export async function GET(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const entityId = searchParams.get("entity_id");
  const t = searchParams.get("t") ?? Date.now().toString();

  if (!entityId || !isCameraEntityId(entityId)) {
    return NextResponse.json({ error: "entity_id must be a camera entity" }, { status: 400 });
  }

  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }

  try {
    const baseUrl = config.baseUrl.replace(/\/+$/, "");
    const imageUrl = `${baseUrl}/api/camera_proxy/${encodeURIComponent(entityId)}?t=${encodeURIComponent(t)}`;

    const res = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${config.token}` },
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const blob = await res.blob();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.toLowerCase().startsWith("image/")) {
      return NextResponse.json({ error: "Camera did not return an image" }, { status: 502 });
    }

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=5, stale-while-revalidate=5",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch camera image" }, { status: 500 });
  }
}
