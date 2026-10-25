import { getBasePath, withBasePath } from "./base-path";

/** Response header set on a dashboard session 401 (not an upstream service 401). */
export const SESSION_AUTH_HEADER = "x-dashboard-auth";
export const SESSION_AUTH_VALUE = "session";

const LOCAL_ORIGIN = "http://dashboard.local";

let redirecting = false;

export function sessionRedirectStarted(): boolean {
  return redirecting;
}

export function resetSessionRedirectForTests(): void {
  redirecting = false;
}

export function isSessionExpiredResponse(status: number, authHeader: string | null): boolean {
  return status === 401 && authHeader === SESSION_AUTH_VALUE;
}

/** Same-origin relative path only. Anything else becomes `/`. */
export function safeNextPath(raw: string | null | undefined): string {
  if (raw == null) return "/";
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//") || trimmed.includes("\\")) return "/";
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return "/";

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return "/";
  }
  if (decoded !== trimmed) {
    if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\")) return "/";
    if (/[\u0000-\u001F\u007F]/.test(decoded)) return "/";
  }

  let url: URL;
  try {
    url = new URL(decoded, LOCAL_ORIGIN);
  } catch {
    return "/";
  }
  if (url.origin !== LOCAL_ORIGIN || url.username || url.password) return "/";
  const path = `${url.pathname}${url.search}${url.hash}`;
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

export function detectBrowserBasePath(pathname: string, baked = ""): string {
  const ingress = /^(\/api\/hassio_ingress\/[^/]+)/.exec(pathname);
  if (ingress?.[1]) return ingress[1];
  const base = baked.replace(/\/+$/, "");
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) return base;
  return "";
}

export function pathWithinBase(pathname: string, base: string): string {
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    const rest = pathname.slice(base.length) || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname || ""}`;
}

/** Login URL for this document, or null when the browser is already on the login page. */
export function buildLoginHref(
  pathname: string,
  search: string,
  baked = "",
  options?: { expired?: boolean }
): string | null {
  const base = detectBrowserBasePath(pathname, baked);
  const within = pathWithinBase(pathname, base);
  if (within === "/login") return null;
  const next = safeNextPath(`${within}${search || ""}`);
  const nextPath = next.split(/[?#]/)[0] || "/";
  const target = nextPath === "/login" ? "/" : next;
  const expired = options?.expired ? "&expired=1" : "";
  return `${base}/login?next=${encodeURIComponent(target)}${expired}`;
}

/**
 * Relative Location for an HTML 401. Never uses the internal request host.
 */
export function unauthorizedLoginLocation(requestUrl: string): string {
  const next = safeNextPath(new URL(requestUrl).pathname);
  const prefix = getBasePath().replace(/\/+$/, "");
  return `${prefix}/login?next=${encodeURIComponent(next)}`;
}

/** Where to send the browser after a successful login. `pathname` is `location.pathname`. */
export function postLoginTarget(nextParam: string | null | undefined, pathname = ""): string {
  const safe = safeNextPath(nextParam);
  const pathOnly = safe.split(/[?#]/)[0] || "/";
  const within = pathOnly === "/login" ? "/" : safe;
  const baked = getBasePath().replace(/\/+$/, "");
  // Root stays without a trailing slash; withBasePath("/") would append one and 308-loop under ingress.
  const prefixed = within === "/" ? baked || "/" : withBasePath(within);
  const live = detectBrowserBasePath(pathname, baked);
  if (baked && live && live !== baked && (prefixed === baked || prefixed.startsWith(`${baked}/`))) {
    // HA only routes /api/hassio_ingress/{token}/{path}: the ingress root needs its slash (#283),
    // as the ingress proxy writes it. Upstream it still maps to bare /__ha_ingress__, so no 308 loop.
    return `${live}${prefixed.slice(baked.length) || "/"}`;
  }
  return prefixed;
}

export function redirectToLoginOnce(
  location: { pathname: string; search: string; assign: (href: string) => void },
  baked = ""
): boolean {
  if (redirecting) return false;
  const href = buildLoginHref(location.pathname, location.search, baked, { expired: true });
  if (!href) return false;
  redirecting = true;
  location.assign(href);
  return true;
}
