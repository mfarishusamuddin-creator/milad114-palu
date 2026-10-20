import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProjectTask, ProjectStatus } from "@/types/database";
import { createTask, deleteTask, fetchProjectTasks, updateTaskStatus } from "../api/projects.api";

const STATUS_ORDER: ProjectStatus[] = ["todo", "in_progress", "completed"];
const STATUS_LABELS: Record<ProjectStatus, string> = {
  todo: "To Do",
  in_progress: "Sedang Dikerjakan",
  completed: "Selesai",
};

export function TaskList({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [asMilestone, setAsMilestone] = useState(false);

  const tasksQuery = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => fetchProjectTasks(projectId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });

  const addMutation = useMutation({
    mutationFn: () =>
      createTask({ project_id: projectId, title: newTitle.trim(), status: "todo", priority: null, due_date: null, is_milestone: asMilestone }),
    onSuccess: () => {
      setNewTitle("");
      setAsMilestone(false);
      invalidate();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) => updateTaskStatus(id, status),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({ mutationFn: deleteTask, onSuccess: invalidate });

  const tasks = tasksQuery.data ?? [];
  const milestones = tasks.filter((t) => t.is_milestone);
  const regular = tasks.filter((t) => !t.is_milestone);

  function TaskCard({ task }: { task: ProjectTask }) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/40 p-3">
        <div className="flex min-w-0 items-center gap-2">
          {task.is_milestone && <Flag size={14} className="shrink-0 text-kicker" />}
          <span className={cn("line-clamp-1 text-sm", task.status === "completed" && "line-through opacity-60")}>
            {task.title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => statusMutation.mutate({ id: task.id, status: e.target.value as ProjectStatus })}
            className="h-8 rounded-md border border-border bg-input px-2 text-xs text-foreground focus-visible:outline-none"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-label="Hapus task"
            onClick={() => deleteMutation.mutate(task.id)}
            className="rounded p-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tulis task baru…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTitle.trim()) addMutation.mutate();
            }}
          />
          <label className="flex w-fit items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={asMilestone}
              onChange={(e) => setAsMilestone(e.target.checked)}
              className="h-3.5 w-3.5 accent-foreground"
            />
            Jadikan milestone
          </label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!newTitle.trim() || addMutation.isPending}
          onClick={() => addMutation.mutate()}
        >
          <Plus size={14} /> Tambah
        </Button>
      </div>

      {milestones.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Milestones</p>
          {milestones.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
      {regular.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Tugas</p>
          {regular.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
      {tasks.length === 0 && (
        <p className="text-xs text-muted-foreground">Belum ada task. Tambahkan di atas.</p>
      )}
    </div>
  );
}
