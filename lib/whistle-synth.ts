import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import type { WhistleBeat, WhistlePattern } from '@/content/interactive-audible/types';

const SAMPLE_RATE = 44100;
const SHORT_MS = 360;
const LONG_MS = 900;
const GAP_MS = 170;

let activePlayer: AudioPlayer | null = null;

function silence(durationSec: number): Float32Array {
  return new Float32Array(Math.max(1, Math.floor(durationSec * SAMPLE_RATE)));
}

function renderTone(durationSec: number, volume: number): Float32Array {
  const length = Math.floor(durationSec * SAMPLE_RATE);
  const samples = new Float32Array(length);
  const baseFreq = 520;

  for (let index = 0; index < length; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, time / 0.04);
    const release = Math.min(1, (durationSec - time) / 0.07);
    const envelope = attack * release;
    const tone =
      Math.sin(2 * Math.PI * baseFreq * time) * 0.55 +
      Math.sin(2 * Math.PI * baseFreq * 2.05 * time) * 0.22 +
      Math.sin(2 * Math.PI * baseFreq * 0.52 * time) * 0.12;

    samples[index] = tone * envelope * volume;
  }

  return samples;
}

function concat(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Float32Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }

  return merged;
}

function beatDurationMs(beat: WhistleBeat): number {
  return beat === 'short' ? SHORT_MS : LONG_MS;
}

function appendBeat(chunks: Float32Array[], beat: WhistleBeat, volume: number) {
  chunks.push(renderTone(beatDurationMs(beat) / 1000, volume));
  chunks.push(silence(GAP_MS / 1000));
}

function synthesizeStandardPattern(pattern: WhistlePattern): Float32Array {
  const chunks: Float32Array[] = [];
  const volume = pattern.volume ?? 1;
  const repeats = pattern.repeat ?? 1;

  for (let repeat = 0; repeat < repeats; repeat += 1) {
    for (const beat of pattern.beats) {
      appendBeat(chunks, beat, volume);
    }

    if (repeat < repeats - 1) {
      chunks.push(silence(0.28));
    }
  }

  return concat(chunks);
}

function synthesizeLoopDemo(seconds: number, volume: number): Float32Array {
  const chunks: Float32Array[] = [];
  const endSample = seconds * SAMPLE_RATE;
  let produced = 0;

  while (produced < endSample) {
    chunks.push(renderTone(1.1, volume * 0.95));
    chunks.push(silence(0.12));
    appendBeat(chunks, 'short', volume);
    appendBeat(chunks, 'short', volume);
    appendBeat(chunks, 'short', volume * 0.9);
    chunks.push(silence(0.22));
    produced = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  }

  return concat(chunks).slice(0, endSample);
}

export function synthesizePatternSamples(pattern: WhistlePattern): Float32Array {
  if (pattern.demoLoopSeconds) {
    return synthesizeLoopDemo(pattern.demoLoopSeconds, pattern.volume ?? 1);
  }

  return synthesizeStandardPattern(pattern);
}

function encodeWav(samples: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let index = 0; index < samples.length; index += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(offset, clamped * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

function bytesToBase64(bytes: Uint8Array): string {
  const encodeWithBtoa = globalThis.btoa;
  if (typeof encodeWithBtoa === 'function') {
    let binary = '';
    const chunkSize = 0x8000;

    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return encodeWithBtoa(binary);
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index];
    const b = index + 1 < bytes.length ? bytes[index + 1] : 0;
    const c = index + 2 < bytes.length ? bytes[index + 2] : 0;
    const triplet = (a << 16) | (b << 8) | c;

    output += alphabet[(triplet >> 18) & 0x3f];
    output += alphabet[(triplet >> 12) & 0x3f];
    output += index + 1 < bytes.length ? alphabet[(triplet >> 6) & 0x3f] : '=';
    output += index + 2 < bytes.length ? alphabet[triplet & 0x3f] : '=';
  }

  return output;
}

function bufferToDataUri(buffer: ArrayBuffer): string {
  return `data:audio/wav;base64,${bytesToBase64(new Uint8Array(buffer))}`;
}

export function estimatePatternDurationMs(pattern: WhistlePattern): number {
  if (pattern.demoLoopSeconds) {
    return pattern.demoLoopSeconds * 1000;
  }

  const repeats = pattern.repeat ?? 1;
  let duration = 0;

  for (let repeat = 0; repeat < repeats; repeat += 1) {
    for (const beat of pattern.beats) {
      duration += beatDurationMs(beat) + GAP_MS;
    }

    if (repeat < repeats - 1) {
      duration += 280;
    }
  }

  return duration;
}

export async function playWhistlePattern(pattern: WhistlePattern): Promise<void> {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
  });

  if (activePlayer) {
    activePlayer.pause();
    activePlayer.remove();
    activePlayer = null;
  }

  const wav = encodeWav(synthesizePatternSamples(pattern));
  const uri = bufferToDataUri(wav);
  activePlayer = createAudioPlayer(uri);
  activePlayer.play();
}

export function stopWhistlePlayback() {
  if (!activePlayer) {
    return;
  }

  activePlayer.pause();
  activePlayer.remove();
  activePlayer = null;
}
