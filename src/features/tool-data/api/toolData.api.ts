import { supabase } from "@/lib/supabase";
import type { ToolDataMap } from "../types";

/**
 * Ambil seluruh data satu tool sebagai map key -> value (string).
 * RLS memastikan hanya Super Admin yang bisa membaca (policy tool_data_select).
 */
export async function fetchToolData(toolSlug: string): Promise<ToolDataMap> {
  const { data, error } = await supabase
    .from("tool_data")
    .select("key, value")
    .eq("tool_slug", toolSlug)
    .order("key");

  if (error) throw error;

  return Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value as string]),
  );
}

export interface ToolDataWrite {
  key: string;
  value: string;
}

/** Upsert (tulis/perbarui) satu batch entri data tool. */
export async function upsertToolData(toolSlug: string, entries: ToolDataWrite[]) {
  if (entries.length === 0) return;

  const rows = entries.map((e) => ({
    tool_slug: toolSlug,
    key: e.key,
    value: e.value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("tool_data")
    .upsert(rows, { onConflict: "tool_slug,key" });
  if (error) throw error;
}

/** Hapus sejumlah key dari data tool. */
export async function deleteToolDataKeys(toolSlug: string, keys: string[]) {
  if (keys.length === 0) return;

  const { error } = await supabase
    .from("tool_data")
    .delete()
    .eq("tool_slug", toolSlug)
    .in("key", keys);
  if (error) throw error;
}

/** Hapus seluruh data satu tool. */
export async function clearToolData(toolSlug: string) {
  const { error } = await supabase
    .from("tool_data")
    .delete()
    .eq("tool_slug", toolSlug);
  if (error) throw error;
}
