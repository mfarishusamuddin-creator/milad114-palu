import { Reveal } from "@/components/animation/Reveal";
import { HistoryExperience } from "@/components/history/HistoryExperience";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Dictionary } from "@/i18n/types";

export function HistorySection({ dict }: { dict: Dictionary }) {
  return (
    <section className="section scroll-mt-20" id="sejarah">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={dict.history.eyebrow}
            title={dict.history.title}
            description={dict.history.description}
          />
        </Reveal>
        <div className="mt-10">
          <HistoryExperience
            chapters={dict.history.chapters}
            dict={dict.history}
          />
        </div>
      </div>
    </section>
  );
}
