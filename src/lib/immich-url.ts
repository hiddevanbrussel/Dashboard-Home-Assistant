export const DEFAULT_IMMICH_PORT = 2283;

export type ImmichEndpoint = {
  protocol: "http" | "https";
  host: string;
  port: string;
};

const ASSET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function stripPath(host: string): string {
  return host.trim().replace(/\/.*$/, "");
}

/** Parse a stored Immich base URL or a raw IP/host into protocol, host and port. */
export function parseImmichEndpoint(baseUrl: string): ImmichEndpoint {
  const trimmed = (baseUrl || "").trim();
  if (!trimmed) {
    return { protocol: "http", host: "", port: String(DEFAULT_IMMICH_PORT) };
  }
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    const url = new URL(withProto);
    const protocol = url.protocol === "https:" ? "https" : "http";
    const port = url.port || (protocol === "https" ? "443" : String(DEFAULT_IMMICH_PORT));
    return { protocol, host: url.hostname, port };
  } catch {
    const host = stripPath(trimmed.replace(/^https?:\/\//i, ""));
    return { protocol: "http", host, port: String(DEFAULT_IMMICH_PORT) };
  }
}

/** Build an Immich origin (no trailing slash). Path prefixes are kept on stored URLs separately. */
export function buildImmichBaseUrl(
  host: string,
  port: string = String(DEFAULT_IMMICH_PORT),
  protocol: "http" | "https" = "http"
): string {
  const raw = stripPath(host).replace(/^https?:\/\//i, "");
  if (!raw) return "";
  const parsed = parseImmichEndpoint(/^https?:\/\//i.test(host) ? host : `${protocol}://${raw}`);
  const h = parsed.host || raw;
  const p = (port || parsed.port || String(DEFAULT_IMMICH_PORT)).trim();
  const proto = protocol || parsed.protocol;
  const hidePort = (proto === "http" && p === "80") || (proto === "https" && p === "443");
  return `${proto}://${h}${hidePort ? "" : `:${p}`}`;
}

/**
 * Accept IP, hostname, host:port or a full URL and return a usable Immich origin.
 * `192.168.1.50` → `http://192.168.1.50:2283`
 */
export function normalizeImmichBaseUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    const url = new URL(withProto);
    const protocol = url.protocol === "https:" ? "https" : "http";
    if (!url.hostname) return "";
    const port =
      url.port ||
      (protocol === "https" ? "443" : String(DEFAULT_IMMICH_PORT));
    const origin = buildImmichBaseUrl(url.hostname, port, protocol);
    const prefix = url.pathname.replace(/\/+$/, "");
    if (!prefix || prefix === "/") return origin;
    return `${origin}${prefix}`;
  } catch {
    const parsed = parseImmichEndpoint(trimmed);
    if (!parsed.host) return "";
    return buildImmichBaseUrl(parsed.host, parsed.port, parsed.protocol);
  }
}

export function isSafeImmichBaseUrl(baseUrl: string): boolean {
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

export function isSafeImmichAssetId(id: string): boolean {
  return ASSET_ID.test(id);
}

const IMMICH_JSON_PATHS = new Set(["/api/server/ping", "/api/server/about", "/api/albums", "/api/search/random"]);

export function isSafeImmichApiPath(path: string): boolean {
  if (IMMICH_JSON_PATHS.has(path)) return true;
  if (/^\/api\/assets\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/thumbnail$/i.test(path)) {
    return true;
  }
  if (/^\/api\/assets\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/original$/i.test(path)) {
    return true;
  }
  if (/^\/api\/assets\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/video\/playback$/i.test(path)) {
    return true;
  }
  return false;
}

export function joinImmichUrl(baseUrl: string, path: string, search = ""): string {
  const base = baseUrl.replace(/\/+$/, "");
  return `${base}${path}${search}`;
}

export type ImmichAssetKind = "preview" | "video";

export function buildImmichAssetProxyUrl(opts: {
  baseUrl: string;
  apiKey: string;
  id: string;
  kind: ImmichAssetKind;
}): string {
  const params = new URLSearchParams({
    baseUrl: opts.baseUrl,
    apiKey: opts.apiKey,
    id: opts.id,
    kind: opts.kind,
  });
  return `/api/immich/asset?${params.toString()}`;
}

export function pickRandomImmichAsset(data: unknown): { id: string } | null {
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { assets?: unknown }).assets)
      ? (data as { assets: unknown[] }).assets
      : [];
  const assets = list.filter(
    (item): item is { id: string } =>
      Boolean(item && typeof item === "object" && typeof (item as { id?: unknown }).id === "string" && isSafeImmichAssetId((item as { id: string }).id))
  );
  if (assets.length === 0) return null;
  return assets[Math.floor(Math.random() * assets.length)];
}
