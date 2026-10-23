import { describe, expect, it } from "vitest";
import {
  claimAddTilePopstate,
  createAddTileHistory,
  type AddTileHistoryLike,
  type AddTileStep,
} from "./add-tile-history";

function memoryHistory(): AddTileHistoryLike & { index: () => number; listen: (onPop: () => void) => void } {
  const entries: unknown[] = [null];
  let index = 0;
  let onPop = () => {};
  return {
    index: () => index,
    listen(fn) {
      onPop = fn;
    },
    pushState(state) {
      entries.splice(index + 1);
      entries.push(state);
      index += 1;
    },
    back() {
      this.go(-1);
    },
    go(delta) {
      index = Math.max(0, Math.min(entries.length - 1, index + delta));
      onPop();
    },
  };
}

function flow() {
  const history = memoryHistory();
  const controller = createAddTileHistory(history);
  const seen: AddTileStep[][] = [];
  history.listen(() => {
    const result = controller.applyPop();
    if (!result.suppressed) seen.push(result.stack);
  });
  return { history, controller, seen };
}

describe("add-tile history", () => {
  it("closes one step at a time for back and Escape", () => {
    const { controller, seen } = flow();
    controller.push("type");
    controller.push("entity");
    controller.push("configure");
    controller.back();
    controller.back();
    controller.back();
    expect(seen).toEqual([["type", "entity"], ["type"], []]);
    expect(controller.stack()).toEqual([]);
  });

  it("leaves no history entry after the flow is closed", () => {
    const { history, controller, seen } = flow();
    controller.push("type");
    controller.push("entity");
    controller.discard();
    expect(controller.stack()).toEqual([]);
    expect(history.index()).toBe(0);
    expect(seen).toEqual([]);
    controller.back();
    expect(controller.applyPop().claimed).toBe(false);
  });

  it("claims the pop so the pager and settings listeners do not run", () => {
    const event = {
      stopped: false,
      stopImmediatePropagation() {
        this.stopped = true;
      },
    };
    expect(claimAddTilePopstate(event, 2)).toBe(true);
    let pager = 0;
    let settings = 0;
    if (!event.stopped) {
      pager += 1;
      settings += 1;
    }
    expect(pager).toBe(0);
    expect(settings).toBe(0);
  });

  it("does not claim a pop once the add-tile stack is empty", () => {
    const event = {
      stopped: false,
      stopImmediatePropagation() {
        this.stopped = true;
      },
    };
    expect(claimAddTilePopstate(event, 0)).toBe(false);
    expect(event.stopped).toBe(false);
  });
});
