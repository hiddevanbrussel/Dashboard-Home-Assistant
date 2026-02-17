import { NextResponse } from "next/server";

/**
 * Proxy to Music Assistant API (https://www.music-assistant.io/api/).
 * Client sends baseUrl, token, and MA request body so we don't store credentials on the server.
 * POST body: { baseUrl: string, token: string, message_id?: string, command: string, args?: Record<string, unknown> }
 */
export async function POST(request: Request) {
  let body: {
    baseUrl?: string;
    token?: string;
    message_id?: string;
    command?: string;
    args?: Record<string, unknown>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const baseUrl = typeof body?.baseUrl === "string" ? body.baseUrl.replace(/\/+$/, "") : "";
  const token = typeof body?.token === "string" ? body.token : "";
  const command = typeof body?.command === "string" ? body.command : "";
  if (!baseUrl || !command) {
    return NextResponse.json({ error: "baseUrl and command required" }, { status: 400 });
  }

  const apiUrl = baseUrl.includes("/api") ? baseUrl : `${baseUrl}/api`;
  const payload = {
    message_id: body.message_id ?? String(Date.now()),
    command,
    args: body.args ?? {},
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (data as { message?: string })?.message;
      const err = (data as { error?: string })?.error;
      const detail = (data as { detail?: string | string[] | { msg?: string }[] })?.detail;
      const detailStr = Array.isArray(detail)
        ? (typeof detail[0] === "string" ? detail[0] : (detail[0] as { msg?: string })?.msg)
        : typeof detail === "string"
          ? detail
          : null;
      const raw = typeof data === "object" && data !== null ? JSON.stringify(data) : "";
      let errorMessage: string =
        (typeof msg === "string" ? msg : null) ??
        (typeof err === "string" ? err : null) ??
        (typeof detailStr === "string" ? detailStr : null) ??
        (raw.length > 0 && raw.length < 500 ? raw : `MA API error: ${res.status}`);
      if (res.status === 401) {
        errorMessage =
          "Music Assistant returned 401 Unauthorized. Add a valid API token in Settings (from Music Assistant → Settings → User management / API token).";
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reach Music Assistant";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
