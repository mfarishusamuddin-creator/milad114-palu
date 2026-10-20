import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/home/Countdown";
import { JourneyProgress } from "@/components/shared/JourneyProgress";
import { ShareButton } from "@/components/shared/ShareButton";

export function Hero() {
  return (
    <section className="hero-shell">
      <div className="container-page relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink-soft">
          <span className="text-teal-deep">Edisi 114 · Palu 2026</span>
          <span className="hidden sm:inline">
            Tanwir &amp; Milad ke-114 Muhammadiyah
          </span>
          <span>13–15 Nov 2026 · 4–6 Jumadilakhir 1448 H</span>
        </div>

        <div className="grid gap-12 py-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16 lg:py-16">
          <div className="animate-fade-up">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Tanwir &amp; Milad ke-114 Muhammadiyah
            </p>

            <h1 className="display-title mt-5">
              Bersama
              <span className="block text-gold-text">Satukan Bangsa</span>
            </h1>

            <p className="mt-4 font-serif text-xl font-semibold text-teal-deep sm:text-2xl">
              Tanwir dan Milad ke-114 Muhammadiyah
            </p>

            <p className="body-lead mt-5 max-w-xl">
              114 tahun Muhammadiyah tumbuh dari Kauman, menjadi pohon rimbun
              yang menaungi bangsa. Gulir untuk melihat jejaknya, lalu buka tiga
              pintu: Milad, Sejarah, dan Layanan.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/sejarah" className="btn btn-primary">
                Jelajahi Jejak 114 Tahun
                <ArrowIcon />
              </Link>
              <Link
                href="/layanan"
                className="group inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-navy no-underline"
              >
                Buka Layanan
                <span className="transition-transform group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
              <ShareButton
                text="Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa. Palu, 13–15 November 2026."
                label="Bagikan"
              />
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="hero-plate">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-ink-soft">
                <span>Identitas resmi</span>
                <span className="text-teal-deep">Palu 2026</span>
              </div>

              <div className="relative bg-white px-4 py-5 sm:px-6 sm:py-6">
                <Image
                  src="/logo/horizontal-color.png"
                  alt="Logo Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa, Palu 13–15 November 2026"
                  width={1600}
                  height={900}
                  preload
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="h-auto w-full"
                />
                <div
                  className="pointer-events-none absolute -right-2 -top-2 flex h-16 w-16 flex-col items-center justify-center rounded-sm bg-gold text-navy shadow-lg sm:-right-3 sm:-top-3 sm:h-20 sm:w-20"
                  aria-hidden="true"
                >
                  <span className="font-serif text-2xl font-bold leading-none sm:text-3xl">
                    114
                  </span>
                  <span className="text-[0.5rem] font-bold uppercase tracking-[0.14em]">
                    tahun
                  </span>
                </div>
              </div>

              <div
                className="pattern-strip h-20 w-full border-y border-line"
                aria-hidden="true"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
                <span>Akar 1912</span>
                <span>Kanopi 2026</span>
                <span>114 tahun</span>
              </div>
            </div>

            <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Logo resmi · Tanwir &amp; Milad ke-114
            </p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-line py-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <Countdown />
          <JourneyProgress />
        </div>
      </div>
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
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
