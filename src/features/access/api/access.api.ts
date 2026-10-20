import { supabase } from "@/lib/supabase";

export interface AssignableRole {
  id: string;
  name: string;
}

/** Roles selectable when creating a user. Super Admin is excluded here too —
 * client-side convenience only, the real enforcement is in the Edge Function. */
export async function fetchAssignableRoles(): Promise<AssignableRole[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name")
    .eq("is_superadmin", false)
    .order("name");

  if (error) throw error;
  return data;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role_id: string;
}

export async function createUser(input: CreateUserInput) {
  const { data, error } = await supabase.functions.invoke("create-user", {
    body: input,
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as { success: true; user_id: string };
}

// ---------------------------------------------------------------------------
// Akses kategori (Fase 3) — grant user_category_access per user
// ---------------------------------------------------------------------------
export interface AccountRow {
  id: string;
  email: string;
  roles: { name: string } | null;
}

/** Semua akun — Super Admin (via policy superadmin_read_all_profiles). */
export async function fetchAccounts(): Promise<AccountRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, roles(name)")
    .order("email");
  if (error) throw error;
  return data as unknown as AccountRow[];
}

export async function fetchCategoryAccess(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_category_access")
    .select("category_id")
    .eq("user_id", userId);
  if (error) throw error;
  return data.map((r) => r.category_id);
}

/** Ganti total akses kategori user (hapus-tambah; skala kecil cukup). */
export async function saveCategoryAccess(userId: string, categoryIds: string[]) {
  const { error: delError } = await supabase.from("user_category_access").delete().eq("user_id", userId);
  if (delError) throw delError;
  if (categoryIds.length === 0) return;
  const { error: insError } = await supabase
    .from("user_category_access")
    .insert(categoryIds.map((category_id) => ({ user_id: userId, category_id })));
  if (insError) throw insError;
}
