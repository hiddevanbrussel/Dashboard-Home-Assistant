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
    <img
      src={url}
      alt={alt}
      className="h-12 w-12 object-contain shrink-0"
      loading="lazy"
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function ScreensaverFootball() {
  const entityId = getScreensaverFootballEntityId();
  const entity = useEntityStateStore((s) => (entityId ? s.getState(entityId) : null));
  if (!entityId || !entity) return null;

  const attrs = (entity.attributes ?? {}) as Record<string, unknown>;
  const status = String(attrs.status ?? "").toUpperCase();
  const date = attrs.date as string | undefined;
  const teamLogo = attrs.team_logo as string | undefined;
  const teamLongName = attrs.team_long_name as string | undefined;
  const opponentLogo = attrs.opponent_logo as string | undefined;
  const opponentLongName = attrs.opponent_long_name as string | undefined;
  const teamScore = attrs.team_score as number | string | undefined;
  const opponentScore = attrs.opponent_score as number | string | undefined;

  const teamScoreStr = teamScore != null ? String(teamScore) : null;
  const opponentScoreStr = opponentScore != null ? String(opponentScore) : null;

  const isPre = status === "PRE";
  const showScores = (status === "IN" || status === "POST") && (teamScoreStr != null || opponentScoreStr != null);

  if (!teamLongName && !opponentLongName && !date && !showScores) return null;

  return (
    <div className="flex flex-col items-end gap-1 rounded-xl bg-black/40 dark:bg-black/50 backdrop-blur-sm px-4 py-3 text-white/95 drop-shadow-md min-w-[200px]">
      {date && (
        <p className="text-xs text-white/70 mb-1">{date}</p>
      )}
      <div className="flex items-center gap-3 w-full justify-between">
        {/* Thuisteam */}
        <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <ScreensaverFootballLogo src={teamLogo} alt="" />
          <span className="text-sm font-medium truncate w-full text-center">{teamLongName ?? "—"}</span>
        </div>
        {/* Scheidingsstreep / scores */}
        <div className="flex items-center gap-2 shrink-0 px-2">
          {showScores ? (
            <>
              <span className="text-xl font-bold tabular-nums">{teamScoreStr ?? "—"}</span>
              <span className="text-white/60">-</span>
              <span className="text-xl font-bold tabular-nums">{opponentScoreStr ?? "—"}</span>
            </>
          ) : (
            <span className="text-white/60 text-sm">-</span>
          )}
        </div>
        {/* Uitteam */}
        <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
          <ScreensaverFootballLogo src={opponentLogo} alt="" />
          <span className="text-sm font-medium truncate w-full text-center">{opponentLongName ?? "—"}</span>
        </div>
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

function ScreensaverOverlay({ onDismiss }: { onDismiss: () => void }) {
  const customBg = getScreensaverBackgroundImage();
  const pexelsEnabled = getScreensaverPexelsEnabled();
  const pexelsQuery = getScreensaverPexelsQuery();
  const pexelsApiKey = getScreensaverPexelsApiKey();

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

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Screensaver aanraken om te sluiten"
      className="fixed inset-0 z-[9999] flex items-end justify-end p-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={
        useGradient
          ? { background: "linear-gradient(to bottom right, #111827, #1f2937, #000)" }
          : undefined
      }
      onClick={onDismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onDismiss();
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
      <div className="relative z-10 flex flex-col items-end gap-4">
        <ScreensaverWeather />
        <ScreensaverClock />
        <ScreensaverFootball />
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
