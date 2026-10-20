import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/home/Countdown";
import { JourneyProgress } from "@/components/shared/JourneyProgress";
import { ShareButton } from "@/components/shared/ShareButton";
import { SITE } from "@/data/site";

export function Hero() {
  return (
    <section className="hero-shell">
      <div
        className="hero-orb -right-24 top-10 h-72 w-72 bg-teal/15"
        aria-hidden="true"
      />
      <div
        className="hero-orb -left-24 bottom-0 h-64 w-64 bg-gold/10"
        aria-hidden="true"
      />

      <div className="container-page relative z-10 grid gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="animate-fade-up">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Tanwir &amp; Milad ke-114 Muhammadiyah
          </p>

          <h1 className="display-title mt-5">
            Bersama
            <span className="block text-gradient-gold">Satukan Bangsa</span>
          </h1>

          <p className="mt-4 font-serif text-xl font-semibold text-teal-deep sm:text-2xl">
            Tanwir dan Milad ke-114 Muhammadiyah
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <MetaChip>{SITE.city}, {SITE.province}</MetaChip>
            <MetaChip>13–15 November 2026</MetaChip>
            <MetaChip>4–6 Jumadilakhir 1448 H</MetaChip>
          </div>

          <p className="body-lead mt-6 max-w-xl">
            114 tahun Muhammadiyah tumbuh dari Kauman, menjadi pohon rimbun
            yang menaungi bangsa. Gulir untuk melihat jejaknya, lalu buka tiga
            pintu: Milad, Sejarah, dan Layanan.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/sejarah" className="btn btn-primary">
              Jelajahi Jejak 114 Tahun
              <ArrowIcon />
            </Link>
            <Link href="/layanan" className="btn btn-gold">
              Buka Layanan
            </Link>
            <ShareButton
              text="Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa. Palu, 13–15 November 2026."
              label="Bagikan"
            />
          </div>

          <div className="mt-7 max-w-xl">
            <Countdown />
          </div>

          <div className="mt-4 max-w-xl">
            <JourneyProgress />
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="hero-card">
            <div className="flex items-center justify-between gap-3 border-b border-line/80 px-5 py-3.5">
              <span className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                Identitas resmi
              </span>
              <span className="rounded-full bg-navy px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white">
                Palu 2026
              </span>
            </div>

            <div className="relative bg-white px-4 py-5 sm:px-6 sm:py-7">
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
                className="pointer-events-none absolute -right-2 -top-2 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gold text-navy shadow-lg sm:-right-4 sm:-top-4 sm:h-24 sm:w-24"
                aria-hidden="true"
              >
                <span className="font-serif text-3xl font-bold leading-none sm:text-4xl">
                  114
                </span>
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.14em]">
                  tahun
                </span>
              </div>
            </div>

            <div className="pattern-strip h-2.5 w-full" aria-hidden="true" />

            <div className="grid grid-cols-3 divide-x divide-line border-t border-line bg-white">
              <Stat value="1912" label="Akar" />
              <Stat value="2026" label="Kanopi" />
              <Stat value="114" label="Tahun" />
            </div>
          </div>

          <p className="mt-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Logo resmi · Tanwir &amp; Milad ke-114
          </p>
        </div>
      </div>
    </section>
  );
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-white/80 px-3 py-1.5 text-[0.7rem] font-semibold text-ink-soft">
      {children}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-2 py-3.5">
      <span className="font-serif text-xl font-bold text-navy">{value}</span>
      <span className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </span>
    </div>
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
