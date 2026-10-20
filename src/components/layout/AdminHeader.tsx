import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/api/auth.api";
import { useSession } from "@/features/auth/hooks/useSession";

export function AdminHeader() {
  const navigate = useNavigate();
  const { profile } = useSession();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Super Admin
      </p>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{profile?.email}</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
