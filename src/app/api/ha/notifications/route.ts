import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getPersistentNotificationHub } from "@/lib/ha/persistent-notification-hub";
import { dismissCallsForShownNotifications } from "@/lib/ha/persistent-notifications";
import { callService } from "@/lib/ha/rest";
import { requireApiAuth } from "@/lib/require-api-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Ingress buffers the whole upstream body (`ingress_stream: false`), so server
 * sent events would not flush until the socket closed. A long-poll completes
 * when the websocket subscription changes and still works behind that proxy.
 * The Home Assistant socket itself uses the stored connection: supervisor
 * token, OAuth access token, or a long-lived token.
 */
const LONG_POLL_MS = 20_000;

function noStore(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function readSince(request: Request): { since: number; sessionId: string | null } | null {
  const url = new URL(request.url);
  const rawSince = url.searchParams.get("since");
  const since = rawSince == null || rawSince === "" ? -1 : Number(rawSince);
  if (!Number.isFinite(since) || since < -1 || since > Number.MAX_SAFE_INTEGER) return null;
  const rawSession = url.searchParams.get("session");
  const sessionId = rawSession && rawSession.length <= 80 ? rawSession : null;
  return { since, sessionId };
}

function readNotificationIds(body: unknown): string[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { notification_ids?: unknown }).notification_ids;
  if (!Array.isArray(raw) || raw.length > 100) return null;
  if (!raw.every((id) => typeof id === "string")) return null;
  return raw;
}

export async function GET(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const cursor = readSince(request);
  if (!cursor) return noStore({ error: "Invalid since" }, 400);
  if (request.signal.aborted) return new NextResponse(null, { status: 204 });

  try {
    const config = await getHaConnection();
    if (!config) return noStore({ error: "No HA connection" }, 400);
    const snapshot = await getPersistentNotificationHub().waitForUpdate({
      since: cursor.since,
      sessionId: cursor.sessionId,
      signal: request.signal,
      loadConfig: getHaConnection,
      timeoutMs: LONG_POLL_MS,
    });
    if (request.signal.aborted) return new NextResponse(null, { status: 204 });
    return noStore(snapshot);
  } catch (err) {
    console.error(
      "[api/ha/notifications]",
      err instanceof Error ? err.message : "Failed to load notifications"
    );
    return noStore({ error: "Failed to load notifications" }, 500);
  }
}

export async function POST(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noStore({ error: "Invalid JSON" }, 400);
  }
  const ids = readNotificationIds(body);
  if (!ids) return noStore({ error: "notification_ids required" }, 400);

  try {
    const config = await getHaConnection();
    if (!config) return noStore({ error: "No HA connection" }, 400);
    const calls = dismissCallsForShownNotifications(ids.map((notification_id) => ({ notification_id })));
    const dismissed: string[] = [];
    const failed: string[] = [];
    for (const call of calls) {
      const result = await callService(config, call.domain, call.service, call.service_data);
      if (result.ok) dismissed.push(call.service_data.notification_id);
      else failed.push(call.service_data.notification_id);
    }
    const hub = getPersistentNotificationHub();
    hub.noteDismissed(dismissed);
    return noStore({ ...hub.snapshot(), dismissed, failed });
  } catch (err) {
    console.error(
      "[api/ha/notifications]",
      err instanceof Error ? err.message : "Failed to dismiss notifications"
    );
    return noStore({ error: "Failed to dismiss notifications" }, 500);
  }
}
