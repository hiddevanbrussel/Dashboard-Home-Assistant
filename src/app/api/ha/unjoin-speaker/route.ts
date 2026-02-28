import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { callService } from "@/lib/ha/rest";

/**
 * POST /api/ha/unjoin-speaker – Unjoin a media player from its group (media_player.unjoin).
 * Body: { entity_id: string } – The media_player entity to unjoin.
 */
export async function POST(request: Request) {
  let body: { entity_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const entityId = body?.entity_id;
  if (!entityId || typeof entityId !== "string") {
    return NextResponse.json({ error: "entity_id required" }, { status: 400 });
  }
  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No Home Assistant connection" }, { status: 400 });
  }
  const result = await callService(config, "media_player", "unjoin", { entity_id: entityId });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
