import { NextResponse } from "next/server";
import { resolveImmichApiKey, resolveImmichBaseUrl } from "@/lib/immich-env";
import { isSafeImmichApiPath, joinImmichUrl } from "@/lib/immich-url";

/**
 * Proxy JSON calls to a local Immich instance so the browser does not hit CORS.
 * Prefers Docker/env `IMMICH_URL` + `IMMICH_API_KEY` over client-supplied values.
 */
export async function POST(request: Request) {
  let body: {
    baseUrl?: string;
    apiKey?: string;
    method?: string;
    path?: string;
    payload?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { baseUrl } = resolveImmichBaseUrl({
    envUrl: process.env.IMMICH_URL,
    bodyUrl: typeof body.baseUrl === "string" ? body.baseUrl : null,
  });
  const path = typeof body.path === "string" ? body.path : "";
  const method = (body.method ?? "GET").toUpperCase();
  const { apiKey } = resolveImmichApiKey({
    envKey: process.env.IMMICH_API_KEY,
    bodyKey: typeof body.apiKey === "string" ? body.apiKey : null,
  });

  if (!baseUrl || !isSafeImmichApiPath(path)) {
    return NextResponse.json({ error: "Invalid Immich URL" }, { status: 400 });
  }
  if (method !== "GET" && method !== "POST") {
    return NextResponse.json({ error: "Unsupported method" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing Immich API key. Set IMMICH_API_KEY on the server (Docker / add-on), or enter a key in Settings → Apps → Immich.",
      },
      { status: 400 }
    );
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-api-key": apiKey,
  };
  if (method === "POST") headers["Content-Type"] = "application/json";

  try {
    const res = await fetch(joinImmichUrl(baseUrl, path), {
      method,
      headers,
      body: method === "POST" ? JSON.stringify(body.payload ?? {}) : undefined,
      signal: AbortSignal.timeout(12000),
    });
    const rawText = await res.text();
    const data = (() => {
      try {
        if (!rawText.trim()) return {};
        return JSON.parse(rawText) as unknown;
      } catch {
        return { raw: rawText.slice(0, 400) };
      }
    })();
    if (!res.ok) {
      const message =
        typeof (data as { message?: string })?.message === "string"
          ? (data as { message: string }).message
          : rawText.length > 0 && rawText.length < 400
            ? rawText
            : `Immich error: ${res.status}`;
      return NextResponse.json(
        { error: message },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }
    return NextResponse.json(data === undefined ? {} : data);
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    const message = timedOut
      ? `Could not reach Immich at ${baseUrl}`
      : err instanceof Error
        ? err.message
        : "Failed to reach Immich";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
