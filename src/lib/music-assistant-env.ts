import { normalizeMusicAssistantBaseUrl } from "@/lib/music-assistant-url";

export type MusicAssistantTokenSource = "env" | "body" | null;
export type MusicAssistantUrlSource = "env" | "body" | null;

function rawUrlHasCredentials(raw: string): boolean {
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
    const url = new URL(withProto);
    return Boolean(url.username || url.password);
  } catch {
    return false;
  }
}

function isSafeMaBaseUrl(baseUrl: string): boolean {
  try {
    const url = new URL(baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (!url.hostname) return false;
    if (url.username || url.password) return false;
    return true;
  } catch {
    return false;
  }
}

function safeNormalizedMaUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || rawUrlHasCredentials(trimmed)) return "";
  const normalized = normalizeMusicAssistantBaseUrl(trimmed);
  if (!normalized || !isSafeMaBaseUrl(normalized)) return "";
  return normalized;
}

/**
 * Prefer the server/Docker env token when set so a stale browser-stored token
 * cannot override a working `MUSIC_ASSISTANT_TOKEN`. Fall back to the client body/query.
 */
export function resolveMusicAssistantToken(input: {
  envToken?: string | null;
  bodyToken?: string | null;
}): { token: string; source: MusicAssistantTokenSource } {
  const envToken = input.envToken?.trim() ?? "";
  if (envToken) return { token: envToken, source: "env" };
  const bodyToken = input.bodyToken?.trim() ?? "";
  if (bodyToken) return { token: bodyToken, source: "body" };
  return { token: "", source: null };
}

/**
 * Prefer `MUSIC_ASSISTANT_URL` when set so Docker/add-on config wins over localStorage.
 */
export function resolveMusicAssistantBaseUrl(input: {
  envUrl?: string | null;
  bodyUrl?: string | null;
}): { baseUrl: string; source: MusicAssistantUrlSource } {
  const envUrl = safeNormalizedMaUrl(input.envUrl ?? "");
  if (envUrl) return { baseUrl: envUrl, source: "env" };
  const bodyUrl = safeNormalizedMaUrl(input.bodyUrl ?? "");
  if (bodyUrl) return { baseUrl: bodyUrl, source: "body" };
  return { baseUrl: "", source: null };
}

/** Read Music Assistant connection overrides from process env (Docker / HA add-on). */
export function readMusicAssistantEnvConfig(env: NodeJS.ProcessEnv = process.env): {
  envTokenConfigured: boolean;
  envUrlConfigured: boolean;
  envUrl: string | null;
} {
  const { token, source: tokenSource } = resolveMusicAssistantToken({
    envToken: env.MUSIC_ASSISTANT_TOKEN,
    bodyToken: null,
  });
  const { baseUrl, source: urlSource } = resolveMusicAssistantBaseUrl({
    envUrl: env.MUSIC_ASSISTANT_URL,
    bodyUrl: null,
  });
  return {
    envTokenConfigured: token.length > 0 && tokenSource === "env",
    envUrlConfigured: baseUrl.length > 0 && urlSource === "env",
    envUrl: urlSource === "env" && baseUrl ? baseUrl : null,
  };
}
