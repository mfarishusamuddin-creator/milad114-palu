import { useQuery } from "@tanstack/react-query";

import { fetchAllSettings } from "../api/settings.api";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchAllSettings,
    staleTime: 5 * 60_000,
  });
}
