import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getEntities } from "@/lib/ha/rest";

/**
 * GET /api/ha/entities – List entities from HA. Uses stored connection; no token on client.
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
    const entities = await getEntities(config);
    return NextResponse.json(entities);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch entities" },
      { status: 500 }
    );
  }
}
