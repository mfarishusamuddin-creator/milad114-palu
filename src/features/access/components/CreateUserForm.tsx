import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createUserSchema, type CreateUserFormValues } from "../schemas";
import { createUser, fetchAssignableRoles } from "../api/access.api";
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

export function CreateUserForm() {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ["assignable-roles"],
    queryFn: fetchAssignableRoles,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({ resolver: zodResolver(createUserSchema) });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["assignable-roles"] });
    },
  });

  function onSubmit(values: CreateUserFormValues) {
    createUserMutation.mutate(values);
  }

  return (
    <form className="flex w-full max-w-sm flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-email">Email</Label>
        <Input id="new-email" type="email" placeholder="user@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">Password Sementara</Label>
        <Input id="new-password" type="text" placeholder="Minimal 8 karakter" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-role">Role</Label>
        <Controller
          name="role_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="new-role">
                <SelectValue placeholder={rolesQuery.isLoading ? "Memuat…" : "Pilih role"} />
              </SelectTrigger>
              <SelectContent>
                {rolesQuery.data?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role_id && <p className="text-xs text-destructive">{errors.role_id.message}</p>}
        {rolesQuery.isSuccess && rolesQuery.data.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Belum ada role selain Super Admin — buat role dulu (Fase 2).
          </p>
        )}
      </div>

      {createUserMutation.isError && (
        <p role="status" aria-live="polite" className="text-xs text-destructive">
          {createUserMutation.error instanceof Error
            ? createUserMutation.error.message
            : "Gagal membuat akun."}
        </p>
      )}
      {createUserMutation.isSuccess && (
        <p role="status" aria-live="polite" className="text-xs text-emerald-400">
          Akun berhasil dibuat.
        </p>
      )}

      <Button type="submit" disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? "Membuat…" : "Buat Akun"}
      </Button>
    </form>
  );
}
