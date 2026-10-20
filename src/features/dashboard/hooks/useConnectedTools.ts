import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { listConnectedTools, type ConnectedToolInfo } from "../api/dashboardRepository";

/**
 * Daftar tool terhubung + status adapter (D10) — bahan System Health.
 *
 * Tanpa realtime subscribe: daftar tool hanya berubah saat ada page/adapter
 * baru (deploy), bukan saat data berubah — staleTime 60s cukup dan menghemat
 * query saat widget dirender ulang.
 */
export function useConnectedTools(): UseQueryResult<ConnectedToolInfo[]> {
  // Dibungkus agar QueryFunctionContext tidak masuk sebagai argumen `adapters`.
  return useQuery({
    queryKey: ["connected-tools"],
    queryFn: () => listConnectedTools(),
    staleTime: 60_000,
  });
}
