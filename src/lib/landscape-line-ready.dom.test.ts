import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { build } from "esbuild";
import WebSocket from "ws";
import { describe, expect, it } from "vitest";

const CHROME = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((candidate): candidate is string => typeof candidate === "string" && existsSync(candidate));

const VIEW = { width: 1280, height: 800 };
const DRAGGED = '{"left": 400, "bottom": 300}';
const DRAGGED_CLEAR = '{"left": 96, "bottom": 96}';
const SCALED = '{"left": 1000, "bottom": 40}';
const WIDE_DEFAULT = JSON.stringify({ left: 0, bottom: 680 });
const SENSOR_STACK = JSON.stringify({ left: 512, bottom: 336 });

class Cdp {
  private next = 1;
  private pending = new Map<number, { method: string; resolve: (value: unknown) => void; reject: (error: Error) => void }>();
  sessionId = "";
  private listeners = new Map<string, Array<(params: unknown, sessionId?: string) => void>>();
  readonly events: string[] = [];

  constructor(private ws: WebSocket) {
    ws.on("message", (data) => {
      const msg = JSON.parse(String(data)) as {
        id?: number;
        method?: string;
        sessionId?: string;
        params?: { exceptionDetails?: { text?: string; exception?: { description?: string } } };
        result?: unknown;
        error?: unknown;
      };
      if (msg.method) {
        if (msg.method === "Runtime.exceptionThrown") {
          const details = msg.params?.exceptionDetails;
          this.events.push(details?.exception?.description || details?.text || msg.method);
        }
        for (const listener of this.listeners.get(msg.method) ?? []) listener(msg.params, msg.sessionId);
      }
      if (!msg.id || !this.pending.has(msg.id)) return;
      const waiter = this.pending.get(msg.id)!;
      this.pending.delete(msg.id);
      if (msg.error) waiter.reject(new Error(`${waiter.method}: ${JSON.stringify(msg.error)}`));
      else waiter.resolve(msg.result);
    });
  }

  wait(method: string): Promise<void> {
    return new Promise((resolve) => {
      const list = this.listeners.get(method) ?? [];
      list.push((_params, eventSession) => {
        if (this.sessionId && eventSession !== this.sessionId) return;
        resolve();
      });
      this.listeners.set(method, list);
    });
  }

  send(method: string, params: Record<string, unknown> = {}, sessionId?: string): Promise<unknown> {
    const id = this.next++;
    const payload = JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { method, resolve, reject });
      this.ws.send(payload);
    });
  }
}

async function withChrome<T>(run: (send: Cdp["send"], wait: Cdp["wait"]) => Promise<T>): Promise<T> {
  if (!CHROME) throw new Error("Chrome is not installed");
  const profile = await mkdtemp(path.join(tmpdir(), "landscape-line-chrome-"));
  const chrome: ChildProcess = spawn(
    CHROME,
    ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"],
    { detached: true, stdio: ["ignore", "pipe", "pipe"] }
  );
  let stderr = "";
  const port = await new Promise<string>((resolve, reject) => {
    chrome.stderr?.on("data", (chunk) => {
      stderr += String(chunk);
      const match = stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (match) resolve(match[1]);
    });
    chrome.once("error", () => reject(new Error("chrome failed to start")));
    chrome.once("exit", () => reject(new Error(`chrome exited before DevTools: ${stderr.slice(0, 400)}`)));
  });
  try {
    const version = (await fetch(`http://127.0.0.1:${port}/json/version`).then((response) => response.json())) as {
      webSocketDebuggerUrl: string;
    };
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      ws.once("open", () => resolve());
      ws.once("error", () => reject(new Error("devtools websocket failed")));
    });
    const cdp = new Cdp(ws);
    const { targetId } = (await cdp.send("Target.createTarget", { url: "about:blank" })) as { targetId: string };
    const { sessionId } = (await cdp.send("Target.attachToTarget", { targetId, flatten: true })) as { sessionId: string };
    cdp.sessionId = sessionId;
    const send: Cdp["send"] = (method, params) => cdp.send(method, params, sessionId);
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: VIEW.width,
      height: VIEW.height,
      deviceScaleFactor: 1.5,
      mobile: true,
    });
    try {
      return await run(send, (method) => cdp.wait(method));
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`${detail}\n${cdp.events.join("\n")}`);
    } finally {
      ws.close();
    }
  } finally {
    if (chrome.pid) {
      try {
        process.kill(-chrome.pid, "SIGKILL");
      } catch {
        chrome.kill("SIGKILL");
      }
    }
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }
}

