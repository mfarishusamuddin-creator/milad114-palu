import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/tools-prefs";
import { useToolsPrefs } from "@/features/pages/hooks/useToolsPrefs";

interface ToolStarButtonProps {
  /** Slug tool yang diwakili tombol. */
  slug: string;
  /** Judul tool (dipakai untuk label aksesibel). */
  title: string;
  className?: string;
}

/**
 * Tombol bintang untuk menambah/menghapus tool dari favorit.
 *
 * `preventDefault` + `stopPropagation` penting karena tombol sering berada di
 * dalam kartu/link tool — tanpa itu, menekan bintang akan ikut membuka tool.
 * `aria-pressed` menandai status favorit untuk pembaca layar.
 */
export function ToolStarButton({ slug, title, className }: ToolStarButtonProps) {
  const { favorites } = useToolsPrefs();
  const active = favorites.includes(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      aria-pressed={active}
      aria-label={active ? `Hapus ${title} dari favorit` : `Tambahkan ${title} ke favorit`}
      title={active ? "Hapus dari favorit" : "Tambahkan ke favorit"}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "text-amber-400 hover:text-amber-300",
        className,
      )}
    >
      <Star size={14} className={cn(active && "fill-current")} />
    </button>
  );
}
