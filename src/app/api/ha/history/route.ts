import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { getHistory } from "@/lib/ha/rest";

/**
 * GET /api/ha/history?entity_ids=sensor.a,sensor.b&days=7
 * Fetches history for energy entities. Returns daily consumption per entity.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityIdsParam = searchParams.get("entity_ids");
  const days = Math.min(14, Math.max(1, parseInt(searchParams.get("days") ?? "7", 10)));
  const connectionId = searchParams.get("connectionId") ?? undefined;

  if (!entityIdsParam?.trim()) {
    return NextResponse.json({ error: "entity_ids required" }, { status: 400 });
  }
  const entityIds = entityIdsParam.split(",").map((id) => id.trim()).filter(Boolean);
  if (entityIds.length === 0) {
    return NextResponse.json({ error: "At least one entity required" }, { status: 400 });
  }

  const config = await getHaConnection(connectionId);
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }

  try {
    const now = new Date();
    const endTime = now.toISOString();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    const startTime = startDate.toISOString();

    const rawHistory = await getHistory(config, entityIds, startTime, endTime);

    type DayData = { date: string; consumption: number };
    const result: Record<string, DayData[]> = {};

    for (let ei = 0; ei < entityIds.length; ei++) {
      const entityId = entityIds[ei];
      const states = rawHistory[ei] ?? [];
      if (states.length === 0) {
        result[entityId] = [];
        continue;
      }

      const byDay = new Map<string, { first: number; last: number }>();
      for (const s of states) {
        const val = parseFloat(s.state);
        if (Number.isNaN(val)) continue;
        const dateKey = new Date(s.last_changed).toISOString().slice(0, 10);
        const existing = byDay.get(dateKey);
        if (!existing) {
          byDay.set(dateKey, { first: val, last: val });
        } else {
          existing.last = val;
        }
      }

      const sortedDates = Array.from(byDay.keys()).sort();
      const dayData: DayData[] = [];
      let prevEnd: number | null = null;
      for (const dateKey of sortedDates) {
        const { last } = byDay.get(dateKey)!;
        const consumption = prevEnd != null ? Math.max(0, last - prevEnd) : 0;
        dayData.push({ date: dateKey, consumption });
        prevEnd = last;
      }
      result[entityId] = dayData;
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch history" },
      { status: 500 }
    );
  }
}
