import type { SubmarineSettings } from "../types";

export const DEFAULT_SUBMARINE: SubmarineSettings = {
  enabled: true,
  sensitivity: 100,
  movementSmoothness: 60,
  rotationSmoothness: 70,
  lightIntensity: 100,
  lightRange: 100,
  beamSpread: 100,
  beamSoftness: 60,
  glow: 100,
  illumination: 40,
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export interface ResolvedSubmarine {
  lerp: number;
  angleLerp: number;
  reach: number;
  spread: number;
  wideSpread: number;
  /** Pengali alpha untuk tint/glow (intensitas cahaya). */
  intensity: number;
  /** Pengali untuk glow hidung. */
  glow: number;
  /** Kelembutan tepi (0..1); makin besar = makin soft. */
  softness: number;
  /** Alpha kegelapan di luar beam (0..1). 0 = terlihat penuh, 1 = gelap total. */
  darkness: number;
}

/** Ubah pengaturan mentah menjadi parameter konkret yang dipakai renderer. */
export function resolveSubmarine(s: SubmarineSettings): ResolvedSubmarine {
  const sens = clamp(s.sensitivity, 0, 200);
  const moveSm = clamp(s.movementSmoothness, 0, 100);
  const rotSm = clamp(s.rotationSmoothness, 0, 100);
  const range = clamp(s.lightRange, 0, 300);
  const spreadPct = clamp(s.beamSpread, 0, 300);
  const intensity = clamp(s.lightIntensity, 0, 200) / 100;
  const glow = clamp(s.glow, 0, 200) / 100;
  const softness = clamp(s.beamSoftness, 0, 100) / 100;
  const illum = clamp(s.illumination, 0, 100) / 100;

  // Lerp posisi: sensitifitas makin tinggi = makin responsif; smoothness meredamnya.
  const lerp = 0.04 + (sens / 200) * 0.28 * (1 - (moveSm / 100) * 0.4);
  // Lerp rotasi: smoothness makin tinggi = putaran makin halus (slower turn).
  const angleLerp = 0.34 - (rotSm / 100) * 0.28;
  const reach = 900 * (range / 100);
  const spread = 0.32 * (spreadPct / 100);
  const wideSpread = spread + 0.3;
  // illumination 0 -> gelap total (0.97); 100 -> terlihat penuh (0).
  const darkness = 0.97 * (1 - illum);

  return { lerp, angleLerp, reach, spread, wideSpread, intensity, glow, softness, darkness };
}
