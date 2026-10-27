/**
 * @vitest-environment happy-dom
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MusicNowPlayingOverlay } from "./music-now-playing-overlay";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("next/image", () => ({
  default: () => null,
}));

const labels = {
  close: "Sluiten",
  play: "Afspelen",
  pause: "Pauzeren",
  previous: "Vorige",
  next: "Volgende",
  position: "Afspeelpositie",
};

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  coverSrc: string | null;
  title: string;
  artist: string;
  isPlaying: boolean;
  position: number;
  duration: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (positionSeconds: number) => void;
  seekDisabled: boolean;
  labels: typeof labels;
};

function slider(): HTMLInputElement {
  const el = document.querySelector('input[aria-label="Afspeelpositie"]');
  if (!(el instanceof HTMLInputElement)) throw new Error("missing Afspeelpositie slider");
  return el;
}

function setRange(el: HTMLInputElement, value: number) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(el, String(value));
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function press(el: HTMLInputElement, key: string) {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("Now playing position slider", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;

  afterEach(() => {
    if (root) act(() => root?.unmount());
    host?.remove();
    root = null;
    host = null;
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  function render(initial: { position?: number; duration?: number; onSeek?: (seconds: number) => void } = {}) {
    const props: OverlayProps = {
      open: true,
      onClose: vi.fn(),
      coverSrc: null,
      title: "Golden",
      artist: "Harry Styles",
      isPlaying: true,
      position: initial.position ?? 20,
      duration: initial.duration ?? 100,
      onPlayPause: vi.fn(),
      onPrevious: vi.fn(),
      onNext: vi.fn(),
      onSeek: initial.onSeek ?? vi.fn(),
      seekDisabled: false,
      labels,
    };
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    const update = (next: Partial<OverlayProps>) => {
      Object.assign(props, next);
      act(() => {
        root?.render(createElement(MusicNowPlayingOverlay, props));
      });
    };
    update({});
    return { onSeek: props.onSeek, update };
  }

  it("sends one seek with the released position after a drag from 20% to 80%", () => {
    const onSeek = vi.fn();
    const { update } = render({ onSeek, position: 20, duration: 100 });
    const el = slider();
    el.focus();

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    });
    act(() => setRange(el, 40));
    act(() => setRange(el, 80));
    act(() => update({ position: 5 }));

    expect(onSeek).not.toHaveBeenCalled();
    expect(el.value).toBe("80");
    expect(el.parentElement?.parentElement?.firstElementChild?.textContent).toBe("1:20");

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    });

    expect(onSeek).toHaveBeenCalledTimes(1);
    expect(onSeek).toHaveBeenCalledWith(80);
    expect(document.activeElement).toBe(el);
    expect(el.disabled).toBe(false);
  });

  it("sends one seek for a click and does not seek again on the change that follows", () => {
    const onSeek = vi.fn();
    render({ onSeek, position: 20, duration: 100 });
    const el = slider();

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      setRange(el, 55);
      el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(onSeek).toHaveBeenCalledTimes(1);
    expect(onSeek).toHaveBeenCalledWith(55);
  });

  it("sends one seek for a touch that ends on touchend", () => {
    const onSeek = vi.fn();
    render({ onSeek, position: 20, duration: 100 });
    const el = slider();
    el.focus();

    act(() => {
      el.dispatchEvent(new Event("touchstart", { bubbles: true }));
      setRange(el, 60);
      el.dispatchEvent(new Event("touchend", { bubbles: true }));
    });

    expect(onSeek).toHaveBeenCalledTimes(1);
    expect(onSeek).toHaveBeenCalledWith(60);
    expect(document.activeElement).toBe(el);
  });

  it("commits a drag once when the range change event fires before pointerup", () => {
    const onSeek = vi.fn();
    render({ onSeek, position: 20, duration: 100 });
    const el = slider();

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      setRange(el, 70);
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    });

    expect(onSeek).toHaveBeenCalledTimes(1);
    expect(onSeek).toHaveBeenCalledWith(70);
  });

  it("debounces three arrow steps into one seek and keeps focus on the slider", async () => {
    vi.useFakeTimers();
    const onSeek = vi.fn();
    const { update } = render({ onSeek, position: 20, duration: 100 });
    const el = slider();
    el.focus();

    act(() => press(el, "ArrowRight"));
    expect(el.value).toBe("21");
    act(() => update({ position: 50 }));
    expect(el.value).toBe("21");
    act(() => {
      press(el, "ArrowRight");
      press(el, "ArrowRight");
    });

    expect(el.value).toBe("23");
    expect(onSeek).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(el);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(onSeek).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(onSeek).toHaveBeenCalledTimes(1);
    expect(onSeek).toHaveBeenCalledWith(23);
    expect(document.activeElement).toBe(el);
    expect(el.disabled).toBe(false);

    act(() => update({ seekDisabled: true, position: 50 }));
    expect(el.getAttribute("aria-busy")).toBe("true");
    expect(el.disabled).toBe(false);
    expect(el.value).toBe("23");
    expect(document.activeElement).toBe(el);

    act(() => update({ seekDisabled: false, position: 23 }));
    expect(document.activeElement).toBe(el);
    expect(el.value).toBe("23");
  });

  it("debounces Home, End and page keys into one seek of the final position", async () => {
    vi.useFakeTimers();
    const onSeek = vi.fn();
    render({ onSeek, position: 20, duration: 100 });
    const el = slider();
    el.focus();

    act(() => {
      press(el, "PageUp");
      press(el, "ArrowUp");
      press(el, "End");
      press(el, "PageDown");
      press(el, "ArrowDown");
      press(el, "Home");
    });

    expect(el.value).toBe("0");
    expect(onSeek).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(onSeek).toHaveBeenCalledTimes(1);
    expect(onSeek).toHaveBeenCalledWith(0);
    expect(document.activeElement).toBe(el);
  });

  it("jumps back to the Music Assistant position after a failed seek without blurring", () => {
    const onSeek = vi.fn();
    const { update } = render({ onSeek, position: 20, duration: 100 });
    const el = slider();
    el.focus();

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      setRange(el, 80);
      el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    });
    expect(onSeek).toHaveBeenCalledWith(80);
    expect(el.value).toBe("80");

    act(() => update({ seekDisabled: true, position: 20 }));
    expect(el.value).toBe("80");
    expect(el.disabled).toBe(false);
    expect(document.activeElement).toBe(el);

    act(() => update({ seekDisabled: false, position: 20 }));
    expect(el.value).toBe("20");
    expect(document.activeElement).toBe(el);
    expect(el.getAttribute("aria-busy")).toBeNull();
  });
});
