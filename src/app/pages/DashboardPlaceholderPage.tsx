import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/api/auth.api";
import { useSession } from "@/features/auth/hooks/useSession";

// Phase 1A placeholder — replaced once the real dashboard (Phase 3+) exists.
export function DashboardPlaceholderPage() {
  const navigate = useNavigate();
  const { profile } = useSession();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Selamat datang, {profile?.email}
        </h1>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
