"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Disc3 } from "lucide-react";
import { getScreensaverDelaySeconds, getScreensaverBackgroundImage, getScreensaverClock24h, getScreensaverWeatherEntityId, getScreensaverPexelsEnabled, getScreensaverPexelsQuery, getScreensaverPexelsApiKey, getScreensaverPexelsType, getScreensaverFootballEntityId, getScreensaverMusicEntityId, getScreensaverClockPosition, getScreensaverClockSize, getScreensaverClockWeight, getScreensaverMediaSource } from "@/stores/screensaver-store";
import { useImmichStore } from "@/stores/immich-store";
import { resolveScreensaverPlayback } from "@/lib/screensaver-media-source";
import { buildImmichAssetProxyUrl, pickRandomImmichAsset } from "@/lib/immich-url";
import { immichRequest } from "@/lib/immich-client";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { getItemImageUrl, getImageSrc } from "@/lib/music-item-image";
import { cssUrl, withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  clockPositionAxis,
  clockPositionOverlayClass,
  screensaverMediaSide,
} from "@/lib/screensaver-clock-position";
import {
  clockSizeDateClass,
  clockSizeMetaAboveClass,
  clockSizeMetaBelowClass,
  clockSizeTimeClass,
  type ScreensaverClockSize,
} from "@/lib/screensaver-clock-size";
import {
  clockWeightClass,
  type ScreensaverClockWeight,
} from "@/lib/screensaver-clock-weight";
import {
  formatLockDateNumeric,
  formatLockTemperature,
  formatLockWeekday,
  lockClockParts,
  weatherConditionI18nKey,
  weatherLocationLabel,
} from "@/lib/screensaver-lock-clock";
import {
  isActiveMediaPlayerState,
  pickScreensaverMusicPlayer,
  screensaverMusicFromHaEntity,
  shouldShowScreensaverMusic,
} from "@/lib/screensaver-music";
import { formatTimerMs } from "@/lib/timer";
import { useLiveTimerRemaining } from "@/hooks/use-live-timer";
import { useTimerStore } from "@/stores/timer-store";
import { useThemeStore } from "@/stores/theme-store";
import { accentRgbCss, screensaverClockPairRgb } from "@/lib/theme-accents";
import { isMainDashboardPath } from "@/lib/screensaver-home-path";
import {
  SCREENSAVER_FOOTBALL_LIVE_BACKGROUND,
  footballMatchHasContent,
  footballMatchStatus,
  isLiveFootballMatch,
  readFootballMatch,
  type FootballMatch,
} from "@/lib/screensaver-football";

/** Standaard achtergrond wanneer er geen afbeelding is geüpload (zet bestand in public/default-screensaver.png). */
const DEFAULT_SCREENSAVER_IMAGE = "/default-screensaver.png";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;
const PHOTO_ROTATION_SECONDS = 10;
const FADE_DURATION_MS = 1200;
const DISMISS_BLOCK_MS = 400;

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = withBasePath(url);
  });
}

function useIdleScreensaver() {
  const [active, setActive] = useState(false);
  const [activatedBy, setActivatedBy] = useState<"idle" | "preview">("idle");
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);
  const ignoreUntilRef = useRef(0);
  const activeRef = useRef(false);
  const armTimerRef = useRef<() => void>(() => {});
  activeRef.current = active;

  useEffect(() => {
    const sec = getScreensaverDelaySeconds();
    setTimeoutSeconds(sec);
    const onSettingChange = () => setTimeoutSeconds(getScreensaverDelaySeconds());
    const onActivate = () => {
      ignoreUntilRef.current = Date.now() + 500;
      setActivatedBy("preview");
      setActive(true);
    };
    window.addEventListener("screensaver-setting-changed", onSettingChange);
    window.addEventListener("screensaver-activate", onActivate);
    return () => {
      window.removeEventListener("screensaver-setting-changed", onSettingChange);
      window.removeEventListener("screensaver-activate", onActivate);
    };
  }, []);

  useEffect(() => {
    if (timeoutSeconds <= 0) {
      armTimerRef.current = () => setActive(false);
      return;
    }
    const delayMs = timeoutSeconds * 1000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const armTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        ignoreUntilRef.current = Date.now() + 400;
        setActivatedBy("idle");
        setActive(true);
      }, delayMs);
    };

    armTimerRef.current = () => {
      setActive(false);
      armTimer();
    };

    if (!activeRef.current) armTimer();

    const onActivity = () => {
      if (Date.now() < ignoreUntilRef.current) return;
      // Pointer events while the overlay is up must not unmount it — that
      // lets the same tap fall through to a card underneath.
      if (activeRef.current) return;
      armTimer();
    };
    for (const ev of ACTIVITY_EVENTS) {
      window.addEventListener(ev, onActivity, { passive: true });
    }

    return () => {
      for (const ev of ACTIVITY_EVENTS) {
        window.removeEventListener(ev, onActivity);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutSeconds]);

  const dismiss = useCallback(() => {
    ignoreUntilRef.current = Date.now() + DISMISS_BLOCK_MS;
    armTimerRef.current();
  }, []);

  return { active, activatedBy, dismiss };
}

