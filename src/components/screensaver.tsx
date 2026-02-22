"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Moon,
  Sun,
  Wind,
} from "lucide-react";
import { getScreensaverDelaySeconds, getScreensaverBackgroundImage, getScreensaverClock24h, getScreensaverWeatherEntityId, getScreensaverPexelsEnabled, getScreensaverPexelsQuery, getScreensaverPexelsApiKey, getScreensaverFootballEntityId } from "@/stores/screensaver-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { cn } from "@/lib/utils";

/** Standaard achtergrond wanneer er geen afbeelding is geüpload (zet bestand in public/default-screensaver.png). */
const DEFAULT_SCREENSAVER_IMAGE = "/default-screensaver.png";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;
const PHOTO_ROTATION_SECONDS = 10;
const FADE_DURATION_MS = 1500;

function useIdleScreensaver() {
  const [active, setActive] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);

  useEffect(() => {
    const sec = getScreensaverDelaySeconds();
    setTimeoutSeconds(sec);
    const onSettingChange = () => setTimeoutSeconds(getScreensaverDelaySeconds());
    const onActivate = () => setActive(true);
    window.addEventListener("screensaver-setting-changed", onSettingChange);
    window.addEventListener("screensaver-activate", onActivate);
    return () => {
      window.removeEventListener("screensaver-setting-changed", onSettingChange);
      window.removeEventListener("screensaver-activate", onActivate);
    };
  }, []);

  useEffect(() => {
    if (timeoutSeconds <= 0) {
      setActive(false);
      return;
    }
    const delayMs = timeoutSeconds * 1000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const resetTimer = () => {
      setActive(false);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setActive(true), delayMs);
    };

    resetTimer();

    const onActivity = () => resetTimer();
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

function ScreensaverWeatherIcon({ state }: { state: string }) {
  const s = state?.toLowerCase() ?? "";
  const iconClass = "h-6 w-6 shrink-0 text-white/90";
  if (s === "sunny" || s === "clear") return <Sun className={iconClass} aria-hidden />;
  if (s === "clear-night") return <Moon className={iconClass} aria-hidden />;
  if (s === "fog" || s === "mist") return <CloudFog className={iconClass} aria-hidden />;
  if (s === "rainy" || s === "pouring" || s === "hail") return <CloudRain className={iconClass} aria-hidden />;
  if (s === "snowy" || s === "snowy-rainy") return <CloudSnow className={iconClass} aria-hidden />;
  if (s === "lightning" || s === "lightning-rainy") return <CloudLightning className={iconClass} aria-hidden />;
  if (s === "windy" || s === "windy-variant") return <Wind className={iconClass} aria-hidden />;
  if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return <Cloud className={iconClass} aria-hidden />;
  return <Cloud className={iconClass} aria-hidden />;
}

function ScreensaverWeather() {
  const entityId =
    getScreensaverWeatherEntityId() ??
    (typeof window !== "undefined" ? localStorage.getItem("dashboard.headerTemperatureEntityId") : null) ??
    "weather.home";
  const entity = useEntityStateStore((s) => s.getState(entityId));

  const condition = (entity?.state as string) ?? "";
  const temperature =
    entity?.attributes?.temperature != null
      ? Number(entity.attributes.temperature)
      : (entity?.state != null && entityId.startsWith("sensor.") ? Number(entity.state) : undefined);
  const tempStr =
    temperature != null && !Number.isNaN(temperature)
      ? `${Math.round(temperature)}°`
      : null;

  if (!tempStr && !condition) return null;

  return (
    <div className="flex items-center gap-2 text-white/90 drop-shadow-md">
      {(condition || entityId.startsWith("weather.")) && (
        <ScreensaverWeatherIcon state={condition} />
      )}
      {tempStr && (
        <span className="text-xl font-light tabular-nums">{tempStr}</span>
      )}
    </div>
  );
}

function ScreensaverFootballLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src || typeof src !== "string") return null;
  const url = src.startsWith("http") ? src : src.startsWith("/") ? `${typeof window !== "undefined" ? window.location.origin : ""}${src}` : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Dynamic external URL from Home Assistant sensor
    <img
      src={url}
      alt={alt}
      className="h-12 w-12 sm:h-14 sm:w-14 object-contain shrink-0"
      loading="lazy"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
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
      ? "Nog niet begonnen"
      : status === "IN"
        ? "Bezig"
        : status === "POST"
          ? "Afgelopen"
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

