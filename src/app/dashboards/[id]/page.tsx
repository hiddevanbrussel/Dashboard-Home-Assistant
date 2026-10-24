"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { EntitySelectWithSearch } from "@/components/entity-select-with-search";
import { CardDefinitionModal } from "@/components/card-definition-modal";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal, flushSync } from "react-dom";
import ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { ArrowLeft, RobotVacuum, CalendarDays, Check, Timer, Trash2, ChevronDown, ChevronUp, CircleDot, CloudSun, Fuel, Gauge, Home, Image as ImageIcon, Layers, LayoutGrid, Lightbulb, ListTodo, Music2, Pencil, Plus, ShieldCheck, SlidersHorizontal, Sun, Thermometer, Trophy, Type, Video, X, Zap } from "lucide-react";
import { ArrowRightLeft, ArrowUpToLine } from "lucide-react";
import { TileMenu, anchorFromElement, type TileMenuAnchor, type TileMenuItem } from "@/components/layout/tile-menu";
import { HeaderStatPills } from "@/components/layout/header-stat-pills";
import { TOPBAR_PILL_MAX, canPinMore, ensureGridPosition, moveToGrid, moveToTopbar, topbarPills } from "@/lib/topbar-pills";

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
  MEDIA_CARD_DEFAULT_WIDTH,
  MEDIA_CARD_DEFAULT_HEIGHT,
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
  VacuumCard2Widget,
  FloatingVacuumCard2,
  SensorCardWidget,
  FloatingSensorCard,
  TextCardWidget,
  FloatingTextCard,
  CARD_ICON_OPTIONS,
  CARD_ICONS,
  STAT_PILL_ICON_OPTIONS,
  normalizeStatPillIconKey,
  CLIMATE_ICON_OPTIONS,
  VACUUM_ICON_OPTIONS,
  SENSOR_ICON_OPTIONS,
  SENSOR_CONDITION_COLORS,
  SENSOR_CONDITION_OPERATORS,
  SENSOR_CONDITION_OPERATOR_LABELS,
  FloatingPillCard,
  FloatingCardGroup,
  FloatingSmartStack,
  SmartStackWidget,
  RoomCardWidget,
  FloatingRoomCard,
  NutsCardWidget,
  FloatingNutsCard,
  EnergyMonitorCardWidget,
  FloatingEnergyMonitorCard,
  PowerUsageCardWidget,
  DeviceConsumptionCardWidget,
  FloatingPowerUsageCard,
  FloatingDeviceConsumptionCard,
  StatPillCardWidget,
  FloatingStatPillCard,
  CameraCardWidget,
  FloatingCameraCard,
  TeamtrackerCardWidget,
  FloatingTeamtrackerCard,
  AlarmCardWidget,
  FloatingAlarmCard,
  ChoreCardWidget,
  FloatingChoreCard,
  CalendarCardWidget,
  FloatingCalendarCard,
  TimerCardWidget,
  FloatingTimerCard,
  TrashCardWidget,
  FloatingTrashCard,
} from "@/components/widgets";
import type { WidgetConfig } from "@/stores/onboarding-store";
import type { ImageCondition, SensorCondition } from "@/components/widgets";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { getEditModeAllowed, getEditModePasscode, checkEditModePasscode } from "@/stores/dashboard-settings-store";
import { OfflinePill } from "@/components/offline-pill";
import { useTranslation } from "@/hooks/use-translation";
import { useDashboardEditFlag } from "@/hooks/use-dashboard-edit-flag";
import { cn, generateId } from "@/lib/utils";
import { cssUrl } from "@/lib/base-path";
import { DashboardPager } from "@/components/dashboard-pager";
import { UndoToast, UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";
import { LinkedRoomList } from "@/components/rooms/linked-room-list";
import { RoomPanel, toPanelRoom } from "@/components/rooms/room-panel";
import { reduceRoomCardLink } from "@/lib/room-catalog";
import { writeRoomDeleteHandoff } from "@/lib/room-removal";
import {
  addTileHistoryDepth,
  backAddTileHistory,
  bindAddTilePop,
  discardAddTileHistory,
  pushAddTileHistory,
  type AddTileStep,
} from "@/lib/add-tile-history";
import {
  clearTilePositionStorage,
  planCancelPendingAdd,
  planConfirmPendingAdd,
  planUndoAddedTile,
  tileDefersSave,
} from "@/lib/add-tile-commit";
import {
  resolveTilePosition,
  defaultTileSize,
  TILE_EDIT_BAR_INSET_PX,
  TILE_SIDEBAR_INSET_PX,
  type TileRect,
} from "@/lib/tile-placement";
import { forgetTilePosition, writeTilePosition } from "@/lib/tile-position-storage";
import {
  clampPageIndex,
  DASHBOARD_MAX_PAGES,
  parseDashboardLayout,
  resolvePageCount,
  serializeDashboardLayout,
  widgetPage,
} from "@/lib/dashboard-pages";
import {
  createSerializedSaveQueue,
  readFloatingPositions,
  restoreFloatingPositions,
  shouldApplyPagedSave,
  stepPageRemoval,
  type PageRemovalStep,
  type PageSnapshot,
  type PendingPageRemoval,
} from "@/lib/dashboard-page-removal";
import { isWidgetTypeTemporarilyDisabled } from "@/lib/disabled-widget-types";
import {
  clampClimateCardHeight,
  clampClimateCardWidth,
  climateCardDefaultSizeForMode,
  CLIMATE_CARD_DEFAULT_HEIGHT,
  CLIMATE_CARD_DEFAULT_WIDTH,
  CLIMATE_CARD_MAX_HEIGHT,
  CLIMATE_CARD_MAX_WIDTH,
  CLIMATE_CARD_MIN_HEIGHT,
  CLIMATE_CARD_MIN_WIDTH,
  normalizeClimateDisplayMode,
} from "@/lib/climate-card";
import {
  NUTS_CARD_DEFAULT_HEIGHT,
  NUTS_CARD_DEFAULT_WIDTH,
  NUTS_CARD_MAX_HEIGHT,
  NUTS_CARD_MAX_WIDTH,
  NUTS_CARD_MIN_HEIGHT,
  NUTS_CARD_MIN_WIDTH,
  clampNutsCardHeight,
  clampNutsCardWidth,
  normalizeNutsAccent,
  normalizeNutsPeriod,
} from "@/lib/nuts-card";
import {
  SMART_STACK_CHILD_TYPES,
  SMART_STACK_DEFAULT_HEIGHT,
  SMART_STACK_DEFAULT_INTERVAL_SEC,
  SMART_STACK_DEFAULT_WIDTH,
  SMART_STACK_MAX_HEIGHT,
  SMART_STACK_MAX_INTERVAL_SEC,
  SMART_STACK_MAX_WIDTH,
  SMART_STACK_MIN_HEIGHT,
  SMART_STACK_MIN_INTERVAL_SEC,
  SMART_STACK_MIN_WIDTH,
  buildSmartStackChildUpdates,
  clampSmartStackHeight,
  clampSmartStackIntervalSec,
  clampSmartStackWidth,
  isSmartStackAutoplayEnabled,
  isSmartStackChildType,
  stripSmartStackChildSize,
} from "@/lib/smart-stack";
import { SmartStackChild } from "@/components/widgets/smart-stack-child";
import {
  clampVacuumCard2Height,
  clampVacuumCard2Width,
  VACUUM_CARD_2_DEFAULT_HEIGHT,
  VACUUM_CARD_2_DEFAULT_WIDTH,
  VACUUM_CARD_2_MAX_HEIGHT,
  VACUUM_CARD_2_MAX_WIDTH,
  VACUUM_CARD_2_MIN_HEIGHT,
  VACUUM_CARD_2_MIN_WIDTH,
} from "@/lib/vacuum-card";
import {
  clampCalendarCardHeight,
  clampCalendarCardWidth,
  isCalendarShowUpcoming,
  CALENDAR_CARD_DEFAULT_HEIGHT,
  CALENDAR_CARD_DEFAULT_WIDTH,
  CALENDAR_CARD_MAX_HEIGHT,
  CALENDAR_CARD_MAX_WIDTH,
  CALENDAR_CARD_MIN_HEIGHT,
  CALENDAR_CARD_MIN_WIDTH,
} from "@/lib/calendar-card";
import {
  clampTrashCardHeight,
  clampTrashCardWidth,
  discoverTrashDaysUntilEntity,
  discoverTrashFractionEntities,
  mergeTrashFractionEntities,
  normalizeTrashFractionEntityIds,
  TRASH_CARD_DEFAULT_HEIGHT,
  TRASH_CARD_DEFAULT_WIDTH,
  TRASH_CARD_MAX_HEIGHT,
  TRASH_CARD_MAX_WIDTH,
  TRASH_CARD_MIN_HEIGHT,
  TRASH_CARD_MIN_WIDTH,
  TRASH_THEMES,
  type TrashFractionEntityIds,
  type TrashTheme,
} from "@/lib/trash-card";
import {
  clampRoomCardHeight,
  clampRoomCardWidth,
  ROOM_CARD_DEFAULT_HEIGHT,
  ROOM_CARD_DEFAULT_WIDTH,
  roomDashboardHref,
} from "@/lib/room-card";
import {
  clampMediaCardHeight,
  clampMediaCardWidth,
  MEDIA_CARD_MAX_HEIGHT,
  MEDIA_CARD_MAX_WIDTH,
  MEDIA_CARD_MIN_HEIGHT,
  MEDIA_CARD_MIN_WIDTH,
} from "@/lib/media-card";
import {
  CAMERA_CARD_DEFAULT_HEIGHT,
  CAMERA_CARD_DEFAULT_WIDTH,
  CAMERA_CARD_MAX_HEIGHT,
  CAMERA_CARD_MAX_WIDTH,
  CAMERA_CARD_MIN_HEIGHT,
  CAMERA_CARD_MIN_WIDTH,
  clampCameraCardHeight,
  clampCameraCardWidth,
} from "@/lib/camera-card";
import {
  ENERGY_MONITOR_CARD_DEFAULT_HEIGHT,
  ENERGY_MONITOR_CARD_DEFAULT_WIDTH,
  ENERGY_MONITOR_CARD_MAX_HEIGHT,
  ENERGY_MONITOR_CARD_MAX_WIDTH,
  ENERGY_MONITOR_CARD_MIN_HEIGHT,
  ENERGY_MONITOR_CARD_MIN_WIDTH,
  clampEnergyMonitorCardHeight,
  clampEnergyMonitorCardWidth,
} from "@/lib/energy-monitor-card";
import {
  TEAMTRACKER_CARD_DEFAULT_HEIGHT,
  TEAMTRACKER_CARD_DEFAULT_WIDTH,
  TEAMTRACKER_CARD_MAX_HEIGHT,
  TEAMTRACKER_CARD_MAX_WIDTH,
  TEAMTRACKER_CARD_MIN_HEIGHT,
  TEAMTRACKER_CARD_MIN_WIDTH,
  clampTeamtrackerCardHeight,
  clampTeamtrackerCardWidth,
  isTeamtrackerEntityId,
} from "@/lib/teamtracker-card";
import {
  clampWeatherCardHeight,
  clampWeatherCardWidth,
  WEATHER_CARD_DEFAULT_HEIGHT,
  WEATHER_CARD_DEFAULT_WIDTH,
  WEATHER_CARD_MAX_HEIGHT,
  WEATHER_CARD_MAX_WIDTH,
  WEATHER_CARD_MIN_HEIGHT,
  WEATHER_CARD_MIN_WIDTH,
} from "@/lib/weather-card";
import { EmptyStateCard } from "@/components/layout/empty-state-card";

/** Alleen deze types kunnen als tile worden toegevoegd (floating cards). */
const ADDABLE_WIDGET_TYPES = ["text_card", "climate_card_2", "light_card", "media_card", "solar_card", "energy_monitor_card", "power_usage_card", "device_consumption_card", "stat_pill_card", "sensor_card", "weather_card", "vacuum_card", "vacuum_card_2", "alarm_card", "camera_card", "teamtracker_card", "pill_card", "room_card", "nuts_card", "smart_stack", "card_group", "chore_card", "calendar_card", "timer_card", "trash_card"] as const;

const ADDABLE_WIDGET_TILES: { type: (typeof ADDABLE_WIDGET_TYPES)[number]; labelKey: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "text_card", labelKey: "cardType.text_card", Icon: Type },
  { type: "climate_card_2", labelKey: "cardType.climate_card_2", Icon: Thermometer },
  { type: "light_card", labelKey: "cardType.light_card", Icon: Lightbulb },
  { type: "media_card", labelKey: "cardType.media_card", Icon: Music2 },
  { type: "solar_card", labelKey: "cardType.solar_card", Icon: Sun },
  { type: "energy_monitor_card", labelKey: "cardType.energy_monitor_card", Icon: ImageIcon },
  { type: "power_usage_card", labelKey: "cardType.power_usage_card", Icon: Zap },
  { type: "device_consumption_card", labelKey: "cardType.device_consumption_card", Icon: Zap },
  { type: "stat_pill_card", labelKey: "cardType.stat_pill_card", Icon: CircleDot },
  { type: "sensor_card", labelKey: "cardType.sensor_card", Icon: Gauge },
  { type: "weather_card", labelKey: "cardType.weather_card", Icon: CloudSun },
  { type: "vacuum_card", labelKey: "cardType.vacuum_card", Icon: RobotVacuum },
  { type: "vacuum_card_2", labelKey: "cardType.vacuum_card_2", Icon: RobotVacuum },
  { type: "alarm_card", labelKey: "cardType.alarm_card", Icon: ShieldCheck },
  { type: "camera_card", labelKey: "cardType.camera_card", Icon: Video },
  { type: "teamtracker_card", labelKey: "cardType.teamtracker_card", Icon: Trophy },
  { type: "pill_card", labelKey: "cardType.pill_card", Icon: CircleDot },
  { type: "room_card", labelKey: "cardType.room_card", Icon: Home },
  { type: "nuts_card", labelKey: "cardType.nuts_card", Icon: Zap },
  { type: "smart_stack", labelKey: "cardType.smart_stack", Icon: Layers },
  { type: "card_group", labelKey: "cardType.card_group", Icon: LayoutGrid },
  { type: "chore_card", labelKey: "cardType.chore_card", Icon: ListTodo },
  { type: "calendar_card", labelKey: "cardType.calendar_card", Icon: CalendarDays },
  { type: "timer_card", labelKey: "cardType.timer_card", Icon: Timer },
  { type: "trash_card", labelKey: "cardType.trash_card", Icon: Trash2 },
];

/** Map widget type to HA domain for filtering entities */
const WIDGET_TYPE_DOMAIN: Record<string, string> = {
  text_card: "",
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
  device_consumption_card: "sensor",
  stat_pill_card: "sensor",
  sensor_card: "sensor",
  weather_card: "weather",
  vacuum_card: "vacuum",
  vacuum_card_2: "vacuum",
  alarm_card: "alarm_control_panel",
  camera_card: "camera",
  teamtracker_card: "sensor",
  pill_card: "switch",
  room_card: "",
  nuts_card: "sensor",
  smart_stack: "",
  card_group: "",
  calendar_card: "",
  timer_card: "",
  trash_card: "sensor",
};

const PILL_CARD_DOMAINS = ["switch", "light", "input_boolean", "sensor", "binary_sensor"];

const FLOATING_WIDGET_TYPES = new Set([
  "text_card", "title_card", "title_only_card", "subtitle_card", "media_card", "climate_card", "climate_card_2", "light_card", "solar_card",
  "energy_monitor_card", "power_usage_card", "stat_pill_card", "sensor_card", "weather_card",
  "vacuum_card", "vacuum_card_2", "alarm_card", "camera_card", "teamtracker_card", "pill_card", "room_card", "nuts_card", "smart_stack", "card_group", "chore_card", "calendar_card", "timer_card", "trash_card",
]);

type DashboardData = {
  id: string;
  name: string;
  theme: string;
  layout: string | null;
  widgets: string | null;
  background: string | null;
  welcomeTitle: string | null;
  welcomeSubtitle: string | null;
  roomCardSize: string | null;
};

function parseLayout(layout: string | null): Layout {
  const { items } = parseDashboardLayout(layout);
  return Array.isArray(items) ? (items as Layout) : [];
}

