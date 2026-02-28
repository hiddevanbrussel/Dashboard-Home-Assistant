"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Users, User, Radio } from "lucide-react";
import { useMusicPlayerStore, type MAPlayer } from "@/stores/music-player-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useSpeakerPairing, resolveEntityId } from "@/hooks/use-speaker-pairing";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

function playerLabel(p: MAPlayer): string {
  return (p.display_name as string) ?? p.queue_id ?? String(p.queue_id);
}

type SpeakerPairingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SpeakerPairingModal({ isOpen, onClose }: SpeakerPairingModalProps) {
  const { t } = useTranslation();
  const { maPlayers, selectedQueueId, queueState } = useMusicPlayerStore();
  const { allowedSpeakerIds } = useMusicAssistantStore();
  const { entityMap, groupMembers, joinUnjoinPending, handleJoin, handleUnjoin } = useSpeakerPairing({ enabled: isOpen });

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const selectablePlayers =
    allowedSpeakerIds.length > 0
      ? maPlayers.filter((p) => allowedSpeakerIds.includes(p.queue_id))
      : maPlayers;

  const mainPlayer = selectablePlayers.find((p) => p.queue_id === selectedQueueId) ?? null;
  const mainEntityId = mainPlayer ? resolveEntityId(mainPlayer, entityMap) : null;
  const otherPlayers = selectablePlayers.filter((p) => p.queue_id !== selectedQueueId);

  const isPlaying = queueState?.state === "playing" || queueState?.state === "paused";

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={t("music.speakerPairing")}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-white/60" aria-hidden />
            <h3 className="text-base font-semibold text-white">{t("music.speakerPairing")}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            aria-label={t("music.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Main speaker */}
          {mainPlayer && (
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-2">
                {t("music.mainSpeaker")}
              </p>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-green/20">
                  <Radio className="h-4 w-4 text-accent-green" aria-hidden />
                </div>
                <span className="flex-1 min-w-0 text-sm font-medium text-white truncate">
                  {playerLabel(mainPlayer)}
                </span>
                {isPlaying && (
                  <span className="flex h-2 w-2 shrink-0 rounded-full bg-green-400" aria-hidden title={t("music.playing")} />
                )}
              </div>
            </div>
          )}

          {/* Other speakers */}
          {otherPlayers.length > 0 && (
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-2">
                {t("music.groupMembers")}
              </p>
              <ul className="space-y-1">
                {otherPlayers.map((p) => {
                  const entityId = resolveEntityId(p, entityMap);
                  const isGrouped = entityId ? groupMembers.has(entityId) : false;
                  const canJoin = !!entityId && !!mainEntityId && !isGrouped;
                  const canUnjoin = !!entityId && isGrouped;

                  return (
                    <li
                      key={p.queue_id}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                        isGrouped ? "bg-white/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        isGrouped ? "bg-accent-green/20" : "bg-white/5"
                      )}>
                        <Radio className={cn("h-4 w-4", isGrouped ? "text-accent-green" : "text-white/40")} aria-hidden />
                      </div>
                      <span className="flex-1 min-w-0 text-sm font-medium text-white/90 truncate">
                        {playerLabel(p)}
                      </span>
                      {isGrouped && (
                        <span className="text-xs text-accent-green/80 shrink-0">{t("music.inGroup")}</span>
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        {canJoin && (
                          <button
                            type="button"
                            onClick={() => {
                              if (mainEntityId && entityId) handleJoin([mainEntityId, entityId]);
                            }}
                            disabled={joinUnjoinPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium disabled:opacity-50 transition-colors"
                            title={t("music.joinSpeakers")}
                          >
                            <Users className="h-3.5 w-3.5" aria-hidden />
                            {t("music.add")}
                          </button>
                        )}
                        {canUnjoin && (
                          <button
                            type="button"
                            onClick={() => { if (entityId) handleUnjoin(entityId); }}
                            disabled={joinUnjoinPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 text-xs font-medium disabled:opacity-50 transition-colors"
                            title={t("music.unjoinSpeaker")}
                          >
                            <User className="h-3.5 w-3.5" aria-hidden />
                            {t("music.remove")}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {selectablePlayers.length === 0 && (
            <p className="text-sm text-white/50 text-center py-4">{t("music.noSpeakers")}</p>
          )}

          {selectablePlayers.length > 0 && !mainPlayer && (
            <p className="text-sm text-white/50 text-center py-4">{t("music.noActiveSpeaker")}</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
