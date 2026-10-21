import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/require-api-auth";

export async function GET(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const hosts = (process.env.DOORBELL_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  return NextResponse.json({ hosts });
}
