#!/usr/bin/env node
// Downloads openWakeWord ONNX files into public/wake-word/ so the browser
// can load them same-origin. Official pretrained models come from the
// dscripka/openWakeWord v0.5.1 release (Apache-2.0). Okay Nabu is the
// community openWakeWord classifier used by Home Assistant satellites.

import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OWW = "https://github.com/dscripka/openWakeWord/releases/download/v0.5.1";
const OK_NABU =
  "https://raw.githubusercontent.com/emme99/voice-satellite-card/main/models/ok_nabu.onnx";

const MODELS = [
  { name: "melspectrogram.onnx", url: `${OWW}/melspectrogram.onnx` },
  { name: "embedding_model.onnx", url: `${OWW}/embedding_model.onnx` },
  { name: "alexa_v0.1.onnx", url: `${OWW}/alexa_v0.1.onnx` },
  { name: "hey_jarvis_v0.1.onnx", url: `${OWW}/hey_jarvis_v0.1.onnx` },
  { name: "hey_mycroft_v0.1.onnx", url: `${OWW}/hey_mycroft_v0.1.onnx` },
  { name: "hey_rhasspy_v0.1.onnx", url: `${OWW}/hey_rhasspy_v0.1.onnx` },
  { name: "ok_nabu.onnx", url: OK_NABU },
];

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "wake-word");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function download(name, url) {
  const dest = join(outDir, name);
  if (await exists(dest)) {
    console.log(`✓ ${name} (already present)`);
    return;
  }
  process.stdout.write(`↓ ${name} ... `);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`failed to download ${url} (HTTP ${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`done (${(buf.length / 1024).toFixed(0)} KB)`);
}

await mkdir(outDir, { recursive: true });
for (const model of MODELS) {
  await download(model.name, model.url);
}
console.log(`\nWake word models saved to ${outDir}`);
