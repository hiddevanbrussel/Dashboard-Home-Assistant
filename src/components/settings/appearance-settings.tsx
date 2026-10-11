"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useTranslation } from "@/hooks/use-translation";
import { THEME_ACCENTS, accentRgbCss, type ThemeAccentId } from "@/lib/theme-accents";
import { GLASS_DENSITIES, GLASS_DENSITY_VARS, type GlassDensity } from "@/lib/glass-density";
import type { ThemeMode } from "@/stores/theme-store";
import type { Language } from "@/stores/language-store";
import {
  SettingsField,
  SettingsInput,
  SettingsSelect,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import {
  SettingsChipSelect,
  SettingsChoiceCards,
  SettingsImagePick,
  ThemePreview,
} from "@/components/settings/settings-choice-cards";
import { playUiClick } from "@/lib/ui-click";

type Props = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accent: ThemeAccentId;
  setAccent: (id: ThemeAccentId) => void;
  glassDensity: GlassDensity;
  setGlassDensity: (id: GlassDensity) => void;
  language: Language;
  setLanguage: (id: Language) => void;
  clock24h: boolean;
  setClock24h: (value: boolean) => void;
  editModeAllowed: boolean;
  setEditModeAllowed: (value: boolean) => void;
  editModePasscode: string;
  setEditModePasscode: (value: string) => void;
  uiSoundEnabled: boolean;
  setUiSoundEnabled: (value: boolean) => void;
  dashboardId: string | null;
  pageBackground: string | null;
  pageBackgroundLight: string | null;
  pageBackgroundDark: string | null;
  uploadingBg: boolean;
  uploadingBgLight: boolean;
  uploadingBgDark: boolean;
  onUploadFallback: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFallback: () => void;
  onUploadLight: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveLight: () => void;
  onUploadDark: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveDark: () => void;
  onSetSameBackground: (same: boolean) => void;
};

