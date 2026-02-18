import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getEntities } from "@/lib/ha/rest";

/**
 * GET /api/ha/state – Current entity states from HA. Uses stored connection.
 * Client polls this; no token sent. For realtime, poll every 5–10s.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get("connectionId") ?? undefined;
    const config = await getHaConnection(connectionId);
    if (!config) {
      return NextResponse.json([]);
    }
    const entities = await getEntities(config);
    const state = entities.map((e) => ({
      entity_id: e.entity_id,
      state: e.state,
      attributes: e.attributes,
    }));
    return NextResponse.json(state);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch state";
    console.error("[api/ha/state]", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
