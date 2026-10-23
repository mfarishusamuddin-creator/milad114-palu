"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Counter from "@/components/shared/Counter";
import GradientText from "@/components/shared/GradientText";
import { SITE } from "@/data/site";
import { DEFAULT_TIMEZONE, TIMEZONES } from "@/data/timezones";
import type { Dictionary } from "@/i18n/types";

type CounterMode = "event" | "ramadhan";
type PhaseKey = "before" | "during" | "milad" | "done";
type RamadhanPhaseKey =
  | "before"
  | "farewell1448"
  | "before1449"
  | "farewell1449"
  | "done";

type Phase = {
  target: number;
  key: PhaseKey;
};

type RamadhanPhase = {
  target: number;
  key: RamadhanPhaseKey;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/* 1 Ramadhan 1448 H = 8 Februari 2027 dan 1 Syawal 1448 H = 9 Maret 2027
   mengikuti KHGT; waktu maghrib 18.00 WITA adalah perkiraan. */
const RAMADAN_TARGETS = [
  {
    key: "before",
    targetISO: "2027-02-07T18:00:00+08:00",
    endISO: "2027-03-08T18:00:00+08:00",
  },
  {
    key: "farewell1448",
    targetISO: "2027-03-08T18:00:00+08:00",
    endISO: "2028-01-27T18:00:00+08:00",
  },
  {
    key: "before1449",
    targetISO: "2028-01-27T18:00:00+08:00",
    endISO: "2028-02-25T18:00:00+08:00",
  },
  {
    key: "farewell1449",
    targetISO: "2028-02-25T18:00:00+08:00",
    endISO: "",
  },
] as const;

function getPhase(now: number): Phase {
  const start = new Date(SITE.startISO).getTime();
  const end = new Date(SITE.endISO).getTime();
  const milad = new Date(SITE.miladISO).getTime();

  if (now < start) return { target: start, key: "before" };
  if (now < end) return { target: end, key: "during" };
  if (now < milad) return { target: milad, key: "milad" };
  return { target: milad, key: "done" };
}

function getRamadhanPhase(now: number): RamadhanPhase {
  for (const phase of RAMADAN_TARGETS) {
    const target = new Date(phase.targetISO).getTime();
    if (now < target) return { target, key: phase.key };
  }
  const last = RAMADAN_TARGETS[RAMADAN_TARGETS.length - 1];
  return {
    target: new Date(last.targetISO).getTime(),
    key: "done",
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

const ZERO: Remaining = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function Countdown({ dict }: { dict: Dictionary }) {
  const [now, setNow] = useState<number | null>(null);
  const [zone, setZone] = useState<string>(DEFAULT_TIMEZONE);
  const [mode, setMode] = useState<CounterMode>("event");
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

  const ramadhan = dict.countdown.ramadhan;

  const ramadhanLabels = useMemo<
    Record<RamadhanPhaseKey, { label: string; note: string }>
  >(
    () => ({
      before: { label: ramadhan.beforeLabel, note: ramadhan.beforeNote },
      farewell1448: {
        label: ramadhan.farewell1448Label,
        note: ramadhan.farewell1448Note,
      },
      before1449: {
        label: ramadhan.before1449Label,
        note: ramadhan.before1449Note,
      },
      farewell1449: {
        label: ramadhan.farewell1449Label,
        note: ramadhan.farewell1449Note,
      },
      done: { label: ramadhan.doneLabel, note: ramadhan.doneNote },
    }),
    [ramadhan]
  );

  const phase = now === null ? null : getPhase(now);
  const ramadhanPhase = now === null ? null : getRamadhanPhase(now);
  const activePhase =
    mode === "event" ? phase : (ramadhanPhase as Phase | null);
  const remaining =
    now === null || activePhase === null ? null : getRemaining(activePhase.target, now);

  const values = remaining ?? ZERO;

  const labels = useMemo(() => {
    if (mode === "event") {
      return phase
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
    }
    return ramadhanPhase
      ? ramadhanLabels[ramadhanPhase.key]
      : ramadhanLabels.before;
  }, [dict, phase, ramadhanPhase, ramadhanLabels, mode]);

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

  const targetTime = activePhase
    ? `${targetFormatter.format(new Date(activePhase.target))} · ${activeZone.abbr}`
    : "—";

  const handleModeToggle = () => {
    const next = mode === "event" ? "ramadhan" : "event";
    setMode(next);
    setReplayKey((key) => key + 1);
  };

  const handleZoneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    if (next === zone) return;
    setZone(next);
    setReplayKey((key) => key + 1);
  };

  return (
    <div className="countdown-shell p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          className="countdown-toggle"
          onClick={handleModeToggle}
          aria-pressed={mode === "ramadhan"}
          aria-label={`${labels.label}. ${dict.countdown.modeToggle}`}
        >
          <GradientText start animationSpeed={12} angle={90}>
            {labels.label}
          </GradientText>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="countdown-toggle-chevron text-white/70"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
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

      <div
        className="mt-4 grid grid-cols-4 gap-2 sm:gap-3"
        key={`${mode}-${zone}-${replayKey}`}
      >
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
          : labels.label}
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
