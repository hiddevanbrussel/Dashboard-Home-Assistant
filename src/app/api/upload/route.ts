import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 90;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file selected." },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only images (JPEG, PNG, WebP, GIF) are allowed." },
        { status: 400 }
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const isGif = file.type === "image/gif";

    let outputBuffer: Buffer;
    let ext: string;

    if (isGif) {
      outputBuffer = buffer;
      ext = ".gif";
    } else {
      const meta = await sharp(buffer).metadata();
      const hasAlpha = meta.hasAlpha === true;
      const isPng = file.type === "image/png";

      let pipeline = sharp(buffer)
        .rotate()
        .resize(MAX_WIDTH, undefined, { withoutEnlargement: true });

      if (isPng && hasAlpha) {
        outputBuffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
        ext = ".png";
      } else {
        outputBuffer = await pipeline.jpeg({ quality: JPEG_QUALITY }).toBuffer();
        ext = ".jpg";
      }
    }

    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_DIR, name);
    await writeFile(filePath, outputBuffer);
    const url = `/uploads/${name}`;
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 }
    );
  }
}
