import { describe, expect, it } from "vitest";
import { concatFloat32, downsampleTo16k, floatTo16BitPcm, nextWakeSilenceState, pcmRms } from "./voice-audio";

describe("voice audio helpers", () => {
  it("converts float samples to 16-bit PCM", () => {
    const pcm = floatTo16BitPcm(new Float32Array([0, 1, -1, 0.5]));
    expect(Array.from(pcm)).toEqual([0, 32767, -32768, 16384]);
  });

  it("downsamples audio toward 16 kHz", () => {
    const input = new Float32Array(8).fill(0.2);
    const out = downsampleTo16k(input, 32000);
    expect(out.length).toBe(4);
    expect(out[0]).toBeCloseTo(0.2);
  });

  it("concatenates float chunks", () => {
    const out = concatFloat32([new Float32Array([1, 2]), new Float32Array([3])]);
    expect(Array.from(out)).toEqual([1, 2, 3]);
  });

  it("detects end of speech after energy then silence", () => {
    expect(pcmRms([0, 0, 0])).toBe(0);
    expect(pcmRms([1, -1])).toBeCloseTo(1);
    let state = { heard: 0, silent: 0, done: false };
    for (let i = 0; i < 4; i++) {
      state = nextWakeSilenceState(state, 0.05);
      expect(state.done).toBe(false);
    }
    for (let i = 0; i < 9; i++) {
      state = nextWakeSilenceState(state, 0.001);
      expect(state.done).toBe(false);
    }
    expect(nextWakeSilenceState(state, 0.001).done).toBe(true);
  });
});
