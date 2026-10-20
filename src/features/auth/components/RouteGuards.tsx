import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useSession } from "../hooks/useSession";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Loading…
      </p>
    </div>
  );
}

/** Protects routes meant for regular (non-superadmin) users. */
export function RequireUser({ children }: { children: ReactNode }) {
  const { session, isSuperAdmin, isLoading } = useSession();

  if (isLoading) return <FullScreenLoader />;
  if (!session) return <Navigate to="/" replace />;
  // A superadmin session wandering here is redirected away, not signed out —
  // forced sign-out is reserved for the superadmin login form itself.
  if (isSuperAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}

/** Protects routes meant only for the Super Admin. */
export function RequireSuperAdmin({ children }: { children: ReactNode }) {
  const { session, isSuperAdmin, isLoading } = useSession();

  if (isLoading) return <FullScreenLoader />;
  if (!session) return <Navigate to="/" replace />;
  if (!isSuperAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
