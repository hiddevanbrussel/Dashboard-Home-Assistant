import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { getMiddlewareMatchers } = require("next/dist/build/analysis/get-page-static-info") as {
  getMiddlewareMatchers: (
    matchers: string[],
    config: { basePath?: string }
  ) => { regexp: string }[];
};

/** Keep this in sync with `src/middleware.ts`. The root entry is what matches `/__ha_ingress__`. */
const MATCHERS = ["/", "/((?!_next/static|_next/image|favicon.ico).*)"];

function matches(pathname: string, basePath: string): boolean {
  const compiled = getMiddlewareMatchers(MATCHERS, { basePath });
  return compiled.some((matcher) => new RegExp(matcher.regexp).test(pathname));
}

describe("middleware matcher", () => {
  it("matches the exact add-on basePath root and login, and still matches / without a basePath", () => {
    const base = "/__ha_ingress__";
    expect(matches(`${base}`, base)).toBe(true);
    expect(matches(`${base}/`, base)).toBe(true);
    expect(matches(`${base}/login`, base)).toBe(true);
    expect(matches(`${base}/family`, base)).toBe(true);
    expect(matches("/", "")).toBe(true);
    expect(matches("/login", "")).toBe(true);
  });
});
