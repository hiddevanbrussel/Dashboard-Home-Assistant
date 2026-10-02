import { describe, expect, it } from "vitest";
import {
  collectStateTransitions,
  createVacuumFinishedRule,
  defaultNotificationRules,
  isRuleInCooldown,
  matchNotificationRules,
  parseNotificationRules,
  ruleMatchesTransition,
  ruleTargetsEntity,
  VACUUM_FINISHED_RULE_ID,
} from "./notification-rules";

describe("notification-rules", () => {
  const vacuumRule = createVacuumFinishedRule();

  it("ships a default vacuum-finished rule", () => {
    const rules = defaultNotificationRules();
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe(VACUUM_FINISHED_RULE_ID);
    expect(rules[0].entityDomain).toBe("vacuum");
    expect(rules[0].enabled).toBe(true);
  });

  it("targets vacuum domain or a specific entity", () => {
    expect(ruleTargetsEntity(vacuumRule, "vacuum.roborock")).toBe(true);
    expect(ruleTargetsEntity(vacuumRule, "light.kitchen")).toBe(false);
    expect(
      ruleTargetsEntity(
        { ...vacuumRule, entityDomain: null, entityId: "vacuum.roborock" },
        "vacuum.roborock"
      )
    ).toBe(true);
    expect(
      ruleTargetsEntity(
        { ...vacuumRule, entityDomain: null, entityId: "vacuum.roborock" },
        "vacuum.other"
      )
    ).toBe(false);
  });

  it("matches cleaning → docked as vacuum finished", () => {
    expect(
      ruleMatchesTransition(vacuumRule, {
        entityId: "vacuum.roborock",
        fromState: "cleaning",
        toState: "docked",
      })
    ).toBe(true);
  });

  it("matches returning → idle and paused → charging", () => {
    expect(
      ruleMatchesTransition(vacuumRule, {
        entityId: "vacuum.roborock",
        fromState: "returning",
        toState: "idle",
      })
    ).toBe(true);
    expect(
      ruleMatchesTransition(vacuumRule, {
        entityId: "vacuum.roborock",
        fromState: "paused",
        toState: "charging",
      })
    ).toBe(true);
  });

  it("does not match docked → cleaning or same state", () => {
    expect(
      ruleMatchesTransition(vacuumRule, {
        entityId: "vacuum.roborock",
        fromState: "docked",
        toState: "cleaning",
      })
    ).toBe(false);
    expect(
      ruleMatchesTransition(vacuumRule, {
        entityId: "vacuum.roborock",
        fromState: "docked",
        toState: "docked",
      })
    ).toBe(false);
  });

  it("requires fromStates when configured (idle → docked should not fire)", () => {
    expect(
      ruleMatchesTransition(vacuumRule, {
        entityId: "vacuum.roborock",
        fromState: "idle",
        toState: "docked",
      })
    ).toBe(false);
  });

  it("allows any from-state when fromStates is empty", () => {
    const anyFrom = { ...vacuumRule, fromStates: [] as string[] };
    expect(
      ruleMatchesTransition(anyFrom, {
        entityId: "vacuum.roborock",
        fromState: "unknown",
        toState: "docked",
      })
    ).toBe(true);
  });

  it("normalizes spaced / mixed-case states", () => {
    expect(
      ruleMatchesTransition(vacuumRule, {
        entityId: "vacuum.roborock",
        fromState: "Spot Cleaning",
        toState: "Docked",
      })
    ).toBe(true);
  });

  it("respects cooldown and disabled rules", () => {
    const now = 1_000_000;
    expect(isRuleInCooldown(now - 1000, 60_000, now)).toBe(true);
    expect(isRuleInCooldown(now - 120_000, 60_000, now)).toBe(false);
    expect(isRuleInCooldown(undefined, 60_000, now)).toBe(false);

    const matches = matchNotificationRules(
      [{ ...vacuumRule, enabled: false }],
      { entityId: "vacuum.roborock", fromState: "cleaning", toState: "docked" },
      {},
      now
    );
    expect(matches).toHaveLength(0);

    const cooled = matchNotificationRules(
      [vacuumRule],
      { entityId: "vacuum.roborock", fromState: "cleaning", toState: "docked" },
      { [VACUUM_FINISHED_RULE_ID]: now - 1000 },
      now
    );
    expect(cooled).toHaveLength(0);

    const ok = matchNotificationRules(
      [vacuumRule],
      { entityId: "vacuum.roborock", fromState: "cleaning", toState: "docked" },
      {},
      now
    );
    expect(ok).toHaveLength(1);
    expect(ok[0].rule.id).toBe(VACUUM_FINISHED_RULE_ID);
  });

  it("collects only real transitions (skips first sighting)", () => {
    const prev = {
      "vacuum.roborock": { state: "cleaning" },
      "light.kitchen": { state: "on" },
    };
    const next = {
      "vacuum.roborock": { state: "docked" },
      "light.kitchen": { state: "on" },
      "binary_sensor.door": { state: "on" },
    };
    expect(collectStateTransitions(prev, next)).toEqual([
      { entityId: "vacuum.roborock", fromState: "cleaning", toState: "docked" },
    ]);
  });

  it("parses stored rules and falls back to defaults", () => {
    expect(parseNotificationRules(null)[0].id).toBe(VACUUM_FINISHED_RULE_ID);
    expect(parseNotificationRules([])[0].id).toBe(VACUUM_FINISHED_RULE_ID);
    const parsed = parseNotificationRules([
      {
        id: "custom-1",
        name: "Door open",
        enabled: true,
        entityId: "binary_sensor.front_door",
        fromStates: ["off"],
        toStates: ["on"],
        title: "Door",
        message: "Opened",
        cooldownMs: 10_000,
      },
    ]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].entityId).toBe("binary_sensor.front_door");
    expect(parsed[0].cooldownMs).toBe(10_000);
  });
});
