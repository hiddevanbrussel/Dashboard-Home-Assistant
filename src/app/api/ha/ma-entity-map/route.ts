import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getEntities } from "@/lib/ha/rest";

/**
 * GET /api/ha/ma-entity-map – Map Music Assistant queue_ids to Home Assistant media_player entity_ids.
 * Returns { [queue_id: string]: entity_id } for MA players.
 * MA integration creates entities as media_player.mass_* – we match by queue_id and friendly_name.
 */
export async function GET() {
  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No Home Assistant connection" }, { status: 400 });
  }
  try {
    const entities = await getEntities(config);
    const mediaPlayers = entities.filter((e) => e.entity_id?.startsWith("media_player."));
    const map: Record<string, string> = {};

    for (const e of mediaPlayers) {
      const entityId = e.entity_id;
      if (!entityId) continue;
      // MA entities: media_player.mass_<id> – extract the suffix
      const massMatch = entityId.match(/^media_player\.mass_(.+)$/);
      if (massMatch) {
        const suffix = massMatch[1];
        // queue_id can be the suffix (e.g. RINCON_xxx, or a short id)
        map[suffix] = entityId;
        // Also try lowercase/sanitized variants (HA lowercases entity_ids)
        const lower = suffix.toLowerCase();
        if (lower !== suffix) map[lower] = entityId;
      }
      // Match by friendly_name for display_name (e.g. "Living Room" -> entity)
      const friendlyName = (e.attributes?.friendly_name as string)?.trim();
      if (friendlyName) {
        const key = friendlyName.toLowerCase().replace(/\s+/g, "_");
        if (!map[key]) map[key] = entityId;
      }
    }

    return NextResponse.json(map);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch entity map" },
      { status: 500 }
    );
  }
}
