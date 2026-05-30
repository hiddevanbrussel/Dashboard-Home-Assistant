"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Home,
  Plane,
  Moon,
  Palmtree,
  Eye,
  EyeOff,
  X,
  Check,
} from "lucide-react";
import type { AlarmCardProps } from "./widget-types";
import { cn, capitalizeFirst } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { CARD_ICONS } from "./card-icons";

// Bitmask uit Home Assistant (AlarmControlPanelEntityFeature).
const FEATURE_ARM_HOME = 1;
const FEATURE_ARM_AWAY = 2;
const FEATURE_ARM_NIGHT = 4;
const FEATURE_ARM_CUSTOM_BYPASS = 16;
const FEATURE_ARM_VACATION = 32;

type AlarmStatus = {
  label: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** Tailwind kleur-tokens voor tekst + icoonbadge. */
  text: string;
  badge: string;
  pulse?: boolean;
};

function getStatus(state: string): AlarmStatus {
  switch (state) {
    case "disarmed":
      return {
        label: "Uitgeschakeld",
        Icon: ShieldOff,
        text: "text-green-600 dark:text-green-400",
        badge: "bg-green-500/15 text-green-600 dark:text-green-400",
      };
    case "armed_home":
      return { label: "Ingeschakeld (thuis)", Icon: ShieldCheck, text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400" };
    case "armed_away":
      return { label: "Ingeschakeld (afwezig)", Icon: ShieldCheck, text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400" };
    case "armed_night":
      return { label: "Ingeschakeld (nacht)", Icon: ShieldCheck, text: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" };
    case "armed_vacation":
      return { label: "Ingeschakeld (vakantie)", Icon: ShieldCheck, text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400" };
    case "armed_custom_bypass":
      return { label: "Ingeschakeld (aangepast)", Icon: ShieldCheck, text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400" };
    case "arming":
      return { label: "Inschakelen…", Icon: Shield, text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400", pulse: true };
    case "pending":
      return { label: "In afwachting…", Icon: Shield, text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400", pulse: true };
    case "disarming":
      return { label: "Uitschakelen…", Icon: Shield, text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400", pulse: true };
    case "triggered":
      return { label: "Alarm!", Icon: ShieldAlert, text: "text-red-600 dark:text-red-400", badge: "bg-red-500/20 text-red-600 dark:text-red-400", pulse: true };
    case "unavailable":
      return { label: "Niet beschikbaar", Icon: Shield, text: "text-gray-500 dark:text-white/50", badge: "bg-gray-200/80 dark:bg-white/15 text-gray-500 dark:text-white/60" };
    default:
      return { label: capitalizeFirst(state), Icon: Shield, text: "text-gray-700 dark:text-white/80", badge: "bg-gray-200/80 dark:bg-white/15 text-gray-700 dark:text-white" };
  }
}

type ArmAction = {
  service: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  feature: number;
};

const ARM_ACTIONS: ArmAction[] = [
  { service: "alarm_arm_home", label: "Thuis", Icon: Home, feature: FEATURE_ARM_HOME },
  { service: "alarm_arm_away", label: "Afwezig", Icon: Plane, feature: FEATURE_ARM_AWAY },
  { service: "alarm_arm_night", label: "Nacht", Icon: Moon, feature: FEATURE_ARM_NIGHT },
  { service: "alarm_arm_vacation", label: "Vakantie", Icon: Palmtree, feature: FEATURE_ARM_VACATION },
  { service: "alarm_arm_custom_bypass", label: "Aangepast", Icon: ShieldCheck, feature: FEATURE_ARM_CUSTOM_BYPASS },
];

export function AlarmCardWidget({
  title = "Alarm",
  entity_id,
  icon: iconName,
  size = "md",
  className,
  onMoreClick,
}: AlarmCardProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const setStates = useEntityStateStore((s) => s.setStates);
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);

  const state = (entity?.state as string) ?? "unknown";
  const attrs = (entity?.attributes ?? {}) as {
    friendly_name?: string;
    code_format?: string | null;
    code_arm_required?: boolean;
    supported_features?: number;
  };
  const friendlyName = attrs.friendly_name ?? entity_id;
  const codeFormat = attrs.code_format ?? null; // "number" | "text" | null
  const codeArmRequired = attrs.code_arm_required !== false;
  const features = Number(attrs.supported_features ?? 0);

  const status = getStatus(state);
  const CustomIcon = iconName && iconName !== "auto" ? CARD_ICONS[iconName] : undefined;
  const HeaderIcon = CustomIcon ?? status.Icon;

  const isDisarmed = state === "disarmed";

  /** Lopende actie waarvoor een code nodig is (toont keypad). */
  const [pending, setPending] = useState<{ service: string; label: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sluit keypad zodra de status daadwerkelijk verandert (bijv. extern uitgeschakeld).
  useEffect(() => {
    setPending(null);
    setCode("");
  }, [state]);

  const armNeedsCode = codeArmRequired && !!codeFormat;
  const disarmNeedsCode = !!codeFormat;

  async function callAlarm(service: string, codeValue?: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id,
          domain: "alarm_control_panel",
          service,
          service_data: codeValue ? { code: codeValue } : undefined,
        }),
      });
      if (res.ok) {
        updateEntityState(entity_id, { state: service === "alarm_disarm" ? "disarming" : "arming" });
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
        setPending(null);
        setCode("");
      } else {
        setError("Mislukt. Controleer de code.");
      }
    } catch {
      setError("Geen verbinding.");
    } finally {
      setBusy(false);
    }
  }

  function handleAction(service: string, label: string, needsCode: boolean) {
    setError(null);
    if (needsCode) {
      setPending({ service, label });
      setCode("");
    } else {
      void callAlarm(service);
    }
  }

  const availableArmActions = ARM_ACTIONS.filter((a) => (features & a.feature) !== 0);

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 min-h-[7.75rem]",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              status.badge,
              status.pulse && "animate-pulse"
            )}
          >
            <HeaderIcon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate text-gray-900 dark:text-white/90">{title}</p>
            <p className="text-xs text-gray-600 dark:text-white/60 truncate">{friendlyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
              className="p-1.5 rounded-lg shrink-0 text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/10 transition-colors"
              aria-label="Opties"
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          )}
          <p className={cn("text-sm font-medium truncate text-right", status.text)} title={status.label}>
            {status.label}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-white/10">
        {(
          <div className="pt-3 space-y-2">
            {error && !pending && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            {isDisarmed ? (
              <div className="grid grid-cols-2 gap-2">
                {availableArmActions.length === 0 && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleAction("alarm_arm_away", "Inschakelen", armNeedsCode)}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-blue-500/15 px-3 py-2.5 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-500/25 transition-colors disabled:opacity-50"
                  >
                    <ShieldCheck className="h-4 w-4" /> Inschakelen
                  </button>
                )}
                {availableArmActions.map((a) => (
                  <button
                    key={a.service}
                    type="button"
                    disabled={busy}
                    onClick={() => handleAction(a.service, a.label, armNeedsCode)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
                      "bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25",
                      availableArmActions.length === 1 && "col-span-2"
                    )}
                  >
                    <a.Icon className="h-4 w-4" /> {a.label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                disabled={busy || state === "unavailable"}
                onClick={() => handleAction("alarm_disarm", "Uitschakelen", disarmNeedsCode)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500/15 px-3 py-3 text-sm font-semibold text-green-700 dark:text-green-300 hover:bg-green-500/25 transition-colors disabled:opacity-50"
              >
                <ShieldOff className="h-4 w-4" /> Uitschakelen
              </button>
            )}
          </div>
        )}
      </div>

      {pending && (
        <CodeModal
          label={pending.label}
          codeFormat={codeFormat === "text" ? "text" : "number"}
          code={code}
          setCode={setCode}
          busy={busy}
          error={error}
          onCancel={() => { setPending(null); setCode(""); setError(null); }}
          onConfirm={() => void callAlarm(pending.service, code)}
        />
      )}
    </div>
  );
}

function CodeModal({
  label,
  codeFormat,
  code,
  setCode,
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  label: string;
  codeFormat: "number" | "text";
  code: string;
  setCode: (updater: string | ((prev: string) => string)) => void;
  busy: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [reveal, setReveal] = useState(false);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const content = (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Code voor ${label}`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden onClick={onCancel} />
      <div className="relative w-[320px] max-w-[90vw] rounded-3xl border border-gray-200/70 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="-ml-1 rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10"
            aria-label="Annuleren"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{label}</h3>
        </div>

        <div className="relative mb-5 border-b border-gray-300 dark:border-white/15">
          <input
            type={reveal ? "text" : "password"}
            inputMode={codeFormat === "number" ? "numeric" : "text"}
            autoFocus
            value={code}
            onChange={(e) =>
              setCode(codeFormat === "number" ? e.target.value.replace(/\D/g, "") : e.target.value)
            }
            onKeyDown={(e) => { if (e.key === "Enter" && code && !busy) onConfirm(); }}
            placeholder="Code"
            className="w-full bg-transparent px-1 py-2 pr-9 text-base text-gray-900 placeholder-gray-400 outline-none dark:text-white dark:placeholder-white/40"
          />
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-500 hover:text-gray-800 dark:text-white/60 dark:hover:text-white"
            aria-label={reveal ? "Code verbergen" : "Code tonen"}
          >
            {reveal ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {codeFormat === "number" ? (
          <div className="grid grid-cols-3 justify-items-center gap-3">
            {keys.map((k) => (
              <KeyButton key={k} disabled={busy} onClick={() => setCode((prev) => prev + k)}>
                {k}
              </KeyButton>
            ))}
            <KeyButton
              variant="muted"
              disabled={busy || code.length === 0}
              onClick={() => setCode((prev) => prev.slice(0, -1))}
              aria-label="Wissen"
            >
              <X className="h-5 w-5" />
            </KeyButton>
            <KeyButton disabled={busy} onClick={() => setCode((prev) => prev + "0")}>
              0
            </KeyButton>
            <KeyButton
              variant="confirm"
              disabled={busy || code.length === 0}
              onClick={onConfirm}
              aria-label="Bevestigen"
            >
              <Check className="h-5 w-5" />
            </KeyButton>
          </div>
        ) : (
          <button
            type="button"
            disabled={busy || !code}
            onClick={onConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4D2FB2] px-3 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> Bevestigen
          </button>
        )}

        {error && <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

function KeyButton({
  children,
  onClick,
  disabled,
  variant = "default",
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "muted" | "confirm";
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full text-xl font-medium transition-colors disabled:opacity-40",
        variant === "confirm"
          ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:text-green-300"
          : variant === "muted"
            ? "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}
