import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ScoresResponse, ScoreRecord } from "@/lib/chores-types";

function getMondayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function getDateRange(period: string, dateStr: string): { from: string; to: string } {
  const to = dateStr;
  if (period === "week") {
    return { from: getMondayDate(dateStr), to };
  }
  if (period === "month") {
    const from = dateStr.slice(0, 7) + "-01";
    return { from, to };
  }
  // year
  const from = dateStr.slice(0, 4) + "-01-01";
  return { from, to };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "week";
  const dateParam = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const { from, to } = getDateRange(period, dateParam);

  const [children, chores, completions] = await Promise.all([
    prisma.child.findMany({ orderBy: { order: "asc" } }),
    prisma.chore.findMany(),
    prisma.choreCompletion.findMany({
      where: { date: { gte: from, lte: to } },
    }),
  ]);

  // Build a map of choreId → points (also handle slotted choreIds like "${id}:0")
  const chorePoints = new Map<string, number>(chores.map((c) => [c.id, c.points]));
  function resolvePoints(choreId: string): number {
    const direct = chorePoints.get(choreId);
    if (direct !== undefined) return direct;
    // slotted choreId: strip slot suffix
    const base = choreId.includes(":") ? choreId.slice(0, choreId.lastIndexOf(":")) : choreId;
    return chorePoints.get(base) ?? 0;
  }

  // Sum points per child
  const pointsMap = new Map<string, number>();
  for (const child of children) {
    pointsMap.set(child.id, 0);
  }
  for (const completion of completions) {
    const pts = resolvePoints(completion.choreId);
    pointsMap.set(completion.childId, (pointsMap.get(completion.childId) ?? 0) + pts);
  }

  // Sort and assign rank
  const sorted = children
    .map((child) => ({ child, points: pointsMap.get(child.id) ?? 0 }))
    .sort((a, b) => b.points - a.points);

  let rank = 1;
  const result: ScoreRecord[] = sorted.map(({ child, points }, i) => {
    if (i > 0 && points < sorted[i - 1].points) rank = i + 1;
    return {
      id: child.id,
      name: child.name,
      emoji: child.emoji,
      color: child.color,
      points,
      rank,
    };
  });

  const response: ScoresResponse = { children: result };
  return NextResponse.json(response);
}
