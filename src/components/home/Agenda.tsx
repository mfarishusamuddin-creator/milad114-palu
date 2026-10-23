import { Reveal } from "@/components/animation/Reveal";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import type { Dictionary } from "@/i18n/types";

export function Agenda({ dict }: { dict: Dictionary }) {
  return (
    <CollapsibleSection
      id="agenda"
      title={dict.agenda.title}
      className="bg-bg-soft"
    >
      <Reveal className="border-t border-line" stagger={0.07}>
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
    </CollapsibleSection>
  );
}