function ScreensaverClock() {
  const [time, setTime] = useState(() => new Date());
  const use24h = getScreensaverClock24h();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = use24h
    ? `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`
    : `${(time.getHours() % 12 || 12)}:${time.getMinutes().toString().padStart(2, "0")}`;
  const ampm = use24h ? null : (time.getHours() < 12 ? "am" : "pm");

  const dateStr = time.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col items-end gap-1">
      <time
        dateTime={time.toISOString()}
        className="text-5xl sm:text-6xl font-light tabular-nums text-white/90 drop-shadow-md"
      >
        {timeStr}
        {ampm != null && (
          <span className="ml-1.5 text-lg sm:text-xl font-normal text-white/70">
            {ampm}
          </span>
        )}
      </time>
      <span className="text-sm text-white/50 tabular-nums">{dateStr}</span>
    </div>
  );
}

const DISMISS_BLOCK_MS = 400;

function ScreensaverOverlay({ onDismiss }: { onDismiss: () => void }) {
  const customBg = getScreensaverBackgroundImage();
  const pexelsEnabled = getScreensaverPexelsEnabled();
  const pexelsQuery = getScreensaverPexelsQuery();
  const pexelsApiKey = getScreensaverPexelsApiKey();

  const [dismissing, setDismissing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [currentAttribution, setCurrentAttribution] = useState<{ url: string; photographer: string } | null>(null);
  const [nextAttribution, setNextAttribution] = useState<{ url: string; photographer: string } | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [pexelsError, setPexelsError] = useState(false);

  const fetchPexelsPhoto = useCallback(() => {
    if (!pexelsApiKey) return;
    setPexelsError(false);
    fetch(`/api/pexels/photo?query=${encodeURIComponent(pexelsQuery)}`, {
      headers: { "X-Pexels-Api-Key": pexelsApiKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.imageUrl) {
          const attr = data.pexelsUrl && data.photographer ? { url: data.pexelsUrl, photographer: data.photographer } : null;
          setCurrentImage((prev) => {
            if (prev) {
              setNextImage(data.imageUrl);
              setNextAttribution(attr);
              return prev;
            }
            setCurrentAttribution(attr);
            return data.imageUrl;
          });
        } else {
          setPexelsError(true);
        }
      })
      .catch(() => setPexelsError(true));
  }, [pexelsApiKey, pexelsQuery]);

  useEffect(() => {
    if (customBg || !pexelsEnabled || !pexelsApiKey) return;
    fetchPexelsPhoto();
  }, [customBg, pexelsEnabled, pexelsApiKey, pexelsQuery, fetchPexelsPhoto]);

  useEffect(() => {
    if (customBg || !pexelsEnabled || !pexelsApiKey || !currentImage || nextImage) return;
    const interval = setInterval(fetchPexelsPhoto, PHOTO_ROTATION_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [customBg, pexelsEnabled, pexelsApiKey, currentImage, nextImage, fetchPexelsPhoto]);

  useEffect(() => {
    if (!nextImage) return;
    const start = requestAnimationFrame(() => setIsFading(true));
    return () => cancelAnimationFrame(start);
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

  const usePexelsRotation = pexelsEnabled && !customBg && pexelsApiKey;
  const backgroundImage = customBg || currentImage || DEFAULT_SCREENSAVER_IMAGE;
  const useGradient = imageFailed || (pexelsEnabled && !customBg && (pexelsError && !currentImage || !pexelsApiKey));

  const singleImage = !usePexelsRotation || (!nextImage && !isFading);
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
      aria-label="Screensaver aanraken om te sluiten"
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col justify-end p-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
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
          {singleImage ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
                aria-hidden
              />
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
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  ...fadeStyle,
                  backgroundImage: `url(${currentImage})`,
                  opacity: isFading ? 0 : 1,
                }}
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
            </>
          )}
          <div className="absolute inset-0 bg-black/50" aria-hidden />
        </>
      )}
      <div className="relative z-10 flex justify-between items-end w-full gap-4 max-w-full">
        <div className="flex flex-col items-start">
          <ScreensaverFootball />
        </div>
        <div className="flex flex-col items-end gap-4">
          <ScreensaverWeather />
          <ScreensaverClock />
        {currentAttribution && (
          <a
            href={currentAttribution.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/50 hover:text-white/70 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Photo by {currentAttribution.photographer} on Pexels
          </a>
        )}
        {pexelsEnabled && !currentAttribution && !pexelsError && (
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/50 hover:text-white/70 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Photos provided by Pexels
          </a>
        )}
        </div>
      </div>
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
