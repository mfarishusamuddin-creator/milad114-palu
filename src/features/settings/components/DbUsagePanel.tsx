import { useQuery } from "@tanstack/react-query";

import { fetchTableUsage } from "@/features/pages/api/pages.api";
import { formatBytes } from "../lib/format";

/** Ringkasan ukuran & perkiraan baris tiap tabel DB (via RPC security definer). */
export function DbUsagePanel() {
  const usageQuery = useQuery({ queryKey: ["table-usage"], queryFn: fetchTableUsage });

  if (usageQuery.isLoading) {
    return <p className="text-xs text-muted-foreground">Memuat…</p>;
  }
  if (usageQuery.isError) {
    return (
      <p className="text-xs text-destructive">
        Gagal memuat ukuran tabel. Pastikan fungsi RPC <code>get_table_usage</code> sudah dijalankan.
      </p>
    );
  }

  const rows = usageQuery.data ?? [];
  const totalBytes = rows.reduce((a, r) => a + (r.total_bytes || 0), 0);

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Perkiraan (dari statistik Postgres, bukan hitungan presisi). Total:{" "}
        <span className="text-foreground">{formatBytes(totalBytes)}</span>.
      </p>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.table_name}
            className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-2.5"
          >
            <span className="font-mono text-sm text-foreground">{r.table_name}</span>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-muted-foreground">~{r.approx_rows} baris</span>
              <span className="font-mono text-sm text-foreground">{formatBytes(r.total_bytes)}</span>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-xs text-muted-foreground">Tidak ada data tabel.</p>}
      </div>
    </div>
  );
}
