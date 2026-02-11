"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { getScreensaverMinutes, getScreensaverBackgroundImage } from "@/stores/screensaver-store";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;

function useIdleScreensaver() {
  const [active, setActive] = useState(false);
  const [timeoutMinutes, setTimeoutMinutes] = useState(0);

  useEffect(() => {
    const minutes = getScreensaverMinutes();
    setTimeoutMinutes(minutes);
    const onSettingChange = () => setTimeoutMinutes(getScreensaverMinutes());
    window.addEventListener("screensaver-setting-changed", onSettingChange);
    return () => window.removeEventListener("screensaver-setting-changed", onSettingChange);
  }, []);

  useEffect(() => {
    if (timeoutMinutes <= 0) {
      setActive(false);
      return;
    }
    const delayMs = timeoutMinutes * 60 * 1000;
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
  }, [timeoutMinutes]);

  return { active, setActive };
}

function ScreensaverClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const str = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
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
        {str}
      </time>
      <span className="text-sm text-white/50 tabular-nums">{dateStr}</span>
    </div>
  );
}

function ScreensaverOverlay({ onDismiss }: { onDismiss: () => void }) {
  const backgroundImage = getScreensaverBackgroundImage();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Screensaver aanraken om te sluiten"
      className="fixed inset-0 z-[9999] flex items-end justify-end p-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={
        backgroundImage
          ? undefined
          : { background: "linear-gradient(to bottom right, #111827, #1f2937, #000)" }
      }
      onClick={onDismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onDismiss();
      }}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden />
        </>
      )}
      <div className="relative z-10">
        <ScreensaverClock />
      </div>
    </div>
  );
}

export function ScreensaverProvider({ children }: { children: React.ReactNode }) {
  const { active, setActive } = useIdleScreensaver();

  const dismiss = useCallback(() => setActive(false), []);

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
