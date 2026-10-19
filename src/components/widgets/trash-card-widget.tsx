"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import type { TrashCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  TRASH_CARD_DEFAULT_HEIGHT,
  TRASH_CARD_DEFAULT_WIDTH,
  buildTrashSchedule,
  clampTrashCardHeight,
  clampTrashCardWidth,
  formatTrashPickupDate,
  formatTrashPickupDateShort,
  formatTrashTypeLabel,
  resolveTrashPickup,
  trashCardDensity,
  trashDemoPickup,
  trashThemeChipStyle,
  type TrashLocale,
  type TrashPickup,
  type TrashTheme,
} from "@/lib/trash-card";

function useTrashSchedule(
  entityId: string | undefined,
  dateEntityId: string | undefined,
  demoTheme: TrashTheme
) {
  const primary = useEntityStateStore((s) => (entityId ? s.states[entityId] : undefined));
  const dateEnt = useEntityStateStore((s) =>
    dateEntityId ? s.states[dateEntityId] : undefined
  );
  const allStates = useEntityStateStore((s) => s.states);
  useEntityStateStore((s) => s.updatedAt);

  const hasBinding = Boolean(entityId || dateEntityId);
  const live = resolveTrashPickup({
    primaryEntity: primary
      ? { entity_id: entityId, state: primary.state, attributes: primary.attributes }
      : entityId
        ? { entity_id: entityId, state: null, attributes: {} }
        : null,
    dateEntity: dateEnt
      ? { entity_id: dateEntityId, state: dateEnt.state, attributes: dateEnt.attributes }
      : dateEntityId
        ? { entity_id: dateEntityId, state: null, attributes: {} }
        : null,
    fallbackTheme: demoTheme,
  });

  if (!hasBinding || !live) {
    const featured = trashDemoPickup(demoTheme);
    const upcoming = (["gft", "pmd", "restafval"] as TrashTheme[])
      .filter((theme) => theme !== featured.theme)
      .map((theme) => trashDemoPickup(theme));
    return { featured, upcoming, isDemo: true };
  }

  const related = Object.entries(allStates)
    .filter(([id]) => id !== entityId && id !== dateEntityId)
    .map(([id, ent]) => ({
      entity_id: id,
      state: ent.state,
      attributes: ent.attributes,
    }));

  return {
    ...buildTrashSchedule({
      primary: live,
      entities: related,
      fallbackTheme: demoTheme,
    }),
    isDemo: false,
  };
}

function BinChip({
  theme,
  size,
}: {
  theme: TrashTheme;
  size: "lg" | "sm";
}) {
  const chip = trashThemeChipStyle(theme);
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl",
        chip.bg,
        chip.fg,
        size === "lg" ? "h-14 w-14" : "h-11 w-11"
      )}
      aria-hidden
    >
      <Trash2 className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} strokeWidth={1.75} />
    </div>
  );
}

function UpcomingCell({
  pickup,
  locale,
}: {
  pickup: TrashPickup;
  locale: TrashLocale;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5">
      <BinChip theme={pickup.theme} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight text-[#1B2437] dark:text-white/90">
          {formatTrashTypeLabel(pickup.theme, pickup.typeRaw, locale)}
        </p>
        <p className="truncate text-[12px] font-medium text-[#7A879C] dark:text-white/45">
          {formatTrashPickupDateShort(pickup.date, locale)}
        </p>
      </div>
    </div>
  );
}

export function TrashCardWidget({
  title,
  entity_id,
  date_entity_id,
  demo_theme,
  width,
  height,
  className,
  onMoreClick,
}: TrashCardProps & {
  className?: string;
  onMoreClick?: () => void;
}) {
  const { t, language } = useTranslation();
  const locale: TrashLocale = language === "nl" ? "nl" : "en";
  const demoTheme = (demo_theme === "restafval" || demo_theme === "pmd" ? demo_theme : "gft") as TrashTheme;
  const { featured, upcoming } = useTrashSchedule(entity_id, date_entity_id, demoTheme);

  const cardW = clampTrashCardWidth(width ?? TRASH_CARD_DEFAULT_WIDTH);
  const cardH = clampTrashCardHeight(height ?? TRASH_CARD_DEFAULT_HEIGHT);
  const compact = trashCardDensity(cardW, cardH) === "compact";
  const heading = title?.trim() || t("trashCard.nextCollection");
  const featuredLabel = formatTrashTypeLabel(featured.theme, featured.typeRaw, locale);
  const featuredDate = formatTrashPickupDate(featured.date, locale);

  return (
    <div
      className={cn(
        "glass-surface relative h-full w-full min-h-0 overflow-hidden rounded-[1.35rem] text-[#1B2437] shadow-[0_12px_36px_rgba(15,23,42,0.08)] dark:text-white dark:shadow-[0_12px_36px_rgba(0,0,0,0.35)]",
        className
      )}
      style={{ width: "100%", height: "100%" }}
      data-trash-theme={featured.theme}
    >
      {onMoreClick ? (
        <button
          type="button"
          data-no-drag
          data-no-page-swipe
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick();
          }}
          className={cn(
            "absolute z-[4] rounded-lg p-1.5 text-[#1B2437]/30 transition-colors hover:bg-black/5 hover:text-[#1B2437]/65 dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-white/65",
            compact ? "right-2 top-2" : "right-2.5 top-2.5"
          )}
          aria-label={t("common.options")}
        >
          <MoreVertical className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        </button>
      ) : null}

      <div
        className={cn(
          "relative z-[2] flex h-full min-h-0 flex-col",
          compact ? "gap-4 px-3.5 py-3.5" : "gap-5 px-5 py-5"
        )}
      >
        <h2
          className={cn(
            "pr-8 font-semibold tracking-tight text-[#1B2437] dark:text-white",
            compact ? "text-[1.05rem]" : "text-[1.2rem]"
          )}
        >
          {heading}
        </h2>

        <div className="flex min-w-0 items-center gap-3.5">
          <BinChip theme={featured.theme} size="lg" />
          <div className="min-w-0">
            <p
              className={cn(
                "truncate font-bold tracking-tight text-[#1B2437] dark:text-white",
                compact ? "text-base" : "text-lg"
              )}
            >
              {featuredLabel}
            </p>
            <p
              className={cn(
                "truncate font-medium text-[#7A879C] dark:text-white/50",
                compact ? "text-[13px]" : "text-[15px]"
              )}
            >
              {featuredDate}
            </p>
          </div>
        </div>

        {upcoming.length > 0 ? (
          <div className="mt-auto flex items-stretch gap-3 border-t border-[#1B2437]/08 pt-4 dark:border-white/10">
            {upcoming.map((pickup, index) => (
              <div key={`${pickup.theme}-${index}`} className="flex min-w-0 flex-1 items-stretch">
                {index > 0 ? (
                  <div className="mr-3 w-px self-stretch bg-[#1B2437]/10 dark:bg-white/10" aria-hidden />
                ) : null}
                <UpcomingCell pickup={pickup} locale={locale} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
