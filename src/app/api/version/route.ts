import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/require-api-auth";

export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;
  return NextResponse.json({
    version: process.env.APP_VERSION ?? "dev",
  });
}
