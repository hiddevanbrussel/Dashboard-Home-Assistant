import { describe, expect, it } from "vitest";
import {
  isSvgFileName,
  isSvgMimeType,
  isSvgUploadCandidate,
  sanitizeSvgBuffer,
} from "@/lib/sanitize-svg";

describe("sanitizeSvgBuffer", () => {
  it("accepts a simple animated SMIL SVG", () => {
    const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#0ea5e9">
    <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.svg).toContain("<animate");
  });

  it("accepts CSS style blocks and fragment use hrefs", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <style>.a{fill:red}</style>
  <defs><g id="g"><rect width="10" height="10" class="a"/></g></defs>
  <use href="#g"/>
</svg>`;
    expect(sanitizeSvgBuffer(Buffer.from(svg, "utf8")).ok).toBe(true);
  });

  it("strips xml-stylesheet processing instructions instead of rejecting", () => {
    const svg = `<?xml version="1.0"?>
<?xml-stylesheet type="text/css" href="style.css"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.svg).not.toContain("xml-stylesheet");
  });

  it("rejects script tags", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects event handler attributes", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="10" height="10"/></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects javascript: URLs", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><text>x</text></a></svg>`;
    const result = sanitizeSvgBuffer(Buffer.from(svg, "utf8"));
    expect(result.ok).toBe(false);
  });

  it("rejects external use hrefs", () => {
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
  it("detects mime including charset parameters", () => {
    expect(isSvgMimeType("image/svg+xml")).toBe(true);
    expect(isSvgMimeType("image/svg")).toBe(true);
    expect(isSvgMimeType("image/svg+xml;charset=utf-8")).toBe(true);
    expect(isSvgMimeType("image/svg+xml; charset=utf-8")).toBe(true);
    expect(isSvgMimeType("IMAGE/SVG+XML")).toBe(true);
    expect(isSvgMimeType("image/png")).toBe(false);
    expect(isSvgFileName("bg.svg")).toBe(true);
    expect(isSvgFileName("bg.SVG")).toBe(true);
    expect(isSvgFileName("bg.png")).toBe(false);
  });

  it("treats .svg filename as upload candidate regardless of mislabeled MIME", () => {
    expect(isSvgUploadCandidate("bg.svg", "image/svg+xml")).toBe(true);
    expect(isSvgUploadCandidate("bg.svg", "image/svg+xml;charset=utf-8")).toBe(true);
    expect(isSvgUploadCandidate("bg.svg", "text/xml")).toBe(true);
    expect(isSvgUploadCandidate("bg.svg", "application/xml")).toBe(true);
    expect(isSvgUploadCandidate("bg.svg", "text/plain")).toBe(true);
    expect(isSvgUploadCandidate("bg.svg", "application/octet-stream")).toBe(true);
    expect(isSvgUploadCandidate("bg.svg", "")).toBe(true);
    expect(isSvgUploadCandidate("bg.svg", null)).toBe(true);
    expect(isSvgUploadCandidate("bg.png", "text/xml")).toBe(false);
    expect(isSvgUploadCandidate("background", "image/svg+xml")).toBe(true);
  });
});
