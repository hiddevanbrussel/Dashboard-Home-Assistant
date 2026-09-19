import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { runAssistAudio, runAssistText } from "@/lib/ha/assist";

const MAX_AUDIO_BYTES = 16_000 * 2 * 15;

export async function POST(request: Request) {
  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/octet-stream")) {
      const pcm = Buffer.from(await request.arrayBuffer());
      if (!pcm.length) return NextResponse.json({ error: "Empty audio" }, { status: 400 });
      if (pcm.length > MAX_AUDIO_BYTES) {
        return NextResponse.json({ error: "Audio too long" }, { status: 413 });
      }
      const sampleRate = Number(request.headers.get("x-sample-rate") ?? "16000");
      const pipeline = request.headers.get("x-assist-pipeline");
      const conversationId = request.headers.get("x-assist-conversation");
      const result = await runAssistAudio(config, {
        pcm,
        sampleRate: Number.isFinite(sampleRate) ? sampleRate : 16000,
        pipeline,
        conversationId,
      });
      return NextResponse.json(result);
    }

    let body: { text?: string; pipeline?: string; conversationId?: string } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const text = typeof body.text === "string" ? body.text : "";
    if (!text.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });
    const result = await runAssistText(config, {
      text,
      pipeline: body.pipeline,
      conversationId: body.conversationId,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Assist pipeline failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
