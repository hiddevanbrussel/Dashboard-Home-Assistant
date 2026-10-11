"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Cloud, Music2, Play, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useTranslation } from "@/hooks/use-translation";
import {
  clockPositionOverlayClass,
  type ScreensaverClockPosition,
  SCREENSAVER_CLOCK_POSITIONS,
} from "@/lib/screensaver-clock-position";
import {
  type ScreensaverClockSize,
  SCREENSAVER_CLOCK_SIZES,
} from "@/lib/screensaver-clock-size";
import {
  clockWeightClass,
  type ScreensaverClockWeight,
  SCREENSAVER_CLOCK_WEIGHTS,
} from "@/lib/screensaver-clock-weight";
import type { ScreensaverMediaSource } from "@/lib/screensaver-media-source";
import { SettingsImagePick } from "@/components/settings/settings-choice-cards";
import {
  SettingsInput,
  SettingsSelect,
  SettingsSecondaryButton,
} from "@/components/settings/settings-panel";

type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

const DELAY_OPTIONS = [30, 60, 120, 300, 600, 900, 1800] as const;
const DEFAULT_ON_DELAY = 300;

const PREVIEW_CLOCK_SIZE: Record<ScreensaverClockSize, string> = {
  sm: "text-[1.75rem]",
  md: "text-[2.5rem]",
  lg: "text-[3.25rem]",
  xl: "text-[4.25rem]",
};

const PREVIEW_AMPM_SIZE: Record<ScreensaverClockSize, string> = {
  sm: "text-[0.65rem]",
  md: "text-[0.8rem]",
  lg: "text-[1rem]",
  xl: "text-[1.25rem]",
};

const PREVIEW_WEATHER_SIZE: Record<ScreensaverClockSize, string> = {
  sm: "text-[0.7rem]",
  md: "text-[0.8rem]",
  lg: "text-[0.9rem]",
  xl: "text-[1rem]",
};

