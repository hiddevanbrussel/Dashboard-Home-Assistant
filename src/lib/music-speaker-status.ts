export type SpeakerDot = "green" | "amber" | "gray" | "ring";

export type SpeakerStatusCode = "playing" | "paused" | "idle" | "off" | "inGroup";

export type SpeakerStatus = {
  code: SpeakerStatusCode;
  /** Key in src/lib/i18n.ts (EN and NL). */
  labelKey:
    | "music.playing"
    | "music.speakerPaused"
    | "music.speakerIdle"
    | "music.speakerOff"
    | "music.speakerInGroup";
  dot: SpeakerDot;
  /** True only when Home Assistant reports `unavailable`. */
  dimmed: boolean;
};

const KNOWN_STATES = ["playing", "paused", "idle", "on", "standby", "off", "unavailable"] as const;
type KnownSpeakerState = (typeof KNOWN_STATES)[number];

function knownState(state: string | undefined): KnownSpeakerState | null {
  if (!state) return null;
  for (const known of KNOWN_STATES) {
    if (state === known) return known;
  }
  return null;
}

function status(
  code: SpeakerStatusCode,
  labelKey: SpeakerStatus["labelKey"],
  dot: SpeakerDot,
  dimmed = false
): SpeakerStatus {
  return { code, labelKey, dot, dimmed };
}

/**
 * Map a Home Assistant media_player state to the speaker-row label.
 * `inGroupAsMember` means this player is in a group, is not the leader, and is playing along.
 */
export function speakerStatus(
  state: string | undefined,
  options: { inGroupAsMember?: boolean } = {}
): SpeakerStatus {
  if (options.inGroupAsMember) {
    return status("inGroup", "music.speakerInGroup", "green");
  }

  const known = knownState(state);
  switch (known) {
    case "playing":
      return status("playing", "music.playing", "green");
    case "paused":
      return status("paused", "music.speakerPaused", "amber");
    case "idle":
    case "on":
    case "standby":
      return status("idle", "music.speakerIdle", "gray");
    case "off":
      return status("off", "music.speakerOff", "ring");
    case "unavailable":
      return status("off", "music.speakerOff", "ring", true);
    case null:
      return status("idle", "music.speakerIdle", "gray");
    default: {
      const unreachable: never = known;
      return unreachable;
    }
  }
}
