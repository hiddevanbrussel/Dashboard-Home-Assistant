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

  it("serves energy states that match device_consumption in the full set", async () => {
    const child = spawn(process.execPath, [scriptPath], {
      env: { ...process.env, PORT: "0", FIXTURE_SET: "full" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const baseUrl = await new Promise<string>((resolve, reject) => {
      let stdout = "";
      const timer = setTimeout(() => {
        child.kill();
        reject(new Error(`mock-ha did not start: ${stdout}`));
      }, 8000);
      child.stdout?.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
        const match = stdout.match(/mock-ha full http:\/\/127\.0\.0\.1:\d+/);
        if (!match) return;
        clearTimeout(timer);
        resolve(match[0].replace("mock-ha full ", ""));
      });
      child.on("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`mock-ha exited ${code}: ${stdout}`));
      });
    });
    try {
      const list = await fetch(`${baseUrl}/api/states`);
      expect(list.status).toBe(200);
      const states = (await list.json()) as Array<{
        entity_id: string;
        attributes: Record<string, unknown>;
      }>;
      const fridge = states.find((item) => item.entity_id === "sensor.fridge");
      expect(fridge?.attributes).toMatchObject({
        friendly_name: "Fridge",
        device_class: "energy",
        state_class: "total_increasing",
        unit_of_measurement: "kWh",
      });
      const one = await fetch(`${baseUrl}/api/states/sensor.fridge`);
      expect(one.status).toBe(200);
      expect(await one.json()).toMatchObject({ entity_id: "sensor.fridge" });
      expect((await fetch(`${baseUrl}/api/states/sensor.missing`)).status).toBe(404);
    } finally {
      child.kill();
      await new Promise((resolve) => child.once("exit", resolve));
    }
  });
});