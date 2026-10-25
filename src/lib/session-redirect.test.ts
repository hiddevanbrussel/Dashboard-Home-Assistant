import { describe, expect, it } from "vitest";
import {
  buildLoginHref,
  detectBrowserBasePath,
  isSessionExpiredResponse,
  postLoginTarget,
  redirectToLoginOnce,
  unauthorizedLoginLocation,
  resetSessionRedirectForTests,
  safeNextPath,
  SESSION_AUTH_VALUE,
} from "./session-redirect";

describe("session redirect", () => {
  it("keeps same-origin relative paths and rejects open redirects", () => {
    expect(safeNextPath("/family")).toBe("/family");
    expect(safeNextPath("/family?tab=1#row")).toBe("/family?tab=1#row");
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath("")).toBe("/");
    expect(safeNextPath("https://evil.example/phish")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath("/%2f%2fevil.example")).toBe("/");
    expect(safeNextPath("/%5cevil.example")).toBe("/");
    expect(safeNextPath("/family%0aSet-Cookie")).toBe("/");
    expect(safeNextPath("javascript:alert(1)")).toBe("/");
    expect(safeNextPath(" /family")).toBe("/family");
  });

  it("builds a basePath-aware login URL and returns there after login", () => {
    expect(detectBrowserBasePath("/login", "")).toBe("");
    expect(buildLoginHref("/family", "?x=1", "")).toBe("/login?next=%2Ffamily%3Fx%3D1");
    expect(buildLoginHref("/login", "?next=%2Ffamily", "")).toBeNull();

    const baked = "/__ha_ingress__";
    expect(buildLoginHref("/__ha_ingress__/energy", "", baked)).toBe(
      "/__ha_ingress__/login?next=%2Fenergy"
    );
    const ingress = "/api/hassio_ingress/token";
    expect(detectBrowserBasePath(`${ingress}/rooms`, baked)).toBe(ingress);
    expect(buildLoginHref(`${ingress}/rooms`, "", baked)).toBe(`${ingress}/login?next=%2Frooms`);
    expect(buildLoginHref(`${ingress}/login`, "", baked)).toBeNull();
  });

  it("prefixes the post-login path with basePath and rejects open redirects", () => {
    const previous = process.env.NEXT_PUBLIC_BASE_PATH;
    process.env.NEXT_PUBLIC_BASE_PATH = "/__ha_ingress__";
    try {
      expect(postLoginTarget("/energy", "/__ha_ingress__/login")).toBe("/__ha_ingress__/energy");
      expect(postLoginTarget("/", "/__ha_ingress__/login")).toBe("/__ha_ingress__");
      expect(postLoginTarget("https://evil.example", "/__ha_ingress__/login")).toBe("/__ha_ingress__");
      expect(postLoginTarget("//evil.example", "/__ha_ingress__/login")).toBe("/__ha_ingress__");
      expect(postLoginTarget("/rooms", "/api/hassio_ingress/token/login")).toBe(
        "/api/hassio_ingress/token/rooms"
      );
      // #283: HA routes /api/hassio_ingress/{token}/{path}, so the ingress root keeps its slash.
      expect(postLoginTarget("/", "/api/hassio_ingress/token/login")).toBe("/api/hassio_ingress/token/");
      expect(postLoginTarget(null, "/api/hassio_ingress/token/login")).toBe("/api/hassio_ingress/token/");
      expect(postLoginTarget("/login", "/api/hassio_ingress/token/login")).toBe("/api/hassio_ingress/token/");
      expect(unauthorizedLoginLocation("http://internal/api/children")).toBe(
        "/__ha_ingress__/login?next=%2Fapi%2Fchildren"
      );
      expect(unauthorizedLoginLocation("http://internal/api/children")).not.toContain("http://internal");
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
      else process.env.NEXT_PUBLIC_BASE_PATH = previous;
    }
    expect(postLoginTarget("/energy", "/login")).toBe("/energy");
    expect(postLoginTarget("/login", "/login")).toBe("/");
    expect(unauthorizedLoginLocation("http://internal/")).toBe("/login?next=%2F");
  });

  it("redirects once on a session 401 and ignores other 401s", () => {
    expect(isSessionExpiredResponse(401, SESSION_AUTH_VALUE)).toBe(true);
    expect(isSessionExpiredResponse(401, null)).toBe(false);
    expect(isSessionExpiredResponse(403, SESSION_AUTH_VALUE)).toBe(false);

    resetSessionRedirectForTests();
    const assigned: string[] = [];
    const location = {
      pathname: "/family",
      search: "",
      assign: (href: string) => assigned.push(href),
    };
    expect(redirectToLoginOnce(location, "")).toBe(true);
    expect(redirectToLoginOnce(location, "")).toBe(false);
    expect(assigned).toEqual(["/login?next=%2Ffamily&expired=1"]);

    resetSessionRedirectForTests();
    const loginAssigned: string[] = [];
    expect(
      redirectToLoginOnce(
        {
          pathname: "/__ha_ingress__/login",
          search: "?next=%2Ffamily",
          assign: (href: string) => loginAssigned.push(href),
        },
        "/__ha_ingress__"
      )
    ).toBe(false);
    expect(loginAssigned).toEqual([]);
  });
});
