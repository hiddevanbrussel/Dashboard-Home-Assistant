"use client";

import { useState } from "react";
import { FloatingEnergyMonitorCard } from "@/components/widgets/floating-energy-monitor-card";

/**
 * Dev preview: drag the image card past the viewport edges (no Home Assistant).
 * Mimics the dashboard pager clip so hanging off-screen is cropped.
 */
export default function ImageCardDragPreviewPage() {
  const [editMode, setEditMode] = useState(true);
  const [size, setSize] = useState({ width: 360, height: 260 });

  return (
    <div className="min-h-screen bg-[#d8d4ea] text-gray-900">
      <div className="relative z-40 px-4 py-3">
        <h1 className="text-lg font-semibold">Image card drag preview</h1>
        <p className="mt-1 max-w-xl text-sm text-gray-600">
          Sleep de kaart tot over de rand. Een klein stuk blijft zichtbaar zodat je hem terug kunt pakken.
        </p>
        <button
          type="button"
          className="mt-3 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white"
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? "Bewerkmodus aan" : "Bewerkmodus uit"}
        </button>
      </div>
      <div className="pointer-events-none fixed inset-0 z-30">
        <div className="h-full w-full overflow-hidden">
          <section data-dashboard-page className="relative h-full w-full">
            <FloatingEnergyMonitorCard
              title="Afbeelding"
              background_image="/weather-sunny.png"
              width={size.width}
              height={size.height}
              editMode={editMode}
              storageScope="dev-image-card-drag"
              widgetId="preview"
              onResize={setSize}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
