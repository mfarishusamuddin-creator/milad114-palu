import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { formatBytes } from "../lib/format";

interface ProjectUsageResult {
  ok?: boolean;
  projectRef?: string;
  period?: string;
  summary?: Record<string, number>;
  errors?: Record<string, { status?: number; message?: string } | null>;
  error?: string;
  message?: string;
  status?: number;
}

const ROWS: { key: string; label: string; format: (v: number) => string }[] = [
  { key: "totalApiRequests", label: "Total API requests", format: (v) => String(Math.round(v)) },
  { key: "authRequests", label: "Auth requests", format: (v) => String(Math.round(v)) },
  { key: "restRequests", label: "REST (database) requests", format: (v) => String(Math.round(v)) },
  { key: "storageRequests", label: "Storage requests", format: (v) => String(Math.round(v)) },
  { key: "realtimeRequests", label: "Realtime requests", format: (v) => String(Math.round(v)) },
  { key: "diskUsedBytes", label: "Disk terpakai (volume DB)", format: formatBytes },
  { key: "functionCount", label: "Edge functions aktif", format: (v) => String(Math.round(v)) },
];

/** Pemakaian project Supabase — via Edge Function + Management API. */
export function ProjectUsagePanel() {
  const [result, setResult] = useState<ProjectUsageResult | null>(null);

  const fetchUsage = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("project-usage");
      if (error) throw error;
      return data as ProjectUsageResult;
    },
    onSuccess: setResult,
  });

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Data dari Supabase Management API: jumlah request per layanan & pemakaian disk. Butuh Personal
        Access Token <code className="text-foreground">sbp_…</code> di sekret Edge Function{" "}
        <code className="text-foreground">MANAGEMENT_API_TOKEN</code>.
        <br />
        <span className="text-muted-foreground/70">
          MAU & egress (bandwidth) tidak diekspos Management API — lihat di Dashboard Supabase →
          Project → Usage.
        </span>
      </p>

      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => fetchUsage.mutate()}>
        {fetchUsage.isPending ? "Memuat…" : "Ambil Data Penggunaan"}
      </Button>

      {fetchUsage.isError && (
        <p className="text-xs text-destructive">
          {fetchUsage.error instanceof Error ? fetchUsage.error.message : "Gagal mengambil data."}
        </p>
      )}

      {result?.error === "not_configured" && (
        <div className="rounded-lg border border-border bg-card/40 p-4 text-xs text-muted-foreground">
          Belum dikonfigurasi. Deploy Edge Function <code>project-usage</code>, lalu:
          <pre className="mt-2 overflow-x-auto rounded bg-background p-3 font-mono text-[11px] text-foreground">
            supabase secrets set MANAGEMENT_API_TOKEN=sbp_xxx
          </pre>
        </div>
      )}

      {result?.error && result.error !== "not_configured" && (
        <p className="text-xs text-destructive">
          Gagal: {result.error} (status {result.status ?? "?"}) — {result.message ?? "tanpa pesan"}
        </p>
      )}

      {result?.ok && (
        <>
          <div className="flex flex-col gap-2">
            {ROWS.map(({ key, label, format }) => {
              const v = result.summary?.[key] ?? 0;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-2.5"
                >
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="font-mono text-sm text-foreground">{v > 0 ? format(v) : "0"}</span>
                </div>
              );
            })}
          </div>

          {result.errors && Object.values(result.errors).some((e) => e) && (
            <div className="flex flex-col gap-1 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-300">
                Ada endpoint yang gagal (yang gagal = 0)
              </p>
              {Object.entries(result.errors).map(
                ([key, e]) =>
                  e && (
                    <p key={key} className="text-[11px] text-muted-foreground">
                      <span className="text-foreground">{key}</span>: {e.message || `status ${e.status}`}
                    </p>
                  ),
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
