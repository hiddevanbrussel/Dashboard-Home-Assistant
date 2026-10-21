import { NextResponse } from "next/server";
import { credentialFlags, readIntegration } from "@/lib/integration-credentials";
import { readImmichEnvConfig } from "@/lib/immich-env";
import { requireApiAuth } from "@/lib/require-api-auth";

/** Whether the server has Docker/env Immich key and/or URL (client fields optional). */
export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;
  const { envKeyConfigured, envUrlConfigured, envUrl } = readImmichEnvConfig();
  const stored = credentialFlags(await readIntegration("immich"));
  return NextResponse.json(
    {
      envKeyConfigured,
      envUrlConfigured,
      envUrl,
      envConfigured: envKeyConfigured,
      serverKeyConfigured: stored.serverSecretConfigured,
      serverUrlConfigured: stored.serverUrlConfigured,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
