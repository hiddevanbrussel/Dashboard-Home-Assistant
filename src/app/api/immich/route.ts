import { NextResponse } from "next/server";
import { boundImmich } from "@/lib/bound-integration";
import { isSafeImmichApiPath, joinImmichUrl } from "@/lib/immich-url";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * Proxy JSON calls to a local Immich instance so the browser does not hit CORS.
 * Prefers Docker/env `IMMICH_URL` + `IMMICH_API_KEY` over client-supplied values.
 */
export async function POST(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
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

  const bound = await boundImmich({
    baseUrl: typeof body.baseUrl === "string" ? body.baseUrl : null,
    apiKey: typeof body.apiKey === "string" ? body.apiKey : null,
  });
  const path = typeof body.path === "string" ? body.path : "";
  const method = (body.method ?? "GET").toUpperCase();
  if (!bound.ok) {
    return NextResponse.json({ error: bound.error }, { status: 400 });
  }
  const { baseUrl, secret: apiKey } = bound.target;

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
