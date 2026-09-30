/**
 * Sanitize user-uploaded SVG for safe storage and serving via `<img src>`.
 *
 * Scripts and event handlers do not run inside `<img>`, but we still strip
 * dangerous constructs so the file is safer if ever opened directly or inlined.
 * SMIL animations are preserved; CSS animations inside an external SVG loaded
 * via `<img>` often do not run in browsers (documented limitation).
 */

const MAX_SVG_BYTES = 2 * 1024 * 1024; // 2 MiB

const DANGEROUS_TAG =
  /<\s*(?:script|foreignObject|iframe|embed|object)\b/i;
const EVENT_HANDLER_ATTR = /\bon[a-z]+\s*=/i;
const JAVASCRIPT_URI = /(?:href|xlink:href|src)\s*=\s*["']?\s*javascript:/i;
const EXTERNAL_HREF =
  /(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|\/\/|file:|data:(?!image\/))/i;
const EXTERNAL_ENTITY = /<!ENTITY/i;
const XML_STYLESHEET = /<\?xml-stylesheet\b[^?]*\?>/gi;

export type SanitizeSvgResult =
  | { ok: true; svg: string }
  | { ok: false; error: string };

/** Strip MIME parameters (`image/svg+xml;charset=utf-8` → `image/svg+xml`). */
export function normalizeMimeType(type: string | null | undefined): string {
  if (!type) return "";
  return type.toLowerCase().trim().split(";")[0]?.trim() ?? "";
}

export function isSvgMimeType(type: string | null | undefined): boolean {
  const t = normalizeMimeType(type);
  return t === "image/svg+xml" || t === "image/svg";
}

export function isSvgFileName(name: string | null | undefined): boolean {
  if (!name) return false;
  return /\.svg$/i.test(name.trim());
}

/**
 * Browsers/OS often mislabel SVG uploads (`text/xml`, `text/plain`,
 * `application/octet-stream`, empty, or `image/svg+xml;charset=utf-8`).
 * Prefer filename + SVG MIME; content is validated by sanitizeSvgBuffer.
 */
export function isSvgUploadCandidate(
  name: string | null | undefined,
  type: string | null | undefined
): boolean {
  if (isSvgMimeType(type)) return true;
  return isSvgFileName(name);
}

export function sanitizeSvgBuffer(buffer: Buffer): SanitizeSvgResult {
  if (buffer.byteLength === 0) {
    return { ok: false, error: "Empty SVG file." };
  }
  if (buffer.byteLength > MAX_SVG_BYTES) {
    return { ok: false, error: "SVG is too large (max 2 MB)." };
  }

  let text: string;
  try {
    text = buffer.toString("utf8");
  } catch {
    return { ok: false, error: "SVG must be valid UTF-8 text." };
  }

  // Strip BOM
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  // Illustrator / design tools sometimes inject xml-stylesheet PIs — drop them.
  let trimmed = text.trim().replace(XML_STYLESHEET, "").trim();

  if (!/<svg\b/i.test(trimmed)) {
    return { ok: false, error: "File does not look like an SVG." };
  }

  if (EXTERNAL_ENTITY.test(trimmed)) {
    return { ok: false, error: "SVG with external entities is not allowed." };
  }
  if (DANGEROUS_TAG.test(trimmed)) {
    return {
      ok: false,
      error: "SVG contains disallowed elements (script, foreignObject, iframe, embed, or object).",
    };
  }
  if (EVENT_HANDLER_ATTR.test(trimmed)) {
    return { ok: false, error: "SVG with event handler attributes is not allowed." };
  }
  if (JAVASCRIPT_URI.test(trimmed)) {
    return { ok: false, error: "SVG with javascript: URLs is not allowed." };
  }
  if (EXTERNAL_HREF.test(trimmed)) {
    return { ok: false, error: "SVG with external or non-image data URLs is not allowed." };
  }

  return { ok: true, svg: trimmed };
}
