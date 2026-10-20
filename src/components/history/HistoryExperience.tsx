"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SourceNote } from "@/components/shared/SourceNote";
import { milestones, type Branch } from "@/data/milestones";
import { cn } from "@/lib/cn";

export function HistoryExperience() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const nodes = chapterRefs.current.filter(
      (node): node is HTMLElement => node !== null
    );
    if (nodes.length === 0) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-index"));
          if (Number.isFinite(index)) setActive(index);
        }
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: 0 }
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
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

  const activeChapter = milestones[active];

  return (
    <section className="section">
      <div className="container-page">
        <div className="lg:grid lg:grid-cols-[290px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                Peta perjalanan
              </p>
              <p className="mt-4 font-serif text-4xl font-bold text-navy">
                {activeChapter.year}
              </p>
              <p className="mt-1 text-sm font-semibold text-teal-deep">
                {activeChapter.kicker}
              </p>

              <TreeMark activeBranch={activeChapter.branch} />

              <div className="timeline-rail mt-6">
                {milestones.map((chapter, index) => (
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
                Klik tahun untuk melompat ke bab. Setiap bab punya tautan
                sumber resmi.
              </p>
            </div>
          </aside>

          <div>
            <div className="sticky top-16 z-20 -mx-5 mb-7 border-b border-line bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {milestones.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => scrollTo(index)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-[0.7rem] font-bold transition-colors",
                      index === active
                        ? "border-gold bg-gold text-navy"
                        : "border-line bg-white text-ink-soft"
                    )}
                    aria-current={index === active ? "step" : undefined}
                  >
                    {chapter.year}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {milestones.map((chapter, index) => (
                <article
                  key={chapter.id}
                  id={chapter.id}
                  data-index={index}
                  data-active={index === active ? "true" : "false"}
                  ref={(node) => {
                    chapterRefs.current[index] = node;
                  }}
                  className="chapter-card"
                >
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 w-1 rounded-l-[1.35rem]",
                      chapter.branch === "akar" && "bg-teal",
                      chapter.branch === "batang" && "bg-navy",
                      chapter.branch === "kanopi" && "bg-gold"
                    )}
                    aria-hidden="true"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="chapter-year">{chapter.year}</span>
                    <span className="rounded-full bg-bg-soft px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-teal-deep">
                      {chapter.kicker}
                    </span>
                    {chapter.verified ? (
                      <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-kelor-deep">
                        Terverifikasi
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
                    {chapter.title}
                  </h2>

                  <div className="prose-milad mt-4 text-[0.95rem]">
                    {chapter.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>

                  {chapter.facts?.length ? (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {chapter.facts.map((fact) => (
                        <li
                          key={fact}
                          className="flex items-start gap-2 rounded-xl border border-line bg-bg-soft/60 px-3 py-2.5 text-xs leading-relaxed text-ink-soft"
                        >
                          <LeafBullet />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <SourceNote items={chapter.sources} className="mt-5" />
                </article>
              ))}
            </div>

            <div className="mt-7 overflow-hidden rounded-[1.35rem] bg-navy p-6 text-white sm:p-8">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-gold-light">
                Lanjut dari akar
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                Pohon ini punya batang yang menopang layanan.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
                Buka kalender KHGT, kabar resmi Muhammadiyah, dan kuis Milad
                114 di halaman Layanan.
              </p>
              <Link href="/layanan" className="btn btn-gold mt-5 no-underline">
                Buka Layanan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TreeMark({ activeBranch }: { activeBranch: Branch }) {
  const branchOpacity = (branch: Branch) =>
    branch === activeBranch ? 1 : 0.28;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-bg-soft/70 p-3">
      <svg
        viewBox="0 0 320 430"
        className="h-auto w-full"
        role="img"
        aria-label={`Pohon perjalanan; cabang aktif: ${activeBranch}`}
      >
        <defs>
          <linearGradient id="historyTrunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6DBD25" />
            <stop offset="60%" stopColor="#0B8170" />
            <stop offset="100%" stopColor="#1C469E" />
          </linearGradient>
          <linearGradient id="historyLeaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9BDB58" />
            <stop offset="100%" stopColor="#0B8170" />
          </linearGradient>
        </defs>

        <g
          fill="none"
          stroke="url(#historyTrunk)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M160 390 C154 340 166 305 160 265"
            strokeWidth="12"
            opacity={branchOpacity("batang")}
            style={{ transition: "opacity 300ms ease" }}
          />
          <path
            d="M160 300 C125 280 105 255 92 220"
            strokeWidth="8"
            opacity={branchOpacity("akar")}
            style={{ transition: "opacity 300ms ease" }}
          />
          <path
            d="M160 300 C195 280 215 255 228 220"
            strokeWidth="8"
            opacity={branchOpacity("kanopi")}
            style={{ transition: "opacity 300ms ease" }}
          />
          <path
            d="M160 265 C160 220 160 185 160 150"
            strokeWidth="7"
            opacity={branchOpacity("kanopi")}
            style={{ transition: "opacity 300ms ease" }}
          />
          <path
            d="M160 390 C125 375 100 368 76 368"
            strokeWidth="6"
            opacity={branchOpacity("akar")}
            style={{ transition: "opacity 300ms ease" }}
          />
          <path
            d="M160 390 C195 375 220 368 244 368"
            strokeWidth="6"
            opacity={branchOpacity("akar")}
            style={{ transition: "opacity 300ms ease" }}
          />
        </g>

        <g
          fill="url(#historyLeaf)"
          opacity={branchOpacity("kanopi")}
          style={{ transition: "opacity 300ms ease" }}
        >
          <ellipse cx="160" cy="120" rx="22" ry="34" />
          <ellipse cx="130" cy="145" rx="24" ry="36" transform="rotate(-30 130 145)" />
          <ellipse cx="190" cy="145" rx="24" ry="36" transform="rotate(30 190 145)" />
          <ellipse cx="100" cy="185" rx="22" ry="33" transform="rotate(-42 100 185)" />
          <ellipse cx="220" cy="185" rx="22" ry="33" transform="rotate(42 220 185)" />
          <ellipse cx="160" cy="180" rx="19" ry="30" />
        </g>

        <g
          fill="#EAB749"
          opacity={branchOpacity("batang")}
          style={{ transition: "opacity 300ms ease" }}
        >
          <circle cx="160" cy="300" r="4" />
          <circle cx="160" cy="265" r="3.5" />
        </g>

        <g
          fill="#0B8170"
          opacity={branchOpacity("akar")}
          style={{ transition: "opacity 300ms ease" }}
        >
          <circle cx="92" cy="220" r="3.5" />
          <circle cx="76" cy="368" r="3" />
          <circle cx="244" cy="368" r="3" />
        </g>
      </svg>
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
