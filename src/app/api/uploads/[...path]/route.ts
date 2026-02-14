import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const name = pathSegments.join("/");
    if (!name || name.includes("..")) {
      return new NextResponse("Not found", { status: 404 });
    }
    const filePath = path.join(UPLOAD_DIR, name);
    const ext = path.extname(name).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: { "Content-Type": mime },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
