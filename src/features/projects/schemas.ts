import { z } from "zod";

import type { ProjectType } from "@/types/database";

// Seluruh field opsional string — form memegang string mentah (input), konversi
// numerik dilakukan saat submit (buildDetail). Menghindari mismatch input/output
// z.coerce + default yang mengganggu tipe resolver react-hook-form.
export const projectFormSchema = z.object({
  name: z.string().min(1, "Nama project wajib diisi"),
  category_id: z.string().optional(),
  type: z.enum(["erp", "learning", "event"]),
  // ERP
  budget_total: z.string().optional(),
  budget_used: z.string().optional(),
  // Learning
  target_description: z.string().optional(),
  progress_percent: z.string().optional(),
  time_allocated: z.string().optional(),
  time_spent: z.string().optional(),
  // Event
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location_address: z.string().optional(),
  location_lat: z.string().optional(),
  location_lng: z.string().optional(),
  agenda: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export interface ProjectTypeField {
  key: keyof ProjectFormValues;
  label: string;
  kind: "number" | "text" | "datetime-local" | "date";
}

export const PROJECT_TYPE_FIELDS: Record<ProjectType, ProjectTypeField[]> = {
  erp: [
    { key: "budget_total", label: "Budget Total", kind: "number" },
    { key: "budget_used", label: "Budget Terpakai", kind: "number" },
  ],
  learning: [
    { key: "target_description", label: "Deskripsi Target", kind: "text" },
    { key: "progress_percent", label: "Progress (%)", kind: "number" },
    { key: "time_allocated", label: "Waktu Dialokasikan (jam)", kind: "number" },
    { key: "time_spent", label: "Waktu Terpakai (jam)", kind: "number" },
  ],
  event: [
    { key: "start_time", label: "Mulai", kind: "datetime-local" },
    { key: "end_time", label: "Selesai", kind: "datetime-local" },
    { key: "location_address", label: "Alamat Lokasi", kind: "text" },
    { key: "location_lat", label: "Latitude", kind: "text" },
    { key: "location_lng", label: "Longitude", kind: "text" },
    { key: "agenda", label: "Agenda", kind: "text" },
  ],
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  erp: "ERP",
  learning: "Learning",
  event: "Event",
};
