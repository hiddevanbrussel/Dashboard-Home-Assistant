"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { useTranslation } from "@/hooks/use-translation";
import { THEME_ACCENTS, accentRgbCss, type ThemeAccentId } from "@/lib/theme-accents";
import { GLASS_DENSITIES, type GlassDensity } from "@/lib/glass-density";
import type { ThemeMode } from "@/stores/theme-store";
import type { Language } from "@/stores/language-store";
import { SettingsField, SettingsInput, SettingsSelect, SettingsToggle } from "@/components/settings/settings-panel";
import {
  SettingsBlockLabel,
  SettingsDisclosure,
  SettingsGroup,
  SettingsRow,
  SettingsSegment,
  SettingsSwatch,
} from "@/components/settings/settings-chrome";
import { playUiClick } from "@/lib/ui-click";

export type AppearancePart = "uiterlijk" | "taal" | "bediening";

type Props = {
  part: AppearancePart;
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

function BackgroundThumb({ url }: { url: string | null }) {
  return (
    <span
      className="block h-10 w-16 shrink-0 rounded-[10px] border border-[rgba(17,24,39,0.08)] bg-[#f2f0fe] bg-cover bg-center dark:border-white/10 dark:bg-[#0a0014]"
      style={url ? { backgroundImage: `url(${withBasePath(url)})` } : undefined}
      aria-hidden
    />
  );
}

function ChooseImageButton({
  label,
  uploading,
  uploadingLabel,
  onUpload,
}: {
  label: string;
  uploading: boolean;
  uploadingLabel: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[rgba(17,24,39,0.08)] bg-white px-4 text-[15px] font-semibold text-[#111827] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.08)] dark:border-white/10 dark:bg-[#1b1a21] dark:text-[#f3f4f6] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] ${uploading ? "pointer-events-none opacity-50" : ""}`}
    >
      <ImagePlus className="h-4 w-4" aria-hidden />
      {uploading ? uploadingLabel : label}
      <input type="file" accept="image/*" className="sr-only" onChange={onUpload} disabled={uploading} />
    </label>
  );
}

export function AppearanceSettings(props: Props) {
  const { t } = useTranslation();
  const {
    part,
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
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    if (pageBackgroundLight && pageBackgroundDark && pageBackgroundLight === pageBackgroundDark) {
      setSameForBoth(true);
    } else if (pageBackground && !pageBackgroundLight && !pageBackgroundDark) {
      setSameForBoth(true);
    }
  }, [pageBackground, pageBackgroundLight, pageBackgroundDark]);

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

  const sharedUrl = pageBackground || pageBackgroundLight || pageBackgroundDark;
  const timeExample = clock24h ? "14:32" : "2:32 PM";

  if (part === "taal") {
    return (
      <div>
        <SettingsBlockLabel>{t("settings.appearance.languageTime")}</SettingsBlockLabel>
        <SettingsGroup>
          <SettingsRow title={t("settings.language.setting")} hint={t("settings.appearance.languageTimeHint")}>
            <SettingsSelect
              id="appearance-lang"
              value={language}
              onChange={(e) => {
                const next = e.target.value;
                if (next === "en" || next === "nl") setLanguage(next);
              }}
              aria-label={t("settings.language.setting")}
              className="min-h-12 min-w-[12rem]"
            >
              <option value="en">{t("settings.language.en")}</option>
              <option value="nl">{t("settings.language.nl")}</option>
            </SettingsSelect>
          </SettingsRow>
          <SettingsRow
            title={t("settings.appearance.timeFormat")}
            hint={t("settings.appearance.timeShowsAs").replace("{time}", timeExample)}
          >
            <SettingsSegment
              label={t("settings.appearance.timeFormat")}
              value={clock24h ? "24" : "12"}
              onChange={(id) => setClock24h(id === "24")}
              options={[
                { id: "24", label: t("settings.screensaver.24h") },
                { id: "12", label: t("settings.screensaver.12hShort") },
              ]}
            />
          </SettingsRow>
        </SettingsGroup>
      </div>
    );
  }

  if (part === "bediening") {
    return (
      <div>
        <SettingsBlockLabel>{t("settings.appearance.interaction")}</SettingsBlockLabel>
        <SettingsGroup>
          <div className="border-t border-[rgba(17,24,39,0.08)] px-5 py-3 first:border-t-0 dark:border-white/10">
            <SettingsToggle
              checked={editModeAllowed}
              onChange={setEditModeAllowed}
              label={t("settings.dashboard.editModeAllowed")}
              description={t("settings.dashboard.editModeAllowedHint")}
            />
          </div>
          {editModeAllowed ? (
            <div className="border-t border-[rgba(17,24,39,0.08)] px-5 py-4 dark:border-white/10">
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
          <div className="border-t border-[rgba(17,24,39,0.08)] px-5 py-3 dark:border-white/10">
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
        </SettingsGroup>
      </div>
    );
  }

  const backgroundHint = !sharedUrl
    ? t("settings.pageBackground.none")
    : sameForBoth
      ? t("settings.pageBackground.sameHint")
      : t("settings.pageBackground.splitHint");

  return (
    <div>
      <SettingsBlockLabel>{t("settings.theme.interface")}</SettingsBlockLabel>
      <SettingsGroup>
        <SettingsRow title={t("settings.sections.displayMode")} hint={t("settings.theme.systemFollows")}>
          <SettingsSegment
            label={t("settings.sections.displayMode")}
            value={mode}
            onChange={setMode}
            options={[
              { id: "light" satisfies ThemeMode, label: t("settings.theme.light") },
              { id: "dark" satisfies ThemeMode, label: t("settings.theme.dark") },
              { id: "auto" satisfies ThemeMode, label: t("settings.theme.system") },
            ]}
          />
        </SettingsRow>
        <SettingsRow tall title={t("settings.theme.color")} hint={t("settings.theme.colorForMenu")}>
          <div role="radiogroup" aria-label={t("settings.theme.color")} className="flex flex-nowrap gap-0">
            {THEME_ACCENTS.map((item) => (
              <SettingsSwatch
                key={item.id}
                color={accentRgbCss(item.rgb)}
                label={accentNames[item.id]}
                selected={item.id === accent}
                onSelect={() => setAccent(item.id)}
              />
            ))}
          </div>
        </SettingsRow>
      </SettingsGroup>

      <SettingsBlockLabel>{t("settings.sections.background")}</SettingsBlockLabel>
      <SettingsGroup>
        <SettingsRow title={t("settings.pageBackground")} hint={backgroundHint}>
          {!dashboardId ? null : sameForBoth ? (
            <>
              <BackgroundThumb url={sharedUrl} />
              <ChooseImageButton
                label={t("settings.pageBackground.choose")}
                uploading={uploadingBg || uploadingBgLight || uploadingBgDark}
                uploadingLabel={t("settings.screensaver.uploading")}
                onUpload={onUploadFallback}
              />
              {sharedUrl ? (
                <button
                  type="button"
                  onClick={onRemoveFallback}
                  className="inline-flex h-11 items-center rounded-xl px-3 text-[15px] font-semibold text-[#111827] dark:text-[#f3f4f6]"
                >
                  {t("settings.pageBackground.remove")}
                </button>
              ) : null}
            </>
          ) : (
            <BackgroundThumb url={pageBackgroundLight || pageBackgroundDark || pageBackground} />
          )}
        </SettingsRow>
        {!dashboardId ? (
          <p className="border-t border-[rgba(17,24,39,0.08)] px-5 py-3 text-sm text-[#4b5563] dark:border-white/10 dark:text-[#c4c4cc]">
            {t("settings.pageBackground.needDashboard")}
          </p>
        ) : null}
        <div className="border-t border-[rgba(17,24,39,0.08)] px-5 py-3 first:border-t-0 dark:border-white/10">
          <SettingsToggle
            checked={sameForBoth}
            onChange={(v) => {
              setSameForBoth(v);
              onSetSameBackground(v);
            }}
            label={t("settings.pageBackground.sameForLightDark")}
            description={t("settings.pageBackground.sameOff")}
          />
        </div>
        {dashboardId && !sameForBoth ? (
          <>
            <SettingsRow title={t("settings.pageBackground.lightTheme")}>
              <BackgroundThumb url={pageBackgroundLight || pageBackground} />
              <ChooseImageButton
                label={t("settings.pageBackground.choose")}
                uploading={uploadingBgLight}
                uploadingLabel={t("settings.screensaver.uploading")}
                onUpload={onUploadLight}
              />
              {(pageBackgroundLight || pageBackground) ? (
                <button
                  type="button"
                  onClick={onRemoveLight}
                  className="inline-flex h-11 items-center rounded-xl px-3 text-[15px] font-semibold text-[#111827] dark:text-[#f3f4f6]"
                >
                  {t("settings.pageBackground.remove")}
                </button>
              ) : null}
            </SettingsRow>
            <SettingsRow title={t("settings.pageBackground.darkTheme")}>
              <BackgroundThumb url={pageBackgroundDark || pageBackground} />
              <ChooseImageButton
                label={t("settings.pageBackground.choose")}
                uploading={uploadingBgDark}
                uploadingLabel={t("settings.screensaver.uploading")}
                onUpload={onUploadDark}
              />
              {(pageBackgroundDark || pageBackground) ? (
                <button
                  type="button"
                  onClick={onRemoveDark}
                  className="inline-flex h-11 items-center rounded-xl px-3 text-[15px] font-semibold text-[#111827] dark:text-[#f3f4f6]"
                >
                  {t("settings.pageBackground.remove")}
                </button>
              ) : null}
            </SettingsRow>
          </>
        ) : null}
      </SettingsGroup>

      <div className="mt-4">
        <SettingsDisclosure
          title={t("settings.advanced")}
          hideTitle={t("settings.advanced.hide")}
          hint={t("settings.advanced.appearance")}
          open={advancedOpen}
          onToggle={() => setAdvancedOpen((v) => !v)}
        >
          <SettingsRow title={t("settings.glassDensity")} hint={t("settings.glassDensity.hint")}>
            <SettingsSegment
              label={t("settings.glassDensity")}
              value={glassDensity}
              onChange={(id) => setGlassDensity(id)}
              options={GLASS_DENSITIES.map((id) => ({
                id,
                label: t(`settings.glassDensity.${id}`),
              }))}
            />
          </SettingsRow>
        </SettingsDisclosure>
      </div>
    </div>
  );
}
