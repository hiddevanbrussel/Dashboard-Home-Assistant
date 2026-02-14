import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";

/**
 * GET /api/ha/camera-image?entity_id=camera.xxx
 * Proxies the camera snapshot from Home Assistant's camera_proxy API.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityId = searchParams.get("entity_id");
  const t = searchParams.get("t") ?? Date.now().toString();

  if (!entityId) {
    return NextResponse.json({ error: "entity_id required" }, { status: 400 });
  }

  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }

  try {
    const baseUrl = config.baseUrl.replace(/\/+$/, "");
    const imageUrl = `${baseUrl}/api/camera_proxy/${entityId}?t=${t}`;

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
        "Cache-Control": "private, no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch camera image" }, { status: 500 });
  }
}
