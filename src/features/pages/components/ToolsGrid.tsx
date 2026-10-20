import { Link } from "react-router-dom";

import type { PageMeta } from "@/features/pages/types";
import { ToolStarButton } from "./ToolStarButton";

interface ToolsGridProps {
  tools: PageMeta[];
  /** Pesan saat daftar kosong (beda konteks: belum ada tool vs tidak ada hasil). */
  emptyMessage: string;
}

/**
 * Grid kartu tool dengan tombol bintang favorit.
 *
 * Dipakai bersama oleh Overview (dashboard awal) dan halaman Favorit supaya
 * tampilan serta perilaku klik keduanya identik — tombol bintang diposisikan
 * absolut di pojok kartu agar tidak menutupi area klik tool.
 */
export function ToolsGrid({ tools, emptyMessage }: ToolsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <div
          key={t.slug}
          className="group relative rounded-lg border border-border bg-card/40 transition-colors hover:bg-foreground/5"
        >
          <Link to={`/admin/tools/${t.slug}`} className="block p-4 pr-10">
            <p className="line-clamp-1 text-sm font-medium text-foreground">{t.title}</p>
            <p className="mt-1 font-mono text-[11px] text-kicker">{t.slug}</p>
          </Link>
          <ToolStarButton slug={t.slug} title={t.title} className="absolute right-2 top-2" />
        </div>
      ))}
      {tools.length === 0 && <p className="text-sm text-muted-foreground">{emptyMessage}</p>}
    </div>
  );
}