function useScreensaverWeatherLines() {
  const { t } = useTranslation();
  const entityId =
    getScreensaverWeatherEntityId() ??
    (typeof window !== "undefined" ? localStorage.getItem("dashboard.headerTemperatureEntityId") : null) ??
    "weather.home";
  const entity = useEntityStateStore((s) => s.getState(entityId));
  const zoneHome = useEntityStateStore((s) => s.getState("zone.home"));

  const condition = (entity?.state as string) ?? "";
  const temperature =
    entity?.attributes?.temperature != null
      ? entity.attributes.temperature
      : entity?.state != null && entityId.startsWith("sensor.")
        ? entity.state
        : undefined;
  const tempStr = formatLockTemperature(temperature);
  const conditionKey = weatherConditionI18nKey(condition);
  const conditionStr = conditionKey
    ? t(conditionKey)
    : entityId.startsWith("weather.") && condition.trim()
      ? condition.trim()
      : null;
  const location = weatherLocationLabel(
    entity?.attributes as Record<string, unknown> | undefined,
    zoneHome?.attributes as Record<string, unknown> | undefined
  );

  return { tempStr, location, conditionStr };
}

function ScreensaverFootballLogo({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  if (!src || typeof src !== "string") return null;
  const url = src.startsWith("http")
    ? src
    : src.startsWith("/")
      ? `${typeof window !== "undefined" ? window.location.origin : ""}${src}`
      : src;
  return (
    <div className={cn("image-theme-fixed flex shrink-0 items-center justify-center", className ?? "h-12 w-12 sm:h-14 sm:w-14")}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic external URL from Home Assistant sensor */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

function footballCenterLabel(match: FootballMatch, t: (key: string) => string): string | null {
  if (match.clock) return match.clock;
  if (match.status === "PRE") return t("screensaver.match.pre");
  if (match.status === "IN") return t("screensaver.match.in");
  if (match.status === "POST") return t("screensaver.match.post");
  return match.status || null;
}

function useScreensaverFootballMatch() {
  const [entityId, setEntityId] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setEntityId(getScreensaverFootballEntityId());
    sync();
    window.addEventListener("screensaver-setting-changed", sync);
    return () => window.removeEventListener("screensaver-setting-changed", sync);
  }, []);
  const entity = useEntityStateStore((s) => (entityId ? s.getState(entityId) ?? null : null));
  return { entityId, entity, match: readFootballMatch(entity), live: isLiveFootballMatch(entity) };
}

function ScreensaverFootball() {
  const { t } = useTranslation();
  const { entityId, match } = useScreensaverFootballMatch();
  if (!entityId || !footballMatchHasContent(match) || !match) return null;

  const centerLabel = footballCenterLabel(match, t);

  return (
    <div className="flex flex-col gap-2 px-3 py-2.5 text-white/95 drop-shadow-md w-max max-w-[240px] sm:max-w-[280px]">
      {match.kickoffIn && (
        <p className="text-xs sm:text-sm text-white/90 text-center w-full mb-0 leading-tight">{match.kickoffIn}</p>
      )}
      <div className="grid grid-cols-5 items-center gap-2 w-full min-w-0">
        <div className="flex justify-center min-w-0">
          <ScreensaverFootballLogo src={match.teamLogo} alt="" />
        </div>
        <div className="flex justify-center">
          <span className="inline-flex h-8 min-w-[2rem] sm:h-9 sm:min-w-[2.25rem] items-center justify-center rounded bg-white/20 px-1.5 text-sm sm:text-base font-bold tabular-nums text-white">
            {match.showScores ? match.teamScore : "—"}
          </span>
        </div>
        <div className="flex justify-center min-w-0">
          {centerLabel && (
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wide text-white/90 truncate max-w-[3.5rem] sm:max-w-[4rem]">
              {centerLabel}
            </span>
          )}
        </div>
        <div className="flex justify-center">
          <span className="inline-flex h-8 min-w-[2rem] sm:h-9 sm:min-w-[2.25rem] items-center justify-center rounded bg-white/20 px-1.5 text-sm sm:text-base font-bold tabular-nums text-white">
            {match.showScores ? match.opponentScore : "—"}
          </span>
        </div>
        <div className="flex justify-center min-w-0">
          <ScreensaverFootballLogo src={match.opponentLogo} alt="" />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 w-full min-w-0">
        <span className="text-xs sm:text-sm font-medium truncate text-center col-span-1">{match.teamName ?? "—"}</span>
        <div className="col-span-3" />
        <span className="text-xs sm:text-sm font-medium truncate text-center col-span-1">{match.opponentName ?? "—"}</span>
      </div>
    </div>
  );
}

function ScreensaverFootballLive({ match }: { match: FootballMatch }) {
  const { t } = useTranslation();
  const centerLabel = footballCenterLabel(match, t);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6 sm:px-8 sm:pb-10">
      <div className="w-full max-w-4xl rounded-[2rem] bg-black/55 px-5 py-5 text-white shadow-2xl backdrop-blur-md sm:px-8 sm:py-6">
        {match.kickoffIn ? (
          <p className="mb-3 text-center text-sm font-medium uppercase tracking-[0.18em] text-white/80 sm:text-base">
            {match.kickoffIn}
          </p>
        ) : null}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto_minmax(0,1fr)] items-center gap-3 sm:gap-6">
          <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-4">
            <span className="truncate text-right text-lg font-semibold sm:text-2xl">{match.teamName ?? "—"}</span>
            <ScreensaverFootballLogo src={match.teamLogo} alt="" className="h-14 w-14 sm:h-20 sm:w-20" />
          </div>
          <span className="inline-flex h-14 min-w-[3.25rem] items-center justify-center rounded-2xl bg-white/15 px-3 text-3xl font-bold tabular-nums sm:h-16 sm:min-w-[3.75rem] sm:text-5xl">
            {match.showScores ? match.teamScore : "—"}
          </span>
          <span className="px-1 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-lg">
            {centerLabel ?? "—"}
          </span>
          <span className="inline-flex h-14 min-w-[3.25rem] items-center justify-center rounded-2xl bg-white/15 px-3 text-3xl font-bold tabular-nums sm:h-16 sm:min-w-[3.75rem] sm:text-5xl">
            {match.showScores ? match.opponentScore : "—"}
          </span>
          <div className="flex min-w-0 items-center justify-start gap-3 sm:gap-4">
            <ScreensaverFootballLogo src={match.opponentLogo} alt="" className="h-14 w-14 sm:h-20 sm:w-20" />
            <span className="truncate text-left text-lg font-semibold sm:text-2xl">{match.opponentName ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreensaverMusic() {
  const preferredEntityId = getScreensaverMusicEntityId();
  const queueState = useMusicPlayerStore((s) => s.queueState);
  const states = useEntityStateStore((s) => s.states);
  const musicAssistant = useMusicAssistantStore();
  const { baseUrl, token } = musicAssistant;
  const pinnedPlayer = pickScreensaverMusicPlayer(Object.values(states), preferredEntityId);
  const usePinnedPlayer = Boolean(preferredEntityId && pinnedPlayer);
  const isPlaying = queueState?.state === "playing" || queueState?.state === "paused";
  const cur = queueState?.current_item as { name?: string; artists?: { name?: string }[] | { name?: string }; artist?: string; stream_title?: string; [key: string]: unknown } | undefined;

  if (usePinnedPlayer && pinnedPlayer) {
    const ha = screensaverMusicFromHaEntity(pinnedPlayer);
    if (!ha.title && !ha.artist && !ha.coverUrl) return null;
    return (
      <div className="flex gap-3 w-max max-w-[240px] sm:max-w-[280px] text-white/95 drop-shadow-md min-w-0">
        {ha.coverUrl ? (
          <div className="image-theme-fixed relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(ha.coverUrl)} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg text-white/80">
            <Disc3 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
          </div>
        )}
        <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
          <p className="text-xs sm:text-sm truncate text-white/80">{ha.artist || "—"}</p>
          {ha.title ? (
            <p className="text-sm sm:text-base font-medium truncate text-white drop-shadow-md">{ha.title}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (preferredEntityId || !isPlaying || !cur) return null;

  const coverUrl = getImageSrc(getItemImageUrl(cur), baseUrl, token);
  const hasStreamTitle = typeof cur?.stream_title === "string" && cur.stream_title.trim().length > 0;
  const stationName = typeof cur?.name === "string" ? cur.name.trim() : "";
  let artistLine =
    cur?.artists != null
      ? Array.isArray(cur.artists)
        ? (cur.artists as { name?: string }[]).map((a) => a?.name).filter(Boolean).join(", ")
        : typeof (cur?.artists as { name?: string })?.name === "string"
          ? (cur.artists as { name: string }).name
          : ""
      : typeof cur?.artist === "string"
        ? cur.artist.trim()
        : "";
  let titleLine =
    hasStreamTitle
      ? cur.stream_title!.trim()
      : stationName
        ? stationName
        : "";
  if (hasStreamTitle && stationName && !artistLine) {
    artistLine = stationName;
  }
  if (titleLine && !artistLine && !hasStreamTitle) {
    const combined = titleLine;
    const sep = combined.match(/\s*[\-\u2013\u2014]\s+|\s*:\s+/)?.index;
    if (typeof sep === "number" && sep > 0) {
      artistLine = combined.slice(0, sep).trim();
      titleLine = combined.slice(sep).replace(/^\s*[\-\u2013\u2014:]+\s*/, "").trim();
    }
  }
  // Alleen HA als fallback wanneer MA niet actief is of geen titel/artiest heeft
  if ((!artistLine || !titleLine) && !musicAssistant.enabled) {
    const playingMediaPlayer = Object.values(states).find(
      (e) => e.entity_id.startsWith("media_player.") && (e.state === "playing" || e.state === "paused")
    );
    const haArtist = (playingMediaPlayer?.attributes?.media_artist as string)?.trim() || "";
    const haTitle = (playingMediaPlayer?.attributes?.media_title as string)?.trim() || "";
    if (!artistLine && haArtist) artistLine = haArtist;
    if (!titleLine && haTitle) titleLine = haTitle;
  }
  const hasContent = titleLine || artistLine || coverUrl;

  if (!hasContent) return null;

  return (
    <div className="flex gap-3 w-max max-w-[240px] sm:max-w-[280px] text-white/95 drop-shadow-md min-w-0">
      {/* Links: cover */}
        {coverUrl ? (
          <div className="image-theme-fixed relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(coverUrl)} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        ) : (
        <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg text-white/80">
          <Disc3 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
        </div>
      )}
      {/* Rechts: artiest boven, titel eronder */}
      <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
        <p className="text-xs sm:text-sm truncate text-white/80">
          {artistLine || "—"}
        </p>
        {titleLine && (
          <p className="text-sm sm:text-base font-medium truncate text-white drop-shadow-md">
            {titleLine}
          </p>
        )}
      </div>
    </div>
  );
}

function ScreensaverLockClock({
  size,
  weight,
}: {
  size: ScreensaverClockSize;
  weight: ScreensaverClockWeight;
}) {
  const { language } = useTranslation();
  const accent = useThemeStore((s) => s.accent);
  const [time, setTime] = useState(() => new Date());
  const use24h = getScreensaverClock24h();
  const weather = useScreensaverWeatherLines();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, period } = lockClockParts(time, use24h);
  const dateNumeric = formatLockDateNumeric(time, language);
  const weekday = formatLockWeekday(time, language);
  const clockColors = screensaverClockPairRgb(accent);
  const hourColor = accentRgbCss(clockColors.hours);
  const minuteColor = accentRgbCss(clockColors.minutes);
  const metaClass = cn(
    "font-montserrat font-medium leading-tight text-white/90 drop-shadow-md",
    clockSizeDateClass(size)
  );
  const digitClass = cn(
    "font-montserrat leading-[0.82] tabular-nums tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]",
    clockWeightClass(weight),
    clockSizeTimeClass(size)
  );

  return (
    <time
      dateTime={time.toISOString()}
      className="grid grid-cols-[auto_auto] items-end gap-x-[0.14em]"
    >
      <span />
      <span className={cn(metaClass, clockSizeMetaAboveClass(size))}>
        <span className="block">{dateNumeric}</span>
        <span className="block">{weekday}</span>
        {period != null && (
          <span className="mt-0.5 block text-sm font-medium uppercase tracking-[0.18em] text-white/70">
            {period}
          </span>
        )}
      </span>
      <span className={digitClass} style={{ color: hourColor }}>
        {hours}
      </span>
      <span className={digitClass} style={{ color: minuteColor }}>
        {minutes}
      </span>
      <span />
      {(weather.tempStr || weather.location || weather.conditionStr) ? (
        <span className={cn(metaClass, clockSizeMetaBelowClass(size))}>
          {weather.tempStr && <span className="block tabular-nums">{weather.tempStr}</span>}
          {weather.location && <span className="block">{weather.location}</span>}
          {weather.conditionStr && <span className="block">{weather.conditionStr}</span>}
        </span>
      ) : (
        <span />
      )}
    </time>
  );
}

function ScreensaverTimer({ align }: { align: "left" | "center" | "right" }) {
  const { t } = useTranslation();
  const dismiss = useTimerStore((s) => s.dismiss);
  const { status, remaining } = useLiveTimerRemaining();

  if (status === "idle") return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center"
      )}
    >
      <p className="font-montserrat text-xs font-medium uppercase tracking-wider text-white/60">{t("timer.title")}</p>
      <p
        className={cn(
          "font-montserrat font-medium tabular-nums text-white drop-shadow-md",
          status === "ringing" ? "animate-pulse text-5xl" : "text-4xl sm:text-5xl"
        )}
      >
        {status === "ringing" ? t("timer.done") : formatTimerMs(remaining)}
      </p>
      {status === "ringing" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          className="pointer-events-auto rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/30"
        >
          {t("timer.stop")}
        </button>
      ) : null}
    </div>
  );
}

function ScreensaverOverlay({
  onDismiss,
  onDismissStart,
}: {
  onDismiss: () => void;
  onDismissStart?: () => void;
}) {
  const { t } = useTranslation();
  const mediaSource = getScreensaverMediaSource();
  const customBg = getScreensaverBackgroundImage();
  const pexelsEnabled = getScreensaverPexelsEnabled();
  const pexelsQuery = getScreensaverPexelsQuery();
  const pexelsApiKey = getScreensaverPexelsApiKey();
  const pexelsType = getScreensaverPexelsType();
  const immich = useImmichStore();
  const playback = resolveScreensaverPlayback({
    source: mediaSource,
    customUrl: customBg,
    pexelsEnabled,
    pexelsKey: pexelsApiKey,
    pexelsType,
    immichEnabled: immich.enabled,
    immichUrl: immich.baseUrl,
    immichKey: immich.apiKey,
    immichType: immich.mediaType,
  });
  const clockPosition = getScreensaverClockPosition();
  const clockSize = getScreensaverClockSize();
  const clockWeight = getScreensaverClockWeight();
  const { match: footballMatch, live: footballLive } = useScreensaverFootballMatch();
  const liveClockPosition = footballLive ? "top-center" : clockPosition;
  const clockAlign = clockPositionAxis(liveClockPosition).x;
  const clockY = clockPositionAxis(liveClockPosition).y;
  const mediaSide = screensaverMediaSide(clockPosition);
  const [, setSettingsTick] = useState(0);

  useEffect(() => {
    const onChange = () => setSettingsTick((n) => n + 1);
    window.addEventListener("screensaver-setting-changed", onChange);
    return () => window.removeEventListener("screensaver-setting-changed", onChange);
  }, []);

  const musicEntityId = getScreensaverMusicEntityId();
  const pinnedMusicState = useEntityStateStore((s) =>
    musicEntityId && musicEntityId !== "off" ? s.getState(musicEntityId)?.state : undefined
  );
  const anyMusicPlayerActive = useEntityStateStore((s) =>
    Object.values(s.states).some(
      (entity) => entity.entity_id.startsWith("media_player.") && isActiveMediaPlayerState(entity.state)
    )
  );
  const musicAssistantPlaying = useMusicPlayerStore((s) => {
    const q = s.queueState;
    return (q?.state === "playing" || q?.state === "paused") && Boolean(q?.current_item);
  });
  const showMusicOnScreensaver = shouldShowScreensaverMusic({
    preferredEntityId: musicEntityId,
    preferredPlayerActive: musicEntityId
      ? isActiveMediaPlayerState(pinnedMusicState)
      : anyMusicPlayerActive,
    musicAssistantPlaying,
  });

  const [dismissing, setDismissing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [currentAttribution, setCurrentAttribution] = useState<{ url?: string; photographer: string; provider: "pexels" | "immich" } | null>(null);
  const [nextAttribution, setNextAttribution] = useState<{ url?: string; photographer: string; provider: "pexels" | "immich" } | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  // Video state
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [nextVideoUrl, setNextVideoUrl] = useState<string | null>(null);
  const [videoFading, setVideoFading] = useState(false);
  const videoRotateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const VIDEO_MAX_SECONDS = 60;

  const isVideoMode = playback.mode === "pexels-video" || playback.mode === "immich-video";
  const isRemotePhoto = playback.mode === "pexels-photo" || playback.mode === "immich-photo";

  useEffect(() => {
    setCurrentImage(null);
    setNextImage(null);
    setCurrentVideoUrl(null);
    setNextVideoUrl(null);
    setCurrentAttribution(null);
    setNextAttribution(null);
    setIsFading(false);
    setVideoFading(false);
    setMediaError(false);
    setImageFailed(false);
  }, [playback.mode]);

  const applyPhoto = useCallback((imageUrl: string, attr: { url?: string; photographer: string; provider: "pexels" | "immich" } | null) => {
    setCurrentImage((prev) => {
      if (prev) {
        setNextImage(imageUrl);
        setNextAttribution(attr);
        return prev;
      }
      setCurrentAttribution(attr);
      return imageUrl;
    });
  }, []);

  const applyVideo = useCallback((videoUrl: string, attr: { url?: string; photographer: string; provider: "pexels" | "immich" } | null) => {
    setCurrentVideoUrl((prev) => {
      if (prev) {
        setNextVideoUrl(videoUrl);
        setNextAttribution(attr);
        return prev;
      }
      setCurrentAttribution(attr);
      return videoUrl;
    });
  }, []);

  const fetchPexelsPhoto = useCallback(() => {
    if (!pexelsApiKey) return;
    setMediaError(false);
    fetch(`/api/pexels/photo?query=${encodeURIComponent(pexelsQuery)}&_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "X-Pexels-Api-Key": pexelsApiKey },
    })
      .then((r) => r.json())
      .then(async (data) => {
        if (!data?.imageUrl) {
          setMediaError(true);
          return;
        }
        const attr = data.pexelsUrl && data.photographer
          ? { url: data.pexelsUrl as string, photographer: data.photographer as string, provider: "pexels" as const }
          : { photographer: "Pexels", provider: "pexels" as const };
        await preloadImage(data.imageUrl);
        applyPhoto(data.imageUrl, attr);
      })
      .catch(() => setMediaError(true));
  }, [pexelsApiKey, pexelsQuery, applyPhoto]);

  const fetchImmichPhoto = useCallback(() => {
    if (!immich.baseUrl || !immich.apiKey) return;
    setMediaError(false);
    immichRequest({
      baseUrl: immich.baseUrl,
      apiKey: immich.apiKey,
      method: "POST",
      path: "/api/search/random",
      payload: {
        size: 12,
        type: "IMAGE",
        ...(immich.albumId ? { albumIds: [immich.albumId] } : {}),
      },
    })
      .then(async (data) => {
        const asset = pickRandomImmichAsset(data);
        if (!asset) {
          setMediaError(true);
          return;
        }
        const imageUrl = buildImmichAssetProxyUrl({
          baseUrl: immich.baseUrl,
          apiKey: immich.apiKey,
          id: asset.id,
          kind: "preview",
        });
        await preloadImage(imageUrl);
        applyPhoto(imageUrl, { photographer: "Immich", provider: "immich" });
      })
      .catch(() => setMediaError(true));
  }, [immich.baseUrl, immich.apiKey, immich.albumId, applyPhoto]);

  const fetchRemotePhoto = useCallback(() => {
    if (playback.mode === "pexels-photo") fetchPexelsPhoto();
    else if (playback.mode === "immich-photo") fetchImmichPhoto();
  }, [playback.mode, fetchPexelsPhoto, fetchImmichPhoto]);

  useEffect(() => {
    if (!isRemotePhoto) return;
    fetchRemotePhoto();
  }, [isRemotePhoto, fetchRemotePhoto]);

  useEffect(() => {
    if (!isRemotePhoto || !currentImage || nextImage) return;
    const interval = setInterval(fetchRemotePhoto, PHOTO_ROTATION_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [isRemotePhoto, currentImage, nextImage, fetchRemotePhoto]);

  useEffect(() => {
    if (!nextImage) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setIsFading(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [nextImage]);

  useEffect(() => {
    if (!isFading) return;
    const timer = setTimeout(() => {
      setCurrentImage(nextImage);
      setCurrentAttribution(nextAttribution);
      setNextImage(null);
      setNextAttribution(null);
      setIsFading(false);
    }, FADE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isFading, nextImage, nextAttribution]);

  // ── Video logic ──────────────────────────────────────────────────────────────
  const fetchPexelsVideo = useCallback(() => {
    if (!pexelsApiKey) return;
    if (videoRotateTimer.current) clearTimeout(videoRotateTimer.current);
    fetch(`/api/pexels/video?query=${encodeURIComponent(pexelsQuery)}&_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "X-Pexels-Api-Key": pexelsApiKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.videoUrl) {
          const attr = data.pexelsUrl && data.photographer
            ? { url: data.pexelsUrl as string, photographer: data.photographer as string, provider: "pexels" as const }
            : { photographer: "Pexels", provider: "pexels" as const };
          applyVideo(data.videoUrl, attr);
        } else {
          setMediaError(true);
        }
      })
      .catch(() => setMediaError(true));
  }, [pexelsApiKey, pexelsQuery, applyVideo]);

  const fetchImmichVideo = useCallback(() => {
    if (!immich.baseUrl || !immich.apiKey) return;
    if (videoRotateTimer.current) clearTimeout(videoRotateTimer.current);
    immichRequest({
      baseUrl: immich.baseUrl,
      apiKey: immich.apiKey,
      method: "POST",
      path: "/api/search/random",
      payload: {
        size: 12,
        type: "VIDEO",
        ...(immich.albumId ? { albumIds: [immich.albumId] } : {}),
      },
    })
      .then((data) => {
        const asset = pickRandomImmichAsset(data);
        if (!asset) {
          setMediaError(true);
          return;
        }
        applyVideo(
          buildImmichAssetProxyUrl({
            baseUrl: immich.baseUrl,
            apiKey: immich.apiKey,
            id: asset.id,
            kind: "video",
          }),
          { photographer: "Immich", provider: "immich" }
        );
      })
      .catch(() => setMediaError(true));
  }, [immich.baseUrl, immich.apiKey, immich.albumId, applyVideo]);

  const fetchRemoteVideo = useCallback(() => {
    if (playback.mode === "pexels-video") fetchPexelsVideo();
    else if (playback.mode === "immich-video") fetchImmichVideo();
  }, [playback.mode, fetchPexelsVideo, fetchImmichVideo]);

  // Initial video load
  useEffect(() => {
    if (!isVideoMode) return;
    fetchRemoteVideo();
    return () => { if (videoRotateTimer.current) clearTimeout(videoRotateTimer.current); };
  }, [isVideoMode, fetchRemoteVideo]);

  // Fade in next video only after it can play, so we never fade in a blank frame.
  useEffect(() => {
    if (!nextVideoUrl) return;
    const fallback = setTimeout(() => setVideoFading(true), 1500);
    return () => clearTimeout(fallback);
  }, [nextVideoUrl]);

  useEffect(() => {
    if (!videoFading) return;
    const timer = setTimeout(() => {
      setCurrentVideoUrl(nextVideoUrl);
      setCurrentAttribution(nextAttribution);
      setNextVideoUrl(null);
      setNextAttribution(null);
      setVideoFading(false);
    }, FADE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [videoFading, nextVideoUrl, nextAttribution]);

  const scheduleVideoRotation = useCallback(() => {
    if (videoRotateTimer.current) clearTimeout(videoRotateTimer.current);
    videoRotateTimer.current = setTimeout(fetchRemoteVideo, VIDEO_MAX_SECONDS * 1000);
  }, [fetchRemoteVideo]);

  const backgroundImageRaw =
    footballLive
      ? SCREENSAVER_FOOTBALL_LIVE_BACKGROUND
      : playback.mode === "custom"
        ? playback.url
        : currentImage || DEFAULT_SCREENSAVER_IMAGE;
  const backgroundImage = withBasePath(backgroundImageRaw);
  const nextBackgroundImage = nextImage ? withBasePath(nextImage) : null;
  const showVideoBackground = isVideoMode && !footballLive;
  const useGradient =
    !footballLive &&
    !showVideoBackground &&
    (imageFailed ||
      ((isRemotePhoto || isVideoMode) && mediaError && !currentImage));
  const fadeStyle = { transition: `opacity ${FADE_DURATION_MS}ms ease-in-out` as const };

  useEffect(() => {
    if (!dismissing) return;
    const t = setTimeout(() => {
      onDismiss();
    }, DISMISS_BLOCK_MS);
    return () => clearTimeout(t);
  }, [dismissing, onDismiss]);

  const handleDismiss = useCallback(() => {
    if (dismissing) return;
    onDismissStart?.();
    setDismissing(true);
  }, [dismissing, onDismissStart]);

  const eatDismissEvent = useCallback(
    (e: { preventDefault: () => void; stopPropagation: () => void }) => {
      e.preventDefault();
      e.stopPropagation();
      handleDismiss();
    },
    [handleDismiss]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t("screensaver.dismiss")}
      className={cn(
        "fixed inset-0 z-[9999] overflow-hidden bg-black cursor-pointer touch-none transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        dismissing && "opacity-0 pointer-events-auto"
      )}
      style={
        useGradient && !dismissing
          ? { background: "linear-gradient(to bottom right, #111827, #1f2937, #000)" }
          : undefined
      }
      onPointerDown={eatDismissEvent}
      onPointerUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={eatDismissEvent}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDismiss();
        }
      }}
    >
      {!useGradient && (
        <>
          {showVideoBackground ? (
            <>
              {currentVideoUrl && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  key={currentVideoUrl}
                  src={withBasePath(currentVideoUrl)}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  onCanPlay={scheduleVideoRotation}
                  onEnded={fetchRemoteVideo}
                  aria-hidden
                />
              )}
              {nextVideoUrl && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  key={nextVideoUrl}
                  src={withBasePath(nextVideoUrl)}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    ...fadeStyle,
                    opacity: videoFading ? 1 : 0,
                  }}
                  onCanPlay={() => setVideoFading(true)}
                  aria-hidden
                />
              )}
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: cssUrl(backgroundImage) }}
                aria-hidden
              />
              {nextBackgroundImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    ...fadeStyle,
                    backgroundImage: cssUrl(nextBackgroundImage),
                    opacity: isFading ? 1 : 0,
                  }}
                  aria-hidden
                />
              )}
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <Image
                  src={backgroundImage}
                  alt=""
                  fill
                  sizes="100vw"
                  className="sr-only"
                  onError={() => setImageFailed(true)}
                  unoptimized
                />
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-black/30" aria-hidden />
        </>
      )}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex p-8",
          clockPositionOverlayClass(liveClockPosition)
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex flex-col gap-4",
            clockAlign === "left" ? "items-start" : clockAlign === "right" ? "items-end" : "items-center"
          )}
        >
          <ScreensaverLockClock size={clockSize} weight={clockWeight} />
          <ScreensaverTimer align={clockAlign} />
        </div>
      </div>
      {footballLive && footballMatchHasContent(footballMatch) && footballMatch ? (
        <ScreensaverFootballLive match={footballMatch} />
      ) : (
        <div
          className={cn(
            "pointer-events-none absolute bottom-8 z-10",
            mediaSide === "left" ? "left-8" : "right-8"
          )}
        >
          <div className="pointer-events-auto flex flex-col items-start">
            {showMusicOnScreensaver ? <ScreensaverMusic /> : <ScreensaverFootball />}
          </div>
        </div>
      )}
      {!footballLive && (currentAttribution || ((playback.mode === "pexels-photo" || playback.mode === "pexels-video") && !mediaError)) && (
        <div className={cn(
          "pointer-events-none absolute inset-x-0 z-10 flex justify-center px-8",
          clockY === "bottom" ? "top-3" : "bottom-3"
        )}>
          {currentAttribution?.provider === "immich" ? (
            <span className="text-xs text-white/50">{t("screensaver.attribution.immich")}</span>
          ) : currentAttribution?.url ? (
            <a
              href={currentAttribution.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto text-xs text-white/50 hover:text-white/70 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t("screensaver.attribution.pexelsBy").replace("{name}", currentAttribution.photographer)}
            </a>
          ) : playback.mode === "pexels-photo" || playback.mode === "pexels-video" || currentAttribution?.provider === "pexels" ? (
            <a
              href="https://www.pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto text-xs text-white/50 hover:text-white/70 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {t("screensaver.attribution.pexels")}
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function ScreensaverProvider({ children }: { children: React.ReactNode }) {
  const { active, activatedBy, dismiss } = useIdleScreensaver();
  const router = useRouter();
  const pathname = usePathname();
  const { entity, live } = useScreensaverFootballMatch();
  const previousLiveRef = useRef(false);

  useEffect(() => {
    const nowLive = live && footballMatchStatus(entity) === "IN";
    if (nowLive && !previousLiveRef.current) {
      window.dispatchEvent(new Event("screensaver-activate"));
    }
    previousLiveRef.current = nowLive;
  }, [entity, live]);

  const goHomeIfNeeded = useCallback(() => {
    if (activatedBy === "idle" && !isMainDashboardPath(pathname ?? "")) {
      router.push("/");
    }
  }, [activatedBy, pathname, router]);

  return (
    <>
      {children}
      {active &&
        typeof document !== "undefined" &&
        createPortal(
          <ScreensaverOverlay onDismiss={dismiss} onDismissStart={goHomeIfNeeded} />,
          document.body
        )}
    </>
  );
}
