import type { HistoryTable } from "@/data/history";

type Props = {
  tables: HistoryTable[];
};

export function HistoryTables({ tables }: Props) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
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
          {table.note ? (
            <p className="mt-2 text-[0.68rem] leading-relaxed text-ink-soft">
              {table.note}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
