"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/site";

type Phase = {
  target: number;
  label: string;
  note: string;
  finished: boolean;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getPhase(now: number): Phase {
  const start = new Date(SITE.startISO).getTime();
  const end = new Date(SITE.endISO).getTime();
  const milad = new Date(SITE.miladISO).getTime();

  if (now < start) {
    return {
      target: start,
      label: "Menuju Tanwir & Milad",
      note: "Palu · 13–15 November 2026",
      finished: false,
    };
  }
  if (now < end) {
    return {
      target: end,
      label: "Tanwir & Milad sedang berlangsung",
      note: "Palu · 13–15 November 2026",
      finished: false,
    };
  }
  if (now < milad) {
    return {
      target: milad,
      label: "Menuju Milad ke-114",
      note: "18 November 2026",
      finished: false,
    };
  }
  return {
    target: milad,
    label: "Milad ke-114 telah berlangsung",
    note: "Terima kasih telah menjelajah",
    finished: true,
  };
}

function getRemaining(target: number, now: number): Remaining {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const frame = window.requestAnimationFrame(tick);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(id);
    };
  }, []);

  const phase = now === null ? null : getPhase(now);
  const remaining =
    now === null || phase === null
      ? null
      : getRemaining(phase.target, now);

  const values = remaining ?? {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  return (
    <div className="countdown-shell p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-gold-light">
          {phase?.label ?? "Menghitung waktu"}
        </p>
        <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/70">
          WITA
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
        <TimeCell value={pad(values.days)} label="Hari" />
        <TimeCell value={pad(values.hours)} label="Jam" />
        <TimeCell value={pad(values.minutes)} label="Menit" />
        <TimeCell value={pad(values.seconds)} label="Detik" />
      </div>

      <p className="mt-3 text-xs text-white/60">
        {phase?.note ?? "Palu, Sulawesi Tengah"}
      </p>

      <p className="sr-only" aria-live="polite">
        {remaining
          ? `${remaining.days} hari, ${remaining.hours} jam, ${remaining.minutes} menit menuju ${phase?.label}.`
          : "Memuat hitungan waktu."}
      </p>
    </div>
  );
}

function TimeCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="countdown-cell" aria-hidden="true">
      <span className="countdown-value">{value}</span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}
