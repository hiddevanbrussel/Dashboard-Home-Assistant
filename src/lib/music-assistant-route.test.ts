import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/music-assistant/route";
import { boundMusicAssistant } from "@/lib/bound-integration";
import { callMaServer } from "@/lib/ma-server";
import { MUSIC_ASSISTANT_ALLOWED_COMMANDS } from "@/lib/music-assistant-commands";
import { SESSION_COOKIE, signSession } from "@/lib/session";

vi.mock("@/lib/ma-server", () => ({
  callMaServer: vi.fn(),
}));

vi.mock("@/lib/bound-integration", () => ({
  boundMusicAssistant: vi.fn(),
}));

const SECRET = "k7Qx-9mP2vL4nR8wT6yH3cF5bN1aZ0eD";
const TOKEN = "ma-token-do-not-log-9f3c";
const HEADER_SECRET = "header-bearer-do-not-log-77aa";
const ARGS_SECRET = "args-password-do-not-log";
const SERVER_TOKEN = "server-side-token";
const BASE_URL = "http://ma.local:8095";

const ALLOWED = [
  "music/albums/album_tracks",
  "music/albums/get",
  "music/artists/artist_albums",
  "music/artists/artist_tracks",
  "music/artists/top_tracks",
  "music/favorites/add_item",
  "music/playlists/add_playlist_tracks",
  "music/playlists/library_items",
  "music/podcasts/library_items",
  "music/podcasts/podcast_episodes",
  "music/recently_played_items",
  "music/search",
  "player_queues/all",
  "player_queues/dont_stop_the_music",
  "player_queues/get",
  "player_queues/next",
  "player_queues/pause",
  "player_queues/play",
  "player_queues/play_media",
  "player_queues/previous",
  "player_queues/seek",
  "player_queues/shuffle",
  "players/cmd/volume_down",
  "players/cmd/volume_mute",
  "players/cmd/volume_set",
  "players/cmd/volume_up",
  "search",
] as const;

function sessionCookie(): string {
  return `${SESSION_COOKIE}=${signSession(SECRET)}`;
}

