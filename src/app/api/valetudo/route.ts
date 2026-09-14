import { NextResponse } from "next/server";
import { isSafeValetudoApiPath, isSafeValetudoBaseUrl } from "@/lib/valetudo-url";

/**
 * Proxy to a local Valetudo instance so the browser does not hit CORS.
 * Client sends connection details; nothing is stored on the server.
 */
export async function POST(request: Request) {
  let body: {
    baseUrl?: string;
    username?: string;
    password?: string;
    method?: string;
    path?: string;
    payload?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const baseUrl = typeof body.baseUrl === "string" ? body.baseUrl.replace(/\/+$/, "") : "";
  const path = typeof body.path === "string" ? body.path : "";
  const method = (body.method ?? "GET").toUpperCase();
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!isSafeValetudoBaseUrl(baseUrl) || !isSafeValetudoApiPath(path)) {
    return NextResponse.json({ error: "Invalid Valetudo URL" }, { status: 400 });
  }
  if (method !== "GET" && method !== "PUT") {
    return NextResponse.json({ error: "Unsupported method" }, { status: 400 });
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (method === "PUT") headers["Content-Type"] = "application/json";
  if (username) {
    headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: method === "PUT" ? JSON.stringify(body.payload ?? {}) : undefined,
      signal: AbortSignal.timeout(8000),
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
            : `Valetudo error: ${res.status}`;
      return NextResponse.json(
        { error: message },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }
    return NextResponse.json(data === undefined ? {} : data);
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    const message = timedOut
      ? `Could not reach Valetudo at ${baseUrl}`
      : err instanceof Error
        ? err.message
        : "Failed to reach Valetudo";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
