"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Disc3 } from "lucide-react";
import { getScreensaverDelaySeconds, getScreensaverBackgroundImage, getScreensaverClock24h, getScreensaverWeatherEntityId, getScreensaverPexelsEnabled, getScreensaverPexelsQuery, getScreensaverPexelsApiKey, getScreensaverPexelsType, getScreensaverFootballEntityId, getScreensaverMusicEntityId, getScreensaverClockPosition, getScreensaverClockSize, getScreensaverMediaSource } from "@/stores/screensaver-store";
import { useImmichStore } from "@/stores/immich-store";
import { resolveScreensaverPlayback } from "@/lib/screensaver-media-source";
import { buildImmichAssetProxyUrl, pickRandomImmichAsset } from "@/lib/immich-url";
import { immichRequest } from "@/lib/immich-client";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { getItemImageUrl, getImageSrc } from "@/lib/music-item-image";
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

/** Standaard achtergrond wanneer er geen afbeelding is geüpload (zet bestand in public/default-screensaver.png). */
const DEFAULT_SCREENSAVER_IMAGE = "/default-screensaver.png";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;
const PHOTO_ROTATION_SECONDS = 10;
const FADE_DURATION_MS = 1200;

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

function useIdleScreensaver() {
  const [active, setActive] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);
  const ignoreUntilRef = useRef(0);

  useEffect(() => {
    const sec = getScreensaverDelaySeconds();
    setTimeoutSeconds(sec);
    const onSettingChange = () => setTimeoutSeconds(getScreensaverDelaySeconds());
    const onActivate = () => {
      ignoreUntilRef.current = Date.now() + 500;
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
      return;
    }
    const delayMs = timeoutSeconds * 1000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const resetTimer = () => {
      setActive(false);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        ignoreUntilRef.current = Date.now() + 400;
        setActive(true);
      }, delayMs);
    };

    resetTimer();

    const onActivity = () => {
      if (Date.now() < ignoreUntilRef.current) return;
      resetTimer();
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

  return { active, setActive };
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

function ScreensaverFootballLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src || typeof src !== "string") return null;
  const url = src.startsWith("http") ? src : src.startsWith("/") ? `${typeof window !== "undefined" ? window.location.origin : ""}${src}` : src;
  return (
    <div className="image-theme-fixed flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic external URL from Home Assistant sensor */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}

/** Leest score uit attributes: direct of genest (data), ondersteunt number en string. */
function readScoreAttr(attrs: Record<string, unknown>, ...keys: string[]): string {
  const data = attrs.data as Record<string, unknown> | undefined;
  for (const key of keys) {
    const v = attrs[key] ?? (data && data[key]);
    if (v !== undefined && v !== null) {
      const s = String(v).trim();
      if (s !== "") return s;
    }
  }
  return "—";
}

/** Parsed entity.state als "1-0" of "2 - 1" → [team, opponent] of null. */
function parseStateAsScore(state: string | undefined): [string, string] | null {
  if (state == null || typeof state !== "string") return null;
  const trimmed = state.trim();
  const parts = trimmed.split(/\s*[-–]\s*/);
  if (parts.length !== 2) return null;
  const a = parts[0].trim();
  const b = parts[1].trim();
  if (a === "" || b === "" || !/^\d+$/.test(a) || !/^\d+$/.test(b)) return null;
  return [a, b];
}

function ScreensaverFootball() {
  const { t } = useTranslation();
  const entityId = getScreensaverFootballEntityId();
  const entity = useEntityStateStore((s) => (entityId ? s.getState(entityId) : null));
  if (!entityId || !entity) return null;

  const attrs = (entity.attributes ?? {}) as Record<string, unknown>;
  const status = String(attrs.status ?? "").toUpperCase();
  const clock = attrs.clock as string | number | undefined;
  const clockStr = clock != null ? String(clock) : null;
  const kickoffIn = attrs.kickoff_in as string | number | undefined;
  const kickoffInStr = kickoffIn != null ? String(kickoffIn) : undefined;
  const teamLogo = attrs.team_logo as string | undefined;
  const teamLongName = attrs.team_long_name as string | undefined;
  const opponentLogo = attrs.opponent_logo as string | undefined;
  const opponentLongName = attrs.opponent_long_name as string | undefined;
  // Scores: uit attributes (meerdere keys) of uit entity.state als "1-0" / "2 - 1"
  let teamScoreStr = readScoreAttr(attrs, "team_score", "team_goals", "home_score");
  let opponentScoreStr = readScoreAttr(attrs, "opponent_score", "opponent_goals", "away_score");
  if (teamScoreStr === "—" && opponentScoreStr === "—") {
    const fromState = parseStateAsScore(entity.state);
    if (fromState) {
      teamScoreStr = fromState[0];
      opponentScoreStr = fromState[1];
    }
  }
  const hasScoreValues = teamScoreStr !== "—" || opponentScoreStr !== "—";
  const showScores = status === "IN" || status === "POST" || hasScoreValues;

  const statusLabel =
    status === "PRE"
      ? t("screensaver.match.pre")
      : status === "IN"
        ? t("screensaver.match.in")
        : status === "POST"
          ? t("screensaver.match.post")
          : status
            ? status
            : null;
  const centerLabel = clockStr ?? statusLabel;

  if (!teamLongName && !opponentLongName && !kickoffInStr && !centerLabel) return null;

  return (
    <div className="flex flex-col gap-2 px-3 py-2.5 text-white/95 drop-shadow-md w-max max-w-[240px] sm:max-w-[280px]">
      {kickoffInStr && (
        <p className="text-xs sm:text-sm text-white/90 text-center w-full mb-0 leading-tight">{kickoffInStr}</p>
      )}
      {/* Rij 1: team_logo | team_score | clock | opponent_score | opponent_logo */}
      <div className="grid grid-cols-5 items-center gap-2 w-full min-w-0">
        <div className="flex justify-center min-w-0">
          <ScreensaverFootballLogo src={teamLogo} alt="" />
        </div>
        <div className="flex justify-center">
          <span className="inline-flex h-8 min-w-[2rem] sm:h-9 sm:min-w-[2.25rem] items-center justify-center rounded bg-white/20 px-1.5 text-sm sm:text-base font-bold tabular-nums text-white">
            {showScores ? teamScoreStr : "—"}
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
            {showScores ? opponentScoreStr : "—"}
          </span>
        </div>
        <div className="flex justify-center min-w-0">
          <ScreensaverFootballLogo src={opponentLogo} alt="" />
        </div>
      </div>
      {/* Rij 2: team_long_name (links) | ... | opponent_long_name (rechts) */}
      <div className="grid grid-cols-5 gap-2 w-full min-w-0">
        <span className="text-xs sm:text-sm font-medium truncate text-center col-span-1">{teamLongName ?? "—"}</span>
        <div className="col-span-3" />
        <span className="text-xs sm:text-sm font-medium truncate text-center col-span-1">{opponentLongName ?? "—"}</span>
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
            <img src={ha.coverUrl} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
            <img src={coverUrl} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
}: {
  size: ScreensaverClockSize;
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
    "font-montserrat font-black leading-[0.82] tabular-nums tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]",
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

const DISMISS_BLOCK_MS = 400;

function ScreensaverOverlay({ onDismiss }: { onDismiss: () => void }) {
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
  const clockAlign = clockPositionAxis(clockPosition).x;
  const clockY = clockPositionAxis(clockPosition).y;
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

  const backgroundImage =
    playback.mode === "custom"
      ? playback.url
      : currentImage || DEFAULT_SCREENSAVER_IMAGE;
  const useGradient =
    !isVideoMode &&
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
    setDismissing(true);
  }, [dismissing]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t("screensaver.dismiss")}
      className={cn(
        "fixed inset-0 z-[9999] overflow-hidden bg-black cursor-pointer transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        dismissing && "opacity-0 pointer-events-auto"
      )}
      style={
        useGradient && !dismissing
          ? { background: "linear-gradient(to bottom right, #111827, #1f2937, #000)" }
          : undefined
      }
      onClick={handleDismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleDismiss();
      }}
    >
      {!useGradient && (
        <>
          {isVideoMode ? (
            <>
              {currentVideoUrl && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  key={currentVideoUrl}
                  src={currentVideoUrl}
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
                  src={nextVideoUrl}
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
                style={{ backgroundImage: `url(${backgroundImage})` }}
                aria-hidden
              />
              {nextImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    ...fadeStyle,
                    backgroundImage: `url(${nextImage})`,
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
          clockPositionOverlayClass(clockPosition)
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex flex-col gap-4",
            clockAlign === "left" ? "items-start" : clockAlign === "right" ? "items-end" : "items-center"
          )}
        >
          <ScreensaverLockClock size={clockSize} />
          <ScreensaverTimer align={clockAlign} />
        </div>
      </div>
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
      {(currentAttribution || ((playback.mode === "pexels-photo" || playback.mode === "pexels-video") && !mediaError)) && (
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
  const { active, setActive } = useIdleScreensaver();

  const dismiss = useCallback(() => setActive(false), [setActive]);

  return (
    <>
      {children}
      {active &&
        typeof document !== "undefined" &&
        createPortal(
          <ScreensaverOverlay onDismiss={dismiss} />,
          document.body
        )}
    </>
  );
}
