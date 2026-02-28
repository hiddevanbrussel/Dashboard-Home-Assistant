import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getHaConnection } from "@/lib/db";

export type CalendarEvent = {
  entityId: string;
  summary: string;
  start: string; // ISO dateTime or date string
  end: string;   // ISO dateTime or date string
  allDay: boolean;
  description?: string;
  location?: string;
};

/**
 * GET /api/ha/calendar?entityIds=calendar.one,calendar.two&start=ISO&end=ISO
 * Proxies HA calendar events API to avoid CORS and hide the token.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const entityIdsParam = searchParams.get("entityIds");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!entityIdsParam || !start || !end) {
    return NextResponse.json({ error: "entityIds, start, end required" }, { status: 400 });
  }

  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }

  const ids = entityIdsParam.split(",").filter(Boolean);
  const baseUrl = config.baseUrl.replace(/\/+$/, "");

  const results = await Promise.allSettled(
    ids.map(async (entityId) => {
      const url = `${baseUrl}/api/calendars/${entityId}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(`Failed for ${entityId}: ${res.status}`);
      const data = await res.json() as Array<{
        summary?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
        description?: string;
        location?: string;
      }>;
      return data.map((event) => ({
        entityId,
        summary: event.summary ?? "(no title)",
        start: event.start?.dateTime ?? event.start?.date ?? "",
        end: event.end?.dateTime ?? event.end?.date ?? "",
        allDay: !event.start?.dateTime,
        description: event.description,
        location: event.location,
      })) as CalendarEvent[];
    })
  );

  const events: CalendarEvent[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") events.push(...result.value);
  }

  return NextResponse.json({ events });
}
