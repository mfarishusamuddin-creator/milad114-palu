import { Reveal } from "@/components/animation/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BrandLogo } from "@/components/theme/BrandLogo";
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
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ocean">
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
                  <dt className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ocean">
                    {fact.label}
                  </dt>
                  <dd className="font-serif text-base font-bold text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
