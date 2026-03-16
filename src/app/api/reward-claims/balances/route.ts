import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { BalancesResponse } from "@/lib/chores-types";

function parseChildIds(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const [children, chores, completions, claims] = await Promise.all([
    prisma.child.findMany({ orderBy: { order: "asc" } }),
    prisma.chore.findMany(),
    prisma.choreCompletion.findMany(),
    prisma.rewardClaim.findMany(),
  ]);

  const balances = children.map((child) => {
    // All-time earned: sum of points for each completion (use stored points; fallback to chore for old records)
    let earned = 0;
    for (const comp of completions.filter((c) => c.childId === child.id)) {
      const baseId = comp.choreId.includes(":")
        ? comp.choreId.slice(0, comp.choreId.lastIndexOf(":"))
        : comp.choreId;
      const chore = chores.find((c) => c.id === baseId);
      // If chore was deleted, use stored points only
      const pts = typeof comp.points === "number" && comp.points > 0
        ? comp.points
        : chore?.points ?? 0;
      if (chore) {
        const ids = parseChildIds(chore.childIds);
        if (ids !== null && !ids.includes(child.id)) continue;
      }
      earned += pts;
    }

    // All-time spent
    const spent = claims
      .filter((cl) => cl.childId === child.id)
      .reduce((sum, cl) => sum + cl.pointsSpent, 0);

    return {
      childId: child.id,
      earned,
      spent,
      balance: earned - spent,
    };
  });

  const response: BalancesResponse = { balances };
  return NextResponse.json(response);
}
