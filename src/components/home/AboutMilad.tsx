import { Reveal } from "@/components/animation/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceNote } from "@/components/shared/SourceNote";
import { BrandLogo } from "@/components/theme/BrandLogo";
import { SITE } from "@/data/site";
import type { Dictionary } from "@/i18n/types";

export function AboutMilad({ dict }: { dict: Dictionary }) {
  return (
    <section className="section scroll-mt-20" id="tentang">
      <div className="container-page">
        <Reveal
          className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16"
          stagger={0.12}
        >
          <div className="relative border-l border-gold pl-6 sm:pl-8">
            <div className="flex items-center justify-between gap-4">
              <BrandLogo
                variant="logogram"
                alt=""
                width={512}
                height={512}
                className="h-12 w-12 object-contain"
              />
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-teal-deep">
                {dict.about.eyebrow}
              </span>
            </div>

            <p
              className="outline-number mt-8 font-serif text-[8rem] font-bold leading-none sm:text-[10rem]"
              aria-hidden="true"
            >
              114
            </p>
            <p className="mt-2 max-w-xs font-serif text-xl font-semibold leading-snug text-ink">
              {dict.about.title}
            </p>

            <div className="mt-8 border-t border-line pt-4">
              <p className="text-xs leading-relaxed text-ink-soft">
                {dict.about.quote}
              </p>
              <a
                href={SITE.links.maknaLogo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold-text no-underline"
              >
                {dict.about.link}
                <ArrowIcon />
              </a>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow={dict.about.eyebrow}
              title={dict.about.title}
              description={dict.about.description}
            />

            <div className="prose-milad mt-6 max-w-2xl text-[0.95rem]">
              {dict.about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-7 border-y border-line">
              {dict.about.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:items-baseline"
                >
                  <dt className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                    {fact.label}
                  </dt>
                  <dd className="font-serif text-base font-bold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <SourceNote
              className="mt-6"
              title={dict.common.source}
              items={[
                { label: "Makna di Balik Logo", url: SITE.links.maknaLogo },
                { label: "114 Pohon Kelor di Palu", url: SITE.links.tanamKelor },
                { label: "Edaran 19/2026", url: SITE.links.edaran },
              ]}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
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
