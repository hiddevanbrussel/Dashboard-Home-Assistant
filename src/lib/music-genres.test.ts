import { describe, expect, it } from "vitest";
import {
  albumMatchesGenre,
  genreStyleFor,
  mergeHomeGenres,
  parseMaGenres,
} from "./music-genres";

describe("music genres", () => {
  it("reads Music Assistant genre library items", () => {
    expect(
      parseMaGenres([
        { name: "Pop", item_id: 4, uri: "library://genre/4" },
        { name: "Rock", uri: "library://genre/9" },
        { name: "pop" },
      ])
    ).toEqual([
      { key: "pop", name: "Pop", itemId: "4" },
      { key: "rock", name: "Rock", itemId: "9" },
    ]);
  });

  it("falls back to album metadata when the genre library is empty", () => {
    const genres = mergeHomeGenres([], [
      { name: "A", metadata: { genres: ["Jazz", "Soul"] } },
      { name: "B", genres: [{ name: "Jazz" }] },
    ]);
    expect(genres.map((g) => g.key)).toEqual(["jazz", "soul"]);
  });

  it("matches albums to a derived genre", () => {
    const jazz = { key: "jazz", name: "Jazz" };
    expect(albumMatchesGenre({ metadata: { genres: ["Jazz"] } }, jazz)).toBe(true);
    expect(albumMatchesGenre({ genres: ["Rock"] }, jazz)).toBe(false);
  });

  it("picks icons styles for common genre names", () => {
    expect(genreStyleFor("singer-songwriter")).toBe("songwriter");
    expect(genreStyleFor("house")).toBe("dance");
    expect(genreStyleFor("klassiek")).toBe("classical");
  });
});
