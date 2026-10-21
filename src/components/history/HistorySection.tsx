import { Reveal } from "@/components/animation/Reveal";
import { HistoryTables } from "@/components/history/HistoryTables";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceNote } from "@/components/shared/SourceNote";
import type { Dictionary } from "@/i18n/types";

export function HistorySection({ dict }: { dict: Dictionary }) {
  const history = dict.history;

  return (
    <section className="section scroll-mt-20" id="sejarah">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={history.eyebrow}
            title={history.title}
            description={history.description}
          />
        </Reveal>

        <div className="mt-10">
          <HistoryTimeline content={history.content} />
        </div>

        <Reveal className="mt-14">
          <HistoryTables tables={history.content.tables} />
        </Reveal>

        <Reveal className="mt-10">
          <SourceNote title={history.source} items={history.content.sources} />
        </Reveal>

        <Reveal className="mt-12 border-t border-line pt-8">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {history.ctaEyebrow}
          </p>
          <h2 className="mt-2 max-w-xl font-serif text-2xl font-bold text-ink sm:text-3xl">
            {history.ctaTitle}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            {history.ctaDescription}
          </p>
          <a href="#layanan" className="btn btn-primary mt-5 no-underline">
            {history.ctaButton}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
