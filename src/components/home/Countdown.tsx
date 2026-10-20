"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import type { Dictionary } from "@/i18n/types";

type PhaseKey = "before" | "during" | "milad" | "done";

type Phase = {
  target: number;
  key: PhaseKey;
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

  if (now < start) return { target: start, key: "before" };
  if (now < end) return { target: end, key: "during" };
  if (now < milad) return { target: milad, key: "milad" };
  return { target: milad, key: "done" };
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

export function Countdown({ dict }: { dict: Dictionary }) {
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

  const labels = phase
    ? {
        before: {
          label: dict.countdown.beforeLabel,
          note: dict.countdown.beforeNote,
        },
        during: {
          label: dict.countdown.duringLabel,
          note: dict.countdown.duringNote,
        },
        milad: {
          label: dict.countdown.miladLabel,
          note: dict.countdown.miladNote,
        },
        done: {
          label: dict.countdown.doneLabel,
          note: dict.countdown.doneNote,
        },
      }[phase.key]
    : { label: dict.countdown.beforeLabel, note: dict.countdown.beforeNote };

  return (
    <div className="countdown-shell p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-gold-light">
          {labels.label}
        </p>
        <span className="rounded-sm border border-white/15 bg-white/8 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/70">
          {dict.countdown.wita}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
        <TimeCell value={pad(values.days)} label={dict.countdown.days} />
        <TimeCell value={pad(values.hours)} label={dict.countdown.hours} />
        <TimeCell value={pad(values.minutes)} label={dict.countdown.minutes} />
        <TimeCell value={pad(values.seconds)} label={dict.countdown.seconds} />
      </div>

      <p className="mt-3 text-xs text-white/60">{labels.note}</p>

      <p className="sr-only" aria-live="polite">
        {remaining
          ? `${remaining.days} ${dict.countdown.days}, ${remaining.hours} ${dict.countdown.hours}, ${remaining.minutes} ${dict.countdown.minutes} — ${labels.label}.`
          : dict.countdown.beforeLabel}
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