function waitFor(expression: string): string {
  return `new Promise((resolve, reject) => {
    const started = performance.now();
    const tick = () => {
      const value = (${expression});
      if (value) resolve(true);
      else if (performance.now() - started > 8000) reject(new Error("timed out waiting for " + ${JSON.stringify(expression)}));
      else requestAnimationFrame(tick);
    };
    tick();
  })`;
}

async function evaluate<T>(send: Cdp["send"], expression: string): Promise<T> {
  const evaluated = (await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    silent: true,
  })) as {
    result?: { value?: T };
    exceptionDetails?: unknown;
  };
  if (evaluated.exceptionDetails) throw new Error(JSON.stringify(evaluated.exceptionDetails));
  return evaluated.result?.value as T;
}

type Scene = {
  writes: number;
  hidden: number;
  notice: string | null;
  own: string;
  scaled: string;
  wide: string;
  overlap: string[];
  headingHits: string[];
  back: string | null;
  tiles: number;
  viewport: [number, number];
};

async function readScene(send: Cdp["send"]): Promise<Scene> {
  return evaluate<Scene>(send, `(() => {
    const height = ${VIEW.height};
    const nodes = [...document.querySelectorAll("[data-tile]")];
    const boxes = nodes.flatMap((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return [];
      return [{ id: node.getAttribute("data-tile"), x: rect.left, y: rect.top, w: rect.width, h: rect.height }];
    });
    const overlap = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 0 && oy > 0) overlap.push(a.id + "x" + b.id);
    }
    const heading = document.querySelector("[data-app-page-heading]");
    const headingRect = heading ? heading.getBoundingClientRect() : null;
    const headingHits = headingRect ? boxes.filter((box) => {
      const ox = Math.min(box.x + box.w, headingRect.right) - Math.max(box.x, headingRect.left);
      const oy = Math.min(box.y + box.h, headingRect.bottom) - Math.max(box.y, headingRect.top);
      return ox > 0 && oy > 0;
    }).map((box) => box.id) : [];
    const back = document.getElementById("back");
    const backRect = back ? back.getBoundingClientRect() : null;
    const hit = backRect ? document.elementFromPoint(backRect.left + backRect.width / 2, backRect.top + backRect.height / 2) : null;
    const notice = document.querySelector("[data-dashboard-layout-notice]");
    return {
      writes: (window.__writes || []).length,
      hidden: Number(document.documentElement.dataset.hidden || "0"),
      notice: notice ? notice.textContent : null,
      own: document.documentElement.dataset.own || "",
      scaled: document.documentElement.dataset.scaled || "",
      wide: document.documentElement.dataset.wide || "",
      overlap,
      headingHits,
      back: hit ? (hit.getAttribute("aria-label") || hit.textContent) : null,
      tiles: boxes.length,
      viewport: [window.innerWidth, window.innerHeight],
    };
  })()`);
}

