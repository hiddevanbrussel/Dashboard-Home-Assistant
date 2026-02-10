"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { useState, useEffect, useRef } from "react";
import ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Check, Pencil, Plus, X } from "lucide-react";

type LayoutItem = ReactGridLayout.Layout;
type Layout = LayoutItem[];
import {
  EnergyUsageWidget,
  LightControlWidget,
  WifiWidget,
  SolarChargeWidget,
  ClimateWidget,
  LightingBrightnessWidget,
  MediaCardWidget,
  FloatingMediaCard,
  LightCardWidget,
  FloatingLightCard,
  LIGHT_ICON_OPTIONS,
  ClimateCardWidget,
  ClimateCard2Widget,
  SolarCardWidget,
  FloatingClimateCard,
  FloatingSolarCard,
  FloatingWeatherCard,
  WeatherCardWidget,
  VacuumCardWidget,
  FloatingVacuumCard,
  SensorCardWidget,
  FloatingSensorCard,
  CLIMATE_ICON_OPTIONS,
  VACUUM_ICON_OPTIONS,
  SENSOR_ICON_OPTIONS,
  SENSOR_CONDITION_COLORS,
  SENSOR_CONDITION_OPERATORS,
} from "@/components/widgets";
import type { WidgetConfig } from "@/stores/onboarding-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useEntityStatePolling } from "@/hooks/use-entity-state";
import { OfflinePill } from "@/components/offline-pill";
import { cn } from "@/lib/utils";

/** Alleen deze types kunnen als tile worden toegevoegd (floating cards). */
const ADDABLE_WIDGET_TYPES = ["climate_card", "climate_card_2", "light_card", "media_card", "solar_card", "sensor_card", "weather_card", "vacuum_card"] as const;

/** Map widget type to HA domain for filtering entities */
const WIDGET_TYPE_DOMAIN: Record<string, string> = {
  energy_usage: "sensor",
  light_control: "light",
  wifi: "sensor",
  solar_charge: "sensor",
  climate: "climate",
  climate_card: "climate",
  climate_card_2: "climate",
  light_card: "light",
  lighting_brightness: "light",
  media_card: "media_player",
  solar_card: "sensor",
  sensor_card: "sensor",
  weather_card: "weather",
  vacuum_card: "vacuum",
};

