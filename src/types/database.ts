// Hand-written subset of the schema needed for Phase 1A (auth only).
// Superseded later by `supabase gen types typescript` once the CLI is wired up.

export interface Role {
  id: string;
  name: string;
  is_superadmin: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role_id: string | null;
  default_category_id: string | null;
  created_by: string | null;
  must_change_password: boolean;
  created_at: string;
}

/** Shape returned by `profiles` queries embedding the related role. */
export interface ProfileWithRole extends Profile {
  roles: Pick<Role, "is_superadmin"> | null;
}

export type ProjectType = "erp" | "learning" | "event";

export interface ProjectCategory {
  id: string;
  name: string;
  parent_id: string | null;
}

export interface Project {
  id: string;
  name: string;
  category_id: string | null;
  type: ProjectType;
  created_by: string | null;
  created_at: string;
}

export interface ErpProjectDetail {
  project_id: string;
  budget_total: number;
  budget_used: number;
}

export interface LearningProjectDetail {
  project_id: string;
  target_description: string | null;
  progress_percent: number;
  time_allocated: number;
  time_spent: number;
}

export interface EventProjectDetail {
  project_id: string;
  start_time: string | null;
  end_time: string | null;
  location_address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  agenda: string | null;
}

export type ProjectStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  status: ProjectStatus;
  priority: TaskPriority | null;
  due_date: string | null;
  assigned_to: string | null;
  is_milestone: boolean;
  created_at: string;
}
