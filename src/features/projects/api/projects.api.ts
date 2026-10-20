import { supabase } from "@/lib/supabase";
import type {
  ErpProjectDetail,
  EventProjectDetail,
  LearningProjectDetail,
  Project,
  ProjectCategory,
  ProjectTask,
  ProjectType,
} from "@/types/database";

// ---------------------------------------------------------------------------
// Categories (tree_type = 'project')
// ---------------------------------------------------------------------------
export async function fetchProjectCategories(): Promise<ProjectCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, parent_id")
    .eq("tree_type", "project")
    .order("name");
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Projects — list (RLS Visibility Engine) + CRUD
// ---------------------------------------------------------------------------
export interface ProjectRow extends Project {
  categories: Pick<ProjectCategory, "id" | "name"> | null;
  erp_projects: ErpProjectDetail[] | null;
  learning_projects: LearningProjectDetail[] | null;
  event_projects: EventProjectDetail[] | null;
}

const PROJECT_SELECT = `
  id, name, category_id, type, created_by, created_at,
  categories(id, name),
  erp_projects(project_id, budget_total, budget_used),
  learning_projects(project_id, target_description, progress_percent, time_allocated, time_spent),
  event_projects(project_id, start_time, end_time, location_address, location_lat, location_lng, agenda)
`;

export async function fetchProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as unknown as ProjectRow[];
}

export type ErpDetailInput = {
  budget_total: number;
  budget_used: number;
};
export type LearningDetailInput = {
  target_description: string | null;
  progress_percent: number;
  time_allocated: number;
  time_spent: number;
};
export type EventDetailInput = {
  start_time: string | null;
  end_time: string | null;
  location_address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  agenda: string | null;
};

export interface CreateProjectInput {
  name: string;
  category_id: string | null;
  type: ProjectType;
  detail: ErpDetailInput | LearningDetailInput | EventDetailInput;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert({ name: input.name, category_id: input.category_id, type: input.type })
    .select("id")
    .single();
  if (error) throw error;

  const projectId = (data as { id: string }).id;
  const detailTable =
    input.type === "erp" ? "erp_projects" : input.type === "learning" ? "learning_projects" : "event_projects";

  const { error: detailError } = await supabase
    .from(detailTable)
    .insert({ project_id: projectId, ...(input.detail as Record<string, unknown>) });
  if (detailError) throw detailError;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
export async function fetchProjectTasks(projectId: string): Promise<ProjectTask[]> {
  const { data, error } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at");
  if (error) throw error;
  return data as ProjectTask[];
}

export interface CreateTaskInput {
  project_id: string;
  title: string;
  status: ProjectTask["status"];
  priority: ProjectTask["priority"];
  due_date: string | null;
  is_milestone: boolean;
}

export async function createTask(input: CreateTaskInput) {
  const { error } = await supabase.from("project_tasks").insert(input);
  if (error) throw error;
}

export async function updateTaskStatus(id: string, status: ProjectTask["status"]) {
  const { error } = await supabase.from("project_tasks").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("project_tasks").delete().eq("id", id);
  if (error) throw error;
}
