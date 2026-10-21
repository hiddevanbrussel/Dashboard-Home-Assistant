import { lookup } from "node:dns/promises";
import { isBlockedIp, isIpAddress, isLocalHostname, isMetadataIp } from "./network-policy";

export { isBlockedIp, isLocalHostname, isMetadataIp } from "./network-policy";

export type HostScope = "public" | "local" | "blocked";

const METADATA_HOSTS = new Set([
  "metadata.google.internal",
  "metadata.google.com",
  "metadata",
]);

export function isLocalIp(ip: string): boolean {
  return isBlockedIp(ip) && !isMetadataIp(ip);
}

export function assessResolvedHost(hostname: string, ips: string[]): HostScope {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (METADATA_HOSTS.has(host) || isMetadataIp(host)) return "blocked";
  if (ips.some((ip) => isMetadataIp(ip))) return "blocked";
  if (isLocalHostname(host)) return "local";
  if (ips.length === 0) return "blocked";
  if (ips.some((ip) => isBlockedIp(ip))) return "local";
  return "public";
}

export type OutboundMode = "public-https" | "ha-base" | "lan-or-https";

export type OutboundUrl =
  | { ok: true; url: URL; scope: HostScope }
  | { ok: false; error: string };

function parseHttpUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (!url.hostname) return null;
    return url;
  } catch {
    return null;
  }
}

export async function classifyOutboundUrl(
  raw: string,
  mode: OutboundMode,
  resolve: (hostname: string) => Promise<string[]> = defaultResolve
): Promise<OutboundUrl> {
  const url = parseHttpUrl(raw.trim());
  if (!url) return { ok: false, error: "URL must be http or https, without a username or password." };
  const host = url.hostname;
  if (isMetadataIp(host) || METADATA_HOSTS.has(host.toLowerCase())) {
    return { ok: false, error: "That address is not allowed." };
  }

  if (mode === "ha-base" && url.protocol === "http:" && host.toLowerCase() === "supervisor") {
    return { ok: true, url, scope: "local" };
  }

  let ips: string[] = [];
  if (isIpAddress(host)) {
    ips = [host];
  } else if (mode !== "ha-base" || !isLocalHostname(host)) {
    try {
      ips = await resolve(host);
    } catch {
      return { ok: false, error: "Could not resolve that host." };
    }
  }
  const scope = assessResolvedHost(host, ips.length > 0 ? ips : isLocalHostname(host) ? ["127.0.0.1"] : []);
  if (scope === "blocked") return { ok: false, error: "That address is not allowed." };

  if (mode === "public-https") {
    if (url.protocol !== "https:") return { ok: false, error: "Only https URLs are allowed." };
    if (scope !== "public") return { ok: false, error: "Private and loopback addresses are not allowed." };
    return { ok: true, url, scope };
  }

  if (url.protocol === "http:" && scope !== "local") {
    return { ok: false, error: "Cleartext http is only allowed for local network addresses." };
  }
  if (mode === "ha-base" && url.protocol === "http:" && !isLocalHostname(host)) {
    return { ok: false, error: "Cleartext http is only allowed for local network addresses." };
  }
  return { ok: true, url, scope };
}

async function defaultResolve(hostname: string): Promise<string[]> {
  if (isIpAddress(hostname)) return [hostname];
  const records = await lookup(hostname, { all: true, verbatim: true });
  return records.map((record) => record.address);
}

const MAX_REDIRECTS = 3;

export async function fetchChecked(
  raw: string,
  mode: OutboundMode,
  init: RequestInit = {},
  deps: {
    resolve?: (hostname: string) => Promise<string[]>;
    fetchImpl?: typeof fetch;
  } = {}
): Promise<Response> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  let current = raw;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const classified = await classifyOutboundUrl(current, mode, deps.resolve);
    if (!classified.ok) {
      throw new Error(classified.error);
    }
    const response = await fetchImpl(classified.url.toString(), {
      ...init,
      redirect: "manual",
    });
    if (response.status < 300 || response.status >= 400) return response;
    const location = response.headers.get("location");
    if (!location) return response;
    current = new URL(location, classified.url).toString();
  }
  throw new Error("Too many redirects.");
}
