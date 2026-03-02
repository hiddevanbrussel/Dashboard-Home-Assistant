import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: process.env.APP_VERSION ?? "dev",
  });
}
