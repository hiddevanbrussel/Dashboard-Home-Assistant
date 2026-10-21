import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getBasePath } from "./base-path";
import { requestIsAuthorized } from "./auth-policy";

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
    const next = new URL(req.url).pathname;
    const login = `${getBasePath()}/login?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(new URL(login, req.url));
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
