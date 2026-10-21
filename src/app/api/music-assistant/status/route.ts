import { NextResponse } from "next/server";
import { credentialFlags, readIntegration } from "@/lib/integration-credentials";
import { readMusicAssistantEnvConfig } from "@/lib/music-assistant-env";
import { requireApiAuth } from "@/lib/require-api-auth";

/** Whether the server has Docker/env Music Assistant token and/or URL (client fields optional). */
export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;
  const { envTokenConfigured, envUrlConfigured, envUrl } = readMusicAssistantEnvConfig();
  const stored = credentialFlags(await readIntegration("music-assistant"));
  return NextResponse.json(
    {
      envTokenConfigured,
      envUrlConfigured,
      envUrl,
      envConfigured: envTokenConfigured,
      serverTokenConfigured: stored.serverSecretConfigured,
      serverUrlConfigured: stored.serverUrlConfigured,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
