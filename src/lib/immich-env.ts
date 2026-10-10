import { isSafeImmichBaseUrl, normalizeImmichBaseUrl } from "@/lib/immich-url";

export type ImmichKeySource = "env" | "body" | null;
export type ImmichUrlSource = "env" | "body" | null;

function rawUrlHasCredentials(raw: string): boolean {
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
    const url = new URL(withProto);
    return Boolean(url.username || url.password);
  } catch {
    return false;
  }
}

function safeNormalizedImmichUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || rawUrlHasCredentials(trimmed)) return "";
  const normalized = normalizeImmichBaseUrl(trimmed);
  if (!normalized || !isSafeImmichBaseUrl(normalized)) return "";
  return normalized;
}

/**
 * Prefer the server/Docker env key when set so a stale browser-stored key
 * cannot override a working `IMMICH_API_KEY`. Fall back to the client body/query.
 */
export function resolveImmichApiKey(input: {
  envKey?: string | null;
  bodyKey?: string | null;
}): { apiKey: string; source: ImmichKeySource } {
  const envKey = input.envKey?.trim() ?? "";
  if (envKey) return { apiKey: envKey, source: "env" };
  const bodyKey = input.bodyKey?.trim() ?? "";
  if (bodyKey) return { apiKey: bodyKey, source: "body" };
  return { apiKey: "", source: null };
}

/**
 * Prefer `IMMICH_URL` when set so Docker/add-on config wins over localStorage.
 */
export function resolveImmichBaseUrl(input: {
  envUrl?: string | null;
  bodyUrl?: string | null;
}): { baseUrl: string; source: ImmichUrlSource } {
  const envUrl = safeNormalizedImmichUrl(input.envUrl ?? "");
  if (envUrl) return { baseUrl: envUrl, source: "env" };
  const bodyUrl = safeNormalizedImmichUrl(input.bodyUrl ?? "");
  if (bodyUrl) return { baseUrl: bodyUrl, source: "body" };
  return { baseUrl: "", source: null };
}

/** Read Immich connection overrides from process env (Docker / HA add-on). */
export function readImmichEnvConfig(env: NodeJS.ProcessEnv = process.env): {
  envKeyConfigured: boolean;
  envUrlConfigured: boolean;
  envUrl: string | null;
} {
  const { apiKey, source: keySource } = resolveImmichApiKey({
    envKey: env.IMMICH_API_KEY,
    bodyKey: null,
  });
  const { baseUrl, source: urlSource } = resolveImmichBaseUrl({
    envUrl: env.IMMICH_URL,
    bodyUrl: null,
  });
  return {
    envKeyConfigured: apiKey.length > 0 && keySource === "env",
    envUrlConfigured: baseUrl.length > 0 && urlSource === "env",
    envUrl: urlSource === "env" && baseUrl ? baseUrl : null,
  };
}
