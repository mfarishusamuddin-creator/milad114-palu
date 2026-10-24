"use client";

import { useState } from "react";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import type { HistoryContent, HistoryEntry } from "@/data/history";
import { cn } from "@/lib/cn";

type Props = {
  content: HistoryContent;
};

export function HistoryTimeline({ content }: Props) {
  const [active, setActive] = useState(0);
  const track = content.tracks[active] ?? content.tracks[0];

  const timelineItems: TimelineItem[] = track.entries.map((entry) => ({
    title: entry.year,
    content: <EntryBody entry={entry} />,
  }));

  return (
    <div>
      <div
        role="tablist"
        aria-label={content.tabsLabel}
        className="flex flex-wrap gap-2"
      >
        {content.tracks.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`history-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls="history-panel"
            onClick={() => setActive(index)}
            className={cn(
              "min-h-11 rounded-sm border px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-colors",
              index === active
                ? "border-gold bg-gold text-navy"
                : "border-line bg-surface text-ink-soft hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
        {track.description}
      </p>

      <div
        id="history-panel"
        role="tabpanel"
        aria-labelledby={`history-tab-${track.id}`}
        className="mt-8"
      >
        <div className="hidden md:block">
          <Timeline data={timelineItems} />
        </div>

        <div className="md:hidden">
          {track.entries.map((entry) => (
            <details key={entry.id} className="group border-t border-line">
              <summary className="flex cursor-pointer list-none items-baseline gap-3 py-4 [&::-webkit-details-marker]:hidden">
                <span className="flex-none font-serif text-sm font-bold text-gold-text">
                  {entry.year}
                </span>
                <span className="font-serif text-base font-bold text-ink">
                  {entry.title}
                </span>
                <span
                  className="ms-auto flex-none text-ink-soft transition-transform group-open:rotate-90"
                  aria-hidden="true"
                >
                  <ChevronIcon />
                </span>
              </summary>
              <div className="pb-6">
                <EntryBody entry={entry} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function EntryBody({ entry }: { entry: HistoryEntry }) {
  return (
    <div>
      <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ocean">
        {entry.kicker}
      </p>
      <h4 className="mt-1.5 font-serif text-xl font-bold text-ink md:text-2xl">
        {entry.title}
      </h4>
      <div className="prose-milad mt-2 max-w-2xl text-sm">
        {entry.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
      {entry.facts?.length ? (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
          {entry.facts.map((fact) => (
            <li
              key={fact}
              className="flex items-start gap-1.5 text-xs leading-relaxed text-ink-soft"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-kelor-deep"
                aria-hidden="true"
              />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
