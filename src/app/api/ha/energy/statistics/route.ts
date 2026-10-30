import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { loadEnergyStatistics, redactSecrets } from "@/lib/energy-stats";
import type { EnergyView } from "@/lib/energy-time";
import { requireApiAuth } from "@/lib/require-api-auth";

const VIEWS: readonly EnergyView[] = ["day", "week", "month", "year"];

function parseView(raw: string | null): EnergyView | null {
  if (raw == null || raw === "") return "day";
  return VIEWS.includes(raw as EnergyView) ? (raw as EnergyView) : null;
}

function parseOffset(raw: string | null): number | null {
  if (raw == null || raw === "") return 0;
  if (!/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  if (value > 100) return null;
  return value;
}

/**
 * GET /api/ha/energy/statistics?view=day|week|month|year&offset=0&partial=1
 * Statistic ids come from the parsed energy prefs.
 * Optional devices= is the user's topDeviceIds choice.
 * In manual mode, manual= is role:id (import, export, solar, battery_in, battery_out), at most 12.
 * An id without one of those roles is ignored.
 * Anything outside that allowlist is ignored. This route never writes to Home Assistant.
 */
export async function GET(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const view = parseView(searchParams.get("view"));
  if (!view) return NextResponse.json({ error: "Invalid view" }, { status: 400 });
  const offset = parseOffset(searchParams.get("offset"));
  if (offset == null) return NextResponse.json({ error: "Invalid offset" }, { status: 400 });
  const connectionId = searchParams.get("connectionId") ?? undefined;
  const config = await getHaConnection(connectionId);
  if (!config) {
    return NextResponse.json(
      { error: "No Home Assistant connection. Complete onboarding first." },
      { status: 400 }
    );
  }
  try {
    const body = await loadEnergyStatistics({
      config,
      connectionId: connectionId ?? config.baseUrl,
      view,
      offset,
      partial: searchParams.get("partial") === "1",
      manual: searchParams.has("manual") ? (searchParams.get("manual") ?? "") : null,
      devices: searchParams.has("devices") ? (searchParams.get("devices") ?? "") : null,
    });
    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Energy statistics unavailable";
    return NextResponse.json({ error: redactSecrets(message, [config.token]) }, { status: 502 });
  }
}
