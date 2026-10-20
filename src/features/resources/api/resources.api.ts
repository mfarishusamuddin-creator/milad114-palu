import { supabase } from "@/lib/supabase";

export interface ResourceCategory {
  id: string;
  name: string;
  parent_id: string | null;
}

export async function fetchResourceCategories(): Promise<ResourceCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, parent_id")
    .eq("tree_type", "resource")
    .order("name");
  if (error) throw error;
  return data;
}

export async function createResourceCategory(
  name: string,
  parentId: string | null,
): Promise<ResourceCategory> {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, parent_id: parentId, tree_type: "resource" })
    .select("id, name, parent_id")
    .single();
  if (error) throw error;
  return data;
}

export interface ResourceFile {
  id: string;
  category_id: string | null;
  name: string;
  file_type: "card" | "email" | "image";
  data: Record<string, unknown>;
  created_at: string;
}

export async function fetchResourceFiles(categoryId: string | null): Promise<ResourceFile[]> {
  const query = supabase
    .from("resource_files")
    .select("id, category_id, name, file_type, data, created_at")
    .order("name");
  const { data, error } = categoryId ? await query.eq("category_id", categoryId) : await query.is("category_id", null);
  if (error) throw error;
  return data;
}

export async function createResourceCardFile(input: {
  name: string;
  category_id: string | null;
  description: string;
}) {
  const { error } = await supabase.from("resource_files").insert({
    name: input.name,
    category_id: input.category_id,
    file_type: "card",
    data: { description: input.description },
  });
  if (error) throw error;
}

export async function deleteResourceFile(id: string) {
  const { error } = await supabase.from("resource_files").delete().eq("id", id);
  if (error) throw error;
}
