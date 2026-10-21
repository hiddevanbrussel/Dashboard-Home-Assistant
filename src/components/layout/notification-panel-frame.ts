export const NOTIFICATION_PANEL_MARGIN_PX = 8;
export const NOTIFICATION_PANEL_WIDTH_PX = 320;

export type NotificationPanelAnchor = {
  right: number;
  bottom: number;
};

export type NotificationPanelViewport = {
  width: number;
  height: number;
};

export type NotificationPanelFrame = {
  maxHeight: number;
  width: number;
};

/**
 * Size the bell panel from the trigger and the viewport.
 * Sidebar panels grow upward from the trigger; header panels grow downward.
 * Both stay `NOTIFICATION_PANEL_MARGIN_PX` inside the viewport.
 */
export function notificationPanelFrame(
  placement: "header" | "sidebar",
  anchor: NotificationPanelAnchor,
  viewport: NotificationPanelViewport
): NotificationPanelFrame {
  const margin = NOTIFICATION_PANEL_MARGIN_PX;
  switch (placement) {
    case "sidebar": {
      const left = anchor.right + margin;
      return {
        maxHeight: Math.max(0, anchor.bottom - margin),
        width: Math.min(NOTIFICATION_PANEL_WIDTH_PX, Math.max(0, viewport.width - left - margin)),
      };
    }
    case "header": {
      const top = anchor.bottom + 4;
      return {
        maxHeight: Math.max(0, viewport.height - top - margin),
        width: Math.min(NOTIFICATION_PANEL_WIDTH_PX, Math.max(0, anchor.right - margin)),
      };
    }
    default: {
      const unreachable: never = placement;
      return unreachable;
    }
  }
}
