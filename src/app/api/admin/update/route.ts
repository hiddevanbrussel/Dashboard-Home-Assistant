import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import { clearLoginFailures, loginAllowed, recordLoginFailure } from "@/lib/login-rate-limit";
import { safeEqual } from "@/lib/session";
import { requireApiAuth } from "@/lib/require-api-auth";

const MIN_PASSCODE = 20;

export const maxDuration = 300;

function run(cmd: string, args: string[], cwd: string, timeout: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, shell: false, stdio: "ignore" });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeout);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve(code ?? 1);
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/**
 * POST /api/admin/update
 * Body: { passcode: string }
 * Runs git pull, npm ci, npm run build when UPDATE_PASSCODE is a long random value.
 * Command output is not returned.
 */
export async function POST(request: Request) {
  const denied = await requireApiAuth(request);
  if (denied) return denied;
  const expected = (process.env.UPDATE_PASSCODE ?? "").trim();
  if (expected.length < MIN_PASSCODE) {
    return NextResponse.json({ ok: false, error: "update_not_configured" }, { status: 503 });
  }

  const key = `update:${request.headers.get("x-real-ip") ?? "local"}`;
  const limited = loginAllowed(key);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { passcode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const passcode = typeof body.passcode === "string" ? body.passcode : "";
  if (!safeEqual(passcode, expected)) {
    recordLoginFailure(key);
    return NextResponse.json({ ok: false, error: "wrong_passcode" }, { status: 403 });
  }
  clearLoginFailures(key);

  const root = path.resolve(process.cwd());
  const steps: { name: string; ok: boolean }[] = [];
  const plan = [
    { name: "git pull", cmd: "git", args: ["pull"], timeout: 60_000 },
    { name: "npm ci", cmd: "npm", args: ["ci"], timeout: 120_000 },
    { name: "npm run build", cmd: "npm", args: ["run", "build"], timeout: 180_000 },
  ];
  for (const step of plan) {
    try {
      const code = await run(step.cmd, step.args, root, step.timeout);
      steps.push({ name: step.name, ok: code === 0 });
      if (code !== 0) return NextResponse.json({ ok: false, steps }, { status: 500 });
    } catch {
      steps.push({ name: step.name, ok: false });
      return NextResponse.json({ ok: false, steps }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true, steps });
}
