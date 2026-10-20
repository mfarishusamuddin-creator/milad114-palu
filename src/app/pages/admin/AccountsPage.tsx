import { useState } from "react";

import { PanelLayout } from "@/components/layout/PanelLayout";
import { CreateUserForm } from "@/features/access/components/CreateUserForm";
import { RoleBuilder } from "@/features/access/components/RoleBuilder";
import { CategoryAccessForm } from "@/features/access/components/CategoryAccessForm";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "create-user", label: "Buat User" },
  { id: "roles", label: "Role Builder" },
  { id: "category-access", label: "Akses Kategori" },
] as const;

export function AccountsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("create-user");

  return (
    <PanelLayout
      kicker="Account & Role Management"
      title={TABS.find((t) => t.id === tab)!.label}
      left={{
        name: "Menu",
        content: (
          <nav className="flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  tab === t.id
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        ),
      }}
    >
      {tab === "create-user" ? (
        <CreateUserForm />
      ) : tab === "roles" ? (
        <RoleBuilder />
      ) : (
        <CategoryAccessForm />
      )}
    </PanelLayout>
  );
}
