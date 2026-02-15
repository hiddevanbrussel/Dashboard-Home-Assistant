"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { EntitySelectWithSearch } from "@/components/entity-select-with-search";
import { CardDefinitionModal } from "@/components/card-definition-modal";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Bot, Check, CircleDot, CloudSun, Fuel, Gauge, Home, LayoutGrid, Lightbulb, Music2, Pencil, Plus, Sun, Thermometer, Type, Video, X, Zap } from "lucide-react";

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
  TitleCardWidget,
  FloatingTitleCard,
  CLIMATE_ICON_OPTIONS,
  VACUUM_ICON_OPTIONS,
  SENSOR_ICON_OPTIONS,
  SENSOR_CONDITION_COLORS,
  SENSOR_CONDITION_OPERATORS,
  SENSOR_CONDITION_OPERATOR_LABELS,
  FloatingPillCard,
  FloatingCardGroup,
  RoomCardWidget,
  FloatingRoomCard,
  NutsCardWidget,
  FloatingNutsCard,
  EnergyMonitorCardWidget,
  FloatingEnergyMonitorCard,
  PowerUsageCardWidget,
  FloatingPowerUsageCard,
  StatPillCardWidget,
  FloatingStatPillCard,
  CameraCardWidget,
  FloatingCameraCard,
  CARD_ICON_OPTIONS,
} from "@/components/widgets";
import type { WidgetConfig } from "@/stores/onboarding-store";
import type { ImageCondition, SensorCondition } from "@/components/widgets";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { OfflinePill } from "@/components/offline-pill";
import { cn, generateId } from "@/lib/utils";

/** Alleen deze types kunnen als tile worden toegevoegd (floating cards). */
const ADDABLE_WIDGET_TYPES = ["title_card", "climate_card_2", "light_card", "media_card", "solar_card", "energy_monitor_card", "power_usage_card", "stat_pill_card", "sensor_card", "weather_card", "vacuum_card", "camera_card", "pill_card", "room_card", "nuts_card", "card_group"] as const;

const ADDABLE_WIDGET_TILES: { type: (typeof ADDABLE_WIDGET_TYPES)[number]; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "title_card", label: "Titel", Icon: Type },
  { type: "climate_card_2", label: "Klimaat", Icon: Thermometer },
  { type: "light_card", label: "Lamp", Icon: Lightbulb },
  { type: "media_card", label: "Media", Icon: Music2 },
  { type: "solar_card", label: "Zonnepanelen", Icon: Sun },
  { type: "energy_monitor_card", label: "Afbeeldingskaart", Icon: Sun },
  { type: "power_usage_card", label: "Stroomverbruik", Icon: Zap },
  { type: "stat_pill_card", label: "Stat pill", Icon: CircleDot },
  { type: "sensor_card", label: "Sensor", Icon: Gauge },
  { type: "weather_card", label: "Weer", Icon: CloudSun },
  { type: "vacuum_card", label: "Stofzuiger", Icon: Bot },
  { type: "camera_card", label: "Camera", Icon: Video },
  { type: "pill_card", label: "Pill", Icon: CircleDot },
  { type: "room_card", label: "Kamer", Icon: Home },
  { type: "nuts_card", label: "Nuts (Gas/Water)", Icon: Fuel },
  { type: "card_group", label: "Kaartgroep", Icon: LayoutGrid },
];

/** Map widget type to HA domain for filtering entities */
const WIDGET_TYPE_DOMAIN: Record<string, string> = {
  title_card: "",
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
  energy_monitor_card: "sensor",
  power_usage_card: "sensor",
  stat_pill_card: "sensor",
  sensor_card: "sensor",
  weather_card: "weather",
  vacuum_card: "vacuum",
  camera_card: "camera",
  pill_card: "switch",
  room_card: "",
  nuts_card: "sensor",
  card_group: "",
};

