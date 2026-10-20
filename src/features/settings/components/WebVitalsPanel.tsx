import { useEffect, useRef, useState } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

import { cn } from "@/lib/utils";
import { ratingFor, RATING_LABEL, type WebVitalRating } from "../lib/format";

type VitalsState = Record<string, Metric | null>;

const METRICS: { key: string; label: string; unit: (v: number) => string }[] = [
  { key: "lcp", label: "LCP (konten utama)", unit: (v) => `${(v / 1000).toFixed(2)} s` },
  { key: "inp", label: "INP (interaktivitas)", unit: (v) => `${Math.round(v)} ms` },
  { key: "cls", label: "CLS (stabilitas)", unit: (v) => v.toFixed(3) },
  { key: "fcp", label: "FCP (konten pertama)", unit: (v) => `${(v / 1000).toFixed(2)} s` },
  { key: "ttfb", label: "TTFB (respons server)", unit: (v) => `${Math.round(v)} ms` },
];

function ratingDot(rating: WebVitalRating) {
  return cn(
    "size-2 rounded-full",
    rating === "good" && "bg-emerald-400",
    rating === "needs-improvement" && "bg-amber-400",
    rating === "poor" && "bg-red-400",
    rating === "unknown" && "bg-muted-foreground/40",
  );
}

/** Core Web Vitals — diukur dari beban halaman saat ini (client-side). */
export function WebVitalsPanel() {
  const [vitals, setVitals] = useState<VitalsState>({});
  const attachedRef = useRef(false);

  useEffect(() => {
    if (attachedRef.current) return;
    attachedRef.current = true;
    const record = (m: Metric) => setVitals((prev) => ({ ...prev, [m.name]: m }));
    onCLS(record);
    onFCP(record);
    onINP(record);
    onLCP(record);
    onTTFB(record);
  }, []);

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Diukur dari beban halaman admin saat ini. Nilai terbaru untuk sesi ini; muat ulang halaman untuk
        pengukuran baru.
      </p>
      <div className="flex flex-col gap-2">
        {METRICS.map(({ key, label, unit }) => {
          const m = vitals[key];
          const rating = m ? ratingFor(key, m.value) : "unknown";
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={cn("size-2 rounded-full", ratingDot(rating))} />
                <span className="text-sm text-foreground">{label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg text-foreground">
                  {m ? unit(m.value) : "—"}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {RATING_LABEL[rating]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
