"use client";

import { useState } from "react";
import type { HistoryTable } from "@/data/history";

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

  const toggle = (key: Exclude<TabKey, null>): void => {
    setActive((value) => (value === key ? null : key));
  };

  const visible =
    active === "leadership" ? tables[0] : active === "aum" ? tables[1] : null;

  return (
    <div>
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
        <div id="tabel-sejarah" className="mt-6">
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
                      className="border-b border-line bg-bg-soft px-4 py-2.5 text-start text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ink-soft"
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
