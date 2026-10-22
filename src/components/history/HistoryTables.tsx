"use client";

import { useState } from "react";
import type { HistoryTable } from "@/data/history";
import type { Dictionary } from "@/i18n/types";

type Props = {
  tables: HistoryTable[];
  history: Dictionary["history"];
};

export function HistoryTables({ tables, history }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="tables-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="tabel-sejarah"
      >
        <ChevronIcon open={open} />
        {open ? history.tablesHide : history.tablesShow}
      </button>

      {open ? (
        <div
          id="tabel-sejarah"
          className="mt-8 grid gap-10 lg:grid-cols-2"
        >
          {tables.map((table) => (
            <div key={table.title}>
              <h3 className="font-serif text-xl font-bold text-ink">
                {table.title}
              </h3>
              <div className="mt-4 overflow-x-auto rounded-sm border border-line">
                <table className="w-full min-w-[34rem] border-collapse text-start text-sm">
                  <thead>
                    <tr>
                      {table.columns.map((column) => (
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
                    {table.rows.map((row) => (
                      <tr
                        key={row[0]}
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
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={open ? "rotate-180" : undefined}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
