export const DEFAULT_VALETUDO_PORT = 80;

export type ValetudoEndpoint = {
  protocol: "http" | "https";
  host: string;
  port: string;
};

function stripPath(host: string): string {
  return host.trim().replace(/\/.*$/, "");
}

/** Parse a stored Valetudo base URL or a raw IP/host into protocol, host and port. */
export function parseValetudoEndpoint(baseUrl: string): ValetudoEndpoint {
  const trimmed = (baseUrl || "").trim();
  if (!trimmed) {
    return { protocol: "http", host: "", port: String(DEFAULT_VALETUDO_PORT) };
  }
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    const url = new URL(withProto);
    const protocol = url.protocol === "https:" ? "https" : "http";
    const port = url.port || (protocol === "https" ? "443" : String(DEFAULT_VALETUDO_PORT));
    return { protocol, host: url.hostname, port };
  } catch {
    const host = stripPath(trimmed.replace(/^https?:\/\//i, ""));
    return { protocol: "http", host, port: String(DEFAULT_VALETUDO_PORT) };
  }
}

/** Build a Valetudo origin (no trailing slash, no /api suffix). */
export function buildValetudoBaseUrl(
  host: string,
  port: string = String(DEFAULT_VALETUDO_PORT),
  protocol: "http" | "https" = "http"
): string {
  const raw = stripPath(host).replace(/^https?:\/\//i, "");
  if (!raw) return "";
  const parsed = parseValetudoEndpoint(/^https?:\/\//i.test(host) ? host : `${protocol}://${raw}`);
  const h = parsed.host || raw;
  const p = (port || parsed.port || String(DEFAULT_VALETUDO_PORT)).trim();
  const proto = protocol || parsed.protocol;
  const hidePort = (proto === "http" && p === "80") || (proto === "https" && p === "443");
  return `${proto}://${h}${hidePort ? "" : `:${p}`}`;
}

/**
 * Accept IP, hostname, host:port or a full URL and return a usable Valetudo origin.
 * `192.168.1.40` → `http://192.168.1.40`
 */
export function normalizeValetudoBaseUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const parsed = parseValetudoEndpoint(trimmed);
  if (!parsed.host) return "";
  return buildValetudoBaseUrl(parsed.host, parsed.port, parsed.protocol);
}

export function isSafeValetudoBaseUrl(baseUrl: string): boolean {
  try {
    const url = new URL(baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (!url.hostname) return false;
    if (url.username || url.password) return false;
    if (url.pathname && url.pathname !== "/") return false;
    return true;
  } catch {
    return false;
  }
}

const VALETUDO_PATH = /^\/api\/v2\/[A-Za-z0-9/_-]*$/;

export function isSafeValetudoApiPath(path: string): boolean {
  return VALETUDO_PATH.test(path);
}
