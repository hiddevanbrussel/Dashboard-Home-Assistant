import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { listAssistPipelines } from "@/lib/ha/assist";
import { requireApiAuth } from "@/lib/require-api-auth";

export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;
  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }
  try {
    const list = await listAssistPipelines(config);
    return NextResponse.json(list);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list Assist pipelines";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
