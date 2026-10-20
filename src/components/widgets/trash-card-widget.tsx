"use client";

import { memo, useMemo } from "react";
import { MoreVertical } from "lucide-react";
import type { TrashCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  TRASH_CARD_DEFAULT_HEIGHT,
  TRASH_CARD_DEFAULT_WIDTH,
  buildTrashSchedule,
  clampTrashCardHeight,
  clampTrashCardWidth,
  discoverTrashFractionEntities,
  formatTrashPickupDate,
  formatTrashPickupDateShort,
  formatTrashTypeLabel,
  mergeTrashFractionEntities,
  normalizeTrashFractionEntityIds,
  resolveTrashPickup,
  trashCardDensity,
  trashContainerImageSrc,
  trashDemoSchedule,
  trashFractionEntityIdsList,
  type TrashFractionEntityIds,
  type TrashLocale,
  type TrashPickup,
  type TrashTheme,
} from "@/lib/trash-card";

function useTrashSchedule(
  entityId: string | undefined,
  dateEntityId: string | undefined,
  fractionOverrides: TrashFractionEntityIds | undefined,
  /** Dev / unbound showcase only — ignored when HA entities are bound. */
  showcaseTheme?: TrashTheme
) {
  const primary = useEntityStateStore((s) => (entityId ? s.states[entityId] : undefined));
  const dateEnt = useEntityStateStore((s) =>
    dateEntityId ? s.states[dateEntityId] : undefined
  );
  // Recompute when HA state ticks — discovery reads the latest map inside the memo.
  const updatedAt = useEntityStateStore((s) => s.updatedAt);

  return useMemo(() => {
    const states = useEntityStateStore.getState().states;
    const snapshots = Object.values(states).map((ent) => ({
      entity_id: ent.entity_id,
      state: ent.state,
      attributes: ent.attributes,
    }));
    const discovered = discoverTrashFractionEntities(snapshots);
    const resolvedFractions = mergeTrashFractionEntities(discovered, fractionOverrides);
    const fractionIds = trashFractionEntityIdsList(resolvedFractions);

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
      fallbackTheme: "gft",
    });

    // Include every resolved fraction sensor — dates must come from these entities,
    // not from demo Fridays. Primary/date bindings still win via `live` when present.
    const related = fractionIds
      .map((id) => states[id])
      .filter(Boolean)
      .map((ent) => ({
        entity_id: ent.entity_id,
        state: ent.state,
        attributes: ent.attributes,
      }));

    const hasBinding = Boolean(entityId || dateEntityId || fractionIds.length > 0);

    if (!hasBinding) {
      // Unbound cards follow next-fraction order unless a showcase theme is forced (dev preview).
      if (showcaseTheme) {
        return {
          ...trashDemoSchedule(showcaseTheme),
          isDemo: true,
          discovered,
          resolvedFractions,
        };
      }
      return {
        ...buildTrashSchedule({ primary: null, fallbackTheme: "gft", fillMissingWithDemo: true }),
        isDemo: true,
        discovered,
        resolvedFractions,
      };
    }

    return {
      ...buildTrashSchedule({
        primary: live,
        entities: related,
        fallbackTheme: live?.theme ?? "gft",
        // Never invent dates when HA fraction/type sensors are bound.
        fillMissingWithDemo: false,
      }),
      isDemo: false,
      discovered,
      resolvedFractions,
    };
  }, [entityId, dateEntityId, primary, dateEnt, updatedAt, showcaseTheme, fractionOverrides]);
}

function BinChip({
  theme,
  size,
}: {
  theme: TrashTheme;
  size: "lg" | "md" | "sm";
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- local static container art
    <img
      key={theme}
      src={withBasePath(trashContainerImageSrc(theme))}
      alt=""
      draggable={false}
      className={cn(
        "shrink-0 select-none object-contain object-bottom [-webkit-user-drag:none]",
        size === "lg" ? "h-28 w-28" : size === "md" ? "h-[4.5rem] w-[4.5rem]" : "h-10 w-10"
      )}
      aria-hidden
    />
  );
}

function UpcomingCell({
  pickup,
  locale,
  compact,
}: {
  pickup: TrashPickup;
  locale: TrashLocale;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1",
        compact ? "items-start gap-1.5" : "items-center gap-2.5"
      )}
    >
      <BinChip theme={pickup.theme} size="sm" />
      <div className="min-w-0 overflow-hidden">
        <p
          className={cn(
            "truncate font-semibold tracking-tight text-[#1B2437] dark:text-white/90",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {formatTrashTypeLabel(pickup.theme, pickup.typeRaw, locale, { compact })}
        </p>
        <p
          className={cn(
            "truncate font-medium tabular-nums text-[#4E5D73] dark:text-white/70",
            compact ? "text-[11px] leading-tight" : "whitespace-nowrap text-[13px]"
          )}
        >
          {formatTrashPickupDateShort(pickup.date, locale)}
        </p>
      </div>
    </div>
  );
}

export const TrashCardWidget = memo(function TrashCardWidget({
  title,
  entity_id,
  date_entity_id,
  fraction_entity_ids,
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
  const showcaseTheme =
    demo_theme === "restafval" || demo_theme === "pmd" || demo_theme === "gft"
      ? demo_theme
      : undefined;
  const fractionOverrides = useMemo(
    () => normalizeTrashFractionEntityIds(fraction_entity_ids),
    [fraction_entity_ids]
  );
  const { featured, upcoming } = useTrashSchedule(
    entity_id,
    date_entity_id,
    fractionOverrides,
    showcaseTheme
  );

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
          compact ? "gap-2.5 px-3 py-3" : "gap-4 px-5 py-5"
        )}
      >
        <h2
          className={cn(
            "pr-8 font-semibold tracking-tight text-[#1B2437] dark:text-white",
            compact ? "text-[0.98rem] leading-snug" : "text-[1.2rem]"
          )}
        >
          {heading}
        </h2>

        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 items-center",
            compact ? "gap-2.5" : "gap-4"
          )}
        >
          <BinChip theme={featured.theme} size={compact ? "md" : "lg"} />
          <div className="min-w-0">
            <p
              className={cn(
                "truncate font-bold tracking-tight text-[#1B2437] dark:text-white",
                compact ? "text-base" : "text-xl"
              )}
            >
              {featuredLabel}
            </p>
            <p
              className={cn(
                "font-medium tabular-nums text-[#4E5D73] dark:text-white/65",
                compact ? "mt-0.5 truncate text-xs" : "mt-1 whitespace-nowrap text-base"
              )}
            >
              {featuredDate}
            </p>
          </div>
        </div>

        {upcoming.length > 0 ? (
          <div
            className={cn(
              "flex shrink-0 items-stretch border-t border-[#1B2437]/08 dark:border-white/10",
              compact ? "gap-1.5 pt-2.5" : "gap-3 pt-3.5"
            )}
          >
            {upcoming.map((pickup, index) => (
              <div key={`${pickup.theme}-${index}`} className="flex min-w-0 flex-1 items-stretch">
                {index > 0 ? (
                  <div
                    className={cn(
                      "w-px self-stretch bg-[#1B2437]/10 dark:bg-white/10",
                      compact ? "mr-1.5" : "mr-3"
                    )}
                    aria-hidden
                  />
                ) : null}
                <UpcomingCell pickup={pickup} locale={locale} compact={compact} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
});
