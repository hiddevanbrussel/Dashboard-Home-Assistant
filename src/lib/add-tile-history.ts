/**
 * Each step of "Kaart toevoegen" is one history entry.
 * A pop while the stack is non-empty belongs to this flow: the pager and
 * settings listeners must not also handle it.
 */

export type AddTileStep = "type" | "entity" | "configure";

export function pushAddTileStep(stack: readonly AddTileStep[], step: AddTileStep): AddTileStep[] {
  return [...stack, step];
}

export function popAddTileStep(stack: readonly AddTileStep[]): AddTileStep[] {
  return stack.slice(0, -1);
}

export function shouldClaimAddTilePop(stackLength: number): boolean {
  return stackLength > 0;
}

export function claimAddTilePopstate(
  event: { stopImmediatePropagation(): void },
  stackLength: number
): boolean {
  if (!shouldClaimAddTilePop(stackLength)) return false;
  event.stopImmediatePropagation();
  return true;
}

export type AddTileHistoryLike = {
  pushState: (state: unknown) => void;
  back: () => void;
  go: (delta: number) => void;
};

export type AddTileHistoryController = {
  stack: () => AddTileStep[];
  push: (step: AddTileStep) => void;
  /** Apply one browser pop. `claimed` means the pager and settings must ignore it. */
  applyPop: () => { claimed: boolean; stack: AddTileStep[]; suppressed: boolean };
  back: () => void;
  discard: () => void;
};

/**
 * In-memory history. `back` and `discard` drive `applyPop` the same way
 * `popstate` does in the browser, including the single pop from `history.go(-n)`.
 */
export function createAddTileHistory(history: AddTileHistoryLike): AddTileHistoryController {
  let stack: AddTileStep[] = [];
  let suppress = 0;

  const controller: AddTileHistoryController = {
    stack: () => stack.slice(),
    push(step) {
      stack = pushAddTileStep(stack, step);
      history.pushState({ addTileDepth: stack.length, addTileStep: step });
    },
    applyPop() {
      if (suppress > 0) {
        suppress -= 1;
        return { claimed: true, stack: stack.slice(), suppressed: true };
      }
      if (!shouldClaimAddTilePop(stack.length)) {
        return { claimed: false, stack: stack.slice(), suppressed: false };
      }
      stack = popAddTileStep(stack);
      return { claimed: true, stack: stack.slice(), suppressed: false };
    },
    back() {
      if (stack.length === 0) return;
      history.back();
    },
    discard() {
      const depth = stack.length;
      stack = [];
      if (depth === 0) return;
      suppress = 1;
      history.go(-depth);
    },
  };

  return controller;
}

let browserStack: AddTileStep[] = [];
let browserSuppress = 0;
let browserHandler: (stack: AddTileStep[]) => void = () => {};

export function addTileHistoryDepth(): number {
  return browserStack.length;
}

export function pushAddTileHistory(step: AddTileStep): void {
  if (typeof window === "undefined") return;
  browserStack = pushAddTileStep(browserStack, step);
  window.history.pushState({ addTileDepth: browserStack.length, addTileStep: step }, "");
}

export function backAddTileHistory(): void {
  if (typeof window === "undefined" || browserStack.length === 0) return;
  window.history.back();
}

/** Drop every add-tile entry. The following popstate is swallowed. */
export function discardAddTileHistory(): void {
  if (typeof window === "undefined") return;
  const depth = browserStack.length;
  browserStack = [];
  if (depth === 0) return;
  browserSuppress = 1;
  window.history.go(-depth);
}

export function bindAddTilePop(handler: (stack: AddTileStep[]) => void): () => void {
  browserHandler = handler;
  if (typeof window === "undefined") return () => {};
  const onPopState = (event: PopStateEvent) => {
    if (browserSuppress > 0) {
      browserSuppress -= 1;
      event.stopImmediatePropagation();
      return;
    }
    if (!claimAddTilePopstate(event, browserStack.length)) return;
    browserStack = popAddTileStep(browserStack);
    browserHandler(browserStack.slice());
  };
  window.addEventListener("popstate", onPopState, true);
  return () => {
    window.removeEventListener("popstate", onPopState, true);
    if (browserHandler === handler) browserHandler = () => {};
  };
}
