"use client";

import { useEffect } from "react";
import {
  SESSION_AUTH_HEADER,
  SESSION_AUTH_VALUE,
  isSessionExpiredResponse,
  redirectToLoginOnce,
  sessionRedirectStarted,
} from "@/lib/session-redirect";

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function pathnameOf(url: string): string {
  try {
    return new URL(url, "http://local").pathname;
  } catch {
    return url;
  }
}

function isAppApi(url: string): boolean {
  return pathnameOf(url).includes("/api/");
}

function isLoginRequest(url: string): boolean {
  return pathnameOf(url).endsWith("/api/auth/login");
}

/**
 * One redirect to the login page when a dashboard API says the session is gone.
 * Later API calls on this page resolve immediately so polling does not keep running.
 */
export function AuthFetchGuard() {
  useEffect(() => {
    const original = window.fetch.bind(window);
    const baked = process.env.NEXT_PUBLIC_BASE_PATH || "";
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = requestUrl(input);
      if (sessionRedirectStarted() && isAppApi(url) && !isLoginRequest(url)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: {
            "content-type": "application/json",
            [SESSION_AUTH_HEADER]: SESSION_AUTH_VALUE,
          },
        });
      }
      const response = await original(input, init);
      if (isSessionExpiredResponse(response.status, response.headers.get(SESSION_AUTH_HEADER))) {
        redirectToLoginOnce(
          {
            pathname: window.location.pathname,
            search: window.location.search,
            assign: (href) => window.location.assign(href),
          },
          baked
        );
      }
      return response;
    };
    return () => {
      window.fetch = original;
    };
  }, []);
  return null;
}
