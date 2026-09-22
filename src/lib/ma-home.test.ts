import { describe, expect, it } from "vitest";
import { featuredPlaylistIds, maHomeJobs } from "./ma-home";

describe("ma home jobs", () => {
  it("loads shelves in one parallel batch and skips disabled sections", () => {
    const jobs = maHomeJobs({
      featuredPlaylistIds: ["30", ""],
      includeRadio: false,
      includeRecent: true,
    });
    expect(featuredPlaylistIds(["30", "  ", "12"])).toEqual(["30", "12"]);
    expect(jobs.map((job) => job.command)).toEqual([
      "music/albums/library_items",
      "music/artists/library_items",
      "music/playlists/library_items",
      "music/recently_played_items",
      "music/playlists/get",
      "music/playlists/playlist_tracks",
    ]);
    expect(jobs[0].args).toMatchObject({ order_by: "timestamp_added_desc" });
    expect(jobs.some((job) => job.command === "music/radios/library_items")).toBe(false);
  });
});
