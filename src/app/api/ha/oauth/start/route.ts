import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { baseUrlSchema } from "@/lib/validation";
import { isHaAddon } from "@/lib/ha/addon";
import {
  buildAuthorizeUrl,
  encodeOAuthState,
  getAppClientId,
  getOAuthRedirectUri,
  sanitizeReturnTo,
} from "@/lib/ha/oauth";

const COOKIE_NAME = "ha_oauth";
const COOKIE_MAX_AGE = 600; // 10 minutes

/**
 * GET /api/ha/oauth/start?baseUrl=...&returnTo=/onboarding
 * Redirects the browser to Home Assistant's authorize page.
 */
export async function GET(request: Request) {
  if (isHaAddon()) {
    return NextResponse.json(
      { error: "OAuth login is not needed when running as a Home Assistant app." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const baseUrlRaw = searchParams.get("baseUrl");
  const returnTo = sanitizeReturnTo(searchParams.get("returnTo"));

  const parsed = baseUrlSchema.safeParse(baseUrlRaw ?? "");
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid baseUrl query param is required." }, { status: 400 });
  }

  const clientId = getAppClientId(request);
  const redirectUri = getOAuthRedirectUri(clientId);
  const nonce = randomBytes(16).toString("hex");
  const state = encodeOAuthState({
    n: nonce,
    ha: parsed.data.replace(/\/+$/, ""),
    ret: returnTo,
  });

  const authorizeUrl = buildAuthorizeUrl({
    haBaseUrl: parsed.data,
    clientId,
    redirectUri,
    state,
  });

  const res = NextResponse.redirect(authorizeUrl, 302);
  // Store nonce + clientId so callback can verify CSRF and reuse the exact client_id.
  const cookieVal = `${nonce}|${clientId}`;
  res.cookies.set(COOKIE_NAME, cookieVal, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: clientId.startsWith("https://"),
  });
  return res;
}
