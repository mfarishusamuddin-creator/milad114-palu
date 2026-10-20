import { supabase } from "@/lib/supabase";
import type { PageMeta, PageRow, PageScope } from "../types";

const META_SELECT = "id, slug, title, scope, is_published, sort_order, is_home";

/** Semua page — Super Admin (via policy pages_select). */
export async function fetchPages(): Promise<PageMeta[]> {
  const { data, error } = await supabase
    .from("pages")
    .select(META_SELECT)
    .order("title");
  if (error) throw error;
  return data as PageMeta[];
}

/** Semua halaman publik yang dipublikasikan, diurutkan untuk menu. */
export async function fetchPublicPages(): Promise<PageMeta[]> {
  const { data, error } = await supabase
    .from("pages")
    .select(META_SELECT)
    .eq("scope", "public")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });
  if (error) throw error;
  return data as PageMeta[];
}

/** Halaman publik yang ditandai is_home (untuk landing "/"). */
export async function fetchHomePage(): Promise<PageRow | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("scope", "public")
    .eq("is_published", true)
    .eq("is_home", true)
    .maybeSingle();
  if (error) throw error;
  return (data as PageRow | null) ?? null;
}

/** Ambil satu page by slug. Untuk publik: policy sudah membatasi scope='public' & published. */
export async function fetchPageBySlug(slug: string): Promise<PageRow | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as PageRow | null) ?? null;
}

export interface UpsertPageInput {
  slug: string;
  title: string;
  html_content: string;
  scope: PageScope;
  is_published: boolean;
  sort_order: number;
  is_home: boolean;
}

/** Buat page baru. */
export async function createPage(input: UpsertPageInput) {
  const { error } = await supabase.from("pages").insert(input);
  if (error) throw error;
}

/** Update page by id (updated_at di-set manual — tanpa trigger). */
export async function updatePage(id: string, input: UpsertPageInput) {
  const { error } = await supabase
    .from("pages")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePage(id: string) {
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw error;
}

/** Update flag ringan (published/home/urutan) tanpa harus mengirim seluruh konten. */
export async function patchPageFlags(
  id: string,
  patch: { is_published?: boolean; is_home?: boolean; sort_order?: number },
) {
  const { error } = await supabase
    .from("pages")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Metrics — RPC security definer (tanpa service key di client)
// ---------------------------------------------------------------------------
export interface TableUsageRow {
  table_name: string;
  approx_rows: number;
  total_bytes: number;
}

export async function fetchTableUsage(): Promise<TableUsageRow[]> {
  const { data, error } = await supabase.rpc("get_table_usage");
  if (error) throw error;
  return data as TableUsageRow[];
}

export interface StorageUsageRow {
  bucket_name: string;
  file_count: number;
  total_bytes: number;
}

export async function fetchStorageUsage(): Promise<StorageUsageRow[]> {
  const { data, error } = await supabase.rpc("get_storage_usage");
  if (error) throw error;
  return data as StorageUsageRow[];
}
