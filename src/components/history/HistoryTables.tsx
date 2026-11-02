"use client";

import { useEffect, useRef, useState } from "react";
import type { HistoryTable } from "@/data/history";
import { HISTORY_SELECT_EVENT, type HistorySelection } from "@/lib/history-nav";

type Labels = {
  leadership: string;
  aum: string;
};

type Props = {
  tables: HistoryTable[];
  labels: Labels;
};

type TabKey = "leadership" | "aum" | null;

export function HistoryTables({ tables, labels }: Props) {
  const [active, setActive] = useState<TabKey>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const scrollCleanupRef = useRef<(() => void) | null>(null);

  const toggle = (key: Exclude<TabKey, null>): void => {
    setActive((value) => (value === key ? null : key));
  };

  /**
   * Deep-link tabel (mis. hotspot AUM/leadership): pilih tab tanpa toggle,
   * lalu scroll ke #tabel-sejarah setelah panel collapsible selesai
   * terbuka. Klik manual tetap memakai `toggle` (tab aktif menutup tabel).
   */
  useEffect(() => {
    const scrollToTable = (): void => {
      const target = tableRef.current;
      if (!target) return;
      const reduce =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false;
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    };

    // Dua frame: menunggu React menempelkan tabel, lalu menggulir.
    const scheduleScroll = (): void => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToTable);
      });
    };

    const onHistorySelect = (event: Event): void => {
      const detail = (event as CustomEvent<HistorySelection>).detail;
      if (!detail?.table) return;

      setActive(detail.table);
      scrollCleanupRef.current?.();
      scrollCleanupRef.current = null;

      const section = containerRef.current?.closest(".collapsible");
      const panel =
        section?.querySelector<HTMLElement>(".collapsible__panel") ?? null;
      const reduce =
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
        false;
      const alreadyOpen =
        panel !== null && panel.getAttribute("aria-hidden") === "false";

      if (!panel || reduce || alreadyOpen) {
        scheduleScroll();
        return;
      }

      let done = false;
      let fallback = 0;
      let onTransitionEnd: (event: TransitionEvent) => void = () => {};

      const finish = (): void => {
        if (done) return;
        done = true;
        panel.removeEventListener("transitionend", onTransitionEnd);
        window.clearTimeout(fallback);
        scrollCleanupRef.current = null;
        scheduleScroll();
      };

      onTransitionEnd = (event: TransitionEvent): void => {
        if (
          event.target === panel &&
          event.propertyName === "grid-template-rows"
        ) {
          finish();
        }
      };

      panel.addEventListener("transitionend", onTransitionEnd);
      fallback = window.setTimeout(finish, 700);
      scrollCleanupRef.current = () => {
        done = true;
        panel.removeEventListener("transitionend", onTransitionEnd);
        window.clearTimeout(fallback);
      };
    };

    window.addEventListener(HISTORY_SELECT_EVENT, onHistorySelect);
    return () => {
      window.removeEventListener(HISTORY_SELECT_EVENT, onHistorySelect);
      scrollCleanupRef.current?.();
      scrollCleanupRef.current = null;
    };
  }, []);

  const visible =
    active === "leadership" ? tables[0] : active === "aum" ? tables[1] : null;

  return (
    <div ref={containerRef}>
      <div className="flex flex-wrap gap-2" role="group" aria-label={labels.leadership}>
        <button
          type="button"
          className={`tables-tab tables-tab--ocean${active === "leadership" ? " is-active" : ""}`}
          onClick={() => toggle("leadership")}
          aria-expanded={active === "leadership"}
          aria-controls="tabel-sejarah"
          aria-pressed={active === "leadership"}
        >
          {labels.leadership}
        </button>
        <button
          type="button"
          className={`tables-tab tables-tab--kelor${active === "aum" ? " is-active" : ""}`}
          onClick={() => toggle("aum")}
          aria-expanded={active === "aum"}
          aria-controls="tabel-sejarah"
          aria-pressed={active === "aum"}
        >
          {labels.aum}
        </button>
      </div>

      {visible ? (
        <div
          ref={tableRef}
          id="tabel-sejarah"
          className="mt-6 scroll-mt-24"
        >
          <h3 className="font-serif text-xl font-bold text-ink">
            {visible.title}
          </h3>
          <div className="mt-4 overflow-x-auto rounded-sm border border-line">
            <table className="w-full min-w-[34rem] border-collapse text-start text-sm">
              <thead>
                <tr>
                  {visible.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="border-b border-line bg-bg-soft px-4 py-2.5 text-start text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-soft"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.rows.map((row, rowIndex) => (
                  <tr
                    key={`${row[0]}-${rowIndex}`}
                    className="border-b border-line/70 align-top last:border-b-0"
                  >
                    <td className="px-4 py-2.5 font-serif font-bold text-ink">
                      {row[0]}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-navy">
                      {row[1]}
                    </td>
                    <td className="px-4 py-2.5 text-ink-soft">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
