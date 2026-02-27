"use client";

import { EntitySelectWithSearch } from "@/components/entity-select-with-search";
import { X } from "lucide-react";
import {
  CARD_ICON_OPTIONS,
  SENSOR_ICON_OPTIONS,
  SENSOR_CONDITION_COLORS,
  SENSOR_CONDITION_OPERATORS,
  SENSOR_CONDITION_OPERATOR_LABELS,
} from "@/components/widgets";
import type { WidgetConfig } from "@/stores/onboarding-store";
import ReactGridLayout from "react-grid-layout";
import type { UseMutationResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type LayoutItem = ReactGridLayout.Layout;
type Layout = LayoutItem[];

type EditForm = {
  title: string;
  textMode?: "title" | "subtitle" | "text";
  entity_id: string;
  consumption_entity_id?: string;
  show_icon?: boolean;
  background_image?: string;
  background_image_dark?: string;
  width?: number;
  height?: number;
  icon?: string;
  size?: string;
  conditions?: { operator: string; value: string; color: string }[];
  image_conditions?: { operator: string; value: string; image: string; image_dark?: string }[];
  current_entity_id?: string;
  max_value?: number;
  minimal?: boolean;
  scale?: number;
  label?: string;
  color?: string;
  icon_background_color?: string;
  device_entity_ids?: string[];
  device_names?: Record<string, string>;
  cost_per_kwh?: number;
};

type HaEntity = { entity_id: string; attributes?: Record<string, unknown> };

type EditPanelModalProps = {
  editingWidget: WidgetConfig;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  editTab: string;
  setEditTab: (tab: string) => void;
  entities: HaEntity[];
  widgets: WidgetConfig[];
  layout: Layout;
  welcomeTitle: string;
  welcomeSubtitle: string;
  saveMutation: UseMutationResult<unknown, Error, { layout: Layout; widgets: WidgetConfig[]; welcomeTitle?: string; welcomeSubtitle?: string }>;
  setEditingWidgetId: (id: string | null) => void;
  handleUpdateTile: (id: string, updates: Partial<WidgetConfig>) => void;
  handleRemoveTile: (id: string) => void;
  t: (key: string) => string;
  uploadingEnergyBg: boolean;
  setUploadingEnergyBg: (v: boolean) => void;
  uploadingEnergyBgDark: boolean;
  setUploadingEnergyBgDark: (v: boolean) => void;
  uploadingConditionImage: { idx: number; field: "image" | "image_dark" } | null;
  setUploadingConditionImage: (v: { idx: number; field: "image" | "image_dark" } | null) => void;
  sensorIconSearch: string;
  setSensorIconSearch: (v: string) => void;
  powerUsageDeviceSearch?: string;
  setPowerUsageDeviceSearch?: (v: string) => void;
};

export function EditPanelModal(props: EditPanelModalProps) {
  const {
    editingWidget,
    editForm,
    setEditForm,
    editTab,
    setEditTab,
    entities,
    widgets,
    layout,
    welcomeTitle,
    welcomeSubtitle,
    saveMutation,
    setEditingWidgetId,
    handleUpdateTile,
    handleRemoveTile,
    t,
    uploadingEnergyBg,
    setUploadingEnergyBg,
    uploadingEnergyBgDark,
    setUploadingEnergyBgDark,
    uploadingConditionImage,
    setUploadingConditionImage,
    sensorIconSearch,
    setSensorIconSearch,
    powerUsageDeviceSearch = "",
    setPowerUsageDeviceSearch = () => {},
  } = props;

  const getSaveUpdates = () => {
    const isCategoryCard = editingWidget.type === "text_card";
    if (isCategoryCard) {
      return {
        title: editForm.title,
        textMode: editForm.textMode ?? "title",
        show_icon: editForm.show_icon ?? false,
        icon: editForm.icon ?? "Type",
        width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
        entity_id: editForm.entity_id || undefined,
      };
    }
    const base: Partial<WidgetConfig> = { title: editForm.title };
    if (editingWidget.type === "solar_card") Object.assign(base, { entity_id: editForm.entity_id, consumption_entity_id: editForm.consumption_entity_id || undefined });
    if (editingWidget.type === "energy_monitor_card") Object.assign(base, { entity_id: editForm.entity_id || undefined, background_image: editForm.background_image || undefined, background_image_dark: editForm.background_image_dark || undefined, image_conditions: (editForm.image_conditions ?? []).filter((c) => c.image?.trim()).length > 0 ? (editForm.image_conditions ?? []).filter((c) => c.image?.trim()) : undefined, minimal: editForm.minimal ?? false, scale: editForm.scale ?? 1 });
    if (editingWidget.type === "power_usage_card") Object.assign(base, { entity_id: editForm.entity_id || undefined, cost_per_kwh: editForm.cost_per_kwh != null && editForm.cost_per_kwh > 0 ? editForm.cost_per_kwh : undefined, width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined, height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined });
    if (editingWidget.type === "device_consumption_card") {
      const dn = editForm.device_names ?? {};
      const hasCustomNames = Object.values(dn).some((v) => v?.trim());
      Object.assign(base, { device_entity_ids: (editForm.device_entity_ids ?? []).length > 0 ? editForm.device_entity_ids : undefined, device_names: hasCustomNames ? dn : undefined, width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined, height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined });
    }
    if (editingWidget.type === "stat_pill_card") Object.assign(base, { entity_id: editForm.entity_id, label: editForm.label || undefined, icon: editForm.icon || undefined, color: editForm.color || undefined, conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined });
    if (editingWidget.type === "sensor_card") Object.assign(base, { entity_id: editForm.entity_id, icon: editForm.icon || undefined, show_icon: editForm.show_icon !== false, size: editForm.size || undefined, conditions: (editForm.conditions ?? []).length > 0 ? editForm.conditions : undefined });
    if (editingWidget.type === "nuts_card") Object.assign(base, { entity_id: editForm.entity_id || undefined, icon: editForm.icon || undefined, icon_background_color: editForm.icon_background_color || undefined, current_entity_id: editForm.current_entity_id || undefined, max_value: editForm.max_value != null && editForm.max_value > 0 ? editForm.max_value : undefined, width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined, height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined });
    return base;
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden onClick={() => setEditingWidgetId(null)} />
      <div className="fixed top-4 right-4 bottom-4 z-50 w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl">
        <div className="shrink-0 flex items-center justify-between p-5 pb-3 border-b border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {editingWidget.type === "text_card" ? t("editPanel.editText") : editingWidget.type === "power_usage_card" ? t("editPanel.editPowerUsage") : editingWidget.type === "device_consumption_card" ? "Verbruik per apparaat bewerken" : t("editPanel.editTile")}
          </h3>
          <button type="button" onClick={() => setEditingWidgetId(null)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400" aria-label={t("editPanel.close")}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 space-y-3">
          {(editingWidget.type === "text_card") ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.textValue")}</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder={t("editPanel.placeholderTitleExample")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.type")}</label>
                <select value={editForm.textMode ?? "title"} onChange={(e) => setEditForm((prev) => ({ ...prev, textMode: e.target.value as "title" | "subtitle" | "text" }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                  <option value="title">{t("editPanel.title")}</option>
                  <option value="subtitle">{t("editPanel.subtitle")}</option>
                  <option value="text">{t("editPanel.text")}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editForm.show_icon ?? false} onChange={(e) => setEditForm((prev) => ({ ...prev, show_icon: e.target.checked }))} className="rounded border-gray-300 dark:border-gray-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t("editPanel.showIcon")}</span>
              </label>
              {(editForm.show_icon ?? false) && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.icon")}</label>
                  <select value={editForm.icon ?? "Type"} onChange={(e) => setEditForm((prev) => ({ ...prev, icon: e.target.value }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                    {CARD_ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.widthPx")}</label>
                <input type="number" min={160} max={500} step={10} value={editForm.width ?? 280} onChange={(e) => { const v = parseInt(e.target.value, 10); setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined })); }} placeholder="280" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t("editPanel.default280px")}</p>
              </div>
              <EntitySelectWithSearch entities={entities} value={editForm.entity_id} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("switch.") || e.entity_id.startsWith("light.") || e.entity_id.startsWith("input_boolean.")} label="" placeholder={t("editPanel.entityPlaceholder")} emptyOption={t("editPanel.none")} />
            </>
          ) : editingWidget.type === "solar_card" ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder={t("editPanel.tileNamePlaceholder")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
              </div>
              <EntitySelectWithSearch entities={entities} value={editForm.entity_id} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("sensor.")} label={t("editPanel.yieldEntity")} placeholder={t("editPanel.searchEntity")} emptyOption={t("editPanel.none")} />
              <EntitySelectWithSearch entities={entities} value={editForm.consumption_entity_id ?? ""} onChange={(v) => setEditForm((prev) => ({ ...prev, consumption_entity_id: v || undefined }))} filter={(e) => e.entity_id.startsWith("sensor.")} label={t("editPanel.consumptionOptional")} placeholder={t("editPanel.searchSensor")} emptyOption={t("editPanel.none")} />
            </>
          ) : editingWidget.type === "energy_monitor_card" ? (
            <>
              <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                {(["achtergrond", "weergave", "voorwaarden"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setEditTab(tab)} className={cn("flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors", editTab === tab ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white")}>
                    {tab === "achtergrond" ? t("editPanel.background") : tab === "weergave" ? t("editPanel.display") : t("editPanel.conditions")}
                  </button>
                ))}
              </div>
              {editTab === "achtergrond" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Achtergrondafbeelding light mode</label>
                    {editForm.background_image && <div className="mb-2 h-20 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10" style={{ backgroundImage: `url(${editForm.background_image})` }} />}
                    <div className="flex gap-2 mb-2">
                      <label className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                        {uploadingEnergyBg ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; e.target.value = ""; setUploadingEnergyBg(true); try { const formData = new FormData(); formData.set("file", file); const res = await fetch("/api/upload", { method: "POST", body: formData }); const json = await res.json(); if (!res.ok) throw new Error(json.error || "Upload failed"); setEditForm((prev) => ({ ...prev, background_image: json.url })); } finally { setUploadingEnergyBg(false); } }} disabled={uploadingEnergyBg} />
                      </label>
                      {editForm.background_image && <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, background_image: undefined }))} className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10">{t("editPanel.remove")}</button>}
                    </div>
                    <input type="text" value={editForm.background_image ?? ""} onChange={(e) => setEditForm((prev) => ({ ...prev, background_image: e.target.value || undefined }))} placeholder="Of plak een URL" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Achtergrondafbeelding dark mode (optioneel)</label>
                    {editForm.background_image_dark && <div className="mb-2 h-20 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10" style={{ backgroundImage: `url(${editForm.background_image_dark})` }} />}
                    <div className="flex gap-2 mb-2">
                      <label className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                        {uploadingEnergyBgDark ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; e.target.value = ""; setUploadingEnergyBgDark(true); try { const formData = new FormData(); formData.set("file", file); const res = await fetch("/api/upload", { method: "POST", body: formData }); const json = await res.json(); if (!res.ok) throw new Error(json.error || "Upload failed"); setEditForm((prev) => ({ ...prev, background_image_dark: json.url })); } finally { setUploadingEnergyBgDark(false); } }} disabled={uploadingEnergyBgDark} />
                      </label>
                      {editForm.background_image_dark && <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, background_image_dark: undefined }))} className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10">{t("editPanel.remove")}</button>}
                    </div>
                    <input type="text" value={editForm.background_image_dark ?? ""} onChange={(e) => setEditForm((prev) => ({ ...prev, background_image_dark: e.target.value || undefined }))} placeholder="Upload of URL. Leeg =zelfde als light." className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
                  </div>
                  <EntitySelectWithSearch entities={entities} value={editForm.entity_id} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("weather.") || e.entity_id.startsWith("sensor.")} label={t("editPanel.entityForConditions")} placeholder={t("editPanel.searchEntity")} emptyOption={t("editPanel.noEntityImageOnly")} />
                </>
              )}
              {editTab === "weergave" && (
                <>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="energy-minimal" checked={editForm.minimal ?? false} onChange={(e) => setEditForm((prev) => ({ ...prev, minimal: e.target.checked }))} className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                    <label htmlFor="energy-minimal" className="text-sm text-gray-700 dark:text-gray-300">Minimalistisch (alleen afbeelding, geen titel of rand)</label>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Schaalfactor ({(editForm.scale ?? 1).toFixed(1)}×)</label>
                    <input type="range" min="0.5" max="1.5" step="0.1" value={editForm.scale ?? 1} onChange={(e) => setEditForm((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))} className="w-full" />
                  </div>
                </>
              )}
              {editTab === "voorwaarden" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Voorwaarden (afbeelding bij waarde)</label>
                  {(editForm.image_conditions ?? []).map((cond, idx) => (
                    <div key={idx} className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-2">
                      <select value={cond.operator} onChange={(e) => setEditForm((prev) => ({ ...prev, image_conditions: (prev.image_conditions ?? []).map((c, i) => i === idx ? { ...c, operator: e.target.value } : c) }))} className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs">
                        {SENSOR_CONDITION_OPERATORS.map((op) => <option key={op} value={op}>{SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}</option>)}
                      </select>
                      <input type="text" value={cond.value} onChange={(e) => setEditForm((prev) => ({ ...prev, image_conditions: (prev.image_conditions ?? []).map((c, i) => i === idx ? { ...c, value: e.target.value } : c) }))} placeholder="Waarde" className="flex-1 min-w-[80px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs" />
                      <div className="flex flex-wrap items-center gap-1">
                        <label className="shrink-0 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 cursor-pointer">{uploadingConditionImage?.idx === idx && uploadingConditionImage?.field === "image" ? t("editPanel.uploading") : t("editPanel.uploadImage")}
                          <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; e.target.value = ""; setUploadingConditionImage({ idx, field: "image" }); try { const formData = new FormData(); formData.set("file", file); const res = await fetch("/api/upload", { method: "POST", body: formData }); const json = await res.json(); if (!res.ok) throw new Error(json.error || "Upload failed"); setEditForm((prev) => ({ ...prev, image_conditions: (prev.image_conditions ?? []).map((c, i) => i === idx ? { ...c, image: json.url } : c) })); } finally { setUploadingConditionImage(null); } }} disabled={uploadingConditionImage != null} />
                        </label>
                        <input type="text" value={cond.image} onChange={(e) => setEditForm((prev) => ({ ...prev, image_conditions: (prev.image_conditions ?? []).map((c, i) => i === idx ? { ...c, image: e.target.value } : c) }))} placeholder="URL" className="flex-1 min-w-[80px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs" />
                      </div>
                      <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, image_conditions: (prev.image_conditions ?? []).filter((_, i) => i !== idx) }))} className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, image_conditions: [...(prev.image_conditions ?? []), { operator: "eq", value: "", image: "", image_dark: undefined }] }))} className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full">+ Voorwaarde toevoegen</button>
                </div>
              )}
            </>
          ) : editingWidget.type === "power_usage_card" ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder={t("editPanel.tileNamePlaceholder")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
              </div>
              <EntitySelectWithSearch entities={entities} value={editForm.entity_id} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("sensor.")} label={t("editPanel.totalUsage")} placeholder={t("editPanel.searchEntity")} emptyOption={t("editPanel.none")} />
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Kosten per kWh (€)</label>
                <input type="number" min={0} step={0.001} value={editForm.cost_per_kwh ?? ""} onChange={(e) => { const v = e.target.value === "" ? undefined : parseFloat(e.target.value); setEditForm((prev) => ({ ...prev, cost_per_kwh: v != null && !Number.isNaN(v) ? v : undefined })); }} placeholder="0.25" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Optioneel. Voor berekening kosten vandaag.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Breedte (px)</label>
                  <input type="number" min={280} max={600} step={20} value={editForm.width ?? 400} onChange={(e) => { const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10); setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined })); }} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Hoogte (px)</label>
                  <input type="number" min={200} max={600} step={20} value={editForm.height ?? 380} onChange={(e) => { const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10); setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined })); }} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" />
                </div>
              </div>
            </>
          ) : editingWidget.type === "device_consumption_card" ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Verbruik per apparaat" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Apparaten</label>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Zoek op naam of entity_id.</p>
                <input type="text" value={powerUsageDeviceSearch} onChange={(e) => setPowerUsageDeviceSearch(e.target.value)} placeholder="Zoek op naam of entity_id…" className="mb-2 w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:text-gray-200 dark:placeholder-gray-500" />
                <div className="max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1">
                  {(() => {
                    const q = powerUsageDeviceSearch.trim().toLowerCase();
                    const filtered = entities.filter((e) => {
                      const name = ((e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id).toLowerCase();
                      const eid = e.entity_id.toLowerCase();
                      const matchesSearch = !q || name.includes(q) || eid.includes(q);
                      const isEnergyRelated = e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("switch.") || e.entity_id.startsWith("light.") || e.entity_id.includes("energy") || e.entity_id.includes("power");
                      return matchesSearch && (isEnergyRelated || !!q);
                    });
                    return (
                      <>
                        {filtered.map((e) => { const name = (e.attributes as { friendly_name?: string })?.friendly_name ?? e.entity_id; const checked = (editForm.device_entity_ids ?? []).includes(e.entity_id); return (
                          <label key={e.entity_id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" checked={checked} onChange={() => { const ids = editForm.device_entity_ids ?? []; setEditForm((prev) => ({ ...prev, device_entity_ids: checked ? ids.filter((id) => id !== e.entity_id) : [...ids, e.entity_id] })); }} className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-[#4D2FB2] focus:ring-[#4D2FB2]" />
                            <span className="text-sm truncate" title={e.entity_id}>{name}</span>
                          </label>
                        ); })}
                        {filtered.length === 0 && <p className="text-xs text-gray-500 py-2">{q ? "Geen resultaten. Probeer een andere zoekterm." : "Geen sensoren gevonden."}</p>}
                      </>
                    );
                  })()}
                </div>
              </div>
              {(editForm.device_entity_ids ?? []).length > 0 && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Weergavenamen apparaten</label>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Pas de naam aan zoals die op de kaart wordt getoond.</p>
                  <div className="space-y-2 max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 p-2">
                    {(editForm.device_entity_ids ?? []).map((eid) => {
                      const defaultName = (entities.find((x) => x.entity_id === eid)?.attributes as { friendly_name?: string })?.friendly_name ?? eid;
                      const customName = (editForm.device_names ?? {})[eid] ?? "";
                      return (
                        <div key={eid} className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate" title={eid}>{eid}</span>
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, device_names: { ...(prev.device_names ?? {}), [eid]: e.target.value } }))}
                            placeholder={defaultName}
                            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:text-gray-200 dark:placeholder-gray-500"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Breedte (px)</label>
                  <input type="number" min={200} max={500} step={20} value={editForm.width ?? 320} onChange={(e) => { const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10); setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined })); }} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Hoogte (px)</label>
                  <input type="number" min={200} max={500} step={20} value={editForm.height ?? 320} onChange={(e) => { const v = e.target.value === "" ? undefined : parseInt(e.target.value, 10); setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined })); }} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" />
                </div>
              </div>
            </>
          ) : editingWidget.type === "stat_pill_card" ? (
            <>
              <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                {(["algemeen", "voorwaarden"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setEditTab(tab)} className={cn("flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors", editTab === tab ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white")}>{tab === "algemeen" ? t("editPanel.general") : t("editPanel.conditions")}</button>
                ))}
              </div>
              {editTab === "algemeen" && (
                <>
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label><input type="text" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder={t("editPanel.tileNamePlaceholder")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" /></div>
                  <EntitySelectWithSearch entities={entities} value={editForm.entity_id} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("sensor.")} label={t("editPanel.sensor")} placeholder={t("editPanel.searchEntity")} emptyOption={t("editPanel.none")} />
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Label (onder de waarde)</label><input type="text" value={editForm.label ?? ""} onChange={(e) => setEditForm((prev) => ({ ...prev, label: e.target.value || undefined }))} placeholder="Opbrengst, Verbruik, ..." className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Icoon</label><select value={editForm.icon ?? "Sun"} onChange={(e) => setEditForm((prev) => ({ ...prev, icon: e.target.value || undefined }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">{CARD_ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Kleur (standaard)</label><select value={editForm.color ?? "amber"} onChange={(e) => setEditForm((prev) => ({ ...prev, color: e.target.value as "amber" | "purple" | "emerald" | "red" }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"><option value="amber">Amber (geel)</option><option value="purple">Paars</option><option value="emerald">Smaragd (groen)</option><option value="red">Rood</option></select></div>
                </>
              )}
              {editTab === "voorwaarden" && (
                <div>
                  {(editForm.conditions ?? []).map((cond, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-2">
                      <select value={cond.operator} onChange={(e) => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).map((c, i) => i === idx ? { ...c, operator: e.target.value } : c) }))} className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs">{SENSOR_CONDITION_OPERATORS.map((op) => <option key={op} value={op}>{SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}</option>)}</select>
                      <input type="text" value={cond.value} onChange={(e) => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).map((c, i) => i === idx ? { ...c, value: e.target.value } : c) }))} placeholder={t("editPanel.value")} className="w-24 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs" />
                      <select value={cond.color} onChange={(e) => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).map((c, i) => i === idx ? { ...c, color: e.target.value } : c) }))} className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs">{SENSOR_CONDITION_COLORS.map((color) => <option key={color} value={color}>{color}</option>)}</select>
                      <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).filter((_, i) => i !== idx) }))} className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, conditions: [...(prev.conditions ?? []), { operator: "eq", value: "", color: "green" }] }))} className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full">{"+ " + t("editPanel.addCondition")}</button>
                </div>
              )}
            </>
          ) : editingWidget.type === "sensor_card" ? (
            <div>
              <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                {(["algemeen", "voorwaarden"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setEditTab(tab)} className={cn("flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors", editTab === tab ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white")}>{tab === "algemeen" ? t("editPanel.general") : t("editPanel.conditions")}</button>
                ))}
              </div>
              {editTab === "algemeen" && (
                <>
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label><input type="text" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder={t("editPanel.tileNamePlaceholder")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" /></div>
                  <EntitySelectWithSearch entities={entities} value={editForm.entity_id} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("sensor.")} label={t("editPanel.entity")} placeholder={t("editPanel.searchEntity")} emptyOption={t("editPanel.none")} />
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Icoon</label>
                  <input type="text" value={sensorIconSearch} onChange={(e) => setSensorIconSearch(e.target.value)} onFocus={() => setSensorIconSearch(sensorIconSearch || (editForm.icon ?? ""))} placeholder="Zoek icoon" className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" />
                  <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5">
                    <button type="button" onClick={() => { setEditForm((prev) => ({ ...prev, icon: undefined })); setSensorIconSearch(""); }} className={cn("rounded-md px-2 py-1 text-xs", !editForm.icon ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20")}>Default (Gauge)</button>
                    {SENSOR_ICON_OPTIONS.filter((name) => name.toLowerCase().includes((sensorIconSearch || "").toLowerCase())).map((name) => (
                      <button key={name} type="button" onClick={() => { setEditForm((prev) => ({ ...prev, icon: name })); setSensorIconSearch(name); }} className={cn("rounded-md px-2 py-1 text-xs", (editForm.icon ?? "Gauge") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20")}>{name}</button>
                    ))}
                  </div>
                  <div className="mt-3"><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Grootte</label><select value={editForm.size ?? "md"} onChange={(e) => setEditForm((prev) => ({ ...prev, size: e.target.value }))} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"><option value="sm">Klein</option><option value="md">Normaal</option><option value="lg">Groot</option></select></div>
                  <div className="mt-3 flex items-center gap-2"><input type="checkbox" id="sensor-show-icon" checked={editForm.show_icon !== false} onChange={(e) => setEditForm((prev) => ({ ...prev, show_icon: e.target.checked }))} className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" /><label htmlFor="sensor-show-icon" className="text-sm text-gray-700 dark:text-gray-300">Icoon tonen</label></div>
                </>
              )}
              {editTab === "voorwaarden" && (
                <div>
                  {(editForm.conditions ?? []).map((cond, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-2">
                      <select value={cond.operator} onChange={(e) => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).map((c, i) => i === idx ? { ...c, operator: e.target.value } : c) }))} className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs">{SENSOR_CONDITION_OPERATORS.map((op) => <option key={op} value={op}>{SENSOR_CONDITION_OPERATOR_LABELS[op] ?? op}</option>)}</select>
                      <input type="text" value={cond.value} onChange={(e) => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).map((c, i) => i === idx ? { ...c, value: e.target.value } : c) }))} placeholder={t("editPanel.value")} className="w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs" />
                      <select value={cond.color} onChange={(e) => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).map((c, i) => i === idx ? { ...c, color: e.target.value } : c) }))} className="rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs">{SENSOR_CONDITION_COLORS.map((color) => <option key={color} value={color}>{color}</option>)}</select>
                      <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, conditions: (prev.conditions ?? []).filter((_, i) => i !== idx) }))} className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditForm((prev) => ({ ...prev, conditions: [...(prev.conditions ?? []), { operator: "gte", value: "", color: "green" }] }))} className="rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full">{"+ " + t("editPanel.addCondition")}</button>
                </div>
              )}
            </div>
          ) : editingWidget.type === "nuts_card" ? (
            <>
              <div className="flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2">
                {(["algemeen", "weergave"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setEditTab(tab)} className={cn("flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors", editTab === tab ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white")}>{tab === "algemeen" ? t("editPanel.general") : t("editPanel.display")}</button>
                ))}
              </div>
              {editTab === "algemeen" && (
                <>
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t("editPanel.name")}</label><input type="text" value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder={t("editPanel.tileNamePlaceholder")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Icoon</label><div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5 max-h-32 overflow-auto">{(["Fuel", "Droplets", "Zap", "Gauge", "Thermometer"].filter((n) => CARD_ICON_OPTIONS.includes(n)) as string[]).map((name) => <button key={name} type="button" onClick={() => setEditForm((prev) => ({ ...prev, icon: name }))} className={cn("rounded-md px-2 py-1 text-xs", (editForm.icon ?? "Fuel") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20")}>{name}</button>)}</div></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Kleur icoon</label><div className="flex items-center gap-2"><input type="color" value={editForm.icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(editForm.icon_background_color) ? editForm.icon_background_color : "#3B82F6"} onChange={(e) => setEditForm((prev) => ({ ...prev, icon_background_color: e.target.value }))} className="h-8 w-12 cursor-pointer rounded border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5" /><input type="text" value={editForm.icon_background_color ?? "#3B82F6"} onChange={(e) => setEditForm((prev) => ({ ...prev, icon_background_color: e.target.value || undefined }))} placeholder="#3B82F6" className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" /></div></div>
                  <EntitySelectWithSearch entities={entities} value={editForm.entity_id ?? ""} onChange={(v) => setEditForm((prev) => ({ ...prev, entity_id: v }))} filter={(e) => e.entity_id.startsWith("sensor.")} label="Entity dagverbruik (totaal per dag)" placeholder="Zoek sensor…" emptyOption="Kies entity…" />
                  <EntitySelectWithSearch entities={entities} value={editForm.current_entity_id ?? ""} onChange={(v) => setEditForm((prev) => ({ ...prev, current_entity_id: v || undefined }))} filter={(e) => e.entity_id.startsWith("sensor.")} label="Entity huidig verbruik (optioneel)" placeholder="Zoek sensor…" emptyOption="Geen" />
                  <div><label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Max waarde voor bar (optioneel)</label><input type="number" min={1} step={0.1} value={editForm.max_value ?? 10} onChange={(e) => { const v = e.target.value === "" ? undefined : Number(e.target.value); setEditForm((prev) => ({ ...prev, max_value: v != null && !Number.isNaN(v) && v > 0 ? v : undefined })); }} placeholder="10" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" /><p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Schaal voor verticale verbruiksbalk</p></div>
                </>
              )}
              {editTab === "weergave" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Breedte × hoogte (px)</label>
                  <div className="flex gap-2">
                    <div className="flex-1"><input type="number" min={150} max={400} step={10} value={editForm.width ?? 250} onChange={(e) => { const v = e.target.value === "" ? undefined : Number(e.target.value); setEditForm((prev) => ({ ...prev, width: v != null && !Number.isNaN(v) ? v : undefined })); }} placeholder="250" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200" /><p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Breedte</p></div>
                    <div className="flex-1"><input type="number" min={80} max={300} step={10} value={editForm.height ?? 130} onChange={(e) => { const v = e.target.value === "" ? undefined : Number(e.target.value); setEditForm((prev) => ({ ...prev, height: v != null && !Number.isNaN(v) ? v : undefined })); }} placeholder="130" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200" /><p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Hoogte</p></div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
        <div className="shrink-0 flex justify-between gap-2 p-5 pt-4 pb-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
          <button type="button" onClick={() => { const newWidgets = widgets.filter((w) => w.id !== editingWidget.id); const newLayout = layout.filter((item) => item.i !== editingWidget.id); handleRemoveTile(editingWidget.id); setEditingWidgetId(null); saveMutation.mutate({ layout: newLayout, widgets: newWidgets, welcomeTitle, welcomeSubtitle }); }} className="rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">{t("editPanel.remove")}</button>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditingWidgetId(null)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300">{t("editPanel.cancel")}</button>
            <button type="button" onClick={() => { const updates = getSaveUpdates(); handleUpdateTile(editingWidget.id, updates); const newWidgets = widgets.map((w) => (w.id === editingWidget.id ? { ...w, ...updates } : w)); saveMutation.mutate({ layout, widgets: newWidgets, welcomeTitle, welcomeSubtitle }); setEditingWidgetId(null); }} className="rounded-lg bg-[#4D2FB2] px-3 py-1.5 text-sm text-white hover:opacity-90">Opslaan</button>
          </div>
        </div>
      </div>
    </>
  );
}
