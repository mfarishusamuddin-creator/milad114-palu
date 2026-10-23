import { Reveal } from "@/components/animation/Reveal";
import { Countdown } from "@/components/home/Countdown";
import { AnchorLink } from "@/components/shared/AnchorLink";
import GradientText from "@/components/shared/GradientText";
import { ShareButton } from "@/components/shared/ShareButton";
import type { Dictionary } from "@/i18n/types";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="hero-shell">
      <div className="container-page relative z-10">
        <Reveal trigger="mount" stagger={0.1} className="py-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
            <div>
              <h1 className="display-title">
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
            </div>

            <div className="lg:pt-3">
              <p className="body-lead max-w-xl">{dict.hero.intro}</p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <AnchorLink href="#sejarah" className="btn btn-primary">
                  {dict.hero.ctaPrimary}
                  <ArrowIcon />
                </AnchorLink>
                <AnchorLink
                  href="#layanan"
                  className="group inline-flex min-h-11 items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-navy no-underline"
                >
                  {dict.hero.ctaSecondary}
                  <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <ArrowIcon />
                  </span>
                </AnchorLink>
                <ShareButton text={dict.hero.shareText} label={dict.hero.share} />
              </div>
            </div>
          </div>
        </Reveal>

        <div id="countdown" className="scroll-mt-24">
          <Reveal trigger="mount" stagger={0} className="border-t border-line pt-5 pb-6">
            <Countdown dict={dict} />
          </Reveal>
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
      className="rtl:rotate-180"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
