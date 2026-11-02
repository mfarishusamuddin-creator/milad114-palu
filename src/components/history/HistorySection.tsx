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

      {/*
        Tabel sengaja tidak dibungkus Reveal: saat deep-link, panel dibuka
        dari event dan tabel harus langsung terlihat, bukan menunggu
        intersection observer.
      */}
      <div className="mt-12">
        <HistoryTables tables={history.content.tables} labels={history.tables} />
      </div>
    </CollapsibleSection>
  );
}
