import { Reveal } from "@/components/animation/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceNote } from "@/components/shared/SourceNote";
import { SITE } from "@/data/site";
import type { Dictionary } from "@/i18n/types";

export function Agenda({ dict }: { dict: Dictionary }) {
  return (
    <section className="section scroll-mt-20 bg-bg-soft" id="agenda">
      <div className="container-page">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow={dict.agenda.eyebrow}
            title={dict.agenda.title}
          />
          <p className="max-w-md text-sm leading-relaxed text-ink-soft lg:pb-1">
            {dict.agenda.description}
          </p>
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
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
                {item.tag}
              </span>
            </article>
          ))}
        </Reveal>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SourceNote
            title={dict.common.source}
            items={[
              { label: "Edaran 19/2026", url: SITE.links.edaran },
              { label: "Program 25 Tahun", url: SITE.links.program25 },
              { label: "Persiapan Muktamar 2027", url: SITE.links.muktamar2027 },
            ]}
          />
          <a
            href={SITE.links.edaran}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm shrink-0 no-underline"
          >
            {dict.agenda.button}
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="rtl:rotate-180"
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}
