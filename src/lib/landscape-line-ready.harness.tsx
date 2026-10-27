import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { cardDefaultPosition } from "@/lib/floating-card-defaults";
import { formatLayoutNotice, useFloatingOrientation } from "@/hooks/use-floating-orientation";
import { getTranslations } from "@/lib/i18n";
import type { FloatingWidgetInput } from "@/lib/floating-orientation-layout";

const VIEW = { width: 1280, height: 800 };
const DRAGGED = '{"left": 400, "bottom": 300}';
/** Clear of the sensor stack at {512,336} and of the wide default under the heading. */
const DRAGGED_CLEAR = '{"left": 96, "bottom": 96}';
const SCALED = '{"left": 1000, "bottom": 40}';

type Mode = "late" | "fresh" | "polluted" | "few";

function readMode(): Mode {
  const params = new URLSearchParams(window.location.search);
  if (params.has("late")) return "late";
  if (params.has("polluted")) return "polluted";
  if (params.has("few")) return "few";
  return "fresh";
}

function buildWidgets(mode: Mode): FloatingWidgetInput[] {
  if (mode === "few") {
    return [
      { id: "s0", type: "sensor_card", page: 0 },
      { id: "s1", type: "sensor_card", page: 0 },
    ];
  }
  return [
    ...Array.from({ length: 26 }, (_, index) => ({ id: `s${index}`, type: "sensor_card", page: 0 })),
    { id: "wide", type: "text_card", page: 0, width: 640, height: 72 },
  ];
}

const writes: string[] = [];
(window as unknown as { __writes: string[] }).__writes = writes;

function sensorKey(id: string): string {
  return `dashboard.floatingSensorCardPosition.room-h8.${id}`;
}

function wideKey(): string {
  return "dashboard.floatingTextCardPosition.room-h8.wide";
}

function storageKey(widget: FloatingWidgetInput): string {
  return widget.type === "text_card" ? wideKey() : sensorKey(widget.id);
}

function seed(mode: Mode, widgets: readonly FloatingWidgetInput[]) {
  if (new URLSearchParams(window.location.search).has("keep")) return;
  localStorage.clear();
  localStorage.setItem(sensorKey("s0"), mode === "polluted" ? DRAGGED_CLEAR : DRAGGED);
  if (mode !== "polluted") return;
  const scaled = widgets.find((widget) => widget.id === "s1");
  if (scaled) {
    scaled.scale = 1.2;
    localStorage.setItem(sensorKey("s1"), SCALED);
  }
  widgets.forEach((widget, index) => {
    if (widget.id === "s0" || widget.id === "s1") return;
    const position = cardDefaultPosition(
      widget.type,
      widget.type === "text_card" ? 0 : index,
      widget.type === "text_card" ? { w: 640, h: 72 } : { w: 260, h: 108 },
      VIEW
    );
    if (!position) return;
    localStorage.setItem(storageKey(widget), JSON.stringify(position));
  });
}

function FakeCard({ widget }: { widget: FloatingWidgetInput }) {
  const key = storageKey(widget);
  const wide = widget.type === "text_card";
  const width = wide ? 640 : 260;
  const height = wide ? 72 : 108;
  useEffect(() => {
    if (localStorage.getItem(key) != null) return;
    const bad = wide ? JSON.stringify({ left: 0, bottom: 680 }) : JSON.stringify({ left: 512, bottom: 336 });
    localStorage.setItem(key, bad);
    writes.push(key);
  }, [key, wide]);
  const raw = localStorage.getItem(key);
  let style: { position: "absolute"; left: number; top: number; width: number; height: number } | undefined;
  if (raw) {
    const parsed = JSON.parse(raw) as { left: number; bottom: number };
    style = {
      position: "absolute",
      left: parsed.left,
      top: VIEW.height - parsed.bottom - height,
      width,
      height,
    };
  }
  return <div data-tile={widget.id} style={style} />;
}

function App({ mode, widgets }: { mode: Mode; widgets: FloatingWidgetInput[] }) {
  const layout = useFloatingOrientation({
    dashboardId: "room-h8",
    ready: true,
    widgets,
    editMode: false,
    expectsHeading: true,
  });
  const nl = getTranslations("nl");
  const message =
    layout.notice === "dashboardLayout.landscapeOverlap" && layout.hiddenCount > 0
      ? formatLayoutNotice(layout.notice, layout.hiddenCount, (key) => nl[key] ?? key)
      : "";
  useEffect(() => {
    const headed = document.querySelector("[data-app-page-heading]") != null;
    document.documentElement.dataset.phase = headed ? "headed" : "waiting";
    document.documentElement.dataset.writes = String(writes.length);
    document.documentElement.dataset.hidden = String(layout.hiddenCount);
    document.documentElement.dataset.own = localStorage.getItem(sensorKey("s0")) ?? "";
    document.documentElement.dataset.scaled = localStorage.getItem(sensorKey("s1")) ?? "";
    document.documentElement.dataset.wide = localStorage.getItem(wideKey()) ?? "";
    if (!headed) return;
    document.documentElement.dataset.settled = "1";
  });
  const shown = widgets.filter((widget) => !layout.withheldIds.includes(widget.id));
  return (
    <>
      <div data-app-header style={{ position: "absolute", left: 0, top: 0, width: VIEW.width, height: 64 }} />
      {mode !== "late" ? (
        <div data-app-page-heading style={{ position: "absolute", left: 0, top: 64, width: VIEW.width, height: 128 }}>
          <a id="back" href="/rooms" aria-label="Terug" style={{ position: "absolute", left: 16, top: 32, width: 36, height: 36 }}>
            Terug
          </a>
          <p style={{ margin: "28px 0 0 64px" }}>Welkom</p>
        </div>
      ) : null}
      {shown.map((widget) => (
        <FakeCard key={widget.id} widget={widget} />
      ))}
      {message ? (
        <div data-dashboard-layout-notice role="status">
          <button type="button">{message}</button>
        </div>
      ) : null}
    </>
  );
}

try {
  const mode = readMode();
  const widgets = buildWidgets(mode);
  seed(mode, widgets);
  const root = document.getElementById("root");
  if (root) createRoot(root).render(<App mode={mode} widgets={widgets} />);
} catch (error) {
  document.documentElement.dataset.phase = "error";
  document.documentElement.dataset.boot = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
}
