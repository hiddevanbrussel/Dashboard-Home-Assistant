import { describe, expect, it } from "vitest";
import { readCookie, safeEqual, signSession, verifySession } from "./session";

const SECRET = "session-signing-secret-value-32b";

describe("session cookies", () => {
  it("accepts a token it just signed", () => {
    const now = 1_700_000_000_000;
    const token = signSession(SECRET, now);
    expect(verifySession(token, SECRET, now + 1000)).toBe(true);
  });

  it("rejects a tampered token, the wrong secret, and an expired token", () => {
    const now = 1_700_000_000_000;
    const token = signSession(SECRET, now);
    expect(verifySession(`${token}x`, SECRET, now)).toBe(false);
    expect(verifySession(token, `${SECRET}-other`, now)).toBe(false);
    expect(verifySession(token, SECRET, now + 1000 * 60 * 60 * 24 * 91)).toBe(false);
  });

  it("compares unequal strings without throwing", () => {
    expect(safeEqual("a", "ab")).toBe(false);
    expect(safeEqual("same", "same")).toBe(true);
  });

  it("reads one cookie from a header", () => {
    expect(readCookie("a=1; dashboard_session=abc%2Edef; b=2", "dashboard_session")).toBe("abc.def");
    expect(readCookie(null, "dashboard_session")).toBe("");
  });
});
