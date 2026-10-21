import { NextResponse } from "next/server";
import { credentialFlags, readIntegration } from "@/lib/integration-credentials";
import { resolvePexelsApiKey } from "@/lib/pexels";
import { requireApiAuth } from "@/lib/require-api-auth";

/** Whether the server has a Pexels key in the environment or the encrypted store. */
export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;
  const stored = credentialFlags(await readIntegration("pexels"));
  const { apiKey, source } = resolvePexelsApiKey({
    envKey: process.env.PEXELS_API_KEY,
    storedKey: null,
  });
  return NextResponse.json(
    {
      envConfigured: apiKey.length > 0 && source === "env",
      serverConfigured: stored.serverSecretConfigured,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
