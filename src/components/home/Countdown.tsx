"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Counter from "@/components/shared/Counter";
import { SITE } from "@/data/site";
import { DEFAULT_TIMEZONE, TIMEZONES } from "@/data/timezones";
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

export function Countdown({ dict }: { dict: Dictionary }) {
  const [now, setNow] = useState<number | null>(null);
  const [zone, setZone] = useState<string>(DEFAULT_TIMEZONE);
  const [replayKey, setReplayKey] = useState(0);

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
    now === null || phase === null ? null : getRemaining(phase.target, now);

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

  const activeZone = useMemo(
    () => TIMEZONES.find((option) => option.value === zone) ?? TIMEZONES[0],
    [zone]
  );

  const targetFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(dict.locale, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: zone,
      }),
    [dict.locale, zone]
  );

  const targetTime = phase
    ? `${targetFormatter.format(new Date(phase.target))} · ${activeZone.abbr}`
    : "—";

  const handleZoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    if (next === zone) return;
    setZone(next);
    setReplayKey((key) => key + 1);
  };

  return (
    <div className="countdown-shell p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-gold-light">
          {labels.label}
        </p>
        <select
          className="countdown-zone-select"
          value={zone}
          onChange={handleZoneChange}
          aria-label={dict.countdown.timezone}
          title={activeZone.label}
        >
          {TIMEZONES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.abbr}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3" key={`${zone}-${replayKey}`}>
        <TimeCell value={values.days} locale={dict.locale} label={dict.countdown.days} />
        <TimeCell value={values.hours} locale={dict.locale} label={dict.countdown.hours} />
        <TimeCell value={values.minutes} locale={dict.locale} label={dict.countdown.minutes} />
        <TimeCell value={values.seconds} locale={dict.locale} label={dict.countdown.seconds} />
      </div>

      <p className="countdown-target mt-3 text-xs text-white/60">
        <span className="countdown-target-label">{dict.countdown.targetTime}</span>
        <span>{targetTime}</span>
      </p>

      <p className="mt-3 text-xs text-white/60">{labels.note}</p>

      <p className="sr-only" aria-live="polite">
        {remaining
          ? `${remaining.days} ${dict.countdown.days}, ${remaining.hours} ${dict.countdown.hours}, ${remaining.minutes} ${dict.countdown.minutes} — ${labels.label}.`
          : dict.countdown.beforeLabel}
      </p>
    </div>
  );
}

function TimeCell({
  value,
  locale,
  label,
}: {
  value: number;
  locale: string;
  label: string;
}) {
  return (
    <div className="countdown-cell" aria-hidden="true">
      <span className="countdown-value">
        <Counter
          value={value}
          locale={locale}
          minDigits={2}
          fontSize="inherit"
          fontWeight="inherit"
          textColor="inherit"
          duration={0.55}
          bounce={0.18}
          stagger={0.03}
          motionBlur
          intro
          tabular
        />
      </span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}
