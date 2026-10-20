"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SpaceTree } from "@/components/shared/SpaceTree";
import { cn } from "@/lib/cn";

const LEGEND = [
  {
    number: "01",
    label: "Akar",
    title: "Jejak 114 Tahun",
    href: "/sejarah",
  },
  {
    number: "02",
    label: "Batang",
    title: "Layanan Muhammadiyah",
    href: "/layanan",
  },
  {
    number: "03",
    label: "Kanopi",
    title: "Milad 114",
    href: "/",
  },
];

export function GrowingTree() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const timer = globalThis.setTimeout(() => setGrown(true), 0);
      return () => globalThis.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    const fallback = globalThis.setTimeout(() => setGrown(true), 5000);
    observer.observe(node);
    return () => {
      observer.disconnect();
      globalThis.clearTimeout(fallback);
    };
  }, []);

  return (
    <section className="section scroll-mt-20 bg-navy text-white" id="pohon">
      <div className="pattern-strip h-2.5 w-full opacity-90" aria-hidden="true" />
      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow eyebrow--light">
              <span className="eyebrow-dot" aria-hidden="true" />
              Satu pohon
            </p>
            <h2 className="section-title mt-3 text-white">
              Tumbuh dari
              <span className="block text-gold-light">akar yang sama.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Akar menyimpan sejarah. Batang menopang layanan. Kanopi merangkul
              masa depan. Tiga cabang ini adalah tiga pintu yang bisa Anda buka.
            </p>

            <div className="mt-7 border-t border-white/10">
              {LEGEND.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4 border-b border-white/10 py-3.5 no-underline"
                >
                  <span className="font-serif text-xs font-bold tracking-[0.16em] text-gold-light">
                    {item.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/45">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block font-serif text-lg font-bold text-white transition-colors group-hover:text-gold-light">
                      {item.title}
                    </span>
                  </span>
                  <span className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-gold-light">
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>

            <p className="mt-5 text-[0.64rem] leading-relaxed text-white/35">
              Ilustrasi pohon dihasilkan dengan algoritma space colonization
              (Runions dkk., 2007), diimplementasikan ulang untuk proyek ini.
            </p>
          </div>

          <div
            ref={stageRef}
            className={cn(
              "tree-stage relative mx-auto w-full max-w-3xl",
              grown && "is-grown"
            )}
          >
            <div className="relative px-3 py-6 sm:px-6 sm:py-8">
              <SpaceTree showGround />

              <div className="pointer-events-none absolute inset-0 hidden lg:block">
                <Link
                  href="/"
                  className="tree-annotation pointer-events-auto absolute left-1/2 top-[10%] -translate-x-1/2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-light" />
                  Kanopi — Milad 114
                </Link>
                <Link
                  href="/sejarah"
                  className="tree-annotation pointer-events-auto absolute left-[4%] top-[54%]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  Akar — Sejarah
                </Link>
                <Link
                  href="/layanan"
                  className="tree-annotation pointer-events-auto absolute right-[4%] top-[54%]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-kelor" />
                  Batang — Layanan
                </Link>
              </div>

              <div className="absolute left-1/2 top-[31%] -translate-x-1/2 -translate-y-1/2">
                <div className="rounded-sm border border-gold-light/35 bg-navy-deep/85 px-4 py-2.5 text-center shadow-lg backdrop-blur">
                  <span className="font-serif text-3xl font-bold text-gold-light sm:text-4xl">
                    114
                  </span>
                  <span className="mt-0.5 block text-[0.52rem] font-bold uppercase tracking-[0.2em] text-white/65">
                    tahun
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 border-t border-white/10 p-4 sm:grid-cols-3 lg:hidden">
              {LEGEND.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="tree-annotation justify-center"
                >
                  {item.label} — {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pattern-strip h-2.5 w-full opacity-90" aria-hidden="true" />
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
