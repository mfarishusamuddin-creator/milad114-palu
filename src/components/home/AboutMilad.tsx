import { MaknaPoster } from "@/components/home/MaknaPoster";
import { Reveal } from "@/components/animation/Reveal";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import type { Dictionary } from "@/i18n/types";

export function AboutMilad({ dict }: { dict: Dictionary }) {
  return (
    <CollapsibleSection
      id="tentang"
      title={dict.about.title}
      description={dict.about.description}
    >
      <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14" stagger={0.1}>
        <MaknaPoster alt={dict.about.posterAlt} />

        <div>
          <div className="prose-milad max-w-2xl text-[0.95rem]">
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
                <dt className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ocean">
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
    </CollapsibleSection>
  );
}
