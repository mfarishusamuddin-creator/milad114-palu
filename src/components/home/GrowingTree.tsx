"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

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
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow eyebrow--light justify-center">
            <span className="eyebrow-dot" aria-hidden="true" />
            Satu pohon
          </p>
          <h2 className="section-title mt-3 text-white">
            Tumbuh dari akar yang sama
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            Akar menyimpan sejarah. Batang menopang layanan. Kanopi merangkul
            masa depan. Tiga cabang ini adalah tiga pintu yang bisa Anda buka.
          </p>
        </div>

        <div
          ref={stageRef}
          className={cn(
            "tree-stage relative mx-auto mt-10 max-w-5xl",
            grown && "is-grown"
          )}
        >
          <div className="relative px-3 py-6 sm:px-8 sm:py-10">
            <TreeSvg />

            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <Link
                href="/"
                className="tree-link pointer-events-auto absolute left-1/2 top-[9%] -translate-x-1/2"
              >
                Kanopi — Milad 114
              </Link>
              <Link
                href="/sejarah"
                className="tree-link pointer-events-auto absolute left-[9%] top-[68%]"
              >
                Akar — Sejarah
              </Link>
              <Link
                href="/layanan"
                className="tree-link pointer-events-auto absolute right-[8%] top-[68%]"
              >
                Batang — Layanan
              </Link>
            </div>

            <div className="absolute left-1/2 top-[31%] -translate-x-1/2 -translate-y-1/2">
              <div className="rounded-2xl border border-gold-light/30 bg-navy-deep/85 px-4 py-2.5 text-center shadow-lg backdrop-blur">
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
            <Link href="/" className="tree-link justify-center">
              Kanopi — Milad
            </Link>
            <Link href="/sejarah" className="tree-link justify-center">
              Akar — Sejarah
            </Link>
            <Link href="/layanan" className="tree-link justify-center">
              Batang — Layanan
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/45">
          Gulir untuk menumbuhkan pohon · tiga cabang, tiga pintu
        </p>
      </div>
      <div className="pattern-strip h-2.5 w-full opacity-90" aria-hidden="true" />
    </section>
  );
}

function TreeSvg() {
  const leaves = [
    [450, 165, 30, 46, -8],
    [405, 190, 34, 50, -28],
    [495, 190, 34, 50, 28],
    [360, 235, 36, 54, -40],
    [540, 235, 36, 54, 40],
    [315, 290, 38, 58, -48],
    [585, 290, 38, 58, 48],
    [275, 345, 34, 52, -55],
    [625, 345, 34, 52, 55],
    [380, 295, 30, 46, -18],
    [520, 295, 30, 46, 18],
    [450, 255, 28, 44, 0],
    [340, 390, 30, 46, -35],
    [560, 390, 30, 46, 35],
    [450, 350, 26, 40, 0],
  ];

  return (
    <svg
      viewBox="0 0 900 700"
      className="h-auto w-full"
      role="img"
      aria-label="Ilustrasi pohon kelor dengan tiga cabang: akar, batang, dan kanopi."
    >
      <defs>
        <linearGradient id="treeTrunk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7CCB5A" />
          <stop offset="55%" stopColor="#0B8170" />
          <stop offset="100%" stopColor="#1C469E" />
        </linearGradient>
        <linearGradient id="treeLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9BDB58" />
          <stop offset="55%" stopColor="#6DBD25" />
          <stop offset="100%" stopColor="#0B8170" />
        </linearGradient>
        <linearGradient id="treeGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAB749" />
          <stop offset="100%" stopColor="#D49B0F" />
        </linearGradient>
        <radialGradient id="treeGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#6DBD25" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#6DBD25" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="450" cy="330" r="290" fill="url(#treeGlow)" />

      <g
        fill="none"
        stroke="url(#treeTrunk)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="tree-path"
          d="M450 640 C438 570 462 510 450 440 C443 395 448 360 450 320"
          strokeWidth="18"
        />
        <path
          className="tree-path"
          d="M450 500 C392 470 345 430 300 365 C282 339 272 310 268 280"
          strokeWidth="11"
        />
        <path
          className="tree-path"
          d="M450 500 C510 470 558 430 602 365 C620 339 630 310 634 280"
          strokeWidth="11"
        />
        <path
          className="tree-path"
          d="M450 430 C450 370 450 315 450 250"
          strokeWidth="10"
        />
        <path
          className="tree-path"
          d="M450 640 C405 620 365 606 320 604"
          strokeWidth="8"
        />
        <path
          className="tree-path"
          d="M450 640 C495 620 535 606 580 604"
          strokeWidth="8"
        />
        <path
          className="tree-path"
          d="M450 640 C450 622 450 612 450 600"
          strokeWidth="8"
        />
      </g>

      <g fill="url(#treeLeaf)">
        {leaves.map(([cx, cy, rx, ry, rotate], index) => (
          <ellipse
            key={`${cx}-${cy}-${index}`}
            className="tree-leaf"
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            style={{ transitionDelay: `${0.12 + index * 0.045}s` }}
          />
        ))}
      </g>

      <g fill="url(#treeGold)" opacity="0.95">
        <circle cx="285" cy="275" r="6" />
        <circle cx="617" cy="275" r="6" />
        <circle cx="450" cy="205" r="7" />
      </g>

      <g fill="none" stroke="#EAB749" strokeWidth="2" opacity="0.4">
        <path d="M320 604 C360 598 400 600 450 610" />
        <path d="M580 604 C540 598 500 600 450 610" />
      </g>
    </svg>
  );
}
