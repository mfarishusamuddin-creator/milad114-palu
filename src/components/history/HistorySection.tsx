import { Reveal } from "@/components/animation/Reveal";
import { HistoryTables } from "@/components/history/HistoryTables";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
          <HistoryTables tables={history.content.tables} history={history} />
        </Reveal>
      </div>
    </section>
  );
}
