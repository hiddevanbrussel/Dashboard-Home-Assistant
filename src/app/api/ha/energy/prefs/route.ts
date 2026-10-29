import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { loadEnergyPrefs, redactSecrets } from "@/lib/energy-stats";
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
    const model = await loadEnergyPrefs(config, connectionId ?? config.baseUrl);
    return NextResponse.json(model);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Energy prefs unavailable";
    return NextResponse.json({ error: redactSecrets(message, [config.token]) }, { status: 502 });
  }
}
