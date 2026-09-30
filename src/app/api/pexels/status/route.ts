import { NextResponse } from "next/server";
import { resolvePexelsApiKey } from "@/lib/pexels";

/** Whether the server has a Docker/env Pexels key (client may omit X-Pexels-Api-Key). */
export async function GET() {
  const { apiKey, source } = resolvePexelsApiKey({
    envKey: process.env.PEXELS_API_KEY,
    headerKey: null,
  });
  return NextResponse.json(
    {
      envConfigured: apiKey.length > 0 && source === "env",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
