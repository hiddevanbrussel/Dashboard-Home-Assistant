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
    // All-time earned: sum of points for each completion
    let earned = 0;
    for (const comp of completions.filter((c) => c.childId === child.id)) {
      // Find the base choreId (strip slot suffix)
      const baseId = comp.choreId.includes(":")
        ? comp.choreId.slice(0, comp.choreId.lastIndexOf(":"))
        : comp.choreId;
      const chore = chores.find((c) => c.id === baseId);
      if (!chore) continue;
      // Only count if chore applies to this child
      const ids = parseChildIds(chore.childIds);
      if (ids !== null && !ids.includes(child.id)) continue;
      earned += chore.points;
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
