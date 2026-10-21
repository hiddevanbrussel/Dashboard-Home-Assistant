import { describe, expect, it } from "vitest";
import { ingressAuthorized, isPublicApi, isPublicPage, requestIsAuthorized, sessionAuthorized } from "./auth-policy";
import { signSession } from "./session";

const SECRET = "k7Qx-9mP2vL4nR8wT6yH3cF5bN1aZ0eD";
const INGRESS = "f".repeat(32);

function withEnv(values: Record<string, string | undefined>, fn: () => void) {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key]);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

describe("auth policy", () => {
  it("treats login and health as public and everything else as protected", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/__ha_ingress__";
    expect(isPublicPage("/login")).toBe(true);
    expect(isPublicPage("/__ha_ingress__/login")).toBe(true);
    expect(isPublicPage("/")).toBe(false);
    expect(isPublicApi("/api/health")).toBe(true);
    expect(isPublicApi("/api/ha/state")).toBe(false);
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  });

  it("honors the ingress header only inside the add-on", () => {
    const request = new Request("http://localhost/api/ha/state", {
      headers: { "x-dashboard-ingress": INGRESS },
    });
    withEnv({ HA_ADDON: undefined, INGRESS_AUTH_SECRET: INGRESS }, () => {
      expect(ingressAuthorized(request)).toBe(false);
    });
    withEnv({ HA_ADDON: "1", INGRESS_AUTH_SECRET: INGRESS }, () => {
      expect(ingressAuthorized(request)).toBe(true);
    });
    withEnv({ HA_ADDON: "1", INGRESS_AUTH_SECRET: INGRESS }, () => {
      const spoofed = new Request("http://localhost/api/ha/state", {
        headers: { "x-dashboard-ingress": "wrong-secret-value-not-the-real-one" },
      });
      expect(ingressAuthorized(spoofed)).toBe(false);
    });
  });

  it("accepts a signed session cookie", () => {
    const token = signSession(SECRET);
    const request = new Request("http://localhost/", { headers: { cookie: `dashboard_session=${token}` } });
    withEnv({ APP_SECRET: SECRET, HA_ADDON: undefined }, () => {
      expect(sessionAuthorized(request)).toBe(true);
      expect(requestIsAuthorized(request)).toBe(true);
    });
  });
});