const PILL_CARD_DOMAINS = ["switch", "light", "input_boolean", "sensor"];

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
  light_entity_id,
  media_player_entity_id,
  climate_entity_id,
  background_image,
  background_image_dark,
  image_conditions,
  icon,
  size,
  conditions,
  current_entity_id,
  max_value,
  grid_entity_id,
  minimal,
  label,
  color,
  device_entity_ids,
  cost_per_kwh,
  onMoreClick,
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
  light_entity_id?: string;
  media_player_entity_id?: string;
  climate_entity_id?: string;
  background_image?: string;
  background_image_dark?: string;
  image_conditions?: { operator: string; value: string; image: string; image_dark?: string }[];
  icon?: string;
  size?: string;
  conditions?: { operator: string; value: string; color: string }[];
  current_entity_id?: string;
  max_value?: number;
  grid_entity_id?: string;
  minimal?: boolean;
  label?: string;
  color?: string;
  device_entity_ids?: string[];
  cost_per_kwh?: number;
  onMoreClick?: () => void;
}) {
  const sizeProp = (size as "sm" | "md" | "lg") ?? "md";
  const live = useEntityStateStore((s) => s.getState(entity_id));
  const num = live?.state != null ? Number(live.state) : undefined;
  const onOff = live?.state === "on" ? "on" : "off";

  switch (type) {
    case "title_card":
      return <TitleCardWidget title={title} />;
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
      return (
        <ClimateCard2Widget
          title={title}
          entity_id={entity_id}
          humidity_entity_id={humidity_entity_id}
          size={sizeProp}
        />
      );
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
          device_entity_ids={device_entity_ids}
          cost_per_kwh={cost_per_kwh}
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
          show_icon={show_icon}
          size={sizeProp}
          conditions={conditions as SensorCondition[] | undefined}
        />
      );
    case "room_card":
      return (
        <RoomCardWidget
          title={title}
          entity_id={entity_id}
          icon={icon}
          light_entity_id={light_entity_id}
          media_player_entity_id={media_player_entity_id}
          climate_entity_id={climate_entity_id}
          background_image={background_image}
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
  const [addTileEntitySearch, setAddTileEntitySearch] = useState("");
  const [groupAddEntitySearch, setGroupAddEntitySearch] = useState("");
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  /** When editing a card_group, id of the child pill being edited (null = editing group itself). */
  const [editingGroupChildId, setEditingGroupChildId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    entity_id: string;
    consumption_entity_id?: string;
    grid_entity_id?: string;
    humidity_entity_id?: string;
    show_icon?: boolean;
    show_state?: boolean;
    script_ids?: string[];
    script_names?: Record<string, string>;
    cleaned_area_entity_id?: string;
    light_entity_id?: string;
    media_player_entity_id?: string;
    climate_entity_id?: string;
    background_image?: string;
    background_image_dark?: string;
    icon_background_color?: string;
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
    refresh?: number;
    show_title?: boolean;
    device_entity_ids?: string[];
    cost_per_kwh?: number;
  }>({
    title: "",
    entity_id: "",
    consumption_entity_id: "",
    grid_entity_id: "",
    humidity_entity_id: "",
    show_icon: true,
    show_state: true,
    script_ids: [],
    script_names: {},
    cleaned_area_entity_id: "",
    current_entity_id: "",
    light_entity_id: "",
    media_player_entity_id: "",
    climate_entity_id: "",
    background_image: "",
    background_image_dark: "",
    icon_background_color: "",
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    icon: "",
    size: "md",
    conditions: [],
    image_conditions: [],
    minimal: false,
    scale: 1,
    label: "",
    color: "amber",
    refresh: 10,
    show_title: true,
    device_entity_ids: [],
    cost_per_kwh: undefined as number | undefined,
  });
  const [iconSearch, setIconSearch] = useState("");
  const [vacuumIconSearch, setVacuumIconSearch] = useState("");
  const [sensorIconSearch, setSensorIconSearch] = useState("");
  const [pillIconSearch, setPillIconSearch] = useState("");
  const [editTab, setEditTab] = useState<string>("algemeen");
  const [uploadingRoomBg, setUploadingRoomBg] = useState(false);
  const [clickedCardForDefinition, setClickedCardForDefinition] = useState<{
    widgetId: string;
    title: string;
  } | null>(null);
  const [definitionModalEntities, setDefinitionModalEntities] = useState<HaEntity[]>([]);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const LONG_PRESS_MS = 500;

  function clearLongPressTimer() {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function startLongPressForEdit(e: React.PointerEvent) {
    if (editMode) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      setEditMode(true);
    }, LONG_PRESS_MS);
  }

  function clearLongPressTimerAndRelease(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    clearLongPressTimer();
  }

  const editingWidget = editingWidgetId
    ? widgets.find((w) => w.id === editingWidgetId)
    : null;

  useEffect(() => {
    if (!editingWidgetId) setEditingGroupChildId(null);
  }, [editingWidgetId]);

  useEffect(() => {
    if (editingWidget?.type === "card_group" && editingGroupChildId) {
      const child = (editingWidget.children ?? []).find((c) => c.id === editingGroupChildId);
      if (child) {
        setEditForm({
          title: child.title ?? "",
          entity_id: child.entity_id ?? "",
          consumption_entity_id: "",
          humidity_entity_id: "",
          show_icon: true,
          script_ids: [],
          script_names: {},
          cleaned_area_entity_id: "",
          icon: child.icon ?? "",
          size: "md",
          conditions: child.conditions ?? [],
          show_state: child.show_state !== false,
        });
        setPillIconSearch(child.icon ?? "");
      }
      return;
    }
    if (editingWidget) {
      setEditForm({
        title: editingWidget.title ?? "",
        entity_id: editingWidget.entity_id ?? "",
        consumption_entity_id: editingWidget.consumption_entity_id ?? "",
        grid_entity_id: editingWidget.grid_entity_id ?? "",
        humidity_entity_id: editingWidget.humidity_entity_id ?? "",
        show_icon: editingWidget.show_icon !== false,
        script_ids: editingWidget.script_ids ?? [],
        script_names: editingWidget.script_names ?? {},
        cleaned_area_entity_id: editingWidget.cleaned_area_entity_id ?? "",
        light_entity_id: editingWidget.light_entity_id ?? "",
        media_player_entity_id: editingWidget.media_player_entity_id ?? "",
        climate_entity_id: editingWidget.climate_entity_id ?? "",
        background_image: editingWidget.background_image ?? "",
        background_image_dark: editingWidget.background_image_dark ?? "",
        icon_background_color: editingWidget.icon_background_color ?? "",
        width: editingWidget.width ?? undefined,
        height: editingWidget.height ?? undefined,
        icon: editingWidget.icon ?? "",
        size: editingWidget.size ?? "md",
        conditions: editingWidget.conditions ?? [],
        image_conditions: editingWidget.image_conditions ?? [],
        show_state: editingWidget.show_state !== false,
        current_entity_id: editingWidget.current_entity_id ?? "",
        max_value: editingWidget.max_value ?? undefined,
        minimal: editingWidget.minimal ?? false,
        scale: editingWidget.scale ?? 1,
        label: editingWidget.label ?? "",
        color: editingWidget.color ?? "amber",
        refresh: editingWidget.refresh ?? 10,
        show_title: editingWidget.show_title !== false,
        device_entity_ids: editingWidget.device_entity_ids ?? [],
        cost_per_kwh: editingWidget.cost_per_kwh ?? undefined,
      });
      setIconSearch("");
      setVacuumIconSearch(editingWidget.type === "vacuum_card" ? (editingWidget.icon ?? "") : "");
      setSensorIconSearch(editingWidget.type === "sensor_card" ? (editingWidget.icon ?? "") : "");
      setPillIconSearch(editingWidget.type === "pill_card" ? (editingWidget.icon ?? "") : "");
      setGroupAddEntitySearch("");
      if (editingWidget.type === "title_card" || editingWidget.type === "light_card" || editingWidget.type === "sensor_card" || editingWidget.type === "room_card" || editingWidget.type === "climate_card" || editingWidget.type === "climate_card_2" || editingWidget.type === "solar_card" || editingWidget.type === "stat_pill_card" || editingWidget.type === "vacuum_card" || editingWidget.type === "pill_card" || editingWidget.type === "camera_card" || editingWidget.type === "weather_card" || editingWidget.type === "nuts_card" || editingWidget.type === "power_usage_card") {
        setEditTab(editingWidget.type === "room_card" ? "entiteiten" : "algemeen");
      }
      if (editingWidget.type === "energy_monitor_card") {
        setEditTab("achtergrond");
      }
      if (editingWidget.type === "card_group") {
        setEditTab(editingGroupChildId ? "algemeen" : "weergave");
      }
    }
  }, [editingWidget, editingGroupChildId]);

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard", id],
    queryFn: async () => {
      const res = await fetch(`/api/dashboards/${id}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: !!id,
  });

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

  useEffect(() => {
    if (!clickedCardForDefinition) return;
    fetch("/api/ha/entities")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setDefinitionModalEntities(data) : setDefinitionModalEntities([])))
      .catch(() => setDefinitionModalEntities([]));
  }, [clickedCardForDefinition]);

  const requestRefresh = useEntityStateStore((s) => s.requestRefresh);
  useEffect(() => {
    if (!data) return;
    const w = parseWidgets(data.widgets);
    if (w.some((x) => x.type === "stat_pill_card")) requestRefresh();
  }, [data, requestRefresh]);

  useEffect(() => {
    if (error && id) router.replace("/dashboards");
  }, [error, id, router]);

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
        return type === "media_card" || type === "climate_card" || type === "climate_card_2" || type === "title_card" || type === "pill_card" || type === "room_card" || type === "nuts_card" || type === "power_usage_card" || type === "card_group";
      });
      return [...newLayout, ...floatingItems];
    });
  };

  const layoutForGrid = layout.filter((item) => {
    const type = widgets.find((w) => w.id === item.i)?.type;
    return type !== "media_card" && type !== "climate_card" && type !== "climate_card_2" && type !== "light_card" && type !== "solar_card" && type !== "energy_monitor_card" && type !== "power_usage_card" && type !== "stat_pill_card" && type !== "sensor_card" && type !== "weather_card" && type !== "vacuum_card" && type !== "camera_card" && type !== "title_card" && type !== "pill_card" && type !== "room_card" && type !== "nuts_card" && type !== "card_group";
  });
  const layoutMap = new Map(layout.map((item) => [item.i, item]));

  const handleSave = () => {
    setEditingWidgetId(null);
    setEditingGroupChildId(null);
    setEditMode(false);
    saveMutation.mutate({ layout, widgets, welcomeTitle, welcomeSubtitle });
  };

  function handleAddTile(type: string, entityId: string, titleOverride?: string): string | undefined {
    const newId = generateId();
    const newWidget: WidgetConfig = {
      id: newId,
      type,
      title: titleOverride ?? type.replace(/_/g, " "),
      entity_id: entityId,
      ...(type === "card_group" && { children: [], alignment: "start" as const }),
    };
    const maxY = layout.length === 0 ? 0 : Math.max(...layout.map((item) => item.y + item.h));
    const isTitleCard = type === "title_card";
    const newLayoutItem: LayoutItem = {
      i: newId,
      x: 0,
      y: maxY,
      w: isTitleCard ? 12 : 4,
      h: isTitleCard ? 1 : 2,
    };
    const newWidgets = [...widgets, newWidget];
    const newLayout =
      type === "solar_card" || type === "energy_monitor_card" || type === "power_usage_card" || type === "sensor_card" || type === "weather_card" || type === "climate_card" || type === "climate_card_2" || type === "light_card" || type === "vacuum_card" || type === "camera_card" || type === "title_card" || type === "pill_card" || type === "room_card" || type === "nuts_card" || type === "card_group"
        ? layout
        : [...layout, newLayoutItem];
    setWidgets(newWidgets);
    setLayout(newLayout);
    setAddTileOpen(false);
    setAddTileStep("type");
    setAddTileSelectedType(null);
    saveMutation.mutate({ layout: newLayout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
    return type === "room_card" || type === "nuts_card" || type === "energy_monitor_card" || type === "power_usage_card" || type === "stat_pill_card" ? newId : undefined;
  }

  const domain = addTileSelectedType ? WIDGET_TYPE_DOMAIN[addTileSelectedType] : null;
  const entitiesToShow =
    addTileSelectedType === "pill_card"
      ? entities.filter((e) => PILL_CARD_DOMAINS.some((d) => e.entity_id.startsWith(d + ".")))
      : domain != null
        ? entities.filter((e) => e.entity_id.startsWith(domain + "."))
        : entities;

  function handleRemoveTile(widgetId: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setLayout((prev) => prev.filter((item) => item.i !== widgetId));
  }

  function handleDuplicateTile(widgetId: string): string | undefined {
    const original = widgets.find((w) => w.id === widgetId);
    if (!original) return undefined;
    const newId = generateId();
    const duplicated: WidgetConfig = {
      ...original,
      id: newId,
      title: `${original.title ?? ""} (kopie)`.trim() || original.title,
      ...(original.type === "card_group" &&
        original.children && {
          children: original.children.map((c) => ({
            ...c,
            id: generateId(),
          })),
        }),
    };
    const layoutItem = layout.find((item) => item.i === widgetId);
    const newLayoutItem: LayoutItem = layoutItem
      ? { ...layoutItem, i: newId, y: layoutItem.y + layoutItem.h }
      : {
          i: newId,
          x: 0,
          y: layout.length === 0 ? 0 : Math.max(...layout.map((item) => item.y + item.h)),
          w: original.type === "title_card" ? 12 : 4,
          h: original.type === "title_card" ? 1 : 2,
        };
    const newWidgets = [...widgets, duplicated];
    const newLayout = [...layout, newLayoutItem];
    setWidgets(newWidgets);
    setLayout(newLayout);
    setEditingWidgetId(null);
    saveMutation.mutate({ layout: newLayout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
    return newId;
  }

  function handleUpdateTile(
    widgetId: string,
    updates: { title?: string; entity_id?: string; consumption_entity_id?: string; grid_entity_id?: string; humidity_entity_id?: string; show_icon?: boolean; show_state?: boolean; script_ids?: string[]; script_names?: Record<string, string>; cleaned_area_entity_id?: string; light_entity_id?: string; background_image?: string; background_image_dark?: string; image_conditions?: { operator: string; value: string; image: string; image_dark?: string }[]; icon_background_color?: string; width?: number; height?: number; icon?: string; size?: string; conditions?: { operator: string; value: string; color: string }[]; alignment?: "start" | "center" | "end" | "between"; children?: WidgetConfig[]; current_entity_id?: string; max_value?: number; minimal?: boolean; scale?: number; label?: string; color?: string; refresh?: number; show_title?: boolean }
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
          <>
            <button
              type="button"
              onClick={() => setAddTileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90"
              style={{ backgroundColor: "#4D2FB2" }}
              aria-label="Kaart toevoegen"
            >
              <Plus className="h-4 w-4" />
            </button>
            {addTileOpen && typeof document !== "undefined" && createPortal(
              <>
                <div
                  className="fixed inset-0 z-[300] bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                  aria-hidden
                  onClick={() => {
                    setAddTileOpen(false);
                    setAddTileStep("type");
                    setAddTileSelectedType(null);
                    setAddTileEntitySearch("");
                  }}
                />
                <div className="fixed top-4 right-4 bottom-4 z-[301] w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl">
                  <div className="shrink-0 flex items-center justify-between p-5 pb-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {addTileStep === "type" ? "Kaart toevoegen" : "Kies entity"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setAddTileOpen(false);
                        setAddTileStep("type");
                        setAddTileSelectedType(null);
                        setAddTileEntitySearch("");
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400"
                      aria-label="Sluiten"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4">
                  {addTileStep === "type" ? (
                    <div className="grid grid-cols-3 gap-2">
                      {ADDABLE_WIDGET_TILES.map(({ type, label, Icon }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            if (type === "title_card") {
                              handleAddTile("title_card", "", "Titel");
                              setAddTileOpen(false);
                              return;
                            }
                            if (type === "card_group") {
                              handleAddTile("card_group", "", "Kaartgroep");
                              setAddTileOpen(false);
                              return;
                            }
                            if (type === "room_card") {
                              const newId = handleAddTile("room_card", "", "Kamer");
                              if (newId) setEditingWidgetId(newId);
                              return;
                            }
                            if (type === "energy_monitor_card") {
                              const newId = handleAddTile("energy_monitor_card", "", "Afbeeldingskaart");
                              if (newId) setEditingWidgetId(newId);
                              setAddTileOpen(false);
                              return;
                            }
                            if (type === "power_usage_card") {
                              const newId = handleAddTile("power_usage_card", "", "Stroomverbruik");
                              if (newId) setEditingWidgetId(newId);
                              setAddTileOpen(false);
                              return;
                            }
                            setAddTileSelectedType(type);
                            setAddTileStep("entity");
                          }}
                          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 py-4 px-3 transition-colors hover:border-[#4D2FB2]/40 hover:bg-[#4D2FB2]/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#4D2FB2]/50 dark:hover:bg-[#4D2FB2]/10"
                        >
                          <Icon className="h-7 w-7 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          setAddTileStep("type");
                          setAddTileSelectedType(null);
                          setAddTileEntitySearch("");
                        }}
                        className="mb-3 self-start px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                      >
                        ← Terug
                      </button>
                      <input
                        type="text"
                        value={addTileEntitySearch}
                        onChange={(e) => setAddTileEntitySearch(e.target.value)}
                        placeholder="Zoek op naam of entity_id (bijv. sensor.woonkamer)…"
                        className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                        autoFocus
                      />
                      <div className="overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                        {(() => {
                          const q = addTileEntitySearch.trim().toLowerCase();
                          const filtered = q
                            ? entitiesToShow.filter((e) => {
                                const name =
                                  ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase();
                                return name.includes(q) || e.entity_id.toLowerCase().includes(q);
                              })
                            : entitiesToShow;
                          if (filtered.length === 0) {
                            return (
                              <p className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                                {entitiesToShow.length === 0
                                  ? "Geen entities gevonden. Controleer je HA-verbinding in Instellingen."
                                  : "Geen resultaten voor je zoekopdracht."}
                              </p>
                            );
                          }
                          return filtered.map((e) => {
                            const name =
                              (e.attributes as { friendly_name?: string })?.friendly_name ??
                              e.entity_id;
                            return (
                              <button
                                key={e.entity_id}
                                type="button"
                                onClick={() => {
                                  if (addTileSelectedType) {
                                    const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                                    const titleOverride = addTileSelectedType === "nuts_card" ? (name || "Gas") : addTileSelectedType === "energy_monitor_card" ? (name || "Afbeeldingskaart") : addTileSelectedType === "power_usage_card" ? (name || "Stroomverbruik") : addTileSelectedType === "stat_pill_card" ? (name || "Stat") : undefined;
                                    const newId = handleAddTile(addTileSelectedType, e.entity_id, titleOverride);
                                    if ((addTileSelectedType === "nuts_card" || addTileSelectedType === "stat_pill_card") && newId) setEditingWidgetId(newId);
                                  }
                                  setAddTileOpen(false);
                                  setAddTileStep("type");
                                  setAddTileSelectedType(null);
                                  setAddTileEntitySearch("");
                                }}
                                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 truncate"
                                title={e.entity_id}
                              >
                                {name}
                              </button>
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
          </>
          <div className="relative z-[60]">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20"
              aria-label="Done editing"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
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

  const hasCardGroup = widgets.some((w) => w.type === "card_group");

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
        contentNoScroll={hasCardGroup}
      >
      <div className="space-y-6 overflow-x-hidden min-h-0">
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
            .filter((w) => w.type !== "media_card" && w.type !== "climate_card" && w.type !== "climate_card_2" && w.type !== "light_card" && w.type !== "solar_card" && w.type !== "energy_monitor_card" && w.type !== "power_usage_card" && w.type !== "stat_pill_card" && w.type !== "weather_card" && w.type !== "vacuum_card" && w.type !== "camera_card" && w.type !== "title_card" && w.type !== "pill_card" && w.type !== "room_card" && w.type !== "nuts_card" && w.type !== "card_group")
            .map((w) => {
              const item = layoutMap.get(w.id);
              if (!item) return null;
              return (
                <div
                  key={w.id}
                  className="relative h-full w-full"
                  {...(!editMode && {
                    onPointerDown: startLongPressForEdit,
                    onPointerUp: clearLongPressTimerAndRelease,
                    onPointerLeave: clearLongPressTimerAndRelease,
                    onPointerCancel: clearLongPressTimerAndRelease,
                    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
                    style: { touchAction: "none" },
                  })}
                >
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
                  <div className={cn("h-full w-full", editMode && "tile-drag-handle cursor-grab touch-none")}>
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
                      light_entity_id={w.light_entity_id}
                      media_player_entity_id={w.media_player_entity_id}
                      climate_entity_id={w.climate_entity_id}
                      background_image={w.background_image}
                      background_image_dark={w.background_image_dark}
                      image_conditions={w.image_conditions}
                      icon={w.icon}
                      size={w.size}
                      conditions={w.conditions}
                      current_entity_id={w.current_entity_id}
                      max_value={w.max_value}
                      grid_entity_id={w.grid_entity_id}
                      minimal={w.minimal}
                      label={w.label}
                      color={w.color}
                      device_entity_ids={w.device_entity_ids}
                      cost_per_kwh={w.cost_per_kwh}
                      onMoreClick={editMode ? () => setEditingWidgetId(w.id) : undefined}
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
              onEnterEditMode={() => setEditMode(true)}
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
                width: w.width,
                height: w.height,
              }))}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? (id) => setEditingWidgetId(id) : undefined}
              onRemove={editMode ? (id) => handleRemoveTile(id) : undefined}
            />
          ) : null;
        })()}

        {widgets
          .filter((w) => w.type === "light_card")
          .map((w, i) => (
            <FloatingLightCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? "Lamp",
                entity_id: w.entity_id,
                icon: w.icon,
              }}
              widgetIndex={i}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={() => {
                setEditMode(true);
                setEditingWidgetId(w.id);
              }}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {(() => {
          const firstSolar = widgets.find((w) => w.type === "solar_card");
          return firstSolar ? (
            <FloatingSolarCard
              title={firstSolar.title ?? "Zonnepanelen"}
              entity_id={firstSolar.entity_id}
              consumption_entity_id={firstSolar.consumption_entity_id}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
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
          const firstEnergyMonitor = widgets.find((w) => w.type === "energy_monitor_card");
          return firstEnergyMonitor ? (
            <FloatingEnergyMonitorCard
              title={firstEnergyMonitor.title ?? "Afbeeldingskaart"}
              entity_id={firstEnergyMonitor.entity_id}
              background_image={firstEnergyMonitor.background_image}
              background_image_dark={firstEnergyMonitor.background_image_dark}
              image_conditions={firstEnergyMonitor.image_conditions}
              minimal={firstEnergyMonitor.minimal}
              scale={firstEnergyMonitor.scale}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstEnergyMonitor.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstEnergyMonitor.id)
                  : undefined
              }
            />
          ) : null;
        })()}

        {(() => {
          const firstPowerUsage = widgets.find((w) => w.type === "power_usage_card");
          return firstPowerUsage ? (
            <FloatingPowerUsageCard
              title={firstPowerUsage.title ?? "Stroomverbruik"}
              entity_id={firstPowerUsage.entity_id}
              device_entity_ids={firstPowerUsage.device_entity_ids}
              cost_per_kwh={firstPowerUsage.cost_per_kwh}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstPowerUsage.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstPowerUsage.id)
                  : undefined
              }
            />
          ) : null;
        })()}

        {typeof document !== "undefined" &&
          widgets.some((w) => w.type === "stat_pill_card") &&
          createPortal(
            widgets
              .filter((w) => w.type === "stat_pill_card")
              .map((w, i) => (
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
                  onEnterEditMode={() => setEditMode(true)}
                  onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
                  onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
                />
              )),
            document.body
          )}

        {typeof document !== "undefined" &&
          widgets.some((w) => w.type === "sensor_card") &&
          createPortal(
            widgets
              .filter((w) => w.type === "sensor_card")
              .map((w, i) => (
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
                  onEnterEditMode={() => setEditMode(true)}
                  onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
                  onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
                />
              )),
            document.body
          )}

        {(() => {
          const firstWeather = widgets.find((w) => w.type === "weather_card");
          return firstWeather ? (
            <FloatingWeatherCard
              title={firstWeather.title ?? "Weather"}
              entity_id={firstWeather.entity_id}
              show_icon={firstWeather.show_icon}
              width={firstWeather.width}
              height={firstWeather.height}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
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
          const firstCamera = widgets.find((w) => w.type === "camera_card");
          return firstCamera ? (
            <FloatingCameraCard
              title={firstCamera.title ?? "Camera"}
              entity_id={firstCamera.entity_id}
              refresh={firstCamera.refresh}
              show_title={firstCamera.show_title}
              width={firstCamera.width}
              height={firstCamera.height}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(firstCamera.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(firstCamera.id)
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
              onEnterEditMode={() => setEditMode(true)}
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

        {widgets
          .filter((w) => w.type === "room_card")
          .map((w, i) => (
            <FloatingRoomCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? "Kamer",
                entity_id: w.entity_id,
                icon: w.icon,
                light_entity_id: w.light_entity_id,
                media_player_entity_id: w.media_player_entity_id,
                climate_entity_id: w.climate_entity_id,
                background_image: w.background_image,
                icon_background_color: w.icon_background_color,
                width: w.width,
                height: w.height,
              }}
              widgetIndex={i}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
              onCardClick={
                !editMode
                  ? () => setClickedCardForDefinition({ widgetId: w.id, title: w.title ?? "Kamer" })
                  : undefined
              }
            />
          ))}

        {widgets
          .filter((w) => w.type === "nuts_card")
          .map((w, i) => (
            <FloatingNutsCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? "Gas",
                entity_id: w.entity_id,
                current_entity_id: w.current_entity_id,
                icon: w.icon,
                icon_background_color: w.icon_background_color,
                max_value: w.max_value,
                width: w.width ?? 250,
                height: w.height ?? 130,
              }}
              widgetIndex={i}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {(() => {
          const titleCards = widgets.filter((w) => w.type === "title_card");
          return titleCards.length > 0 ? (
            <FloatingTitleCard
              widgets={titleCards.map((w) => ({
                id: w.id,
                title: w.title ?? "Titel",
              }))}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? (id) => setEditingWidgetId(id) : undefined}
              onRemove={editMode ? (id) => handleRemoveTile(id) : undefined}
            />
          ) : null;
        })()}

        {widgets
          .filter((w) => w.type === "pill_card")
          .map((w, i) => (
            <FloatingPillCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? "Pill",
                entity_id: w.entity_id,
                icon: w.icon,
                conditions: w.conditions as SensorCondition[] | undefined,
                show_state: w.show_state,
              }}
              widgetIndex={i}
              editMode={editMode}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {typeof document !== "undefined" &&
          createPortal(
            widgets
              .filter((w) => w.type === "card_group")
              .map((g, i) => (
                <FloatingCardGroup
                  key={g.id}
                  group={g}
                  widgetIndex={i}
                  editMode={editMode}
                  onEnterEditMode={() => setEditMode(true)}
                  onEdit={editMode ? () => setEditingWidgetId(g.id) : undefined}
                  onRemove={editMode ? () => handleRemoveTile(g.id) : undefined}
                />
              )),
            document.body
          )}

        {editingWidgetId && editingWidget && typeof document !== "undefined" && createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
              aria-hidden
              onClick={() => {
                if (editingWidget?.type === "card_group" && editingGroupChildId) {
                  setEditingGroupChildId(null);
                } else {
                  setEditingWidgetId(null);
                }
              }}
            />
            <div className={cn(
              "fixed top-4 right-4 bottom-4 z-50 w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl",
              editingWidget.type === "room_card" && "max-w-lg"
            )}>
              <div className="shrink-0 flex items-center justify-between p-5 pb-3 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {editingWidget.type === "title_card"
                  ? "Titel bewerken"
                  : editingWidget.type === "card_group"
                    ? editingGroupChildId
                      ? "Kaart in groep bewerken"
                      : "Kaartgroep bewerken"
                    : editingWidget.type === "room_card"
                      ? "Kamer bewerken"
                      : editingWidget.type === "power_usage_card"
                        ? "Stroomverbruik bewerken"
                        : "Edit tile"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (editingWidget?.type === "card_group" && editingGroupChildId) {
                    setEditingGroupChildId(null);
                  } else {
                    setEditingWidgetId(null);
                  }
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400"
                aria-label="Sluiten"
              >
                <X className="h-5 w-5" />
              </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 space-y-3">
                {editingWidget.type === "title_card" ? (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      <button
                        type="button"
                        onClick={() => setEditTab("algemeen")}
                        className={cn(
                          "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                          editTab === "algemeen"
                            ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        Algemeen
                      </button>
                    </div>
                    {editTab === "algemeen" && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Tekst
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="Bijv. Woonkamer, Verlichting"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                      </div>
                    )}
                  </>
                ) : editingWidget.type === "card_group" ? (
                  editingGroupChildId ? (
                    <>
                      <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                        {(["algemeen", "voorwaarden"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setEditTab(tab)}
                            className={cn(
                              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                              editTab === tab
                                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            )}
                          >
                            {tab === "algemeen" ? "Algemeen" : "Voorwaarden"}
                          </button>
                        ))}
                      </div>
                      {editTab === "algemeen" && (
                        <>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Naam</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Bijv. Woonkamer, Verlichting"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                      </div>
                      <EntitySelectWithSearch
                        entities={entities}
                        value={editForm.entity_id}
                        onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))}
                        filter={(e) => PILL_CARD_DOMAINS.some((d) => e.entity_id.startsWith(d + "."))}
                        label="Entity"
                        placeholder="Zoek op naam of entity_id…"
                        emptyOption="Geen"
                      />
                      <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Toon entiteitstatus</span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={editForm.show_state !== false}
                          onClick={() => setEditForm((prev) => ({ ...prev, show_state: prev.show_state === false }))}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                            editForm.show_state !== false ? "bg-[#4D2FB2] border-transparent" : "bg-gray-200 dark:bg-gray-600"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition translate-x-0.5",
                              editForm.show_state !== false ? "translate-x-5" : "translate-x-1"
                            )}
                          />
                        </button>
                      </label>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Icoon</label>
                        <input
                          type="text"
                          value={pillIconSearch}
                          onChange={(e) => setPillIconSearch(e.target.value)}
                          onFocus={() => setPillIconSearch(pillIconSearch || (editForm.icon ?? ""))}
                          placeholder="Zoek icoon (bijv. CircleDot, Sun…)"
                          className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                        <div className="max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditForm((prev) => ({ ...prev, icon: undefined }));
                              setPillIconSearch("");
                            }}
                            className={cn(
                              "rounded-md px-2 py-1 text-xs",
                              !editForm.icon ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            )}
                          >
                            Default (CircleDot)
                          </button>
                          {SENSOR_ICON_OPTIONS.filter((name) => name.toLowerCase().includes((pillIconSearch || "").toLowerCase())).map((name) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                setEditForm((prev) => ({ ...prev, icon: name }));
                                setPillIconSearch(name);
                              }}
                              className={cn(
                                "rounded-md px-2 py-1 text-xs",
                                (editForm.icon ?? "CircleDot") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                              )}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                        </>
                      )}
                      {editTab === "voorwaarden" && (
                      <div>
                        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Voorwaardelijke kleur (eerste match)</p>
                        {(editForm.conditions ?? []).map((cond, idx) => (
                          <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-1.5">
                            <select
                              value={cond.operator}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  conditions: (prev.conditions ?? []).map((c, i) => (i === idx ? { ...c, operator: e.target.value } : c)),
                                }))
                              }
                              className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                            >
                              {SENSOR_CONDITION_OPERATORS.map((op) => (
                                <option key={op} value={op}>
                                  {SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={cond.value}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  conditions: (prev.conditions ?? []).map((c, i) => (i === idx ? { ...c, value: e.target.value } : c)),
                                }))
                              }
                              placeholder="Waarde"
                              className="w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                            />
                            <select
                              value={cond.color}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  conditions: (prev.conditions ?? []).map((c, i) => (i === idx ? { ...c, color: e.target.value } : c)),
                                }))
                              }
                              className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
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
                              conditions: [...(prev.conditions ?? []), { operator: "eq", value: "", color: "green" }],
                            }))
                          }
                          className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full"
                        >
                          + Voeg voorwaarde toe
                        </button>
                      </div>
                      )}
                    </>
                  ) : (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["weergave", "kaarten"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "weergave" ? "Weergave" : "Kaarten"}
                        </button>
                      ))}
                    </div>
                    {editTab === "weergave" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Uitlijning</p>
                    <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5">
                      {(["start", "center", "end", "between"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => {
                            const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, alignment: align } : w));
                            setWidgets(nextWidgets);
                            saveMutation.mutate({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className={cn(
                            "rounded-md px-2 py-1 text-xs",
                            (editingWidget.alignment ?? "start") === align
                              ? "bg-[#4D2FB2] text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                          )}
                        >
                          {align === "start" ? "Links" : align === "center" ? "Midden" : align === "end" ? "Rechts" : "Tussen"}
                        </button>
                      ))}
                    </div>
                  </div>
                    )}
                    {editTab === "kaarten" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Kaarten in groep</p>
                    <ul className="space-y-1 max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                      {(editingWidget.children ?? []).map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                          <span className="truncate text-gray-900 dark:text-gray-100">{c.title || c.entity_id}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingGroupChildId(c.id)}
                              className="p-1 rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                              aria-label="Bewerken"
                              title="Kaart bewerken"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const nextChildren = (editingWidget.children ?? []).filter((x) => x.id !== c.id);
                                const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                                setWidgets(nextWidgets);
                                saveMutation.mutate({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                              }}
                              className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              aria-label="Verwijderen"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Kaart toevoegen</p>
                    <input
                      type="text"
                      value={groupAddEntitySearch}
                      onChange={(e) => setGroupAddEntitySearch(e.target.value)}
                      placeholder="Zoek op naam of entity_id (bijv. sensor.woonkamer)…"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                    />
                    <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                      {entities
                        .filter((e) => PILL_CARD_DOMAINS.some((d) => e.entity_id.startsWith(d + ".")))
                        .filter((e) => {
                          const q = groupAddEntitySearch.trim().toLowerCase();
                          if (!q) return true;
                          const name = ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase();
                          return name.includes(q) || e.entity_id.toLowerCase().includes(q);
                        })
                        .map((e) => {
                          const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                          return (
                            <button
                              key={e.entity_id}
                              type="button"
                              onClick={() => {
                                const newPill: WidgetConfig = {
                                  id: generateId(),
                                  type: "pill_card",
                                  title: name,
                                  entity_id: e.entity_id,
                                };
                                const nextChildren = [...(editingWidget.children ?? []), newPill];
                                const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                                setWidgets(nextWidgets);
                                saveMutation.mutate({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                                setGroupAddEntitySearch("");
                              }}
                              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 truncate"
                            >
                              {name}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                    )}
                  </>
                  )
                ) : (
                  <>
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                  />
                </div>
                {(editingWidget.entity_id != null || editingWidget.type === "energy_monitor_card" || editingWidget.type === "power_usage_card") && editingWidget.type !== "title_card" && editingWidget.type !== "room_card" && (
                  <EntitySelectWithSearch
                    entities={entities}
                    value={editForm.entity_id}
                    onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))}
                    filter={
                      editingWidget.type === "pill_card"
                        ? (e) => PILL_CARD_DOMAINS.some((d) => e.entity_id.startsWith(d + "."))
                        : editingWidget.type === "energy_monitor_card"
                          ? (e) => e.entity_id.startsWith("weather.") || e.entity_id.startsWith("sensor.")
                          : (e) => e.entity_id.startsWith((WIDGET_TYPE_DOMAIN[editingWidget.type] ?? "sensor") + ".")
                    }
                    label={
                      editingWidget.type === "solar_card"
                        ? "Yield (opbrengst)"
                        : editingWidget.type === "energy_monitor_card"
                          ? "Entity voor voorwaarden (bijv. weather.home)"
                          : editingWidget.type === "power_usage_card"
                            ? "Totaal verbruik (kWh, cumulative sensor)"
                            : editingWidget.type === "stat_pill_card"
                              ? "Sensor"
                              : "Entity"
                    }
                    placeholder="Zoek op naam of entity_id…"
                    emptyOption={editingWidget.type === "energy_monitor_card" ? "Geen (alleen standaardafbeelding)" : "Geen"}
                  />
                )}
                {editingWidget.type === "light_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      <button
                        type="button"
                        onClick={() => setEditTab("algemeen")}
                        className={cn(
                          "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                          editTab === "algemeen"
                            ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        Algemeen
                      </button>
                    </div>
                    {editTab === "algemeen" && (
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
                  </>
                )}
                {editingWidget.type === "room_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["entiteiten", "algemeen", "achtergrond", "weergave"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "entiteiten" ? "Entiteiten" : tab === "algemeen" ? "Algemeen" : tab === "achtergrond" ? "Achtergrond" : "Weergave"}
                        </button>
                      ))}
                    </div>
                    {editTab === "entiteiten" && (
                      <div className="space-y-4">
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v || "" }))}
                            label="Sensor (waardeweergave)"
                            placeholder="Zoek op naam of entity_id…"
                            emptyOption="Geen"
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Optioneel. Toont de actuele waarde van de sensor op de kaart.</p>
                        </div>
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.light_entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, light_entity_id: v || undefined }))}
                            filter={(e) => e.entity_id.startsWith("light.") || e.entity_id.startsWith("group.")}
                            label="Licht"
                            placeholder="Zoek licht of groep…"
                            emptyOption="Geen"
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Toont een lamp-icoon om het licht aan/uit te zetten.</p>
                        </div>
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.media_player_entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, media_player_entity_id: v || undefined }))}
                            filter={(e) => e.entity_id.startsWith("media_player.")}
                            label="Mediaplayer"
                            placeholder="Zoek mediaplayer…"
                            emptyOption="Geen"
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Toont een music-icoon wanneer er iets wordt afgespeeld.</p>
                        </div>
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.climate_entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, climate_entity_id: v || undefined }))}
                            filter={(e) => e.entity_id.startsWith("climate.") || e.entity_id.startsWith("sensor.")}
                            label="Klimaat"
                            placeholder="Zoek klimaat of temperatuursensor…"
                            emptyOption="Geen"
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Toont temperatuur met thermometer-icoon.</p>
                        </div>
                      </div>
                    )}
                    {editTab === "algemeen" && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Icoon</label>
                          <input
                            type="text"
                            value={iconSearch || ""}
                            onChange={(e) => setIconSearch(e.target.value)}
                            placeholder="Zoek icoon..."
                            className="mb-1.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                          <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5 max-h-28 overflow-auto">
                            {CARD_ICON_OPTIONS.filter((name) =>
                              name.toLowerCase().includes((iconSearch || "").toLowerCase())
                            ).map((name) => (
                              <button
                                key={name}
                                type="button"
                                onClick={() => setEditForm((prev) => ({ ...prev, icon: name }))}
                                className={cn(
                                  "rounded-md px-2 py-1 text-xs",
                                  (editForm.icon ?? "Home") === name
                                    ? "bg-[#4D2FB2] text-white"
                                    : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                                )}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Kleur icoon-badge</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={editForm.icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(editForm.icon_background_color) ? editForm.icon_background_color : "#3B82F6"}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, icon_background_color: e.target.value }))}
                              className="h-10 w-14 cursor-pointer rounded border border-gray-200 dark:border-white/10 bg-transparent"
                            />
                            <input
                              type="text"
                              value={editForm.icon_background_color ?? ""}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, icon_background_color: e.target.value || undefined }))}
                              placeholder="#3B82F6"
                              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {editTab === "achtergrond" && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Upload een foto van de kamer of plak een URL (bijv. van een camera-feed).
                        </p>
                        {editForm.background_image && (
                          <div
                            className="h-24 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                            style={{ backgroundImage: `url(${editForm.background_image})` }}
                          />
                        )}
                        <div className="flex gap-2">
                          <label className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                            {uploadingRoomBg ? "Uploaden…" : "Upload afbeelding"}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="sr-only"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file || !editingWidgetId) return;
                                e.target.value = "";
                                setUploadingRoomBg(true);
                                try {
                                  const formData = new FormData();
                                  formData.set("file", file);
                                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                                  const json = await res.json();
                                  if (!res.ok) throw new Error(json.error || "Upload failed");
                                  setEditForm((prev) => ({ ...prev, background_image: json.url }));
                                } finally {
                                  setUploadingRoomBg(false);
                                }
                              }}
                              disabled={uploadingRoomBg}
                            />
                          </label>
                          {editForm.background_image && (
                            <button
                              type="button"
                              onClick={() => setEditForm((prev) => ({ ...prev, background_image: undefined }))}
                              className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                            >
                              Verwijderen
                            </button>
                          )}
                        </div>
                        <input
                          type="url"
                          value={editForm.background_image ?? ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, background_image: e.target.value || undefined }))}
                          placeholder="/uploads/... of https://..."
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                      </div>
                    )}
                    {editTab === "weergave" && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Breedte kaart (px)</label>
                          <input
                            type="number"
                            min={200}
                            max={500}
                            step={10}
                            value={editForm.width ?? 280}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder="280"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">200–500 px (standaard 280)</p>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Hoogte kaart (px)</label>
                          <input
                            type="number"
                            min={80}
                            max={300}
                            step={10}
                            value={editForm.height ?? 120}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder="120"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">80–300 px (standaard 120)</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {(editingWidget.type === "climate_card_2" || editingWidget.type === "climate_card") && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "weergave"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Weergave"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Icoon
                      </label>
                      <select
                        value={editForm.icon ?? "Thermometer"}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, icon: e.target.value || undefined }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                      >
                        {CARD_ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <EntitySelectWithSearch
                      entities={entities}
                      value={editForm.humidity_entity_id ?? ""}
                      onChange={(v) =>
                        setEditForm((prev) => ({
                          ...prev,
                          humidity_entity_id: v || undefined,
                        }))
                      }
                      filter={(e) => e.entity_id.startsWith("sensor.")}
                      label="Luchtvochtigheid (optioneel)"
                      placeholder="Zoek sensor…"
                      emptyOption="Geen"
                    />
                    </>
                    )}
                    {editTab === "weergave" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Breedte kaart (px)
                      </label>
                      <input
                        type="number"
                        min={200}
                        max={500}
                        step={10}
                        value={editForm.width ?? 320}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder="320"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">200–500 px (standaard 320)</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Hoogte kaart (px)
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={400}
                        step={10}
                        value={editForm.height ?? 180}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder="180"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">100–400 px (standaard 180)</p>
                    </div>
                    </>
                    )}
                  </>
                )}
                {editingWidget.type === "solar_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      <button
                        type="button"
                        onClick={() => setEditTab("algemeen")}
                        className={cn(
                          "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                          editTab === "algemeen"
                            ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        Algemeen
                      </button>
                    </div>
                    {editTab === "algemeen" && (
                  <EntitySelectWithSearch
                    entities={entities}
                    value={editForm.consumption_entity_id ?? ""}
                    onChange={(v) =>
                      setEditForm((prev) => ({
                        ...prev,
                        consumption_entity_id: v || undefined,
                      }))
                    }
                    filter={(e) => e.entity_id.startsWith("sensor.")}
                    label="Consumption (verbruik, optioneel)"
                    placeholder="Zoek sensor…"
                    emptyOption="Geen"
                  />
                    )}
                  </>
                )}
                {editingWidget.type === "energy_monitor_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["achtergrond", "weergave", "voorwaarden"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "achtergrond" ? "Achtergrond" : tab === "weergave" ? "Weergave" : "Voorwaarden"}
                        </button>
                      ))}
                    </div>
                    {editTab === "achtergrond" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Achtergrondafbeelding light mode (URL)
                      </label>
                      <input
                        type="text"
                        value={editForm.background_image ?? ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            background_image: e.target.value || undefined,
                          }))
                        }
                        placeholder="/energy-house.png of https://..."
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Achtergrondafbeelding dark mode (URL, optioneel)
                      </label>
                      <input
                        type="text"
                        value={editForm.background_image_dark ?? ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            background_image_dark: e.target.value || undefined,
                          }))
                        }
                        placeholder="Leeg =zelfde als light mode"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Plaats afbeeldingen in public/ of gebruik externe URLs.
                      </p>
                    </div>
                    </>
                    )}
                    {editTab === "weergave" && (
                    <>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="energy-minimal"
                        checked={editForm.minimal ?? false}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, minimal: e.target.checked }))
                        }
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="energy-minimal" className="text-sm text-gray-700 dark:text-gray-300">
                        Minimalistisch (alleen afbeelding, geen titel of rand)
                      </label>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Schaalfactor ({(editForm.scale ?? 1).toFixed(1)}×)
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={editForm.scale ?? 1}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            scale: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                    </>
                    )}
                    {editTab === "voorwaarden" && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Voorwaarden (afbeelding bij waarde)
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        Eerste voorwaarde die klopt bepaalt de afbeelding. Bijv. sunny → zon.jpg, rainy → regen.jpg. Entity hierboven moet zijn ingesteld.
                      </p>
                      {(editForm.image_conditions ?? []).map((cond, idx) => (
                        <div key={idx} className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-2">
                          <select
                            value={cond.operator}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                image_conditions: (prev.image_conditions ?? []).map((c, i) =>
                                  i === idx ? { ...c, operator: e.target.value } : c
                                ),
                              }))
                            }
                            className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                          >
                            {SENSOR_CONDITION_OPERATORS.map((op) => (
                              <option key={op} value={op}>{SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={cond.value}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                image_conditions: (prev.image_conditions ?? []).map((c, i) =>
                                  i === idx ? { ...c, value: e.target.value } : c
                                ),
                              }))
                            }
                            placeholder="Waarde (bijv. sunny)"
                            className="flex-1 min-w-[80px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                          />
                          <input
                            type="text"
                            value={cond.image}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                image_conditions: (prev.image_conditions ?? []).map((c, i) =>
                                  i === idx ? { ...c, image: e.target.value } : c
                                ),
                              }))
                            }
                            placeholder="Afbeelding (URL)"
                            className="flex-1 min-w-[100px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                          />
                          <input
                            type="text"
                            value={cond.image_dark ?? ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                image_conditions: (prev.image_conditions ?? []).map((c, i) =>
                                  i === idx ? { ...c, image_dark: e.target.value || undefined } : c
                                ),
                              }))
                            }
                            placeholder="Dark (optioneel)"
                            className="w-24 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditForm((prev) => ({
                                ...prev,
                                image_conditions: (prev.image_conditions ?? []).filter((_, i) => i !== idx),
                              }))
                            }
                            className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            image_conditions: [...(prev.image_conditions ?? []), { operator: "eq", value: "", image: "", image_dark: undefined }],
                          }))
                        }
                        className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full"
                      >
                        + Voorwaarde toevoegen
                      </button>
                    </div>
                    )}
                  </>
                )}
                {editingWidget.type === "power_usage_card" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Apparaten (per-apparaat verbruik)
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        Selecteer energie-sensoren voor een breakdown per apparaat. Bijv. sensor.tv_energy, sensor.fridge_energy.
                      </p>
                      <div className="max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1">
                        {entities
                          .filter((e) => e.entity_id.startsWith("sensor."))
                          .map((e) => {
                            const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                            const checked = (editForm.device_entity_ids ?? []).includes(e.entity_id);
                            return (
                              <label
                                key={e.entity_id}
                                className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    const ids = editForm.device_entity_ids ?? [];
                                    setEditForm((prev) => ({
                                      ...prev,
                                      device_entity_ids: checked
                                        ? ids.filter((id) => id !== e.entity_id)
                                        : [...ids, e.entity_id],
                                    }));
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-[#4D2FB2] focus:ring-[#4D2FB2]"
                                />
                                <span className="text-sm truncate" title={e.entity_id}>{name}</span>
                              </label>
                            );
                          })}
                        {entities.filter((e) => e.entity_id.startsWith("sensor.")).length === 0 && (
                          <p className="text-xs text-gray-500 py-2">Geen sensoren gevonden.</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Kosten per kWh (€)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={0.001}
                        value={editForm.cost_per_kwh ?? ""}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : parseFloat(e.target.value);
                          setEditForm((prev) => ({ ...prev, cost_per_kwh: v != null && !Number.isNaN(v) ? v : undefined }));
                        }}
                        placeholder="0.25"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Optioneel. Voor berekening kosten vandaag.</p>
                    </div>
                  </>
                )}
                {editingWidget.type === "stat_pill_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "voorwaarden"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Voorwaarden"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Label (onder de waarde)
                      </label>
                      <input
                        type="text"
                        value={editForm.label ?? ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, label: e.target.value || undefined }))
                        }
                        placeholder="Opbrengst, Verbruik, ..."
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Icoon
                      </label>
                      <select
                        value={editForm.icon ?? "Sun"}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, icon: e.target.value || undefined }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                      >
                        {CARD_ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Kleur (standaard)
                      </label>
                      <select
                        value={editForm.color ?? "amber"}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            color: e.target.value as "amber" | "purple" | "emerald" | "red",
                          }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                      >
                        <option value="amber">Amber (geel)</option>
                        <option value="purple">Paars</option>
                        <option value="emerald">Smaragd (groen)</option>
                        <option value="red">Rood</option>
                      </select>
                    </div>
                    </>
                    )}
                    {editTab === "voorwaarden" && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Voorwaarden (kleur aanpassen bij waarde)
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        Eerste voorwaarde die klopt bepaalt de kleur. Bijv. plastic = groen, papier = blauw.
                      </p>
                      {(editForm.conditions ?? []).map((cond, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-2"
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
                            className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                          >
                            {SENSOR_CONDITION_OPERATORS.map((op) => (
                              <option key={op} value={op}>
                                {SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}
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
                            placeholder="Waarde (bijv. plastic)"
                            className="w-24 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
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
                            className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
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
                            conditions: [...(prev.conditions ?? []), { operator: "eq", value: "", color: "green" }],
                          }))
                        }
                        className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full"
                      >
                        + Voeg voorwaarde toe
                      </button>
                    </div>
                    )}
                  </>
                )}
                {editingWidget.type === "vacuum_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "weergave"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Weergave"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
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
                                className="flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1.5 text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-3">
                      <EntitySelectWithSearch
                        entities={entities}
                        value={editForm.cleaned_area_entity_id ?? ""}
                        onChange={(v) =>
                          setEditForm((prev) => ({
                            ...prev,
                            cleaned_area_entity_id: v || undefined,
                          }))
                        }
                        filter={(e) => e.entity_id.startsWith("sensor.")}
                        label="Sensor onder status (bijv. cleaned area)"
                        placeholder="Zoek sensor…"
                        emptyOption="Geen"
                      />
                    </div>
                  </div>
                    )}
                    {editTab === "weergave" && (
                  <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Icoon
                      </label>
                      <input
                        type="text"
                        value={vacuumIconSearch}
                        onChange={(e) => setVacuumIconSearch(e.target.value)}
                        onFocus={() => setVacuumIconSearch(vacuumIconSearch || (editForm.icon ?? ""))}
                        placeholder="Zoek icoon (bijv. home, bot, sparkles…)"
                        className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
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
                    )}
                  </>
                )}
                {editingWidget.type === "sensor_card" && (
                  <div>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "voorwaarden"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Conditionele voorwaarden"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                      <>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          Icoon
                        </label>
                        <input
                          type="text"
                          value={sensorIconSearch}
                          onChange={(e) => setSensorIconSearch(e.target.value)}
                          onFocus={() => setSensorIconSearch(sensorIconSearch || (editForm.icon ?? ""))}
                          placeholder="Zoek icoon (bijv. gauge, thermometer…)"
                          className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
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
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          >
                            <option value="sm">Klein</option>
                            <option value="md">Normaal</option>
                            <option value="lg">Groot</option>
                          </select>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="sensor-show-icon"
                            checked={editForm.show_icon !== false}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, show_icon: e.target.checked }))
                            }
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                          />
                          <label htmlFor="sensor-show-icon" className="text-sm text-gray-700 dark:text-gray-300">
                            Icoon tonen
                          </label>
                        </div>
                      </>
                    )}
                    {editTab === "voorwaarden" && (
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
                              className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                            >
                              {SENSOR_CONDITION_OPERATORS.map((op) => (
                                <option key={op} value={op}>
                                  {SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}
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
                              className="w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
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
                              className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
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
                {editingWidget.type === "pill_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "voorwaarden"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Voorwaarden"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                  <div className="space-y-3">
                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Toon entiteitstatus
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={editForm.show_state !== false}
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, show_state: prev.show_state === false }))
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                          editForm.show_state !== false
                            ? "bg-[#4D2FB2] border-transparent"
                            : "bg-gray-200 dark:bg-gray-600"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition translate-x-0.5",
                            editForm.show_state !== false ? "translate-x-5" : "translate-x-1"
                          )}
                        />
                      </button>
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                      Toon of verberg de waarde (Aan/Uit of sensorwaarde) op de pill.
                    </p>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Icoon
                      </label>
                      <input
                        type="text"
                        value={pillIconSearch}
                        onChange={(e) => setPillIconSearch(e.target.value)}
                        onFocus={() => setPillIconSearch(pillIconSearch || (editForm.icon ?? ""))}
                        placeholder="Zoek icoon (bijv. CircleDot, Sun…)"
                        className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <div className="max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm((prev) => ({ ...prev, icon: undefined }));
                            setPillIconSearch("");
                          }}
                          className={cn(
                            "rounded-md px-2 py-1 text-xs",
                            !editForm.icon
                              ? "bg-[#4D2FB2] text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                          )}
                        >
                          Default (CircleDot)
                        </button>
                        {SENSOR_ICON_OPTIONS.filter((name) =>
                          name.toLowerCase().includes((pillIconSearch || "").toLowerCase())
                        ).map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setEditForm((prev) => ({ ...prev, icon: name }));
                              setPillIconSearch(name);
                            }}
                            className={cn(
                              "rounded-md px-2 py-1 text-xs",
                              (editForm.icon ?? "CircleDot") === name
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
                    {editTab === "voorwaarden" && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Voorwaardelijke kleur (eerste match)
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Bepaal de pill-kleur op basis van de entity state.
                      </p>
                      {(editForm.conditions ?? []).map((cond, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-1.5"
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
                            className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                          >
                            {SENSOR_CONDITION_OPERATORS.map((op) => (
                              <option key={op} value={op}>
                                {SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}
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
                            className="w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
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
                            className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
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
                            conditions: [...(prev.conditions ?? []), { operator: "eq", value: "", color: "green" }],
                          }))
                        }
                        className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full"
                      >
                        + Voeg voorwaarde toe
                      </button>
                    </div>
                    )}
                  </>
                )}
                {editingWidget.type === "camera_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "weergave"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Weergave"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Toon titel
                      </label>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={editForm.show_title !== false}
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, show_title: !(prev.show_title !== false) }))
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2",
                          editForm.show_title !== false
                            ? "bg-[#4D2FB2]"
                            : "bg-gray-200 dark:bg-gray-600"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
                            editForm.show_title !== false ? "translate-x-5" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Vernieuw interval (seconden)
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={120}
                        step={1}
                        value={editForm.refresh ?? 10}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            refresh: v != null && !Number.isNaN(v) ? v : 10,
                          }));
                        }}
                        placeholder="10"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">2–120 seconden (standaard 10)</p>
                    </div>
                    </>
                    )}
                    {editTab === "weergave" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Breedte kaart (px)
                      </label>
                      <input
                        type="number"
                        min={200}
                        max={600}
                        step={10}
                        value={editForm.width ?? 360}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder="360"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">200–600 px (standaard 360)</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Hoogte kaart (px)
                      </label>
                      <input
                        type="number"
                        min={150}
                        max={450}
                        step={10}
                        value={editForm.height ?? 270}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder="270"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">150–450 px (standaard 270)</p>
                    </div>
                    </>
                    )}
                  </>
                )}
                {editingWidget.type === "weather_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "weergave"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Weergave"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
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
                    {editTab === "weergave" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Breedte kaart (px)
                      </label>
                      <input
                        type="number"
                        min={200}
                        max={500}
                        step={10}
                        value={editForm.width ?? 320}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder="320"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">200–500 px (standaard 320)</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Hoogte kaart (px)
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={400}
                        step={10}
                        value={editForm.height ?? 180}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder="180"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">100–400 px (standaard 180)</p>
                    </div>
                    </>
                    )}
                  </>
                )}
                {editingWidget.type === "nuts_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["algemeen", "weergave"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setEditTab(tab)}
                          className={cn(
                            "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            editTab === tab
                              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          )}
                        >
                          {tab === "algemeen" ? "Algemeen" : "Weergave"}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Icoon
                      </label>
                      <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5 max-h-32 overflow-auto">
                        {(["Fuel", "Droplets", "Zap", "Gauge", "Thermometer"].filter((n) => CARD_ICON_OPTIONS.includes(n)) as string[]).map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() =>
                              setEditForm((prev) => ({ ...prev, icon: name }))
                            }
                            className={cn(
                              "rounded-md px-2 py-1 text-xs",
                              (editForm.icon ?? "Fuel") === name
                                ? "bg-[#4D2FB2] text-white"
                                : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            )}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Kleur icoon
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editForm.icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(editForm.icon_background_color) ? editForm.icon_background_color : "#3B82F6"}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              icon_background_color: e.target.value,
                            }))
                          }
                          className="h-8 w-12 cursor-pointer rounded border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5"
                        />
                        <input
                          type="text"
                          value={editForm.icon_background_color ?? "#3B82F6"}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              icon_background_color: e.target.value || undefined,
                            }))
                          }
                          placeholder="#3B82F6"
                          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    <EntitySelectWithSearch
                      entities={entities}
                      value={editForm.entity_id ?? ""}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))}
                      filter={(e) => e.entity_id.startsWith("sensor.")}
                      label="Entity dagverbruik (totaal per dag)"
                      placeholder="Zoek sensor…"
                      emptyOption="Kies entity…"
                    />
                    <EntitySelectWithSearch
                      entities={entities}
                      value={editForm.current_entity_id ?? ""}
                      onChange={(v) =>
                        setEditForm((prev) => ({ ...prev, current_entity_id: v || undefined }))
                      }
                      filter={(e) => e.entity_id.startsWith("sensor.")}
                      label="Entity huidig verbruik (optioneel)"
                      placeholder="Zoek sensor…"
                      emptyOption="Geen (toont 0 voor huidig)"
                    />
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Max waarde voor bar (optioneel)
                      </label>
                      <input
                        type="number"
                        min={1}
                        step={0.1}
                        value={editForm.max_value ?? 10}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            max_value: v != null && !Number.isNaN(v) && v > 0 ? v : undefined,
                          }));
                        }}
                        placeholder="10"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Schaal voor verticale verbruiksbalk</p>
                    </div>
                    </>
                    )}
                    {editTab === "weergave" && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Breedte × hoogte (px)
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="number"
                            min={150}
                            max={400}
                            step={10}
                            value={editForm.width ?? 250}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder="250"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Breedte</p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            min={80}
                            max={300}
                            step={10}
                            value={editForm.height ?? 130}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder="130"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Hoogte</p>
                        </div>
                      </div>
                    </div>
                    )}
                  </>
                )}
                </>
                )
              }
              </div>
                <div className="shrink-0 flex justify-between gap-2 p-5 pt-4 pb-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
                  {editingWidget.type === "card_group" && editingGroupChildId ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingGroupChildId(null)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        Terug
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const nextChildren = (editingWidget.children ?? []).filter((c) => c.id !== editingGroupChildId);
                            const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                            setWidgets(nextWidgets);
                            setEditingGroupChildId(null);
                            saveMutation.mutate({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label="Kaart uit groep verwijderen"
                        >
                          Verwijderen
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const child = (editingWidget.children ?? []).find((c) => c.id === editingGroupChildId);
                            if (child) {
                              const newChild: WidgetConfig = { ...child, id: generateId() };
                              const nextChildren = [...(editingWidget.children ?? []), newChild];
                              const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                              setWidgets(nextWidgets);
                              setEditingGroupChildId(newChild.id);
                              saveMutation.mutate({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                            }
                          }}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                          aria-label="Kaart in groep dupliceren"
                        >
                          Dupliceren
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updates = {
                              title: editForm.title,
                              entity_id: editForm.entity_id,
                              icon: editForm.icon || undefined,
                              conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined,
                              show_state: editForm.show_state !== false,
                            };
                            const nextChildren = (editingWidget.children ?? []).map((c) =>
                              c.id === editingGroupChildId ? { ...c, ...updates } : c
                            );
                            const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                            setWidgets(nextWidgets);
                            setEditingGroupChildId(null);
                            saveMutation.mutate({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className="rounded-lg bg-[#4D2FB2] px-3 py-1.5 text-sm text-white hover:opacity-90"
                        >
                          Opslaan
                        </button>
                      </div>
                    </>
                  ) : editingWidget.type === "card_group" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const newWidgets = widgets.filter((w) => w.id !== editingWidgetId);
                          const newLayout = layout.filter((item) => item.i !== editingWidgetId);
                          setWidgets(newWidgets);
                          setLayout(newLayout);
                          setEditingWidgetId(null);
                          saveMutation.mutate({
                            layout: newLayout,
                            widgets: newWidgets,
                            welcomeTitle,
                            welcomeSubtitle,
                          });
                        }}
                        className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Kaartgroep verwijderen"
                      >
                        Verwijderen
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleDuplicateTile(editingWidgetId!);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                        aria-label="Kaartgroep dupliceren"
                      >
                        Dupliceren
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingWidgetId(null)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        Annuleren
                      </button>
                    </>
                  ) : (
                    <>
                  <button
                    type="button"
                    onClick={() => {
                      const newWidgets = widgets.filter((w) => w.id !== editingWidgetId);
                      const newLayout = layout.filter((item) => item.i !== editingWidgetId);
                      setWidgets(newWidgets);
                      setLayout(newLayout);
                      setEditingWidgetId(null);
                      saveMutation.mutate({
                        layout: newLayout,
                        widgets: newWidgets,
                        welcomeTitle,
                        welcomeSubtitle,
                      });
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Kaart verwijderen"
                  >
                    Verwijderen
                  </button>
                  <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingWidgetId(null)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                  >
                    Annuleren
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDuplicateTile(editingWidgetId!);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    aria-label="Kaart dupliceren"
                  >
                    Dupliceren
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updates = {
                        title: editForm.title,
                        ...(editingWidget.entity_id != null && editingWidget.type !== "energy_monitor_card" && editingWidget.type !== "power_usage_card" && {
                          entity_id: editForm.entity_id,
                        }),
                        ...(editingWidget.type === "solar_card" && {
                          consumption_entity_id: editForm.consumption_entity_id || undefined,
                        }),
                        ...(editingWidget.type === "energy_monitor_card" && {
                          entity_id: editForm.entity_id || undefined,
                          background_image: editForm.background_image || undefined,
                          background_image_dark: editForm.background_image_dark || undefined,
                          image_conditions: (editForm.image_conditions ?? []).filter((c) => c.image?.trim()).length > 0
                            ? (editForm.image_conditions ?? []).filter((c) => c.image?.trim())
                            : undefined,
                          minimal: editForm.minimal ?? false,
                          scale: editForm.scale ?? 1,
                        }),
                        ...(editingWidget.type === "power_usage_card" && {
                          entity_id: editForm.entity_id || undefined,
                          device_entity_ids: (editForm.device_entity_ids ?? []).length > 0 ? editForm.device_entity_ids : undefined,
                          cost_per_kwh: editForm.cost_per_kwh != null && editForm.cost_per_kwh > 0 ? editForm.cost_per_kwh : undefined,
                        }),
                        ...(editingWidget.type === "stat_pill_card" && {
                          label: editForm.label || undefined,
                          icon: editForm.icon || undefined,
                          color: editForm.color || undefined,
                          conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined,
                        }),
                        ...((editingWidget.type === "climate_card_2" || editingWidget.type === "climate_card") && {
                          humidity_entity_id: editForm.humidity_entity_id || undefined,
                          icon: editForm.icon || undefined,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
                        }),
                        ...(editingWidget.type === "light_card" && {
                          icon: editForm.icon || undefined,
                        }),
                        ...(editingWidget.type === "weather_card" && {
                          show_icon: editForm.show_icon !== false,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
                        }),
                        ...(editingWidget.type === "camera_card" && {
                          refresh: editForm.refresh ?? 10,
                          show_title: editForm.show_title !== false,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
                        }),
                        ...(editingWidget.type === "vacuum_card" && {
                          script_ids: editForm.script_ids ?? [],
                          script_names: editForm.script_names ?? {},
                          cleaned_area_entity_id: editForm.cleaned_area_entity_id || undefined,
                          icon: editForm.icon || undefined,
                        }),
                        ...(editingWidget.type === "sensor_card" && {
                          icon: editForm.icon || undefined,
                          show_icon: editForm.show_icon !== false,
                          size: editForm.size || undefined,
                          conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined,
                        }),
                        ...(editingWidget.type === "pill_card" && {
                          icon: editForm.icon || undefined,
                          conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined,
                          show_state: editForm.show_state !== false,
                        }),
                        ...(editingWidget.type === "nuts_card" && {
                          icon: editForm.icon || undefined,
                          icon_background_color: editForm.icon_background_color || undefined,
                          entity_id: editForm.entity_id || undefined,
                          current_entity_id: editForm.current_entity_id || undefined,
                          max_value: editForm.max_value != null && editForm.max_value > 0 ? editForm.max_value : undefined,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
                        }),
                        ...(editingWidget.type === "room_card" && {
                          icon: editForm.icon || undefined,
                          entity_id: editForm.entity_id || undefined,
                          light_entity_id: editForm.light_entity_id || undefined,
                          media_player_entity_id: editForm.media_player_entity_id || undefined,
                          climate_entity_id: editForm.climate_entity_id || undefined,
                          background_image: editForm.background_image || undefined,
                          icon_background_color: editForm.icon_background_color || undefined,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
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
                    Opslaan
                  </button>
                  </div>
                    </>
                  )}
                </div>
              </div>
          </>,
          document.body
        )}

        {clickedCardForDefinition &&
          typeof document !== "undefined" &&
          createPortal(
            <CardDefinitionModal
              title={clickedCardForDefinition.title}
              definition={{
                light_entity_id:
                  widgets.find((x) => x.id === clickedCardForDefinition.widgetId)?.light_entity_id,
                media_player_entity_id:
                  widgets.find((x) => x.id === clickedCardForDefinition.widgetId)
                    ?.media_player_entity_id,
                climate_entity_id:
                  widgets.find((x) => x.id === clickedCardForDefinition.widgetId)
                    ?.climate_entity_id,
              }}
              entities={definitionModalEntities}
              onClose={() => setClickedCardForDefinition(null)}
              onSave={(def) => {
                const wid = widgets.find((w) => w.id === clickedCardForDefinition.widgetId);
                if (!wid || wid.type !== "room_card") return;
                const next = widgets.map((w) =>
                  w.id === clickedCardForDefinition.widgetId
                    ? {
                        ...w,
                        light_entity_id: def.light_entity_id,
                        media_player_entity_id: def.media_player_entity_id,
                        climate_entity_id: def.climate_entity_id,
                      }
                    : w
                );
                setWidgets(next);
                saveMutation.mutate({
                  layout,
                  widgets: next,
                  welcomeTitle,
                  welcomeSubtitle,
                });
              }}
            />,
            document.body
          )}
      </div>
    </AppShell>
  );
}
