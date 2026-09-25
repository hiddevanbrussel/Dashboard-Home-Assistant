/**
 * Home Assistant IndieAuth helpers + long-lived token creation.
 * @see https://developers.home-assistant.io/docs/auth_api/
 */

import { getBasePath } from "@/lib/base-path";

export type HaTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
};

export type OAuthStartParams = {
  haBaseUrl: string;
  clientId: string;
  redirectUri: string;
  state: string;
};

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

/** Build authorize URL for Home Assistant IndieAuth. */
export function buildAuthorizeUrl(params: OAuthStartParams): string {
  const base = normalizeBaseUrl(params.haBaseUrl);
  const q = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    state: params.state,
  });
  return `${base}/auth/authorize?${q.toString()}`;
}

/**
 * Derive this app's public origin from an incoming request.
 * Prefers X-Forwarded-* so reverse proxies work.
 */
export function getAppClientId(request: Request): string {
  const url = new URL(request.url);
  const xfProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const xfHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const proto = xfProto || url.protocol.replace(/:$/, "") || "http";
  const host = xfHost || request.headers.get("host") || url.host;
  const basePath = getBasePath().replace(/\/+$/, "");
  return `${proto}://${host}${basePath}`;
}

export function getOAuthRedirectUri(clientId: string): string {
  return `${clientId.replace(/\/+$/, "")}/api/ha/oauth/callback`;
}

export async function exchangeAuthorizationCode(opts: {
  haBaseUrl: string;
  code: string;
  clientId: string;
}): Promise<HaTokenResponse> {
  const base = normalizeBaseUrl(opts.haBaseUrl);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: opts.code,
    client_id: opts.clientId,
  });
  const res = await fetch(`${base}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token exchange failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return (await res.json()) as HaTokenResponse;
}

export async function refreshAccessToken(opts: {
  haBaseUrl: string;
  refreshToken: string;
  clientId: string;
}): Promise<Omit<HaTokenResponse, "refresh_token"> & { refresh_token?: string }> {
  const base = normalizeBaseUrl(opts.haBaseUrl);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: opts.refreshToken,
    client_id: opts.clientId,
  });
  const res = await fetch(`${base}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token refresh failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return (await res.json()) as HaTokenResponse;
}

type WsMsg =
  | { type: "auth_required" }
  | { type: "auth_ok" }
  | { type: "auth_invalid"; message?: string }
  | { type: "result"; id: number; success: boolean; result: unknown; error?: { message?: string } };

function getWsUrl(baseUrl: string): string {
  const u = normalizeBaseUrl(baseUrl);
  return u.replace(/^http/, "ws") + "/api/websocket";
}

/**
 * Create a long-lived access token via the HA WebSocket API.
 * Lifespan is in days (HA max ~3650 ≈ 10 years).
 */
export async function createLongLivedAccessToken(opts: {
  haBaseUrl: string;
  accessToken: string;
  clientName?: string;
  lifespanDays?: number;
}): Promise<string> {
  const WebSocket = (await import("ws")).default;
  const url = getWsUrl(opts.haBaseUrl);
  const ws = new WebSocket(url);
  const clientName = opts.clientName ?? "Dashboard Builder";
  const lifespan = opts.lifespanDays ?? 3650;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      reject(new Error("WebSocket timeout creating long-lived token"));
    }, 20000);

    const fail = (err: Error) => {
      clearTimeout(timeout);
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      reject(err);
    };

    ws.on("message", (raw: Buffer | string) => {
      let msg: WsMsg;
      try {
        msg = JSON.parse(raw.toString()) as WsMsg;
      } catch {
        return;
      }
      if (msg.type === "auth_required") {
        ws.send(JSON.stringify({ type: "auth", access_token: opts.accessToken }));
        return;
      }
      if (msg.type === "auth_ok") {
        ws.send(
          JSON.stringify({
            id: 1,
            type: "auth/long_lived_access_token",
            client_name: clientName,
            lifespan,
          })
        );
        return;
      }
      if (msg.type === "auth_invalid") {
        fail(new Error(msg.message ?? "WebSocket auth failed"));
        return;
      }
      if (msg.type === "result" && msg.id === 1) {
        clearTimeout(timeout);
        try {
          ws.close();
        } catch {
          /* ignore */
        }
        if (!msg.success || typeof msg.result !== "string" || !msg.result) {
          fail(new Error(msg.error?.message ?? "Failed to create long-lived token"));
          return;
        }
        resolve(msg.result);
      }
    });

    ws.on("error", (err: Error) => fail(err));
  });
}

/** Allowed post-OAuth return paths (same-origin relative). */
export function sanitizeReturnTo(returnTo: string | null | undefined): string {
  if (!returnTo || typeof returnTo !== "string") return "/onboarding";
  const trimmed = returnTo.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/onboarding";
  if (trimmed.includes("://")) return "/onboarding";
  // Keep query string for resume hints
  return trimmed.slice(0, 200);
}

export type OAuthStatePayload = {
  /** CSRF nonce */
  n: string;
  /** HA base URL being authorized */
  ha: string;
  /** Relative path to return to after success */
  ret: string;
};

export function encodeOAuthState(payload: OAuthStatePayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeOAuthState(state: string): OAuthStatePayload | null {
  try {
    const json = Buffer.from(state, "base64url").toString("utf8");
    const data = JSON.parse(json) as OAuthStatePayload;
    if (!data?.n || !data?.ha || !data?.ret) return null;
    return data;
  } catch {
    return null;
  }
}
