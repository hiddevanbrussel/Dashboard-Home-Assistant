import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { requestIsAuthorized } from "./auth-policy";
import { SESSION_AUTH_HEADER, SESSION_AUTH_VALUE, unauthorizedLoginLocation } from "./session-redirect";

async function requestFromIncomingHeaders(): Promise<Request> {
  const incoming = await headers();
  const path = incoming.get("x-pathname") || "/";
  return new Request(`http://internal${path}`, { headers: incoming });
}

export async function requireApiAuth(request?: Request): Promise<NextResponse | null> {
  const req = request ?? (await requestFromIncomingHeaders());
  if (requestIsAuthorized(req)) return null;
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("text/html")) {
    return new NextResponse(null, {
      status: 307,
      headers: { Location: unauthorizedLoginLocation(req.url) },
    });
  }
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { [SESSION_AUTH_HEADER]: SESSION_AUTH_VALUE } }
  );
}
