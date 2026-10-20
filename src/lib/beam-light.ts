type LightSampler = (x: number, y: number) => number;

let sampler: LightSampler | null = null;

/**
 * Posisi aktual (interpolated) kapal selam — dibagikan antar SubmarineCursor dan
 * SwarmCursor agar swarm/partikel mengikuti SUBMARINE (satu sistem), bukan kursor
 * mentah. Nilai dalam koordinat viewport (client).
 */
export const submarinePose = { x: 0, y: 0, active: false };

/** Called by useMaintenanceScene while the home page is mounted; null on unmount. */
export function setBeamLightSampler(fn: LightSampler | null) {
  sampler = fn;
}

/** Light level (0–1) at a viewport point. Returns 1 (always visible) on pages that don't gate visibility by light. */
export function sampleBeamLight(x: number, y: number): number {
  return sampler ? sampler(x, y) : 1;
}
