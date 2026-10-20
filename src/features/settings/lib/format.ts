/** Format byte ke satuan yang mudah dibaca. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const v = bytes / Math.pow(1024, i);
  return `${v.toFixed(v >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export type WebVitalRating = "good" | "needs-improvement" | "poor" | "unknown";

/** Klasifikasi Core Web Vitals per standar web.dev (id-ID). */
export function ratingFor(metric: string, value: number): WebVitalRating {
  const bounds: Record<string, [number, number]> = {
    lcp: [2500, 4000],
    inp: [200, 500],
    cls: [0.1, 0.25],
    fcp: [1800, 3000],
    ttfb: [800, 1800],
  };
  const [good, poor] = bounds[metric] ?? [Infinity, Infinity];
  if (!Number.isFinite(value)) return "unknown";
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

export const RATING_LABEL: Record<WebVitalRating, string> = {
  good: "Baik",
  "needs-improvement": "Perlu perbaikan",
  poor: "Buruk",
  unknown: "—",
};
