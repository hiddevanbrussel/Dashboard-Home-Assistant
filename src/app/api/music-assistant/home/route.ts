import { NextResponse } from "next/server";
import { resolveMusicAssistantBaseUrl, resolveMusicAssistantToken } from "@/lib/music-assistant-env";
import { fetchMaHome } from "@/lib/ma-home";

/**
 * POST /api/music-assistant/home
 * Loads the music homepage in one round-trip: library shelves, radio, recent, featured playlists.
 * Prefers Docker/env `MUSIC_ASSISTANT_URL` + `MUSIC_ASSISTANT_TOKEN` over client body.
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

  const { baseUrl } = resolveMusicAssistantBaseUrl({
    envUrl: process.env.MUSIC_ASSISTANT_URL,
    bodyUrl: typeof body.baseUrl === "string" ? body.baseUrl : null,
  });
  if (!baseUrl) {
    return NextResponse.json(
      { error: "baseUrl required (set MUSIC_ASSISTANT_URL or enter a URL in Settings)" },
      { status: 400 }
    );
  }

  const { token } = resolveMusicAssistantToken({
    envToken: process.env.MUSIC_ASSISTANT_TOKEN,
    bodyToken: typeof body.token === "string" ? body.token : null,
  });

  try {
    const home = await fetchMaHome({
      baseUrl,
      token,
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
