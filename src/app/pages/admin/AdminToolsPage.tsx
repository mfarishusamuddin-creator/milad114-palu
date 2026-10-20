import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { PanelLayout } from "@/components/layout/PanelLayout";
import { PageEditor } from "@/features/pages/components/PageEditor";
import { fetchPageBySlug, fetchPages } from "@/features/pages/api/pages.api";
import { cn } from "@/lib/utils";
import type { PageScope } from "@/features/pages/types";

const SCOPE_LABELS: Record<PageScope, string> = {
  admin: "Admin (privat)",
  public: "Publik",
};

export function AdminToolsPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: fetchPages });
  const selectedQuery = useQuery({
    queryKey: ["page", selectedSlug],
    queryFn: () => fetchPageBySlug(selectedSlug!),
    enabled: !!selectedSlug && !creating,
  });

  function afterSave() {
    setSelectedSlug(null);
    setCreating(false);
  }

  return (
    <PanelLayout
      kicker="Custom Tools"
      title={
        creating
          ? "Tool Baru"
          : (selectedQuery.data?.title ?? "Custom Tools")
      }
      left={{
        name: "Daftar Tool",
        content: (
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                setCreating(true);
                setSelectedSlug(null);
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                creating
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <Plus size={16} /> Buat Tool Baru
            </button>
            {pagesQuery.data?.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => {
                  setCreating(false);
                  setSelectedSlug(p.slug);
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  selectedSlug === p.slug && !creating
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <span className="line-clamp-1">{p.title}</span>
                <span className="block text-[11px] text-kicker">
                  {SCOPE_LABELS[p.scope]} · {p.is_published ? "published" : "draft"}
                </span>
              </button>
            ))}
            {pagesQuery.data?.length === 0 && !creating && (
              <p className="text-xs text-muted-foreground">Belum ada tool.</p>
            )}
          </nav>
        ),
      }}
    >
      {creating ? (
        <PageEditor page={null} defaultScope="admin" onSaved={afterSave} />
      ) : selectedQuery.data ? (
        <PageEditor page={selectedQuery.data} defaultScope="admin" onSaved={afterSave} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Pilih tool dari daftar, atau buat tool baru.
        </p>
      )}
    </PanelLayout>
  );
}
