"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SettingsAlert,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPrimaryButton,
  SettingsSecondaryButton,
  SettingsSelect,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import {
  hydrateNotificationRulesStore,
  useNotificationRulesStore,
} from "@/stores/notification-rules-store";
import {
  createEmptyNotificationRule,
  createVacuumFinishedRule,
  DEFAULT_NOTIFICATION_COOLDOWN_MS,
  VACUUM_FINISHED_RULE_ID,
  type NotificationRule,
} from "@/lib/notification-rules";
import { useTranslation } from "@/hooks/use-translation";
import { Plus, Trash2 } from "lucide-react";

type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

function statesToCsv(states: string[]): string {
  return states.join(", ");
}

function csvToStates(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim().toLowerCase().replace(/\s+/g, "_"))
    .filter(Boolean);
}

function RuleEditor({
  draft,
  setDraft,
  vacuumEntities,
  entities,
  onSave,
  onCancel,
}: {
  draft: NotificationRule;
  setDraft: (r: NotificationRule) => void;
  vacuumEntities: HaEntity[];
  entities: HaEntity[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3 rounded-2xl border border-brand/20 bg-brand/5 p-4 dark:bg-brand/10">
      <SettingsField label={t("settings.notifications.name")}>
        <SettingsInput
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </SettingsField>
      <SettingsField label={t("settings.notifications.title")}>
        <SettingsInput
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </SettingsField>
      <SettingsField label={t("settings.notifications.message")}>
        <SettingsInput
          value={draft.message}
          onChange={(e) => setDraft({ ...draft, message: e.target.value })}
        />
      </SettingsField>
      <SettingsField
        label={t("settings.notifications.entity")}
        hint={t("settings.notifications.entityHint")}
      >
        <SettingsSelect
          value={draft.entityId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setDraft({
              ...draft,
              entityId: v || null,
              entityDomain: v ? null : draft.entityDomain || "vacuum",
            });
          }}
        >
          <option value="">{t("settings.notifications.anyInDomain")}</option>
          {vacuumEntities.map((e) => (
            <option key={e.entity_id} value={e.entity_id}>
              {(e.attributes.friendly_name as string) || e.entity_id}
            </option>
          ))}
          {entities
            .filter((e) => !e.entity_id.startsWith("vacuum."))
            .slice(0, 200)
            .map((e) => (
              <option key={e.entity_id} value={e.entity_id}>
                {e.entity_id}
              </option>
            ))}
        </SettingsSelect>
      </SettingsField>
      {!(draft.entityId ?? "").trim() ? (
        <SettingsField label={t("settings.notifications.domain")}>
          <SettingsInput
            value={draft.entityDomain ?? ""}
            onChange={(e) => setDraft({ ...draft, entityDomain: e.target.value })}
            placeholder="vacuum"
          />
        </SettingsField>
      ) : null}
      <SettingsField
        label={t("settings.notifications.fromStates")}
        hint={t("settings.notifications.fromStatesHint")}
      >
        <SettingsInput
          value={statesToCsv(draft.fromStates)}
          onChange={(e) => setDraft({ ...draft, fromStates: csvToStates(e.target.value) })}
          placeholder="cleaning, returning"
        />
      </SettingsField>
      <SettingsField
        label={t("settings.notifications.toStates")}
        hint={t("settings.notifications.toStatesHint")}
      >
        <SettingsInput
          value={statesToCsv(draft.toStates)}
          onChange={(e) => setDraft({ ...draft, toStates: csvToStates(e.target.value) })}
          placeholder="docked, idle"
        />
      </SettingsField>
      <SettingsField
        label={t("settings.notifications.cooldown")}
        hint={t("settings.notifications.cooldownHint")}
      >
        <SettingsInput
          type="number"
          min={0}
          step={30}
          value={Math.round(draft.cooldownMs / 1000)}
          onChange={(e) =>
            setDraft({
              ...draft,
              cooldownMs: Math.max(0, Number(e.target.value) || 0) * 1000,
            })
          }
        />
      </SettingsField>
      <div className="flex flex-wrap gap-2">
        <SettingsPrimaryButton type="button" onClick={onSave}>
          {t("settings.notifications.save")}
        </SettingsPrimaryButton>
        <SettingsSecondaryButton type="button" onClick={onCancel}>
          {t("settings.notifications.cancel")}
        </SettingsSecondaryButton>
      </div>
    </div>
  );
}

