import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { cardDefaultPosition } from "@/lib/floating-card-defaults";
import { formatLayoutNotice, useFloatingOrientation } from "@/hooks/use-floating-orientation";
import { getTranslations } from "@/lib/i18n";
import { floatingStorageKey, type FloatingWidgetInput } from "@/lib/floating-orientation-layout";

const VIEW = { width: 1280, height: 800 };
const DRAGGED = '{"left": 400, "bottom": 300}';
/** Clear of the sensor stack at {512,336} and of the wide default under the heading. */
const DRAGGED_CLEAR = '{"left": 96, "bottom": 96}';
const SCALED = '{"left": 1000, "bottom": 40}';

type Mode = "late" | "fresh" | "polluted" | "few" | "shift" | "crowd" | "beside" | "row";

function readMode(): Mode {
  const params = new URLSearchParams(window.location.search);
  if (params.has("shift")) return "shift";
  if (params.has("beside")) return "beside";
  if (params.has("row")) return "row";
  if (params.has("crowd")) return "crowd";
  if (params.has("late")) return "late";
  if (params.has("polluted")) return "polluted";
  if (params.has("few")) return "few";
  return "fresh";
}

const SHIFT: FloatingWidgetInput[] = ["a", "b", "c", "d"].map((id) => ({
  id,
  type: "text_card",
  page: 0,
  width: 280,
  height: 120,
}));

const CROWD: FloatingWidgetInput[] = [
  { id: "l01", type: "text_card", page: 0, width: 700, height: 200 },
  { id: "speaker", type: "text_card", page: 0, width: 700, height: 200 },
  { id: "l02", type: "text_card", page: 0, width: 700, height: 200 },
  { id: "l03", type: "text_card", page: 0, width: 700, height: 200 },
  { id: "l04", type: "text_card", page: 0, width: 700, height: 200 },
  { id: "l05", type: "text_card", page: 0, width: 700, height: 200 },
  { id: "s01", type: "text_card", page: 0, width: 700, height: 180 },
  { id: "s02", type: "text_card", page: 0, width: 700, height: 180 },
  { id: "s03", type: "text_card", page: 0, width: 700, height: 180 },
  { id: "s04", type: "text_card", page: 0, width: 700, height: 180 },
  { id: "breed", type: "text_card", page: 0, width: 760, height: 200 },
  { id: "klimaat", type: "text_card", page: 0, width: 760, height: 220 },
];

let activeMode: Mode = "fresh";

function dashboardIdFor(mode: Mode): string {
  if (mode === "shift") return "room-h1";
  if (mode === "crowd") return "room-h2";
  if (mode === "beside") return "room-beside";
  if (mode === "row") return "room-row";
  return "room-h8";
}

function textKey(scope: string, id: string): string {
  return `dashboard.floatingTextCardPosition.${scope}.${id}`;
}

function rowWidgets(): FloatingWidgetInput[] {
  return [
    ...Array.from({ length: 6 }, (_, index) => ({
      id: `lamp${index + 1}`,
      type: "light_card",
      page: 0,
      card_layout: "horizontal" as const,
      width: 240,
      height: 70,
    })),
    ...Array.from({ length: 3 }, (_, index) => ({
      id: `sensor${index + 1}`,
      type: "sensor_card",
      page: 0,
      width: 260,
      height: 108,
    })),
    { id: "a-speaker", type: "media_card", page: 0, width: 280, height: 340 },
    { id: "wide", type: "text_card", page: 0, width: 640, height: 72 },
  ];
}

function besideWidgets(): FloatingWidgetInput[] {
  const scaled = new URLSearchParams(window.location.search).get("scale") === "1";
  return [
    { id: "lamp", type: "light_card", page: 0, card_layout: "horizontal", width: 240, height: 70 },
    {
      id: "speaker",
      type: "media_card",
      page: 0,
      width: scaled ? 312 : 280,
      height: scaled ? 356 : 340,
      ...(scaled ? { scale: 1.2 } : {}),
    },
  ];
}