function AppearanceLivePreview({
  mode,
  accent,
  glassDensity,
  backgroundUrl,
}: {
  mode: ThemeMode;
  accent: ThemeAccentId;
  glassDensity: GlassDensity;
  backgroundUrl: string | null;
}) {
  const { t } = useTranslation();
  const accentColor = accentRgbCss(THEME_ACCENTS.find((a) => a.id === accent)?.rgb ?? THEME_ACCENTS[0].rgb);
  const dark =
    mode === "dark" ||
    (mode === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const vars = GLASS_DENSITY_VARS[glassDensity];
  const cardBg = dark
    ? `rgba(28, 24, 44, ${vars.opacityDark})`
    : `rgba(255, 255, 255, ${vars.opacity})`;
  const fg = dark ? "#F1EDF8" : "#1B1530";
  const sub = dark ? "#C9C2DA" : "#4A4360";
  const glassCss: CSSProperties = {
    background: cardBg,
    backdropFilter: `blur(${vars.blur}) saturate(${vars.saturation})`,
    WebkitBackdropFilter: `blur(${vars.blur}) saturate(${vars.saturation})`,
    border: `1px solid ${dark ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.55)"}`,
  };

  return (
    <div className="space-y-1.5">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-[0_6px_18px_rgba(27,21,48,.14)]"
        style={{ background: dark ? "#14111F" : "#E9E6F0" }}
      >
        {backgroundUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={withBasePath(backgroundUrl)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: dark
                ? "linear-gradient(160deg,#1B2350,#14111F 55%,#24335E)"
                : "linear-gradient(160deg,#BFE0F7,#7CC46A 55%,#4FA34A)",
            }}
          />
        )}
        <div className="absolute inset-0 box-border flex gap-1.5 p-1.5">
          <div
            className="flex w-[22%] shrink-0 flex-col gap-1 rounded-lg p-1"
            style={glassCss}
          >
            <div
              className="flex h-3 items-center rounded-md px-1"
              style={{ background: accentColor }}
            >
              <span className="h-1 w-[44%] rounded-full bg-white" />
            </div>
            {[56, 48, 40].map((w, i) => (
              <div key={i} className="flex h-3 items-center rounded-md px-1">
                <span
                  className="h-1 rounded-full"
                  style={{
                    width: `${w}%`,
                    background: dark ? "rgba(255,255,255,.35)" : "rgba(27,21,48,.25)",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-2 content-start gap-1.5">
            <div
              className="flex min-h-[38px] flex-col justify-between rounded-lg p-1.5"
              style={{ ...glassCss, color: fg }}
            >
              <span className="text-[8px] font-semibold leading-none" style={{ color: sub }}>
                {t("settings.appearance.preview.livingRoom")}
              </span>
              <span className="text-[13px] font-extrabold leading-none tracking-tight">21.5°</span>
            </div>
            <div
              className="flex min-h-[38px] flex-col justify-between rounded-lg p-1.5"
              style={{ ...glassCss, color: fg }}
            >
              <span className="text-[8px] font-semibold leading-none" style={{ color: sub }}>
                {t("settings.appearance.preview.lights")}
              </span>
              <span
                className="relative block h-3 w-5 rounded-full"
                style={{ background: accentColor }}
              >
                <span className="absolute left-2.5 top-0.5 h-2 w-2 rounded-full bg-white" />
              </span>
            </div>
            <div
              className="flex min-h-[38px] flex-col justify-between rounded-lg p-1.5"
              style={{ ...glassCss, color: fg }}
            >
              <span className="text-[8px] font-semibold leading-none" style={{ color: sub }}>
                {t("settings.appearance.preview.nowPlaying")}
              </span>
              <span
                className="block h-1 overflow-hidden rounded-full"
                style={{ background: dark ? "rgba(255,255,255,.18)" : "rgba(27,21,48,.12)" }}
              >
                <span className="block h-full w-[58%] rounded-full" style={{ background: accentColor }} />
              </span>
            </div>
            <div
              className="flex min-h-[38px] flex-col justify-between rounded-lg p-1.5"
              style={{ ...glassCss, color: fg }}
            >
              <span className="text-[8px] font-semibold leading-none" style={{ color: sub }}>
                {t("settings.appearance.preview.energy")}
              </span>
              <span className="flex h-3.5 items-end gap-0.5">
                {[40, 70, 55, 90, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-sm"
                    style={{ height: `${h}%`, background: accentColor }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
        {t(`settings.theme.${mode === "auto" ? "system" : mode}`)}
        {" · "}
        {t(`settings.theme.color.${accent}`)}
        {" · glass "}
        {t(`settings.glassDensity.${glassDensity}`).toLowerCase()}
      </p>
    </div>
  );
}

export function AppearanceSettings(props: Props) {
  const { t } = useTranslation();
  const {
    mode,
    setMode,
    accent,
    setAccent,
    glassDensity,
    setGlassDensity,
    language,
    setLanguage,
    clock24h,
    setClock24h,
    editModeAllowed,
    setEditModeAllowed,
    editModePasscode,
    setEditModePasscode,
    uiSoundEnabled,
    setUiSoundEnabled,
    dashboardId,
    pageBackground,
    pageBackgroundLight,
    pageBackgroundDark,
    uploadingBg,
    uploadingBgLight,
    uploadingBgDark,
    onUploadFallback,
    onRemoveFallback,
    onUploadLight,
    onRemoveLight,
    onUploadDark,
    onRemoveDark,
    onSetSameBackground,
  } = props;

  const [sameForBoth, setSameForBoth] = useState(() => {
    if (pageBackgroundLight && pageBackgroundDark && pageBackgroundLight === pageBackgroundDark) {
      return true;
    }
    return Boolean(pageBackground) && !pageBackgroundLight && !pageBackgroundDark;
  });

  useEffect(() => {
    if (pageBackgroundLight && pageBackgroundDark && pageBackgroundLight === pageBackgroundDark) {
      setSameForBoth(true);
    } else if (pageBackground && !pageBackgroundLight && !pageBackgroundDark) {
      setSameForBoth(true);
    }
  }, [pageBackground, pageBackgroundLight, pageBackgroundDark]);

  const previewBg = useMemo(() => {
    const dark =
      mode === "dark" ||
      (mode === "auto" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (sameForBoth) return pageBackground || pageBackgroundLight || pageBackgroundDark;
    if (dark) return pageBackgroundDark || pageBackground || pageBackgroundLight;
    return pageBackgroundLight || pageBackground || pageBackgroundDark;
  }, [mode, sameForBoth, pageBackground, pageBackgroundLight, pageBackgroundDark]);

  const accentNames = {
    purple: t("settings.theme.color.purple"),
    indigo: t("settings.theme.color.indigo"),
    blue: t("settings.theme.color.blue"),
    teal: t("settings.theme.color.teal"),
    green: t("settings.theme.color.green"),
    orange: t("settings.theme.color.orange"),
    rose: t("settings.theme.color.rose"),
    fuchsia: t("settings.theme.color.fuchsia"),
  } satisfies Record<ThemeAccentId, string>;

  const timeExample = clock24h ? "14:32" : "2:32 PM";

  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(11rem,13rem)]">
      <section
        aria-label={t("settings.appearance.preview")}
        className="order-1 w-full max-w-[13rem] xl:sticky xl:top-2 xl:order-2 xl:max-w-none"
      >
        <AppearanceLivePreview
          mode={mode}
          accent={accent}
          glassDensity={glassDensity}
          backgroundUrl={previewBg}
        />
      </section>

      <div className="order-2 flex min-w-0 flex-col gap-4 xl:order-1">
        <div className="space-y-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10 sm:p-5">
          <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">
            {t("settings.theme.interface")}
          </h2>
          <SettingsChoiceCards
            label=""
            value={mode}
            onChange={(id) => setMode(id)}
            options={[
              {
                id: "light" satisfies ThemeMode,
                label: t("settings.theme.light"),
                description: t("settings.theme.lightHint"),
                preview: <ThemePreview variant="light" />,
              },
              {
                id: "dark" satisfies ThemeMode,
                label: t("settings.theme.dark"),
                description: t("settings.theme.darkHint"),
                preview: <ThemePreview variant="dark" />,
              },
              {
                id: "auto" satisfies ThemeMode,
                label: t("settings.theme.system"),
                description: t("settings.theme.systemHint"),
                preview: <ThemePreview variant="auto" />,
              },
            ]}
          />
        </div>

        <div className="space-y-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">
              {t("settings.theme.color")}
            </h2>
            <span className="text-[13px] text-gray-500 dark:text-gray-400">
              {accentNames[accent]} · {t("settings.theme.colorHintShort")}
            </span>
          </div>
          <div role="radiogroup" aria-label={t("settings.theme.color")} className="flex flex-wrap gap-2">
            {THEME_ACCENTS.map((item) => {
              const on = item.id === accent;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={accentNames[item.id]}
                  onClick={() => setAccent(item.id)}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full",
                    on && "ring-[3px] ring-white ring-offset-2 ring-offset-[rgb(var(--brand))]"
                  )}
                  style={{ background: accentRgbCss(item.rgb) }}
                >
                  {on ? <Check className="h-[18px] w-[18px] text-white" strokeWidth={3} aria-hidden /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10 sm:p-5">
          <div className="min-w-0 flex-1 basis-[220px]">
            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">
              {t("settings.glassDensity")}
            </h2>
            <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
              {t("settings.glassDensity.hint")}
            </p>
          </div>
          <div className="min-w-[280px] flex-1">
            <SettingsChipSelect
              label=""
              variant="segmented"
              value={glassDensity}
              onChange={(id) => setGlassDensity(id as GlassDensity)}
              items={GLASS_DENSITIES.map((id) => ({
                id,
                label: t(`settings.glassDensity.${id}`),
              }))}
            />
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">
                {t("settings.pageBackground")}
              </h2>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {sameForBoth
                  ? t("settings.pageBackground.sameHint")
                  : t("settings.pageBackground.splitHint")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t("settings.pageBackground.sameForBoth")}
              </span>
              <SettingsToggle
                compact
                checked={sameForBoth}
                onChange={(v) => {
                  setSameForBoth(v);
                  onSetSameBackground(v);
                }}
                label={t("settings.pageBackground.sameForBoth")}
              />
            </div>
          </div>

          {!dashboardId ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("settings.pageBackground.needDashboard")}
            </p>
          ) : sameForBoth ? (
            <SettingsImagePick
              label={t("settings.pageBackground.bothThemes")}
              url={pageBackground || pageBackgroundLight || pageBackgroundDark}
              uploading={uploadingBg || uploadingBgLight || uploadingBgDark}
              onUpload={onUploadFallback}
              onRemove={onRemoveFallback}
              addLabel={t("settings.pageBackground.add")}
              uploadingLabel={t("settings.screensaver.uploading")}
              removeLabel={t("settings.pageBackground.remove")}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SettingsImagePick
                label={t("settings.pageBackground.lightTheme")}
                url={pageBackgroundLight || pageBackground}
                uploading={uploadingBgLight}
                onUpload={onUploadLight}
                onRemove={onRemoveLight}
                addLabel={t("settings.pageBackground.add")}
                uploadingLabel={t("settings.screensaver.uploading")}
                removeLabel={t("settings.pageBackground.remove")}
              />
              <SettingsImagePick
                label={t("settings.pageBackground.darkTheme")}
                url={pageBackgroundDark || pageBackground}
                uploading={uploadingBgDark}
                onUpload={onUploadDark}
                onRemove={onRemoveDark}
                addLabel={t("settings.pageBackground.add")}
                uploadingLabel={t("settings.screensaver.uploading")}
                removeLabel={t("settings.pageBackground.remove")}
              />
            </div>
          )}
        </div>

        <div className="space-y-1 rounded-2xl bg-white/70 p-4 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10 sm:p-5">
          <div className="mb-2">
            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white">
              {t("settings.appearance.languageTime")}
            </h2>
            <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
              {t("settings.appearance.languageTimeHint")}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.05] py-2.5 dark:border-white/10">
            <label htmlFor="appearance-lang" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("settings.language.setting")}
            </label>
            <SettingsSelect
              id="appearance-lang"
              value={language}
              onChange={(e) => {
                const next = e.target.value;
                if (next === "en" || next === "nl") setLanguage(next);
              }}
              className="min-h-11 min-w-[240px] max-w-full"
            >
              <option value="en">{t("settings.language.en")}</option>
              <option value="nl">{t("settings.language.nl")}</option>
            </SettingsSelect>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.05] pt-2.5 dark:border-white/10">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {t("settings.appearance.timeFormat")}
              </p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                {t("settings.appearance.timeShowsAs").replace("{time}", timeExample)}
              </p>
            </div>
            <div className="min-w-[220px]">
              <SettingsChipSelect
                label=""
                variant="segmented"
                value={clock24h ? "24" : "12"}
                onChange={(id) => setClock24h(id === "24")}
                items={[
                  { id: "24", label: t("settings.screensaver.24h") },
                  { id: "12", label: t("settings.screensaver.12hShort") },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1 rounded-2xl bg-white/70 p-4 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10 sm:p-5">
          <h2 className="mb-2 text-[17px] font-bold text-gray-900 dark:text-white">
            {t("settings.appearance.interaction")}
          </h2>
          <div className="border-t border-black/[0.05] py-2.5 dark:border-white/10">
            <SettingsToggle
              checked={editModeAllowed}
              onChange={setEditModeAllowed}
              label={t("settings.dashboard.editModeAllowed")}
              description={t("settings.dashboard.editModeAllowedHint")}
            />
          </div>
          {editModeAllowed ? (
            <div className="border-t border-black/[0.05] py-2.5 dark:border-white/10">
              <SettingsField
                label={t("settings.dashboard.editModePasscode")}
                hint={t("settings.dashboard.editModePasscodeHint")}
                htmlFor="edit-mode-passcode"
              >
                <SettingsInput
                  id="edit-mode-passcode"
                  type="password"
                  value={editModePasscode}
                  onChange={(e) => setEditModePasscode(e.target.value)}
                  placeholder={t("settings.dashboard.editModePasscodePlaceholder")}
                  autoComplete="off"
                  className="max-w-xs"
                />
              </SettingsField>
            </div>
          ) : null}
          <div className="border-t border-black/[0.05] pt-2.5 dark:border-white/10">
            <SettingsToggle
              checked={uiSoundEnabled}
              onChange={(v) => {
                setUiSoundEnabled(v);
                if (v) playUiClick();
              }}
              label={t("settings.uiSounds")}
              description={t("settings.uiSounds.hint")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
