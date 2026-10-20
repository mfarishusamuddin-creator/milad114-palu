import { supabase } from "@/lib/supabase";

export interface RoleRow {
  id: string;
  name: string;
  is_superadmin: boolean;
}

export interface PermissionRow {
  id: string;
  module: string;
  action: string;
}

export async function fetchRoles(): Promise<RoleRow[]> {
  const { data, error } = await supabase.from("roles").select("id, name, is_superadmin").order("name");
  if (error) throw error;
  return data;
}

export async function fetchPermissions(): Promise<PermissionRow[]> {
  const { data, error } = await supabase
    .from("permissions")
    .select("id, module, action")
    .order("module")
    .order("action");
  if (error) throw error;
  return data;
}

export async function fetchRolePermissionIds(roleId: string): Promise<string[]> {
  const { data, error } = await supabase.from("role_permissions").select("permission_id").eq("role_id", roleId);
  if (error) throw error;
  return data.map((r) => r.permission_id);
}

/** is_superadmin is never exposed here — new roles are always regular roles. */
export async function createRole(name: string): Promise<RoleRow> {
  const { data, error } = await supabase
    .from("roles")
    .insert({ name, is_superadmin: false })
    .select("id, name, is_superadmin")
    .single();
  if (error) throw error;
  return data;
}

/** Replaces the full permission set for a role (simple delete-then-insert; fine at this scale). */
export async function saveRolePermissions(roleId: string, permissionIds: string[]) {
  const { error: deleteError } = await supabase.from("role_permissions").delete().eq("role_id", roleId);
  if (deleteError) throw deleteError;
  if (permissionIds.length === 0) return;
  const { error: insertError } = await supabase
    .from("role_permissions")
    .insert(permissionIds.map((permission_id) => ({ role_id: roleId, permission_id })));
  if (insertError) throw insertError;
}