function parseStoredPageCount(layout: string | null, widgets: WidgetConfig[]): number {
  const { pageCount } = parseDashboardLayout(layout);
  return resolvePageCount(pageCount, widgets);
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

type RoomListItem = { areaId: string; name: string };

function MoveCardToRoomSection({
  currentAreaId,
  widget,
  onMove,
  t,
}: {
  currentAreaId: string;
  widget: WidgetConfig;
  onMove: (targetAreaId: string) => Promise<void>;
  t: (key: string) => string;
}) {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/room-dashboards")
      .then((res) => res.json())
      .then((list: RoomListItem[]) => setRooms(Array.isArray(list) ? list : []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  const otherRooms = rooms.filter((r) => r.areaId !== currentAreaId);

  async function handleMove(targetAreaId: string) {
    setError(null);
    setMoving(targetAreaId);
    try {
      await onMove(targetAreaId);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("editPanel.moveToRoomError"));
    } finally {
      setMoving(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{t("editPanel.loading")}</p>;
  }

  if (otherRooms.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("editPanel.noOtherRooms")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t("editPanel.moveToRoomDescription")}
      </p>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <div className="flex flex-col gap-1.5 max-h-40 overflow-auto">
        {otherRooms.map((r) => (
          <button
            key={r.areaId}
            type="button"
            onClick={() => handleMove(r.areaId)}
            disabled={moving !== null}
            className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50"
          >
            <span>{r.name || r.areaId}</span>
            <ArrowRightLeft className="h-4 w-4 shrink-0 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

function WidgetByType({
  type,
  title,
  subtitle,
  entity_id,
  consumption_entity_id,
  yield_entity_id_today,
  yield_entity_id_month,
  humidity_entity_id,
  display_mode,
  show_icon,
  show_condition,
  show_high_low,
  show_wind,
  show_humidity,
  show_air_quality,
  show_precipitation,
  air_quality_entity_id,
  show_team_names,
  show_form,
  show_progress,
  script_ids,
  script_names,
  cleaned_area_entity_id,
  progress_entity_id,
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
  today_entity_id,
  accent,
  period,
  max_value,
  grid_entity_id,
  label,
  color,
  device_entity_ids,
  device_names,
  cost_per_kwh,
  textMode,
  icon_background_color,
  date_entity_id,
  days_entity_id,
  fraction_entity_ids,
  demo_theme,
  show_upcoming,
  width,
  height,
  onMoreClick,
}: {
  type: string;
  title: string;
  subtitle?: string;
  entity_id: string;
  consumption_entity_id?: string;
  yield_entity_id_today?: string;
  yield_entity_id_month?: string;
  humidity_entity_id?: string;
  display_mode?: "standard" | "compact" | "graph";
  show_icon?: boolean;
  show_condition?: boolean;
  show_high_low?: boolean;
  show_wind?: boolean;
  show_humidity?: boolean;
  show_air_quality?: boolean;
  show_precipitation?: boolean;
  air_quality_entity_id?: string;
  show_team_names?: boolean;
  show_form?: boolean;
  show_progress?: boolean;
  script_ids?: string[];
  script_names?: Record<string, string>;
  cleaned_area_entity_id?: string;
  progress_entity_id?: string;
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
  today_entity_id?: string;
  accent?: "consumption" | "production";
  period?: "week" | "month";
  icon_background_color?: string;
  max_value?: number;
  grid_entity_id?: string;
  label?: string;
  color?: string;
  device_entity_ids?: string[];
  device_names?: Record<string, string>;
  cost_per_kwh?: number;
  textMode?: "title" | "subtitle" | "text" | "both";
  date_entity_id?: string;
  days_entity_id?: string;
  fraction_entity_ids?: TrashFractionEntityIds;
  demo_theme?: "gft" | "restafval" | "pmd";
  show_upcoming?: boolean;
  width?: number;
  height?: number;
  onMoreClick?: () => void;
}) {
  const sizeProp = (size as "sm" | "md" | "lg") ?? "md";
  const live = useEntityStateStore((s) => s.getState(entity_id));
  const num = live?.state != null ? Number(live.state) : undefined;
  const onOff = live?.state === "on" ? "on" : "off";

  switch (type) {
    case "text_card":
    case "title_card":
    case "title_only_card":
    case "subtitle_card": {
      const textType: "title" | "subtitle" | "text" =
        type === "title_card" || type === "title_only_card" ? "title"
        : type === "subtitle_card" ? "subtitle"
        : (textMode === "title" || textMode === "subtitle" || textMode === "text" ? textMode : "title");
      return (
        <TextCardWidget
          text={title ?? ""}
          type={textType}
          show_icon={show_icon ?? false}
          icon={icon ?? "Type"}
          onMoreClick={onMoreClick}
        />
      );
    }
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
          display_mode={display_mode}
          size={sizeProp}
        />
      );
    case "climate_card_2":
      return (
        <ClimateCard2Widget
          title={title}
          entity_id={entity_id}
          humidity_entity_id={humidity_entity_id}
          display_mode={display_mode}
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
    case "weather_card":
      return (
        <WeatherCardWidget
          title={title}
          entity_id={entity_id}
          show_icon={show_icon}
          show_condition={show_condition}
          show_high_low={show_high_low}
          show_wind={show_wind}
          show_humidity={show_humidity}
          show_air_quality={show_air_quality}
          show_precipitation={show_precipitation}
          air_quality_entity_id={air_quality_entity_id}
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
    case "vacuum_card_2":
      return (
        <VacuumCard2Widget
          title={title}
          entity_id={entity_id}
          progress_entity_id={progress_entity_id}
          background_image={background_image}
          size={sizeProp}
        />
      );
    case "alarm_card":
      return (
        <AlarmCardWidget
          title={title}
          entity_id={entity_id}
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
          today_entity_id={today_entity_id}
          current_entity_id={current_entity_id}
          icon={icon}
          icon_background_color={icon_background_color}
          accent={normalizeNutsAccent(accent)}
          period={normalizeNutsPeriod(period)}
        />
      );
    case "chore_card":
      return (
        <ChoreCardWidget
          title={title}
          onMoreClick={onMoreClick}
        />
      );
    case "timer_card":
      return (
        <TimerCardWidget
          title={title}
          onMoreClick={onMoreClick}
        />
      );
    case "calendar_card":
      return (
        <CalendarCardWidget
          title={title}
          show_upcoming={show_upcoming}
          onMoreClick={onMoreClick}
        />
      );
    case "trash_card":
      return (
        <TrashCardWidget
          title={title}
          entity_id={entity_id}
          date_entity_id={date_entity_id}
          days_entity_id={days_entity_id}
          fraction_entity_ids={fraction_entity_ids}
          demo_theme={demo_theme}
          width={width}
          height={height}
          onMoreClick={onMoreClick}
        />
      );
    case "teamtracker_card":
      return (
        <TeamtrackerCardWidget
          title={title}
          entity_id={entity_id}
          show_team_names={show_team_names}
          show_form={show_form}
          show_progress={show_progress}
          onMoreClick={onMoreClick}
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
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const rawId = params?.id as string;
  const isRoomMode = rawId?.startsWith("room-");
  const id = rawId;
  const areaId = isRoomMode ? decodeURIComponent(rawId.slice(5)) : null;
  const apiBase = isRoomMode && areaId
    ? `/api/room-dashboards/${encodeURIComponent(areaId)}`
    : `/api/dashboards/${rawId}`;
  const [editMode, setEditMode] = useState(false);
  useDashboardEditFlag(editMode);
  const [editPasscodeModalOpen, setEditPasscodeModalOpen] = useState(false);
  const [editPasscodeInput, setEditPasscodeInput] = useState("");
  const [editPasscodeError, setEditPasscodeError] = useState<string | null>(null);
  const [layout, setLayout] = useState<Layout>([]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [dashboardPage, setDashboardPage] = useState(0);
  const pageCountRef = useRef(pageCount);
  const dashboardPageRef = useRef(dashboardPage);
  const [welcomeTitle, setWelcomeTitle] = useState<string>("");
  const [welcomeSubtitle, setWelcomeSubtitle] = useState<string>("");
  const widgetsRef = useRef(widgets);
  const layoutRef = useRef(layout);
  const welcomeTitleRef = useRef(welcomeTitle);
  const welcomeSubtitleRef = useRef(welcomeSubtitle);
  const pendingPageRemovalRef = useRef<PendingPageRemoval<WidgetConfig, LayoutItem> | null>(null);
  const removalMirrorRef = useRef<PageSnapshot<WidgetConfig, LayoutItem> | null>(null);
  const pageRemovalEpochRef = useRef(0);
  const enqueueSaveRef = useRef(createSerializedSaveQueue());
  const pageRemovalCommitRef = useRef<() => void>(() => {});
  const pageUndoGenerationRef = useRef(0);
  const [pageUndoOpen, setPageUndoOpen] = useState(false);
  const [pageUndoGeneration, setPageUndoGeneration] = useState(0);
  const removalRefsLocked =
    pendingPageRemovalRef.current != null &&
    removalMirrorRef.current != null &&
    pageCount !== removalMirrorRef.current.pageCount;
  if (!removalRefsLocked) {
    pageCountRef.current = pageCount;
    dashboardPageRef.current = dashboardPage;
    widgetsRef.current = widgets;
    layoutRef.current = layout;
  }
  welcomeTitleRef.current = welcomeTitle;
  welcomeSubtitleRef.current = welcomeSubtitle;

  useEffect(() => {
    if (!pageUndoOpen) return;
    const generation = pageUndoGeneration;
    const timer = window.setTimeout(() => {
      if (pageUndoGenerationRef.current !== generation) return;
      pageRemovalCommitRef.current();
    }, UNDO_TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [pageUndoOpen, pageUndoGeneration]);
  const [roomCardSize, setRoomCardSize] = useState<"normal" | "large">("normal");
  const [initialized, setInitialized] = useState(false);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const { data: choreChildren = [] } = useQuery<{ id: string; name: string; emoji: string | null }[]>({
    queryKey: ["children"],
    queryFn: () => fetch("/api/children").then((r) => r.json()),
    staleTime: 60_000,
  });
  const [addTileOpen, setAddTileOpen] = useState(false);
  const [addTileStep, setAddTileStep] = useState<"type" | "entity">("type");
  const [addTileSelectedType, setAddTileSelectedType] = useState<string | null>(null);
  const [addTileEntitySearch, setAddTileEntitySearch] = useState("");
  const [pendingAddId, setPendingAddId] = useState<string | null>(null);
  const [placedHighlight, setPlacedHighlight] = useState<{
    id: string;
    left: number;
    bottom: number;
    width: number;
    height: number;
  } | null>(null);
  const [undoAdd, setUndoAdd] = useState<{ id: string; type: string } | null>(null);
  const [groupAddEntitySearch, setGroupAddEntitySearch] = useState("");
  const [powerUsageDeviceSearch, setPowerUsageDeviceSearch] = useState("");
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  /** Stat pill ⋮ menu (edit mode). Anchored to the tapped pill. */
  const [tileMenu, setTileMenu] = useState<{ widgetId: string; anchor: TileMenuAnchor } | null>(null);
  const closeTileMenu = useCallback(() => setTileMenu(null), []);
  /** Last pointerdown on a floating stat pill: anchor for onEdit, which gets no event. */
  const statPillTapRef = useRef<{ id: string; el: Element | null; x: number; y: number } | null>(null);
  useEffect(() => {
    if (!editMode) setTileMenu(null);
  }, [editMode]);
  /** When editing a card_group, id of the child pill being edited (null = editing group itself). */
  const [editingGroupChildId, setEditingGroupChildId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    subtitle?: string;
    textMode?: "title" | "subtitle" | "text";
    entity_id: string;
    consumption_entity_id?: string;
    yield_entity_id_today?: string;
    yield_entity_id_month?: string;
    grid_entity_id?: string;
    humidity_entity_id?: string;
    display_mode?: "standard" | "compact" | "graph";
    show_icon?: boolean;
    show_condition?: boolean;
    show_high_low?: boolean;
    show_wind?: boolean;
    show_humidity?: boolean;
    show_air_quality?: boolean;
    show_precipitation?: boolean;
    air_quality_entity_id?: string;
    show_state?: boolean;
    script_ids?: string[];
    script_names?: Record<string, string>;
    cleaned_area_entity_id?: string;
    progress_entity_id?: string;
    light_entity_id?: string;
    modal_light_entity_ids?: string[];
    media_player_entity_id?: string;
    climate_entity_id?: string;
    area_id?: string;
    background_image?: string;
    background_image_dark?: string;
    icon_background_color?: string;
    width?: number;
    height?: number;
    icon?: string;
    size?: string;
    card_layout?: "horizontal" | "square";
    conditions?: { operator: string; value: string; color: string }[];
    image_conditions?: { operator: string; value: string; image: string; image_dark?: string }[];
    current_entity_id?: string;
    today_entity_id?: string;
    accent?: "consumption" | "production";
    period?: "week" | "month";
    max_value?: number;
    minimal?: boolean;
    scale?: number;
    label?: string;
    color?: string;
    refresh?: number;
    show_title?: boolean;
    show_team_names?: boolean;
    show_form?: boolean;
    show_progress?: boolean;
    device_entity_ids?: string[];
    device_names?: Record<string, string>;
    cost_per_kwh?: number;
    child_id?: string | null;
    show_chore_points?: boolean;
    show_upcoming?: boolean;
    date_entity_id?: string;
    days_entity_id?: string;
    fraction_entity_ids?: TrashFractionEntityIds;
    demo_theme?: "gft" | "restafval" | "pmd";
    page?: number;
    interval_seconds?: number;
    autoplay?: boolean;
  }>({
    title: "",
    entity_id: "",
    consumption_entity_id: "",
    grid_entity_id: "",
    humidity_entity_id: "",
    display_mode: "standard",
    show_icon: true,
    show_condition: true,
    show_high_low: true,
    show_wind: true,
    show_humidity: true,
    show_air_quality: false,
    show_precipitation: true,
    show_upcoming: true,
    air_quality_entity_id: "",
    show_state: true,
    script_ids: [],
    script_names: {},
    cleaned_area_entity_id: "",
    progress_entity_id: "",
    current_entity_id: "",
    today_entity_id: "",
    accent: "consumption",
    period: "week",
    light_entity_id: "",
    modal_light_entity_ids: [],
    media_player_entity_id: "",
    climate_entity_id: "",
    area_id: "",
    background_image: "",
    background_image_dark: "",
    icon_background_color: "",
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    icon: "",
    size: "md",
    card_layout: "horizontal",
    conditions: [],
    image_conditions: [],
    minimal: false,
    scale: 1,
    label: "",
    color: "amber",
    refresh: 10,
    show_title: true,
    show_team_names: true,
    show_form: true,
    show_progress: true,
    device_entity_ids: [],
    device_names: {},
    cost_per_kwh: undefined as number | undefined,
    child_id: null as string | null,
    show_chore_points: true,
    date_entity_id: "",
    days_entity_id: "",
    fraction_entity_ids: {},
    demo_theme: "gft" as const,
    page: 0,
    interval_seconds: SMART_STACK_DEFAULT_INTERVAL_SEC,
    autoplay: true,
  });
  const [iconSearch, setIconSearch] = useState("");
  const [vacuumIconSearch, setVacuumIconSearch] = useState("");
  const [sensorIconSearch, setSensorIconSearch] = useState("");
  const [pillIconSearch, setPillIconSearch] = useState("");
  const [editTab, setEditTab] = useState<string>("algemeen");
  /** When adding a card to a smart stack: selected child type before entity pick. */
  const [stackAddChildType, setStackAddChildType] = useState<string | null>(null);
  const [uploadingRoomBg, setUploadingRoomBg] = useState(false);
  const [uploadingEnergyBg, setUploadingEnergyBg] = useState(false);
  const [uploadingEnergyBgDark, setUploadingEnergyBgDark] = useState(false);
  const [uploadingConditionImage, setUploadingConditionImage] = useState<{ idx: number; field: "image" | "image_dark" } | null>(null);
  const [clickedCardForDefinition, setClickedCardForDefinition] = useState<{
    widgetId: string;
    title: string;
  } | null>(null);
  const [definitionModalEntities, setDefinitionModalEntities] = useState<HaEntity[]>([]);
  const [roomPanelOpen, setRoomPanelOpen] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAddRef = useRef<string | null>(null);
  const placedStorageRef = useRef<{ widgetId: string; key: string } | null>(null);
  const syncAddTileRef = useRef<(stack: AddTileStep[]) => void>(() => {});
  const addTileButtonRef = useRef<HTMLButtonElement>(null);
  const addTileDialogRef = useRef<HTMLDivElement>(null);
  const LONG_PRESS_MS = 500;

  function clearLongPressTimer() {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function startLongPressForEdit(e: React.PointerEvent) {
    if (editMode) return;
    if ((e.target as HTMLElement)?.closest?.("button, a, [role=button], input, select, textarea")) return;
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
  const addingTile =
    pendingAddId != null && editingWidgetId === pendingAddId && editingGroupChildId == null;

  function closeTileEditor() {
    if (
      (editingWidget?.type === "card_group" || editingWidget?.type === "smart_stack") &&
      editingGroupChildId
    ) {
      setEditingGroupChildId(null);
      return;
    }
    if (addingTile) {
      backAddTileHistory();
      return;
    }
    setEditingWidgetId(null);
  }

  const editingStackChild =
    editingWidget?.type === "smart_stack" && editingGroupChildId
      ? (editingWidget.children ?? []).find((c) => c.id === editingGroupChildId) ?? null
      : null;
  const isEditingSmartStackChild = editingStackChild != null;
  const editFormType = editingStackChild?.type ?? editingWidget?.type ?? "";
  const editFormTarget = editingStackChild ?? editingWidget;

  useEffect(() => {
    if (!editingWidgetId) {
      setEditingGroupChildId(null);
      setStackAddChildType(null);
    }
  }, [editingWidgetId]);

  useEffect(() => {
    if (editingWidget?.type === "card_group" && editingGroupChildId) {
      const child = (editingWidget.children ?? []).find((c) => c.id === editingGroupChildId);
      if (child) {
        setEditForm({
          title: child.title ?? "",
          entity_id: child.entity_id ?? "",
          consumption_entity_id: "",
          yield_entity_id_today: "",
          yield_entity_id_month: "",
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
    if (editingWidget?.type === "smart_stack" && editingGroupChildId) {
      const child = (editingWidget.children ?? []).find((c) => c.id === editingGroupChildId);
      if (child) {
        setEditForm({
          title: child.title ?? "",
          entity_id: child.entity_id ?? "",
          consumption_entity_id: child.consumption_entity_id ?? "",
          yield_entity_id_today: child.yield_entity_id_today ?? "",
          yield_entity_id_month: child.yield_entity_id_month ?? "",
          grid_entity_id: child.grid_entity_id ?? "",
          humidity_entity_id: child.humidity_entity_id ?? "",
          display_mode: child.display_mode ?? "standard",
          show_icon: child.show_icon !== false,
          show_condition: child.show_condition !== false,
          show_high_low: child.show_high_low !== false,
          show_wind: child.show_wind !== false,
          show_humidity: child.show_humidity !== false,
          show_air_quality: child.show_air_quality === true,
          show_precipitation: child.show_precipitation !== false,
          air_quality_entity_id: child.air_quality_entity_id ?? "",
          script_ids: child.script_ids ?? [],
          script_names: child.script_names ?? {},
          cleaned_area_entity_id: child.cleaned_area_entity_id ?? "",
          progress_entity_id: child.progress_entity_id ?? "",
          light_entity_id: child.light_entity_id ?? "",
          media_player_entity_id: child.media_player_entity_id ?? "",
          climate_entity_id: child.climate_entity_id ?? "",
          area_id: child.area_id ?? "",
          background_image: child.background_image ?? "",
          background_image_dark: child.background_image_dark ?? "",
          icon_background_color: child.icon_background_color ?? "",
          // Nested cards fill the stack frame — do not load independent size.
          width: undefined,
          height: undefined,
          icon: child.icon ?? "",
          size: child.size ?? "md",
          card_layout: child.card_layout === "square" ? "square" : "horizontal",
          conditions: child.conditions ?? [],
          image_conditions: child.image_conditions ?? [],
          show_state: child.show_state !== false,
          current_entity_id: child.current_entity_id ?? "",
          today_entity_id: child.today_entity_id ?? "",
          accent: normalizeNutsAccent(child.accent),
          period: normalizeNutsPeriod(child.period),
          max_value: child.max_value ?? undefined,
          minimal: child.minimal ?? false,
          scale: child.scale ?? 1,
          label: child.label ?? "",
          color: child.color ?? "amber",
          refresh: child.refresh ?? 10,
          show_title: child.show_title !== false,
          show_team_names: child.show_team_names !== false,
          show_form: child.show_form !== false,
          show_progress: child.show_progress !== false,
          device_entity_ids: child.device_entity_ids ?? [],
          device_names: child.device_names ?? {},
          cost_per_kwh: child.cost_per_kwh ?? undefined,
          child_id: child.child_id ?? null,
          show_chore_points: child.show_chore_points !== false,
          show_upcoming: isCalendarShowUpcoming(child.show_upcoming),
          date_entity_id: child.date_entity_id ?? "",
          days_entity_id: child.days_entity_id ?? "",
          fraction_entity_ids: normalizeTrashFractionEntityIds(child.fraction_entity_ids) ?? {},
          demo_theme:
            child.demo_theme === "restafval" || child.demo_theme === "pmd" ? child.demo_theme : "gft",
          page: widgetPage(editingWidget),
        });
        setIconSearch("");
        setVacuumIconSearch(child.type === "vacuum_card" ? (child.icon ?? "") : "");
        setSensorIconSearch(child.type === "sensor_card" ? (child.icon ?? "") : "");
        setPillIconSearch(child.type === "pill_card" || child.type === "stat_pill_card" ? (child.icon ?? "") : "");
        setGroupAddEntitySearch("");
        setStackAddChildType(null);
        setPowerUsageDeviceSearch("");
        if (
          child.type === "light_card" ||
          child.type === "media_card" ||
          child.type === "sensor_card" ||
          child.type === "climate_card" ||
          child.type === "climate_card_2" ||
          child.type === "stat_pill_card" ||
          child.type === "vacuum_card_2" ||
          child.type === "camera_card" ||
          child.type === "teamtracker_card" ||
          child.type === "weather_card" ||
          child.type === "nuts_card" ||
          child.type === "trash_card" ||
          child.type === "calendar_card"
        ) {
          setEditTab(child.type === "media_card" ? "algemeen" : "algemeen");
        }
        if (child.type === "energy_monitor_card") {
          setEditTab("achtergrond");
        }
      }
      return;
    }
    if (editingWidget) {
      const isCategoryCard = editingWidget.type === "text_card" || editingWidget.type === "title_card" || editingWidget.type === "title_only_card" || editingWidget.type === "subtitle_card";
      const deriveTextMode = (): "title" | "subtitle" | "text" => {
        if (editingWidget.type === "text_card" && (editingWidget as { textMode?: string }).textMode) {
          const m = (editingWidget as { textMode: string }).textMode;
          if (m === "title" || m === "subtitle" || m === "text") return m;
        }
        if (editingWidget.type === "title_card" || editingWidget.type === "title_only_card") return "title";
        if (editingWidget.type === "subtitle_card") return "subtitle";
        return "title";
      };
      setEditForm({
        title: isCategoryCard ? (editingWidget.title ?? "") : (editingWidget.title ?? ""),
        subtitle: isCategoryCard ? ((editingWidget as { subtitle?: string }).subtitle ?? "") : undefined,
        textMode: isCategoryCard ? deriveTextMode() : undefined,
        entity_id: editingWidget.entity_id ?? "",
        consumption_entity_id: editingWidget.consumption_entity_id ?? "",
        yield_entity_id_today: (editingWidget as { yield_entity_id_today?: string }).yield_entity_id_today ?? "",
        yield_entity_id_month: (editingWidget as { yield_entity_id_month?: string }).yield_entity_id_month ?? "",
        grid_entity_id: editingWidget.grid_entity_id ?? "",
        humidity_entity_id: editingWidget.humidity_entity_id ?? "",
        display_mode: editingWidget.display_mode ?? "standard",
        show_icon: isCategoryCard ? ((editingWidget as { show_icon?: boolean }).show_icon ?? false) : (editingWidget.show_icon !== false),
        show_condition: editingWidget.show_condition !== false,
        show_high_low: editingWidget.show_high_low !== false,
        show_wind: editingWidget.show_wind !== false,
        show_humidity: editingWidget.show_humidity !== false,
        show_air_quality: editingWidget.show_air_quality === true,
        show_precipitation: editingWidget.show_precipitation !== false,
        air_quality_entity_id: editingWidget.air_quality_entity_id ?? "",
        script_ids: editingWidget.script_ids ?? [],
        script_names: editingWidget.script_names ?? {},
        cleaned_area_entity_id: editingWidget.cleaned_area_entity_id ?? "",
        progress_entity_id: editingWidget.progress_entity_id ?? "",
        light_entity_id: editingWidget.light_entity_id ?? "",
        media_player_entity_id: editingWidget.media_player_entity_id ?? "",
        climate_entity_id: editingWidget.climate_entity_id ?? "",
        area_id: editingWidget.area_id ?? "",
        background_image: editingWidget.background_image ?? "",
        background_image_dark: editingWidget.background_image_dark ?? "",
        icon_background_color: editingWidget.icon_background_color ?? "",
        width: editingWidget.width ?? undefined,
        height: editingWidget.height ?? undefined,
        icon: isCategoryCard ? (editingWidget.icon ?? "Type") : (editingWidget.icon ?? ""),
        size: editingWidget.size ?? "md",
        card_layout: editingWidget.card_layout === "square" ? "square" : "horizontal",
        conditions: editingWidget.conditions ?? [],
        image_conditions: editingWidget.image_conditions ?? [],
        show_state: editingWidget.show_state !== false,
        current_entity_id: editingWidget.current_entity_id ?? "",
        today_entity_id: editingWidget.today_entity_id ?? "",
        accent: normalizeNutsAccent(editingWidget.accent),
        period: normalizeNutsPeriod(editingWidget.period),
        max_value: editingWidget.max_value ?? undefined,
        minimal: editingWidget.minimal ?? false,
        scale: editingWidget.scale ?? 1,
        label: editingWidget.label ?? "",
        color: editingWidget.color ?? "amber",
        refresh: editingWidget.refresh ?? 10,
        show_title: editingWidget.show_title !== false,
        show_team_names: editingWidget.show_team_names !== false,
        show_form: editingWidget.show_form !== false,
        show_progress: editingWidget.show_progress !== false,
        device_entity_ids: editingWidget.device_entity_ids ?? [],
        device_names: editingWidget.device_names ?? {},
        cost_per_kwh: editingWidget.cost_per_kwh ?? undefined,
        child_id: editingWidget.child_id ?? null,
        show_chore_points: editingWidget.show_chore_points !== false,
        show_upcoming: isCalendarShowUpcoming(editingWidget.show_upcoming),
        date_entity_id: editingWidget.date_entity_id ?? "",
        days_entity_id: editingWidget.days_entity_id ?? "",
        fraction_entity_ids: normalizeTrashFractionEntityIds(editingWidget.fraction_entity_ids) ?? {},
        demo_theme: editingWidget.demo_theme === "restafval" || editingWidget.demo_theme === "pmd" ? editingWidget.demo_theme : "gft",
        page: widgetPage(editingWidget),
        interval_seconds: clampSmartStackIntervalSec(
          editingWidget.interval_seconds ?? SMART_STACK_DEFAULT_INTERVAL_SEC
        ),
        autoplay: isSmartStackAutoplayEnabled(editingWidget.autoplay),
      });
      setIconSearch("");
      setVacuumIconSearch(editingWidget.type === "vacuum_card" ? (editingWidget.icon ?? "") : "");
      setSensorIconSearch(editingWidget.type === "sensor_card" ? (editingWidget.icon ?? "") : "");
      setPillIconSearch(editingWidget.type === "pill_card" ? (editingWidget.icon ?? "") : "");
      setGroupAddEntitySearch("");
      setStackAddChildType(null);
      setPowerUsageDeviceSearch("");
      if (editingWidget.type === "text_card" || editingWidget.type === "title_card" || editingWidget.type === "title_only_card" || editingWidget.type === "subtitle_card" || editingWidget.type === "light_card" || editingWidget.type === "media_card" || editingWidget.type === "sensor_card" || editingWidget.type === "room_card" || editingWidget.type === "climate_card" || editingWidget.type === "climate_card_2" || editingWidget.type === "solar_card" || editingWidget.type === "stat_pill_card" || editingWidget.type === "vacuum_card" || editingWidget.type === "vacuum_card_2" || editingWidget.type === "pill_card" || editingWidget.type === "camera_card" || editingWidget.type === "teamtracker_card" || editingWidget.type === "weather_card" || editingWidget.type === "nuts_card" || editingWidget.type === "power_usage_card" || editingWidget.type === "device_consumption_card" || editingWidget.type === "trash_card") {
        setEditTab(editingWidget.type === "room_card" ? "entiteiten" : editingWidget.type === "media_card" ? "weergave" : "algemeen");
      }
      if (editingWidget.type === "energy_monitor_card") {
        setEditTab("achtergrond");
      }
      if (editingWidget.type === "card_group") {
        setEditTab(editingGroupChildId ? "algemeen" : "weergave");
      }
      if (editingWidget.type === "smart_stack") {
        setEditTab(editingGroupChildId ? "algemeen" : "weergave");
      }
    }
  }, [editingWidget, editingGroupChildId]);

  const { data, isLoading, error } = useQuery<DashboardData & { welcomeTitle?: string | null; welcomeSubtitle?: string | null; temperatureEntityId?: string | null; humidityEntityId?: string | null }>({
    queryKey: isRoomMode ? ["room-dashboard", areaId] : ["dashboard", id],
    queryFn: async () => {
      const res = await fetch(apiBase);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data || initialized) return;
    const w = parseWidgets(data.widgets);
    setWidgets((prev) => (prev.length === 0 ? w : prev));
    const parsed = parseLayout(data.layout);
    const widgetTypes = new Map(w.map((x) => [x.id, x.type]));
    const parsedFiltered = parsed.filter((item) => !FLOATING_WIDGET_TYPES.has(widgetTypes.get(item.i) ?? ""));
    if (parsedFiltered.length > 0 || parsed.length !== parsedFiltered.length) {
      setLayout(parsedFiltered.length > 0 ? parsedFiltered : []);
    } else if (parsed.length === 0 && w.length > 0) {
      const gridWidgets = w.filter(
        (widget) =>
          widget.type !== "text_card" &&
          widget.type !== "media_card" &&
          widget.type !== "climate_card" &&
          widget.type !== "climate_card_2" &&
          widget.type !== "light_card" &&
          widget.type !== "solar_card" &&
          widget.type !== "energy_monitor_card" &&
          widget.type !== "power_usage_card" &&
          widget.type !== "device_consumption_card" &&
          widget.type !== "stat_pill_card" &&
          widget.type !== "sensor_card" &&
          widget.type !== "weather_card" &&
          widget.type !== "vacuum_card" &&
          widget.type !== "vacuum_card_2" &&
          widget.type !== "alarm_card" &&
          widget.type !== "camera_card" &&
          widget.type !== "teamtracker_card" &&
          widget.type !== "pill_card" &&
          widget.type !== "room_card" &&
          widget.type !== "nuts_card" &&
          widget.type !== "smart_stack" &&
          widget.type !== "card_group" &&
          widget.type !== "chore_card" &&
          widget.type !== "calendar_card" &&
          widget.type !== "timer_card" &&
          widget.type !== "trash_card"
      );
      if (gridWidgets.length > 0) {
        setLayout(
          gridWidgets.map((widget, i) => ({
            i: widget.id,
            x: (i % 3) * 4,
            y: Math.floor(i / 3) * 2,
            w: 4,
            h: 2,
          }))
        );
      }
    }
    setWelcomeTitle(
      (data as { welcomeTitle?: string | null }).welcomeTitle ??
        (isRoomMode ? (data as { name?: string }).name ?? "" : "")
    );
    setWelcomeSubtitle((data as { welcomeSubtitle?: string | null }).welcomeSubtitle ?? "");
    const rcs = (data as { roomCardSize?: string | null }).roomCardSize;
    setRoomCardSize(rcs === "large" ? "large" : "normal");
    const loadedPageCount = parseStoredPageCount(data.layout, w);
    setPageCount(loadedPageCount);
    try {
      const savedPage = sessionStorage.getItem(`dashboard.page.${id}`);
      if (savedPage != null) setDashboardPage(clampPageIndex(Number(savedPage), loadedPageCount));
    } catch {
      setDashboardPage(0);
    }
    setInitialized(true);
  }, [data, initialized, isRoomMode, id, areaId]);

  useEffect(() => {
    if (!initialized || !id) return;
    try {
      sessionStorage.setItem(`dashboard.page.${id}`, String(dashboardPage));
    } catch {
      // ignore
    }
  }, [dashboardPage, id, initialized]);

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
    if (error && id) router.replace(isRoomMode ? "/rooms" : "/dashboards");
  }, [error, id, isRoomMode, router]);

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      layout: Layout;
      widgets: WidgetConfig[];
      welcomeTitle?: string;
      welcomeSubtitle?: string;
      pageCount?: number;
      commit?: boolean;
      placementKey?: string;
      pageRemovalEpoch: number;
    }) => {
      if (pendingAddRef.current && !payload.commit) return null;
      return enqueueSaveRef.current(async () => {
        const res = await fetch(apiBase, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            layout: serializeDashboardLayout(payload.layout, payload.pageCount ?? pageCountRef.current),
            widgets: JSON.stringify(payload.widgets),
            ...(payload.welcomeTitle !== undefined && { welcomeTitle: payload.welcomeTitle || null }),
            ...(payload.welcomeSubtitle !== undefined && { welcomeSubtitle: payload.welcomeSubtitle || null }),
          }),
        });
        if (!res.ok) throw new Error("Save failed");
        return res.json();
      });
    },
    onSuccess: (updated, payload) => {
      if (
        updated &&
        payload.placementKey &&
        placedStorageRef.current?.key === payload.placementKey
      ) {
        placedStorageRef.current = null;
      }
      if (!updated) return;
      if (!shouldApplyPagedSave(payload.pageRemovalEpoch, pageRemovalEpochRef.current)) return;
      queryClient.setQueryData(
        isRoomMode ? ["room-dashboard", areaId] : ["dashboard", id],
        (old: unknown) => (old && updated ? { ...(old as object), ...(updated as object) } : old ?? updated)
      );
      setPageCount(resolvePageCount(payload.pageCount ?? pageCountRef.current, payload.widgets));
    },
    onError: (_error, payload) => {
      const placed = placedStorageRef.current;
      if (!payload.placementKey || !placed || placed.key !== payload.placementKey) return;
      if (typeof window !== "undefined") forgetTilePosition(window.localStorage, placed.key);
      placedStorageRef.current = null;
    },
  });

  function mutateDashboard(payload: {
    layout: Layout;
    widgets: WidgetConfig[];
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    pageCount?: number;
    commit?: boolean;
    placementKey?: string;
  }) {
    saveMutation.mutate({
      ...payload,
      pageCount: payload.pageCount ?? pageCountRef.current,
      pageRemovalEpoch: pageRemovalEpochRef.current,
    });
  }

  const onLayoutChange = (newLayout: Layout) => {
    setLayout((prev) => {
      const floatingItems = prev.filter((item) => {
        const type = widgets.find((w) => w.id === item.i)?.type;
        return type === "text_card" || type === "title_card" || type === "title_only_card" || type === "subtitle_card" || type === "media_card" || type === "climate_card" || type === "climate_card_2" || type === "pill_card" || type === "room_card" || type === "nuts_card" || type === "power_usage_card" || type === "smart_stack" || type === "card_group";
      });
      return [...newLayout, ...floatingItems];
    });
  };

  const layoutForGrid = layout.filter((item) => {
    const type = widgets.find((w) => w.id === item.i)?.type;
    return type !== "text_card" && type !== "title_card" && type !== "title_only_card" && type !== "subtitle_card" && type !== "media_card" && type !== "climate_card" && type !== "climate_card_2" && type !== "light_card" && type !== "solar_card" && type !== "energy_monitor_card" && type !== "power_usage_card" && type !== "device_consumption_card" && type !== "stat_pill_card" && type !== "sensor_card" && type !== "weather_card" && type !== "vacuum_card" && type !== "vacuum_card_2" && type !== "alarm_card" && type !== "camera_card" && type !== "teamtracker_card" && type !== "pill_card" && type !== "room_card" && type !== "nuts_card" && type !== "smart_stack" && type !== "card_group" && type !== "chore_card" && type !== "calendar_card" && type !== "timer_card" && type !== "trash_card";
  });
  const layoutMap = new Map(layout.map((item) => [item.i, item]));

  const handleSave = () => {
    dismissPageUndo();
    const pendingId = pendingAddRef.current;
    if (pendingId) dropPendingTile();
    if (addTileHistoryDepth() > 0) discardAddTileHistory();
    setEditingWidgetId(null);
    setEditingGroupChildId(null);
    setEditMode(false);
    const nextWidgets = pendingId ? widgets.filter((widget) => widget.id !== pendingId) : widgets;
    const nextLayout = pendingId ? layout.filter((item) => item.i !== pendingId) : layout;
    mutateDashboard({
      layout: nextLayout,
      widgets: nextWidgets,
      welcomeTitle,
      welcomeSubtitle,
      pageCount: pageCountRef.current,
      commit: true,
    });
  };

  function handleAddTile(type: string, entityId: string, titleOverride?: string): string | undefined {
    if (isWidgetTypeTemporarilyDisabled(type)) return;
    const newId = generateId();
    const newWidget: WidgetConfig = {
      id: newId,
      type,
      title: titleOverride ?? (type === "text_card" ? t("editPanel.newText") : type.replace(/_/g, " ")),
      entity_id: entityId,
      ...(type === "text_card" && { textMode: "title" as const, show_icon: false, icon: "Type" }),
      ...(type === "light_card" && { card_layout: "horizontal" as const }),
      ...(type === "card_group" && { children: [], alignment: "start" as const }),
      ...(type === "smart_stack" && {
        children: [] as WidgetConfig[],
        interval_seconds: SMART_STACK_DEFAULT_INTERVAL_SEC,
        autoplay: true,
        width: SMART_STACK_DEFAULT_WIDTH,
        height: SMART_STACK_DEFAULT_HEIGHT,
      }),
      ...(type === "device_consumption_card" && { device_entity_ids: [], device_names: {} }),
      ...(type === "media_card" && { width: MEDIA_CARD_DEFAULT_WIDTH, height: MEDIA_CARD_DEFAULT_HEIGHT }),
      ...(type === "energy_monitor_card" && {
        width: ENERGY_MONITOR_CARD_DEFAULT_WIDTH,
        height: ENERGY_MONITOR_CARD_DEFAULT_HEIGHT,
        minimal: true,
      }),
      ...(type === "camera_card" && {
        width: CAMERA_CARD_DEFAULT_WIDTH,
        height: CAMERA_CARD_DEFAULT_HEIGHT,
        refresh: 10,
        show_title: true,
      }),
      ...(type === "teamtracker_card" && {
        width: TEAMTRACKER_CARD_DEFAULT_WIDTH,
        height: TEAMTRACKER_CARD_DEFAULT_HEIGHT,
        show_team_names: true,
        show_form: true,
        show_progress: true,
      }),
      ...(type === "weather_card" && { width: WEATHER_CARD_DEFAULT_WIDTH, height: WEATHER_CARD_DEFAULT_HEIGHT }),
      ...(type === "vacuum_card_2" && { width: VACUUM_CARD_2_DEFAULT_WIDTH, height: VACUUM_CARD_2_DEFAULT_HEIGHT }),
      ...(type === "calendar_card" && {
        width: CALENDAR_CARD_DEFAULT_WIDTH,
        height: CALENDAR_CARD_DEFAULT_HEIGHT,
        show_upcoming: true,
      }),
      ...(type === "trash_card" && {
        width: TRASH_CARD_DEFAULT_WIDTH,
        height: TRASH_CARD_DEFAULT_HEIGHT,
        demo_theme: "gft" as const,
      }),
      ...(type === "room_card" && { width: ROOM_CARD_DEFAULT_WIDTH, height: ROOM_CARD_DEFAULT_HEIGHT }),
      ...((type === "climate_card" || type === "climate_card_2") && { width: CLIMATE_CARD_DEFAULT_WIDTH, height: CLIMATE_CARD_DEFAULT_HEIGHT }),
      ...(type === "nuts_card" && {
        width: NUTS_CARD_DEFAULT_WIDTH,
        height: NUTS_CARD_DEFAULT_HEIGHT,
        accent: "consumption" as const,
        period: "week" as const,
        icon: "Zap",
      }),
      page: dashboardPageRef.current,
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
    const isFloatingOnly = type === "text_card" || type === "media_card" || type === "solar_card" || type === "energy_monitor_card" || type === "power_usage_card" || type === "device_consumption_card" || type === "sensor_card" || type === "weather_card" || type === "climate_card" || type === "climate_card_2" || type === "light_card" || type === "vacuum_card" || type === "vacuum_card_2" || type === "alarm_card" || type === "camera_card" || type === "teamtracker_card" || type === "pill_card" || type === "room_card" || type === "nuts_card" || type === "smart_stack" || type === "card_group" || type === "chore_card" || type === "calendar_card" || type === "timer_card" || type === "trash_card";
    const newLayout = isFloatingOnly ? layout : [...layout, newLayoutItem];

    if (tileDefersSave(type)) {
      pendingAddRef.current = newId;
      flushSync(() => {
        setWidgets(newWidgets);
        setLayout(newLayout);
        setPendingAddId(newId);
      });
      return newId;
    }

    const slot = placeNewTile(type, widgets.filter((widget) => widget.type === type).length);
    const placementKey = rememberTilePosition(type, newId, slot);

    const qk = isRoomMode ? ["room-dashboard", areaId] : ["dashboard", id];
    queryClient.setQueryData(qk, (old: unknown) => {
      if (!old || typeof old !== "object") return old;
      return {
        ...(old as object),
        widgets: JSON.stringify(newWidgets),
        layout: serializeDashboardLayout(newLayout, pageCountRef.current),
      };
    });

    flushSync(() => {
      setWidgets(newWidgets);
      setLayout(newLayout);
    });
    setAddTileOpen(false);
    setAddTileStep("type");
    setAddTileSelectedType(null);
    setAddTileEntitySearch("");
    discardAddTileHistory();
    mutateDashboard({
      layout: newLayout,
      widgets: newWidgets,
      welcomeTitle,
      welcomeSubtitle,
      pageCount: pageCountRef.current,
      commit: true,
      placementKey,
    });
    return undefined;
  }

  function rememberTilePosition(
    type: string,
    widgetId: string,
    slot: { left: number; bottom: number; width: number; height: number }
  ): string | undefined {
    let placementKey: string | undefined;
    if (typeof window !== "undefined") {
      const stored = writeTilePosition(window.localStorage, type, id, widgetId, {
        left: slot.left,
        bottom: slot.bottom,
      });
      if (stored.written && stored.key) {
        placedStorageRef.current = { widgetId, key: stored.key };
        placementKey = stored.key;
        setPlacedHighlight({
          id: widgetId,
          left: slot.left,
          bottom: slot.bottom,
          width: slot.width,
          height: slot.height,
        });
      }
    }
    setUndoAdd({ id: widgetId, type });
    return placementKey;
  }

  function placeNewTile(type: string, widgetIndex: number) {
    const tile = defaultTileSize(type);
    const header = typeof document !== "undefined" ? document.querySelector("[data-app-header]") : null;
    const minTop = header ? Math.ceil(header.getBoundingClientRect().bottom) + 8 : 72;
    const occupied: TileRect[] = [];
    if (typeof document !== "undefined") {
      document.querySelectorAll(".card-plot-in").forEach((node) => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) return;
        if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) return;
        occupied.push({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      });
    }
    return resolveTilePosition({
      viewport: {
        width: typeof window !== "undefined" ? window.innerWidth : 1280,
        height: typeof window !== "undefined" ? window.innerHeight : 800,
      },
      tile,
      occupied,
      minLeft: TILE_SIDEBAR_INSET_PX,
      minTop,
      minBottom: TILE_EDIT_BAR_INSET_PX + 8,
      widgetIndex,
    });
  }

  function dropPendingTile() {
    const pendingId = pendingAddRef.current;
    if (!pendingId) return;
    const type = widgetsRef.current.find((widget) => widget.id === pendingId)?.type ?? "";
    const plan = planCancelPendingAdd(widgetsRef.current, layoutRef.current, pendingId, type, id);
    pendingAddRef.current = null;
    setPendingAddId(null);
    setWidgets(plan.widgets);
    setLayout(plan.layout);
    if (typeof window !== "undefined") {
      clearTilePositionStorage(window.localStorage, type, id, pendingId, "cancel");
    }
    if (placedStorageRef.current?.widgetId === pendingId) placedStorageRef.current = null;
    setEditingWidgetId((current) => (current === pendingId ? null : current));
    setEditingGroupChildId(null);
  }

  function closeAddFlow() {
    dropPendingTile();
    setAddTileOpen(false);
    setAddTileStep("type");
    setAddTileSelectedType(null);
    setAddTileEntitySearch("");
    discardAddTileHistory();
  }

  function openConfigureStep(newId: string) {
    setEditingWidgetId(newId);
    setAddTileOpen(false);
    pushAddTileHistory("configure");
  }

  function finishAddedTile(type: string, widgetId: string): string | undefined {
    const slot = placeNewTile(
      type,
      widgets.filter((widget) => widget.type === type && widget.id !== widgetId).length
    );
    const placementKey = rememberTilePosition(type, widgetId, slot);
    pendingAddRef.current = null;
    setPendingAddId(null);
    discardAddTileHistory();
    return placementKey;
  }

  function undoAddedTile() {
    if (!undoAdd) return;
    const plan = planUndoAddedTile(widgets, layout, undoAdd.id, undoAdd.type, id);
    setWidgets(plan.widgets);
    setLayout(plan.layout);
    if (typeof window !== "undefined") {
      clearTilePositionStorage(
        window.localStorage,
        undoAdd.type,
        id,
        undoAdd.id,
        "undo",
        plan.widgets.map((widget) => widget.type)
      );
    }
    if (placedStorageRef.current?.widgetId === undoAdd.id) placedStorageRef.current = null;
    setUndoAdd(null);
    setPlacedHighlight((current) => (current?.id === undoAdd.id ? null : current));
    if (plan.persist) {
      mutateDashboard({
        layout: plan.layout,
        widgets: plan.widgets,
        welcomeTitle,
        welcomeSubtitle,
        pageCount: pageCountRef.current,
        commit: true,
      });
    }
  }

  syncAddTileRef.current = (stack) => {
    const top = stack[stack.length - 1] ?? null;
    if (top !== "configure") dropPendingTile();
    if (!top) {
      setAddTileOpen(false);
      setAddTileStep("type");
      setAddTileSelectedType(null);
      setAddTileEntitySearch("");
      return;
    }
    if (top === "type") {
      setAddTileOpen(true);
      setAddTileStep("type");
      setAddTileSelectedType(null);
      setAddTileEntitySearch("");
      return;
    }
    if (top === "entity") {
      setAddTileOpen(true);
      setAddTileStep("entity");
    }
  };

  useEffect(() => bindAddTilePop((stack) => syncAddTileRef.current(stack)), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (addTileHistoryDepth() === 0) return;
      event.preventDefault();
      event.stopPropagation();
      backAddTileHistory();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const placedHighlightRef = useRef(placedHighlight);
  placedHighlightRef.current = placedHighlight;

  useEffect(() => {
    const snapshot = placedHighlightRef.current;
    if (!snapshot) return;
    const highlightId = snapshot.id;
    const frame = window.requestAnimationFrame(() => {
      const planned = placedHighlightRef.current;
      if (!planned || planned.id !== highlightId) return;
      let best: DOMRect | null = null;
      let bestDistance = 64;
      for (const node of document.querySelectorAll(".card-plot-in")) {
        const rect = (node as HTMLElement).getBoundingClientRect();
        const bottom = window.innerHeight - rect.bottom;
        const distance = Math.abs(rect.left - planned.left) + Math.abs(bottom - planned.bottom);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = rect;
        }
      }
      if (!best) return;
      const measured = best;
      setPlacedHighlight((current) => {
        if (!current || current.id !== highlightId) return current;
        return {
          ...current,
          left: measured.left,
          bottom: window.innerHeight - measured.bottom,
          width: measured.width,
          height: measured.height,
        };
      });
    });
    const timer = window.setTimeout(() => {
      setPlacedHighlight((current) => (current?.id === highlightId ? null : current));
    }, 4000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [placedHighlight?.id]);

  useEffect(() => {
    if (!undoAdd) return;
    const timer = window.setTimeout(() => setUndoAdd(null), UNDO_TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [undoAdd]);

  const addTileWasOpenRef = useRef(false);
  useEffect(() => {
    if (!addTileOpen) {
      if (addTileWasOpenRef.current) addTileButtonRef.current?.focus();
      addTileWasOpenRef.current = false;
      return;
    }
    addTileWasOpenRef.current = true;
    const dialog = addTileDialogRef.current;
    if (!dialog) return;

    const focusableSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(", ");

    const focusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => !el.hasAttribute("disabled") && el.getClientRects().length > 0,
      );

    dialog.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (nodes.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && dialog.contains(active) && active !== dialog;
      if (event.shiftKey) {
        if (!inside || active === first) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
      if (!inside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [addTileOpen]);

  const domain = addTileSelectedType ? WIDGET_TYPE_DOMAIN[addTileSelectedType] : null;
  const entitiesToShow =
    addTileSelectedType === "pill_card"
      ? entities.filter((e) => PILL_CARD_DOMAINS.some((d) => e.entity_id.startsWith(d + ".")))
      : addTileSelectedType === "teamtracker_card"
        ? entities.filter((e) => isTeamtrackerEntityId(e.entity_id))
      : (addTileSelectedType === "sensor_card" || addTileSelectedType === "stat_pill_card")
        ? entities.filter((e) => e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("binary_sensor."))
        : domain != null
          ? entities.filter((e) => e.entity_id.startsWith(domain + "."))
          : entities;

  function handleRemoveTile(widgetId: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setLayout((prev) => prev.filter((item) => item.i !== widgetId));
  }

  /** Pin a stat pill to the top bar or put it back on the dashboard; saved straight away. */
  function handleTopbarMove(widgetId: string, to: "topbar" | "grid") {
    const next = to === "topbar" ? moveToTopbar(widgets, widgetId) : moveToGrid(widgets, widgetId);
    if (next === widgets) return;
    if (to === "grid" && typeof window !== "undefined") {
      // Last floating position if there is one; otherwise the first free spot that overlaps no tile.
      ensureGridPosition(window.localStorage, id, widgetId, () => {
        const pillsOnGrid = next.filter((w) => w.type === "stat_pill_card" && w.placement !== "topbar").length;
        const slot = placeNewTile("stat_pill_card", pillsOnGrid);
        return { left: slot.left, bottom: slot.bottom };
      });
    }
    setWidgets(next);
    mutateDashboard({ layout, widgets: next, welcomeTitle, welcomeSubtitle });
  }

  function openStatPillMenu(widgetId: string, el: Element | null) {
    const target =
      el ?? document.querySelector(`[data-statpill-id="${CSS.escape(widgetId)}"]`)?.firstElementChild ?? null;
    if (!target) return;
    setTileMenu({ widgetId, anchor: anchorFromElement(target) });
  }

  function handleDuplicateTile(widgetId: string): string | undefined {
    const original = widgets.find((w) => w.id === widgetId);
    if (!original) return undefined;
    const newId = generateId();
    const duplicated: WidgetConfig = {
      ...original,
      id: newId,
      title: `${original.title ?? ""} (kopie)`.trim() || original.title,
      ...((original.type === "card_group" || original.type === "smart_stack") &&
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
          w: 4,
          h: original.type === "text_card" ? 1 : 2,
        };
    const newWidgets = [...widgets, duplicated];
    const newLayout = [...layout, newLayoutItem];
    setWidgets(newWidgets);
    setLayout(newLayout);
    setEditingWidgetId(null);
    mutateDashboard({ layout: newLayout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
    return newId;
  }

  function handleUpdateTile(
    widgetId: string,
    updates: { title?: string; subtitle?: string; textMode?: "title" | "subtitle" | "text"; entity_id?: string; consumption_entity_id?: string; grid_entity_id?: string; humidity_entity_id?: string; display_mode?: "standard" | "compact" | "graph"; show_icon?: boolean; show_state?: boolean; script_ids?: string[]; script_names?: Record<string, string>; cleaned_area_entity_id?: string; progress_entity_id?: string; light_entity_id?: string; media_player_entity_id?: string; climate_entity_id?: string; area_id?: string; background_image?: string; background_image_dark?: string; image_conditions?: { operator: string; value: string; image: string; image_dark?: string }[]; icon_background_color?: string; width?: number; height?: number; icon?: string; size?: string; conditions?: { operator: string; value: string; color: string }[]; alignment?: "start" | "center" | "end" | "between"; children?: WidgetConfig[]; current_entity_id?: string; today_entity_id?: string; accent?: "consumption" | "production"; period?: "week" | "month"; max_value?: number; minimal?: boolean; scale?: number; label?: string; color?: string; refresh?: number; show_title?: boolean; show_team_names?: boolean; show_form?: boolean; show_progress?: boolean; page?: number }
  ) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, ...updates } : w))
    );
    setEditingWidgetId(null);
  }

  function handleMediaCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampMediaCardWidth(size.width);
    const height = clampMediaCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleEnergyMonitorCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampEnergyMonitorCardWidth(size.width);
    const height = clampEnergyMonitorCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleCameraCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampCameraCardWidth(size.width);
    const height = clampCameraCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleTeamtrackerCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampTeamtrackerCardWidth(size.width);
    const height = clampTeamtrackerCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleWeatherCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampWeatherCardWidth(size.width);
    const height = clampWeatherCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleVacuumCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampVacuumCard2Width(size.width);
    const height = clampVacuumCard2Height(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleCalendarCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampCalendarCardWidth(size.width);
    const height = clampCalendarCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleTrashCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampTrashCardWidth(size.width);
    const height = clampTrashCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleNutsCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampNutsCardWidth(size.width);
    const height = clampNutsCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleRoomCardResize(widgetId: string, size: { width: number; height: number }) {
    const width = clampRoomCardWidth(size.width);
    const height = clampRoomCardHeight(size.height);
    const newWidgets = widgets.map((w) => (w.id === widgetId ? { ...w, width, height } : w));
    setWidgets(newWidgets);
    if (editingWidgetId === widgetId) {
      setEditForm((prev) => ({ ...prev, width, height }));
    }
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function handleClimateCardResize(pageIndex: number, size: { width: number; height: number }) {
    const width = clampClimateCardWidth(size.width);
    const height = clampClimateCardHeight(size.height);
    const newWidgets = widgets.map((w) =>
      (w.type === "climate_card" || w.type === "climate_card_2") && widgetPage(w) === pageIndex
        ? { ...w, width, height }
        : w
    );
    setWidgets(newWidgets);
    mutateDashboard({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle });
  }

  function removalSession() {
    return {
      pending: pendingPageRemovalRef.current,
      epoch: pageRemovalEpochRef.current,
      refs: {
        widgets: widgetsRef.current,
        pageCount: pageCountRef.current,
        activePage: dashboardPageRef.current,
        layout: layoutRef.current,
        positions: typeof window === "undefined" ? {} : readFloatingPositions(window.localStorage),
      },
      mirror: removalMirrorRef.current,
    };
  }

  function applyPageSnapshot(snapshot: PageSnapshot<WidgetConfig, LayoutItem>) {
    widgetsRef.current = snapshot.widgets;
    layoutRef.current = snapshot.layout;
    pageCountRef.current = snapshot.pageCount;
    dashboardPageRef.current = snapshot.activePage;
    setWidgets(snapshot.widgets);
    setLayout(snapshot.layout);
    setPageCount(snapshot.pageCount);
    setDashboardPage(snapshot.activePage);
  }

  /** Empty-state button: edit mode on, then the add-tile dialog at its first step (same as the edit bar button). */
  function openAddTileFromEmptyState() {
    setEditMode(true);
    setAddTileOpen(true);
    setAddTileStep("type");
    setAddTileSelectedType(null);
    setAddTileEntitySearch("");
    pushAddTileHistory("type");
  }

  function persistPageSnapshot(snapshot: PageSnapshot<WidgetConfig, LayoutItem>, epoch: number) {
    saveMutation.mutate({
      layout: snapshot.layout,
      widgets: snapshot.widgets,
      welcomeTitle: welcomeTitleRef.current,
      welcomeSubtitle: welcomeSubtitleRef.current,
      pageCount: snapshot.pageCount,
      pageRemovalEpoch: epoch,
    });
  }

  function adoptRemovalStep(step: PageRemovalStep<WidgetConfig, LayoutItem>) {
    const previousGeneration = pageUndoGenerationRef.current;
    pageRemovalEpochRef.current = step.epoch;
    pendingPageRemovalRef.current = step.pending;
    removalMirrorRef.current = step.mirror;
    for (const save of step.saves) {
      persistPageSnapshot(save.snapshot, save.epoch);
    }
    applyPageSnapshot(step.current);
    setPageUndoOpen(step.undoOpen);
    if (step.undoOpen) {
      pageUndoGenerationRef.current = previousGeneration + 1;
      setPageUndoGeneration(pageUndoGenerationRef.current);
    }
  }

  function dismissPageUndo() {
    const hadPending = pendingPageRemovalRef.current != null;
    pendingPageRemovalRef.current = null;
    removalMirrorRef.current = null;
    setPageUndoOpen(false);
    if (hadPending) pageRemovalEpochRef.current += 1;
  }

  function commitPendingPageRemoval() {
    if (!pendingPageRemovalRef.current) return;
    adoptRemovalStep(stepPageRemoval(removalSession(), "commit"));
  }

  pageRemovalCommitRef.current = commitPendingPageRemoval;

  function handleUndoPageRemoval() {
    if (!pendingPageRemovalRef.current) return;
    const step = stepPageRemoval(removalSession(), "undo");
    if (typeof window !== "undefined") {
      restoreFloatingPositions(window.localStorage, step.current.positions);
    }
    adoptRemovalStep(step);
  }

  function handleAddDashboardPage() {
    if (pageCount >= DASHBOARD_MAX_PAGES) return;
    dismissPageUndo();
    const next = pageCount + 1;
    setPageCount(next);
    pageCountRef.current = next;
    setDashboardPage(next - 1);
    dashboardPageRef.current = next - 1;
    mutateDashboard({ layout, widgets, welcomeTitle, welcomeSubtitle, pageCount: next });
  }

  function handleRemoveDashboardPage() {
    if (pageCountRef.current <= 1) return;
    adoptRemovalStep(stepPageRemoval(removalSession(), "remove"));
  }

  if (!id || (isRoomMode && !areaId)) {
    return (
      <AppShell activeTab={isRoomMode ? "/rooms" : "/dashboards"}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isRoomMode ? t("editPanel.invalidRoom") : t("editPanel.invalidDashboardId")}
        </p>
      </AppShell>
    );
  }

  if (isLoading || error) {
    return (
      <AppShell activeTab={isRoomMode ? "/rooms" : "/dashboards"}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {error ? t("editPanel.dashboardNotFound") : t("editPanel.loading")}
        </p>
      </AppShell>
    );
  }

  const headerEndAction = (
    <>
      {isRoomMode && areaId && data ? (
        <>
          <button
            type="button"
            onClick={() => setRoomPanelOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-gray-800 ring-1 ring-gray-300 hover:bg-gray-100 dark:text-gray-100 dark:ring-white/20 dark:hover:bg-white/10"
            aria-label={t("roomsUi.roomSettings")}
            title={t("roomsUi.roomSettings")}
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden />
          </button>
          {roomPanelOpen ? (
            <RoomPanel
              mode="edit"
              room={toPanelRoom(areaId, data)}
              onClose={() => setRoomPanelOpen(false)}
              onSaved={() => {
                setRoomPanelOpen(false);
                queryClient.invalidateQueries({ queryKey: ["room-dashboard", areaId] });
                window.dispatchEvent(new Event("page-background-changed"));
              }}
              onDelete={(room) => {
                setRoomPanelOpen(false);
                writeRoomDeleteHandoff(window.sessionStorage, {
                  areaId: room.areaId,
                  name: room.name,
                  commitAt: Date.now() + UNDO_TOAST_DURATION_MS,
                });
                router.push("/rooms");
              }}
            />
          ) : null}
        </>
      ) : null}
      {editMode ? (
        <>
            <button
              ref={addTileButtonRef}
              type="button"
              onClick={() => {
                setAddTileOpen(true);
                setAddTileStep("type");
                setAddTileSelectedType(null);
                setAddTileEntitySearch("");
                pushAddTileHistory("type");
              }}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[rgba(17,24,39,0.08)] bg-white px-[18px] text-[15px] font-semibold text-[#111827] shadow-[inset_0_0_0_1px_transparent,0_1px_2px_rgba(15,23,42,0.06)] hover:bg-[rgba(17,24,39,0.03)] dark:border-white/10 dark:bg-[#1b1a21] dark:text-[#f3f4f6] dark:hover:bg-white/5"
              aria-label={t("editPanel.addTileAction")}
            >
              <Plus className="h-4 w-4" aria-hidden />
              {t("editPanel.addTileAction")}
            </button>
            {addTileOpen && typeof document !== "undefined" && createPortal(
              <>
                <div
                  className="fixed inset-0 z-[300] bg-[rgba(14,12,19,0.34)] dark:bg-black/60"
                  aria-hidden
                  onClick={closeAddFlow}
                />
                <div
                  ref={addTileDialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="add-tile-dialog-title"
                  tabIndex={-1}
                  className="fixed left-1/2 top-1/2 z-[301] flex h-[min(640px,calc(100dvh-2rem))] max-h-[calc(100dvh-1rem)] w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 animate-fade-scale-in-center flex-col overflow-hidden rounded-xl border border-[rgba(17,24,39,0.08)] bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-[#1b1a21]"
                >
                  <div className="flex min-h-[68px] shrink-0 items-center justify-between gap-2 border-b border-[rgba(17,24,39,0.08)] px-3 py-2.5 dark:border-white/10">
                    <h3 id="add-tile-dialog-title" className="min-w-0 flex-1 truncate pl-2 text-xl font-semibold tracking-tight text-[#111827] dark:text-[#f3f4f6]">
                      {addTileStep === "type" ? t("editPanel.addTile") : t("editPanel.chooseEntity")}
                    </h3>
                    <button
                      type="button"
                      onClick={closeAddFlow}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#4b5563] hover:bg-[rgba(17,24,39,0.05)] dark:text-[#c4c4cc] dark:hover:bg-white/10"
                      aria-label={t("editPanel.close")}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col">
                  {addTileStep === "type" ? (
                    <div className="min-h-0 flex-1 overflow-y-auto p-5 pt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {ADDABLE_WIDGET_TILES.filter(({ type }) => !isWidgetTypeTemporarilyDisabled(type)).map(({ type, labelKey, Icon }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const openDeferred = (tileType: string, entityId: string, title?: string) => {
                              const newId = handleAddTile(tileType, entityId, title);
                              if (newId) openConfigureStep(newId);
                            };
                            if (type === "text_card") {
                              openDeferred("text_card", "", t("editPanel.newText"));
                              return;
                            }
                            if (type === "card_group") {
                              handleAddTile("card_group", "", t("cardType.card_group"));
                              return;
                            }
                            if (type === "smart_stack") {
                              openDeferred("smart_stack", "", t("cardType.smart_stack"));
                              return;
                            }
                            if (type === "room_card") {
                              openDeferred("room_card", "", t("cardType.room_card"));
                              return;
                            }
                            if (type === "energy_monitor_card") {
                              openDeferred("energy_monitor_card", "", t("cardType.energy_monitor_card"));
                              return;
                            }
                            if (type === "power_usage_card") {
                              openDeferred("power_usage_card", "", t("cardType.power_usage_card"));
                              return;
                            }
                            if (type === "calendar_card") {
                              handleAddTile("calendar_card", "", "");
                              return;
                            }
                            if (type === "trash_card") {
                              openDeferred("trash_card", "", t("cardType.trash_card"));
                              return;
                            }
                            if (type === "chore_card") {
                              handleAddTile("chore_card", "", t("cardType.chore_card"));
                              return;
                            }
                            if (type === "timer_card") {
                              handleAddTile("timer_card", "", t("cardType.timer_card"));
                              return;
                            }
                            setAddTileSelectedType(type);
                            setAddTileStep("entity");
                            pushAddTileHistory("entity");
                          }}
                          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 py-4 px-3 transition-colors hover:border-[#4700B5]/40 hover:bg-[#4700B5]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4700B5] dark:border-white/10 dark:bg-white/5 dark:hover:border-[#4700B5]/50 dark:hover:bg-[#4700B5]/10 dark:focus-visible:ring-[#8357be]"
                        >
                          <Icon className="h-7 w-7 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">
                            {t(labelKey)}
                          </span>
                        </button>
                      ))}
                    </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex shrink-0 items-center gap-2 px-3 pt-3">
                        <button
                          type="button"
                          onClick={() => backAddTileHistory()}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#4b5563] hover:bg-[rgba(17,24,39,0.05)] dark:text-[#c4c4cc] dark:hover:bg-white/10"
                          aria-label={t("editPanel.back")}
                        >
                          <ArrowLeft className="h-5 w-5" aria-hidden />
                        </button>
                        <input
                          type="text"
                          value={addTileEntitySearch}
                          onChange={(e) => setAddTileEntitySearch(e.target.value)}
                          placeholder={t("editPanel.addTileSearchPlaceholder")}
                          className="h-12 min-w-0 flex-1 rounded-xl border border-[rgba(17,24,39,0.16)] bg-white px-3.5 text-base text-[#111827] placeholder:text-[#6b7280] dark:border-white/20 dark:bg-black/20 dark:text-[#f3f4f6] dark:placeholder:text-[#a1a1aa]"
                        />
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-3">
                      <div className="overflow-hidden rounded-[18px] border border-[rgba(17,24,39,0.08)] dark:border-white/10">
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
                                  ? t("editPanel.noEntitiesFound")
                                  : t("editPanel.noSearchResults")}
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
                                  if (!addTileSelectedType) return;
                                  const friendly =
                                    (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                                  const titleOverride =
                                    addTileSelectedType === "nuts_card"
                                      ? friendly || t("cardType.nuts_card")
                                      : addTileSelectedType === "energy_monitor_card"
                                        ? friendly || t("cardType.energy_monitor_card")
                                        : addTileSelectedType === "power_usage_card"
                                          ? friendly || t("cardType.power_usage_card")
                                          : friendly || undefined;
                                  const newId = handleAddTile(addTileSelectedType, e.entity_id, titleOverride);
                                  if (newId && tileDefersSave(addTileSelectedType)) openConfigureStep(newId);
                                }}
                                className="flex min-h-12 w-full items-center border-b border-[rgba(17,24,39,0.08)] px-4 text-left text-sm text-[#111827] last:border-b-0 hover:bg-[rgba(17,24,39,0.04)] dark:border-white/10 dark:text-[#f3f4f6] dark:hover:bg-white/10"
                                title={e.entity_id}
                              >
                                <span className="truncate">{name}</span>
                              </button>
                            );
                          });
                        })()}
                      </div>
                      </div>
                    </>
                  )}
                  </div>
                </div>
              </>,
              document.body
            )}
            <div className="relative z-[60]">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="inline-flex h-11 items-center rounded-xl bg-[#4700B5] px-[18px] text-[15px] font-semibold text-white hover:opacity-90 disabled:opacity-60 dark:bg-[#8357be]"
                aria-label={t("editPanel.done")}
              >
                {t("editPanel.done")}
              </button>
            </div>
          </>
      ) : getEditModeAllowed() ? (
        <>
          <span className="relative inline-flex h-8 w-8 shrink-0">
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
              className="group absolute left-1/2 top-1/2 z-[1] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              aria-label={t("editPanel.editDashboard")}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white group-hover:opacity-90"
                style={{ backgroundColor: "#4700B5" }}
              >
                <Pencil className="h-4 w-4" />
              </span>
            </button>
          </span>
          {editPasscodeModalOpen && typeof document !== "undefined" && createPortal(
            <div className="fixed inset-0 z-[300]" aria-modal="true" role="dialog">
              <div
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                aria-hidden
                onClick={() => {
                  setEditPasscodeModalOpen(false);
                  setEditPasscodeError(null);
                  setEditPasscodeInput("");
                }}
              />
              <div className="fixed left-1/2 top-1/2 z-[301] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5 shadow-2xl">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t("settings.dashboard.enterPasscode")}
                </h3>
                <input
                  type="password"
                  value={editPasscodeInput}
                  onChange={(e) => {
                    setEditPasscodeInput(e.target.value);
                    setEditPasscodeError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (checkEditModePasscode(editPasscodeInput)) {
                        setEditMode(true);
                        setEditPasscodeModalOpen(false);
                        setEditPasscodeInput("");
                        setEditPasscodeError(null);
                      } else {
                        setEditPasscodeError(t("settings.dashboard.wrongPasscode"));
                      }
                    }
                  }}
                  placeholder={t("settings.dashboard.editModePasscodePlaceholder")}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500"
                  autoFocus
                  autoComplete="off"
                />
                {editPasscodeError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{editPasscodeError}</p>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditPasscodeModalOpen(false);
                      setEditPasscodeError(null);
                      setEditPasscodeInput("");
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    {t("editPanel.close")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (checkEditModePasscode(editPasscodeInput)) {
                        setEditMode(true);
                        setEditPasscodeModalOpen(false);
                        setEditPasscodeInput("");
                        setEditPasscodeError(null);
                      } else {
                        setEditPasscodeError(t("settings.dashboard.wrongPasscode"));
                      }
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                    style={{ backgroundColor: "#4700B5" }}
                  >
                    {t("settings.dashboard.unlock")}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      ) : null}
    </>
  );

  const hasCardGroup = widgets.some((w) => w.type === "card_group");

  const pinnedStatPills = topbarPills(widgets);
  const tileMenuWidget = tileMenu && editMode ? widgets.find((w) => w.id === tileMenu.widgetId) : undefined;
  const tileMenuItems: TileMenuItem[] = [];
  if (tileMenuWidget) {
    const pillId = tileMenuWidget.id;
    tileMenuItems.push({
      key: "edit",
      label: t("editPanel.editTile"),
      icon: Pencil,
      onSelect: () => setEditingWidgetId(pillId),
    });
    if (tileMenuWidget.placement === "topbar") {
      tileMenuItems.push({
        key: "toGrid",
        label: t("tileMenu.toGrid"),
        icon: LayoutGrid,
        onSelect: () => handleTopbarMove(pillId, "grid"),
      });
    } else {
      const full = !canPinMore(widgets);
      tileMenuItems.push({
        key: "toTopbar",
        label: t("tileMenu.toTopbar"),
        icon: ArrowUpToLine,
        disabled: full,
        hint: full
          ? t("tileMenu.topbarFull")
              .replace("{n}", String(pinnedStatPills.length))
              .replace("{max}", String(TOPBAR_PILL_MAX))
          : undefined,
        onSelect: () => handleTopbarMove(pillId, "topbar"),
      });
    }
  }

  return (
    <AppShell
        activeTab={isRoomMode ? "/rooms" : "/dashboards"}
        headerEndAction={headerEndAction}
        headerStatPills={
          pinnedStatPills.length > 0 ? (
            <HeaderStatPills
              pills={pinnedStatPills}
              editMode={editMode}
              onOpenMenu={(widgetId, anchor) => setTileMenu({ widgetId, anchor })}
            />
          ) : undefined
        }
        backHref={isRoomMode ? "/rooms" : undefined}
        welcomeTitle={welcomeTitle || undefined}
        welcomeSubtitle={welcomeSubtitle || undefined}
        welcomeEntityIds={isRoomMode && data ? { temperature: (data as { temperatureEntityId?: string | null }).temperatureEntityId ?? null, humidity: (data as { humidityEntityId?: string | null }).humidityEntityId ?? null } : undefined}
        hideWelcome={false}
        headerEditMode={editMode}
        welcomeEditable={editMode}
        onWelcomeChange={editMode ? ({ title, subtitle }) => {
          setWelcomeTitle(title);
          setWelcomeSubtitle(subtitle);
        } : undefined}
        contentNoScroll={hasCardGroup}
      >
      {tileMenu && tileMenuWidget && (
        <TileMenu
          anchor={tileMenu.anchor}
          items={tileMenuItems}
          ariaLabel={t("tileMenu.label")}
          onClose={closeTileMenu}
        />
      )}
      <div className="space-y-6 overflow-x-hidden min-h-0">
        <div className="flex items-center justify-end">
          <OfflinePill />
        </div>

        <div className={cn("dashboard-grid-edit rounded-card overflow-hidden", editMode && "grid-edit-touch")}>
          <ReactGridLayout
            className="layout"
            layout={layoutForGrid}
            onLayoutChange={onLayoutChange}
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
            .filter((w) => w.id !== pendingAddId)
            .filter((w) => w.type !== "text_card" && w.type !== "title_card" && w.type !== "title_only_card" && w.type !== "subtitle_card" && w.type !== "media_card" && w.type !== "climate_card" && w.type !== "climate_card_2" && w.type !== "light_card" && w.type !== "solar_card" && w.type !== "energy_monitor_card" && w.type !== "power_usage_card" && w.type !== "device_consumption_card" && w.type !== "stat_pill_card" && w.type !== "weather_card" && w.type !== "vacuum_card" && w.type !== "vacuum_card_2" && w.type !== "alarm_card" && w.type !== "camera_card" && w.type !== "teamtracker_card" && w.type !== "pill_card" && w.type !== "room_card" && w.type !== "nuts_card" && w.type !== "smart_stack" && w.type !== "card_group" && w.type !== "chore_card" && w.type !== "calendar_card" && w.type !== "timer_card" && w.type !== "trash_card")
            .map((w) => {
              const item = layoutMap.get(w.id);
              if (!item) return null;
              return (
                <div
                  key={w.id}
                  className="relative h-full w-full"
                  {...(!editMode && getEditModeAllowed() && {
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
                      subtitle={w.subtitle}
                      entity_id={w.entity_id}
                      consumption_entity_id={w.consumption_entity_id}
                      yield_entity_id_today={(w as { yield_entity_id_today?: string }).yield_entity_id_today}
                      yield_entity_id_month={(w as { yield_entity_id_month?: string }).yield_entity_id_month}
                      humidity_entity_id={w.humidity_entity_id}
                      display_mode={w.display_mode}
                      show_icon={w.show_icon}
                      show_condition={w.show_condition}
                      show_high_low={w.show_high_low}
                      show_wind={w.show_wind}
                      show_humidity={w.show_humidity}
                      show_air_quality={w.show_air_quality}
                      show_precipitation={w.show_precipitation}
                      air_quality_entity_id={w.air_quality_entity_id}
                      script_ids={w.script_ids}
                      script_names={w.script_names}
                      cleaned_area_entity_id={w.cleaned_area_entity_id}
                      progress_entity_id={w.progress_entity_id}
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
                      label={w.label}
                      color={w.color}
                      device_entity_ids={w.device_entity_ids}
                      device_names={w.device_names}
                      cost_per_kwh={w.cost_per_kwh}
                      textMode={w.textMode}
                      date_entity_id={w.date_entity_id}
                      days_entity_id={w.days_entity_id}
                      fraction_entity_ids={w.fraction_entity_ids}
                      demo_theme={w.demo_theme}
                      width={w.width}
                      height={w.height}
                      onMoreClick={editMode ? () => setEditingWidgetId(w.id) : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </ReactGridLayout>
        </div>

        {pageUndoOpen && editMode && typeof document !== "undefined" && createPortal(
          <UndoToast
            message={t("dashboardPages.removed")}
            actionLabel={t("dashboardPages.undo")}
            onAction={handleUndoPageRemoval}
          />,
          document.body
        )}
        <DashboardPager
          pageCount={pageCount}
          page={dashboardPage}
          onPageChange={setDashboardPage}
          editMode={editMode}
          onAddPage={editMode ? handleAddDashboardPage : undefined}
          onRemovePage={editMode ? handleRemoveDashboardPage : undefined}
        >
          {(pageIndex) => {
          const pageWidgets = pendingAddId
            ? widgets.filter((widget) => widget.id !== pendingAddId)
            : widgets;
          return (
            <>
        {/* A tile that is being added (pendingAddId) is not in pageWidgets, so it does not count.
            Neither does a stat pill pinned to the top bar (#301, `placement: "topbar"`). */}
        {!pageWidgets.some(
          (w) => widgetPage(w) === pageIndex && (w as { placement?: string }).placement !== "topbar"
        ) && (
          // The pager layer is pointer-events-none (taps fall through to the page); only the card takes them.
          <div className="flex h-full items-center justify-center px-4 py-8">
            <EmptyStateCard
              className="pointer-events-auto"
              icon={LayoutGrid}
              title={t("dashboard.emptyTitle")}
              body={t("dashboard.emptyBody")}
              action={{ label: t("editPanel.addTileAction"), onClick: openAddTileFromEmptyState }}
              tip={t("dashboard.emptyTip")}
            />
          </div>
        )}
        {pageWidgets
          .filter((w) => w.type === "media_card" && widgetPage(w) === pageIndex)
          .map((w) => (
            <FloatingMediaCard
              key={w.id}
              title={w.title ?? "Media"}
              entity_id={w.entity_id}
              width={w.width}
              height={w.height}
              editMode={editMode}
              storageScope={id}
              widgetId={w.id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(w.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(w.id)
                  : undefined
              }
              onResize={editMode ? (size) => handleMediaCardResize(w.id, size) : undefined}
            />
          ))}

        {(() => {
          const climateCards = pageWidgets.filter(
            (w) =>
              (w.type === "climate_card" || w.type === "climate_card_2") &&
              widgetPage(w) === pageIndex
          );
          return climateCards.length > 0 ? (
            <FloatingClimateCard
              widgets={climateCards.map((w) => ({
                id: w.id,
                title: w.title ?? "Climate",
                entity_id: w.entity_id,
                humidity_entity_id: w.humidity_entity_id,
                display_mode: w.display_mode,
                icon: w.icon,
                type: w.type === "climate_card_2" ? "climate_card_2" : "climate_card",
                width: w.width,
                height: w.height,
              }))}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? (id) => setEditingWidgetId(id) : undefined}
              onRemove={editMode ? (id) => handleRemoveTile(id) : undefined}
              onResize={editMode ? (size) => handleClimateCardResize(pageIndex, size) : undefined}
            />
          ) : null;
        })()}

        {pageWidgets
          .filter((w) =>
            (w.type === "text_card" || w.type === "title_card" || w.type === "title_only_card" || w.type === "subtitle_card") &&
            widgetPage(w) === pageIndex
          )
          .map((w, i) => (
            <FloatingTextCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? t("editPanel.newText"),
                textMode:
                  w.type === "title_card" || w.type === "title_only_card"
                    ? "title"
                    : w.type === "subtitle_card"
                      ? "subtitle"
                      : ((w as { textMode?: "title" | "subtitle" | "text" }).textMode ?? "title"),
                show_icon: w.show_icon ?? false,
                icon: w.icon ?? "Type",
                width: (w as { width?: number }).width,
                entity_id: (w as { entity_id?: string }).entity_id,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={() => {
                setEditMode(true);
                setEditingWidgetId(w.id);
              }}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "light_card" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingLightCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? t("editPanel.iconLabelLamp"),
                entity_id: w.entity_id,
                icon: w.icon,
                card_layout: w.card_layout,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={() => {
                setEditMode(true);
                setEditingWidgetId(w.id);
              }}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {(() => {
          const firstSolar = pageWidgets.find((w) => w.type === "solar_card" && widgetPage(w) === pageIndex);
          return firstSolar ? (
            <FloatingSolarCard
              title={firstSolar.title ?? t("cardType.solar_card")}
              entity_id={firstSolar.entity_id}
              yield_entity_id_today={(firstSolar as { yield_entity_id_today?: string }).yield_entity_id_today}
              yield_entity_id_month={(firstSolar as { yield_entity_id_month?: string }).yield_entity_id_month}
              editMode={editMode}
              storageScope={id}
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

        {pageWidgets
          .filter((w) => w.type === "energy_monitor_card" && widgetPage(w) === pageIndex)
          .map((w) => (
            <FloatingEnergyMonitorCard
              key={w.id}
              title={w.title ?? t("cardType.energy_monitor_card")}
              entity_id={w.entity_id}
              background_image={w.background_image}
              background_image_dark={w.background_image_dark}
              image_conditions={w.image_conditions}
              width={w.width}
              height={w.height}
              editMode={editMode}
              storageScope={id}
              widgetId={w.id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
              onResize={editMode ? (size) => handleEnergyMonitorCardResize(w.id, size) : undefined}
            />
          ))}

        {(() => {
          const firstPowerUsage = pageWidgets.find((w) => w.type === "power_usage_card" && widgetPage(w) === pageIndex);
          return firstPowerUsage ? (
            <FloatingPowerUsageCard
              title={firstPowerUsage.title ?? t("cardType.power_usage_card")}
              entity_id={firstPowerUsage.entity_id}
              cost_per_kwh={firstPowerUsage.cost_per_kwh}
              width={firstPowerUsage.width}
              height={firstPowerUsage.height}
              editMode={editMode}
              storageScope={id}
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

        {pageWidgets
          .filter((w) => w.type === "device_consumption_card" && widgetPage(w) === pageIndex)
          .map((w) => (
            <FloatingDeviceConsumptionCard
              key={w.id}
              title={w.title ?? t("cardType.device_consumption_card")}
              device_entity_ids={w.device_entity_ids}
              device_names={w.device_names}
              width={w.width}
              height={w.height}
              editMode={editMode}
              storageScope={`${id}-${w.id}`}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "stat_pill_card" && w.placement !== "topbar" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            // display: contents keeps the pill's fixed containing block; the wrapper only listens.
            <div
              key={w.id}
              style={{ display: "contents" }}
              data-statpill-id={w.id}
              onPointerDownCapture={(e) => {
                statPillTapRef.current = { id: w.id, el: e.currentTarget.firstElementChild, x: e.clientX, y: e.clientY };
              }}
              onPointerUp={
                editMode
                  ? (e) => {
                      // A tap (not a drag) on the pill body opens the menu; the ⋮ button goes through onEdit.
                      const tap = statPillTapRef.current;
                      if (!tap || tap.id !== w.id) return;
                      if ((e.target as HTMLElement).closest?.("button")) return;
                      if (Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 6) return;
                      openStatPillMenu(w.id, tap.el);
                    }
                  : undefined
              }
            >
            <FloatingStatPillCard
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
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={
                editMode
                  ? () => openStatPillMenu(w.id, statPillTapRef.current?.id === w.id ? statPillTapRef.current.el : null)
                  : undefined
              }
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
            </div>
          ))}

        {pageWidgets
          .filter((w) => w.type === "sensor_card" && widgetPage(w) === pageIndex)
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
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {(() => {
          const firstWeather = pageWidgets.find((w) => w.type === "weather_card" && widgetPage(w) === pageIndex);
          return firstWeather ? (
            <FloatingWeatherCard
              title={firstWeather.title ?? "Weather"}
              entity_id={firstWeather.entity_id}
              show_icon={firstWeather.show_icon}
              show_condition={firstWeather.show_condition}
              show_high_low={firstWeather.show_high_low}
              show_wind={firstWeather.show_wind}
              show_humidity={firstWeather.show_humidity}
              show_air_quality={firstWeather.show_air_quality}
              show_precipitation={firstWeather.show_precipitation}
              air_quality_entity_id={firstWeather.air_quality_entity_id}
              width={firstWeather.width}
              height={firstWeather.height}
              editMode={editMode}
              storageScope={id}
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
              onResize={editMode ? (size) => handleWeatherCardResize(firstWeather.id, size) : undefined}
            />
          ) : null;
        })()}

        {pageWidgets
          .filter((w) => w.type === "camera_card" && widgetPage(w) === pageIndex)
          .map((w) => (
            <FloatingCameraCard
              key={w.id}
              title={w.title ?? "Camera"}
              entity_id={w.entity_id}
              refresh={w.refresh}
              show_title={w.show_title}
              width={w.width}
              height={w.height}
              editMode={editMode}
              storageScope={id}
              widgetId={w.id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(w.id)
                  : undefined
              }
              onRemove={
                editMode
                  ? () => handleRemoveTile(w.id)
                  : undefined
              }
              onResize={editMode ? (size) => handleCameraCardResize(w.id, size) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "teamtracker_card" && widgetPage(w) === pageIndex)
          .map((w) => (
            <FloatingTeamtrackerCard
              key={w.id}
              title={w.title ?? t("cardType.teamtracker_card")}
              entity_id={w.entity_id}
              width={w.width}
              height={w.height}
              show_team_names={w.show_team_names}
              show_form={w.show_form}
              show_progress={w.show_progress}
              editMode={editMode}
              storageScope={id}
              widgetId={w.id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={
                editMode
                  ? () => setEditingWidgetId(w.id)
                  : undefined
              }
              onResize={editMode ? (size) => handleTeamtrackerCardResize(w.id, size) : undefined}
            />
          ))}

        {(() => {
          const firstVacuum = pageWidgets.find((w) => w.type === "vacuum_card" && widgetPage(w) === pageIndex);
          return firstVacuum ? (
            <FloatingVacuumCard
              title={firstVacuum.title ?? t("cardType.vacuum_card")}
              entity_id={firstVacuum.entity_id}
              script_ids={firstVacuum.script_ids}
              script_names={firstVacuum.script_names}
              cleaned_area_entity_id={firstVacuum.cleaned_area_entity_id}
              icon={firstVacuum.icon}
              editMode={editMode}
              storageScope={id}
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

        {pageWidgets
          .filter((w) => w.type === "vacuum_card_2" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingVacuumCard2
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? t("cardType.vacuum_card_2"),
                entity_id: w.entity_id,
                progress_entity_id: w.progress_entity_id,
                background_image: w.background_image,
                width: w.width,
                height: w.height,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
              onResize={editMode ? (size) => handleVacuumCardResize(w.id, size) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "alarm_card" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingAlarmCard
              key={w.id}
              widgetId={w.id}
              widgetIndex={i}
              title={w.title ?? "Alarm"}
              entity_id={w.entity_id}
              icon={w.icon}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {(() => {
          const roomCards = pageWidgets.filter((w) => w.type === "room_card" && widgetPage(w) === pageIndex);
          return roomCards.map((w, i) => (
            <FloatingRoomCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? t("cardType.room_card"),
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
              storageScope={id}
              otherRoomCards={roomCards
                .filter((ow) => ow.id !== w.id)
                .map((ow) => ({
                  id: ow.id,
                  width: clampRoomCardWidth(ow.width),
                  height: clampRoomCardHeight(ow.height),
                  index: roomCards.findIndex((x) => x.id === ow.id),
                }))}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
              onCardClick={
                !editMode
                  ? () => {
                      const href = roomDashboardHref(w.area_id);
                      if (href) {
                        router.push(href);
                        return;
                      }
                      setClickedCardForDefinition({ widgetId: w.id, title: w.title ?? t("cardType.room_card") });
                    }
                  : undefined
              }
              onResize={editMode ? (size) => handleRoomCardResize(w.id, size) : undefined}
            />
          ));
        })()}

        {pageWidgets
          .filter((w) => w.type === "nuts_card" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingNutsCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? t("cardType.nuts_card"),
                entity_id: w.entity_id,
                today_entity_id: w.today_entity_id,
                current_entity_id: w.current_entity_id,
                icon: w.icon,
                icon_background_color: w.icon_background_color,
                accent: w.accent,
                period: w.period,
                width: w.width ?? NUTS_CARD_DEFAULT_WIDTH,
                height: w.height ?? NUTS_CARD_DEFAULT_HEIGHT,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
              onResize={editMode ? (size) => handleNutsCardResize(w.id, size) : undefined}
            />
          ))}


        {pageWidgets
          .filter((w) => w.type === "chore_card" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingChoreCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title,
                child_id: w.child_id,
                show_chore_points: w.show_chore_points,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "pill_card" && widgetPage(w) === pageIndex)
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
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "card_group" && widgetPage(w) === pageIndex)
          .map((g, i) => (
            <FloatingCardGroup
              key={g.id}
              group={g}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(g.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(g.id) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "smart_stack" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingSmartStack
              key={w.id}
              widget={w}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
            />
          ))}

        {pageWidgets
          .filter((w) => w.type === "calendar_card" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingCalendarCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title,
                width: w.width,
                height: w.height,
                show_upcoming: w.show_upcoming,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
              onResize={editMode ? (size) => handleCalendarCardResize(w.id, size) : undefined}
            />
          ))}
        {pageWidgets
          .filter((w) => w.type === "timer_card" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingTimerCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
            />
          ))}
        {pageWidgets
          .filter((w) => w.type === "trash_card" && widgetPage(w) === pageIndex)
          .map((w, i) => (
            <FloatingTrashCard
              key={w.id}
              widget={{
                id: w.id,
                title: w.title ?? t("cardType.trash_card"),
                entity_id: w.entity_id ?? "",
                date_entity_id: w.date_entity_id,
                days_entity_id: w.days_entity_id,
                fraction_entity_ids: w.fraction_entity_ids,
                width: w.width,
                height: w.height,
              }}
              widgetIndex={i}
              editMode={editMode}
              storageScope={id}
              onEnterEditMode={() => setEditMode(true)}
              onEdit={editMode ? () => setEditingWidgetId(w.id) : undefined}
              onRemove={editMode ? () => handleRemoveTile(w.id) : undefined}
              onResize={editMode ? (size) => handleTrashCardResize(w.id, size) : undefined}
            />
          ))}
            </>
          );
        }}
        </DashboardPager>

        {editingWidgetId && editingWidget && typeof document !== "undefined" && createPortal(
          <>
            <div
              className="fixed inset-0 z-[190] bg-black/40 dark:bg-black/70 backdrop-blur-sm"
              aria-hidden
              data-no-page-swipe
              onClick={closeTileEditor}
            />
            <div className="fixed left-1/2 top-1/2 z-[200] flex max-h-[min(820px,calc(100dvh-2rem))] w-[min(960px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 animate-fade-scale-in-center flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-5 pb-3 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {(editingWidget.type === "text_card" || editingWidget.type === "title_card" || editingWidget.type === "title_only_card" || editingWidget.type === "subtitle_card")
                  ? t("editPanel.editText")
                  : editingWidget.type === "smart_stack"
                    ? editingGroupChildId
                      ? t("editPanel.editCardInStack")
                      : t("editPanel.editSmartStack")
                  : editingWidget.type === "card_group"
                    ? editingGroupChildId
                      ? t("editPanel.editCardInGroup")
                      : t("editPanel.editCardGroup")
                    : editingWidget.type === "room_card"
                      ? t("roomsUi.editRoomTile")
                      : editingWidget.type === "power_usage_card"
                        ? t("editPanel.editPowerUsage")
                        : editingWidget.type === "device_consumption_card"
                          ? t("editPanel.editDeviceConsumption")
                          : t("editPanel.editTile")}
              </h3>
              <button
                type="button"
                onClick={closeTileEditor}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                aria-label={t("editPanel.close")}
              >
                <X className="h-5 w-5" />
              </button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5 pt-4 md:max-w-[440px] md:shrink-0 md:border-r md:border-gray-200 dark:md:border-white/10">
                {pageCount > 1 && !isEditingSmartStackChild && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t("editPanel.dashboardPage")}
                    </label>
                    <select
                      value={editForm.page ?? 0}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, page: Number(e.target.value) }))
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                    >
                      {Array.from({ length: pageCount }, (_, index) => (
                        <option key={index} value={index}>
                          {t("dashboardPages.pageN").replace("{n}", String(index + 1))}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {(editingWidget.type === "text_card" || editingWidget.type === "title_card" || editingWidget.type === "title_only_card" || editingWidget.type === "subtitle_card") ? (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.textValue")}
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder={t("editPanel.placeholderTitleExample")}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.type")}
                      </label>
                      <select
                        value={editForm.textMode ?? "title"}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, textMode: e.target.value as "title" | "subtitle" | "text" }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                      >
                        <option value="title">{t("editPanel.title")}</option>
                        <option value="subtitle">{t("editPanel.subtitle")}</option>
                        <option value="text">{t("editPanel.text")}</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.show_icon ?? false}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, show_icon: e.target.checked }))}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{t("editPanel.showIcon")}</span>
                    </label>
                    {(editForm.show_icon ?? false) && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t("editPanel.icon")}
                        </label>
                        <select
                          value={editForm.icon ?? "Type"}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, icon: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                        >
                          {CARD_ICON_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {editingWidget.type === "text_card" && (
                      <>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.widthPx")}
                          </label>
                          <input
                            type="number"
                            min={160}
                            max={500}
                            step={10}
                            value={editForm.width ?? 280}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder="280"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.default280px")}</p>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.switchOptional")}
                          </label>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.entity_id}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))}
                            filter={(e) =>
                              e.entity_id.startsWith("switch.") ||
                              e.entity_id.startsWith("light.") ||
                              e.entity_id.startsWith("input_boolean.")
                            }
                            label=""
                            placeholder={t("editPanel.entityPlaceholder")}
                            emptyOption={t("editPanel.none")}
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.switchHint")}</p>
                        </div>
                      </>
                    )}
                  </>
                ) : editingWidget.type === "smart_stack" && !editingGroupChildId ? (
                    <>
                      <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                        {(["weergave", "kaarten"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => {
                              setEditTab(tab);
                              setStackAddChildType(null);
                            }}
                            className={cn(
                              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                              editTab === tab
                                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            )}
                          >
                            {tab === "weergave" ? t("editPanel.display") : t("editPanel.cards")}
                          </button>
                        ))}
                      </div>
                      {editTab === "weergave" && (
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder={t("cardType.smart_stack")}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardWidthPx")}</label>
                            <input
                              type="number"
                              min={SMART_STACK_MIN_WIDTH}
                              max={SMART_STACK_MAX_WIDTH}
                              step={10}
                              value={editForm.width ?? SMART_STACK_DEFAULT_WIDTH}
                              onChange={(e) => {
                                const v = e.target.value === "" ? undefined : Number(e.target.value);
                                setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined }));
                              }}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                            />
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.smartStackSizeHint")}</p>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardHeightPx")}</label>
                            <input
                              type="number"
                              min={SMART_STACK_MIN_HEIGHT}
                              max={SMART_STACK_MAX_HEIGHT}
                              step={10}
                              value={editForm.height ?? SMART_STACK_DEFAULT_HEIGHT}
                              onChange={(e) => {
                                const v = e.target.value === "" ? undefined : Number(e.target.value);
                                setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined }));
                              }}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.smartStackAutoplay")}</label>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={editForm.autoplay !== false}
                              onClick={() =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  autoplay: prev.autoplay === false,
                                }))
                              }
                              className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4700B5]",
                                editForm.autoplay !== false ? "bg-[#4700B5] border-transparent" : "bg-gray-200 dark:bg-gray-600 border-transparent"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                                  editForm.autoplay !== false ? "translate-x-5" : "translate-x-1"
                                )}
                              />
                            </button>
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.smartStackAutoplayHint")}</p>
                          </div>
                          {editForm.autoplay !== false && (
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.smartStackInterval")}</label>
                            <input
                              type="number"
                              min={SMART_STACK_MIN_INTERVAL_SEC}
                              max={SMART_STACK_MAX_INTERVAL_SEC}
                              step={1}
                              value={editForm.interval_seconds ?? SMART_STACK_DEFAULT_INTERVAL_SEC}
                              onChange={(e) => {
                                const v = e.target.value === "" ? undefined : Number(e.target.value);
                                setEditForm((prev) => ({
                                  ...prev,
                                  interval_seconds: v != null && !Number.isNaN(v) ? v : undefined,
                                }));
                              }}
                              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                            />
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.smartStackIntervalHint")}</p>
                          </div>
                          )}
                        </div>
                      )}
                      {editTab === "kaarten" && (
                        <div className="space-y-3">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardsInStack")}</p>
                          <ul className="space-y-1 max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                            {(editingWidget.children ?? []).map((c, idx) => (
                              <li key={c.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                                <div className="min-w-0 flex-1">
                                  <span className="block truncate text-gray-900 dark:text-gray-100">{c.title || c.entity_id || t(`cardType.${c.type}`)}</span>
                                  <span className="block truncate text-[10px] text-gray-500 dark:text-gray-400">{t(`cardType.${c.type}`)}</span>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const kids = [...(editingWidget.children ?? [])];
                                      if (idx <= 0) return;
                                      [kids[idx - 1], kids[idx]] = [kids[idx], kids[idx - 1]];
                                      const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: kids } : w));
                                      setWidgets(nextWidgets);
                                      mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                                    }}
                                    className="p-1 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/10"
                                    aria-label={t("editPanel.moveUp")}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx >= (editingWidget.children ?? []).length - 1}
                                    onClick={() => {
                                      const kids = [...(editingWidget.children ?? [])];
                                      if (idx >= kids.length - 1) return;
                                      [kids[idx], kids[idx + 1]] = [kids[idx + 1], kids[idx]];
                                      const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: kids } : w));
                                      setWidgets(nextWidgets);
                                      mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                                    }}
                                    className="p-1 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/10"
                                    aria-label={t("editPanel.moveDown")}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingGroupChildId(c.id)}
                                    className="p-1 rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                                    aria-label={t("editPanel.edit")}
                                    title={t("editPanel.editCard")}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextChildren = (editingWidget.children ?? []).filter((x) => x.id !== c.id);
                                      const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                                      setWidgets(nextWidgets);
                                      mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                                    }}
                                    className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    aria-label={t("editPanel.remove")}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </li>
                            ))}
                            {(editingWidget.children ?? []).length === 0 && (
                              <li className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">{t("smartStack.emptyHint")}</li>
                            )}
                          </ul>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.addCard")}</p>
                          {!stackAddChildType ? (
                            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-auto">
                              {SMART_STACK_CHILD_TYPES.map((childType) => (
                                <button
                                  key={childType}
                                  type="button"
                                  onClick={() => {
                                    if (childType === "calendar_card" || childType === "trash_card") {
                                      const newChild: WidgetConfig = {
                                        id: generateId(),
                                        type: childType,
                                        title: t(`cardType.${childType}`),
                                        entity_id: "",
                                        ...(childType === "calendar_card" && { show_upcoming: true }),
                                        ...(childType === "trash_card" && { demo_theme: "gft" as const }),
                                      };
                                      const nextChildren = [...(editingWidget.children ?? []), newChild];
                                      const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                                      setWidgets(nextWidgets);
                                      mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                                      return;
                                    }
                                    setStackAddChildType(childType);
                                    setGroupAddEntitySearch("");
                                  }}
                                  className="rounded-lg border border-gray-200 bg-gray-50/80 px-2 py-2 text-left text-xs font-medium text-gray-700 hover:border-[#4700B5]/40 hover:bg-[#4700B5]/5 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:border-[#4700B5]/50"
                                >
                                  {t(`cardType.${childType}`)}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => setStackAddChildType(null)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                ← {t("editPanel.back")} ({t(`cardType.${stackAddChildType}`)})
                              </button>
                              <input
                                type="text"
                                value={groupAddEntitySearch}
                                onChange={(e) => setGroupAddEntitySearch(e.target.value)}
                                placeholder={t("editPanel.searchEntityPlaceholder")}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                              />
                              <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                                {entities
                                  .filter((e) => {
                                    if (stackAddChildType === "teamtracker_card") return isTeamtrackerEntityId(e.entity_id);
                                    if (stackAddChildType === "sensor_card" || stackAddChildType === "stat_pill_card") {
                                      return e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("binary_sensor.");
                                    }
                                    if (stackAddChildType === "energy_monitor_card") {
                                      return (
                                        e.entity_id.startsWith("weather.") ||
                                        e.entity_id.startsWith("sensor.") ||
                                        e.entity_id.startsWith("binary_sensor.")
                                      );
                                    }
                                    const d = WIDGET_TYPE_DOMAIN[stackAddChildType] ?? "sensor";
                                    return e.entity_id.startsWith(d + ".");
                                  })
                                  .filter((e) => {
                                    const q = groupAddEntitySearch.trim().toLowerCase();
                                    if (!q) return true;
                                    const name = ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase();
                                    return name.includes(q) || e.entity_id.toLowerCase().includes(q);
                                  })
                                  .slice(0, 80)
                                  .map((e) => {
                                    const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id;
                                    return (
                                      <button
                                        key={e.entity_id}
                                        type="button"
                                        onClick={() => {
                                          if (!stackAddChildType || !isSmartStackChildType(stackAddChildType)) return;
                                          const newChild: WidgetConfig = {
                                            id: generateId(),
                                            type: stackAddChildType,
                                            title: name,
                                            entity_id: e.entity_id,
                                            ...(stackAddChildType === "light_card" && { card_layout: "horizontal" as const }),
                                            ...(stackAddChildType === "nuts_card" && { accent: "consumption" as const, period: "week" as const, icon: "Zap" }),
                                            ...(stackAddChildType === "climate_card_2" && { display_mode: "standard" as const }),
                                            ...(stackAddChildType === "camera_card" && { refresh: 10, show_title: true }),
                                            ...(stackAddChildType === "teamtracker_card" && {
                                              show_team_names: true,
                                              show_form: true,
                                              show_progress: true,
                                            }),
                                          };
                                          const nextChildren = [...(editingWidget.children ?? []), newChild];
                                          const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                                          setWidgets(nextWidgets);
                                          mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                                          setStackAddChildType(null);
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
                            {tab === "algemeen" ? t("editPanel.general") : t("editPanel.conditions")}
                          </button>
                        ))}
                      </div>
                      {editTab === "algemeen" && (
                        <>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder={t("editPanel.placeholderTitleExample")}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                      </div>
                      <EntitySelectWithSearch
                        entities={entities}
                        value={editForm.entity_id}
                        onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))}
                        filter={(e) => PILL_CARD_DOMAINS.some((d) => e.entity_id.startsWith(d + "."))}
                        label={t("editPanel.entity")}
                        placeholder={t("editPanel.searchEntity")}
                        emptyOption={t("editPanel.none")}
                      />
                      <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("editPanel.showEntityState")}</span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={editForm.show_state !== false}
                          onClick={() => setEditForm((prev) => ({ ...prev, show_state: prev.show_state === false }))}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4700B5] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                            editForm.show_state !== false ? "bg-[#4700B5] border-transparent" : "bg-gray-200 dark:bg-gray-600"
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
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.icon")}</label>
                        <input
                          type="text"
                          value={pillIconSearch}
                          onChange={(e) => setPillIconSearch(e.target.value)}
                          onFocus={() => setPillIconSearch(pillIconSearch || (editForm.icon ?? ""))}
                          placeholder={t("editPanel.iconSearchPlaceholder")}
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
                              !editForm.icon ? "bg-[#4700B5] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                            )}
                          >
                            {t("editPanel.defaultCircleDot")}
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
                                (editForm.icon ?? "CircleDot") === name ? "bg-[#4700B5] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
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
                        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.conditionalColor")}</p>
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
                                  {op === "contains" ? t("editPanel.operatorContains") : (SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op)}
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
                              placeholder={t("editPanel.value")}
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
                              aria-label={t("editPanel.removeCondition")}
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
                          {"+ " + t("editPanel.addCondition")}
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
                          {tab === "weergave" ? t("editPanel.display") : t("editPanel.cards")}
                        </button>
                      ))}
                    </div>
                    {editTab === "weergave" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.alignment")}</p>
                    <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5">
                      {(["start", "center", "end", "between"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => {
                            const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, alignment: align } : w));
                            setWidgets(nextWidgets);
                            mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className={cn(
                            "rounded-md px-2 py-1 text-xs",
                            (editingWidget.alignment ?? "start") === align
                              ? "bg-[#4700B5] text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                          )}
                        >
                          {align === "start" ? t("editPanel.left") : align === "center" ? t("editPanel.center") : align === "end" ? t("editPanel.right") : t("editPanel.between")}
                        </button>
                      ))}
                    </div>
                  </div>
                    )}
                    {editTab === "kaarten" && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardsInGroup")}</p>
                    <ul className="space-y-1 max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5">
                      {(editingWidget.children ?? []).map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                          <span className="truncate text-gray-900 dark:text-gray-100">{c.title || c.entity_id}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingGroupChildId(c.id)}
                              className="p-1 rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                              aria-label={t("editPanel.edit")}
                              title={t("editPanel.editCard")}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const nextChildren = (editingWidget.children ?? []).filter((x) => x.id !== c.id);
                                const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                                setWidgets(nextWidgets);
                                mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                              }}
                              className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              aria-label={t("editPanel.remove")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.addCard")}</p>
                    <input
                      type="text"
                      value={groupAddEntitySearch}
                      onChange={(e) => setGroupAddEntitySearch(e.target.value)}
                      placeholder={t("editPanel.searchEntityPlaceholder")}
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
                                mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
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
                    {t("editPanel.name")}
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder={t("editPanel.tileNamePlaceholder")}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                  />
                </div>
                {isEditingSmartStackChild && (
                  <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                    {t("editPanel.smartStackChildSizeLocked")}
                  </p>
                )}
                {(editFormTarget?.entity_id != null || editFormType === "energy_monitor_card" || editFormType === "power_usage_card" || editFormType === "device_consumption_card") && editFormType !== "text_card" && editFormType !== "title_card" && editFormType !== "title_only_card" && editFormType !== "subtitle_card" && editFormType !== "room_card" && editFormType !== "device_consumption_card" && editFormType !== "calendar_card" && editFormType !== "chore_card" && editFormType !== "timer_card" && (
                  <EntitySelectWithSearch
                    entities={entities}
                    value={editForm.entity_id}
                    onChange={(v) => {
                      const picked = entities.find((e) => e.entity_id === v);
                      const friendlyName = (picked?.attributes as { friendly_name?: string })?.friendly_name?.trim();
                      setEditForm((prev) => ({
                        ...prev,
                        entity_id: v,
                        ...(friendlyName && { title: friendlyName }),
                      }));
                    }}
                    filter={
                      editFormType === "pill_card"
                        ? (e) => PILL_CARD_DOMAINS.some((d) => e.entity_id.startsWith(d + "."))
                        : editFormType === "teamtracker_card"
                          ? (e) => isTeamtrackerEntityId(e.entity_id)
                        : editFormType === "energy_monitor_card"
                          ? (e) => e.entity_id.startsWith("weather.") || e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("binary_sensor.")
                          : (editFormType === "sensor_card" || editFormType === "stat_pill_card")
                            ? (e) => e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("binary_sensor.")
                            : (e) => e.entity_id.startsWith((WIDGET_TYPE_DOMAIN[editFormType] ?? "sensor") + ".")
                    }
                    label={
                      editFormType === "solar_card"
                        ? t("editPanel.yieldEntity")
                        : editFormType === "energy_monitor_card"
                          ? t("editPanel.entityForConditions")
                          : editFormType === "power_usage_card"
                            ? t("editPanel.totalUsage")
                            : editFormType === "stat_pill_card"
                              ? t("editPanel.sensor")
                              : editFormType === "trash_card"
                                ? t("trashCard.typeEntity")
                              : t("editPanel.entity")
                    }
                    placeholder={t("editPanel.searchEntity")}
                    emptyOption={editFormType === "energy_monitor_card" ? t("editPanel.noEntityImageOnly") : t("editPanel.none")}
                  />
                )}
                {editFormType === "media_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.mediaPlayerSelectedAbove")}</p>
                    )}
                    {editTab === "weergave" && !isEditingSmartStackChild && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardWidthPx")}</label>
                          <input
                            type="number"
                            min={MEDIA_CARD_MIN_WIDTH}
                            max={MEDIA_CARD_MAX_WIDTH}
                            step={10}
                            value={editForm.width ?? MEDIA_CARD_DEFAULT_WIDTH}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder={String(MEDIA_CARD_DEFAULT_WIDTH)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardWidthRange240")}</p>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardHeightPx")}</label>
                          <input
                            type="number"
                            min={MEDIA_CARD_MIN_HEIGHT}
                            max={MEDIA_CARD_MAX_HEIGHT}
                            step={10}
                            value={editForm.height ?? MEDIA_CARD_DEFAULT_HEIGHT}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder={String(MEDIA_CARD_DEFAULT_HEIGHT)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.optionalMinHeight")}</p>
                        </div>
                      </div>
                    )}
                    {editTab === "weergave" && isEditingSmartStackChild && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.smartStackChildSizeLocked")}</p>
                    )}
                  </>
                )}
                {editFormType === "light_card" && (
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
                        {t("editPanel.general")}
                      </button>
                    </div>
                    {editTab === "algemeen" && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.icon")}
                      </label>
                      <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5">
                        {LIGHT_ICON_OPTIONS.map((key) => {
                          const label =
                            key === "lightbulb"
                              ? "Lightbulb"
                              : key === "cone"
                                ? "Cone"
                                : key === "spotlight"
                                  ? "Spotlight"
                                  : key === "lamp"
                                    ? t("editPanel.iconLabelLamp")
                                    : key === "lamp-ceiling"
                                      ? t("editPanel.iconLabelCeiling")
                                      : key === "lamp-desk"
                                        ? t("editPanel.iconLabelDesk")
                                        : key === "lamp-floor"
                                          ? t("editPanel.iconLabelFloor")
                                          : key === "lamp-wall-down"
                                            ? t("editPanel.wallDown")
                                            : t("editPanel.wallUp");
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
                                  ? "bg-[#4700B5] text-white"
                                  : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                              )}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardLayout")}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { value: "horizontal" as const, label: t("editPanel.cardLayoutHorizontal") },
                          { value: "square" as const, label: t("editPanel.cardLayoutSquare") },
                        ]).map((option) => {
                          const selected = (editForm.card_layout ?? "horizontal") === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setEditForm((prev) => ({ ...prev, card_layout: option.value }))}
                              className={cn(
                                "flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-xs font-medium transition-colors",
                                selected
                                  ? "border-[#4700B5] bg-[#4700B5]/10 text-gray-900 dark:border-[#8357BE] dark:bg-[#8357BE]/15 dark:text-white"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20"
                              )}
                            >
                              <span
                                className={cn(
                                  option.value === "horizontal"
                                    ? "h-7 w-14 rounded-[10px]"
                                    : "h-10 w-10 rounded-[12px]",
                                  selected
                                    ? "bg-[#4700B5]/80 dark:bg-[#8357BE]/80"
                                    : "bg-gray-300 dark:bg-white/25"
                                )}
                                aria-hidden
                              />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                    )}
                  </>
                )}
                {editFormType === "room_card" && (
                  <>
                    <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                      {(["entiteiten", "algemeen", "achtergrond", "weergave", "verplaats"] as const).map((tab) => (
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
                          {tab === "entiteiten" ? t("editPanel.entities") : tab === "algemeen" ? t("editPanel.general") : tab === "achtergrond" ? t("editPanel.background") : tab === "weergave" ? t("editPanel.display") : t("editPanel.moveToRoom")}
                        </button>
                      ))}
                    </div>
                    {editTab === "entiteiten" && (
                      <div className="space-y-4">
                        <LinkedRoomList
                          value={editForm.area_id}
                          onChange={(areaId) =>
                            setEditForm((prev) => reduceRoomCardLink(prev, { type: "select", areaId }))
                          }
                          onAdopt={(room) =>
                            setEditForm((prev) => reduceRoomCardLink(prev, { type: "adopt", room }))
                          }
                        />
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v || "" }))}
                            label={t("editPanel.sensorValueDisplay")}
                            placeholder={t("editPanel.searchEntity")}
                            emptyOption={t("editPanel.none")}
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.sensorValueHint")}</p>
                        </div>
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.light_entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, light_entity_id: v || undefined }))}
                            filter={(e) => e.entity_id.startsWith("light.") || e.entity_id.startsWith("group.")}
                            label={t("editPanel.light")}
                            placeholder={t("editPanel.searchLight")}
                            emptyOption={t("editPanel.none")}
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.lightHint")}</p>
                        </div>
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.media_player_entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, media_player_entity_id: v || undefined }))}
                            filter={(e) => e.entity_id.startsWith("media_player.")}
                            label={t("editPanel.mediaPlayer")}
                            placeholder={t("editPanel.searchMediaPlayer")}
                            emptyOption={t("editPanel.none")}
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.mediaPlayerHint")}</p>
                        </div>
                        <div>
                          <EntitySelectWithSearch
                            entities={entities}
                            value={editForm.climate_entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, climate_entity_id: v || undefined }))}
                            filter={(e) => e.entity_id.startsWith("climate.") || e.entity_id.startsWith("sensor.")}
                            label={t("editPanel.climate")}
                            placeholder={t("editPanel.searchClimate")}
                            emptyOption={t("editPanel.none")}
                          />
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.climateHint")}</p>
                        </div>
                      </div>
                    )}
                    {editTab === "algemeen" && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.icon")}</label>
                          <input
                            type="text"
                            value={iconSearch || ""}
                            onChange={(e) => setIconSearch(e.target.value)}
                            placeholder={t("editPanel.searchIcon")}
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
                                    ? "bg-[#4700B5] text-white"
                                    : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                                )}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.iconBadgeColor")}</label>
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
                          {t("editPanel.backgroundImageHint")}
                        </p>
                        {editForm.background_image && (
                          <div
                            className="h-24 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                            style={{ backgroundImage: cssUrl(editForm.background_image) }}
                          />
                        )}
                        <div className="flex gap-2">
                          <label className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                            {uploadingRoomBg ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
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
                              {t("editPanel.remove")}
                            </button>
                          )}
                        </div>
                        <input
                          type="url"
                          value={editForm.background_image ?? ""}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, background_image: e.target.value || undefined }))}
                          placeholder={t("editPanel.backgroundUrlPlaceholder")}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                      </div>
                    )}
                    {editTab === "weergave" && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardWidthPx")}</label>
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
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardWidthRange280")}</p>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.cardHeightPx")}</label>
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
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardHeightRange120")}</p>
                        </div>
                      </div>
                    )}
                    {editTab === "verplaats" && isRoomMode && areaId && (
                      <MoveCardToRoomSection
                        currentAreaId={areaId}
                        widget={editingWidget}
                        t={t}
                        onMove={async (targetAreaId) => {
                          const targetRes = await fetch(`/api/room-dashboards/${encodeURIComponent(targetAreaId)}`);
                          if (!targetRes.ok) throw new Error(t("editPanel.moveToRoomError"));
                          const targetData = await targetRes.json();
                          const targetWidgets: WidgetConfig[] = targetData.widgets ? parseWidgets(targetData.widgets) : [];
                          const targetLayout: Layout = targetData.layout ? parseLayout(targetData.layout) : [];
                          const widgetToMove = { ...editingWidget };
                          const newTargetWidgets = [...targetWidgets, widgetToMove];
                          const targetPutRes = await fetch(`/api/room-dashboards/${encodeURIComponent(targetAreaId)}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ widgets: JSON.stringify(newTargetWidgets), layout: JSON.stringify(targetLayout) }),
                          });
                          if (!targetPutRes.ok) throw new Error(t("editPanel.moveToRoomError"));
                          const newWidgets = widgets.filter((w) => w.id !== editingWidget.id);
                          const newLayout = layout.filter((item) => item.i !== editingWidget.id);
                          setWidgets(newWidgets);
                          setLayout(newLayout);
                          setEditingWidgetId(null);
                          await fetch(apiBase, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ widgets: JSON.stringify(newWidgets), layout: JSON.stringify(newLayout) }),
                          });
                          queryClient.invalidateQueries({ queryKey: ["room-dashboard", areaId] });
                          queryClient.invalidateQueries({ queryKey: ["room-dashboard", targetAreaId] });
                          router.push(`/dashboards/room-${encodeURIComponent(targetAreaId)}`);
                        }}
                      />
                    )}
                  </>
                )}
                {(editFormType === "climate_card_2" || editFormType === "climate_card") && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.icon")}
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
                      label={t("editPanel.humidityOptional")}
                      placeholder={t("editPanel.searchSensor")}
                      emptyOption={t("editPanel.none")}
                    />
                    </>
                    )}
                    {editTab === "weergave" && (
                    <>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.climateDisplayMode")}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { value: "standard" as const, label: t("editPanel.climateDisplayModeStandard") },
                          { value: "compact" as const, label: t("editPanel.climateDisplayModeCompact") },
                          { value: "graph" as const, label: t("editPanel.climateDisplayModeGraph") },
                        ]).map((option) => {
                          const selected = (editForm.display_mode ?? "standard") === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                setEditForm((prev) => {
                                  const nextMode = option.value;
                                  const prevMode = normalizeClimateDisplayMode(prev.display_mode);
                                  if (nextMode === prevMode) {
                                    return { ...prev, display_mode: nextMode };
                                  }
                                  if (isEditingSmartStackChild) {
                                    return { ...prev, display_mode: nextMode };
                                  }
                                  const size = climateCardDefaultSizeForMode(nextMode);
                                  return {
                                    ...prev,
                                    display_mode: nextMode,
                                    width: size.width,
                                    height: size.height,
                                  };
                                })
                              }
                              className={cn(
                                "rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition-colors",
                                selected
                                  ? "border-[#4700B5] bg-[#4700B5]/10 text-gray-900 dark:border-[#8357BE] dark:bg-[#8357BE]/15 dark:text-white"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20"
                              )}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.climateDisplayModeHint")}</p>
                    </div>
{!isEditingSmartStackChild && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardWidthPx")}
                      </label>
                      <input
                        type="number"
                        min={CLIMATE_CARD_MIN_WIDTH}
                        max={CLIMATE_CARD_MAX_WIDTH}
                        step={10}
                        value={editForm.width ?? CLIMATE_CARD_DEFAULT_WIDTH}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(CLIMATE_CARD_DEFAULT_WIDTH)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardWidthRange300")}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardHeightPx")}
                      </label>
                      <input
                        type="number"
                        min={CLIMATE_CARD_MIN_HEIGHT}
                        max={CLIMATE_CARD_MAX_HEIGHT}
                        step={10}
                        value={editForm.height ?? CLIMATE_CARD_DEFAULT_HEIGHT}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(CLIMATE_CARD_DEFAULT_HEIGHT)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardHeightRange340")}</p>
                    </div>
                    </>
                    )}
                    </>
                    )}
                  </>
                )}
                {editFormType === "solar_card" && (
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
                        {t("editPanel.general")}
                      </button>
                    </div>
                    {editTab === "algemeen" && (
                      <>
                        <EntitySelectWithSearch
                          entities={entities}
                          value={editForm.entity_id ?? ""}
                          onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))}
                          filter={(e) => e.entity_id.startsWith("sensor.")}
                          label={t("editPanel.solarChartEntity")}
                          placeholder={t("editPanel.searchEntity")}
                          emptyOption={t("editPanel.none")}
                        />
                        <EntitySelectWithSearch
                          entities={entities}
                          value={editForm.yield_entity_id_today ?? ""}
                          onChange={(v) => setEditForm((prev) => ({ ...prev, yield_entity_id_today: v || undefined }))}
                          filter={(e) => e.entity_id.startsWith("sensor.")}
                          label={t("editPanel.solarTodayEntity")}
                          placeholder={t("editPanel.searchSensor")}
                          emptyOption={t("editPanel.none")}
                        />
                        <EntitySelectWithSearch
                          entities={entities}
                          value={editForm.yield_entity_id_month ?? ""}
                          onChange={(v) => setEditForm((prev) => ({ ...prev, yield_entity_id_month: v || undefined }))}
                          filter={(e) => e.entity_id.startsWith("sensor.")}
                          label={t("editPanel.solarMonthEntity")}
                          placeholder={t("editPanel.searchSensor")}
                          emptyOption={t("editPanel.none")}
                        />
                      </>
                    )}
                  </>
                )}
                {editFormType === "energy_monitor_card" && (
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
                          {tab === "achtergrond" ? t("editPanel.background") : tab === "weergave" ? t("editPanel.display") : t("editPanel.conditions")}
                        </button>
                      ))}
                    </div>
                    {editTab === "achtergrond" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.backgroundLight")}
                      </label>
                      {editForm.background_image && (
                        <div
                          className="mb-2 h-20 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                          style={{ backgroundImage: cssUrl(editForm.background_image) }}
                        />
                      )}
                      <div className="flex gap-2 mb-2">
                        <label className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                          {uploadingEnergyBg ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              e.target.value = "";
                              setUploadingEnergyBg(true);
                              try {
                                const formData = new FormData();
                                formData.set("file", file);
                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                const json = await res.json();
                                if (!res.ok) throw new Error(json.error || "Upload failed");
                                setEditForm((prev) => ({ ...prev, background_image: json.url }));
                              } finally {
                                setUploadingEnergyBg(false);
                              }
                            }}
                            disabled={uploadingEnergyBg}
                          />
                        </label>
                        {editForm.background_image && (
                          <button
                            type="button"
                            onClick={() => setEditForm((prev) => ({ ...prev, background_image: undefined }))}
                            className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                          >
                            {t("editPanel.remove")}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editForm.background_image ?? ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            background_image: e.target.value || undefined,
                          }))
                        }
                        placeholder={t("editPanel.orPasteUrlAfterUpload")}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.backgroundDark")}
                      </label>
                      {editForm.background_image_dark && (
                        <div
                          className="mb-2 h-20 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                          style={{ backgroundImage: cssUrl(editForm.background_image_dark) }}
                        />
                      )}
                      <div className="flex gap-2 mb-2">
                        <label className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                          {uploadingEnergyBgDark ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              e.target.value = "";
                              setUploadingEnergyBgDark(true);
                              try {
                                const formData = new FormData();
                                formData.set("file", file);
                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                const json = await res.json();
                                if (!res.ok) throw new Error(json.error || "Upload failed");
                                setEditForm((prev) => ({ ...prev, background_image_dark: json.url }));
                              } finally {
                                setUploadingEnergyBgDark(false);
                              }
                            }}
                            disabled={uploadingEnergyBgDark}
                          />
                        </label>
                        {editForm.background_image_dark && (
                          <button
                            type="button"
                            onClick={() => setEditForm((prev) => ({ ...prev, background_image_dark: undefined }))}
                            className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                          >
                            {t("editPanel.remove")}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editForm.background_image_dark ?? ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            background_image_dark: e.target.value || undefined,
                          }))
                        }
                        placeholder={t("editPanel.darkSameAsLight")}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                    </div>
                    </>
                    )}
                    {editTab === "weergave" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardWidthPx")}
                      </label>
                      <input
                        type="number"
                        min={ENERGY_MONITOR_CARD_MIN_WIDTH}
                        max={ENERGY_MONITOR_CARD_MAX_WIDTH}
                        step={1}
                        value={editForm.width ?? ENERGY_MONITOR_CARD_DEFAULT_WIDTH}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardWidthRangeImage")}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardHeightPx")}
                      </label>
                      <input
                        type="number"
                        min={ENERGY_MONITOR_CARD_MIN_HEIGHT}
                        max={ENERGY_MONITOR_CARD_MAX_HEIGHT}
                        step={1}
                        value={editForm.height ?? ENERGY_MONITOR_CARD_DEFAULT_HEIGHT}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardHeightRangeImage")}</p>
                    </div>
                    </>
                    )}
                    {editTab === "voorwaarden" && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.imageConditions")}
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        {t("editPanel.imageConditionsExample")}
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
                              <option key={op} value={op}>{op === "contains" ? t("editPanel.operatorContains") : (SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op)}</option>
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
                            placeholder={t("editPanel.valueExampleSunny")}
                            className="flex-1 min-w-[80px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                          />
                          <div className="flex flex-wrap items-center gap-1 min-w-0 flex-1">
                            {cond.image && (
                              <div
                                className="h-8 w-8 shrink-0 rounded bg-cover bg-center border border-gray-200 dark:border-white/10"
                                style={{ backgroundImage: cssUrl(cond.image) }}
                                aria-hidden
                              />
                            )}
                            <label className="shrink-0 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                              {uploadingConditionImage?.idx === idx && uploadingConditionImage?.field === "image" ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
                                className="sr-only"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  e.target.value = "";
                                  setUploadingConditionImage({ idx, field: "image" });
                                  try {
                                    const formData = new FormData();
                                    formData.set("file", file);
                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                    const json = await res.json();
                                    if (!res.ok) throw new Error(json.error || "Upload failed");
                                    setEditForm((prev) => ({
                                      ...prev,
                                      image_conditions: (prev.image_conditions ?? []).map((c, i) =>
                                        i === idx ? { ...c, image: json.url } : c
                                      ),
                                    }));
                                  } finally {
                                    setUploadingConditionImage(null);
                                  }
                                }}
                                disabled={uploadingConditionImage != null}
                              />
                            </label>
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
                              placeholder={t("editPanel.orPasteUrl")}
                              className="flex-1 min-w-[80px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-1 min-w-0 flex-1">
                            {cond.image_dark && (
                              <div
                                className="h-8 w-8 shrink-0 rounded bg-cover bg-center border border-gray-200 dark:border-white/10"
                                style={{ backgroundImage: cssUrl(cond.image_dark) }}
                                aria-hidden
                              />
                            )}
                            <label className="shrink-0 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10" title={t("editPanel.uploadImage")}>
                              {uploadingConditionImage?.idx === idx && uploadingConditionImage?.field === "image_dark" ? t("editPanel.uploading") : t("editPanel.uploadImage") + " (dark)"}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
                                className="sr-only"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  e.target.value = "";
                                  setUploadingConditionImage({ idx, field: "image_dark" });
                                  try {
                                    const formData = new FormData();
                                    formData.set("file", file);
                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                    const json = await res.json();
                                    if (!res.ok) throw new Error(json.error || "Upload failed");
                                    setEditForm((prev) => ({
                                      ...prev,
                                      image_conditions: (prev.image_conditions ?? []).map((c, i) =>
                                        i === idx ? { ...c, image_dark: json.url } : c
                                      ),
                                    }));
                                  } finally {
                                    setUploadingConditionImage(null);
                                  }
                                }}
                                disabled={uploadingConditionImage != null}
                              />
                            </label>
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
                              placeholder={t("editPanel.darkUploadOptional")}
                              className="flex-1 min-w-0 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                            />
                          </div>
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
                        {"+ " + t("editPanel.addConditionShort")}
                      </button>
                    </div>
                    )}
                  </>
                )}
                {editFormType === "power_usage_card" && (
                  <>
                    <EntitySelectWithSearch entities={entities} value={editForm.entity_id} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("sensor.")} label={t("editPanel.totalUsage")} placeholder={t("editPanel.searchEntity")} emptyOption={t("editPanel.none")} />
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.costPerKwh")}</label>
                      <input type="number" min={0} step={0.001} value={editForm.cost_per_kwh ?? ""} onChange={(e) => { const v = e.target.value === "" ? undefined : parseFloat(e.target.value); setEditForm((prev) => ({ ...prev, cost_per_kwh: v != null && !Number.isNaN(v) ? v : undefined })); }} placeholder="0.25" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t("editPanel.widthPx")}
                        </label>
                        <input
                          type="number"
                          min={280}
                          max={600}
                          step={20}
                          value={editForm.width ?? 400}
                          onChange={(e) => {
                            const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                            setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined }));
                          }}
                          className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t("editPanel.heightPx")}
                        </label>
                        <input
                          type="number"
                          min={200}
                          max={600}
                          step={20}
                          value={editForm.height ?? 380}
                          onChange={(e) => {
                            const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                            setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined }));
                          }}
                          className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                        />
                      </div>
                    </div>
                  </>
                )}
                {editFormType === "device_consumption_card" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.devices")}</label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.searchNameOrEntityIdHint")}</p>
                      <input type="text" value={powerUsageDeviceSearch} onChange={(e) => setPowerUsageDeviceSearch(e.target.value)} placeholder={t("editPanel.searchEntity")} className="mb-2 w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:text-gray-200 dark:placeholder-gray-500" />
                      <div className="max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1">
                        {entities.filter((e) => {
                          const name = ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase();
                          const eid = e.entity_id.toLowerCase();
                          const q = powerUsageDeviceSearch.trim().toLowerCase();
                          const matchesSearch = !q || name.includes(q) || eid.includes(q);
                          const isEnergyRelated = e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("switch.") || e.entity_id.startsWith("light.") || e.entity_id.includes("energy") || e.entity_id.includes("power");
                          return matchesSearch && (isEnergyRelated || !!q);
                        }).map((e) => { const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id; const checked = (editForm.device_entity_ids ?? []).includes(e.entity_id); return (
                          <label key={e.entity_id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" checked={checked} onChange={() => { const ids = editForm.device_entity_ids ?? []; setEditForm((prev) => ({ ...prev, device_entity_ids: checked ? ids.filter((id) => id !== e.entity_id) : [...ids, e.entity_id] })); }} className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-[#4700B5] focus:ring-[#4700B5]" />
                            <span className="text-sm truncate" title={e.entity_id}>{name}</span>
                          </label>
                        ); })}
                        {entities.filter((e) => { const name = ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase(); const eid = e.entity_id.toLowerCase(); const q = powerUsageDeviceSearch.trim().toLowerCase(); const matchesSearch = !q || name.includes(q) || eid.includes(q); const isEnergyRelated = e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("switch.") || e.entity_id.startsWith("light.") || e.entity_id.includes("energy") || e.entity_id.includes("power"); return matchesSearch && (isEnergyRelated || !!q); }).length === 0 && <p className="text-xs text-gray-500 py-2">{powerUsageDeviceSearch.trim() ? t("editPanel.noResultsShort") : t("editPanel.noSensorsFound")}</p>}
                      </div>
                    </div>
                    {(editForm.device_entity_ids ?? []).length > 0 && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.deviceDisplayNames")}</label>
                        <div className="space-y-2 max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 p-2">
                          {(editForm.device_entity_ids ?? []).map((eid) => {
                            const defaultName = (entities.find((x) => x.entity_id === eid)?.attributes as { friendly_name?: string })?.friendly_name ?? eid;
                            const customName = (editForm.device_names ?? {})[eid] ?? "";
                            return (
                              <div key={eid} className="flex flex-col gap-0.5">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate" title={eid}>{eid}</span>
                                <input type="text" value={customName} onChange={(e) => setEditForm((prev) => ({ ...prev, device_names: { ...(prev.device_names ?? {}), [eid]: e.target.value } }))} placeholder={defaultName} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:text-gray-200 dark:placeholder-gray-500" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.widthPx")}</label>
                        <input type="number" min={200} max={500} step={20} value={editForm.width ?? 320} onChange={(e) => { const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10); setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined })); }} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.heightPx")}</label>
                        <input type="number" min={200} max={500} step={20} value={editForm.height ?? 320} onChange={(e) => { const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10); setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined })); }} className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200" />
                      </div>
                    </div>
                  </>
                )}
                {editFormType === "stat_pill_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.conditions")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.labelUnderValue")}
                      </label>
                      <input
                        type="text"
                        value={editForm.label ?? ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, label: e.target.value || undefined }))
                        }
                        placeholder={t("editPanel.labelPlaceholder")}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.icon")}
                      </label>
                      <div
                        className="grid grid-cols-5 gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-2"
                        role="listbox"
                        aria-label={t("editPanel.icon")}
                      >
                        {STAT_PILL_ICON_OPTIONS.map((key) => {
                          const Icon = CARD_ICONS[key];
                          const selected = normalizeStatPillIconKey(editForm.icon) === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              title={key}
                              onClick={() =>
                                setEditForm((prev) => ({ ...prev, icon: key }))
                              }
                              className={cn(
                                "flex h-10 w-full items-center justify-center rounded-xl border-2 transition-colors",
                                selected
                                  ? "border-brand bg-brand/10 text-brand"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/15 dark:text-gray-300 dark:hover:border-white/30"
                              )}
                            >
                              {Icon && <Icon className="h-5 w-5" aria-hidden />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.colorDefault")}
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
                        <option value="amber">{t("editPanel.colorAmber")}</option>
                        <option value="purple">{t("editPanel.colorPurple")}</option>
                        <option value="emerald">{t("editPanel.colorEmerald")}</option>
                        <option value="red">{t("editPanel.colorRed")}</option>
                      </select>
                    </div>
                    </>
                    )}
                    {editTab === "voorwaarden" && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.conditionsColorHint")}
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        {t("editPanel.conditionsColorExamplePlastic")}
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
                                {op === "contains" ? t("editPanel.operatorContains") : (SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op)}
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
                            placeholder={t("editPanel.valueExamplePlastic")}
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
aria-label={t("editPanel.removeCondition")}
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
                          {"+ " + t("editPanel.addCondition")}
                        </button>
                      </div>
                    )}
                  </>
                )}
                {editFormType === "vacuum_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t("editPanel.vacuumScripts")}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {t("editPanel.vacuumScriptsHint")}
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
                                className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-[#4700B5] focus:ring-[#4700B5]"
                              />
                              <span className="text-sm truncate shrink-0 max-w-[140px]" title={e.entity_id}>{defaultName}</span>
                            </label>
                          );
                        })}
                      {entities.filter((e) => e.entity_id.startsWith("script.")).length === 0 && (
                        <p className="text-xs text-gray-500 py-2">{t("editPanel.noScriptsFound")}</p>
                      )}
                    </div>
                    {(editForm.script_ids ?? []).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.namePerScript")}</p>
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
                        label={t("editPanel.sensorUnderStatus")}
                        placeholder={t("editPanel.searchSensor")}
                        emptyOption={t("editPanel.none")}
                      />
                    </div>
                  </div>
                    )}
                    {editTab === "weergave" && (
                  <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.icon")}
                      </label>
                      <input
                        type="text"
                        value={vacuumIconSearch}
                        onChange={(e) => setVacuumIconSearch(e.target.value)}
                        onFocus={() => setVacuumIconSearch(vacuumIconSearch || (editForm.icon ?? ""))}
                        placeholder={t("editPanel.iconSearchExample")}
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
                              ? "bg-[#4700B5] text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                          )}
                        >
                          {t("editPanel.noneSparkles")}
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
                                ? "bg-[#4700B5] text-white"
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
                {editFormType === "vacuum_card_2" && (
                  <div className="space-y-3">
                    <EntitySelectWithSearch
                      entities={entities}
                      value={editForm.progress_entity_id ?? ""}
                      onChange={(v) =>
                        setEditForm((prev) => ({
                          ...prev,
                          progress_entity_id: v || undefined,
                        }))
                      }
                      filter={(e) => e.entity_id.startsWith("sensor.")}
                      label={t("editPanel.cleaningProgressSensor")}
                      placeholder={t("editPanel.searchSensor")}
                      emptyOption={t("editPanel.none")}
                    />
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.vacuumImage")}
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        {t("editPanel.vacuumImageHint")}
                      </p>
                      {editForm.background_image ? (
                        <div
                          className="mb-2 h-20 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                          style={{ backgroundImage: cssUrl(editForm.background_image) }}
                        />
                      ) : null}
                      <div className="mb-2 flex gap-2">
                        <label className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10">
                          {uploadingEnergyBg ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              e.target.value = "";
                              setUploadingEnergyBg(true);
                              try {
                                const formData = new FormData();
                                formData.set("file", file);
                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                const json = await res.json();
                                if (!res.ok) throw new Error(json.error || "Upload failed");
                                setEditForm((prev) => ({ ...prev, background_image: json.url }));
                              } finally {
                                setUploadingEnergyBg(false);
                              }
                            }}
                            disabled={uploadingEnergyBg}
                          />
                        </label>
                        {editForm.background_image ? (
                          <button
                            type="button"
                            onClick={() => setEditForm((prev) => ({ ...prev, background_image: undefined }))}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                          >
                            {t("editPanel.remove")}
                          </button>
                        ) : null}
                      </div>
                    </div>
{!isEditingSmartStackChild && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardWidthPx")}
                      </label>
                      <input
                        type="number"
                        min={VACUUM_CARD_2_MIN_WIDTH}
                        max={VACUUM_CARD_2_MAX_WIDTH}
                        step={10}
                        value={editForm.width ?? VACUUM_CARD_2_DEFAULT_WIDTH}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(VACUUM_CARD_2_DEFAULT_WIDTH)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardWidthRange300")}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardHeightPx")}
                      </label>
                      <input
                        type="number"
                        min={VACUUM_CARD_2_MIN_HEIGHT}
                        max={VACUUM_CARD_2_MAX_HEIGHT}
                        step={10}
                        value={editForm.height ?? VACUUM_CARD_2_DEFAULT_HEIGHT}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(VACUUM_CARD_2_DEFAULT_HEIGHT)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardHeightRange330")}</p>
                    </div>
                    </>
                    )}
                  </div>
                )}
                {editFormType === "sensor_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.conditions")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                      <>
                        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                          {t("editPanel.icon")}
                        </label>
                        <input
                          type="text"
                          value={sensorIconSearch}
                          onChange={(e) => setSensorIconSearch(e.target.value)}
                          onFocus={() => setSensorIconSearch(sensorIconSearch || (editForm.icon ?? ""))}
                          placeholder={t("editPanel.iconSearchGauge")}
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
                                ? "bg-[#4700B5] text-white"
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
                                  ? "bg-[#4700B5] text-white"
                                  : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                              )}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3">
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.size")}
                          </label>
                          <select
                            value={editForm.size ?? "md"}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, size: e.target.value }))
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          >
                            <option value="sm">{t("editPanel.sizeSm")}</option>
                            <option value="md">{t("editPanel.sizeMd")}</option>
                            <option value="lg">{t("editPanel.sizeLg")}</option>
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
                            {t("editPanel.showIcon")}
                          </label>
                        </div>
                      </>
                    )}
                    {editTab === "voorwaarden" && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("editPanel.cardColorConditionsHint")}
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
                                  {op === "contains" ? t("editPanel.operatorContains") : (SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op)}
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
                              placeholder={t("editPanel.value")}
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
                              aria-label={t("editPanel.removeCondition")}
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
                          {"+ " + t("editPanel.addCondition")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {editFormType === "pill_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.conditions")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                  <div className="space-y-3">
                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("editPanel.showEntityState")}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={editForm.show_state !== false}
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, show_state: prev.show_state === false }))
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4700B5] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                          editForm.show_state !== false
                            ? "bg-[#4700B5] border-transparent"
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
                      {t("editPanel.showStateHint")}
                    </p>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.icon")}
                      </label>
                      <input
                        type="text"
                        value={pillIconSearch}
                        onChange={(e) => setPillIconSearch(e.target.value)}
                        onFocus={() => setPillIconSearch(pillIconSearch || (editForm.icon ?? ""))}
                        placeholder={t("editPanel.iconSearchPlaceholder")}
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
                              ? "bg-[#4700B5] text-white"
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
                                ? "bg-[#4700B5] text-white"
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
                        {t("editPanel.conditionalColor")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {t("editPanel.pillColorHint")}
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
                                {op === "contains" ? t("editPanel.operatorContains") : (SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op)}
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
                            placeholder={t("editPanel.value")}
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
                            aria-label={t("editPanel.removeCondition")}
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
                        {"+ " + t("editPanel.addCondition")}
                      </button>
                    </div>
                    )}
                  </>
                )}
                {editFormType === "camera_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("editPanel.showTitle")}
                      </label>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={editForm.show_title !== false}
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, show_title: !(prev.show_title !== false) }))
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4700B5] focus:ring-offset-2",
                          editForm.show_title !== false
                            ? "bg-[#4700B5]"
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
                        {t("editPanel.refreshIntervalSeconds")}
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
                    {editTab === "weergave" && !isEditingSmartStackChild && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardWidthPx")}
                      </label>
                      <input
                        type="number"
                        min={CAMERA_CARD_MIN_WIDTH}
                        max={CAMERA_CARD_MAX_WIDTH}
                        step={10}
                        value={editForm.width ?? CAMERA_CARD_DEFAULT_WIDTH}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(CAMERA_CARD_DEFAULT_WIDTH)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        {CAMERA_CARD_MIN_WIDTH}–{CAMERA_CARD_MAX_WIDTH} px
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardHeightPx")}
                      </label>
                      <input
                        type="number"
                        min={CAMERA_CARD_MIN_HEIGHT}
                        max={CAMERA_CARD_MAX_HEIGHT}
                        step={10}
                        value={editForm.height ?? CAMERA_CARD_DEFAULT_HEIGHT}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(CAMERA_CARD_DEFAULT_HEIGHT)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        {CAMERA_CARD_MIN_HEIGHT}–{CAMERA_CARD_MAX_HEIGHT} px
                      </p>
                    </div>
                    </>
                    )}
                    {editTab === "weergave" && isEditingSmartStackChild && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.smartStackChildSizeLocked")}</p>
                    )}
                  </>
                )}
                {editFormType === "teamtracker_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                      <div className="space-y-3">
                        {(
                          [
                            ["show_team_names", "editPanel.showTeamNames"],
                            ["show_form", "editPanel.showForm"],
                            ["show_progress", "editPanel.showProgressBar"],
                          ] as const
                        ).map(([key, labelKey]) => {
                          const on = editForm[key] !== false;
                          return (
                            <div key={key} className="flex items-center justify-between gap-3">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t(labelKey)}
                              </label>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={on}
                                onClick={() =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    [key]: !(prev[key] !== false),
                                  }))
                                }
                                className={cn(
                                  "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4700B5] focus:ring-offset-2",
                                  on ? "bg-[#4700B5]" : "bg-gray-200 dark:bg-gray-600"
                                )}
                              >
                                <span
                                  className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
                                    on ? "translate-x-5" : "translate-x-1"
                                  )}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {editTab === "weergave" && !isEditingSmartStackChild && (
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.cardWidthPx")}
                          </label>
                          <input
                            type="number"
                            min={TEAMTRACKER_CARD_MIN_WIDTH}
                            max={TEAMTRACKER_CARD_MAX_WIDTH}
                            step={10}
                            value={editForm.width ?? TEAMTRACKER_CARD_DEFAULT_WIDTH}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({
                                ...prev,
                                width: v != null && !Number.isNaN(v) ? v : undefined,
                              }));
                            }}
                            placeholder={String(TEAMTRACKER_CARD_DEFAULT_WIDTH)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            {TEAMTRACKER_CARD_MIN_WIDTH}–{TEAMTRACKER_CARD_MAX_WIDTH} px
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.cardHeightPx")}
                          </label>
                          <input
                            type="number"
                            min={TEAMTRACKER_CARD_MIN_HEIGHT}
                            max={TEAMTRACKER_CARD_MAX_HEIGHT}
                            step={10}
                            value={editForm.height ?? TEAMTRACKER_CARD_DEFAULT_HEIGHT}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({
                                ...prev,
                                height: v != null && !Number.isNaN(v) ? v : undefined,
                              }));
                            }}
                            placeholder={String(TEAMTRACKER_CARD_DEFAULT_HEIGHT)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            {TEAMTRACKER_CARD_MIN_HEIGHT}–{TEAMTRACKER_CARD_MAX_HEIGHT} px
                          </p>
                        </div>
                      </div>
                    )}
                    {editTab === "weergave" && isEditingSmartStackChild && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.smartStackChildSizeLocked")}</p>
                    )}
                  </>
                )}
                {editFormType === "weather_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                        {t("editPanel.weatherDetails")}
                      </p>
                      {(
                        [
                          ["show_icon", "editPanel.showIcon", true],
                          ["show_condition", "editPanel.showCondition", true],
                          ["show_high_low", "editPanel.showHighLow", true],
                          ["show_wind", "editPanel.showWind", true],
                          ["show_humidity", "editPanel.showHumidity", true],
                          ["show_air_quality", "editPanel.showAirQuality", false],
                          ["show_precipitation", "editPanel.showPrecipitation", true],
                        ] as const
                      ).map(([key, labelKey, defaultOn]) => {
                        const checked =
                          defaultOn ? editForm[key] !== false : editForm[key] === true;
                        return (
                          <div key={key} className="flex items-center justify-between gap-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t(labelKey)}
                            </label>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={checked}
                              onClick={() =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  [key]: defaultOn ? !(prev[key] !== false) : !(prev[key] === true),
                                }))
                              }
                              className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4700B5] focus:ring-offset-2",
                                checked ? "bg-[#4700B5]" : "bg-gray-200 dark:bg-gray-600"
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
                                  checked ? "translate-x-5" : "translate-x-1"
                                )}
                              />
                            </button>
                          </div>
                        );
                      })}
                      {editForm.show_air_quality === true && (
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.airQualityEntity")}
                          </label>
                          <EntitySelectWithSearch
                            value={editForm.air_quality_entity_id ?? ""}
                            onChange={(v) => setEditForm((prev) => ({ ...prev, air_quality_entity_id: v }))}
                            entities={entities.filter(
                              (e) =>
                                e.entity_id.startsWith("sensor.") ||
                                e.entity_id.startsWith("air_quality.")
                            )}
                            placeholder={t("editPanel.entityPlaceholder")}
                            emptyOption={t("editPanel.none")}
                          />
                          <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                            {t("editPanel.airQualityEntityHint")}
                          </p>
                        </div>
                      )}
                    </div>
                    )}
                    {editTab === "weergave" && !isEditingSmartStackChild && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardWidthPx")}
                      </label>
                      <input
                        type="number"
                        min={WEATHER_CARD_MIN_WIDTH}
                        max={WEATHER_CARD_MAX_WIDTH}
                        step={10}
                        value={editForm.width ?? WEATHER_CARD_DEFAULT_WIDTH}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            width: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(WEATHER_CARD_DEFAULT_WIDTH)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardWidthRange320")}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.cardHeightPx")}
                      </label>
                      <input
                        type="number"
                        min={WEATHER_CARD_MIN_HEIGHT}
                        max={WEATHER_CARD_MAX_HEIGHT}
                        step={10}
                        value={editForm.height ?? WEATHER_CARD_DEFAULT_HEIGHT}
                        onChange={(e) => {
                          const v = e.target.value === "" ? undefined : Number(e.target.value);
                          setEditForm((prev) => ({
                            ...prev,
                            height: v != null && !Number.isNaN(v) ? v : undefined,
                          }));
                        }}
                        placeholder={String(WEATHER_CARD_DEFAULT_HEIGHT)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                      />
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.cardHeightRange180")}</p>
                    </div>
                    </>
                    )}
                    {editTab === "weergave" && isEditingSmartStackChild && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.smartStackChildSizeLocked")}</p>
                    )}
                  </>
                )}
                {editFormType === "chore_card" && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("widget.chore_card.childId")}
                      </label>
                      <select
                        value={editForm.child_id ?? ""}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, child_id: e.target.value || null }))}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                      >
                        <option value="">{t("widget.chore_card.allChildren")}</option>
                        {choreChildren.map((c) => (
                          <option key={c.id} value={c.id}>{c.emoji ? `${c.emoji} ` : ""}{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("widget.chore_card.showPoints")}
                      </label>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={editForm.show_chore_points !== false}
                        onClick={() => setEditForm((prev) => ({ ...prev, show_chore_points: !(prev.show_chore_points !== false) }))}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4700B5] focus:ring-offset-2",
                          editForm.show_chore_points !== false ? "bg-[#4700B5]" : "bg-gray-200 dark:bg-gray-600"
                        )}
                      >
                        <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition", editForm.show_chore_points !== false ? "translate-x-5" : "translate-x-1")} />
                      </button>
                    </div>
                  </div>
                )}
                {editFormType === "calendar_card" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("editPanel.showUpcoming")}
                      </label>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={editForm.show_upcoming !== false}
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            show_upcoming: !(prev.show_upcoming !== false),
                          }))
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4700B5] focus:ring-offset-2",
                          editForm.show_upcoming !== false ? "bg-[#4700B5]" : "bg-gray-200 dark:bg-gray-600"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
                            editForm.show_upcoming !== false ? "translate-x-5" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                    {!isEditingSmartStackChild ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.widthPx")}
                          </label>
                          <input
                            type="number"
                            min={CALENDAR_CARD_MIN_WIDTH}
                            max={CALENDAR_CARD_MAX_WIDTH}
                            step={10}
                            value={editForm.width ?? CALENDAR_CARD_DEFAULT_WIDTH}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({
                                ...prev,
                                width: v != null && !Number.isNaN(v) ? v : undefined,
                              }));
                            }}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.heightPx")}
                          </label>
                          <input
                            type="number"
                            min={CALENDAR_CARD_MIN_HEIGHT}
                            max={CALENDAR_CARD_MAX_HEIGHT}
                            step={10}
                            value={editForm.height ?? CALENDAR_CARD_DEFAULT_HEIGHT}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({
                                ...prev,
                                height: v != null && !Number.isNaN(v) ? v : undefined,
                              }));
                            }}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.smartStackChildSizeLocked")}</p>
                    )}
                  </div>
                )}
                {editFormType === "trash_card" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("trashCard.dateEntity")}
                      </label>
                      <EntitySelectWithSearch
                        value={editForm.date_entity_id ?? ""}
                        onChange={(v) => setEditForm((prev) => ({ ...prev, date_entity_id: v }))}
                        entities={entities.filter((e) => e.entity_id.startsWith("sensor."))}
                        placeholder={t("editPanel.entityPlaceholder")}
                        emptyOption={t("editPanel.none")}
                      />
                      <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{t("trashCard.dateEntityHint")}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("trashCard.daysEntity")}
                      </label>
                      {(() => {
                        const liveStates = useEntityStateStore.getState().states;
                        const snapshots =
                          Object.keys(liveStates).length > 0
                            ? Object.values(liveStates).map((e) => ({
                                entity_id: e.entity_id,
                                state: e.state,
                                attributes: e.attributes,
                              }))
                            : entities.map((e) => ({
                                entity_id: e.entity_id,
                                state: (e as { state?: string }).state ?? null,
                                attributes: e.attributes,
                              }));
                        const autoDaysId = discoverTrashDaysUntilEntity(snapshots) ?? "";
                        const override = (editForm.days_entity_id ?? "").trim();
                        return (
                          <>
                            <EntitySelectWithSearch
                              value={override}
                              onChange={(v) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  days_entity_id: !v || v === autoDaysId ? "" : v,
                                }))
                              }
                              entities={entities.filter((e) => e.entity_id.startsWith("sensor."))}
                              placeholder={t("editPanel.entityPlaceholder")}
                              emptyOption={
                                autoDaysId
                                  ? t("trashCard.daysEntityAuto").replace("{id}", autoDaysId)
                                  : t("editPanel.none")
                              }
                            />
                            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                              {t("trashCard.daysEntityHint")}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                    <div className="space-y-3 rounded-lg border border-gray-200/80 bg-gray-50/70 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {t("trashCard.fractionEntities")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                          {t("trashCard.fractionEntitiesHint")}
                        </p>
                      </div>
                      {(() => {
                        const liveStates = useEntityStateStore.getState().states;
                        const discovered = discoverTrashFractionEntities(
                          Object.keys(liveStates).length > 0
                            ? Object.values(liveStates).map((e) => ({
                                entity_id: e.entity_id,
                                state: e.state,
                                attributes: e.attributes,
                              }))
                            : entities.map((e) => ({
                                entity_id: e.entity_id,
                                state: (e as { state?: string }).state ?? null,
                                attributes: e.attributes,
                              }))
                        );
                        const overrides = normalizeTrashFractionEntityIds(editForm.fraction_entity_ids) ?? {};
                        const resolved = mergeTrashFractionEntities(discovered, overrides);
                        const sensorEntities = entities.filter((e) => e.entity_id.startsWith("sensor."));
                        return TRASH_THEMES.map((theme) => {
                          const override = overrides[theme] ?? "";
                          const autoId = discovered[theme] ?? "";
                          // Empty value = auto-discovery; closed select shows the discovered id in the label.
                          const value = override;
                          const isManual = Boolean(override);
                          return (
                            <div key={theme}>
                              <EntitySelectWithSearch
                                label={t(`trashCard.theme.${theme}`)}
                                value={value}
                                onChange={(v) => {
                                  setEditForm((prev) => {
                                    const next: TrashFractionEntityIds = {
                                      ...(normalizeTrashFractionEntityIds(prev.fraction_entity_ids) ?? {}),
                                    };
                                    if (!v || v === autoId) {
                                      delete next[theme as TrashTheme];
                                    } else {
                                      next[theme as TrashTheme] = v;
                                    }
                                    return {
                                      ...prev,
                                      fraction_entity_ids: normalizeTrashFractionEntityIds(next) ?? {},
                                    };
                                  });
                                }}
                                entities={sensorEntities}
                                placeholder={t("editPanel.entityPlaceholder")}
                                emptyOption={
                                  autoId
                                    ? t("trashCard.fractionAuto").replace("{id}", autoId)
                                    : t("editPanel.none")
                                }
                              />
                              <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                                {isManual
                                  ? t("trashCard.fractionManual")
                                  : autoId
                                    ? t("trashCard.fractionUsingAuto").replace("{id}", resolved[theme] ?? autoId)
                                    : t("trashCard.fractionMissing")}
                              </p>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    {!isEditingSmartStackChild ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.widthPx")}
                          </label>
                          <input
                            type="number"
                            min={TRASH_CARD_MIN_WIDTH}
                            max={TRASH_CARD_MAX_WIDTH}
                            step={10}
                            value={editForm.width ?? TRASH_CARD_DEFAULT_WIDTH}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({
                                ...prev,
                                width: v != null && !Number.isNaN(v) ? v : undefined,
                              }));
                            }}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t("editPanel.heightPx")}
                          </label>
                          <input
                            type="number"
                            min={TRASH_CARD_MIN_HEIGHT}
                            max={TRASH_CARD_MAX_HEIGHT}
                            step={10}
                            value={editForm.height ?? TRASH_CARD_DEFAULT_HEIGHT}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({
                                ...prev,
                                height: v != null && !Number.isNaN(v) ? v : undefined,
                              }));
                            }}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.smartStackChildSizeLocked")}</p>
                    )}
                  </>
                )}
                {editFormType === "nuts_card" && (
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
                          {tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}
                        </button>
                      ))}
                    </div>
                    {editTab === "algemeen" && (
                    <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.nutsAccent")}
                      </label>
                      <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5">
                        {([
                          { id: "consumption" as const, label: t("editPanel.nutsAccentConsumption") },
                          { id: "production" as const, label: t("editPanel.nutsAccentProduction") },
                        ]).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setEditForm((prev) => ({
                                ...prev,
                                accent: opt.id,
                                icon:
                                  prev.icon && prev.icon !== "Zap" && prev.icon !== "Leaf" && prev.icon !== "Fuel"
                                    ? prev.icon
                                    : opt.id === "production"
                                      ? "Leaf"
                                      : "Zap",
                              }))
                            }
                            className={cn(
                              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                              (editForm.accent ?? "consumption") === opt.id
                                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.nutsAccentHint")}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.nutsPeriod")}
                      </label>
                      <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5">
                        {([
                          { id: "week" as const, label: t("editPanel.nutsPeriodWeek") },
                          { id: "month" as const, label: t("editPanel.nutsPeriodMonth") },
                        ]).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setEditForm((prev) => ({
                                ...prev,
                                period: opt.id,
                              }))
                            }
                            className={cn(
                              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                              normalizeNutsPeriod(editForm.period) === opt.id
                                ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.nutsPeriodHint")}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.icon")}
                      </label>
                      <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5 max-h-32 overflow-auto">
                        {(["Zap", "Leaf", "Sun", "Fuel", "Droplets", "Gauge"].filter((n) => CARD_ICON_OPTIONS.includes(n)) as string[]).map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() =>
                              setEditForm((prev) => ({ ...prev, icon: name }))
                            }
                            className={cn(
                              "rounded-md px-2 py-1 text-xs",
                              (editForm.icon ?? ((editForm.accent ?? "consumption") === "production" ? "Leaf" : "Zap")) === name
                                ? "bg-[#4700B5] text-white"
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
                        {t("editPanel.iconColor")}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editForm.icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(editForm.icon_background_color) ? editForm.icon_background_color : ((editForm.accent ?? "consumption") === "production" ? "#3DDC97" : "#F5C518")}
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
                          value={editForm.icon_background_color ?? ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              icon_background_color: e.target.value || undefined,
                            }))
                          }
                          placeholder="#F5C518"
                          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    <EntitySelectWithSearch
                      entities={entities}
                      value={editForm.entity_id ?? ""}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))}
                      filter={(e) => e.entity_id.startsWith("sensor.")}
                      label={t("editPanel.nutsDailyEntity")}
                      placeholder={t("editPanel.searchSensor")}
                      emptyOption={t("editPanel.chooseEntityEllipsis")}
                    />
                    <EntitySelectWithSearch
                      entities={entities}
                      value={editForm.today_entity_id || editForm.current_entity_id || ""}
                      onChange={(v) =>
                        setEditForm((prev) => ({ ...prev, today_entity_id: v || undefined, current_entity_id: undefined }))
                      }
                      filter={(e) => e.entity_id.startsWith("sensor.")}
                      label={t("editPanel.nutsTodayEntity")}
                      placeholder={t("editPanel.searchSensor")}
                      emptyOption={t("editPanel.noneShowsZero")}
                    />
                    </>
                    )}
                    {editTab === "weergave" && !isEditingSmartStackChild && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t("editPanel.widthHeightPx")}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="number"
                            min={NUTS_CARD_MIN_WIDTH}
                            max={NUTS_CARD_MAX_WIDTH}
                            step={10}
                            value={editForm.width ?? NUTS_CARD_DEFAULT_WIDTH}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder={String(NUTS_CARD_DEFAULT_WIDTH)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.width")}</p>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            min={NUTS_CARD_MIN_HEIGHT}
                            max={NUTS_CARD_MAX_HEIGHT}
                            step={10}
                            value={editForm.height ?? NUTS_CARD_DEFAULT_HEIGHT}
                            onChange={(e) => {
                              const v = e.target.value === "" ? undefined : Number(e.target.value);
                              setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined }));
                            }}
                            placeholder={String(NUTS_CARD_DEFAULT_HEIGHT)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                          />
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{t("editPanel.height")}</p>
                        </div>
                      </div>
                    </div>
                    )}
                    {editTab === "weergave" && isEditingSmartStackChild && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t("editPanel.smartStackChildSizeLocked")}</p>
                    )}
                  </>
                )}
                </>
                )
              }
              </div>
              <div className="flex min-h-[220px] flex-1 flex-col bg-gray-50 p-5 dark:bg-black/40 md:min-h-0">
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-zinc-400">
                  {t("editPanel.preview")}
                </p>
                <p className="mb-4 text-xs text-gray-400 dark:text-zinc-500">{t("editPanel.previewHint")}</p>
                <div className="flex flex-1 items-center justify-center overflow-auto rounded-xl border border-dashed border-gray-200 bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2f7)] p-4 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#09090b)]">
                  {isEditingSmartStackChild && editingStackChild ? (
                    <div
                      className="overflow-hidden rounded-2xl"
                      style={{
                        width: clampSmartStackWidth(editingWidget.width ?? SMART_STACK_DEFAULT_WIDTH),
                        height: clampSmartStackHeight(editingWidget.height ?? SMART_STACK_DEFAULT_HEIGHT),
                        maxWidth: "100%",
                      }}
                    >
                      <SmartStackChild
                        child={{
                          ...editingStackChild,
                          ...stripSmartStackChildSize(
                            buildSmartStackChildUpdates(editingStackChild.type, editForm)
                          ),
                          id: editingStackChild.id,
                          type: editingStackChild.type,
                        }}
                        width={clampSmartStackWidth(editingWidget.width ?? SMART_STACK_DEFAULT_WIDTH)}
                        height={clampSmartStackHeight(editingWidget.height ?? SMART_STACK_DEFAULT_HEIGHT)}
                      />
                    </div>
                  ) : !editForm.entity_id &&
                  (editingWidget.type === "teamtracker_card" ||
                    editingWidget.type === "climate_card" ||
                    editingWidget.type === "climate_card_2" ||
                    editingWidget.type === "vacuum_card" ||
                    editingWidget.type === "vacuum_card_2") ? (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      {t("editPanel.previewEmpty")}
                    </p>
                  ) : editingWidget.type === "teamtracker_card" ? (
                    <div
                      className="w-full max-w-full"
                      style={{
                        width: clampTeamtrackerCardWidth(editForm.width ?? TEAMTRACKER_CARD_DEFAULT_WIDTH),
                        height: clampTeamtrackerCardHeight(editForm.height ?? TEAMTRACKER_CARD_DEFAULT_HEIGHT),
                        maxWidth: "100%",
                      }}
                    >
                      <TeamtrackerCardWidget
                        title={editForm.title || t("cardType.teamtracker_card")}
                        entity_id={editForm.entity_id}
                        show_team_names={editForm.show_team_names}
                        show_form={editForm.show_form}
                        show_progress={editForm.show_progress}
                        className="h-full min-h-0"
                      />
                    </div>
                  ) : editingWidget.type === "climate_card" || editingWidget.type === "climate_card_2" ? (
                    <ClimateCard2Widget
                      title={editForm.title || t("cardType.climate_card_2")}
                      entity_id={editForm.entity_id}
                      humidity_entity_id={editForm.humidity_entity_id}
                      display_mode={editForm.display_mode}
                      icon={editForm.icon}
                      width={clampClimateCardWidth(editForm.width ?? CLIMATE_CARD_DEFAULT_WIDTH)}
                      height={clampClimateCardHeight(editForm.height ?? CLIMATE_CARD_DEFAULT_HEIGHT)}
                    />
                  ) : editingWidget.type === "vacuum_card_2" ? (
                    <VacuumCard2Widget
                      title={editForm.title || t("cardType.vacuum_card_2")}
                      entity_id={editForm.entity_id}
                      progress_entity_id={editForm.progress_entity_id}
                      background_image={editForm.background_image}
                      width={clampVacuumCard2Width(editForm.width ?? VACUUM_CARD_2_DEFAULT_WIDTH)}
                      height={clampVacuumCard2Height(editForm.height ?? VACUUM_CARD_2_DEFAULT_HEIGHT)}
                    />
                  ) : editingWidget.type === "vacuum_card" ? (
                    <VacuumCardWidget
                      title={editForm.title || t("cardType.vacuum_card")}
                      entity_id={editForm.entity_id}
                      script_ids={editForm.script_ids}
                      script_names={editForm.script_names}
                      cleaned_area_entity_id={editForm.cleaned_area_entity_id}
                      icon={editForm.icon}
                    />
                  ) : editingWidget.type === "nuts_card" ? (
                    <div
                      style={{
                        width: clampNutsCardWidth(editForm.width ?? NUTS_CARD_DEFAULT_WIDTH),
                        height: clampNutsCardHeight(editForm.height ?? NUTS_CARD_DEFAULT_HEIGHT),
                        maxWidth: "100%",
                      }}
                    >
                      <NutsCardWidget
                        title={editForm.title || t("cardType.nuts_card")}
                        entity_id={editForm.entity_id}
                        today_entity_id={editForm.today_entity_id || editForm.current_entity_id}
                        icon={editForm.icon}
                        icon_background_color={editForm.icon_background_color}
                        accent={normalizeNutsAccent(editForm.accent)}
                        period={normalizeNutsPeriod(editForm.period)}
                        width={clampNutsCardWidth(editForm.width ?? NUTS_CARD_DEFAULT_WIDTH)}
                        height={clampNutsCardHeight(editForm.height ?? NUTS_CARD_DEFAULT_HEIGHT)}
                        className="h-full"
                      />
                    </div>
                  ) : editingWidget.type === "trash_card" ? (
                    <div
                      style={{
                        width: clampTrashCardWidth(editForm.width ?? TRASH_CARD_DEFAULT_WIDTH),
                        height: clampTrashCardHeight(editForm.height ?? TRASH_CARD_DEFAULT_HEIGHT),
                        maxWidth: "100%",
                      }}
                    >
                      <TrashCardWidget
                        title={editForm.title || t("cardType.trash_card")}
                        entity_id={editForm.entity_id}
                        date_entity_id={editForm.date_entity_id}
                        days_entity_id={editForm.days_entity_id}
                        fraction_entity_ids={editForm.fraction_entity_ids}
                        width={clampTrashCardWidth(editForm.width ?? TRASH_CARD_DEFAULT_WIDTH)}
                        height={clampTrashCardHeight(editForm.height ?? TRASH_CARD_DEFAULT_HEIGHT)}
                        className="h-full"
                      />
                    </div>
                  ) : editingWidget.type === "smart_stack" ? (
                    <SmartStackWidget
                      title={editForm.title || t("cardType.smart_stack")}
                      slides={editingWidget.children ?? []}
                      interval_seconds={editForm.interval_seconds}
                      autoplay={editForm.autoplay}
                      width={clampSmartStackWidth(editForm.width ?? SMART_STACK_DEFAULT_WIDTH)}
                      height={clampSmartStackHeight(editForm.height ?? SMART_STACK_DEFAULT_HEIGHT)}
                      paused
                    />
                  ) : editingWidget.type === "stat_pill_card" ? (
                    <StatPillCardWidget
                      title={editForm.title || t("cardType.stat_pill_card")}
                      entity_id={editForm.entity_id}
                      label={editForm.label}
                      icon={editForm.icon || "sun"}
                      color={(editForm.color as "amber" | "purple" | "emerald" | "red") ?? "amber"}
                      conditions={editForm.conditions as SensorCondition[] | undefined}
                    />
                  ) : (
                    <div className="max-w-xs text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {editForm.title || editingWidget.type.replace(/_/g, " ")}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {editingWidget.type}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              </div>
                <div className="flex shrink-0 justify-between gap-2 border-t border-gray-200 bg-white p-5 pb-6 pt-4 dark:border-white/10 dark:bg-zinc-950">
                  {editingWidget.type === "smart_stack" && editingGroupChildId ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingGroupChildId(null)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        {t("editPanel.back")}
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const nextChildren = (editingWidget.children ?? []).filter((c) => c.id !== editingGroupChildId);
                            const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                            setWidgets(nextWidgets);
                            setEditingGroupChildId(null);
                            mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label={t("editPanel.removeCardFromStack")}
                        >
                          {t("editPanel.remove")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const child = (editingWidget.children ?? []).find((c) => c.id === editingGroupChildId);
                            if (!child) return;
                            const updates = stripSmartStackChildSize(
                              buildSmartStackChildUpdates(child.type, editForm)
                            );
                            const nextChildren = (editingWidget.children ?? []).map((c) =>
                              c.id === editingGroupChildId
                                ? ({ ...c, ...updates, width: undefined, height: undefined } as WidgetConfig)
                                : c
                            );
                            const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                            setWidgets(nextWidgets);
                            setEditingGroupChildId(null);
                            mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className="rounded-lg bg-[#4700B5] px-3 py-1.5 text-sm text-white hover:opacity-90"
                        >
                          {t("editPanel.save")}
                        </button>
                      </div>
                    </>
                  ) : editingWidget.type === "card_group" && editingGroupChildId ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingGroupChildId(null)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        {t("editPanel.back")}
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const nextChildren = (editingWidget.children ?? []).filter((c) => c.id !== editingGroupChildId);
                            const nextWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, children: nextChildren } : w));
                            setWidgets(nextWidgets);
                            setEditingGroupChildId(null);
                            mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label={t("editPanel.removeCardFromGroup")}
                        >
                          {t("editPanel.remove")}
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
                              mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                            }
                          }}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                          aria-label={t("editPanel.duplicateCardInGroup")}
                        >
                          {t("editPanel.duplicate")}
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
                            mutateDashboard({ layout, widgets: nextWidgets, welcomeTitle, welcomeSubtitle });
                          }}
                          className="rounded-lg bg-[#4700B5] px-3 py-1.5 text-sm text-white hover:opacity-90"
                        >
                          {t("editPanel.save")}
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
                          mutateDashboard({
                            layout: newLayout,
                            widgets: newWidgets,
                            welcomeTitle,
                            welcomeSubtitle,
                          });
                        }}
                        className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label={t("editPanel.removeCardGroup")}
                      >
                        {t("editPanel.remove")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleDuplicateTile(editingWidgetId!);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                        aria-label={t("editPanel.duplicateCardGroup")}
                      >
                        {t("editPanel.duplicate")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingWidgetId(null)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        {t("editPanel.cancel")}
                      </button>
                    </>
                  ) : (
                    <>
                  {!addingTile && (
                  <button
                    type="button"
                    onClick={() => {
                      const newWidgets = widgets.filter((w) => w.id !== editingWidgetId);
                      const newLayout = layout.filter((item) => item.i !== editingWidgetId);
                      setWidgets(newWidgets);
                      setLayout(newLayout);
                      setEditingWidgetId(null);
                      mutateDashboard({
                        layout: newLayout,
                        widgets: newWidgets,
                        welcomeTitle,
                        welcomeSubtitle,
                      });
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label={t("editPanel.removeCard")}
                  >
                    {t("editPanel.remove")}
                  </button>
                  )}
                  <div className={cn("flex gap-2", addingTile && "ml-auto")}>
                  <button
                    type="button"
                    onClick={() => {
                      if (addingTile) {
                        backAddTileHistory();
                        return;
                      }
                      setEditingWidgetId(null);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300"
                  >
                    {t("editPanel.cancel")}
                  </button>
                  {!addingTile && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDuplicateTile(editingWidgetId!);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    aria-label={t("editPanel.duplicateCard")}
                  >
                    {t("editPanel.duplicate")}
                  </button>
                  )}
                      <button
                    type="button"
                    onClick={() => {
                      const wasAdding =
                        addingTile &&
                        editingWidgetId != null &&
                        planConfirmPendingAdd(widgets, editingWidgetId).persist;
                      let placementKey: string | undefined;
                      if (wasAdding && editingWidgetId) {
                        placementKey = finishAddedTile(editingWidget.type, editingWidgetId);
                      }
                      const isCategoryCard = editingWidget.type === "text_card" || editingWidget.type === "title_card" || editingWidget.type === "title_only_card" || editingWidget.type === "subtitle_card";
                      const newWelcomeTitle = welcomeTitle;
                      const newWelcomeSubtitle = welcomeSubtitle;
                      const updates = isCategoryCard ? {
                        title: editForm.title,
                        textMode: editForm.textMode ?? "title",
                        show_icon: editForm.show_icon ?? false,
                        icon: editForm.icon ?? "Type",
                        page: clampPageIndex(editForm.page ?? 0, pageCount),
                        ...(editingWidget.type === "text_card" && {
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          entity_id: editForm.entity_id || undefined,
                        }),
                      } : {
                        title: editForm.title,
                        page: clampPageIndex(editForm.page ?? 0, pageCount),
                        ...(editingWidget.entity_id != null && editingWidget.type !== "energy_monitor_card" && editingWidget.type !== "power_usage_card" && {
                          entity_id: editForm.entity_id,
                        }),
                        ...(editingWidget.type === "solar_card" && {
                          yield_entity_id_today: editForm.yield_entity_id_today || undefined,
                          yield_entity_id_month: editForm.yield_entity_id_month || undefined,
                        }),
                        ...(editingWidget.type === "energy_monitor_card" && {
                          entity_id: editForm.entity_id || undefined,
                          background_image: editForm.background_image || undefined,
                          background_image_dark: editForm.background_image_dark || undefined,
                          image_conditions: (editForm.image_conditions ?? []).filter((c) => c.image?.trim()).length > 0
                            ? (editForm.image_conditions ?? []).filter((c) => c.image?.trim())
                            : undefined,
                          minimal: true,
                          width: clampEnergyMonitorCardWidth(editForm.width ?? ENERGY_MONITOR_CARD_DEFAULT_WIDTH),
                          height: clampEnergyMonitorCardHeight(editForm.height ?? ENERGY_MONITOR_CARD_DEFAULT_HEIGHT),
                        }),
                        ...(editingWidget.type === "power_usage_card" && {
                          entity_id: editForm.entity_id || undefined,
                          cost_per_kwh: editForm.cost_per_kwh != null && editForm.cost_per_kwh > 0 ? editForm.cost_per_kwh : undefined,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
                        }),
                        ...(editingWidget.type === "device_consumption_card" && {
                          device_entity_ids: (editForm.device_entity_ids ?? []).length > 0 ? editForm.device_entity_ids : undefined,
                          device_names: Object.values(editForm.device_names ?? {}).some((v) => v?.trim()) ? editForm.device_names : undefined,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
                        }),
                        ...(editingWidget.type === "stat_pill_card" && {
                          label: editForm.label || undefined,
                          icon: editForm.icon || undefined,
                          color: editForm.color || undefined,
                          conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined,
                        }),
                        ...((editingWidget.type === "climate_card_2" || editingWidget.type === "climate_card") && {
                          humidity_entity_id: editForm.humidity_entity_id || undefined,
                          display_mode: normalizeClimateDisplayMode(editForm.display_mode),
                          icon: editForm.icon || undefined,
                          width: editForm.width != null && editForm.width > 0 ? clampClimateCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampClimateCardHeight(editForm.height) : undefined,
                        }),
                        ...(editingWidget.type === "light_card" && {
                          icon: editForm.icon || undefined,
                          card_layout: editForm.card_layout === "square" ? "square" : "horizontal",
                        }),
                        ...(editingWidget.type === "media_card" && {
                          width: editForm.width != null && editForm.width > 0 ? clampMediaCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampMediaCardHeight(editForm.height) : undefined,
                        }),
                        ...(editingWidget.type === "weather_card" && {
                          show_icon: editForm.show_icon !== false,
                          show_condition: editForm.show_condition !== false,
                          show_high_low: editForm.show_high_low !== false,
                          show_wind: editForm.show_wind !== false,
                          show_humidity: editForm.show_humidity !== false,
                          show_air_quality: editForm.show_air_quality === true,
                          show_precipitation: editForm.show_precipitation !== false,
                          air_quality_entity_id: editForm.air_quality_entity_id || undefined,
                          width: editForm.width != null && editForm.width > 0 ? clampWeatherCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampWeatherCardHeight(editForm.height) : undefined,
                        }),
                        ...(editingWidget.type === "camera_card" && {
                          refresh: editForm.refresh ?? 10,
                          show_title: editForm.show_title !== false,
                          width: editForm.width != null && editForm.width > 0 ? clampCameraCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampCameraCardHeight(editForm.height) : undefined,
                        }),
                        ...(editingWidget.type === "teamtracker_card" && {
                          width: editForm.width != null && editForm.width > 0 ? clampTeamtrackerCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampTeamtrackerCardHeight(editForm.height) : undefined,
                          show_team_names: editForm.show_team_names !== false,
                          show_form: editForm.show_form !== false,
                          show_progress: editForm.show_progress !== false,
                        }),
                        ...(editingWidget.type === "vacuum_card" && {
                          script_ids: editForm.script_ids ?? [],
                          script_names: editForm.script_names ?? {},
                          cleaned_area_entity_id: editForm.cleaned_area_entity_id || undefined,
                          icon: editForm.icon || undefined,
                        }),
                        ...(editingWidget.type === "vacuum_card_2" && {
                          progress_entity_id: editForm.progress_entity_id || undefined,
                          background_image: editForm.background_image || undefined,
                          width: editForm.width != null && editForm.width > 0 ? clampVacuumCard2Width(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampVacuumCard2Height(editForm.height) : undefined,
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
                          today_entity_id: editForm.today_entity_id || undefined,
                          current_entity_id: undefined,
                          accent: normalizeNutsAccent(editForm.accent),
                          period: normalizeNutsPeriod(editForm.period),
                          width: editForm.width != null && editForm.width > 0 ? clampNutsCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampNutsCardHeight(editForm.height) : undefined,
                        }),
                        ...(editingWidget.type === "smart_stack" && {
                          title: editForm.title,
                          interval_seconds: clampSmartStackIntervalSec(
                            editForm.interval_seconds ?? SMART_STACK_DEFAULT_INTERVAL_SEC
                          ),
                          autoplay: isSmartStackAutoplayEnabled(editForm.autoplay),
                          width:
                            editForm.width != null && editForm.width > 0
                              ? clampSmartStackWidth(editForm.width)
                              : SMART_STACK_DEFAULT_WIDTH,
                          height:
                            editForm.height != null && editForm.height > 0
                              ? clampSmartStackHeight(editForm.height)
                              : SMART_STACK_DEFAULT_HEIGHT,
                        }),
                        ...(editingWidget.type === "room_card" && {
                          icon: editForm.icon || undefined,
                          entity_id: editForm.entity_id || undefined,
                          light_entity_id: editForm.light_entity_id || undefined,
                          media_player_entity_id: editForm.media_player_entity_id || undefined,
                          climate_entity_id: editForm.climate_entity_id || undefined,
                          area_id: editForm.area_id || undefined,
                          background_image: editForm.background_image || undefined,
                          icon_background_color: editForm.icon_background_color || undefined,
                          width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                          height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined,
                        }),
                        ...(editingWidget.type === "calendar_card" && {
                          show_upcoming: isCalendarShowUpcoming(editForm.show_upcoming),
                          width: editForm.width != null && editForm.width > 0 ? clampCalendarCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampCalendarCardHeight(editForm.height) : undefined,
                        }),
                        ...(editingWidget.type === "trash_card" && {
                          entity_id: editForm.entity_id || "",
                          date_entity_id: editForm.date_entity_id || undefined,
                          days_entity_id: editForm.days_entity_id || undefined,
                          fraction_entity_ids: normalizeTrashFractionEntityIds(editForm.fraction_entity_ids),
                          width: editForm.width != null && editForm.width > 0 ? clampTrashCardWidth(editForm.width) : undefined,
                          height: editForm.height != null && editForm.height > 0 ? clampTrashCardHeight(editForm.height) : undefined,
                        }),
                        ...(editingWidget.type === "chore_card" && {
                          child_id: editForm.child_id ?? null,
                          show_chore_points: editForm.show_chore_points !== false,
                        }),
                      };
                      handleUpdateTile(editingWidgetId, updates);
                      const newWidgets: WidgetConfig[] = widgets.map((w) =>
                        w.id === editingWidgetId ? ({ ...w, ...updates } as WidgetConfig) : w
                      );
                      if (typeof updates.page === "number") {
                        setDashboardPage(clampPageIndex(updates.page, pageCount));
                      }
                      mutateDashboard({
                        layout,
                        widgets: newWidgets,
                        welcomeTitle: newWelcomeTitle,
                        welcomeSubtitle: newWelcomeSubtitle,
                        commit: wasAdding,
                        placementKey,
                      });
                      setEditingWidgetId(null);
                    }}
                    className={
                      addingTile
                        ? "inline-flex h-12 items-center rounded-xl bg-[#4700B5] px-4 text-[15px] font-semibold text-white hover:opacity-90 dark:bg-[#8357be]"
                        : "rounded-lg bg-[#4700B5] px-3 py-1.5 text-sm text-white hover:opacity-90"
                    }
                  >
                    {addingTile ? t("editPanel.add") : t("editPanel.save")}
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
                modal_cards: (() => {
                  const w = widgets.find((x) => x.id === clickedCardForDefinition.widgetId);
                  if (!w) return undefined;
                  return (w as { modal_cards?: { id: string; type: "light" | "climate" | "media_player"; entity_id: string }[] }).modal_cards;
                })(),
                modal_light_entity_ids: (() => {
                  const w = widgets.find((x) => x.id === clickedCardForDefinition.widgetId);
                  if (!w) return [];
                  const ids = (w as { modal_light_entity_ids?: string[] }).modal_light_entity_ids;
                  if (ids?.length) return ids;
                  const lid = (w as { light_entity_id?: string }).light_entity_id;
                  return lid ? [lid] : [];
                })(),
                media_player_entity_id:
                  widgets.find((x) => x.id === clickedCardForDefinition.widgetId)
                    ?.media_player_entity_id,
                climate_entity_id:
                  widgets.find((x) => x.id === clickedCardForDefinition.widgetId)
                    ?.climate_entity_id,
              }}
              roomLightEntityId={
                (widgets.find((x) => x.id === clickedCardForDefinition.widgetId) as { light_entity_id?: string } | undefined)
                  ?.light_entity_id
              }
              entities={definitionModalEntities}
              onClose={() => setClickedCardForDefinition(null)}
              onSave={(def) => {
                const wid = widgets.find((w) => w.id === clickedCardForDefinition.widgetId);
                if (!wid || wid.type !== "room_card") return;
                const next = widgets.map((w) =>
                  w.id === clickedCardForDefinition.widgetId
                    ? {
                        ...w,
                        modal_cards: def.modal_cards?.length ? def.modal_cards : undefined,
                        modal_light_entity_ids: undefined,
                      }
                    : w
                );
                setWidgets(next);
                mutateDashboard({
                  layout,
                  widgets: next,
                  welcomeTitle,
                  welcomeSubtitle,
                });
              }}
            />,
            document.body
          )}
        {placedHighlight && typeof document !== "undefined" && createPortal(
          <div
            className="tile-added-highlight fixed z-[65]"
            style={{
              left: placedHighlight.left,
              bottom: placedHighlight.bottom,
              width: placedHighlight.width,
              height: placedHighlight.height,
            }}
            aria-hidden
          />,
          document.body
        )}
        {undoAdd && typeof document !== "undefined" && createPortal(
          <UndoToast
            message={t("editPanel.tileAdded")}
            actionLabel={t("editPanel.undo")}
            onAction={undoAddedTile}
          />,
          document.body
        )}
      </div>
    </AppShell>
  );
}
