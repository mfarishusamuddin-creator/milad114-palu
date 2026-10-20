import { useEffect } from "react";
import { useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { subscribeRecords } from "@/features/core/recordsApi";
import { ADAPTERS } from "../adapters/registry";
import { loadDashboardSnapshot, type DashboardSnapshot } from "../api/dashboardRepository";

/**
 * Snapshot dashboard: useQuery + realtime invalidate.
 *
 * Realtime (D11): setiap pasangan (adapter × collection) dilanggani via
 * subscribeRecords; perubahan apa pun memicu invalidate TER-DEBOUNCE ~500ms
 * (burst perubahan — mis. sync awal tool — dipadukan jadi satu recompute),
 * lalu react-query memanggil ulang loadDashboardSnapshot.
 *
 * KENAPA RECOMPUTE PENUH (v1): adapter pure dan volume data per tool masih
 * ratusan record — recompute penuh di bawah ambang yang terasa, dan mustahil
 * menghasilkan state basi/parsial (satu-satunya kebenaran adalah snapshot
 * hasil hitung ulang). Boundary optimasi: bila satu load melebihi ~1 detik
 * atau total item menembus ~10k, ganti invalidate dengan setQueryData
 * per-adapter (patch hanya bagian dari adapter sumber event) — struktur
 * snapshot + diagnostics per-adapter sudah disiapkan untuk itu.
 */
export function useDashboardSnapshot(): UseQueryResult<DashboardSnapshot> {
  const queryClient = useQueryClient();

  // QueryFn dibungkus agar QueryFunctionContext tidak masuk sebagai argumen
  // `adapters` (default parameter loadDashboardSnapshot = ADAPTERS).
  const query = useQuery({
    queryKey: ["dashboard-snapshot"],
    queryFn: () => loadDashboardSnapshot(),
  });

  // Pola realtime mengikuti AdminToolViewPage (subscribe → invalidate →
  // cleanup). ADAPTERS konstanta modul: tidak perlu jadi dependency effect.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleInvalidate = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot"] });
      }, 500);
    };

    // Satu langganan per (adapter, collection): subscribeRecords memfilter
    // per tool_slug + collection, jadi perubahan tool lain tidak memicu
    // recompute dashboard.
    const unsubscribes = ADAPTERS.flatMap((adapter) =>
      adapter.collections.map((collection) =>
        subscribeRecords(adapter.slug, collection, scheduleInvalidate),
      ),
    );

    return () => {
      if (timer !== undefined) clearTimeout(timer);
      for (const unsubscribe of unsubscribes) unsubscribe();
    };
  }, [queryClient]);

  return query;
}
