import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { isAllowedHaMediaUrl } from "@/lib/ha/assist";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const config = await getHaConnection();
  if (!config) return NextResponse.json({ error: "No HA connection" }, { status: 400 });

  const baseUrl = config.baseUrl.replace(/\/+$/, "");
  if (!isAllowedHaMediaUrl(baseUrl, url)) {
    return NextResponse.json({ error: "Invalid TTS URL" }, { status: 400 });
  }

  try {
    const media = new URL(url, baseUrl);
    const res = await fetch(media.toString(), {
      headers: { Authorization: `Bearer ${config.token}` },
    });
    if (!res.ok) return new NextResponse(null, { status: res.status });
    const blob = await res.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "audio/mpeg",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch TTS" }, { status: 502 });
  }
}
