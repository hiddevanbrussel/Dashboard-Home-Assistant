import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { resolveUploadFile } from "@/lib/upload-path";
import { requireApiAuth } from "@/lib/require-api-auth";

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const denied = await requireApiAuth(_request);
  if (denied) return denied;
  try {
    const { path: pathSegments } = await params;
    const name = pathSegments.length === 1 ? pathSegments[0] : "";
    const filePath = name ? resolveUploadFile(UPLOAD_DIR, name) : null;
    if (!filePath) {
      return new NextResponse("Not found", { status: 404 });
    }
    const ext = path.extname(name).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    const buffer = await readFile(filePath);
    const headers: Record<string, string> = {
      "Content-Type": mime,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    };
    if (ext === ".svg") {
      headers["Content-Security-Policy"] = "sandbox; default-src 'none'; style-src 'unsafe-inline'";
    }
    return new NextResponse(buffer, { headers });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
