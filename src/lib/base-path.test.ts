import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cssUrl, getBasePath, withBasePath } from "./base-path";

describe("base-path", () => {
  const prev = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = prev;
  });

  it("is a no-op without base path", () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    expect(getBasePath()).toBe("");
    expect(withBasePath("/uploads/a.webp")).toBe("/uploads/a.webp");
    expect(cssUrl("/uploads/a.webp")).toBe("url(/uploads/a.webp)");
  });

  it("prefixes absolute same-origin paths", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/__ha_ingress__";
    expect(withBasePath("/energy-overview-house.webp")).toBe(
      "/__ha_ingress__/energy-overview-house.webp"
    );
    expect(withBasePath("/api/immich/asset?id=1")).toBe("/__ha_ingress__/api/immich/asset?id=1");
    expect(cssUrl("/uploads/x.png")).toBe("url(/__ha_ingress__/uploads/x.png)");
  });

  it("does not double-prefix or touch external URLs", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/__ha_ingress__";
    expect(withBasePath("/__ha_ingress__/uploads/a.webp")).toBe("/__ha_ingress__/uploads/a.webp");
    expect(withBasePath("https://images.pexels.com/a.jpg")).toBe("https://images.pexels.com/a.jpg");
    expect(withBasePath("data:image/png;base64,xx")).toBe("data:image/png;base64,xx");
  });
});
