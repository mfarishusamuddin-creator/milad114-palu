import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCard } from "../components/AuthCard";
import { loginSchema, type LoginFormValues } from "../schemas";
import { fetchProfileWithRole, signInWithPassword, signOut } from "../api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

export function SuperAdminLoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const { user } = await signInWithPassword(values.email, values.password);
      const profile = await fetchProfileWithRole(user.id);

      if (!profile.roles?.is_superadmin) {
        await signOut();
        setServerError("Akun ini bukan Super Admin.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login gagal.");
    }
  }

  return (
    <AuthCard
      kicker="Restricted access"
      title="Admin sign in"
      description="Khusus akun Super Admin."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        {serverError && (
          <p role="status" aria-live="polite" className="text-xs text-destructive">
            {serverError}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Signing in…" : "Login →"}
        </Button>
      </form>
    </AuthCard>
  );
}
