import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { StreaksResponse } from "@/lib/chores-types";

function parseChildIds(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const [children, chores, completions] = await Promise.all([
    prisma.child.findMany({ orderBy: { order: "asc" } }),
    prisma.chore.findMany({ orderBy: { order: "asc" } }),
    // Look back up to 91 days for streak calculation
    prisma.choreCompletion.findMany({
      where: { date: { gte: addDays(today, -91) } },
    }),
  ]);

  const streaks: { childId: string; streak: number }[] = children.map((child) => {
    // Get all daily/weekday chores applicable to this child (exclude weekly, penalty)
    const applicableChores = chores.filter((chore) => {
      if (chore.frequency === "weekly") return false;
      if ((chore as { penalty?: boolean }).penalty) return false;
      const ids = parseChildIds(chore.childIds);
      return ids === null || ids.includes(child.id);
    });

    let streak = 0;
    let checkDate = today;

    for (let i = 0; i < 90; i++) {
      const weekend = isWeekend(checkDate);
      // Chores applicable on this specific day
      const dayChores = applicableChores.filter((chore) => {
        if (chore.frequency === "weekdays" && weekend) return false;
        return true;
      });

      if (dayChores.length === 0) {
        // No applicable chores on this day — skip (don't break streak)
        checkDate = addDays(checkDate, -1);
        continue;
      }

      // Check if all chores for this child on this day are completed
      const timesPerDayChores = dayChores.flatMap((chore) => {
        const timesPerDay = (chore as { timesPerDay?: number }).timesPerDay ?? 1;
        if (timesPerDay > 1) {
          return Array.from({ length: timesPerDay }, (_, slot) => ({
            choreId: `${chore.id}:${slot}`,
            date: checkDate,
          }));
        }
        return [{ choreId: chore.id, date: checkDate }];
      });

      const allDone = timesPerDayChores.every(({ choreId, date }) =>
        completions.some(
          (c) => c.childId === child.id && c.choreId === choreId && c.date === date
        )
      );

      if (!allDone) {
        // Today not done yet doesn't break streak (streak is based on completed days)
        if (i === 0) {
          // Skip today if not yet complete — streak counts previous completed days
          checkDate = addDays(checkDate, -1);
          continue;
        }
        break;
      }

      streak++;
      checkDate = addDays(checkDate, -1);
    }

    return { childId: child.id, streak };
  });

  const response: StreaksResponse = { streaks };
  return NextResponse.json(response);
}
