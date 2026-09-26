import { describe, it, expect } from "vitest";
import {
  buildOAuthBundle,
  encodeOAuthBundle,
  oauthAccessNeedsRefresh,
  tryParseOAuthBundle,
} from "./oauth-token";

describe("ha/oauth-token", () => {
  it("round-trips oauth bundles", () => {
    const bundle = buildOAuthBundle({
      refreshToken: "ref",
      clientId: "http://app.local:3000",
      accessToken: "acc",
      expiresInSec: 1800,
      nowMs: 1_000_000,
    });
    const encoded = encodeOAuthBundle(bundle);
    expect(encoded.startsWith("oauth1:")).toBe(true);
    expect(tryParseOAuthBundle(encoded)).toEqual(bundle);
    expect(tryParseOAuthBundle("plain-llat")).toBeNull();
  });

  it("marks near-expiry access tokens as needing refresh", () => {
    const bundle = buildOAuthBundle({
      refreshToken: "ref",
      clientId: "http://app.local",
      accessToken: "acc",
      expiresInSec: 120,
      nowMs: 0,
    });
    // expires_at = 120000 - 60000 = 60000
    expect(oauthAccessNeedsRefresh(bundle, 59_000)).toBe(false);
    expect(oauthAccessNeedsRefresh(bundle, 60_000)).toBe(true);
  });
});
