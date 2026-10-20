import { supabase } from "@/lib/supabase";

/** All settings keyed by `key`, values already unwrapped from their jsonb rows. */
export async function fetchAllSettings(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.from("settings").select("key, value");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
}

export async function upsertSetting(key: string, value: unknown) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
