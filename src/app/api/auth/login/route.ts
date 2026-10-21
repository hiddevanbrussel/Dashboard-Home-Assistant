import { NextResponse } from "next/server";
import { validateDashboardPassword } from "@/lib/check-secrets.mjs";
import { clearLoginFailures, loginAllowed, recordLoginFailure } from "@/lib/login-rate-limit";
import { safeEqual, SESSION_COOKIE, SESSION_MAX_AGE_SEC, signSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function clientKey(request: Request): string {
  return (request.headers.get("x-real-ip") ?? "local").trim() || "local";
}

function secureCookie(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (proto) return proto === "https";
  return new URL(request.url).protocol === "https:";
}

export async function POST(request: Request) {
  const limited = loginAllowed(clientKey(request));
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  const expected = process.env.DASHBOARD_PASSWORD ?? "";
  const secret = process.env.APP_SECRET ?? "";
  if (!validateDashboardPassword(expected).ok || !secret || !safeEqual(password, expected)) {
    recordLoginFailure(clientKey(request));
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  clearLoginFailures(clientKey(request));
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, signSession(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookie(request),
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return response;
}
