import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Plus, Trash2 } from "lucide-react";

import { PanelLayout } from "@/components/layout/PanelLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProjectRow } from "../api/projects.api";
import {
  createProject,
  deleteProject,
  fetchProjectCategories,
  fetchProjects,
  type ErpDetailInput,
  type EventDetailInput,
  type LearningDetailInput,
} from "../api/projects.api";
import type { ProjectFormValues } from "../schemas";
import { ProjectForm } from "./ProjectForm";
import { TaskList } from "./TaskList";

function typeSummary(project: ProjectRow) {
  const detail =
    project.type === "erp"
      ? project.erp_projects?.[0]
      : project.type === "learning"
        ? project.learning_projects?.[0]
        : project.event_projects?.[0];

  if (!detail) return null;

  if (project.type === "erp") {
    const d = detail as NonNullable<ProjectRow["erp_projects"]>[number];
    return `Budget ${formatNumber(d.budget_used)} / ${formatNumber(d.budget_total)}`;
  }
  if (project.type === "learning") {
    const d = detail as NonNullable<ProjectRow["learning_projects"]>[number];
    return `Progress ${d.progress_percent}% · ${formatNumber(d.time_spent)}/${formatNumber(d.time_allocated)} jam`;
  }
  const d = detail as NonNullable<ProjectRow["event_projects"]>[number];
  return d.location_address || (d.start_time ? new Date(d.start_time).toLocaleString() : "Event");
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("id-ID").format(n ?? 0);
}

const TYPE_LABELS: Record<string, string> = { erp: "ERP", learning: "Learning", event: "Event" };

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const categoriesQuery = useQuery({ queryKey: ["project-categories"], queryFn: fetchProjectCategories });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["projects"] });

  const createMutation = useMutation({
    mutationFn: (v: ProjectFormValues) =>
      createProject({
        name: v.name,
        category_id: v.category_id || null,
        type: v.type,
        detail: buildDetail(v),
      }),
    onSuccess: () => {
      invalidate();
      setCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      invalidate();
      setSelectedId(null);
    },
  });

  const projects = projectsQuery.data ?? [];
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  function handleCreate(values: ProjectFormValues) {
    createMutation.mutate(values);
  }

  return (
    <PanelLayout
      kicker="Project Management"
      title={selected ? selected.name : "Project"}
      left={{
        name: "Daftar Project",
        content: (
          <nav className="flex flex-col gap-1">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedId(p.id);
                  setCreating(false);
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  selectedId === p.id
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <span className="line-clamp-1">{p.name}</span>
                <span className="block text-[11px] text-kicker">
                  {TYPE_LABELS[p.type]}
                  {p.categories ? ` · ${p.categories.name}` : ""}
                </span>
              </button>
            ))}
            {projects.length === 0 && (
              <p className="text-xs text-muted-foreground">Belum ada project.</p>
            )}
          </nav>
        ),
      }}
      right={{
        name: "Info",
        content: selected ? (
          <div className="flex flex-col gap-3 text-sm text-foreground">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Tipe</p>
              <p className="text-kicker">{TYPE_LABELS[selected.type]}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Kategori</p>
              <p>{selected.categories?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Ringkasan</p>
              <p>{typeSummary(selected) ?? "—"}</p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate(selected.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={14} /> Hapus
            </Button>
          </div>
        ) : null,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {creating
            ? "Buat project baru"
            : selected
              ? "Task & Progress"
              : `${projects.length} project`}
        </p>
        {!creating && (
          <Button type="button" size="sm" variant="outline" onClick={() => setCreating(true)}>
            <Plus size={14} /> <FolderKanban size={14} /> Project Baru
          </Button>
        )}
      </div>

      <div className="mt-4">
        {creating ? (
          <ProjectForm
            categories={categoriesQuery.data ?? []}
            submitting={createMutation.isPending}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        ) : selected ? (
          <TaskList projectId={selected.id} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Pilih project dari daftar, atau buat project baru.
          </p>
        )}
      </div>

      {createMutation.isError && (
        <p className="mt-3 text-xs text-destructive">
          {createMutation.error instanceof Error ? createMutation.error.message : "Gagal membuat project."}
        </p>
      )}
    </PanelLayout>
  );
}

function buildDetail(v: ProjectFormValues): ErpDetailInput | LearningDetailInput | EventDetailInput {
  const n = (s?: string) => Number(s || 0);
  if (v.type === "erp") {
    return { budget_total: n(v.budget_total), budget_used: n(v.budget_used) };
  }
  if (v.type === "learning") {
    return {
      target_description: v.target_description || null,
      progress_percent: n(v.progress_percent),
      time_allocated: n(v.time_allocated),
      time_spent: n(v.time_spent),
    };
  }
  return {
    start_time: v.start_time ? new Date(v.start_time).toISOString() : null,
    end_time: v.end_time ? new Date(v.end_time).toISOString() : null,
    location_address: v.location_address || null,
    location_lat: v.location_lat ? Number(v.location_lat) : null,
    location_lng: v.location_lng ? Number(v.location_lng) : null,
    agenda: v.agenda || null,
  };
}
