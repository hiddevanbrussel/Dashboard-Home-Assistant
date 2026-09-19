export const VOICE_SAMPLE_RATE = 16000;
export const VOICE_MAX_SECONDS = 10;

export function floatTo16BitPcm(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i] ?? 0));
    out[i] = s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
  }
  return out;
}

export function downsampleTo16k(input: Float32Array, inputSampleRate: number): Float32Array {
  if (!Number.isFinite(inputSampleRate) || inputSampleRate <= VOICE_SAMPLE_RATE) return input;
  const ratio = inputSampleRate / VOICE_SAMPLE_RATE;
  const length = Math.round(input.length / ratio);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const start = Math.round(i * ratio);
    const end = Math.min(input.length, Math.round((i + 1) * ratio));
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j++) {
      sum += input[j] ?? 0;
      count += 1;
    }
    out[i] = count ? sum / count : 0;
  }
  return out;
}

export function concatFloat32(chunks: Float32Array[]): Float32Array {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Float32Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function pcm16ToArrayBuffer(pcm: Int16Array): ArrayBuffer {
  return pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.byteLength) as ArrayBuffer;
}
