import { describe, expect, it } from "vitest";
import {
  isSvgFileName,
  isSvgMimeType,
  sanitizeSvgBuffer,
} from "@/lib/sanitize-svg";

describe("sanitizeSvgBuffer", () => {
  it("accepts a simple animated SMIL SVG", () => {
    const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#22c55e">
    <animate attributeName="r" values="20;40;20" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.svg).toContain("<animate");
  });

  it("allows internal <use> fragment references", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <defs><circle id="c" r="4"/></defs>
  <use href="#c" x="5" y="5"/>
</svg>`;
    expect(sanitizeSvgBuffer(Buffer.from(svg, "utf8")).ok).toBe(true);
  });

  it("rejects script tags", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects onload handlers", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="10" height="10"/></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects javascript: hrefs", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><text>x</text></a></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects external hrefs", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><use href="https://evil.example/x.svg#g"/></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects foreignObject", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">x</div></foreignObject></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects non-svg content", () => {
    const result = sanitizeSvgBuffer(Buffer.from("<html><body>nope</body></html>", "utf8"));
    expect(result.ok).toBe(false);
  });
});

describe("svg helpers", () => {
  it("detects mime and filename", () => {
    expect(isSvgMimeType("image/svg+xml")).toBe(true);
    expect(isSvgMimeType("image/svg")).toBe(true);
    expect(isSvgMimeType("image/png")).toBe(false);
    expect(isSvgFileName("bg.svg")).toBe(true);
    expect(isSvgFileName("bg.SVG")).toBe(true);
    expect(isSvgFileName("bg.png")).toBe(false);
  });
});