function buildWidgets(mode: Mode): FloatingWidgetInput[] {
  if (mode === "shift") return SHIFT.map((widget) => ({ ...widget }));
  if (mode === "row") return rowWidgets();
  if (mode === "beside") return besideWidgets();
  if (mode === "crowd") {
    const scaled = localStorage.getItem("crowd-scale") === "1";
    const list = CROWD.map((widget) => ({ ...widget }));
    if (scaled) {
      const speaker = list.find((widget) => widget.id === "speaker");
      if (speaker) {
        speaker.scale = 1.2;
        speaker.width = (speaker.width ?? 700) + 32;
        speaker.height = (speaker.height ?? 200) + 16;
      }
    }
    if (new URLSearchParams(window.location.search).has("shuffle")) list.reverse();
    return list;
  }
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
  if (activeMode === "shift" || activeMode === "crowd") return textKey(dashboardIdFor(activeMode), widget.id);
  if (activeMode === "beside" || activeMode === "row") {
    return floatingStorageKey(widget.type, dashboardIdFor(activeMode), widget.id) ?? sensorKey(widget.id);
  }
  return widget.type === "text_card" ? wideKey() : sensorKey(widget.id);
}

function seed(mode: Mode, widgets: readonly FloatingWidgetInput[]) {
  if (new URLSearchParams(window.location.search).has("keep")) return;
  localStorage.clear();
  if (mode === "shift" || mode === "crowd" || mode === "row") return;
  if (mode === "beside") {
    const params = new URLSearchParams(window.location.search);
    const gap = Number(params.get("gap") ?? "16");
    const scaled = params.get("scale") === "1";
    const speakerW = scaled ? 312 : 280;
    const speakerH = scaled ? 356 : 340;
    const speakerLeft = 496;
    const lampLeft = speakerLeft - 240 - gap;
    const line = 218;
    const speakerRaw = JSON.stringify({ left: speakerLeft, bottom: VIEW.height - line - speakerH });
    const lampRaw = JSON.stringify({ left: lampLeft, bottom: VIEW.height - line - 70 });
    const scope = dashboardIdFor("beside");
    const speakerKey = floatingStorageKey("media_card", scope, "speaker");
    const lampKey = floatingStorageKey("light_card", scope, "lamp");
    if (!speakerKey || !lampKey) return;
    localStorage.setItem(speakerKey, speakerRaw);
    localStorage.setItem(lampKey, lampRaw);
    const auto = scaled ? undefined : { [speakerKey]: speakerRaw };
    localStorage.setItem(`dashboard.floatingLayout.v1.${scope}`, JSON.stringify({
      v: 1,
      active: "landscape",
      landscape: { [speakerKey]: speakerRaw, [lampKey]: lampRaw },
      portrait: null,
      portraitBron: null,
      landscapeTop: 208,
      ...(auto ? { auto } : {}),
    }));
    return;
  }
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
  const width = typeof widget.width === "number" ? widget.width : wide ? 640 : 260;
  const height = typeof widget.height === "number" ? widget.height : wide ? 72 : 108;
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

function ShiftChrome() {
  const delay = Number(new URLSearchParams(window.location.search).get("delay") ?? "0");
  const [pageBottom, setPageBottom] = useState(160);
  useEffect(() => {
    const timer = window.setTimeout(() => setPageBottom(192), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return (
    <>
      <div data-app-header style={{ position: "absolute", left: 0, top: 0, width: VIEW.width, height: 64 }} />
      <div data-app-heading-edit style={{ position: "absolute", left: 0, top: 64, width: VIEW.width, height: 112 }} />
      <div data-app-page-heading style={{ position: "absolute", left: 0, top: 64, width: VIEW.width, height: pageBottom - 64 }}>
        <a id="back" href="/rooms" aria-label="Terug" style={{ position: "absolute", left: 16, top: 32, width: 36, height: 36 }}>
          Terug
        </a>
      </div>
    </>
  );
}

function App({ mode, widgets: initialWidgets }: { mode: Mode; widgets: FloatingWidgetInput[] }) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const dashboardId = dashboardIdFor(mode);
  useEffect(() => {
    if (mode !== "crowd") return;
    const apply = () => {
      const prefix = `dashboard.floatingTextCardPosition.${dashboardId}.`;
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(prefix));
      const speakerKey = textKey(dashboardId, "speaker");
      const dragKey = keys.find((key) => key !== speakerKey) ?? keys[0];
      if (dragKey) localStorage.setItem(dragKey, JSON.stringify({ left: 96, bottom: 48 }));
      localStorage.setItem("crowd-drag", dragKey ?? "");
      localStorage.setItem("crowd-scale", "1");
      setWidgets((current) =>
        current.map((widget) =>
          widget.id === "speaker"
            ? { ...widget, scale: 1.2, width: (widget.width ?? 700) + 32, height: (widget.height ?? 200) + 16 }
            : widget
        )
      );
      window.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    };
    (window as unknown as { __applyUserEdit?: () => void }).__applyUserEdit = apply;
  }, [dashboardId, mode]);
  const layout = useFloatingOrientation({
    dashboardId,
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
    document.documentElement.dataset.hiddenIds = [...layout.withheldIds].sort().join(",");
    document.documentElement.dataset.own = localStorage.getItem(sensorKey("s0")) ?? "";
    document.documentElement.dataset.scaled = localStorage.getItem(sensorKey("s1")) ?? "";
    document.documentElement.dataset.wide = localStorage.getItem(wideKey()) ?? "";
    const layoutRaw = localStorage.getItem(`dashboard.floatingLayout.v1.${dashboardId}`);
    let line = "";
    if (layoutRaw) {
      try {
        const parsed = JSON.parse(layoutRaw) as { landscapeTop?: number };
        line = parsed.landscapeTop === undefined ? "" : String(parsed.landscapeTop);
      } catch {
        line = "";
      }
    }
    document.documentElement.dataset.line = line;
    const tops = [...document.querySelectorAll("[data-tile]")].map((node) => {
      const rect = node.getBoundingClientRect();
      return `${node.getAttribute("data-tile") ?? ""}:${Math.round(rect.top)}`;
    });
    tops.sort();
    document.documentElement.dataset.tops = tops.join("|");
    document.documentElement.dataset.positions = widgets
      .map((widget) => `${widget.id}=${localStorage.getItem(storageKey(widget)) ?? ""}`)
      .sort()
      .join("\n");
    if (mode === "shift") {
      document.documentElement.dataset.settled = line === "208" ? "1" : "";
      return;
    }
    // The heading node can appear a frame before the line is stored. Settled
    // waits for that write so a reload check cannot read the card default.
    if (!headed || line === "") return;
    document.documentElement.dataset.settled = "1";
  });
  const shown = widgets.filter((widget) => !layout.withheldIds.includes(widget.id));
  return (
    <>
      {mode === "shift" ? <ShiftChrome /> : <div data-app-header style={{ position: "absolute", left: 0, top: 0, width: VIEW.width, height: 64 }} />}
      {mode === "crowd" || mode === "beside" || mode === "row" ? (
        <div data-app-heading-edit style={{ position: "absolute", left: 0, top: 64, width: VIEW.width, height: 112 }} />
      ) : null}
      {mode !== "late" && mode !== "shift" ? (
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
  activeMode = mode;
  const widgets = buildWidgets(mode);
  seed(mode, widgets);
  const root = document.getElementById("root");
  if (root) createRoot(root).render(<App mode={mode} widgets={widgets} />);
} catch (error) {
  document.documentElement.dataset.phase = "error";
  document.documentElement.dataset.boot = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
}
