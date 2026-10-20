import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
  role_id: z.string().min(1, "Pilih role"),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
