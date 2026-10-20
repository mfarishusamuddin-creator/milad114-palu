import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchAccounts,
  fetchCategoryAccess,
  saveCategoryAccess,
} from "../api/access.api";
import { fetchProjectCategories } from "@/features/projects/api/projects.api";

export function CategoryAccessForm() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [edited, setEdited] = useState<Set<string> | null>(null);

  const accountsQuery = useQuery({ queryKey: ["accounts-admin"], queryFn: fetchAccounts });
  const categoriesQuery = useQuery({ queryKey: ["project-categories"], queryFn: fetchProjectCategories });
  const accessQuery = useQuery({
    queryKey: ["category-access", userId],
    queryFn: () => fetchCategoryAccess(userId!),
    enabled: !!userId,
  });

  const checked = edited ?? new Set(accessQuery.data ?? []);

  function toggle(id: string) {
    setEdited((prev) => {
      const base = prev ?? new Set(accessQuery.data ?? []);
      const next = new Set(base);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const saveMutation = useMutation({
    mutationFn: () => saveCategoryAccess(userId!, [...checked]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-access", userId] });
      setEdited(null);
    },
  });

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Akun</p>
        <div className="flex flex-wrap gap-2">
          {accountsQuery.data?.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setUserId(a.id);
                setEdited(null);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                userId === a.id
                  ? "border-ring bg-foreground/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {a.email}
              {a.roles?.name ? ` (${a.roles.name})` : ""}
            </button>
          ))}
          {accountsQuery.data?.length === 0 && (
            <p className="text-xs text-muted-foreground">Belum ada akun lain.</p>
          )}
        </div>
      </div>

      {userId && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Kategori yang bisa diakses
            </p>
            {categoriesQuery.data?.length ? (
              <div className="flex flex-wrap gap-4">
                {categoriesQuery.data.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={checked.has(c.id)}
                      onChange={() => toggle(c.id)}
                      className="h-4 w-4 rounded border-border accent-foreground"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Belum ada kategori project — buat lewat Resources/Project dulu.
              </p>
            )}
          </div>
          <Button
            type="button"
            className="w-fit"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? "Menyimpan…" : "Simpan Akses"}
          </Button>
          {saveMutation.isError && (
            <p className="text-xs text-destructive">
              {saveMutation.error instanceof Error ? saveMutation.error.message : "Gagal menyimpan akses."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