function post(body: unknown, init?: { cookie?: string; raw?: boolean }) {
  const raw = init?.raw === true;
  return POST(
    new Request("http://dashboard.local/api/music-assistant", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${HEADER_SECRET}`,
        cookie: init?.cookie ?? sessionCookie(),
      },
      body: raw ? String(body) : JSON.stringify(body),
    })
  );
}

function clientBody(command: unknown, extra: Record<string, unknown> = {}) {
  return {
    baseUrl: BASE_URL,
    url: `http://user:${TOKEN}@ma.local:8095`,
    token: TOKEN,
    command,
    args: { queue_id: "queue-1", password: ARGS_SECRET },
    ...extra,
  };
}

describe("music assistant command allowlist", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.env.APP_SECRET = SECRET;
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(callMaServer).mockReset();
    vi.mocked(callMaServer).mockResolvedValue({ result: { ok: true } });
    vi.mocked(boundMusicAssistant).mockReset();
    vi.mocked(boundMusicAssistant).mockResolvedValue({
      ok: true,
      target: { baseUrl: BASE_URL, secret: SERVER_TOKEN },
    });
  });

  afterEach(() => {
    delete process.env.APP_SECRET;
    warn.mockRestore();
  });

  it("exports exactly the commands the route may forward", () => {
    expect([...MUSIC_ASSISTANT_ALLOWED_COMMANDS]).toEqual([...ALLOWED]);
    for (const command of ALLOWED) {
      expect(command).toBe(command.trim());
      expect(command).toBe(command.toLowerCase());
      expect(command.includes("config/")).toBe(false);
    }
  });

  it.each(ALLOWED)("forwards %s", async (command) => {
    const res = await post(clientBody(command));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ result: { ok: true } });
    expect(callMaServer).toHaveBeenCalledTimes(1);
    expect(callMaServer).toHaveBeenCalledWith(BASE_URL, SERVER_TOKEN, command, expect.any(Object), {
      skipCache: false,
    });
    expect(warn).not.toHaveBeenCalled();
    expect(JSON.stringify(warn.mock.calls)).not.toContain(TOKEN);
    expect(JSON.stringify(warn.mock.calls)).not.toContain(HEADER_SECRET);
    expect(JSON.stringify(warn.mock.calls)).not.toContain(ARGS_SECRET);
  });

  it("forwards args and skipCache for an allowed play command", async () => {
    const res = await post(
      clientBody("player_queues/play_media", {
        args: { queue_id: "living-room", media: "library://track/1" },
        skipCache: true,
      })
    );
    expect(res.status).toBe(200);
    expect(callMaServer).toHaveBeenCalledWith(
      BASE_URL,
      SERVER_TOKEN,
      "player_queues/play_media",
      { queue_id: "living-room", media: "library://track/1" },
      { skipCache: true }
    );
  });

  it.each([
    ["config/players/get", { command: "config/players/get" }, '"config/players/get"'],
    ["config/players/save", { command: "config/players/save" }, '"config/players/save"'],
    ["config/players", { command: "config/players" }, '"config/players"'],
    ["config/core/save", { command: "config/core/save" }, '"config/core/save"'],
    ["config/", { command: "config/" }, '"config/"'],
    ["unknown players/remove", { command: "players/remove" }, '"players/remove"'],
    ["unknown path traversal", { command: "player_queues/play/../../config/core/save" }, '"player_queues/play/../../config/core/save"'],
    ["empty command", { command: "" }, '""'],
    ["whitespace command", { command: "   " }, '"   "'],
    ["missing command", {}, "<non-string>"],
    ["null command", { command: null }, "<non-string>"],
    ["numeric command", { command: 0 }, "<non-string>"],
    ["boolean command", { command: false }, "<non-string>"],
    ["array command", { command: ["player_queues/play"] }, "<non-string>"],
    ["object command", { command: { name: "config/players/save", token: TOKEN } }, "<non-string>"],
  ] as const)("rejects %s with 403", async (_name, fields, logged) => {
    const res = await post({
      baseUrl: BASE_URL,
      url: `http://user:${TOKEN}@ma.local:8095`,
      token: TOKEN,
      args: { queue_id: "queue-1", password: ARGS_SECRET },
      ...fields,
    });
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Command not allowed" });
    expect(callMaServer).not.toHaveBeenCalled();
    expect(boundMusicAssistant).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    const line = String(warn.mock.calls[0]?.[0]);
    expect(line).toBe(`[music-assistant] rejected command: ${logged}`);
    expect(line).not.toContain(TOKEN);
    expect(line).not.toContain(HEADER_SECRET);
    expect(line).not.toContain(ARGS_SECRET);
    expect(line).not.toContain(SERVER_TOKEN);
    expect(line).not.toContain("Bearer");
    expect(line).not.toContain("authorization");
  });

  it.each([
    "CONFIG/players/get",
    "Config/Players/Get",
    " config/players/get",
    "config/players/get ",
    "config/players/get\n",
    "config/players/get\t",
    "PLAYER_QUEUES/PLAY",
    "Player_Queues/Play",
    " player_queues/play",
    "player_queues/play ",
    "player_queues/play\n",
    "player_queues/ play",
    "player_queues/play\u0000",
    "Music/Search",
    " search",
  ])("rejects case or whitespace trick %j with 403", async (command) => {
    const res = await post(clientBody(command));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Command not allowed" });
    expect(callMaServer).not.toHaveBeenCalled();
    const line = String(warn.mock.calls[0]?.[0]);
    expect(line.startsWith("[music-assistant] rejected command: ")).toBe(true);
    expect(line).not.toContain(TOKEN);
    expect(line).not.toContain(HEADER_SECRET);
    expect(line).not.toContain(ARGS_SECRET);
  });

  it.each([null, [], "config/players/get", 123] as const)(
    "rejects malformed JSON value %j with 403",
    async (body) => {
      const res = await post(body);
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: "Command not allowed" });
      expect(callMaServer).not.toHaveBeenCalled();
      expect(String(warn.mock.calls[0]?.[0])).toBe("[music-assistant] rejected command: <non-string>");
    }
  );

  it("redacts a token stuffed into the command and does not log headers or args", async () => {
    const res = await post(clientBody(`config/${TOKEN}/save`));
    expect(res.status).toBe(403);
    const line = String(warn.mock.calls[0]?.[0]);
    expect(line).toBe('[music-assistant] rejected command: "config/[redacted]/save"');
    expect(line).not.toContain(TOKEN);
    expect(line).not.toContain(HEADER_SECRET);
    expect(line).not.toContain(ARGS_SECRET);
    expect(line).not.toContain("Bearer");
  });

  it("returns 400 for unparseable JSON and does not forward or log the body", async () => {
    const res = await post(`{"token":"${TOKEN}","command":`, { raw: true });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON" });
    expect(callMaServer).not.toHaveBeenCalled();
    expect(boundMusicAssistant).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("requires a session before the allowlist and does not log the body", async () => {
    const res = await post(clientBody("config/players/save"), { cookie: "" });
    expect(res.status).toBe(401);
    expect(callMaServer).not.toHaveBeenCalled();
    expect(boundMusicAssistant).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});
