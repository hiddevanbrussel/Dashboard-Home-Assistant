import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/encrypt";
import { prisma } from "@/lib/prisma";
import {
  createLongLivedAccessToken,
  decodeOAuthState,
  exchangeAuthorizationCode,
  getAppClientId,
  sanitizeReturnTo,
} from "@/lib/ha/oauth";

const COOKIE_NAME = "ha_oauth";

function redirectToApp(
  appOrigin: string,
  returnTo: string,
  params: Record<string, string>
): NextResponse {
  const path = sanitizeReturnTo(returnTo).split("?")[0] || "/onboarding";
  const target = new URL(`${appOrigin.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [k, v] of Object.entries(params)) {
    target.searchParams.set(k, v);
  }
  const res = NextResponse.redirect(target.toString(), 302);
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

/**
 * GET /api/ha/oauth/callback?code=...&state=...
 * Exchanges the IndieAuth code, creates a long-lived token, saves Connection.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");
  const oauthError = searchParams.get("error");

  const jar = await cookies();
  const cookieVal = jar.get(COOKIE_NAME)?.value ?? "";
  const [cookieNonce, cookieClientId] = cookieVal.split("|");

  const state = stateRaw ? decodeOAuthState(stateRaw) : null;
  const returnTo = sanitizeReturnTo(state?.ret);
  const appOrigin = cookieClientId || getAppClientId(request);

  if (oauthError) {
    return redirectToApp(appOrigin, returnTo, {
      ha_oauth: "error",
      ha_oauth_error: oauthError.slice(0, 180),
    });
  }
  if (!code || !state || !cookieNonce || !cookieClientId) {
    return redirectToApp(appOrigin, returnTo, {
      ha_oauth: "error",
      ha_oauth_error: "Missing authorization response. Try again.",
    });
  }
  if (state.n !== cookieNonce) {
    return redirectToApp(appOrigin, returnTo, {
      ha_oauth: "error",
      ha_oauth_error: "Login session expired. Try again.",
    });
  }

  const secret = process.env.APP_SECRET;
  if (!secret || secret.length < 16) {
    return redirectToApp(appOrigin, returnTo, {
      ha_oauth: "error",
      ha_oauth_error: "APP_SECRET is not configured.",
    });
  }

  try {
    const tokens = await exchangeAuthorizationCode({
      haBaseUrl: state.ha,
      code,
      clientId: cookieClientId,
    });

    let longLived: string;
    try {
      longLived = await createLongLivedAccessToken({
        haBaseUrl: state.ha,
        accessToken: tokens.access_token,
        clientName: "Dashboard Builder",
        lifespanDays: 3650,
      });
    } catch (err) {
      console.error("[api/ha/oauth/callback] LLAT failed, falling back to access token:", err);
      longLived = tokens.access_token;
    }

    await prisma.connection.deleteMany({});
    await prisma.connection.create({
      data: {
        baseUrl: state.ha,
        encryptedToken: encrypt(longLived),
      },
    });

    return redirectToApp(appOrigin, returnTo, {
      ha_oauth: "ok",
      ha_base: state.ha,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth failed";
    console.error("[api/ha/oauth/callback]", err);
    return redirectToApp(appOrigin, returnTo, {
      ha_oauth: "error",
      ha_oauth_error: message.slice(0, 180),
    });
  }
}
