import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getAreas } from "@/lib/ha/rest";

/**
 * GET /api/ha/areas – List areas from HA. Uses stored connection; no token on client.
 * Query: connectionId (optional).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const connectionId = searchParams.get("connectionId") ?? undefined;
  const config = await getHaConnection(connectionId);
  if (!config) {
    return NextResponse.json(
      { error: "No Home Assistant connection. Complete onboarding first." },
      { status: 400 }
    );
  }
  try {
    const areas = await getAreas(config);
    return NextResponse.json(areas);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch areas" },
      { status: 500 }
    );
  }
}
