import { supabase } from "@/lib/supabase";
import type { ProfileWithRole } from "@/types/database";

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Profile row for a user, with the related role embedded (needed for the is_superadmin check). */
export async function fetchProfileWithRole(userId: string): Promise<ProfileWithRole> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, roles(is_superadmin)")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as unknown as ProfileWithRole;
}