function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (id: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex min-w-[15rem] gap-1 rounded-xl bg-black/[0.05] p-1 dark:bg-white/10"
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-10 flex-1 whitespace-nowrap rounded-[9px] px-3.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              selected
                ? "bg-white text-gray-900 shadow-sm dark:bg-white/15 dark:text-white"
                : "bg-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3.5 rounded-2xl border border-black/[0.06] bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[17px] font-bold tracking-tight text-gray-900 dark:text-white">{title}</h3>
        {description ? (
          <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function LivePreview({
  enabled,
  backgroundUrl,
  clock24h,
  clockSize,
  clockWeight,
  clockPosition,
  showWeather,
  weatherLabel,
  showFootball,
  footballLabel,
  showMusic,
  musicLabel,
  caption,
  onPreview,
}: {
  enabled: boolean;
  backgroundUrl: string;
  clock24h: boolean;
  clockSize: ScreensaverClockSize;
  clockWeight: ScreensaverClockWeight;
  clockPosition: ScreensaverClockPosition;
  showWeather: boolean;
  weatherLabel: string;
  showFootball: boolean;
  footballLabel: string;
  showMusic: boolean;
  musicLabel: string;
  caption: string;
  onPreview: () => void;
}) {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const hours24 = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const hours12 = ((hours24 + 11) % 12) + 1;
  const timeLabel = clock24h
    ? `${hours24.toString().padStart(2, "0")}:${minutes}`
    : `${hours12}:${minutes}`;
  const ampm = clock24h ? "" : hours24 >= 12 ? " PM" : " AM";
  const hasChips = showFootball || showMusic;

  return (
    <section
      aria-label={t("settings.screensaver.previewPanel")}
      className="sticky top-0 flex min-w-0 flex-[1_1_380px] flex-col gap-3"
    >
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[#1E1A33] shadow-[0_10px_30px_rgba(27,21,48,0.18)]",
          !enabled && "opacity-55 grayscale"
        )}
      >
        {backgroundUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- user/custom URL preview
          <img
            src={
              backgroundUrl.startsWith("http") || backgroundUrl.startsWith("data:")
                ? backgroundUrl
                : withBasePath(backgroundUrl)
            }
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            decoding="async"
          />
        ) : (
          <svg
            viewBox="0 0 400 250"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="ss-preview-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1E1A33" />
                <stop offset="1" stopColor="#4A3B66" />
              </linearGradient>
            </defs>
            <rect width="400" height="250" fill="url(#ss-preview-sky)" />
            <circle cx="318" cy="62" r="18" fill="#E9DCC4" opacity="0.85" />
            <polygon
              points="0,170 70,110 130,150 200,90 270,145 330,105 400,150 400,250 0,250"
              fill="#3A2F55"
            />
            <polygon
              points="0,200 90,160 170,195 250,155 330,190 400,170 400,250 0,250"
              fill="#2A223F"
            />
            <polygon points="0,230 120,205 240,232 400,210 400,250 0,250" fill="#17132A" />
          </svg>
        )}
        {backgroundUrl ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25" />
        ) : null}

        <div
          className={cn(
            "absolute inset-0 flex p-7",
            hasChips ? "pb-16" : "pb-7",
            clockPositionOverlayClass(clockPosition)
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-1.5",
              clockPosition.endsWith("left")
                ? "items-start text-left"
                : clockPosition.endsWith("right")
                  ? "items-end text-right"
                  : "items-center text-center"
            )}
          >
            <p
              className={cn(
                "m-0 font-montserrat leading-none tracking-tight text-[#F6EEDF] tabular-nums",
                PREVIEW_CLOCK_SIZE[clockSize],
                clockWeightClass(clockWeight)
              )}
            >
              {timeLabel}
              {ampm ? (
                <span className={cn("font-semibold tracking-normal", PREVIEW_AMPM_SIZE[clockSize])}>
                  {ampm}
                </span>
              ) : null}
            </p>
            {showWeather ? (
              <p
                className={cn(
                  "m-0 font-medium text-[#E4DCF0]",
                  PREVIEW_WEATHER_SIZE[clockSize]
                )}
              >
                {weatherLabel}
              </p>
            ) : null}
          </div>
        </div>

        {hasChips ? (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {showFootball ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(15,12,28,0.62)] px-3 py-1.5 text-xs font-semibold text-[#F6EEDF]">
                <Trophy className="h-3.5 w-3.5" aria-hidden />
                {footballLabel}
              </span>
            ) : null}
            {showMusic ? (
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[rgba(15,12,28,0.62)] px-3 py-1.5 text-xs font-semibold text-[#F6EEDF]">
                <Music2 className="h-3.5 w-3.5" aria-hidden />
                {musicLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {!enabled ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-gray-900">
              {t("settings.screensaver.offBadge")}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[13px] text-gray-500 dark:text-gray-400">{caption}</p>
        <SettingsSecondaryButton onClick={onPreview} className="min-h-11 rounded-xl px-4">
          <Play className="h-4 w-4" aria-hidden />
          {t("settings.screensaver.preview")}
        </SettingsSecondaryButton>
      </div>
    </section>
  );
}

function SourceRow({
  selected,
  name,
  description,
  badge,
  badgeTone,
  actionLabel,
  onSelect,
  onAction,
}: {
  selected: boolean;
  name: string;
  description: string;
  badge: string;
  badgeTone: "neutral" | "ok" | "warn";
  actionLabel: string;
  onSelect: () => void;
  onAction: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-[14px] px-4 py-2",
        selected
          ? "border-2 border-brand bg-brand/5 dark:bg-brand/15"
          : "border-2 border-black/[0.04] bg-white/80 dark:border-white/10 dark:bg-white/5"
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className="flex min-h-11 min-w-0 flex-1 items-center gap-3.5 border-0 bg-transparent p-0 text-left font-inherit text-inherit"
      >
        <span
          className={cn(
            "box-border h-5 w-5 shrink-0 rounded-full border-2",
            selected
              ? "border-brand bg-brand shadow-[inset_0_0_0_3px_white]"
              : "border-gray-400 bg-white dark:border-white/40 dark:bg-transparent"
          )}
          aria-hidden
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[15px] font-bold text-gray-900 dark:text-white">{name}</span>
          <span className="text-[13px] text-gray-500 dark:text-gray-400">{description}</span>
        </span>
      </button>
      <span
        className={cn(
          "whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold",
          badgeTone === "ok" && "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100",
          badgeTone === "warn" && "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100",
          badgeTone === "neutral" && "bg-black/[0.05] text-gray-600 dark:bg-white/10 dark:text-gray-300"
        )}
      >
        {badge}
      </span>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex min-h-11 items-center whitespace-nowrap text-[13px] font-semibold text-brand hover:underline"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function ExtraRow({
  icon,
  label,
  description,
  htmlFor,
  children,
  meta,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  htmlFor: string;
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3.5 border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0 last:pb-0 dark:border-white/10">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-brand/25 dark:text-white">
        {icon}
      </div>
      <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-0.5">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </label>
        <span className="text-[13px] text-gray-500 dark:text-gray-400">{description}</span>
        {meta}
      </div>
      <div className="min-w-[15rem]">{children}</div>
    </div>
  );
}

export function ScreensaverEnableToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {enabled ? t("settings.screensaver.enabledOn") : t("settings.screensaver.enabledOff")}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={t("settings.screensaver")}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative h-8 w-[52px] shrink-0 rounded-full border-0 p-0 transition-colors",
          enabled ? "bg-brand" : "bg-gray-300 dark:bg-white/25"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-[left]",
            enabled ? "left-6" : "left-1"
          )}
        />
      </button>
    </div>
  );
}

export function ScreensaverSettings({
  delaySeconds,
  onDelayChange,
  background,
  onBackgroundChange,
  uploadingBackground,
  onUploadBackground,
  clock24h,
  onClock24hChange,
  clockPosition,
  onClockPositionChange,
  clockSize,
  onClockSizeChange,
  clockWeight,
  onClockWeightChange,
  weatherEntityId,
  onWeatherEntityChange,
  footballEntityId,
  onFootballEntityChange,
  musicEntityId,
  onMusicEntityChange,
  mediaSource,
  onMediaSourceChange,
  pexelsReady,
  immichReady,
  entities,
  onOpenPexels,
  onOpenImmich,
}: {
  delaySeconds: number;
  onDelayChange: (seconds: number) => void;
  background: string;
  onBackgroundChange: (url: string) => void;
  uploadingBackground: boolean;
  onUploadBackground: (e: ChangeEvent<HTMLInputElement>) => void;
  clock24h: boolean;
  onClock24hChange: (value: boolean) => void;
  clockPosition: ScreensaverClockPosition;
  onClockPositionChange: (value: ScreensaverClockPosition) => void;
  clockSize: ScreensaverClockSize;
  onClockSizeChange: (value: ScreensaverClockSize) => void;
  clockWeight: ScreensaverClockWeight;
  onClockWeightChange: (value: ScreensaverClockWeight) => void;
  weatherEntityId: string | null;
  onWeatherEntityChange: (value: string | null) => void;
  footballEntityId: string | null;
  onFootballEntityChange: (value: string | null) => void;
  musicEntityId: string | null;
  onMusicEntityChange: (value: string | null) => void;
  mediaSource: ScreensaverMediaSource;
  onMediaSourceChange: (value: ScreensaverMediaSource) => void;
  pexelsReady: boolean;
  immichReady: boolean;
  entities: HaEntity[];
  onOpenPexels: () => void;
  onOpenImmich: () => void;
}) {
  const { t } = useTranslation();
  const enabled = delaySeconds > 0;

  const delayLabelKey = useMemo(() => {
    const map: Record<number, string> = {
      30: "settings.screensaver.30s",
      60: "settings.screensaver.1m",
      120: "settings.screensaver.2m",
      300: "settings.screensaver.5m",
      600: "settings.screensaver.10m",
      900: "settings.screensaver.15m",
      1800: "settings.screensaver.30m",
    };
    return map[delaySeconds] ?? "settings.screensaver.5m";
  }, [delaySeconds]);

  const sourceName = t(`settings.screensaver.mediaSource.${mediaSource}`);
  const caption = enabled
    ? `${sourceName} · ${t("settings.screensaver.previewCaptionStarts")} ${t(delayLabelKey).toLowerCase()}`
    : t("settings.screensaver.previewCaptionOff");

  const weatherEntities = entities.filter(
    (e) =>
      e.entity_id.startsWith("weather.") ||
      (e.entity_id.startsWith("sensor.") && /temp|weather|graden/i.test(e.entity_id))
  );
  const footballEntities = entities.filter((e) => e.entity_id.startsWith("sensor.team"));
  const musicEntities = entities.filter((e) => e.entity_id.startsWith("media_player."));

  const weatherOff = weatherEntityId === "off";
  const showWeather = !weatherOff;
  const showFootball = Boolean(footballEntityId);
  const showMusic = musicEntityId !== "off";

  const footballEntity = footballEntities.find((e) => e.entity_id === footballEntityId);
  const footballLabel = footballEntity
    ? `${(footballEntity.attributes.friendly_name as string) ?? footballEntity.entity_id}`
    : t("settings.screensaver.football");
  const musicEntity = musicEntities.find((e) => e.entity_id === musicEntityId);
  const musicLabel =
    musicEntityId === "off"
      ? t("settings.screensaver.musicOff")
      : musicEntity
        ? `${(musicEntity.attributes.friendly_name as string) ?? musicEntity.entity_id}`
        : t("settings.screensaver.musicAuto");

  const customBadge = background.trim()
    ? t("settings.screensaver.badge.hasImage")
    : t("settings.screensaver.badge.noImage");
  const pexelsBadge = pexelsReady
    ? t("settings.screensaver.badge.connected")
    : t("settings.screensaver.badge.notReady");
  const immichBadge = immichReady
    ? t("settings.screensaver.badge.connected")
    : t("settings.screensaver.badge.notReady");

  const sizeLabels: Record<ScreensaverClockSize, string> = {
    sm: "S",
    md: "M",
    lg: "L",
    xl: "XL",
  };

  return (
    <div className="flex flex-wrap items-start gap-6">
      <LivePreview
        enabled={enabled}
        backgroundUrl={mediaSource === "custom" ? background.trim() : ""}
        clock24h={clock24h}
        clockSize={clockSize}
        clockWeight={clockWeight}
        clockPosition={clockPosition}
        showWeather={enabled && showWeather}
        weatherLabel={t("settings.screensaver.previewWeatherSample")}
        showFootball={enabled && showFootball}
        footballLabel={footballLabel}
        showMusic={enabled && showMusic}
        musicLabel={`${t("settings.screensaver.previewMusicSample")} · ${musicLabel}`}
        caption={caption}
        onPreview={() => window.dispatchEvent(new Event("screensaver-activate"))}
      />

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
        {!enabled ? (
          <SettingsCard title={t("settings.screensaver.disabledTitle")}>
            <p className="m-0 text-sm text-gray-500 dark:text-gray-400">
              {t("settings.screensaver.disabledHint")}
            </p>
          </SettingsCard>
        ) : (
          <>
            <SettingsCard
              title={t("settings.screensaver.section.startAfter")}
              description={t("settings.screensaver.section.startAfterHint")}
            >
              <div role="radiogroup" aria-label={t("settings.screensaver.section.startAfter")} className="flex flex-wrap gap-2">
                {DELAY_OPTIONS.map((seconds) => {
                  const selected = delaySeconds === seconds;
                  const labelKey =
                    seconds === 30
                      ? "settings.screensaver.30s"
                      : seconds === 60
                        ? "settings.screensaver.1m"
                        : seconds === 120
                          ? "settings.screensaver.2m"
                          : seconds === 300
                            ? "settings.screensaver.5m"
                            : seconds === 600
                              ? "settings.screensaver.10m"
                              : seconds === 900
                                ? "settings.screensaver.15m"
                                : "settings.screensaver.30m";
                  return (
                    <button
                      key={seconds}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onDelayChange(seconds)}
                      className={cn(
                        "min-h-11 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                        selected
                          ? "border-brand bg-brand text-white"
                          : "border-black/10 bg-white text-gray-700 hover:bg-black/[0.03] dark:border-white/15 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                      )}
                    >
                      {t(labelKey)}
                    </button>
                  );
                })}
              </div>
            </SettingsCard>

            <SettingsCard
              title={t("settings.screensaver.section.background")}
              description={t("settings.screensaver.section.backgroundHint")}
            >
              <div role="radiogroup" aria-label={t("settings.screensaver.mediaSource")} className="flex flex-col gap-2">
                <SourceRow
                  selected={mediaSource === "custom"}
                  name={t("settings.screensaver.mediaSource.custom")}
                  description={t("settings.screensaver.mediaSource.customHint")}
                  badge={customBadge}
                  badgeTone={background.trim() ? "ok" : "neutral"}
                  actionLabel={
                    background.trim()
                      ? t("settings.screensaver.action.change")
                      : t("settings.screensaver.action.choose")
                  }
                  onSelect={() => onMediaSourceChange("custom")}
                  onAction={() => onMediaSourceChange("custom")}
                />
                <SourceRow
                  selected={mediaSource === "pexels"}
                  name={t("settings.screensaver.mediaSource.pexels")}
                  description={t("settings.screensaver.mediaSource.pexelsHint")}
                  badge={pexelsBadge}
                  badgeTone={pexelsReady ? "ok" : "warn"}
                  actionLabel={
                    pexelsReady
                      ? t("settings.screensaver.action.manage")
                      : t("settings.screensaver.action.setup")
                  }
                  onSelect={() => onMediaSourceChange("pexels")}
                  onAction={onOpenPexels}
                />
                <SourceRow
                  selected={mediaSource === "immich"}
                  name={t("settings.screensaver.mediaSource.immich")}
                  description={t("settings.screensaver.mediaSource.immichHint")}
                  badge={immichBadge}
                  badgeTone={immichReady ? "ok" : "warn"}
                  actionLabel={
                    immichReady
                      ? t("settings.screensaver.action.manage")
                      : t("settings.screensaver.action.setup")
                  }
                  onSelect={() => onMediaSourceChange("immich")}
                  onAction={onOpenImmich}
                />
              </div>

              {mediaSource === "custom" ? (
                <div className="mt-2 space-y-2">
                  <div className="max-w-sm">
                    <SettingsImagePick
                      label={t("settings.screensaver.bgImage")}
                      url={background || null}
                      uploading={uploadingBackground}
                      onUpload={onUploadBackground}
                      onRemove={() => onBackgroundChange("")}
                      addLabel={t("settings.screensaver.uploadImage")}
                      uploadingLabel={t("settings.screensaver.uploading")}
                      removeLabel={t("settings.screensaver.remove")}
                    />
                  </div>
                  <SettingsInput
                    type="url"
                    value={background}
                    onChange={(e) => onBackgroundChange(e.target.value.trim())}
                    placeholder={t("settings.screensaver.bgUrlPlaceholder")}
                  />
                </div>
              ) : null}
            </SettingsCard>

            <SettingsCard title={t("settings.screensaver.section.clock")}>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.05] py-2.5 dark:border-white/10">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {t("settings.screensaver.clockFormat")}
                  </span>
                  <SegmentedControl
                    label={t("settings.screensaver.clockFormat")}
                    value={clock24h ? "24" : "12"}
                    onChange={(id) => onClock24hChange(id === "24")}
                    options={[
                      { id: "24", label: t("settings.screensaver.24h") },
                      { id: "12", label: t("settings.screensaver.12hShort") },
                    ]}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.05] py-2.5 dark:border-white/10">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {t("settings.screensaver.clockSize")}
                  </span>
                  <SegmentedControl
                    label={t("settings.screensaver.clockSize")}
                    value={clockSize}
                    onChange={onClockSizeChange}
                    options={SCREENSAVER_CLOCK_SIZES.map((size) => ({
                      id: size,
                      label: sizeLabels[size],
                    }))}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.05] py-2.5 dark:border-white/10">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {t("settings.screensaver.clockWeight")}
                  </span>
                  <SegmentedControl
                    label={t("settings.screensaver.clockWeight")}
                    value={clockWeight}
                    onChange={onClockWeightChange}
                    options={SCREENSAVER_CLOCK_WEIGHTS.map((weight) => ({
                      id: weight,
                      label: t(`settings.screensaver.clockWeight.${weight}`),
                    }))}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.05] py-2.5 dark:border-white/10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {t("settings.screensaver.clockPosition")}
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400">
                      {t(`settings.screensaver.clockPosition.${clockPosition}`)}
                    </span>
                  </div>
                  <div
                    role="radiogroup"
                    aria-label={t("settings.screensaver.clockPosition")}
                    className="grid grid-cols-3 gap-1.5"
                  >
                    {SCREENSAVER_CLOCK_POSITIONS.map((position) => {
                      const selected = clockPosition === position;
                      return (
                        <button
                          key={position}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          aria-label={t(`settings.screensaver.clockPosition.${position}`)}
                          onClick={() => onClockPositionChange(position)}
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-[10px] border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                            selected
                              ? "border-brand bg-brand"
                              : "border-black/10 bg-white hover:bg-black/[0.03] dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                          )}
                        >
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              selected ? "bg-white" : "bg-gray-400 dark:bg-white/40"
                            )}
                            aria-hidden
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title={t("settings.screensaver.section.extras")}
              description={t("settings.screensaver.section.extrasHint")}
            >
              <ExtraRow
                icon={<Cloud className="h-5 w-5" aria-hidden />}
                label={t("settings.screensaver.weather")}
                description={t("settings.screensaver.weatherHintShort")}
                htmlFor="ss-weather"
              >
                <SettingsSelect
                  id="ss-weather"
                  value={weatherEntityId ?? ""}
                  onChange={(e) => onWeatherEntityChange(e.target.value || null)}
                >
                  <option value="">{t("settings.screensaver.weatherDefault")}</option>
                  <option value="off">{t("settings.screensaver.weatherOff")}</option>
                  {weatherEntities.map((e) => (
                    <option key={e.entity_id} value={e.entity_id}>
                      {(e.attributes?.friendly_name as string) ?? e.entity_id}
                    </option>
                  ))}
                </SettingsSelect>
              </ExtraRow>

              <ExtraRow
                icon={<Trophy className="h-5 w-5" aria-hidden />}
                label={t("settings.screensaver.football")}
                description={t("settings.screensaver.footballHintShort")}
                htmlFor="ss-football"
                meta={
                  footballEntityId ? (
                    <code className="mt-1 self-start rounded-md bg-black/[0.05] px-2 py-0.5 font-mono text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
                      {footballEntityId}
                    </code>
                  ) : null
                }
              >
                <SettingsSelect
                  id="ss-football"
                  value={footballEntityId ?? ""}
                  onChange={(e) => onFootballEntityChange(e.target.value || null)}
                >
                  <option value="">{t("settings.screensaver.footballOff")}</option>
                  {footballEntities.map((e) => (
                    <option key={e.entity_id} value={e.entity_id}>
                      {(e.attributes?.friendly_name as string) ?? e.entity_id}
                    </option>
                  ))}
                </SettingsSelect>
              </ExtraRow>

              <ExtraRow
                icon={<Music2 className="h-5 w-5" aria-hidden />}
                label={t("settings.screensaver.music")}
                description={t("settings.screensaver.musicHintShort")}
                htmlFor="ss-music"
              >
                <SettingsSelect
                  id="ss-music"
                  value={musicEntityId ?? ""}
                  onChange={(e) => onMusicEntityChange(e.target.value || null)}
                >
                  <option value="">{t("settings.screensaver.musicAuto")}</option>
                  <option value="off">{t("settings.screensaver.musicOff")}</option>
                  {musicEntities.map((e) => (
                    <option key={e.entity_id} value={e.entity_id}>
                      {(e.attributes?.friendly_name as string) ?? e.entity_id}
                    </option>
                  ))}
                </SettingsSelect>
              </ExtraRow>
            </SettingsCard>
          </>
        )}
      </div>
    </div>
  );
}

export function useScreensaverEnabledToggle(
  delaySeconds: number,
  setDelaySeconds: (seconds: number) => void
) {
  const lastOnDelayRef = useRef(delaySeconds > 0 ? delaySeconds : DEFAULT_ON_DELAY);
  useEffect(() => {
    if (delaySeconds > 0) lastOnDelayRef.current = delaySeconds;
  }, [delaySeconds]);

  const enabled = delaySeconds > 0;
  const setEnabled = (next: boolean) => {
    if (next) {
      const restore = lastOnDelayRef.current > 0 ? lastOnDelayRef.current : DEFAULT_ON_DELAY;
      setDelaySeconds(restore);
    } else {
      if (delaySeconds > 0) lastOnDelayRef.current = delaySeconds;
      setDelaySeconds(0);
    }
  };

  return { enabled, setEnabled };
}
