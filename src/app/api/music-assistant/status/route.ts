import { NextResponse } from "next/server";
import { readMusicAssistantEnvConfig } from "@/lib/music-assistant-env";

/** Whether the server has Docker/env Music Assistant token and/or URL (client fields optional). */
export async function GET() {
  const { envTokenConfigured, envUrlConfigured, envUrl } = readMusicAssistantEnvConfig();
  return NextResponse.json(
    {
      envTokenConfigured,
      envUrlConfigured,
      envUrl,
      /** True when at least the API token comes from the server env. */
      envConfigured: envTokenConfigured,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
