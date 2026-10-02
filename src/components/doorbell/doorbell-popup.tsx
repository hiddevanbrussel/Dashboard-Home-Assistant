"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Mic, Video, X } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { doorbellUsesWebRtc } from "@/lib/doorbell";
import { useDoorbellStore } from "@/stores/doorbell-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/**
 * Full-screen doorbell popup: live camera snapshots or optional go2rtc WebRTC embed.
 */
export function DoorbellPopup() {
  const { t } = useTranslation();
  const activeRing = useDoorbellStore((s) => s.activeRing);
  const settings = useDoorbellStore((s) => s.settings);
  const dismissRing = useDoorbellStore((s) => s.dismissRing);
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cameraEntityId = activeRing?.cameraEntityId || settings.cameraEntityId;
  const webrtcUrl = (activeRing?.webrtcStreamUrl || settings.webrtcStreamUrl || "").trim();
  const useWebRtc = doorbellUsesWebRtc({ webrtcStreamUrl: webrtcUrl });
  const refreshMs = settings.snapshotRefreshMs;

  useEffect(() => {
    if (!activeRing || useWebRtc || !cameraEntityId) return;
    setRefreshKey((k) => k + 1);
    setImageError(false);
    const id = setInterval(() => setRefreshKey((k) => k + 1), refreshMs);
    return () => clearInterval(id);
  }, [activeRing, useWebRtc, cameraEntityId, refreshMs]);

  useEffect(() => {
    if (!activeRing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRing();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeRing, dismissRing]);

  if (!mounted || !activeRing) return null;

  const imageSrc =
    cameraEntityId && !useWebRtc
      ? cameraEntityId === "camera.doorbell_demo"
        ? withBasePath("/doorbell-demo-feed.svg")
        : withBasePath(
            `/api/ha/camera-image?entity_id=${encodeURIComponent(cameraEntityId)}&t=${refreshKey}`
          )
      : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("doorbell.popupTitle")}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-hidden
        onClick={dismissRing}
      />
      <div
        className={cn(
          "relative z-[10001] flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl",
          "border border-white/15 bg-black shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">
              {t("doorbell.popupTitle")}
            </p>
            <p className="truncate text-xs text-white/60">
              {useWebRtc
                ? t("doorbell.popupWebRtcHint")
                : cameraEntityId || t("doorbell.popupNoCamera")}
            </p>
          </div>
          <button
            type="button"
            onClick={dismissRing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t("doorbell.dismiss")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {useWebRtc ? (
            <iframe
              title={t("doorbell.popupTitle")}
              src={webrtcUrl}
              className="absolute inset-0 h-full w-full border-0"
              allow="camera; microphone; autoplay; fullscreen"
              referrerPolicy="no-referrer"
            />
          ) : imageSrc && !imageError ? (
            <Image
              src={imageSrc}
              alt={t("doorbell.popupTitle")}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              unoptimized
              draggable={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50">
              <Video className="h-14 w-14" aria-hidden />
              <p className="text-sm">{t("doorbell.popupNoCamera")}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <p className="flex items-center gap-2 text-xs text-white/55">
            {useWebRtc ? (
              <>
                <Mic className="h-3.5 w-3.5" aria-hidden />
                {t("doorbell.talkbackHint")}
              </>
            ) : (
              t("doorbell.snapshotHint")
            )}
          </p>
          <button
            type="button"
            onClick={dismissRing}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            {t("doorbell.dismiss")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
