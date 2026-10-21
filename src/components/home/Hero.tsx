import { Reveal } from "@/components/animation/Reveal";
import { Countdown } from "@/components/home/Countdown";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ShareButton } from "@/components/shared/ShareButton";
import { BrandLogo } from "@/components/theme/BrandLogo";
import type { Dictionary } from "@/i18n/types";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="hero-shell">
      <div className="container-page relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink-soft">
          <span className="text-ocean">{dict.hero.edition}</span>
          <span className="hidden sm:inline">{dict.hero.eventLine}</span>
          <span>{dict.hero.dateLine}</span>
        </div>

        <Reveal
          trigger="mount"
          stagger={0.1}
          className="grid gap-12 py-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16 lg:py-16"
        >
          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {dict.hero.eyebrow}
            </p>

            <h1 className="display-title mt-5">
              {dict.hero.titleLine1}{" "}
              <span className="block text-gold-text">{dict.hero.titleLine2}</span>
            </h1>

            <p className="mt-4 font-serif text-xl font-semibold text-ocean sm:text-2xl">
              {dict.hero.subtitle}
            </p>

            <p className="body-lead mt-5 max-w-xl">{dict.hero.intro}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#sejarah" className="btn btn-primary">
                {dict.hero.ctaPrimary}
                <ArrowIcon />
              </a>
              <a
                href="#layanan"
                className="group inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-navy no-underline"
              >
                {dict.hero.ctaSecondary}
                <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <ArrowIcon />
                </span>
              </a>
              <ShareButton text={dict.hero.shareText} label={dict.hero.share} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink-soft">
                {dict.hero.languageLine}
              </span>
              <LanguageSwitcher lang={dict.lang} large />
            </div>
          </div>

          <div className="relative">
            <div className="hero-plate">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-ink-soft">
                <span>{dict.hero.plate.identity}</span>
                <span className="text-ocean">{dict.hero.plate.city}</span>
              </div>

              <div className="hero-logo-area relative">
                <BrandLogo
                  variant="horizontal"
                  alt={dict.hero.plate.logoAlt}
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
                    {dict.hero.plate.stampTop}
                  </span>
                  <span className="text-[0.5rem] font-bold uppercase tracking-[0.14em]">
                    {dict.hero.plate.stampBottom}
                  </span>
                </div>
              </div>

              <div
                className="pattern-strip h-20 w-full border-y border-line"
                aria-hidden="true"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
                <span>{dict.hero.plate.statLeft}</span>
                <span>{dict.hero.plate.statCenter}</span>
                <span>{dict.hero.plate.statRight}</span>
              </div>
            </div>

            <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {dict.hero.plate.caption}
            </p>
          </div>
        </Reveal>

        <Reveal trigger="mount" stagger={0} className="border-t border-line py-5">
          <Countdown dict={dict} />
        </Reveal>
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
      className="rtl:rotate-180"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
