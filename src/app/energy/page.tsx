"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useState, useEffect, useRef } from "react";
import { createPortal, flushSync } from "react-dom";
import ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Check, CircleDot, Fuel, Gauge, Image as ImageIcon, Pencil, Plug, Plus, Sun, Type, X, Zap } from "lucide-react";
import {
  TextCardWidget,
  SolarCardWidget,
  PowerUsageCardWidget,
  DeviceConsumptionCardWidget,
  EnergyMonitorCardWidget,
  StatPillCardWidget,
  SensorCardWidget,
  NutsCardWidget,
  FloatingTextCard,
  FloatingSolarCard,
  FloatingPowerUsageCard,
  FloatingDeviceConsumptionCard,
  FloatingEnergyMonitorCard,
  FloatingStatPillCard,
  FloatingSensorCard,
  FloatingNutsCard,
} from "@/components/widgets";
import type { WidgetConfig } from "@/stores/onboarding-store";
import type { SensorCondition, ImageCondition } from "@/components/widgets";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { getEditModeAllowed, getEditModePasscode, checkEditModePasscode } from "@/stores/dashboard-settings-store";
import { OfflinePill } from "@/components/offline-pill";
import { useTranslation } from "@/hooks/use-translation";
import { cn, generateId } from "@/lib/utils";
import { EditPanelModal } from "./edit-panel";

type LayoutItem = ReactGridLayout.Layout;
type Layout = LayoutItem[];

const ADDABLE_WIDGET_TYPES = ["text_card", "solar_card", "power_usage_card", "device_consumption_card", "energy_monitor_card", "stat_pill_card", "sensor_card", "nuts_card"] as const;

const ADDABLE_WIDGET_TILES: { type: (typeof ADDABLE_WIDGET_TYPES)[number]; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "text_card", label: "Tekst", Icon: Type },
  { type: "solar_card", label: "Zonnepanelen", Icon: Sun },
  { type: "power_usage_card", label: "Stroomverbruik", Icon: Zap },
  { type: "device_consumption_card", label: "Verbruik per apparaat", Icon: Zap },
  { type: "energy_monitor_card", label: "Afbeeldingskaart", Icon: ImageIcon },
  { type: "stat_pill_card", label: "Stat pill", Icon: CircleDot },
  { type: "sensor_card", label: "Sensor", Icon: Gauge },
  { type: "nuts_card", label: "Nuts (Gas/Water)", Icon: Fuel },
];

const WIDGET_TYPE_DOMAIN: Record<string, string> = {
  text_card: "",
  solar_card: "sensor",
  energy_monitor_card: "sensor",
  power_usage_card: "sensor",
  device_consumption_card: "sensor",
  stat_pill_card: "sensor",
  sensor_card: "sensor",
  nuts_card: "sensor",
};

const FLOATING_WIDGET_TYPES = new Set([
  "text_card", "solar_card", "power_usage_card", "device_consumption_card", "energy_monitor_card", "stat_pill_card", "sensor_card", "nuts_card",
]);

type EnergyDashboardData = {
  id: string;
  layout: string | null;
  widgets: string | null;
  background: string | null;
  backgroundLight: string | null;
  backgroundDark: string | null;
  welcomeTitle: string | null;
  welcomeSubtitle: string | null;
};

