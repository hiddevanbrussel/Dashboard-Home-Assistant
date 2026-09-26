/**
 * Encrypted connection token formats for Home Assistant.
 * Plain strings = long-lived / supervisor tokens.
 * Prefixed JSON = OAuth refresh bundle (access tokens expire ~30 min).
 */

import { refreshAccessToken } from "./oauth";

export const OAUTH_TOKEN_PREFIX = "oauth1:";

export type StoredOAuthBundle = {
  v: 1;
  kind: "oauth";
  refresh_token: string;
  client_id: string;
  access_token: string;
  /** Epoch ms when access_token should be treated as expired. */
  expires_at: number;
};

export function encodeOAuthBundle(bundle: StoredOAuthBundle): string {
  return OAUTH_TOKEN_PREFIX + JSON.stringify(bundle);
}

export function tryParseOAuthBundle(raw: string): StoredOAuthBundle | null {
  if (!raw.startsWith(OAUTH_TOKEN_PREFIX)) return null;
  try {
    const data = JSON.parse(raw.slice(OAUTH_TOKEN_PREFIX.length)) as StoredOAuthBundle;
    if (
      data?.v !== 1 ||
      data.kind !== "oauth" ||
      typeof data.refresh_token !== "string" ||
      typeof data.client_id !== "string" ||
      typeof data.access_token !== "string" ||
      typeof data.expires_at !== "number"
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function buildOAuthBundle(input: {
  refreshToken: string;
  clientId: string;
  accessToken: string;
  expiresInSec: number;
  nowMs?: number;
}): StoredOAuthBundle {
  const now = input.nowMs ?? Date.now();
  const skewMs = 60_000; // refresh 1 min early
  return {
    v: 1,
    kind: "oauth",
    refresh_token: input.refreshToken,
    client_id: input.clientId,
    access_token: input.accessToken,
    expires_at: now + Math.max(60, input.expiresInSec) * 1000 - skewMs,
  };
}

/** True when access token should be refreshed before use. */
export function oauthAccessNeedsRefresh(bundle: StoredOAuthBundle, nowMs = Date.now()): boolean {
  return nowMs >= bundle.expires_at;
}

/**
 * Ensure a usable Bearer access token. Refreshes when expired.
 * Returns the access token and optionally an updated encoded blob to persist.
 */
export async function resolveOAuthAccessToken(opts: {
  haBaseUrl: string;
  encoded: string;
  nowMs?: number;
}): Promise<{ accessToken: string; encodedToPersist?: string } | null> {
  const bundle = tryParseOAuthBundle(opts.encoded);
  if (!bundle) return null;

  if (!oauthAccessNeedsRefresh(bundle, opts.nowMs)) {
    return { accessToken: bundle.access_token };
  }

  const refreshed = await refreshAccessToken({
    haBaseUrl: opts.haBaseUrl,
    refreshToken: bundle.refresh_token,
    clientId: bundle.client_id,
  });

  const next = buildOAuthBundle({
    refreshToken: refreshed.refresh_token ?? bundle.refresh_token,
    clientId: bundle.client_id,
    accessToken: refreshed.access_token,
    expiresInSec: refreshed.expires_in ?? 1800,
    nowMs: opts.nowMs,
  });

  return {
    accessToken: next.access_token,
    encodedToPersist: encodeOAuthBundle(next),
  };
}
