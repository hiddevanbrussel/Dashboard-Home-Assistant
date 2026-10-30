"use client";

import { SettingsToggle } from "@/components/settings/settings-panel";
import { useTranslation } from "@/hooks/use-translation";
import { ENERGY_MY_TILES_ENABLED } from "@/lib/energy-tab";

/** Shows the My tiles flag. Stays disabled so it cannot be switched on from Settings. */
export function EnergyMyTilesSetting() {
  const { t } = useTranslation();
  return (
    <SettingsToggle
      checked={ENERGY_MY_TILES_ENABLED}
      disabled
      onChange={() => undefined}
      label={t("settings.energy.myTiles")}
      description={t("settings.energy.myTilesHint")}
    />
  );
}
