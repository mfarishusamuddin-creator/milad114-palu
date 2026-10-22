import { Reveal } from "@/components/animation/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Dictionary } from "@/i18n/types";

export function Agenda({ dict }: { dict: Dictionary }) {
  return (
    <section className="section scroll-mt-20 bg-bg-soft" id="agenda">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={dict.agenda.eyebrow} title={dict.agenda.title} />
        </Reveal>

        <Reveal className="mt-10 border-t border-line" stagger={0.07}>
          {dict.agenda.items.map((item) => (
            <article
              key={item.title}
              className="grid gap-2 border-b border-line py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <p className="font-serif text-lg font-bold text-navy">
                {item.date}
              </p>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </div>
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ocean">
                {item.tag}
              </span>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
