import { maCacheKey, maCommandCacheTtlMs, readMaCache, writeMaCache, type MaCacheEntry } from "@/lib/ma-cache";

const MA_TIMEOUT_MS = 12_000;

const responseCache = new Map<string, MaCacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export type MaServerCommand = {
  command: string;
  args?: Record<string, unknown>;
  skipCache?: boolean;
};

function apiUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, "");
  return trimmed.includes("/api") ? trimmed : `${trimmed}/api`;
}

async function postMa(baseUrl: string, token: string, command: string, args: Record<string, unknown>): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MA_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(apiUrl(baseUrl), {
      method: "POST",
      headers,
      body: JSON.stringify({
        message_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        command,
        args,
      }),
      signal: controller.signal,
    });
    const rawText = await res.text();
    const data = (() => {
      try {
        if (!rawText.trim()) return {};
        return JSON.parse(rawText) as Record<string, unknown>;
      } catch {
        return {};
      }
    })();
    if (!res.ok) {
      const message =
        (typeof (data as { message?: string }).message === "string" ? (data as { message: string }).message : null) ??
        (typeof (data as { error?: string }).error === "string" ? (data as { error: string }).error : null) ??
        (rawText.length > 0 && rawText.length < 600 ? rawText : `MA API error: ${res.status}`);
      throw Object.assign(new Error(message), { status: res.status, data });
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export async function callMaServer(
  baseUrl: string,
  token: string,
  command: string,
  args: Record<string, unknown> = {},
  options: { skipCache?: boolean } = {}
): Promise<unknown> {
  const ttl = options.skipCache ? null : maCommandCacheTtlMs(command);
  const key = maCacheKey(baseUrl, token, command, args);
  if (ttl != null) {
    const cached = readMaCache(responseCache, key);
    if (cached !== undefined) return cached;
    const pending = inflight.get(key);
    if (pending) return pending;
  }

  const request = postMa(baseUrl, token, command, args)
    .then((data) => {
      if (ttl != null) writeMaCache(responseCache, key, data, ttl);
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });

  if (ttl != null) inflight.set(key, request);
  return request;
}

export async function callMaServerSafe(
  baseUrl: string,
  token: string,
  command: string,
  args: Record<string, unknown> = {},
  options: { skipCache?: boolean } = {}
): Promise<unknown> {
  try {
    return await callMaServer(baseUrl, token, command, args, options);
  } catch (err) {
    const status = err && typeof err === "object" && "status" in err ? Number((err as { status?: number }).status) : 502;
    const message = err instanceof Error ? err.message : "Failed to reach Music Assistant";
    return { error: message, status };
  }
}

export function resetMaServerCache(): void {
  responseCache.clear();
  inflight.clear();
}
