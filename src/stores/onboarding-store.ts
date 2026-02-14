import { create } from "zustand";
import { generateId } from "@/lib/utils";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export type ConnectionState = {
  baseUrl: string;
  token: string;
  connectionId?: string;
};

export type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

export type HaArea = {
  area_id: string;
  name: string;
};

export type RoomState = {
  id: string;
  name: string;
  entityIds: string[];
};

export type WidgetConfig = {
  id: string;
  type: string;
  title: string;
  entity_id: string;
  /** Optioneel verbruik-entity voor solar_card (gecombineerde kaart). */
  consumption_entity_id?: string;
  /** Weather card: toon weersicoon (default true). */
  show_icon?: boolean;
  /** Vacuum card: script entity_ids om als knoppen te tonen (script.turn_on). */
  script_ids?: string[];
  /** Vacuum card: aangepaste weergavenaam per script (entity_id -> naam). */
  script_names?: Record<string, string>;
  /** Vacuum card: optionele sensor entity_id om onder status te tonen (bijv. cleaned area). */
  cleaned_area_entity_id?: string;
  /** Climate card 2: optionele sensor entity_id voor luchtvochtigheid. */
  humidity_entity_id?: string;
  icon?: string;
  size?: string;
  /** Sensor card: conditionele voorwaarden (operator, value, color). */
  conditions?: { operator: string; value: string; color: string }[];
  /** Pill card: toon entiteitstatus (aan/uit of waarde); default true. */
  show_state?: boolean;
  /** Card group: uitlijning van kaarten (flex justify). */
  alignment?: "start" | "center" | "end" | "between";
  /** Card group: geneste kaarten (bijv. pill cards). */
  children?: WidgetConfig[];
  /** Room card: entity_id voor lichtstatus (bijv. light.groep). */
  light_entity_id?: string;
  /** Room card: optionele achtergrondafbeelding (URL). */
  background_image?: string;
  /** Afbeeldingskaart: achtergrond voor dark mode. */
  background_image_dark?: string;
  /** Nuts card: entity voor huidig verbruik (optioneel). */
  current_entity_id?: string;
  /** Nuts card: max voor verticale bar-schaal (optioneel). */
  max_value?: number;
  /** Nuts card: kleur icoon (hex). */
  icon_background_color?: string;
  /** Nuts card: breedte kaart in px (standaard 250). */
  width?: number;
  /** Nuts card: hoogte kaart in px (standaard 130). */
  height?: number;
  /** Energy monitor: entity voor teruglevering aan het net. */
  grid_entity_id?: string;
  /** Energy monitor: minimal (geen achtergrond/rand om floating card). */
  minimal?: boolean;
  /** Energy monitor / Afbeeldingskaart: schaalfactor (0.5–1.5). */
  scale?: number;
  /** Afbeeldingskaart: voorwaarden voor afbeelding per entity state (bijv. weer → andere afbeelding). */
  image_conditions?: { operator: string; value: string; image: string; image_dark?: string }[];
  /** Stat pill card: label onder de waarde (bijv. "Opbrengst"). */
  label?: string;
  /** Stat pill card: kleurthema (amber, purple, emerald, red). */
  color?: string;
  thresholds?: string;
  unit?: string;
  /** Camera card: vernieuwinterval in seconden. */
  refresh?: number;
  /** Camera card: toon titelbalk (default true). */
  show_title?: boolean;
};

export type TemplateId = "overview" | "rooms" | "energy";

type TestResult = { ok: true } | { ok: false; error: string };

type OnboardingState = {
  step: OnboardingStep;
  connection: ConnectionState;
  testResult: TestResult | null;
  entities: HaEntity[];
  selectedEntityIds: string[];
  areas: HaArea[];
  rooms: RoomState[];
  template: TemplateId;
  dashboardId: string | null;
  dashboardName: string;
  widgets: WidgetConfig[];
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setConnection: (c: Partial<ConnectionState>) => void;
  setTestResult: (r: TestResult | null) => void;
  setEntities: (e: HaEntity[]) => void;
  setSelectedEntityIds: (ids: string[]) => void;
  toggleEntitySelection: (entityId: string) => void;
  setAreas: (a: HaArea[]) => void;
  setRooms: (r: RoomState[]) => void;
  addRoom: (name: string) => void;
  assignEntityToRoom: (roomId: string, entityId: string) => void;
  removeEntityFromRoom: (roomId: string, entityId: string) => void;
  setTemplate: (t: TemplateId) => void;
  setDashboard: (id: string | null, name: string) => void;
  setDashboardName: (name: string) => void;
  setWidgets: (w: WidgetConfig[]) => void;
  addWidget: (w: Omit<WidgetConfig, "id">) => void;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  removeWidget: (id: string) => void;
  reset: () => void;
};

const defaultConnection: ConnectionState = {
  baseUrl: "http://homeassistant.local:8123",
  token: "",
};

const initialState = {
  step: 1 as OnboardingStep,
  connection: defaultConnection,
  testResult: null as TestResult | null,
  entities: [] as HaEntity[],
  selectedEntityIds: [] as string[],
  areas: [] as HaArea[],
  rooms: [] as RoomState[],
  template: "overview" as TemplateId,
  dashboardId: null as string | null,
  dashboardName: "My dashboard",
  widgets: [] as WidgetConfig[],
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  nextStep: () =>
    set((s) => ({ step: Math.min(6, s.step + 1) as OnboardingStep })),
  prevStep: () =>
    set((s) => ({ step: Math.max(1, s.step - 1) as OnboardingStep })),
  setConnection: (c) =>
    set((s) => ({ connection: { ...s.connection, ...c } })),
  setTestResult: (r) => set({ testResult: r }),
  setEntities: (e) => set({ entities: e }),
  setSelectedEntityIds: (ids) => set({ selectedEntityIds: ids }),
  toggleEntitySelection: (entityId) =>
    set((s) => ({
      selectedEntityIds: s.selectedEntityIds.includes(entityId)
        ? s.selectedEntityIds.filter((id) => id !== entityId)
        : [...s.selectedEntityIds, entityId],
    })),
  setAreas: (a) => set({ areas: a }),
  setRooms: (r) => set({ rooms: r }),
  addRoom: (name) =>
    set((s) => ({
      rooms: [
        ...s.rooms,
        { id: generateId(), name, entityIds: [] },
      ],
    })),
  assignEntityToRoom: (roomId, entityId) =>
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId && !r.entityIds.includes(entityId)
          ? { ...r, entityIds: [...r.entityIds, entityId] }
          : r
      ),
    })),
  removeEntityFromRoom: (roomId, entityId) =>
    set((s) => ({
      rooms: s.rooms.map((r) =>
        r.id === roomId
          ? { ...r, entityIds: r.entityIds.filter((id) => id !== entityId) }
          : r
      ),
    })),
  setTemplate: (template) => set({ template }),
  setDashboard: (dashboardId, dashboardName) =>
    set({ dashboardId, dashboardName }),
  setDashboardName: (dashboardName) => set({ dashboardName }),
  setWidgets: (widgets) => set({ widgets }),
  addWidget: (w) =>
    set((s) => ({
      widgets: [...s.widgets, { ...w, id: generateId() }],
    })),
  updateWidget: (id, updates) =>
    set((s) => ({
      widgets: s.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    })),
  removeWidget: (id) =>
    set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) })),
  reset: () => set(initialState),
}));
