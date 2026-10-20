import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { HtmlToolFrame } from "./HtmlToolFrame";
import { fetchPublicPages } from "../api/pages.api";
import { cn } from "@/lib/utils";

interface PublicSiteLayoutProps {
  html: string;
  title: string;
  /** slug halaman yang sedang dibuka (untuk highlight nav). */
  currentSlug?: string;
}

/**
 * Tata letak halaman publik: nav ramping (daftar halaman published) + konten
 * iframe full-screen. Dipakai HomePage (landing) & PublicPage (/:slug).
 */
export function PublicSiteLayout({ html, title, currentSlug }: PublicSiteLayoutProps) {
  const publicPagesQuery = useQuery({ queryKey: ["public-pages"], queryFn: fetchPublicPages });
  const pages = publicPagesQuery.data ?? [];

  return (
    <div className="flex h-screen flex-col bg-background">
      <nav className="flex shrink-0 items-center gap-4 overflow-x-auto border-b border-border px-4 py-2">
        <Link
          to="/"
          className={cn(
            "shrink-0 font-mono text-[11px] uppercase tracking-[0.2em]",
            !currentSlug ? "text-foreground" : "text-kicker",
          )}
        >
          Beranda
        </Link>
        {pages.map((p) => (
          <Link
            key={p.slug}
            to={`/${p.slug}`}
            className={cn(
              "shrink-0 text-xs transition-colors",
              currentSlug === p.slug
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {p.title}
          </Link>
        ))}
      </nav>
      <div className="min-h-0 flex-1">
        <HtmlToolFrame html={html} title={title} />
      </div>
    </div>
  );
}
