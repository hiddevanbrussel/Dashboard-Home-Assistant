import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ChoreCompletionsResponse, ChildWithChores, ChoreCompletionRecord, ChoreFrequency } from "@/lib/chores-types";

function getMondayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = (day === 0 ? -6 : 1 - day); // shift to Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

function parseChildIds(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const todayDate = dateParam;
  const mondayDate = getMondayDate(dateParam);
  const weekendToday = isWeekend(todayDate);

  const [children, chores, completions] = await Promise.all([
    prisma.child.findMany({ orderBy: { order: "asc" } }),
    prisma.chore.findMany({ orderBy: { order: "asc" } }),
    // Fetch all completions from Monday of this week up to todayDate (covers full week)
    prisma.choreCompletion.findMany({
      where: { date: { gte: mondayDate, lte: todayDate } },
    }),
  ]);

  const result: ChildWithChores[] = children.map((child) => {
    const childChores = chores.filter((chore) => {
      const ids = parseChildIds(chore.childIds);
      if (ids !== null && !ids.includes(child.id)) return false;
      // Hide weekday-only chores on weekends
      if (chore.frequency === "weekdays" && weekendToday) return false;
      return true;
    });

    const choreRows: ChoreCompletionRecord[] = childChores.map((chore) => {
      const dateKey = chore.frequency === "weekly" ? mondayDate : todayDate;
      const completion = completions.find(
        (c) => c.choreId === chore.id && c.childId === child.id && c.date === dateKey
      );
      return {
        choreId: chore.id,
        title: chore.title,
        points: chore.points,
        frequency: chore.frequency as ChoreFrequency,
        icon: chore.icon,
        completionId: completion?.id ?? null,
        completedAt: completion?.completedAt.toISOString() ?? null,
      };
    });

    // todayPoints: daily + weekday chores completed today
    const todayPoints = choreRows
      .filter((r) => (r.frequency === "daily" || r.frequency === "weekdays") && r.completionId !== null)
      .reduce((sum, r) => sum + r.points, 0);

    // weekPoints: all chores completed this week (Mon–today)
    const childCompletions = completions.filter((c) => c.childId === child.id);

    // Use all chores (including weekday ones) for weekPoints calculation
    const allChildChores = chores.filter((chore) => {
      const ids = parseChildIds(chore.childIds);
      return ids === null || ids.includes(child.id);
    });

    let weekPoints = 0;
    for (const chore of allChildChores) {
      if (chore.frequency === "weekly") {
        const done = childCompletions.find(
          (c) => c.choreId === chore.id && c.date === mondayDate
        );
        if (done) weekPoints += chore.points;
      } else {
        // daily + weekdays: count each completion this week
        const doneCount = childCompletions.filter(
          (c) => c.choreId === chore.id
        ).length;
        weekPoints += doneCount * chore.points;
      }
    }

    return {
      id: child.id,
      name: child.name,
      emoji: child.emoji,
      color: child.color,
      todayPoints,
      weekPoints,
      chores: choreRows,
    };
  });

  const response: ChoreCompletionsResponse = { children: result };
  return NextResponse.json(response);
}

export async function POST(request: Request) {
  let body: { choreId?: string; childId?: string; frequency?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.choreId || !body.childId || !body.frequency) {
    return NextResponse.json({ error: "choreId, childId, frequency are required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Weekday-only chores cannot be completed on weekends
  if (body.frequency === "weekdays" && isWeekend(today)) {
    return NextResponse.json({ error: "Weekday chores cannot be completed on weekends" }, { status: 400 });
  }

  const date = body.frequency === "weekly" ? getMondayDate(today) : today;

  try {
    const completion = await prisma.choreCompletion.upsert({
      where: { choreId_childId_date: { choreId: body.choreId, childId: body.childId, date } },
      create: { choreId: body.choreId, childId: body.childId, date },
      update: {},
    });
    return NextResponse.json({
      id: completion.id,
      choreId: completion.choreId,
      childId: completion.childId,
      date: completion.date,
      completedAt: completion.completedAt.toISOString(),
    });
  } catch (err) {
    console.error("[POST /api/chore-completions]", err);
    return NextResponse.json({ error: "Failed to create completion" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  let body: { id?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  try {
    await prisma.choreCompletion.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // P2025: record not found — treat as success
    if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "P2025") {
      return NextResponse.json({ ok: true });
    }
    console.error("[DELETE /api/chore-completions]", err);
    return NextResponse.json({ error: "Failed to delete completion" }, { status: 500 });
  }
}
