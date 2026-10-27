import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import WebSocket from "ws";
import { describe, expect, it } from "vitest";
import { DashboardLayoutNoticeView } from "@/components/dashboard-layout-notice";
import { getTranslations } from "@/lib/i18n";
import {
  overlapPairs,
  reconcileFloatingLayout,
  type FloatingTile,
} from "@/lib/floating-orientation-layout";
import type { PositionStorage } from "@/lib/dashboard-page-removal";

const CHROME = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((path): path is string => typeof path === "string" && existsSync(path));

const VIEW = { width: 1280, height: 800 };
const LINE = 208;

class MemoryStorage implements PositionStorage {
  private map = new Map<string, string>();
  get length(): number {
    return this.map.size;
  }
  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) ?? null) : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

class Cdp {
  private next = 1;
  private pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();
  private listeners = new Map<string, Array<(params: unknown) => void>>();

  constructor(private ws: WebSocket) {
    ws.on("message", (data) => {
      const msg = JSON.parse(String(data)) as {
        id?: number;
        method?: string;
        params?: unknown;
        result?: unknown;
        error?: unknown;
      };
      if (msg.method) {
        for (const listener of this.listeners.get(msg.method) ?? []) listener(msg.params);
      }
      if (!msg.id || !this.pending.has(msg.id)) return;
      const waiter = this.pending.get(msg.id)!;
      this.pending.delete(msg.id);
      if (msg.error) waiter.reject(new Error(JSON.stringify(msg.error)));
      else waiter.resolve(msg.result);
    });
  }

  wait(method: string): Promise<void> {
    return new Promise((resolve) => {
      const list = this.listeners.get(method) ?? [];
      list.push(() => resolve());
      this.listeners.set(method, list);
    });
  }

  send(method: string, params: Record<string, unknown> = {}, sessionId?: string): Promise<unknown> {
    const id = this.next++;
    const payload = JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);
    });
  }
}

async function withChrome<T>(run: (send: Cdp["send"], wait: Cdp["wait"]) => Promise<T>): Promise<T> {
  if (!CHROME) throw new Error("Chrome is not installed");
  const profile = await mkdtemp(join(tmpdir(), "landscape-overflow-chrome-"));
  const chrome: ChildProcess = spawn(
    CHROME,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
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
    const version = (await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json())) as {
      webSocketDebuggerUrl: string;
    };
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      ws.once("open", () => resolve());
      ws.once("error", () => reject(new Error("devtools websocket failed")));
    });
    const cdp = new Cdp(ws);
    const { targetId } = (await cdp.send("Target.createTarget", { url: "about:blank" })) as { targetId: string };
    const { sessionId } = (await cdp.send("Target.attachToTarget", { targetId, flatten: true })) as {
      sessionId: string;
    };
    const send: Cdp["send"] = (method, params) => cdp.send(method, params, sessionId);
    await send("Page.enable");
    await send("Runtime.enable");
    try {
      return await run(send, (method) => cdp.wait(method));
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

describe("26 landscape tiles leave Back reachable (H7)", () => {
  it("shows the overlap notice on a fresh load and elementFromPoint hits Back", async () => {
    const storage = new MemoryStorage();
    const tiles: FloatingTile[] = Array.from({ length: 26 }, (_, index) => ({
      id: `T${index}`,
      key: `dashboard.floatingSensorCardPosition.h7.t${index}`,
      page: 0,
      shared: false,
      persistsClamp: false,
      w: 260,
      h: 108,
      bottomInset: 0,
      legacyTopOffset: 200,
    }));
    const result = reconcileFloatingLayout({
      storage,
      dashboardId: "h7",
      orientation: "landscape",
      viewport: VIEW,
      tiles,
      push: false,
      reportNotice: true,
      rederive: false,
      mounted: false,
      topInset: LINE,
    });
    expect(result.notice).toBe("landscape-overlap");
    const placed = tiles.flatMap((entry) => {
      const raw = storage.getItem(entry.key);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { left: number; bottom: number };
      return [{
        id: entry.id,
        x: parsed.left,
        y: VIEW.height - parsed.bottom - entry.h,
        w: entry.w,
        h: entry.h,
      }];
    });
    const hidden = tiles.filter((entry) => storage.getItem(entry.key) == null);
    expect(hidden.length).toBeGreaterThan(0);
    expect(placed.length + hidden.length).toBe(26);
    expect(overlapPairs(placed, "pixels")).toEqual([]);
    for (const box of placed) {
      expect(box.y).toBeGreaterThanOrEqual(LINE);
      expect(VIEW.height - box.y - box.h).toBeGreaterThanOrEqual(0);
    }

    const nl = getTranslations("nl");
    const notice = renderToStaticMarkup(
      createElement(DashboardLayoutNoticeView, {
        message: nl["dashboardLayout.landscapeOverlap"],
        onDismiss: () => {},
      })
    );
    const tileHtml = placed
      .map(
        (box) =>
          `<div data-tile="${box.id}" style="position:absolute;left:${box.x}px;top:${box.y}px;width:${box.w}px;height:${box.h}px"></div>`
      )
      .join("");
    const html = `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0">
<div id="viewport" style="position:relative;width:${VIEW.width}px;height:${VIEW.height}px;overflow:hidden">
  <div data-app-page-heading style="position:absolute;left:0;top:64px;width:1280px;height:128px">
    <a id="back" href="/rooms" aria-label="${nl["rooms.back"]}" style="position:absolute;left:16px;top:32px;width:36px;height:36px;display:flex;align-items:center;justify-content:center">${nl["rooms.back"]}</a>
    <p style="margin:0 0 0 64px;font-size:24px">Welkom</p>
  </div>
  ${tileHtml}
  ${notice}
</div>
</body>
</html>`;
    const dir = await mkdtemp(join(tmpdir(), "landscape-overflow-"));
    const file = join(dir, "index.html");
    await writeFile(file, html);
    try {
      const hit = await withChrome(async (send, wait) => {
        await send("Emulation.setDeviceMetricsOverride", {
          width: VIEW.width,
          height: VIEW.height,
          deviceScaleFactor: 1.5,
          mobile: true,
        });
        const loaded = wait("Page.loadEventFired");
        await send("Page.navigate", { url: `file://${file}` });
        await loaded;
        const evaluated = (await send("Runtime.evaluate", {
          expression: `(() => {
            const back = document.getElementById("back");
            const rect = back.getBoundingClientRect();
            const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            const notice = document.querySelector("[data-dashboard-layout-notice]");
            return {
              label: hit && (hit.getAttribute("aria-label") || hit.textContent),
              isBack: !!(hit && (hit === back || back.contains(hit))),
              notice: notice ? notice.textContent : null,
              hiddenInDom: ${JSON.stringify(hidden.map((entry) => entry.id))}.filter((id) => document.querySelector('[data-tile="' + id + '"]')).length,
            };
          })()`,
          returnByValue: true,
        })) as { result?: { value?: { label: string | null; isBack: boolean; notice: string | null; hiddenInDom: number } }; exceptionDetails?: unknown };
        if (evaluated.exceptionDetails) throw new Error(JSON.stringify(evaluated.exceptionDetails));
        return evaluated.result?.value;
      });
      expect(hit?.isBack).toBe(true);
      expect(hit?.label).toBe(nl["rooms.back"]);
      expect(hit?.notice).toContain(nl["dashboardLayout.landscapeOverlap"]);
      expect(hit?.hiddenInDom).toBe(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
