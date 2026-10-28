import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { energyModelFromCommand } from "@/lib/energy-prefs";
import { redactSecrets } from "@/lib/energy-stats";
import { haWsCommands } from "@/lib/ha/ws-commands";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * GET /api/ha/energy/prefs
 * Reads energy/get_prefs. A missing configuration comes back as source "manual".
 * The Home Assistant token stays on the server.
 */
export async function GET(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const connectionId = new URL(request.url).searchParams.get("connectionId") ?? undefined;
  const config = await getHaConnection(connectionId);
  if (!config) {
    return NextResponse.json(
      { error: "No Home Assistant connection. Complete onboarding first." },
      { status: 400 }
    );
  }
  try {
    const [prefs] = await haWsCommands(config, [{ type: "energy/get_prefs" }]);
    if (!prefs) {
      return NextResponse.json({ error: "Energy prefs unavailable (error)" }, { status: 502 });
    }
    return NextResponse.json(energyModelFromCommand(prefs));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Energy prefs unavailable";
    return NextResponse.json({ error: redactSecrets(message, [config.token]) }, { status: 502 });
  }
}