type DashboardData = {
  id: string;
  name: string;
  theme: string;
  layout: string | null;
  widgets: string | null;
  background: string | null;
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
  humidity_entity_id,
  show_icon,
  script_ids,
  script_names,
  cleaned_area_entity_id,
  icon,
  size,
  conditions,
}: {
  type: string;
  title: string;
  entity_id: string;
  consumption_entity_id?: string;
  humidity_entity_id?: string;
  show_icon?: boolean;
  script_ids?: string[];
  script_names?: Record<string, string>;
  cleaned_area_entity_id?: string;
  icon?: string;
  size?: string;
  conditions?: { operator: string; value: string; color: string }[];
}) {
  const sizeProp = (size as "sm" | "md" | "lg") ?? "md";
  const live = useEntityStateStore((s) => s.getState(entity_id));
  const num = live?.state != null ? Number(live.state) : undefined;
  const onOff = live?.state === "on" ? "on" : "off";

  switch (type) {
    case "energy_usage":
      return <EnergyUsageWidget title={title} entity_id={entity_id} size={sizeProp} value={num} />;
    case "light_control":
      return (
        <LightControlWidget
          title={title}
          entity_id={entity_id}
          size={sizeProp}
          value={num}
          state={live?.state === "on" ? "on" : "off"}
        />
      );
    case "wifi":
      return <WifiWidget title={title} entity_id={entity_id} size={sizeProp} value={onOff} />;
    case "solar_charge":
      return <SolarChargeWidget title={title} entity_id={entity_id} size={sizeProp} value={num} />;
    case "climate":
      return <ClimateWidget title={title} entity_id={entity_id} size={sizeProp} value={num} />;
    case "lighting_brightness":
      return <LightingBrightnessWidget title={title} entity_id={entity_id} size={sizeProp} value={num} />;
    case "media_card":
      return <MediaCardWidget title={title} entity_id={entity_id} size={sizeProp} />;
    case "climate_card":
      return <ClimateCardWidget title={title} entity_id={entity_id} size={sizeProp} />;
    case "climate_card_2":
      return (
        <ClimateCard2Widget
          title={title}
          entity_id={entity_id}
          humidity_entity_id={humidity_entity_id}
          size={sizeProp}
        />
      );
    case "light_card":
      return (
        <LightCardWidget
          title={title}
          entity_id={entity_id}
          icon={icon}
          size={sizeProp}
        />
      );
    case "solar_card":
      return (
        <SolarCardWidget
          title={title}
          entity_id={entity_id}
          consumption_entity_id={consumption_entity_id}
          size={sizeProp}
        />
      );
    case "weather_card":
      return (
        <WeatherCardWidget
          title={title}
          entity_id={entity_id}
          show_icon={show_icon}
          size={sizeProp}
        />
      );
    case "vacuum_card":
      return (
        <VacuumCardWidget
          title={title}
          entity_id={entity_id}
          script_ids={script_ids}
          script_names={script_names}
          cleaned_area_entity_id={cleaned_area_entity_id}
          icon={icon}
          size={sizeProp}
        />
      );
    case "sensor_card":
      return (
        <SensorCardWidget
          title={title}
          entity_id={entity_id}
          icon={icon}
          size={sizeProp}
          conditions={conditions}
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

export default function DashboardEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params?.id as string;
  const [editMode, setEditMode] = useState(false);
  const [layout, setLayout] = useState<Layout>([]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [welcomeTitle, setWelcomeTitle] = useState<string>("");
  const [welcomeSubtitle, setWelcomeSubtitle] = useState<string>("");
  const [initialized, setInitialized] = useState(false);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [addTileOpen, setAddTileOpen] = useState(false);
  const [addTileStep, setAddTileStep] = useState<"type" | "entity">("type");
  const [addTileSelectedType, setAddTileSelectedType] = useState<string | null>(null);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    entity_id: string;
    consumption_entity_id?: string;
    humidity_entity_id?: string;
    show_icon?: boolean;
    script_ids?: string[];
    script_names?: Record<string, string>;
    cleaned_area_entity_id?: string;
    icon?: string;
    size?: string;
    conditions?: { operator: string; value: string; color: string }[];
  }>({
    title: "",
    entity_id: "",
    consumption_entity_id: "",
    humidity_entity_id: "",
    show_icon: true,
    script_ids: [],
    script_names: {},
    cleaned_area_entity_id: "",
    icon: "",
    size: "md",
    conditions: [],
  });
  const addTileRef = useRef<HTMLDivElement>(null);
  const [iconSearch, setIconSearch] = useState("");
  const [vacuumIconSearch, setVacuumIconSearch] = useState("");
  const [sensorIconSearch, setSensorIconSearch] = useState("");
  const [sensorCardEditTab, setSensorCardEditTab] = useState<"general" | "conditions">("general");

  const editingWidget = editingWidgetId
    ? widgets.find((w) => w.id === editingWidgetId)
    : null;

  useEffect(() => {
    if (editingWidget) {
      setEditForm({
        title: editingWidget.title ?? "",
        entity_id: editingWidget.entity_id ?? "",
        consumption_entity_id: editingWidget.consumption_entity_id ?? "",
        humidity_entity_id: editingWidget.humidity_entity_id ?? "",
        show_icon: editingWidget.show_icon !== false,
        script_ids: editingWidget.script_ids ?? [],
        script_names: editingWidget.script_names ?? {},
        cleaned_area_entity_id: editingWidget.cleaned_area_entity_id ?? "",
        icon: editingWidget.icon ?? "",
        size: editingWidget.size ?? "md",
        conditions: editingWidget.conditions ?? [],
      });
      setIconSearch("");
      setVacuumIconSearch(editingWidget.type === "vacuum_card" ? (editingWidget.icon ?? "") : "");
      setSensorIconSearch(editingWidget.type === "sensor_card" ? (editingWidget.icon ?? "") : "");
      if (editingWidget.type === "sensor_card") setSensorCardEditTab("general");
    }
  }, [editingWidget?.id, editingWidget?.title, editingWidget?.entity_id, editingWidget?.consumption_entity_id, editingWidget?.humidity_entity_id, editingWidget?.show_icon, editingWidget?.script_ids, editingWidget?.script_names, editingWidget?.cleaned_area_entity_id, editingWidget?.icon, editingWidget?.size, editingWidget?.conditions, editingWidget?.type]);

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard", id],
    queryFn: async () => {
      const res = await fetch(`/api/dashboards/${id}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: !!id,
  });

  useEntityStatePolling();

  useEffect(() => {
    if (!data || initialized) return;
    const w = parseWidgets(data.widgets);
    setWidgets(w);
    const parsed = parseLayout(data.layout);
    if (parsed.length > 0) {
      setLayout(parsed);
    } else if (w.length > 0) {
      setLayout(
        w.map((widget, i) => ({
          i: widget.id,
          x: (i % 3) * 4,
          y: Math.floor(i / 3) * 2,
          w: 4,
          h: 2,
        }))
      );
    }
    setWelcomeTitle(data.welcomeTitle ?? "");
    setWelcomeSubtitle(data.welcomeSubtitle ?? "");
    setInitialized(true);
  }, [data, initialized]);

  useEffect(() => {
    if (!editMode) return;
    fetch("/api/ha/entities")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setEntities(data) : setEntities([])))
      .catch(() => setEntities([]));
  }, [editMode]);

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      layout: Layout;
      widgets: WidgetConfig[];
      welcomeTitle?: string;
      welcomeSubtitle?: string;
    }) => {
      const res = await fetch(`/api/dashboards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout: JSON.stringify(payload.layout),
          widgets: JSON.stringify(payload.widgets),
          ...(payload.welcomeTitle !== undefined && { welcomeTitle: payload.welcomeTitle || null }),
          ...(payload.welcomeSubtitle !== undefined && { welcomeSubtitle: payload.welcomeSubtitle || null }),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", id] });
    },
  });

  const onLayoutChange = (newLayout: Layout) => {
    setLayout((prev) => {
      const floatingItems = prev.filter((item) => {
        const type = widgets.find((w) => w.id === item.i)?.type;
        return type === "media_card" || type === "climate_card";
      });
      return [...newLayout, ...floatingItems];
    });
  };

  const layoutForGrid = layout.filter((item) => {
    const type = widgets.find((w) => w.id === item.i)?.type;
    return type !== "media_card" && type !== "climate_card" && type !== "climate_card_2" && type !== "light_card" && type !== "solar_card" && type !== "sensor_card" && type !== "weather_card" && type !== "vacuum_card";
  });
  const layoutMap = new Map(layout.map((item) => [item.i, item]));

  const handleSave = () => {
    saveMutation.mutate({ layout, widgets, welcomeTitle, welcomeSubtitle });
    setEditMode(false);
  };

  function handleAddTile(type: string, entityId: string) {
    const newId = crypto.randomUUID();
    const newWidget: WidgetConfig = {
      id: newId,
      type,
      title: type.replace(/_/g, " "),
      entity_id: entityId,
    };
    const maxY = layout.length === 0 ? 0 : Math.max(...layout.map((item) => item.y + item.h));
    const newLayoutItem: LayoutItem = {
      i: newId,
      x: 0,
      y: maxY,
      w: 4,
      h: 2,
    };
    const newWidgets = [...widgets, newWidget];
    const newLayout =
      type === "solar_card" || type === "sensor_card" || type === "weather_card" || type === "climate_card" || type === "climate_card_2" || type === "light_card" || type === "vacuum_card"
        ? layout
        : [...layout, newLayoutItem];
    setWidgets(newWidgets);
    setLayout(newLayout);
    setAddTileOpen(false);
    setAddTileStep("type");
    setAddTileSelectedType(null);
    saveMutation.mutate({ layout: newLayout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  const domain = addTileSelectedType ? WIDGET_TYPE_DOMAIN[addTileSelectedType] : null;
  const entitiesToShow =
    domain != null
      ? entities.filter((e) => e.entity_id.startsWith(domain + "."))
      : entities;

  function handleRemoveTile(widgetId: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setLayout((prev) => prev.filter((item) => item.i !== widgetId));
  }

  function handleUpdateTile(
    widgetId: string,
    updates: { title?: string; entity_id?: string; consumption_entity_id?: string; humidity_entity_id?: string; show_icon?: boolean; script_ids?: string[]; script_names?: Record<string, string>; cleaned_area_entity_id?: string; icon?: string; size?: string; conditions?: { operator: string; value: string; color: string }[] }
  ) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, ...updates } : w))
    );
    setEditingWidgetId(null);
  }

  if (!id) {
    return (
      <AppShell activeTab="/dashboards">
        <p className="text-sm text-gray-500">Invalid dashboard id.</p>
      </AppShell>
    );
  }

  useEffect(() => {
    if (error && id) router.replace("/dashboards");
  }, [error, id, router]);

  if (isLoading || error) {
    return (
      <AppShell activeTab="/dashboards">
        <p className="text-sm text-gray-500">
          {error ? "Dashboard not found, redirecting…" : "Loading…"}
        </p>
      </AppShell>
    );
  }

  const headerEndAction = (
    <>
      {editMode ? (
        <>
          <div className="relative" ref={addTileRef}>
            <button
              type="button"
              onClick={() => setAddTileOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90"
              style={{ backgroundColor: "#4D2FB2" }}
              aria-label="Add tile"
            >
              <Plus className="h-4 w-4" />
            </button>
            {addTileOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  aria-hidden
                  onClick={() => {
                    setAddTileOpen(false);
                    setAddTileStep("type");
                    setAddTileSelectedType(null);
                  }}
                />
                <div className="absolute right-0 top-full z-30 mt-1 w-64 max-h-80 flex flex-col rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-800">
                  {addTileStep === "type" ? (
                    <div className="py-1">
                      {ADDABLE_WIDGET_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setAddTileSelectedType(type);
                            setAddTileStep("entity");
                          }}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          {type.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setAddTileStep("type");
                          setAddTileSelectedType(null);
                        }}
                        className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border-b border-gray-100 dark:border-white/10"
                      >
                        ← {addTileSelectedType?.replace(/_/g, " ")} – choose entity
                      </button>
                      <div className="overflow-auto py-1 max-h-56">
                        {entitiesToShow.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            No entities found. Check Settings for your HA connection.
                          </p>
                        ) : (
                          entitiesToShow.map((e) => {
                            const name =
                              (e.attributes as { friendly_name?: string })?.friendly_name ??
                              e.entity_id;
                            return (
                              <button
                                key={e.entity_id}
                                type="button"
                                onClick={() =>
                                  addTileSelectedType &&
                                  handleAddTile(addTileSelectedType, e.entity_id)
                                }
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 truncate"
                                title={e.entity_id}
                              >
                                {name}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20"
            aria-label="Done editing"
          >
            <Check className="h-4 w-4" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setEditMode(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90"
          style={{ backgroundColor: "#4D2FB2" }}
          aria-label="Edit dashboard"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </>
  );

  return (
    <AppShell
        activeTab="/dashboards"
        headerEndAction={headerEndAction}
        welcomeTitle={welcomeTitle || undefined}
        welcomeSubtitle={welcomeSubtitle || undefined}
        welcomeEditable={editMode}
        onWelcomeChange={editMode ? ({ title, subtitle }) => {
          setWelcomeTitle(title);
          setWelcomeSubtitle(subtitle);
        } : undefined}
      >
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <OfflinePill />
        </div>

        <div className="rounded-card overflow-hidden">
          <ReactGridLayout
            className="layout"
            layout={layoutForGrid}
            onLayoutChange={onLayoutChange}
            cols={12}
            rowHeight={52}
            width={1200}
            margin={[6, 4]}
            containerPadding={[0, 0]}
            isDraggable={editMode}
            isResizable={editMode}
            draggableHandle={editMode ? ".tile-drag-handle" : undefined}
          >
            {widgets
            .filter((w) => w.type !== "media_card" && w.type !== "climate_card" && w.type !== "climate_card_2" && w.type !== "light_card" && w.type !== "solar_card" && w.type !== "weather_card" && w.type !== "vacuum_card")
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
                        aria-label="Edit tile"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTile(w.id)}
                        className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                        aria-label="Remove tile"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  <div className={cn("h-full w-full", editMode && "tile-drag-handle cursor-grab")}>
                    <WidgetByType
                      type={w.type}
                      title={w.title}
                      entity_id={w.entity_id}
                      consumption_entity_id={w.consumption_entity_id}
                      humidity_entity_id={w.humidity_entity_id}
                      show_icon={w.show_icon}
                      script_ids={w.script_ids}
                      script_names={w.script_names}
                      cleaned_area_entity_id={w.cleaned_area_entity_id}
                      icon={w.icon}
                      size={w.size}
                      conditions={w.conditions}
                    />
                  </div>
                </div>
              );
            })}
          </ReactGridLayout>
        </div>

        {(() => {
          const firstMedia = widgets.find((w) => w.type === "media_card");
          return firstMedia ? (
            <FloatingMediaCard
              title={firstMedia.title ?? "Media"}
              entity_id={firstMedia.entity_id}
              editMode={editMode}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstMedia.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstMedia.id)
                  : undefined
              }
            />
          ) : null;
        })()}

        {(() => {
          const climateCards = widgets.filter(
            (w) => w.type === "climate_card" || w.type === "climate_card_2"
          );
          return climateCards.length > 0 ? (
            <FloatingClimateCard
              widgets={climateCards.map((w) => ({
                id: w.id,
                title: w.title ?? "Climate",
                entity_id: w.entity_id,
                humidity_entity_id: w.humidity_entity_id,
                icon: w.icon,
                type: w.type === "climate_card_2" ? "climate_card_2" : "climate_card",
              }))}
              editMode={editMode}
              onEdit={editMode ? (id) => setEditingWidgetId(id) : undefined}
              onRemove={editMode ? (id) => handleRemoveTile(id) : undefined}
            />
          ) : null;
        })()}

        {(() => {
          const lightCards = widgets.filter((w) => w.type === "light_card");
          return lightCards.length > 0 ? (
            <FloatingLightCard
              widgets={lightCards.map((w) => ({
                id: w.id,
                title: w.title ?? "Lamp",
                entity_id: w.entity_id,
                icon: w.icon,
              }))}
              editMode={editMode}
              onEdit={editMode ? (id) => setEditingWidgetId(id) : undefined}
              onRemove={editMode ? (id) => handleRemoveTile(id) : undefined}
            />
          ) : null;
        })()}

        {(() => {
          const firstSolar = widgets.find((w) => w.type === "solar_card");
          return firstSolar ? (
            <FloatingSolarCard
              title={firstSolar.title ?? "Zonnepanelen"}
              entity_id={firstSolar.entity_id}
              consumption_entity_id={firstSolar.consumption_entity_id}
              editMode={editMode}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstSolar.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstSolar.id)
                  : undefined
              }
            />
          ) : null;
        })()}

        {(() => {
          const firstSensor = widgets.find((w) => w.type === "sensor_card");
          return firstSensor ? (
            <FloatingSensorCard
              title={firstSensor.title ?? "Sensor"}
              entity_id={firstSensor.entity_id}
              icon={firstSensor.icon}
              size={(firstSensor.size as "sm" | "md" | "lg") ?? "md"}
              conditions={firstSensor.conditions}
              editMode={editMode}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstSensor.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstSensor.id)
                  : undefined
              }
            />
          ) : null;
        })()}

        {(() => {
          const firstWeather = widgets.find((w) => w.type === "weather_card");
          return firstWeather ? (
            <FloatingWeatherCard
              title={firstWeather.title ?? "Weather"}
              entity_id={firstWeather.entity_id}
              show_icon={firstWeather.show_icon}
              editMode={editMode}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstWeather.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstWeather.id)
                  : undefined
              }
            />
          ) : null;
        })()}

        {(() => {
          const firstVacuum = widgets.find((w) => w.type === "vacuum_card");
          return firstVacuum ? (
            <FloatingVacuumCard
              title={firstVacuum.title ?? "Stofzuiger"}
              entity_id={firstVacuum.entity_id}
              script_ids={firstVacuum.script_ids}
              script_names={firstVacuum.script_names}
              cleaned_area_entity_id={firstVacuum.cleaned_area_entity_id}
              icon={firstVacuum.icon}
              editMode={editMode}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstVacuum.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstVacuum.id)
                  : undefined
              }
            />
          ) : null;
        })()}

        {editingWidgetId && editingWidget && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              aria-hidden
              onClick={() => setEditingWidgetId(null)}
            />
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-gray-800">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Edit tile
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Tile name"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                {editingWidget.type === "climate_card" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Icoon (optioneel, i.p.v. naam in tab)
                    </label>
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      onFocus={() => setIconSearch(editForm.icon ?? "")}
                      placeholder="Zoek icoon (bijv. air, therm…)"
                      className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm((prev) => ({ ...prev, icon: undefined }));
                          setIconSearch("");
                        }}
                        className={cn(
                          "rounded-md px-2 py-1 text-xs",
                          !editForm.icon
                            ? "bg-[#4D2FB2] text-white"
                            : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                        )}
                      >
                        Geen
                      </button>
                      {CLIMATE_ICON_OPTIONS.filter((name) =>
                        name.toLowerCase().includes((iconSearch || "").toLowerCase())
                      ).map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setEditForm((prev) => ({ ...prev, icon: name }));
                            setIconSearch(name);
                          }}
                          className={cn(
                            "rounded-md px-2 py-1 text-xs",
                            editForm.icon === name
                              ? "bg-[#4D2FB2] text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                          )}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {editingWidget.entity_id != null && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {editingWidget.type === "solar_card" ? "Yield (opbrengst)" : "Entity"}
                    </label>
                    <select
                      value={editForm.entity_id}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, entity_id: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                    >
                      {(() => {
                        const domain =
                          WIDGET_TYPE_DOMAIN[editingWidget.type] ?? "sensor";
                        const options = entities.filter((e) =>
                          e.entity_id.startsWith(domain + ".")
                        );
                        return options.map((e) => {
                          const name =
                            (e.attributes as { friendly_name?: string })
                              ?.friendly_name ?? e.entity_id;
                          return (
                            <option key={e.entity_id} value={e.entity_id}>
                              {name}
                            </option>
                          );
                        });
                      })()}
                    </select>
                  </div>
                )}
                {editingWidget.type === "light_card" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Icoon
                    </label>
                    <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5">
                      {LIGHT_ICON_OPTIONS.map((key) => {
                        const label =
                          key === "lightbulb"
                            ? "Lightbulb"
                            : key === "spotlight"
                              ? "Spotlight"
                              : key === "lamp"
                                ? "Lamp"
                                : key === "lamp-ceiling"
                                  ? "Plafond"
                                  : key === "lamp-desk"
                                    ? "Bureau"
                                    : key === "lamp-floor"
                                      ? "Vloer"
                                      : key === "lamp-wall-down"
                                        ? "Wall down"
                                        : "Wall up";
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              setEditForm((prev) => ({ ...prev, icon: key }))
                            }
                            className={cn(
                              "rounded-md px-2 py-1 text-xs",
                              (editForm.icon ?? "lightbulb") === key
                                ? "bg-[#4D2FB2] text-white"
                                : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {editingWidget.type === "climate_card_2" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Luchtvochtigheid (optioneel)
                    </label>
                    <select
                      value={editForm.humidity_entity_id ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          humidity_entity_id: e.target.value || undefined,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="">Geen</option>
                      {entities
                        .filter((e) => e.entity_id.startsWith("sensor."))
                        .map((e) => {
                          const name =
                            (e.attributes as { friendly_name?: string })
                              ?.friendly_name ?? e.entity_id;
                          return (
                            <option key={e.entity_id} value={e.entity_id}>
                              {name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}
                {editingWidget.type === "solar_card" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Consumption (verbruik, optioneel)
                    </label>
                    <select
                      value={editForm.consumption_entity_id ?? ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          consumption_entity_id: e.target.value || undefined,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="">Geen</option>
                      {entities
                        .filter((e) => e.entity_id.startsWith("sensor."))
                        .map((e) => {
                          const name =
                            (e.attributes as { friendly_name?: string })
                              ?.friendly_name ?? e.entity_id;
                          return (
                            <option key={e.entity_id} value={e.entity_id}>
                              {name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}
                {editingWidget.type === "vacuum_card" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Vacuum Room (scripts)
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Kies scripts en geef ze optioneel een weergavenaam.
                    </p>
                    <div className="max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1 mb-2">
                      {entities
                        .filter((e) => e.entity_id.startsWith("script."))
                        .map((e) => {
                          const defaultName = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                          const checked = (editForm.script_ids ?? []).includes(e.entity_id);
                          return (
                            <label
                              key={e.entity_id}
                              className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const ids = editForm.script_ids ?? [];
                                  const names = { ...(editForm.script_names ?? {}) };
                                  if (checked) {
                                    delete names[e.entity_id];
                                  }
                                  setEditForm((prev) => ({
                                    ...prev,
                                    script_ids: checked
                                      ? ids.filter((id) => id !== e.entity_id)
                                      : [...ids, e.entity_id],
                                    script_names: names,
                                  }));
                                }}
                                className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-[#4D2FB2] focus:ring-[#4D2FB2]"
                              />
                              <span className="text-sm truncate shrink-0 max-w-[140px]" title={e.entity_id}>{defaultName}</span>
                            </label>
                          );
                        })}
                      {entities.filter((e) => e.entity_id.startsWith("script.")).length === 0 && (
                        <p className="text-xs text-gray-500 py-2">Geen scripts gevonden. Sla eerst een verbinding op.</p>
                      )}
                    </div>
                    {(editForm.script_ids ?? []).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Naam per script (optioneel)</p>
                        {(editForm.script_ids ?? []).map((scriptId) => {
                          const e = entities.find((x) => x.entity_id === scriptId);
                          const defaultName = (e?.attributes as { friendly_name?: string })?.friendly_name ?? scriptId;
                          return (
                            <div key={scriptId} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400 w-28 truncate shrink-0" title={scriptId}>{defaultName}</span>
                              <input
                                type="text"
                                value={editForm.script_names?.[scriptId] ?? ""}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    script_names: {
                                      ...(prev.script_names ?? {}),
                                      [scriptId]: e.target.value || undefined,
                                    } as Record<string, string>,
                                  }))
                                }
                                placeholder={defaultName}
                                className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-3">
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Sensor onder status (bijv. cleaned area)
                      </label>
                      <select
                        value={editForm.cleaned_area_entity_id ?? ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            cleaned_area_entity_id: e.target.value || undefined,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                      >
                        <option value="">Geen</option>
                        {entities
                          .filter((e) => e.entity_id.startsWith("sensor."))
                          .map((e) => {
                            const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                            return (
                              <option key={e.entity_id} value={e.entity_id}>
                                {name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="mt-3">
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Icoon
                      </label>
                      <input
                        type="text"
                        value={vacuumIconSearch}
                        onChange={(e) => setVacuumIconSearch(e.target.value)}
                        onFocus={() => setVacuumIconSearch(vacuumIconSearch || editForm.icon ?? "")}
                        placeholder="Zoek icoon (bijv. home, bot, sparkles…)"
                        className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                      />
                      <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm((prev) => ({ ...prev, icon: undefined }));
                            setVacuumIconSearch("");
                          }}
                          className={cn(
                            "rounded-md px-2 py-1 text-xs",
                            !editForm.icon
                              ? "bg-[#4D2FB2] text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                          )}
                        >
                          Geen (Sparkles)
                        </button>
                        {VACUUM_ICON_OPTIONS.filter((name) =>
                          name.toLowerCase().includes((vacuumIconSearch || "").toLowerCase())
                        ).map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setEditForm((prev) => ({ ...prev, icon: name }));
                              setVacuumIconSearch(name);
                            }}
                            className={cn(
                              "rounded-md px-2 py-1 text-xs",
                              (editForm.icon ?? "Sparkles") === name
                                ? "bg-[#4D2FB2] text-white"
                                : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            )}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {editingWidget.type === "sensor_card" && (
                  <div>
                    <div className="flex rounded-lg border border-gray-200 dark:border-white/10 p-0.5 mb-3">
                      <button
                        type="button"
                        onClick={() => setSensorCardEditTab("general")}
                        className={cn(
                          "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                          sensorCardEditTab === "general"
                            ? "bg-[#4D2FB2] text-white"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                        )}
                      >
                        Algemeen
                      </button>
                      <button
                        type="button"
                        onClick={() => setSensorCardEditTab("conditions")}
                        className={cn(
                          "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                          sensorCardEditTab === "conditions"
                            ? "bg-[#4D2FB2] text-white"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                        )}
                      >
                        Conditionele voorwaarden
                      </button>
                    </div>
                    {sensorCardEditTab === "general" && (
                      <>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Icoon
                        </label>
                        <input
                          type="text"
                          value={sensorIconSearch}
                          onChange={(e) => setSensorIconSearch(e.target.value)}
                          onFocus={() => setSensorIconSearch(sensorIconSearch || editForm.icon ?? "")}
                          placeholder="Zoek icoon (bijv. gauge, thermometer…)"
                          className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                        />
                        <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditForm((prev) => ({ ...prev, icon: undefined }));
                              setSensorIconSearch("");
                            }}
                            className={cn(
                              "rounded-md px-2 py-1 text-xs",
                              !editForm.icon
                                ? "bg-[#4D2FB2] text-white"
                                : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            )}
                          >
                            Default (Gauge)
                          </button>
                          {SENSOR_ICON_OPTIONS.filter((name) =>
                            name.toLowerCase().includes((sensorIconSearch || "").toLowerCase())
                          ).map((name) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                setEditForm((prev) => ({ ...prev, icon: name }));
                                setSensorIconSearch(name);
                              }}
                              className={cn(
                                "rounded-md px-2 py-1 text-xs",
                                (editForm.icon ?? "Gauge") === name
                                  ? "bg-[#4D2FB2] text-white"
                                  : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                              )}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3">
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            Grootte
                          </label>
                          <select
                            value={editForm.size ?? "md"}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, size: e.target.value }))
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                          >
                            <option value="sm">Klein</option>
                            <option value="md">Normaal</option>
                            <option value="lg">Groot</option>
                          </select>
                        </div>
                      </>
                    )}
                    {sensorCardEditTab === "conditions" && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Eerste voorwaarde die klopt bepaalt de kaartkleur. Getallen en tekst worden ondersteund.
                        </p>
                        {(editForm.conditions ?? []).map((cond, idx) => (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2"
                          >
                            <select
                              value={cond.operator}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  conditions: (prev.conditions ?? []).map((c, i) =>
                                    i === idx ? { ...c, operator: e.target.value } : c
                                  ),
                                }))
                              }
                              className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1 text-xs"
                            >
                              {SENSOR_CONDITION_OPERATORS.map((op) => (
                                <option key={op} value={op}>
                                  {op === "eq" ? "=" : op === "neq" ? "≠" : op === "gte" ? "≥" : op === "lte" ? "≤" : op === "gt" ? ">" : op === "lt" ? "<" : "bevat"}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={cond.value}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  conditions: (prev.conditions ?? []).map((c, i) =>
                                    i === idx ? { ...c, value: e.target.value } : c
                                  ),
                                }))
                              }
                              placeholder="Waarde"
                              className="w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1 text-xs"
                            />
                            <select
                              value={cond.color}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  conditions: (prev.conditions ?? []).map((c, i) =>
                                    i === idx ? { ...c, color: e.target.value } : c
                                  ),
                                }))
                              }
                              className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1 text-xs"
                            >
                              {SENSOR_CONDITION_COLORS.map((color) => (
                                <option key={color} value={color}>
                                  {color}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  conditions: (prev.conditions ?? []).filter((_, i) => i !== idx),
                                }))
                              }
                              className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              aria-label="Verwijder voorwaarde"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setEditForm((prev) => ({
                              ...prev,
                              conditions: [...(prev.conditions ?? []), { operator: "gte", value: "", color: "green" }],
                            }))
                          }
                          className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full"
                        >
                          + Voeg voorwaarde toe
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {editingWidget.type === "weather_card" && (
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Toon icoon
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={editForm.show_icon !== false}
                      onClick={() =>
                        setEditForm((prev) => ({ ...prev, show_icon: !(prev.show_icon !== false) }))
                      }
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2",
                        editForm.show_icon !== false
                          ? "bg-[#4D2FB2]"
                          : "bg-gray-200 dark:bg-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
                          editForm.show_icon !== false ? "translate-x-5" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingWidgetId(null)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updates = {
                        title: editForm.title,
                        ...(editingWidget.entity_id != null && {
                          entity_id: editForm.entity_id,
                        }),
                        ...(editingWidget.type === "climate_card" && {
                          icon: editForm.icon || undefined,
                        }),
                        ...(editingWidget.type === "solar_card" && {
                          consumption_entity_id: editForm.consumption_entity_id || undefined,
                        }),
                        ...(editingWidget.type === "climate_card_2" && {
                          humidity_entity_id: editForm.humidity_entity_id || undefined,
                        }),
                        ...(editingWidget.type === "light_card" && {
                          icon: editForm.icon || undefined,
                        }),
                        ...(editingWidget.type === "weather_card" && {
                          show_icon: editForm.show_icon !== false,
                        }),
                        ...(editingWidget.type === "vacuum_card" && {
                          script_ids: editForm.script_ids ?? [],
                          script_names: editForm.script_names ?? {},
                          cleaned_area_entity_id: editForm.cleaned_area_entity_id || undefined,
                          icon: editForm.icon || undefined,
                        }),
                        ...(editingWidget.type === "sensor_card" && {
                          icon: editForm.icon || undefined,
                          size: editForm.size || undefined,
                          conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined,
                        }),
                      };
                      handleUpdateTile(editingWidgetId, updates);
                      const newWidgets = widgets.map((w) =>
                        w.id === editingWidgetId ? { ...w, ...updates } : w
                      );
                      saveMutation.mutate({
                        layout,
                        widgets: newWidgets,
                        welcomeTitle,
                        welcomeSubtitle,
                      });
                    }}
                    className="rounded-lg bg-[#4D2FB2] px-3 py-1.5 text-sm text-white hover:opacity-90"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
