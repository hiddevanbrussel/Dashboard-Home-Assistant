import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Content-Security-Policy", "base-uri 'self'; object-src 'none'");
  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  }
  return response;
}

export const config = {
  // "/" is required. With a basePath, the negative-lookahead matcher does not
  // match the exact root (`/__ha_ingress__`), so middleware never set x-pathname.
  matcher: ["/", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