describe("landscape line is definitive before cards write (H8)", () => {
  it("keeps card defaults off the heading on a fresh load, a reload, and a polluted record", async () => {
    const htmlDir = await mkdtemp(path.join(tmpdir(), "landscape-line-html-"));
    const bundle = path.join(htmlDir, "harness.js");
    await build({
      entryPoints: [path.join(process.cwd(), "src/lib/landscape-line-ready.harness.tsx")],
      bundle: true,
      format: "iife",
      outfile: bundle,
      platform: "browser",
      jsx: "automatic",
      define: { "process.env.NODE_ENV": '"production"' },
      plugins: [
        {
          name: "at-alias",
          setup(pluginBuild) {
            pluginBuild.onResolve({ filter: /^@\// }, (args) => {
              const base = path.join(process.cwd(), "src", args.path.slice(2));
              const file = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`].find((candidate) => {
                try {
                  return statSync(candidate).isFile();
                } catch {
                  return false;
                }
              });
              const index = file
                ? file
                : [`${base}/index.ts`, `${base}/index.tsx`, `${base}/index.js`].find((candidate) => {
                    try {
                      return statSync(candidate).isFile();
                    } catch {
                      return false;
                    }
                  });
              return { path: index ?? base };
            });
          },
        },
      ],
    });
    const file = path.join(htmlDir, "index.html");
    const html = `<!doctype html><html><head><meta charset="utf-8" /><script>window.__boot="";window.addEventListener("error",function(event){window.__boot=String(event.message)+"\\n"+String(event.error&&event.error.stack||"").slice(0,1500);});</script></head><body style="margin:0"><div id="root"></div><script src="harness.js"></script></body></html>`;
    await writeFile(file, html);
    const open = async (send: Cdp["send"], wait: Cdp["wait"], query: string) => {
      const loaded = wait("Page.loadEventFired");
      await send("Page.navigate", { url: `file://${file}?${query}` });
      await loaded;
      await evaluate(send, waitFor(`document.documentElement.dataset.phase === "waiting" || document.documentElement.dataset.settled === "1" || document.documentElement.dataset.phase === "error"`));
      const boot = await evaluate<string>(send, `document.documentElement.dataset.boot || window.__boot || ""`);
      if (boot) throw new Error(boot);
    };
    try {
      await withChrome(async (send, wait) => {
        await open(send, wait, "late=1");
        const waiting = await readScene(send);
        expect(waiting.writes).toBe(0);
        expect(waiting.tiles).toBe(1);
        expect(waiting.own).toBe(DRAGGED);
        await evaluate(send, `(() => {
          const node = document.createElement("div");
          node.setAttribute("data-app-page-heading", "");
          node.style.cssText = "position:absolute;left:0;top:64px;width:${VIEW.width}px;height:128px";
          node.innerHTML = '<a id="back" href="/rooms" aria-label="Terug" style="position:absolute;left:16px;top:32px;width:36px;height:36px;display:block">Terug</a><p style="margin:28px 0 0 64px">Welkom</p>';
          document.body.appendChild(node);
        })()`);
        await evaluate(send, waitFor(`document.documentElement.dataset.settled === "1" && (Number(document.documentElement.dataset.hidden || "0") === 0 || document.querySelector("[data-dashboard-layout-notice]"))`));
        const placed = await readScene(send);
        expect(placed.writes).toBe(0);
        expect(placed.own).toBe(DRAGGED);
        expect(placed.overlap, `fresh ${placed.viewport.join("x")} tiles=${placed.tiles} hidden=${placed.hidden}`).toEqual([]);
        expect(placed.headingHits).toEqual([]);
        expect(placed.back).toBe("Terug");
        expect(placed.hidden).toBeGreaterThan(0);
        expect(placed.notice).toContain(`${placed.hidden} tegels passen niet`);
        expect(placed.notice).not.toContain("{n}");
        expect(placed.wide).not.toBe(WIDE_DEFAULT);

        await open(send, wait, "keep=1");
        await evaluate(send, waitFor(`document.documentElement.dataset.settled === "1"`));
        const reloaded = await readScene(send);
        expect(reloaded.writes).toBe(0);
        expect(reloaded.own).toBe(DRAGGED);
        expect(reloaded.overlap, `reload ${reloaded.viewport.join("x")} tiles=${reloaded.tiles}`).toEqual([]);
        expect(reloaded.headingHits).toEqual([]);
        expect(reloaded.back).toBe("Terug");
        expect(reloaded.wide).toBe(placed.wide);

        await open(send, wait, "polluted=1");
        await evaluate(send, waitFor(`document.documentElement.dataset.settled === "1"`));
        const polluted = await readScene(send);
        expect(polluted.writes).toBe(0);
        expect(polluted.own).toBe(DRAGGED_CLEAR);
        expect(polluted.scaled).toBe(SCALED);
        expect(polluted.wide).not.toBe(WIDE_DEFAULT);
        expect(polluted.overlap, `polluted ${polluted.viewport.join("x")} tiles=${polluted.tiles} hidden=${polluted.hidden} wide=${polluted.wide}`).toEqual([]);
        expect(polluted.headingHits).toEqual([]);
        expect(polluted.back).toBe("Terug");
        if (polluted.hidden > 0) expect(polluted.notice).toContain(`${polluted.hidden} tegels`);
        else expect(polluted.notice).toBeNull();
        const stacked = await evaluate<number>(send, `Object.keys(localStorage).filter((key) => localStorage.getItem(key) === ${JSON.stringify(SENSOR_STACK)}).length`);
        expect(stacked).toBe(0);

        await open(send, wait, "few=1");
        await evaluate(send, waitFor(`document.documentElement.dataset.settled === "1"`));
        const few = await readScene(send);
        expect(few.hidden).toBe(0);
        expect(few.notice).toBeNull();
        expect(few.overlap).toEqual([]);
        expect(few.back).toBe("Terug");
      });
    } finally {
      await rm(htmlDir, { recursive: true, force: true }).catch(() => {});
    }
  }, 90_000);
});
