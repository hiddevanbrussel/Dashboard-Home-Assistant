import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { rewriteText } = require("../../homeassistant-addon/rootfs/ingress-proxy.js") as {
  rewriteText: (text: string, ingressPath: string) => string;
};

const INGRESS = "/api/hassio_ingress/x";
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function collectJs(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...collectJs(full));
    else if (stat.isFile() && entry.endsWith(".js")) out.push(full);
  }
  return out;
}

describe("add-on client chunks after ingress rewrite", () => {
  it("parses every static .js file with vm.Script", () => {
    const nextDir = join(repoRoot, ".next");
    rmSync(nextDir, { recursive: true, force: true });
    execFileSync("npm", ["run", "build"], {
      cwd: repoRoot,
      env: {
        ...process.env,
        NEXT_BASE_PATH: "/__ha_ingress__",
        NEXT_PUBLIC_BASE_PATH: "/__ha_ingress__",
        DATABASE_URL: process.env.DATABASE_URL || "file:./prisma/dev.db",
      },
      stdio: "inherit",
      timeout: 15 * 60 * 1000,
    });

    const staticDir = join(nextDir, "static");
    const files = collectJs(staticDir);
    const failures: string[] = [];
    const leftovers: string[] = [];
    let withPlaceholder = 0;

    for (const file of files) {
      const source = readFileSync(file, "utf8");
      if (source.includes("__ha_ingress__")) withPlaceholder += 1;
      const rewritten = rewriteText(source, INGRESS);
      const rel = relative(repoRoot, file);
      if (rewritten.includes("__ha_ingress__")) leftovers.push(rel);
      try {
        new vm.Script(rewritten, { filename: rel });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${rel}: ${message.split("\n")[0]}`);
      }
    }

    const summary = [
      `checked ${files.length} js files under .next/static`,
      `files containing the placeholder before rewrite: ${withPlaceholder}`,
      `syntax failures: ${failures.length}`,
      `leftover placeholder: ${leftovers.length}`,
    ].join("\n");
    mkdirSync("/opt/cursor/artifacts", { recursive: true });
    writeFileSync("/opt/cursor/artifacts/ingress-chunk-syntax.txt", `${summary}\n`);
    console.log(summary);

    expect(files.length, "expected a real next build to emit client js").toBeGreaterThan(0);
    expect(withPlaceholder, "build was not using the add-on basePath").toBeGreaterThan(0);
    expect(leftovers, leftovers.slice(0, 20).join("\n")).toEqual([]);
    expect(failures, failures.slice(0, 20).join("\n")).toEqual([]);
  }, 900_000);
});
