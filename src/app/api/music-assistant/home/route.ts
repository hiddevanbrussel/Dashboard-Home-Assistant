import { NextResponse } from "next/server";
import { boundMusicAssistant } from "@/lib/bound-integration";
import { fetchMaHome } from "@/lib/ma-home";
import { requireApiAuth } from "@/lib/require-api-auth";

/**
 * POST /api/music-assistant/home
 * Loads the music homepage in one round-trip: library shelves, radio, recent, featured playlists.
 * Prefers Docker/env `MUSIC_ASSISTANT_URL` + `MUSIC_ASSISTANT_TOKEN` over client body.
 */
export async function POST(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
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

  const bound = await boundMusicAssistant({
    baseUrl: typeof body.baseUrl === "string" ? body.baseUrl : null,
    token: typeof body.token === "string" ? body.token : null,
  });
  if (!bound.ok) {
    return NextResponse.json({ error: bound.error }, { status: 400 });
  }
  const { baseUrl, secret: token } = bound.target;

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
