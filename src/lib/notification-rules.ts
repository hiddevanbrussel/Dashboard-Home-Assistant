/**
 * In-app notification rules: fire when HA entity state changes match a rule.
 */

export type NotificationRule = {
  id: string;
  /** User-facing label in settings. */
  name: string;
  enabled: boolean;
  /** Exact entity id, e.g. vacuum.roborock. Mutually exclusive with entityDomain when set. */
  entityId?: string | null;
  /** Match all entities in this domain, e.g. "vacuum". Used when entityId is empty. */
  entityDomain?: string | null;
  /** Previous state must be one of these (lowercase). Empty = any previous state. */
  fromStates: string[];
  /** New state must be one of these (lowercase). */
  toStates: string[];
  title: string;
  message: string;
  /** Optional lucide icon name hint (e.g. "RobotVacuum"). */
  icon?: string | null;
  /** Minimum ms between fires for this rule (anti-spam). */
  cooldownMs: number;
};

export type StateTransition = {
  entityId: string;
  fromState: string;
  toState: string;
};

export type RuleMatchResult = {
  rule: NotificationRule;
  entityId: string;
  fromState: string;
  toState: string;
};

export const DEFAULT_NOTIFICATION_COOLDOWN_MS = 5 * 60 * 1000;

/** Vacuum finished: was cleaning/returning/paused → docked/idle/charging. */
export const VACUUM_FINISHED_RULE_ID = "builtin-vacuum-finished";

export function createVacuumFinishedRule(overrides?: Partial<NotificationRule>): NotificationRule {
  return {
    id: VACUUM_FINISHED_RULE_ID,
    name: "Vacuum finished",
    enabled: true,
    entityId: null,
    entityDomain: "vacuum",
    fromStates: ["cleaning", "returning", "paused", "spot_cleaning", "zoned_cleaning", "segment_cleaning"],
    toStates: ["docked", "idle", "charging"],
    title: "Stofzuiger is klaar",
    message: "De stofzuiger is klaar met schoonmaken.",
    icon: "RobotVacuum",
    cooldownMs: DEFAULT_NOTIFICATION_COOLDOWN_MS,
    ...overrides,
  };
}

export function defaultNotificationRules(): NotificationRule[] {
  return [createVacuumFinishedRule()];
}

function normalizeState(state: string | undefined | null): string {
  return (state ?? "").toLowerCase().trim().replace(/\s+/g, "_");
}

function normalizeList(states: string[] | undefined | null): string[] {
  if (!Array.isArray(states)) return [];
  return states.map((s) => normalizeState(s)).filter(Boolean);
}

export function getEntityDomain(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot >= 0 ? entityId.slice(0, dot).toLowerCase() : "";
}

/** Does this rule target the given entity? */
export function ruleTargetsEntity(rule: NotificationRule, entityId: string): boolean {
  const id = (rule.entityId ?? "").trim();
  if (id) return id.toLowerCase() === entityId.toLowerCase();
  const domain = (rule.entityDomain ?? "").trim().toLowerCase();
  if (domain) return getEntityDomain(entityId) === domain;
  return false;
}

/**
 * Pure match: does the state transition satisfy the rule (ignoring enabled/cooldown)?
 */
export function ruleMatchesTransition(
  rule: NotificationRule,
  transition: StateTransition
): boolean {
  if (!ruleTargetsEntity(rule, transition.entityId)) return false;

  const to = normalizeState(transition.toState);
  const from = normalizeState(transition.fromState);
  if (!to || to === from) return false;

  const toStates = normalizeList(rule.toStates);
  if (toStates.length === 0) return false;
  if (!toStates.includes(to)) return false;

  const fromStates = normalizeList(rule.fromStates);
  if (fromStates.length > 0 && !fromStates.includes(from)) return false;

  return true;
}

export function isRuleInCooldown(
  lastFiredAtMs: number | undefined | null,
  cooldownMs: number,
  nowMs: number
): boolean {
  if (lastFiredAtMs == null || lastFiredAtMs <= 0) return false;
  const cool = Number.isFinite(cooldownMs) ? Math.max(0, cooldownMs) : DEFAULT_NOTIFICATION_COOLDOWN_MS;
  return nowMs - lastFiredAtMs < cool;
}

/**
 * Evaluate enabled rules against a transition, respecting per-rule cooldowns.
 */
export function matchNotificationRules(
  rules: NotificationRule[],
  transition: StateTransition,
  lastFiredByRuleId: Record<string, number>,
  nowMs: number = Date.now()
): RuleMatchResult[] {
  const matches: RuleMatchResult[] = [];
  for (const rule of rules) {
    if (!rule.enabled) continue;
    if (!ruleMatchesTransition(rule, transition)) continue;
    if (isRuleInCooldown(lastFiredByRuleId[rule.id], rule.cooldownMs, nowMs)) continue;
    matches.push({
      rule,
      entityId: transition.entityId,
      fromState: normalizeState(transition.fromState),
      toState: normalizeState(transition.toState),
    });
  }
  return matches;
}

/** Diff previous vs next entity maps into discrete state transitions. */
export function collectStateTransitions(
  previous: Record<string, { state: string } | undefined>,
  next: Record<string, { state: string } | undefined>
): StateTransition[] {
  const out: StateTransition[] = [];
  for (const [entityId, entity] of Object.entries(next)) {
    if (!entity) continue;
    const prev = previous[entityId];
    if (!prev) continue; // first sighting — do not notify on initial poll
    const fromState = prev.state;
    const toState = entity.state;
    if (normalizeState(fromState) === normalizeState(toState)) continue;
    out.push({ entityId, fromState, toState });
  }
  return out;
}

export function parseNotificationRules(raw: unknown): NotificationRule[] {
  if (!Array.isArray(raw)) return defaultNotificationRules();
  const out: NotificationRule[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const id = typeof r.id === "string" && r.id.trim() ? r.id.trim() : null;
    if (!id) continue;
    const title = typeof r.title === "string" ? r.title : "";
    const message = typeof r.message === "string" ? r.message : "";
    const name = typeof r.name === "string" && r.name.trim() ? r.name.trim() : title || id;
    const fromStates = normalizeList(Array.isArray(r.fromStates) ? (r.fromStates as string[]) : []);
    const toStates = normalizeList(Array.isArray(r.toStates) ? (r.toStates as string[]) : []);
    const cooldownMs =
      typeof r.cooldownMs === "number" && Number.isFinite(r.cooldownMs)
        ? Math.max(0, Math.round(r.cooldownMs))
        : DEFAULT_NOTIFICATION_COOLDOWN_MS;
    out.push({
      id,
      name,
      enabled: r.enabled !== false,
      entityId: typeof r.entityId === "string" ? r.entityId : null,
      entityDomain: typeof r.entityDomain === "string" ? r.entityDomain : null,
      fromStates,
      toStates,
      title,
      message,
      icon: typeof r.icon === "string" ? r.icon : null,
      cooldownMs,
    });
  }
  return out.length > 0 ? out : defaultNotificationRules();
}

export function createEmptyNotificationRule(): NotificationRule {
  return {
    id: `rule-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    enabled: true,
    entityId: "",
    entityDomain: "",
    fromStates: [],
    toStates: [],
    title: "",
    message: "",
    icon: null,
    cooldownMs: DEFAULT_NOTIFICATION_COOLDOWN_MS,
  };
}
