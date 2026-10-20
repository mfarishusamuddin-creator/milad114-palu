"use client";

import scrollama from "scrollama";
import { useEffect, useRef, useState } from "react";
import { SourceNote } from "@/components/shared/SourceNote";
import { SpaceTree } from "@/components/shared/SpaceTree";
import type { Milestone } from "@/data/milestones";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";

type Props = {
  chapters: Milestone[];
  dict: Dictionary["history"];
};

export function HistoryExperience({ chapters, dict }: Props) {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const scroller = scrollama();
    scroller
      .setup({
        step: ".history-step",
        offset: 0.5,
        progress: false,
      })
      .onStepEnter((response) => {
        setActive(response.index);
      });

    return () => scroller.destroy();
  }, []);

  function scrollTo(index: number) {
    const node = chapterRefs.current[index];
    if (!node) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    node.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  const activeChapter = chapters[active] ?? chapters[0];

  return (
    <div className="lg:grid lg:grid-cols-[330px_1fr] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {dict.mapEyebrow}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="font-serif text-4xl font-bold leading-none text-navy">
                {activeChapter.year}
              </p>
              <p className="mt-1 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                {activeChapter.kicker}
              </p>
            </div>
            <span className="font-serif text-xs font-bold tracking-[0.14em] text-gold-text">
              0{active + 1}
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-sm border border-line bg-bg-soft/70 p-3">
            <SpaceTree showGround={false} />
          </div>

          <div className="timeline-rail mt-6">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                className="timeline-button"
                data-active={index === active ? "true" : "false"}
                aria-current={index === active ? "step" : undefined}
                onClick={() => scrollTo(index)}
              >
                <span className="font-serif text-base font-bold">
                  {chapter.year}
                </span>
                <span className="text-[0.7rem] font-semibold">
                  {chapter.kicker}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-5 text-[0.68rem] leading-relaxed text-ink-soft">
            {dict.description}
          </p>
        </div>
      </aside>

      <div>
        <div className="sticky top-16 z-20 -mx-5 mb-7 border-b border-line bg-surface/95 px-5 py-3 backdrop-blur lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  "shrink-0 rounded-sm border px-3 py-1.5 text-[0.7rem] font-bold transition-colors",
                  index === active
                    ? "border-gold bg-gold text-navy"
                    : "border-line bg-surface text-ink-soft"
                )}
                aria-current={index === active ? "step" : undefined}
              >
                {chapter.year}
              </button>
            ))}
          </div>
        </div>

        <div>
          {chapters.map((chapter, index) => (
            <article
              key={chapter.id}
              id={chapter.id}
              data-index={index}
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
              className="history-step relative border-t border-line py-8 lg:py-10"
              data-reveal
            >
              <span
                className="pointer-events-none absolute right-0 top-6 select-none font-serif text-7xl font-bold leading-none text-line/70 rtl:left-0 rtl:right-auto"
                aria-hidden="true"
              >
                0{index + 1}
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <span className="chapter-year">{chapter.year}</span>
                <span className="rounded-sm border border-line bg-bg-soft px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-teal-deep">
                  {chapter.kicker}
                </span>
                {chapter.verified ? (
                  <span className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-kelor-deep">
                    {dict.verified}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-3 max-w-2xl font-serif text-2xl font-bold text-ink sm:text-3xl">
                {chapter.title}
              </h2>

              <div className="prose-milad mt-4 max-w-2xl text-[0.95rem]">
                {chapter.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              {chapter.facts?.length ? (
                <ul className="mt-6 grid max-w-2xl gap-x-6 gap-y-2 sm:grid-cols-2">
                  {chapter.facts.map((fact) => (
                    <li
                      key={fact}
                      className="flex items-start gap-2 border-t border-line pt-2 text-xs leading-relaxed text-ink-soft"
                    >
                      <LeafBullet />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <SourceNote
                title={dict.source}
                items={chapter.sources}
                className="mt-5 max-w-xl"
              />
            </article>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-8">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {dict.ctaEyebrow}
          </p>
          <h2 className="mt-2 max-w-xl font-serif text-2xl font-bold text-ink sm:text-3xl">
            {dict.ctaTitle}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            {dict.ctaDescription}
          </p>
          <a href="#layanan" className="btn btn-primary mt-5 no-underline">
            {dict.ctaButton}
          </a>
        </div>
      </div>
    </div>
  );
}

function LeafBullet() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-kelor-deep"
      aria-hidden="true"
    >
      <path d="M12 21c-4-4-7-8-7-12a7 7 0 0114 0c0 4-3 8-7 12z" />
      <path d="M12 21V9" />
    </svg>
  );
}
