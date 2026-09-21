/**
 * Client-side helper to call the Music Assistant API via our proxy.
 */
export type MusicAssistantHomePayload = {
  albums: unknown[];
  artists: unknown[];
  playlists: unknown[];
  radios: unknown[];
  recent: unknown[];
  featured: { id: string; playlist: Record<string, unknown> | null; tracks: unknown[] }[];
};

export async function callMusicAssistant(
  baseUrl: string,
  token: string,
  command: string,
  args: Record<string, unknown> = {},
  options: { skipCache?: boolean } = {}
): Promise<unknown> {
  const res = await fetch("/api/music-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ baseUrl, token, command, args, skipCache: options.skipCache === true }),
  });
  const text = await res.text();
  const data = (() => {
    try {
      if (!text.trim()) return {};
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {};
    }
  })();
  if (!res.ok) {
    const err =
      (typeof (data as { error?: string }).error === "string" ? (data as { error: string }).error : null) ??
      (text.length > 0 && text.length < 400 ? text : `Request failed (${res.status})`);
    return { error: err };
  }
  return data;
}

export async function fetchMusicAssistantHome(input: {
  baseUrl: string;
  token: string;
  featuredPlaylistIds?: string[];
  includeRadio?: boolean;
  includeRecent?: boolean;
}): Promise<MusicAssistantHomePayload | { error: string }> {
  const res = await fetch("/api/music-assistant/home", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const text = await res.text();
  const data = (() => {
    try {
      if (!text.trim()) return {} as Record<string, unknown>;
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {} as Record<string, unknown>;
    }
  })();
  if (!res.ok) {
    const err =
      (typeof data.error === "string" ? data.error : null) ??
      (text.length > 0 && text.length < 400 ? text : `Request failed (${res.status})`);
    return { error: err };
  }
  return {
    albums: Array.isArray(data.albums) ? data.albums : [],
    artists: Array.isArray(data.artists) ? data.artists : [],
    playlists: Array.isArray(data.playlists) ? data.playlists : [],
    radios: Array.isArray(data.radios) ? data.radios : [],
    recent: Array.isArray(data.recent) ? data.recent : [],
    featured: Array.isArray(data.featured) ? data.featured : [],
  };
}