function parseLayout(layout: string | null): Layout {
  if (!layout) return [];
  try {
    const arr = JSON.parse(layout) as LayoutItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function parseWidgets(widgets: string | null): WidgetConfig[] {
  if (!widgets) return [];
  try {
    const arr = JSON.parse(widgets) as WidgetConfig[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function WidgetByType({
  type,
  title,
  entity_id,
  consumption_entity_id,
  yield_entity_id_today,
  yield_entity_id_month,
  show_icon,
  background_image,
  background_image_dark,
  image_conditions,
  icon,
  size,
  conditions,
  current_entity_id,
  max_value,
  minimal,
  label,
  color,
  device_entity_ids,
  device_names,
  cost_per_kwh,
  textMode,
  onMoreClick,
}: {
  type: string;
  title: string;
  entity_id: string;
  consumption_entity_id?: string;
  yield_entity_id_today?: string;
  yield_entity_id_month?: string;
  show_icon?: boolean;
  background_image?: string;
  background_image_dark?: string;
  image_conditions?: ImageCondition[];
  icon?: string;
  size?: string;
  conditions?: { operator: string; value: string; color: string }[];
  current_entity_id?: string;
  max_value?: number;
  minimal?: boolean;
  label?: string;
  color?: string;
  device_entity_ids?: string[];
  device_names?: Record<string, string>;
  cost_per_kwh?: number;
  textMode?: "title" | "subtitle" | "text";
  onMoreClick?: () => void;
}) {
  const sizeProp = (size as "sm" | "md" | "lg") ?? "md";

  switch (type) {
    case "text_card":
      return (
        <TextCardWidget
          text={title ?? ""}
          type={textMode === "title" || textMode === "subtitle" || textMode === "text" ? textMode : "title"}
          show_icon={show_icon ?? false}
          icon={icon ?? "Type"}
        />
      );
    case "solar_card":
      return (
        <SolarCardWidget
          title={title}
          entity_id={entity_id}
          yield_entity_id_today={yield_entity_id_today}
          yield_entity_id_month={yield_entity_id_month}
          size={sizeProp}
        />
      );
    case "energy_monitor_card":
      return (
        <EnergyMonitorCardWidget
          title={title}
          entity_id={entity_id}
          background_image={background_image}
          background_image_dark={background_image_dark}
          image_conditions={image_conditions as ImageCondition[] | undefined}
          minimal={minimal}
          size={sizeProp}
        />
      );
    case "power_usage_card":
      return (
        <PowerUsageCardWidget
          title={title}
          entity_id={entity_id}
          cost_per_kwh={cost_per_kwh}
          onMoreClick={onMoreClick}
        />
      );
    case "device_consumption_card":
      return (
        <DeviceConsumptionCardWidget
          title={title}
          device_entity_ids={device_entity_ids}
          device_names={device_names}
          onMoreClick={onMoreClick}
        />
      );
    case "stat_pill_card":
      return (
        <StatPillCardWidget
          title={title}
          entity_id={entity_id}
          label={label}
          icon={icon}
          color={(color as "amber" | "purple" | "emerald" | "red") ?? "amber"}
          size={sizeProp}
        />
      );
    case "sensor_card":
      return (
        <SensorCardWidget
          title={title}
          entity_id={entity_id}
          icon={icon}
          show_icon={show_icon}
          size={sizeProp}
          conditions={conditions as SensorCondition[] | undefined}
        />
      );
    case "nuts_card":
      return (
        <NutsCardWidget
          title={title}
          entity_id={entity_id}
          current_entity_id={current_entity_id as string | undefined}
          icon={icon}
          max_value={max_value as number | undefined}
        />
      );
    default:
      return (
        <div className="rounded-card border border-dashed p-4 text-sm text-gray-500">
          {title || type}
        </div>
      );
  }
}

type HaEntity = { entity_id: string; attributes?: Record<string, unknown> };

const STORAGE_SCOPE = "energy";

export default function EnergyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editPasscodeModalOpen, setEditPasscodeModalOpen] = useState(false);
  const [editPasscodeInput, setEditPasscodeInput] = useState("");
  const [editPasscodeError, setEditPasscodeError] = useState<string | null>(null);
  const [layout, setLayout] = useState<Layout>([]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [welcomeTitle, setWelcomeTitle] = useState("");
  const [welcomeSubtitle, setWelcomeSubtitle] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [addTileOpen, setAddTileOpen] = useState(false);
  const [addTileStep, setAddTileStep] = useState<"type" | "entity">("type");
  const [addTileSelectedType, setAddTileSelectedType] = useState<string | null>(null);
  const [addTileEntitySearch, setAddTileEntitySearch] = useState("");
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    textMode?: "title" | "subtitle" | "text";
    entity_id: string;
    consumption_entity_id?: string;
    yield_entity_id_today?: string;
    yield_entity_id_month?: string;
    humidity_entity_id?: string;
    show_icon?: boolean;
    background_image?: string;
    background_image_dark?: string;
    width?: number;
    height?: number;
    icon?: string;
    size?: string;
    conditions?: { operator: string; value: string; color: string }[];
    image_conditions?: { operator: string; value: string; image: string; image_dark?: string }[];
    current_entity_id?: string;
    max_value?: number;
    minimal?: boolean;
    scale?: number;
    label?: string;
    color?: string;
    icon_background_color?: string;
    device_entity_ids?: string[];
    device_names?: Record<string, string>;
    cost_per_kwh?: number;
  }>({
    title: "",
    entity_id: "",
    consumption_entity_id: "",
    humidity_entity_id: "",
    show_icon: true,
    background_image: "",
    background_image_dark: "",
    width: undefined,
    height: undefined,
    icon: "",
    size: "md",
    conditions: [],
    image_conditions: [],
    minimal: false,
    scale: 1,
    label: "",
    color: "amber",
    device_entity_ids: [],
    device_names: {},
    cost_per_kwh: undefined,
  });
  const [iconSearch, setIconSearch] = useState("");
  const [sensorIconSearch, setSensorIconSearch] = useState("");
  const [powerUsageDeviceSearch, setPowerUsageDeviceSearch] = useState("");
  const [editTab, setEditTab] = useState("algemeen");
  const [uploadingEnergyBg, setUploadingEnergyBg] = useState(false);
  const [uploadingEnergyBgDark, setUploadingEnergyBgDark] = useState(false);
  const [uploadingConditionImage, setUploadingConditionImage] = useState<{ idx: number; field: "image" | "image_dark" } | null>(null);
  const [backgroundMenuOpen, setBackgroundMenuOpen] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const LONG_PRESS_MS = 500;

  const editingWidget = editingWidgetId ? widgets.find((w) => w.id === editingWidgetId) : null;

  const { data, isLoading, error } = useQuery<EnergyDashboardData>({
    queryKey: ["energy-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/energy-dashboard");
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const hint = (json as { hint?: string }).hint;
        throw new Error(hint ? `${(json as { error?: string }).error ?? "Failed to load"}. ${hint}` : (json as { error?: string }).error ?? "Failed to load");
      }
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data || initialized) return;
    const w = parseWidgets(data.widgets);
    setWidgets((prev) => (prev.length === 0 ? w : prev));
    const parsed = parseLayout(data.layout);
    setLayout(parsed.length > 0 ? parsed : []);
    setWelcomeTitle(data.welcomeTitle ?? "");
    setWelcomeSubtitle(data.welcomeSubtitle ?? "");
    setInitialized(true);
  }, [data, initialized]);

  useEffect(() => {
    if (!editMode) return;
    fetch("/api/ha/entities")
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? setEntities(d) : setEntities([])))
      .catch(() => setEntities([]));
  }, [editMode]);


  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);
  useEffect(() => {
    if (!data) return;
    const w = parseWidgets(data.widgets);
    if (w.some((x) => x.type === "stat_pill_card")) requestRefresh();
  }, [data, requestRefresh]);

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      layout: Layout;
      widgets: WidgetConfig[];
      welcomeTitle?: string;
      welcomeSubtitle?: string;
      background?: string | null;
      backgroundLight?: string | null;
      backgroundDark?: string | null;
    }) => {
      if (!data?.id) throw new Error("No dashboard id");
      const res = await fetch(`/api/energy-dashboard/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout: JSON.stringify(payload.layout),
          widgets: JSON.stringify(payload.widgets),
          ...(payload.welcomeTitle !== undefined && { welcomeTitle: payload.welcomeTitle || null }),
          ...(payload.welcomeSubtitle !== undefined && { welcomeSubtitle: payload.welcomeSubtitle || null }),
          ...(payload.background !== undefined && { background: payload.background }),
          ...(payload.backgroundLight !== undefined && { backgroundLight: payload.backgroundLight }),
          ...(payload.backgroundDark !== undefined && { backgroundDark: payload.backgroundDark }),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["energy-dashboard"], (old: unknown) =>
        old && updated ? { ...(old as object), ...(updated as object) } : old ?? updated
      );
    },
  });

  function clearLongPressTimer() {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function startLongPressForEdit() {
    if (editMode) return;
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      setEditMode(true);
    }, LONG_PRESS_MS);
  }

  const handleSave = () => {
    setEditingWidgetId(null);
    setEditMode(false);
    saveMutation.mutate({ layout, widgets, welcomeTitle, welcomeSubtitle });
  };

  function handleAddTile(type: string, entityId: string, titleOverride?: string): string | undefined {
    const newId = generateId();
    const newWidget: WidgetConfig = {
      id: newId,
      type,
      title: titleOverride ?? (type === "text_card" ? t("editPanel.newText") : type === "device_consumption_card" ? "Verbruik per apparaat" : type.replace(/_/g, " ")),
      entity_id: entityId,
      ...(type === "text_card" && { textMode: "title" as const, show_icon: false, icon: "Type" }),
      ...(type === "device_consumption_card" && { device_entity_ids: entityId ? [entityId] : [], device_names: {} }),
    };
    const maxY = layout.length === 0 ? 0 : Math.max(...layout.map((item) => item.y + item.h));
    const isTextCard = type === "text_card";
    const newLayoutItem: LayoutItem = {
      i: newId,
      x: 0,
      y: maxY,
      w: 4,
      h: isTextCard ? 1 : 2,
    };
    const newWidgets = [...widgets, newWidget];
    const newLayout = [...layout, newLayoutItem];

    queryClient.setQueryData(["energy-dashboard"], (old: unknown) => {
      if (!old || typeof old !== "object") return old;
      return { ...(old as object), widgets: JSON.stringify(newWidgets), layout: JSON.stringify(newLayout) };
    });

    flushSync(() => {
      setWidgets(newWidgets);
      setLayout(newLayout);
    });
    setAddTileOpen(false);
    setAddTileStep("type");
    setAddTileSelectedType(null);
    saveMutation.mutate({ layout: newLayout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
    return type === "nuts_card" || type === "energy_monitor_card" || type === "power_usage_card" || type === "device_consumption_card" || type === "stat_pill_card" ? newId : undefined;
  }

  const domain = addTileSelectedType ? WIDGET_TYPE_DOMAIN[addTileSelectedType] : null;
  const entitiesToShow = domain != null ? entities.filter((e) => e.entity_id.startsWith(domain + ".")) : entities;

  function handleRemoveTile(widgetId: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setLayout((prev) => prev.filter((item) => item.i !== widgetId));
  }

  function handleUpdateTile(widgetId: string, updates: Partial<WidgetConfig>) {
    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, ...updates } : w)));
    setEditingWidgetId(null);
  }

  async function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>, field: "background" | "backgroundLight" | "backgroundDark") {
    const file = e.target.files?.[0];
    if (!file || !data?.id) return;
    e.target.value = "";
    setUploadingBackground(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const payload: Record<string, string | null> = { [field]: json.url };
      await fetch(`/api/energy-dashboard/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      queryClient.invalidateQueries({ queryKey: ["energy-dashboard"] });
      window.dispatchEvent(new Event("page-background-changed"));
    } finally {
      setUploadingBackground(false);
      setBackgroundMenuOpen(false);
    }
  }

  useEffect(() => {
    if (!editingWidget) return;
    const isCategoryCard = editingWidget.type === "text_card";
    const deriveTextMode = (): "title" | "subtitle" | "text" => {
      if (editingWidget.type === "text_card" && (editingWidget as { textMode?: string }).textMode) {
        const m = (editingWidget as { textMode: string }).textMode;
        if (m === "title" || m === "subtitle" || m === "text") return m;
      }
      return "title";
    };
    setEditForm({
      title: isCategoryCard ? (editingWidget.title ?? "") : (editingWidget.title ?? ""),
      entity_id: editingWidget.entity_id ?? "",
      consumption_entity_id: editingWidget.consumption_entity_id ?? "",
      yield_entity_id_today: (editingWidget as { yield_entity_id_today?: string }).yield_entity_id_today ?? "",
      yield_entity_id_month: (editingWidget as { yield_entity_id_month?: string }).yield_entity_id_month ?? "",
      humidity_entity_id: editingWidget.humidity_entity_id ?? "",
      show_icon: isCategoryCard ? ((editingWidget as { show_icon?: boolean }).show_icon ?? false) : (editingWidget.show_icon !== false),
      background_image: editingWidget.background_image ?? "",
      background_image_dark: editingWidget.background_image_dark ?? "",
      width: editingWidget.width ?? undefined,
      height: editingWidget.height ?? undefined,
      icon: isCategoryCard ? (editingWidget.icon ?? "Type") : (editingWidget.icon ?? ""),
      size: editingWidget.size ?? "md",
      conditions: editingWidget.conditions ?? [],
      image_conditions: editingWidget.image_conditions ?? [],
      current_entity_id: editingWidget.current_entity_id ?? "",
      max_value: editingWidget.max_value ?? undefined,
      minimal: editingWidget.minimal ?? false,
      scale: editingWidget.scale ?? 1,
      label: editingWidget.label ?? "",
      color: editingWidget.color ?? "amber",
      icon_background_color: editingWidget.icon_background_color ?? "",
      device_entity_ids: editingWidget.device_entity_ids ?? [],
      device_names: editingWidget.device_names ?? {},
      cost_per_kwh: editingWidget.cost_per_kwh ?? undefined,
      textMode: isCategoryCard ? deriveTextMode() : undefined,
    });
    setSensorIconSearch(editingWidget.type === "sensor_card" ? (editingWidget.icon ?? "") : "");
    if (editingWidget.type === "power_usage_card" || editingWidget.type === "device_consumption_card") setPowerUsageDeviceSearch("");
    if (editingWidget.type === "energy_monitor_card") setEditTab("achtergrond");
    else setEditTab("algemeen");
  }, [editingWidget]);

  const layoutForGrid = layout.filter((item) => {
    const type = widgets.find((w) => w.id === item.i)?.type;
    return type && !FLOATING_WIDGET_TYPES.has(type);
  });
  const layoutMap = new Map(layout.map((item) => [item.i, item]));

  const headerEndAction = (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setBackgroundMenuOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          aria-label={t("editPanel.roomBackground")}
          title={t("editPanel.roomBackground")}
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
        </button>
        {backgroundMenuOpen && (
          <>
            <div className="fixed inset-0 z-[299]" aria-hidden onClick={() => setBackgroundMenuOpen(false)} />
            <div className="absolute right-0 top-full z-[300] mt-1 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-gray-900">
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleBackgroundUpload(e, "background")}
              />
              <button
                type="button"
                onClick={() => backgroundInputRef.current?.click()}
                disabled={uploadingBackground}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10 disabled:opacity-50"
              >
                {uploadingBackground ? t("editPanel.uploading") : t("editPanel.uploadImage")} (fallback)
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => handleBackgroundUpload(e as unknown as React.ChangeEvent<HTMLInputElement>, "backgroundLight");
                  input.click();
                }}
                disabled={uploadingBackground}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10 disabled:opacity-50"
              >
                {uploadingBackground ? t("editPanel.uploading") : t("editPanel.uploadImage")} (light)
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => handleBackgroundUpload(e as unknown as React.ChangeEvent<HTMLInputElement>, "backgroundDark");
                  input.click();
                }}
                disabled={uploadingBackground}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10 disabled:opacity-50"
              >
                {uploadingBackground ? t("editPanel.uploading") : t("editPanel.uploadImage")} (dark)
              </button>
            </div>
          </>
        )}
      </div>
      {editMode ? (
        <>
          <button
            type="button"
            onClick={() => setAddTileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90"
            style={{ backgroundColor: "#4D2FB2" }}
            aria-label={t("editPanel.addTile")}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20"
            aria-label={t("editPanel.doneEditing")}
          >
            <Check className="h-4 w-4" />
          </button>
        </>
      ) : getEditModeAllowed() ? (
        <>
          <button
            type="button"
            onClick={() => {
              const passcode = getEditModePasscode().trim();
              if (passcode) {
                setEditPasscodeInput("");
                setEditPasscodeError(null);
                setEditPasscodeModalOpen(true);
              } else {
                setEditMode(true);
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90"
            style={{ backgroundColor: "#4D2FB2" }}
            aria-label={t("editPanel.editDashboard")}
          >
            <Pencil className="h-4 w-4" />
          </button>
          {editPasscodeModalOpen && typeof document !== "undefined" && createPortal(
            <div className="fixed inset-0 z-[300]" aria-modal="true" role="dialog">
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden onClick={() => { setEditPasscodeModalOpen(false); setEditPasscodeError(null); setEditPasscodeInput(""); }} />
              <div className="fixed left-1/2 top-1/2 z-[301] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5 shadow-2xl">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t("settings.dashboard.enterPasscode")}</h3>
                <input
                  type="password"
                  value={editPasscodeInput}
                  onChange={(e) => { setEditPasscodeInput(e.target.value); setEditPasscodeError(null); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (checkEditModePasscode(editPasscodeInput)) {
                        setEditMode(true);
                        setEditPasscodeModalOpen(false);
                        setEditPasscodeInput("");
                        setEditPasscodeError(null);
                      } else setEditPasscodeError(t("settings.dashboard.wrongPasscode"));
                    }
                  }}
                  placeholder={t("settings.dashboard.editModePasscodePlaceholder")}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500"
                  autoFocus
                  autoComplete="off"
                />
                {editPasscodeError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{editPasscodeError}</p>}
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => { setEditPasscodeModalOpen(false); setEditPasscodeError(null); setEditPasscodeInput(""); }} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10">{t("editPanel.close")}</button>
                  <button type="button" onClick={() => { if (checkEditModePasscode(editPasscodeInput)) { setEditMode(true); setEditPasscodeModalOpen(false); setEditPasscodeInput(""); setEditPasscodeError(null); } else setEditPasscodeError(t("settings.dashboard.wrongPasscode")); }} className="rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: "#4D2FB2" }}>{t("settings.dashboard.unlock")}</button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      ) : null}
    </>
  );

  if (isLoading || error) {
    return (
      <AppShell activeTab="/energy">
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {error ? (error.message || t("editPanel.dashboardNotFound")) : t("editPanel.loading")}
          </p>
          {error && (
            <button
              type="button"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["energy-dashboard"] })}
              className="rounded-lg bg-[#4D2FB2] px-4 py-2 text-sm text-white hover:opacity-90"
            >
              {t("editPanel.retry")}
            </button>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeTab="/energy"
      headerEndAction={headerEndAction}
      welcomeTitle={welcomeTitle || undefined}
      welcomeSubtitle={welcomeSubtitle || undefined}
      hideWelcome={false}
      welcomeEditable={editMode}
      onWelcomeChange={editMode ? ({ title, subtitle }) => { setWelcomeTitle(title); setWelcomeSubtitle(subtitle); } : undefined}
    >
      <div
        className="space-y-6 overflow-x-hidden min-h-0"
        {...(!editMode && getEditModeAllowed() && {
          onPointerDown: (e: React.PointerEvent) => { if ((e.target as HTMLElement).closest?.("button, a, [role=button]")) return; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); clearLongPressTimer(); longPressTimerRef.current = setTimeout(() => { longPressTimerRef.current = null; setEditMode(true); }, LONG_PRESS_MS); },
          onPointerUp: (e: React.PointerEvent) => { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); clearLongPressTimer(); },
          onPointerLeave: (e: React.PointerEvent) => { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); clearLongPressTimer(); },
          onPointerCancel: (e: React.PointerEvent) => { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); clearLongPressTimer(); },
          style: { touchAction: "none" },
        })}
      >
        <div className="flex items-center justify-end">
          <OfflinePill />
        </div>

        <div className={cn("rounded-card overflow-hidden", editMode && "grid-edit-touch")}>
          <ReactGridLayout
            className="layout"
            layout={layoutForGrid}
            onLayoutChange={(newLayout) => setLayout(newLayout)}
            cols={12}
            rowHeight={52}
            width={1200}
            margin={[6, 4]}
            containerPadding={[0, 0]}
            compactType="vertical"
            isDraggable={editMode}
            isResizable={editMode}
            draggableHandle={editMode ? ".tile-drag-handle" : undefined}
          >
            {widgets
              .filter((w) => !FLOATING_WIDGET_TYPES.has(w.type))
              .map((w) => {
                const item = layoutMap.get(w.id);
                if (!item) return null;
                return (
                  <div key={w.id} className="relative h-full w-full">
                    {editMode && (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingWidgetId(w.id)}
                          className="absolute -right-8 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-white shadow hover:bg-gray-700"
                          aria-label={t("editPanel.editTile")}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveTile(w.id)}
                          className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                          aria-label={t("editPanel.remove")}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    <div className={cn("h-full w-full min-h-[44px]", editMode && "tile-drag-handle cursor-grab touch-none select-none")}>
                      <WidgetByType
                        type={w.type}
                        title={w.title}
                        entity_id={w.entity_id}
                        consumption_entity_id={w.consumption_entity_id}
                        yield_entity_id_today={(w as { yield_entity_id_today?: string }).yield_entity_id_today}
                        yield_entity_id_month={(w as { yield_entity_id_month?: string }).yield_entity_id_month}
                        show_icon={w.show_icon}
                        background_image={w.background_image}
                        background_image_dark={w.background_image_dark}
                        image_conditions={w.image_conditions as ImageCondition[] | undefined}
                        icon={w.icon}
                        size={w.size}
                        conditions={w.conditions}
                        current_entity_id={w.current_entity_id}
                        max_value={w.max_value}
                        minimal={w.minimal}
                        label={w.label}
                        color={w.color}
                        device_entity_ids={w.device_entity_ids}
                        device_names={w.device_names}
                        cost_per_kwh={w.cost_per_kwh}
                        textMode={w.textMode}
                        onMoreClick={editMode ? () => setEditingWidgetId(w.id) : undefined}
                      />
                    </div>
                  </div>
                );
              })}
          </ReactGridLayout>
        </div>

        {widgets.filter((w) => w.type === "text_card").map((w, i) => (
          <FloatingTextCard
            key={w.id}
            widget={{ id: w.id, title: w.title ?? t("editPanel.newText"), textMode: (w as { textMode?: "title" | "subtitle" | "text" }).textMode ?? "title", show_icon: w.show_icon ?? false, icon: w.icon ?? "Type", width: (w as { width?: number }).width, entity_id: (w as { entity_id?: string }).entity_id }}
            widgetIndex={i}
            editMode={editMode}
            storageScope={STORAGE_SCOPE}
            onEnterEditMode={() => setEditMode(true)}
            onEdit={() => { setEditMode(true); setEditingWidgetId(w.id); }}
            onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
          />
        ))}

        {widgets.filter((w) => w.type === "solar_card").map((w) => (
          <FloatingSolarCard
            key={w.id}
            title={w.title ?? "Zonnepanelen"}
            entity_id={w.entity_id}
            yield_entity_id_today={(w as { yield_entity_id_today?: string }).yield_entity_id_today}
            yield_entity_id_month={(w as { yield_entity_id_month?: string }).yield_entity_id_month}
            editMode={editMode}
            storageScope={`${STORAGE_SCOPE}-${w.id}`}
            onEnterEditMode={() => setEditMode(true)}
            onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
            onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
          />
        ))}

        {widgets.filter((w) => w.type === "power_usage_card").map((w, i) => (
          <FloatingPowerUsageCard
            key={w.id}
            title={w.title ?? "Stroomverbruik"}
            entity_id={w.entity_id}
            cost_per_kwh={w.cost_per_kwh}
            width={w.width}
            height={w.height}
            editMode={editMode}
            storageScope={`${STORAGE_SCOPE}-${w.id}`}
            onEnterEditMode={() => setEditMode(true)}
            onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
            onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
          />
        ))}

        {typeof document !== "undefined" &&
          widgets.some((w) => w.type === "device_consumption_card") &&
          createPortal(
            widgets
              .filter((w) => w.type === "device_consumption_card")
              .map((w) => (
                <FloatingDeviceConsumptionCard
                  key={w.id}
                  title={w.title ?? "Verbruik per apparaat"}
                  device_entity_ids={w.device_entity_ids}
                  device_names={w.device_names}
                  width={w.width}
                  height={w.height}
                  editMode={editMode}
                  storageScope={`${STORAGE_SCOPE}-${w.id}`}
                  onEnterEditMode={() => setEditMode(true)}
                  onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
                  onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
                />
              )),
            document.body
          )}

        {widgets.filter((w) => w.type === "energy_monitor_card").map((w) => (
          <FloatingEnergyMonitorCard
            key={w.id}
            title={w.title ?? "Afbeeldingskaart"}
            entity_id={w.entity_id}
            background_image={w.background_image}
            background_image_dark={w.background_image_dark}
            image_conditions={w.image_conditions as ImageCondition[] | undefined}
            minimal={w.minimal}
            scale={w.scale}
            editMode={editMode}
            storageScope={`${STORAGE_SCOPE}-${w.id}`}
            onEnterEditMode={() => setEditMode(true)}
            onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
            onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
          />
        ))}

        {typeof document !== "undefined" && widgets.some((w) => w.type === "stat_pill_card") && createPortal(
          widgets.filter((w) => w.type === "stat_pill_card").map((w, i) => (
            <FloatingStatPillCard
              key={w.id}
              widgetId={w.id}
              widgetIndex={i}
              title={w.title ?? "Stat"}
              entity_id={w.entity_id}
              label={w.label}
              icon={w.icon}
              color={(w.color as "amber" | "purple" | "emerald" | "red") ?? "amber"}
              conditions={w.conditions as SensorCondition[] | undefined}
              size={(w.size as "sm" | "md" | "lg") ?? "md"}
              editMode={editMode}
              storageScope={STORAGE_SCOPE}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          )),
          document.body
        )}

        {typeof document !== "undefined" && widgets.some((w) => w.type === "sensor_card") && createPortal(
          widgets.filter((w) => w.type === "sensor_card").map((w, i) => (
            <FloatingSensorCard
              key={w.id}
              widgetId={w.id}
              widgetIndex={i}
              title={w.title ?? "Sensor"}
              entity_id={w.entity_id}
              icon={w.icon}
              show_icon={w.show_icon !== false}
              size={(w.size as "sm" | "md" | "lg") ?? "md"}
              conditions={w.conditions as SensorCondition[] | undefined}
              editMode={editMode}
              storageScope={STORAGE_SCOPE}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          )),
          document.body
        )}

        {widgets.filter((w) => w.type === "nuts_card").map((w, i) => (
          <FloatingNutsCard
            key={w.id}
            widget={{ id: w.id, title: w.title ?? "Gas", entity_id: w.entity_id, current_entity_id: w.current_entity_id, icon: w.icon, icon_background_color: w.icon_background_color, max_value: w.max_value, width: w.width ?? 250, height: w.height ?? 130 }}
            widgetIndex={i}
            editMode={editMode}
            storageScope={STORAGE_SCOPE}
            onEnterEditMode={() => setEditMode(true)}
            onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
            onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
          />
        ))}

        {editingWidgetId && editingWidget && typeof document !== "undefined" && createPortal(
          <EditPanelModal
            editingWidget={editingWidget}
            editForm={editForm}
            setEditForm={setEditForm}
            editTab={editTab}
            setEditTab={setEditTab}
            entities={entities}
            widgets={widgets}
            layout={layout}
            welcomeTitle={welcomeTitle}
            welcomeSubtitle={welcomeSubtitle}
            saveMutation={saveMutation}
            setEditingWidgetId={setEditingWidgetId}
            handleUpdateTile={handleUpdateTile}
            handleRemoveTile={handleRemoveTile}
            t={t}
            uploadingEnergyBg={uploadingEnergyBg}
            setUploadingEnergyBg={setUploadingEnergyBg}
            uploadingEnergyBgDark={uploadingEnergyBgDark}
            setUploadingEnergyBgDark={setUploadingEnergyBgDark}
            uploadingConditionImage={uploadingConditionImage}
            setUploadingConditionImage={setUploadingConditionImage}
            sensorIconSearch={sensorIconSearch}
            setSensorIconSearch={setSensorIconSearch}
            powerUsageDeviceSearch={powerUsageDeviceSearch}
            setPowerUsageDeviceSearch={setPowerUsageDeviceSearch}
          />,
          document.body
        )}

        {addTileOpen && typeof document !== "undefined" && createPortal(
          <>
            <div className="fixed inset-0 z-[300] bg-black/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden onClick={() => { setAddTileOpen(false); setAddTileStep("type"); setAddTileSelectedType(null); setAddTileEntitySearch(""); }} />
            <div className="fixed top-4 right-4 bottom-4 z-[301] w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl">
              <div className="shrink-0 flex items-center justify-between p-5 pb-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{addTileStep === "type" ? t("editPanel.addTile") : t("editPanel.chooseEntity")}</h3>
                <button type="button" onClick={() => { setAddTileOpen(false); setAddTileStep("type"); setAddTileSelectedType(null); setAddTileEntitySearch(""); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400" aria-label={t("editPanel.close")}><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4">
                {addTileStep === "type" ? (
                  <div className="grid grid-cols-3 gap-2">
                    {ADDABLE_WIDGET_TILES.map(({ type, label, Icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          if (type === "text_card") { handleAddTile("text_card", "", t("editPanel.newText")); setAddTileOpen(false); return; }
                          if (type === "energy_monitor_card") { const newId = handleAddTile("energy_monitor_card", "", "Afbeeldingskaart"); if (newId) setEditingWidgetId(newId); setAddTileOpen(false); return; }
                          if (type === "power_usage_card") { const newId = handleAddTile("power_usage_card", "", "Stroomverbruik"); if (newId) setEditingWidgetId(newId); setAddTileOpen(false); return; }
                          if (type === "device_consumption_card") { const newId = handleAddTile("device_consumption_card", "", "Verbruik per apparaat"); if (newId) setEditingWidgetId(newId); setAddTileOpen(false); return; }
                          setAddTileSelectedType(type);
                          setAddTileStep("entity");
                        }}
                        className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 py-4 px-3 transition-colors hover:border-[#4D2FB2]/40 hover:bg-[#4D2FB2]/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#4D2FB2]/50 dark:hover:bg-[#4D2FB2]/10"
                      >
                        <Icon className="h-7 w-7 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <button type="button" onClick={() => { setAddTileStep("type"); setAddTileSelectedType(null); setAddTileEntitySearch(""); }} className="mb-3 self-start px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">← Terug</button>
                    <input type="text" value={addTileEntitySearch} onChange={(e) => setAddTileEntitySearch(e.target.value)} placeholder={t("editPanel.addTileSearchPlaceholder")} className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" autoFocus />
                    <div className="overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                      {(() => {
                        const q = addTileEntitySearch.trim().toLowerCase();
                        const filtered = q ? entitiesToShow.filter((e) => { const name = ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase(); return name.includes(q) || e.entity_id.toLowerCase().includes(q); }) : entitiesToShow;
                        if (filtered.length === 0) return <p className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">{entitiesToShow.length === 0 ? t("editPanel.noEntitiesFound") : t("editPanel.noSearchResults")}</p>;
                        return filtered.map((e) => {
                          const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                          return (
                            <button key={e.entity_id} type="button" onClick={() => { if (!addTileSelectedType) return; const titleOverride = addTileSelectedType === "nuts_card" ? (name || "Gas") : addTileSelectedType === "energy_monitor_card" ? (name || "Afbeeldingskaart") : addTileSelectedType === "power_usage_card" ? (name || "Stroomverbruik") : addTileSelectedType === "device_consumption_card" ? (name || "Verbruik per apparaat") : addTileSelectedType === "stat_pill_card" ? (name || "Stat") : undefined; const newId = handleAddTile(addTileSelectedType, e.entity_id, titleOverride); if ((addTileSelectedType === "nuts_card" || addTileSelectedType === "stat_pill_card" || addTileSelectedType === "device_consumption_card") && newId) setEditingWidgetId(newId); setAddTileOpen(false); setAddTileStep("type"); setAddTileSelectedType(null); setAddTileEntitySearch(""); }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 truncate" title={e.entity_id}>{name}</button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
      </div>
    </AppShell>
  );
}
