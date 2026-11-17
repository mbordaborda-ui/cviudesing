"use client";

/**
 * Sonidos de interfaz opcionales. Desactivados por defecto y creados
 * únicamente tras una interacción del usuario (nunca autoplay).
 */

const STORAGE_KEY = "miguel-os-sfx";

let context: AudioContext | null = null;
let enabled = false;

export function initSfx(): boolean {
  if (typeof window === "undefined") return false;
  enabled = window.localStorage.getItem(STORAGE_KEY) === "on";
  return enabled;
}

export function isSfxEnabled() {
  return enabled;
}

export function setSfxEnabled(next: boolean) {
  enabled = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  }
  if (!next && context) {
    context.close().catch(() => {});
    context = null;
  }
}

type ToneKind = "nav" | "confirm" | "open";

const TONES: Record<ToneKind, { frequency: number; end: number; duration: number; gain: number }> = {
  nav: { frequency: 520, end: 780, duration: 0.14, gain: 0.045 },
  open: { frequency: 320, end: 620, duration: 0.22, gain: 0.05 },
  confirm: { frequency: 660, end: 990, duration: 0.18, gain: 0.05 },
};

export function playTone(kind: ToneKind) {
  if (!enabled) return;

  try {
    context ??= new AudioContext();
    const audio = context;
    if (audio.state === "suspended") void audio.resume();

    const now = audio.currentTime;
    const tone = TONES[kind];
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(tone.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      tone.end,
      now + tone.duration,
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(tone.gain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);

    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + tone.duration + 0.02);
  } catch {
    // Sin audio disponible: la interfaz sigue funcionando.
  }
}
