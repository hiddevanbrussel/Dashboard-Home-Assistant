import { NextResponse } from "next/server";
import { fetchMaHome } from "@/lib/ma-home";

/**
 * POST /api/music-assistant/home
 * Loads the music homepage in one round-trip: library shelves, radio, recent, featured playlists.
 */
export async function POST(request: Request) {
  let body: {
    baseUrl?: string;
    token?: string;
    featuredPlaylistIds?: string[];
    includeRadio?: boolean;
    includeRecent?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const baseUrl = typeof body.baseUrl === "string" ? body.baseUrl.replace(/\/+$/, "") : "";
  if (!baseUrl) {
    return NextResponse.json({ error: "baseUrl required" }, { status: 400 });
  }

  try {
    const home = await fetchMaHome({
      baseUrl,
      token: typeof body.token === "string" ? body.token : "",
      featuredPlaylistIds: body.featuredPlaylistIds,
      includeRadio: body.includeRadio,
      includeRecent: body.includeRecent,
    });
    return NextResponse.json(home);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reach Music Assistant";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
