import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

const MAX_DURATION_MS = 5 * 60 * 1000; // 5 min

export const maxDuration = 300; // 5 min for build

function getExecErrorOutput(e: unknown): string {
  const err = e instanceof Error ? e.message : String(e);
  if (e && typeof e === "object" && "stderr" in e) {
    const stderr = (e as { stderr?: Buffer }).stderr;
    if (typeof stderr === "object" && stderr && "toString" in stderr)
      return (stderr as Buffer).toString("utf8") ?? err;
    if (typeof stderr === "string") return stderr;
  }
  return err;
}

/**
 * POST /api/admin/update
 * Body: { passcode: string }
 * Runs git pull, npm ci, npm run build. Protected by env UPDATE_PASSCODE.
 * Set UPDATE_PASSCODE in .env (or deployment env) to enable.
 */
export async function POST(request: Request) {
  const expected = process.env.UPDATE_PASSCODE;
  if (!expected || typeof expected !== "string" || !expected.trim()) {
    return NextResponse.json(
      { ok: false, error: "update_not_configured" },
      { status: 503 }
    );
  }

  let body: { passcode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 }
    );
  }

  const passcode = typeof body.passcode === "string" ? body.passcode.trim() : "";
  if (passcode !== expected) {
    return NextResponse.json(
      { ok: false, error: "wrong_passcode" },
      { status: 403 }
    );
  }

  const root = path.resolve(process.cwd());
  const steps: { step: string; output: string; error?: string }[] = [];

  try {
    try {
      const out = execSync("git pull", {
        cwd: root,
        encoding: "utf8",
        timeout: 60000,
      });
      steps.push({ step: "git pull", output: out.trim() || "(ok)" });
    } catch (e) {
      const out = getExecErrorOutput(e);
      steps.push({ step: "git pull", output: out, error: "failed" });
      return NextResponse.json({ ok: false, steps }, { status: 200 });
    }

    try {
      const out = execSync("npm ci", {
        cwd: root,
        encoding: "utf8",
        timeout: 120000,
        env: { ...process.env, CI: "1" },
      });
      steps.push({ step: "npm ci", output: out.trim() ? out.trim().slice(-500) : "(ok)" });
    } catch (e) {
      const out = getExecErrorOutput(e).slice(-800);
      steps.push({ step: "npm ci", output: out, error: "failed" });
      return NextResponse.json({ ok: false, steps }, { status: 200 });
    }

    try {
      const out = execSync("npm run build", {
        cwd: root,
        encoding: "utf8",
        timeout: MAX_DURATION_MS - 60000,
        env: process.env,
      });
      steps.push({ step: "npm run build", output: out.trim() ? out.trim().slice(-800) : "(ok)" });
    } catch (e) {
      const out = getExecErrorOutput(e).slice(-1000);
      steps.push({ step: "npm run build", output: out, error: "failed" });
      return NextResponse.json({ ok: false, steps }, { status: 200 });
    }

    return NextResponse.json({ ok: true, steps });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { ok: false, error: "update_failed", message: err },
      { status: 500 }
    );
  }
}
