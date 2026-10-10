import { NextResponse } from "next/server";
import { readImmichEnvConfig } from "@/lib/immich-env";

/** Whether the server has Docker/env Immich key and/or URL (client fields optional). */
export async function GET() {
  const { envKeyConfigured, envUrlConfigured, envUrl } = readImmichEnvConfig();
  return NextResponse.json(
    {
      envKeyConfigured,
      envUrlConfigured,
      envUrl,
      /** True when at least the API key comes from the server env. */
      envConfigured: envKeyConfigured,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
