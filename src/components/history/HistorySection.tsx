import { Reveal } from "@/components/animation/Reveal";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import { HistoryTables } from "@/components/history/HistoryTables";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import type { Dictionary } from "@/i18n/types";

export function HistorySection({ dict }: { dict: Dictionary }) {
  const history = dict.history;

  return (
    <CollapsibleSection
      id="sejarah"
      title={history.title}
      description={history.description}
    >
      <HistoryTimeline content={history.content} />

      <Reveal className="mt-12">
        <HistoryTables tables={history.content.tables} labels={history.tables} />
      </Reveal>
    </CollapsibleSection>
  );
}
