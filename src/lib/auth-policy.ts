import { isAllowedHaBaseUrl } from "./ssrf-policy";
import { readCookie, SESSION_COOKIE, verifySession } from "./session";
import { safeEqual } from "./session";

const PUBLIC_API = new Set(["/api/health", "/api/auth/login", "/api/auth/logout", "/api/pwa-icon"]);

export function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  let path = pathname.split("?")[0] || "/";
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || "/";
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

export function isPublicPage(pathname: string): boolean {
  const path = normalizePath(pathname);
  return path === "/login";
}

export function isPublicApi(pathname: string): boolean {
  const path = normalizePath(pathname);
  return PUBLIC_API.has(path);
}

export function ingressAuthorized(request: Request): boolean {
  const addon = process.env.HA_ADDON === "1" || process.env.HA_ADDON === "true";
  if (!addon) return false;
  const expected = (process.env.INGRESS_AUTH_SECRET ?? "").trim();
  if (expected.length < 32) return false;
  const got = request.headers.get("x-dashboard-ingress") ?? "";
  return safeEqual(got, expected);
}

export function sessionAuthorized(request: Request): boolean {
  const secret = (process.env.APP_SECRET ?? "").trim();
  if (!secret) return false;
  const token = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  return verifySession(token, secret);
}

export function requestIsAuthorized(request: Request): boolean {
  return ingressAuthorized(request) || sessionAuthorized(request);
}

export function haBaseUrlAllowed(raw: string): boolean {
  return isAllowedHaBaseUrl(raw);
}