export function NotificationSettings() {
  const { t } = useTranslation();
  const rules = useNotificationRulesStore((s) => s.rules);
  const setRules = useNotificationRulesStore((s) => s.setRules);
  const upsertRule = useNotificationRulesStore((s) => s.upsertRule);
  const removeRule = useNotificationRulesStore((s) => s.removeRule);
  const setRuleEnabled = useNotificationRulesStore((s) => s.setRuleEnabled);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NotificationRule | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [entitiesError, setEntitiesError] = useState<string | null>(null);

  useEffect(() => {
    hydrateNotificationRulesStore();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ha/entities")
      .then(async (r) => {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setEntities(data);
      })
      .catch(() => {
        if (!cancelled) setEntitiesError(t("settings.notifications.entitiesLoadError"));
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const vacuumEntities = useMemo(
    () => entities.filter((e) => e.entity_id.startsWith("vacuum.")),
    [entities]
  );

  function startEdit(rule: NotificationRule) {
    setIsNew(false);
    setEditingId(rule.id);
    setDraft({ ...rule });
  }

  function startCreate() {
    const rule = createEmptyNotificationRule();
    rule.name = t("settings.notifications.newRule");
    rule.title = t("settings.notifications.newTitle");
    rule.entityDomain = "vacuum";
    setIsNew(true);
    setEditingId(rule.id);
    setDraft(rule);
  }

  function saveDraft() {
    if (!draft) return;
    const cleaned: NotificationRule = {
      ...draft,
      name: draft.name.trim() || draft.title.trim() || draft.id,
      title: draft.title.trim() || draft.name.trim() || "Notification",
      message: draft.message.trim(),
      entityId: (draft.entityId ?? "").trim() || null,
      entityDomain: (draft.entityDomain ?? "").trim() || null,
      fromStates: draft.fromStates,
      toStates: draft.toStates,
      cooldownMs:
        Number.isFinite(draft.cooldownMs) && draft.cooldownMs >= 0
          ? Math.round(draft.cooldownMs)
          : DEFAULT_NOTIFICATION_COOLDOWN_MS,
    };
    upsertRule(cleaned);
    setEditingId(null);
    setDraft(null);
    setIsNew(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setIsNew(false);
  }

  function ensureVacuumDefault() {
    if (rules.some((r) => r.id === VACUUM_FINISHED_RULE_ID)) {
      setRuleEnabled(VACUUM_FINISHED_RULE_ID, true);
      return;
    }
    setRules([createVacuumFinishedRule(), ...rules]);
  }

  return (
    <div className="space-y-6">
      <SettingsGroup title={t("settings.notifications.rules")}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("settings.notifications.intro")}
        </p>
        {entitiesError ? <SettingsAlert tone="error">{entitiesError}</SettingsAlert> : null}

        <div className="flex flex-wrap gap-2">
          <SettingsSecondaryButton type="button" onClick={startCreate}>
            <Plus className="mr-1.5 inline h-4 w-4" aria-hidden />
            {t("settings.notifications.add")}
          </SettingsSecondaryButton>
          <SettingsSecondaryButton type="button" onClick={ensureVacuumDefault}>
            {t("settings.notifications.addVacuum")}
          </SettingsSecondaryButton>
        </div>

        {isNew && draft && editingId === draft.id ? (
          <RuleEditor
            draft={draft}
            setDraft={setDraft}
            vacuumEntities={vacuumEntities}
            entities={entities}
            onSave={saveDraft}
            onCancel={cancelEdit}
          />
        ) : null}

        <ul className="space-y-2">
          {rules.map((rule) => (
            <li key={rule.id} className="rounded-2xl bg-black/[0.04] p-3 dark:bg-white/5">
              {editingId === rule.id && draft && !isNew ? (
                <RuleEditor
                  draft={draft}
                  setDraft={setDraft}
                  vacuumEntities={vacuumEntities}
                  entities={entities}
                  onSave={saveDraft}
                  onCancel={cancelEdit}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {rule.name || rule.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {rule.entityId ||
                          (rule.entityDomain
                            ? `${t("settings.notifications.domain")}: ${rule.entityDomain}`
                            : "—")}
                        {" · "}
                        {rule.fromStates.length ? rule.fromStates.join("/") : "*"} →{" "}
                        {rule.toStates.join("/") || "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRule(rule.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 hover:text-red-600 dark:hover:bg-white/10"
                      aria-label={t("settings.notifications.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <SettingsToggle
                    checked={rule.enabled}
                    onChange={(v) => setRuleEnabled(rule.id, v)}
                    label={
                      rule.enabled
                        ? t("settings.notifications.on")
                        : t("settings.notifications.off")
                    }
                  />
                  <SettingsSecondaryButton
                    type="button"
                    className="w-fit px-3 py-1.5 text-xs"
                    onClick={() => startEdit(rule)}
                  >
                    {t("settings.notifications.edit")}
                  </SettingsSecondaryButton>
                </div>
              )}
            </li>
          ))}
        </ul>

        {rules.length === 0 && !isNew ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("settings.notifications.empty")}
          </p>
        ) : null}
      </SettingsGroup>
    </div>
  );
}
