import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8").replace(/\r\n/g, "\n");

/** #279: a bare `docker run` without `-v …:/data` must still start. */
describe("Docker /data without a volume", () => {
  it("the entrypoint always creates /data/uploads and hands it to nextjs before dropping root", () => {
    const entrypoint = source("docker-entrypoint.sh");
    expect(entrypoint).not.toMatch(/if \[ -d \/data \]/);
    const mkdir = entrypoint.indexOf("mkdir -p /data/uploads");
    const chown = entrypoint.indexOf("chown -R 1001:1001 /data");
    const gosu = entrypoint.indexOf("exec gosu nextjs");
    expect(mkdir).toBeGreaterThanOrEqual(0);
    expect(chown).toBeGreaterThan(mkdir);
    expect(gosu).toBeGreaterThan(chown);
  });

  it("the image ships /data owned by nextjs, matching the default DATABASE_URL and UPLOAD_DIR", () => {
    const dockerfile = source("Dockerfile");
    expect(dockerfile).toContain('ENV DATABASE_URL="file:/data/app.db"');
    expect(dockerfile).toContain("ENV UPLOAD_DIR=/data/uploads");
    expect(dockerfile).toMatch(/RUN mkdir -p \/data\/uploads && chown -R nextjs:nodejs \/data/);
  });
});
