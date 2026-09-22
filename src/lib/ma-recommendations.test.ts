import { describe, expect, it } from "vitest";
import {
  isStationsForYouFolder,
  parseRecommendationFolders,
  pickStationsForYouFolder,
  stationsRequestArgs,
} from "./ma-recommendations";

describe("ma recommendations", () => {
  it("finds the Apple Music Stations for You folder", () => {
    const folders = parseRecommendationFolders({
      result: [
        { name: "Made for You", item_id: "made_for_you", provider: "apple_music--1" },
        { name: "Stations for You", item_id: "stations_for_you", provider: "apple_music--1", items: [{ name: "Discovery Station" }] },
      ],
    });
    const folder = pickStationsForYouFolder(folders);
    expect(folder?.item_id).toBe("stations_for_you");
    expect(isStationsForYouFolder(folder!)).toBe(true);
    expect(stationsRequestArgs(folder)).toEqual({ provider: "apple_music--1", item_id: "stations_for_you" });
  });

  it("falls back to the stable Apple Music slug", () => {
    expect(stationsRequestArgs(null)).toEqual({ provider: "apple_music", item_id: "stations_for_you" });
  });
});
