"use client";

import { ChevronRight, MoreVertical } from "lucide-react";
import type { TrashCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  TRASH_CARD_DEFAULT_HEIGHT,
  TRASH_CARD_DEFAULT_WIDTH,
  clampTrashCardHeight,
  clampTrashCardWidth,
  formatTrashPickupDate,
  formatTrashTypeLabel,
  resolveTrashPickup,
  trashCardDensity,
  trashDemoPickup,
  trashThemeAssets,
  type TrashLocale,
  type TrashTheme,
} from "@/lib/trash-card";

function useTrashPickup(
  entityId: string | undefined,
  dateEntityId: string | undefined,
  demoTheme: TrashTheme
) {
  // Read `states[id]` + `updatedAt` so theme art re-renders as soon as HA state changes.
  const primary = useEntityStateStore((s) => (entityId ? s.states[entityId] : undefined));
  const dateEnt = useEntityStateStore((s) =>
    dateEntityId ? s.states[dateEntityId] : undefined
  );
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
    return { pickup: trashDemoPickup(demoTheme), isDemo: true };
  }
  return { pickup: live, isDemo: false };
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
  const { pickup } = useTrashPickup(entity_id, date_entity_id, demoTheme);

  const cardW = clampTrashCardWidth(width ?? TRASH_CARD_DEFAULT_WIDTH);
  const cardH = clampTrashCardHeight(height ?? TRASH_CARD_DEFAULT_HEIGHT);
  const compact = trashCardDensity(cardW, cardH) === "compact";
  // Theme drives background, person art, icon, and accent together.
  const theme = pickup.theme;
  const assets = trashThemeAssets(theme);
  const typeLabel = formatTrashTypeLabel(theme, pickup.typeRaw, locale);
  const dateLabel = formatTrashPickupDate(pickup.date, locale);
  const heading =
    title?.trim() || t("trashCard.nextCollection");

  return (
    <div
      className={cn(
        "relative h-full w-full min-h-0 overflow-hidden rounded-2xl shadow-xl",
        className
      )}
      style={{ width: "100%", height: "100%" }}
      data-trash-theme={theme}
    >
      {/* Background scene — <img> so theme swaps apply immediately (CSS bg can stick). */}
      <img
        key={`bg-${theme}`}
        src={withBasePath(assets.background)}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover object-center [-webkit-user-drag:none]"
        aria-hidden
      />
      {/* Soft scrim for dark mode readability */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-black/0 dark:bg-black/25"
        aria-hidden
      />

      {/* Character + bin */}
      <img
        key={`person-${theme}`}
        src={withBasePath(assets.person)}
        alt=""
        draggable={false}
        className="pointer-events-none absolute bottom-0 right-[-4%] z-[1] h-[78%] w-auto max-w-[70%] select-none object-contain object-bottom [-webkit-user-drag:none]"
      />

      {/* Edit affordance — top-right of the card, same as other floating cards */}
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
            "absolute z-[4] rounded-lg p-1.5 text-white/85 transition-colors hover:bg-black/20 hover:text-white",
            compact ? "right-2 top-2" : "right-2.5 top-2.5"
          )}
          aria-label={t("common.options")}
        >
          <MoreVertical className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        </button>
      ) : null}

      {/* Title — top-left; sized up for readability (edit button stays top-right) */}
      <div
        className={cn(
          "relative z-[2] max-w-[72%]",
          compact ? "px-3.5 pt-3.5" : "px-5 pt-5"
        )}
      >
        <p
          className={cn(
            "font-semibold leading-snug text-white drop-shadow-sm",
            compact ? "text-base" : "text-lg sm:text-xl"
          )}
        >
          {heading}
        </p>
        <div
          className={cn("mt-1.5 rounded-full", compact ? "h-0.5 w-7" : "h-1 w-9")}
          style={{ backgroundColor: assets.accent }}
          aria-hidden
        />
      </div>

      {/* Floating info chip — anchored near the bottom edge of the card */}
      <div
        className={cn(
          "absolute z-[3] flex max-w-[78%] items-center gap-2 rounded-xl bg-white shadow-lg dark:bg-white",
          compact
            ? "bottom-2 left-3 gap-1.5 px-1.5 py-1.5"
            : "bottom-2.5 left-4 gap-2.5 px-2 py-2"
        )}
      >
        <img
          key={`icon-${theme}`}
          src={withBasePath(assets.icon)}
          alt=""
          draggable={false}
          className={cn(
            "shrink-0 rounded-lg object-cover [-webkit-user-drag:none]",
            compact ? "h-9 w-9" : "h-11 w-11"
          )}
        />
        <div className="min-w-0 flex-1 pr-0.5">
          <p
            className={cn(
              "truncate font-semibold leading-tight text-zinc-900",
              compact ? "text-sm" : "text-[15px]"
            )}
          >
            {typeLabel}
          </p>
          <p
            className={cn(
              "truncate leading-tight text-zinc-500",
              compact ? "text-[11px]" : "text-xs"
            )}
          >
            {dateLabel}
          </p>
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full",
            compact ? "h-6 w-6" : "h-7 w-7"
          )}
          style={{ backgroundColor: `${assets.accent}22`, color: assets.accent }}
          aria-hidden
        >
          <ChevronRight className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </span>
      </div>
    </div>
  );
}
