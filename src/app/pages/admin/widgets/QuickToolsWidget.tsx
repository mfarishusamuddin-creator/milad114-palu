import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { fetchPages } from "@/features/pages/api/pages.api";
import { cn } from "@/lib/utils";

/** Akses cepat ke tool privat (scope='admin') — dari tabel pages. */
export function QuickToolsWidget() {
  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: fetchPages });
  const tools = (pagesQuery.data ?? [])
    .filter((p) => p.scope === "admin")
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="rounded-lg border border-border bg-card/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Akses Cepat — Tools
      </p>
      <div className="mt-3 flex flex-col gap-1">
        {tools.map((t) => (
          <Link
            key={t.slug}
            to={`/admin/tools/${t.slug}`}
            className={cn(
              "rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            {t.title}
          </Link>
        ))}
        {tools.length === 0 && (
          <p className="text-xs text-muted-foreground">Belum ada tool. Tambah lewat Kelola Tools.</p>
        )}
      </div>
    </div>
  );
}
