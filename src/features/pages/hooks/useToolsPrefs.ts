import { useSyncExternalStore } from "react";

import { getToolsPrefs, subscribeToolsPrefs, type ToolsPrefs } from "@/lib/tools-prefs";

/**
 * Baca preferensi Tools Hub (favorit + riwayat buka) secara reaktif.
 *
 * Semua komponen yang memakai hook ini akan ter-render ulang begitu favorit
 * atau riwayat berubah, tanpa perlu state lokal atau prop drilling.
 */
export function useToolsPrefs(): ToolsPrefs {
  return useSyncExternalStore(subscribeToolsPrefs, getToolsPrefs, getToolsPrefs);
}
