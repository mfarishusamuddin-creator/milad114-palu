import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectType } from "@/types/database";
import type { ProjectCategory } from "@/types/database";
import {
  PROJECT_TYPE_FIELDS,
  PROJECT_TYPE_LABELS,
  projectFormSchema,
  type ProjectFormValues,
} from "../schemas";

interface ProjectFormProps {
  categories: ProjectCategory[];
  submitting: boolean;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel?: () => void;
}

export function ProjectForm({ categories, submitting, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      type: "erp",
      category_id: "",
      budget_total: "",
      budget_used: "",
      progress_percent: "",
      time_allocated: "",
      time_spent: "",
    },
  });

  const type = watch("type") as ProjectType;
  const fields = PROJECT_TYPE_FIELDS[type];

  function handleTypeChange(value: string) {
    setValue("type", value as ProjectType, { shouldValidate: true });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project-name">Nama Project</Label>
        <Input id="project-name" placeholder="mis. Sistem ERP Internal" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project-category">Kategori</Label>
        <select
          id="project-category"
          {...register("category_id")}
          className="h-11 rounded-lg border border-border bg-input px-3.5 py-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
        >
          <option value="">— Tanpa kategori —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project-type">Tipe</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger id="project-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {PROJECT_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1.5">
          <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
          <Input
            id={`field-${field.key}`}
            type={field.kind}
            step={field.kind === "number" ? "any" : undefined}
            {...register(field.key as never)}
          />
          {errors[field.key] && (
            <p className="text-xs text-destructive">{errors[field.key]?.message}</p>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan…" : "Simpan Project"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
      </div>
    </form>
  );
}
