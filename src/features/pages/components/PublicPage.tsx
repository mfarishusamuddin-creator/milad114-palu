import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { PublicSiteLayout } from "./PublicSiteLayout";
import { fetchPageBySlug } from "@/features/pages/api/pages.api";

/** Halaman publik (scope='public' & is_published) — RLS membatasi fetch-nya. */
export function PublicPage() {
  const { slug = "" } = useParams();
  const pageQuery = useQuery({
    queryKey: ["public-page", slug],
    queryFn: () => fetchPageBySlug(slug),
  });

  if (pageQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const page = pageQuery.data;
  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background text-center">
        <p className="text-sm text-foreground">Halaman tidak ditemukan.</p>
        <p className="text-xs text-muted-foreground">
          Periksa kembali alamatnya, atau halaman belum dipublikasikan.
        </p>
      </div>
    );
  }

  return <PublicSiteLayout html={page.html_content} title={page.title} currentSlug={page.slug} />;
}
