import { useQuery } from "@tanstack/react-query";

import { useConnectedTools } from "@/features/dashboard/hooks/useConnectedTools";
import { useDashboardSnapshot } from "@/features/dashboard/hooks/useDashboardSnapshot";
import { fetchStorageUsage, fetchTableUsage } from "@/features/pages/api/pages.api";
import { formatBytes } from "@/features/settings/lib/format";
import { cn } from "@/lib/utils";

// ============================================================================
// SystemHealthWidget — menggantikan "Ringkasan Sistem": bukan hanya angka
// infrastruktur, tapi kesehatan pipeline data tool→dashboard (D10).
//
// HANYA mengonsumsi hook kanonik (useConnectedTools + useDashboardSnapshot);
// baris infra kecil memakai queryKey RPC yang sama persis dengan panel
// Settings (["table-usage"]/["storage-usage"]) sehingga berbagi cache —
// tidak ada permintaan tambahan. "Jumlah tabel" sengaja dihapus: bukan
// insight kesehatan utama.
// ============================================================================

/** Potong pesan error adapter agar baris peringatan tetap terbaca singkat. */
function shortError(message: string | undefined): string {
  if (message === undefined) return "error tidak diketahui";
  return message.length > 90 ? `${message.slice(0, 87)}…` : message;
}

/** Badge status kecil — gaya badge dashboard (mono, uppercase, token warna). */
function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={cn(
        "rounded border border-border px-1 py-px font-mono text-[9px] uppercase tracking-[0.1em]",
        tone,
      )}
    >
      {label}
    </span>
  );
}

export function SystemHealthWidget() {
  const toolsQuery = useConnectedTools();
  const snapshot = useDashboardSnapshot();
  const tablesQuery = useQuery({ queryKey: ["table-usage"], queryFn: fetchTableUsage });
  const storageQuery = useQuery({ queryKey: ["storage-usage"], queryFn: fetchStorageUsage });

  const tools = toolsQuery.data ?? [];
  const diagnostics = snapshot.data?.diagnostics ?? [];

  // (a) Status adapter per tool — pemetaan: slug adapter = slug tool (registry).
  const diagnosticByAdapter = new Map(diagnostics.map((d) => [d.adapter, d]));

  // (b) Peringatan dari tiga sinyal: adapter gagal, data yatim, tool tanpa data.
  const warnings: { key: string; slug: string; message: string }[] = [];
  for (const diag of diagnostics) {
    if (!diag.success) {
      warnings.push({
        key: `adapter:${diag.adapter}`,
        slug: diag.adapter,
        message: `adapter gagal — ${shortError(diag.error)}`,
      });
    }
  }
  for (const tool of tools) {
    if (tool.inRecords && !tool.inPages) {
      // Punya record aktif tapi slug tidak terdaftar sebagai page admin —
      // data menulis ke dashboard tanpa "rumah" di Kelola Tools.
      warnings.push({
        key: `yatim:${tool.slug}`,
        slug: tool.slug,
        message: "data yatim (tool tidak terdaftar)",
      });
    }
    if (tool.inPages && tool.recordCount === 0) {
      warnings.push({ key: `kosong:${tool.slug}`, slug: tool.slug, message: "tanpa data" });
    }
  }

  const successCount = diagnostics.filter((d) => d.success).length;
  const dbBytes = (tablesQuery.data ?? []).reduce((a, r) => a + (r.total_bytes || 0), 0);
  const storageBytes = (storageQuery.data ?? []).reduce((a, r) => a + (r.total_bytes || 0), 0);
  const loading = toolsQuery.isLoading || snapshot.isLoading;

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Kesehatan Sistem
      </p>

      {/* (a) Tool Terhubung: slug + jumlah record + badge status adapter. */}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Tool Terhubung
      </p>
      {toolsQuery.isLoading && <p className="mt-2 text-xs text-muted-foreground">Memuat…</p>}
      {toolsQuery.isError && (
        <p className="mt-2 text-xs text-destructive">Gagal memuat daftar tool.</p>
      )}
      {toolsQuery.data && tools.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">Belum ada tool yang terhubung.</p>
      )}
      {tools.length > 0 && (
        // max-h + scroll: daftar tool bisa panjang (tool baru terdeteksi otomatis).
        <ul className="mt-2 flex max-h-56 flex-col gap-1 overflow-y-auto">
          {tools.map((tool) => {
            const diag = diagnosticByAdapter.get(tool.slug);
            return (
              <li key={tool.slug} className="flex items-center justify-between gap-2 px-1 py-0.5">
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground" title={tool.slug}>
                  {tool.slug}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {tool.recordCount} rec
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  {tool.hasAdapter ? (
                    <>
                      <Badge label="adapter" tone="text-muted-foreground" />
                      {/* Indikator hasil run terakhir; snapshot masih dimuat → tanpa badge. */}
                      {diag !== undefined &&
                        (diag.success ? (
                          <Badge label="sukses" tone="text-kicker" />
                        ) : (
                          <Badge label="gagal" tone="text-destructive" />
                        ))}
                    </>
                  ) : (
                    <Badge label="tool baru · belum ada adapter" tone="text-kicker" />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* (b) Peringatan — kosong berarti semua sehat. */}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Peringatan
      </p>
      {loading ? (
        <p className="mt-2 text-xs text-muted-foreground">Memuat…</p>
      ) : warnings.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">Semua sehat.</p>
      ) : (
        <ul className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto">
          {warnings.map((w) => (
            <li key={w.key} className="px-1 text-xs">
              <span className="font-mono text-foreground">{w.slug}</span>{" "}
              <span className="text-destructive">{w.message}</span>
            </li>
          ))}
        </ul>
      )}

      {/* (c) Sinkronisasi — kapan snapshot terakhir dihitung + rasio sumber sukses. */}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Sinkronisasi
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {snapshot.data ? (
          <>
            terakhir disinkronkan{" "}
            <span className="font-mono text-foreground">
              {new Date(snapshot.data.generatedAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>{" "}
            · {successCount}/{diagnostics.length} sumber sukses
          </>
        ) : snapshot.isLoading ? (
          "Memuat…"
        ) : (
          "Data sinkronisasi tidak tersedia."
        )}
      </p>

      {/* (d) Infra kecil — queryKey sama dengan panel Settings (berbagi cache). */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
        <span>
          Ukuran DB{" "}
          <span className="font-mono text-foreground">
            {tablesQuery.isLoading ? "…" : formatBytes(dbBytes)}
          </span>
        </span>
        <span>
          Storage{" "}
          <span className="font-mono text-foreground">
            {storageQuery.isLoading ? "…" : formatBytes(storageBytes)}
          </span>
        </span>
      </div>
    </div>
  );
}
