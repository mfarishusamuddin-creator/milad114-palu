"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const STOPS = [
  { key: "m114:kanopi", label: "Kanopi", href: "/" },
  { key: "m114:akar", label: "Akar", href: "/sejarah" },
  { key: "m114:batang", label: "Batang", href: "/layanan" },
];

export function JourneyProgress() {
  const [visited, setVisited] = useState<Record<string, boolean>>({});

  useEffect(() => {
    function read() {
      const next: Record<string, boolean> = {};
      for (const stop of STOPS) {
        try {
          next[stop.key] = window.localStorage.getItem(stop.key) === "1";
        } catch {
          next[stop.key] = false;
        }
      }
      setVisited(next);
    }

    read();
    const frame = window.requestAnimationFrame(read);
    window.addEventListener("focus", read);
    document.addEventListener("visibilitychange", read);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("focus", read);
      document.removeEventListener("visibilitychange", read);
    };
  }, []);

  const count = STOPS.filter((stop) => visited[stop.key]).length;
  const complete = count === STOPS.length;

  return (
    <div className="flex flex-wrap items-center gap-3 border-l border-gold py-2 pl-4">
      <div
        className="flex items-center gap-2"
        aria-label={`Progres penjelajahan: ${count} dari ${STOPS.length}`}
      >
        {STOPS.map((stop) => (
          <Link
            key={stop.key}
            href={stop.href}
            title={stop.label}
            aria-label={`Buka ${stop.label}`}
            className={cn(
              "h-2.5 w-2.5 rounded-full border transition-colors",
              visited[stop.key]
                ? "border-gold bg-gold"
                : "border-ink-soft/30 bg-white"
            )}
          />
        ))}
      </div>
      <p className="text-xs font-semibold text-ink-soft">
        {complete ? (
          <span className="text-gold-text">Pohon lengkap — 3/3 daun</span>
        ) : (
          <>
            Jelajahi tiga pintu{" "}
            <span className="text-navy">
              {count}/{STOPS.length}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
