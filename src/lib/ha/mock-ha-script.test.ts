import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const scriptPath = path.join(process.cwd(), "scripts/mock-ha.mjs");

describe("mock-ha script", () => {
  it("does not import TypeScript and starts on this Node", async () => {
    const source = readFileSync(scriptPath, "utf8");
    expect(source).not.toMatch(/from ["'][^"']+\.ts["']/);
    expect(source).not.toContain("mock-ha.ts");
    expect(source).not.toContain("node:module");
    expect(source).toContain("src/lib/ha/__fixtures__/energy");
    expect(source).not.toContain("toISOString().slice(0, 10)");
    expect(source).not.toContain(".setHours(");
    expect(source).not.toContain(".getHours(");

    const child = spawn(process.execPath, [scriptPath], {
      env: { ...process.env, PORT: "0", FIXTURE_SET: "no-prefs" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const line = await new Promise<string>((resolve, reject) => {
      let stdout = "";
      const timer = setTimeout(() => {
        child.kill();
        reject(new Error(`mock-ha did not start: ${stdout}`));
      }, 8000);
      child.stdout?.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
        const match = stdout.match(/mock-ha no-prefs http:\/\/127\.0\.0\.1:(\d+)/);
        if (!match) return;
        clearTimeout(timer);
        resolve(match[0]);
      });
      child.on("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`mock-ha exited ${code}: ${stdout}`));
      });
    });
    child.kill();
    await new Promise((resolve) => child.once("exit", resolve));
    expect(line).toMatch(/mock-ha no-prefs http:\/\/127\.0\.0\.1:\d+/);
  });
});