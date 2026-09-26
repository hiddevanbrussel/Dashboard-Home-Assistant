import { describe, it, expect, afterEach } from "vitest";
import {
  buildAuthorizeUrl,
  decodeOAuthState,
  encodeOAuthState,
  getAppClientId,
  getOAuthRedirectUri,
  sanitizeReturnTo,
} from "./oauth";

describe("ha/oauth", () => {
  const prevBase = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    if (prevBase === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = prevBase;
  });

  it("builds authorize URL with IndieAuth params", () => {
    const url = buildAuthorizeUrl({
      haBaseUrl: "http://homeassistant.local:8123/",
      clientId: "http://dashboard.local:3000",
      redirectUri: "http://dashboard.local:3000/api/ha/oauth/callback",
      state: "abc",
    });
    expect(url.startsWith("http://homeassistant.local:8123/auth/authorize?")).toBe(true);
    const q = new URL(url).searchParams;
    expect(q.get("client_id")).toBe("http://dashboard.local:3000");
    expect(q.get("redirect_uri")).toBe("http://dashboard.local:3000/api/ha/oauth/callback");
    expect(q.get("state")).toBe("abc");
  });

  it("round-trips oauth state", () => {
    const encoded = encodeOAuthState({
      n: "nonce",
      ha: "http://ha.local:8123",
      ret: "/onboarding",
    });
    expect(decodeOAuthState(encoded)).toEqual({
      n: "nonce",
      ha: "http://ha.local:8123",
      ret: "/onboarding",
    });
    expect(decodeOAuthState("!!!")).toBeNull();
  });

  it("sanitizes returnTo to same-origin paths", () => {
    expect(sanitizeReturnTo("/onboarding")).toBe("/onboarding");
    expect(sanitizeReturnTo("/settings?x=1")).toBe("/settings?x=1");
    expect(sanitizeReturnTo("https://evil.com")).toBe("/onboarding");
    expect(sanitizeReturnTo("//evil.com")).toBe("/onboarding");
    expect(sanitizeReturnTo(null)).toBe("/onboarding");
  });

  it("derives client id from forwarded headers and base path", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/__ha_ingress__";
    const req = new Request("http://127.0.0.1:3000/api/ha/oauth/start", {
      headers: {
        "x-forwarded-proto": "https",
        "x-forwarded-host": "ha.example.com",
      },
    });
    const clientId = getAppClientId(req);
    expect(clientId).toBe("https://ha.example.com/__ha_ingress__");
    expect(getOAuthRedirectUri(clientId)).toBe(
      "https://ha.example.com/__ha_ingress__/api/ha/oauth/callback"
    );
  });
});
