import { Reveal } from "@/components/animation/Reveal";
import { Countdown } from "@/components/home/Countdown";
import GradientText from "@/components/shared/GradientText";
import { ShareButton } from "@/components/shared/ShareButton";
import type { Dictionary } from "@/i18n/types";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="hero-shell">
      <div className="container-page relative z-10">
        <Reveal trigger="mount" stagger={0.1} className="py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="display-title mt-5">
              <GradientText block start animationSpeed={12}>
                {dict.hero.titleLine1}
              </GradientText>
              <GradientText block start animationSpeed={12}>
                {dict.hero.titleLine2}
              </GradientText>
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
