"use client";

import {
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import { SettingsChipSelect } from "@/components/settings/settings-choice-cards";
import { useTranslation } from "@/hooks/use-translation";
import {
  getScreensaverPexelsApiKey,
  getScreensaverPexelsEnabled,
  getScreensaverPexelsQuery,
  getScreensaverPexelsType,
  setScreensaverPexelsApiKey,
  setScreensaverPexelsEnabled,
  setScreensaverPexelsQuery,
  setScreensaverPexelsType,
} from "@/stores/screensaver-store";
import { useEffect, useState } from "react";

export function PexelsSettings() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("nature landscape");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");

  useEffect(() => {
    setEnabled(getScreensaverPexelsEnabled());
    setApiKey(getScreensaverPexelsApiKey());
    setQuery(getScreensaverPexelsQuery());
    setMediaType(getScreensaverPexelsType());
  }, []);

  return (
    <>
      <SettingsToggle
        checked={enabled}
        onChange={(v) => {
          setEnabled(v);
          setScreensaverPexelsEnabled(v);
        }}
        label={t("settings.pexels.enabled")}
        description={t("settings.pexels.enabledHint")}
      />
      <SettingsGroup
        title={t("settings.pexels.connection")}
        description={
          <>
            {t("settings.pexels.keyHint")}{" "}
            <a href="https://www.pexels.com/api" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              pexels.com/api
            </a>
            .
          </>
        }
      >
        <SettingsField label={t("settings.screensaver.pexelsKey")} htmlFor="pexels-key">
          <SettingsInput
            id="pexels-key"
            type="password"
            value={apiKey}
            onChange={(e) => {
              const v = e.target.value;
              setApiKey(v);
              setScreensaverPexelsApiKey(v);
            }}
            placeholder={t("settings.screensaver.pexelsKey")}
            autoComplete="off"
          />
        </SettingsField>
        <SettingsField label={t("settings.screensaver.pexelsQuery")} htmlFor="pexels-query">
          <SettingsInput
            id="pexels-query"
            type="text"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              setScreensaverPexelsQuery(v);
            }}
            placeholder={t("settings.screensaver.pexelsQuery")}
          />
        </SettingsField>
        <SettingsChipSelect
          label={t("settings.screensaver.pexelsType")}
          items={[
            { id: "photo", label: t("settings.screensaver.pexelsTypePhoto") },
            { id: "video", label: t("settings.screensaver.pexelsTypeVideo") },
          ]}
          value={mediaType}
          onChange={(type) => {
            setMediaType(type);
            setScreensaverPexelsType(type);
          }}
        />
      </SettingsGroup>
    </>
  );
}
