"use client";

import type { WidgetConfig } from "@/stores/onboarding-store";
import { ClimateCard2Widget } from "./climate-card-2-widget";
import { NutsCardWidget } from "./nuts-card-widget";
import { WeatherCardWidget } from "./weather-card-widget";
import { VacuumCard2Widget } from "./vacuum-card-2-widget";
import { LightCardWidget } from "./light-card-widget";
import { MediaCardWidget } from "./media-card-widget";
import { StatPillCardWidget } from "./stat-pill-card-widget";
import { SensorCardWidget } from "./sensor-card-widget";
import { EnergyMonitorCardWidget } from "./energy-monitor-card-widget";
import { TeamtrackerCardWidget } from "./teamtracker-card-widget";
import { CameraCardWidget } from "./camera-card-widget";
import { CalendarCardWidget } from "./calendar-card-widget";
import type { ImageCondition, SensorCondition } from "./widget-types";
import { normalizeClimateDisplayMode } from "@/lib/climate-card";
import { normalizeNutsAccent } from "@/lib/nuts-card";
import { isSmartStackChildType } from "@/lib/smart-stack";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/** Renders one nested dashboard card stretched to fill the smart-stack frame. */
export function SmartStackChild({
  child,
  width,
  height,
  className,
}: {
  child: WidgetConfig;
  width: number;
  height: number;
  className?: string;
}) {
  const { t } = useTranslation();
  const title = child.title || t(`cardType.${child.type}`);

  if (!isSmartStackChildType(child.type)) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-2xl bg-white/70 p-4 text-center text-sm text-gray-500 dark:bg-zinc-900/80 dark:text-white/50",
          className
        )}
      >
        {child.type}
      </div>
    );
  }

  const fill = cn("h-full w-full min-h-0", className);

  switch (child.type) {
    case "climate_card_2":
      return (
        <ClimateCard2Widget
          title={title}
          entity_id={child.entity_id ?? ""}
          humidity_entity_id={child.humidity_entity_id}
          display_mode={normalizeClimateDisplayMode(child.display_mode)}
          icon={child.icon}
          width={width}
          height={height}
          className={fill}
        />
      );
    case "nuts_card":
      return (
        <NutsCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          today_entity_id={child.today_entity_id}
          current_entity_id={child.current_entity_id}
          icon={child.icon}
          icon_background_color={child.icon_background_color}
          accent={normalizeNutsAccent(child.accent)}
          width={width}
          height={height}
          className={fill}
        />
      );
    case "weather_card":
      return (
        <WeatherCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          show_icon={child.show_icon !== false}
          className={fill}
        />
      );
    case "vacuum_card_2":
      return (
        <VacuumCard2Widget
          title={title}
          entity_id={child.entity_id ?? ""}
          progress_entity_id={child.progress_entity_id}
          background_image={child.background_image}
          width={width}
          height={height}
          className={fill}
        />
      );
    case "light_card":
      return (
        <LightCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          icon={child.icon}
          card_layout={child.card_layout === "square" ? "square" : "horizontal"}
          className={fill}
        />
      );
    case "media_card":
      return (
        <MediaCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          width={width}
          height={height}
          className={fill}
        />
      );
    case "stat_pill_card":
      return (
        <StatPillCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          label={child.label}
          icon={child.icon}
          color={(child.color as "amber" | "purple" | "emerald" | "red") ?? "amber"}
          className={fill}
        />
      );
    case "sensor_card":
      return (
        <SensorCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          icon={child.icon}
          show_icon={child.show_icon !== false}
          size={(child.size as "sm" | "md" | "lg") ?? "md"}
          conditions={child.conditions as SensorCondition[] | undefined}
          className={fill}
        />
      );
    case "energy_monitor_card":
      return (
        <EnergyMonitorCardWidget
          title={title}
          entity_id={child.entity_id}
          background_image={child.background_image}
          background_image_dark={child.background_image_dark}
          image_conditions={child.image_conditions as ImageCondition[] | undefined}
          minimal={child.minimal}
          className={fill}
        />
      );
    case "teamtracker_card":
      return (
        <TeamtrackerCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          className={fill}
        />
      );
    case "camera_card":
      return (
        <CameraCardWidget
          title={title}
          entity_id={child.entity_id ?? ""}
          refresh={child.refresh}
          show_title={child.show_title !== false}
          className={fill}
        />
      );
    case "calendar_card":
      return (
        <div
          className={cn(
            "h-full w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white/95 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/90",
            className
          )}
        >
          <CalendarCardWidget title={title} width={width} height={height} />
        </div>
      );
    default:
      return null;
  }
}
