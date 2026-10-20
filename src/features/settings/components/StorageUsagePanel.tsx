import { useQuery } from "@tanstack/react-query";

import { fetchStorageUsage } from "@/features/pages/api/pages.api";
import { formatBytes } from "../lib/format";

/** Ringkasan pemakaian Supabase Storage per bucket (via RPC security definer). */
export function StorageUsagePanel() {
  const usageQuery = useQuery({ queryKey: ["storage-usage"], queryFn: fetchStorageUsage });

  if (usageQuery.isLoading) {
    return <p className="text-xs text-muted-foreground">Memuat…</p>;
  }
  if (usageQuery.isError) {
    return (
      <p className="text-xs text-destructive">
        Gagal memuat pemakaian storage. Pastikan fungsi RPC <code>get_storage_usage</code> sudah dijalankan.
      </p>
    );
  }

  const rows = usageQuery.data ?? [];
  const totalBytes = rows.reduce((a, r) => a + (r.total_bytes || 0), 0);

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Total: <span className="text-foreground">{formatBytes(totalBytes)}</span> · Alokasi tier gratis 1 GB.
      </p>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.bucket_name}
            className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-2.5"
          >
            <span className="font-mono text-sm text-foreground">{r.bucket_name}</span>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-muted-foreground">{r.file_count} file</span>
              <span className="font-mono text-sm text-foreground">{formatBytes(r.total_bytes)}</span>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Belum ada bucket/file di storage. (Portfolio disarankan memakai media eksternal agar storage tetap
            kecil.)
          </p>
        )}
      </div>
    </div>
  );
}
