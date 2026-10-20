import { z } from "zod";

export const pageSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: huruf kecil, angka, dan '-'"),
  scope: z.enum(["admin", "public"]),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0),
  is_home: z.boolean(),
  html_content: z.string().min(1, "Konten HTML wajib diisi"),
});

export type PageFormValues = z.infer<typeof pageSchema>;
