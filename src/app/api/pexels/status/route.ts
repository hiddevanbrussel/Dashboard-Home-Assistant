import { NextResponse } from "next/server";

/** Whether the server has a Docker/env Pexels key (client may omit X-Pexels-Api-Key). */
export async function GET() {
  const envKey = process.env.PEXELS_API_KEY?.trim() ?? "";
  return NextResponse.json(
    { envConfigured: envKey.length > 0 },
    { headers: { "Cache-Control": "no-store" } }
  );
}
