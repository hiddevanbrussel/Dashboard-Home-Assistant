import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { callService } from "@/lib/ha/rest";

/**
 * POST /api/ha/join-speakers – Join media players into a sync group (media_player.join).
 * Body: { entity_ids: string[] } – First entity is the main (playback source), rest are added to the group.
 * Requires Home Assistant connection and Music Assistant integration (media_player entities).
 */
export async function POST(request: Request) {
  let body: { entity_ids?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const entityIds = body?.entity_ids;
  if (!Array.isArray(entityIds) || entityIds.length < 2) {
    return NextResponse.json(
      { error: "entity_ids must be an array with at least 2 media_player entity IDs" },
      { status: 400 }
    );
  }
  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No Home Assistant connection" }, { status: 400 });
  }
  const [mainEntityId, ...groupMembers] = entityIds;
  const serviceData = {
    entity_id: mainEntityId,
    group_members: groupMembers,
  };
  const result = await callService(config, "media_player", "join", serviceData);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
