import { describe, expect, it } from "vitest";
import { canPinMore, moveToGrid, moveToTopbar, topbarPills } from "./topbar-pills";

type W = {
  id: string;
  type: string;
  placement?: "topbar";
  topbar_order?: number;
  children?: W[];
  [key: string]: unknown;
};

const pill = (id: string, extra: Partial<W> = {}): W => ({ id, type: "stat_pill_card", ...extra });
const ids = (widgets: readonly W[]) => topbarPills(widgets).map((w) => w.id);

describe("moveToTopbar", () => {
  it("appends at the end of the bar in pin order", () => {
    let w: W[] = [pill("a"), pill("b"), pill("c")];
    w = moveToTopbar(w, "c");
    w = moveToTopbar(w, "a");
    expect(ids(w)).toEqual(["c", "a"]);
    expect(w.find((x) => x.id === "c")?.topbar_order).toBe(0);
    expect(w.find((x) => x.id === "a")?.topbar_order).toBe(1);
    expect(w.find((x) => x.id === "b")?.placement).toBeUndefined();
  });

  it("refuses a fifth pill", () => {
    let w: W[] = ["a", "b", "c", "d", "e"].map((id) => pill(id));
    for (const id of ["a", "b", "c", "d"]) w = moveToTopbar(w, id);
    expect(canPinMore(w)).toBe(false);
    const full = moveToTopbar(w, "e");
    expect(full).toBe(w);
    expect(ids(full)).toEqual(["a", "b", "c", "d"]);
  });

  it("honours a custom max", () => {
    let w: W[] = [pill("a"), pill("b")];
    w = moveToTopbar(w, "a", 1);
    expect(canPinMore(w, 1)).toBe(false);
    expect(moveToTopbar(w, "b", 1)).toBe(w);
  });

  it("is idempotent for an already pinned pill", () => {
    const w = moveToTopbar([pill("a"), pill("b")], "a");
    expect(moveToTopbar(w, "a")).toBe(w);
  });

  it("keeps unknown fields and does not mutate the input", () => {
    const input: W[] = [pill("a", { label: "Solar", conditions: [{ operator: "gt", value: "1", color: "red" }], future_flag: 7 })];
    const snapshot = JSON.stringify(input);
    const out = moveToTopbar(input, "a");
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(out[0]).toMatchObject({ label: "Solar", future_flag: 7, placement: "topbar", topbar_order: 0 });
    expect(out[0].conditions).toEqual(input[0].conditions);
  });

  it("ignores other tile types, unknown ids and nested pills", () => {
    const nested = pill("nested");
    const w: W[] = [{ id: "s", type: "sensor_card" }, { id: "stack", type: "smart_stack", children: [nested] }];
    expect(moveToTopbar(w, "s")).toBe(w);
    expect(moveToTopbar(w, "missing")).toBe(w);
    expect(moveToTopbar(w, "nested")).toBe(w);
    expect(w[1].children?.[0]).toBe(nested);
  });

  it("does not count non-pill tiles with a stray placement", () => {
    const w: W[] = [{ id: "x", type: "sensor_card", placement: "topbar", topbar_order: 0 }, pill("a")];
    expect(topbarPills(w)).toEqual([]);
    expect(ids(moveToTopbar(w, "a"))).toEqual(["a"]);
  });
});

describe("moveToGrid", () => {
  it("removes the pill and keeps the order of the rest compact", () => {
    let w: W[] = ["a", "b", "c", "d"].map((id) => pill(id));
    for (const id of ["d", "b", "a", "c"]) w = moveToTopbar(w, id);
    w = moveToGrid(w, "b");
    expect(ids(w)).toEqual(["d", "a", "c"]);
    expect(topbarPills(w).map((x) => x.topbar_order)).toEqual([0, 1, 2]);
    const back = w.find((x) => x.id === "b")!;
    expect("placement" in back).toBe(false);
    expect("topbar_order" in back).toBe(false);
    expect(canPinMore(w)).toBe(true);
  });

  it("keeps unknown fields on the unpinned pill", () => {
    const w = moveToGrid(moveToTopbar([pill("a", { label: "L", page: 2 })], "a"), "a");
    expect(w[0]).toEqual({ id: "a", type: "stat_pill_card", label: "L", page: 2 });
  });

  it("is a no-op for a pill that is not pinned", () => {
    const w: W[] = [pill("a")];
    expect(moveToGrid(w, "a")).toBe(w);
    expect(moveToGrid(w, "missing")).toBe(w);
  });
});

describe("topbarPills", () => {
  it("sorts by topbar_order and puts missing order last", () => {
    const w: W[] = [
      pill("late", { placement: "topbar" }),
      pill("second", { placement: "topbar", topbar_order: 5 }),
      pill("first", { placement: "topbar", topbar_order: 1 }),
      pill("floating"),
    ];
    expect(ids(w)).toEqual(["first", "second", "late"]);
  });

  it("returns nothing for a dashboard without the new fields", () => {
    const w: W[] = [pill("a"), { id: "s", type: "sensor_card" }];
    expect(topbarPills(w)).toEqual([]);
    expect(canPinMore(w)).toBe(true);
  });
});
