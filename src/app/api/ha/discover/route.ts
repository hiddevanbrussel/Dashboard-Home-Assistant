import { NextResponse } from "next/server";
import { discoverHomeAssistant } from "@/lib/ha/discover";
import { isHaAddon } from "@/lib/ha/addon";
import { baseUrlSchema } from "@/lib/validation";

/**
 * GET /api/ha/discover – Soft LAN discovery of Home Assistant instances.
 * Optional ?url= to include a user-provided candidate.
 * Skipped / empty when running as HA addon (Supervisor already links).
 */
export async function GET(request: Request) {
  if (isHaAddon()) {
    return NextResponse.json({
      instances: [],
      skipped: true,
      reason: "addon",
    });
  }

  const urlParam = new URL(request.url).searchParams.get("url");
  const extraUrls: string[] = [];
  if (urlParam) {
    const parsed = baseUrlSchema.safeParse(urlParam);
    if (parsed.success) extraUrls.push(parsed.data);
  }

  try {
    const instances = await discoverHomeAssistant({
      extraUrls,
      scanNeighbors: true,
    });
    return NextResponse.json({ instances, skipped: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Discovery failed";
    console.error("[api/ha/discover]", err);
    return NextResponse.json({ instances: [], skipped: false, error: message }, { status: 500 });
  }
}
