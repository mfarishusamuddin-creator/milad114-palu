import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { ResizableHtmlToolFrame } from "./ResizableHtmlToolFrame";
import { fetchPageBySlug } from "@/features/pages/api/pages.api";
import { fetchToolData } from "@/features/tool-data/api/toolData.api";
import { subscribeToToolData } from "@/features/tool-data/api/toolDataRealtime";
import type { ToolDataMap } from "@/features/tool-data/types";
import { recordToolOpen } from "@/lib/tools-prefs";

/** Penanda pada HTML tool yang sudah beralih ke Shared Core (records). */
const CLOUD_MARKER = 'name="husam-core"';

/**
 * Render satu tool privat (scope='admin').
 *
 * Ada dua mode:
 *  - Legacy: tool memakai jembatan `tool_data` (shim localStorage + remount).
 *  - Cloud-native: tool memakai Shared Core (`window.parent.__husamCore`) dan
 *    dirender polos — TIDAK dibungkus shim lama & TIDAK diremount oleh realtime
 *    `tool_data`, agar tidak terjadi remount-loop/kehilangan data.
 */
export function AdminToolViewPage() {
  const { slug = "" } = useParams();
  const queryClient = useQueryClient();
  const [reloadKey, setReloadKey] = useState(0);

  const pageQuery = useQuery({
    queryKey: ["page", slug],
    queryFn: () => fetchPageBySlug(slug),
  });

  const page = pageQuery.data;
  const isCloud = !!page && page.html_content.includes(CLOUD_MARKER);

  // Catat waktu buka tool — dipakai Tools Hub untuk mengurutkan dashboard
  // berdasarkan tool yang terakhir dibuka (localStorage, tidak menyentuh DB).
  useEffect(() => {
    if (slug) recordToolOpen(slug);
  }, [slug]);

  const dataQuery = useQuery({
    queryKey: ["tool-data", slug],
    queryFn: () => fetchToolData(slug),
    enabled: !!slug && !isCloud,
  });

  // Realtime legacy (hanya utk tool non-cloud): remount iframe bila data berubah.
  useEffect(() => {
    if (!slug || isCloud) return;
    const unsubscribe = subscribeToToolData(slug, (change) => {
      queryClient.setQueryData<ToolDataMap>(["tool-data", slug], (old = {}) => {
        const next = { ...old };
        if (change.type === "delete") {
          delete next[change.key];
        } else {
          next[change.key] = change.value;
        }
        return next;
      });
      setReloadKey((k) => k + 1);
    });
    return unsubscribe;
  }, [slug, isCloud, queryClient]);

  const loading = pageQuery.isLoading || (!isCloud && dataQuery.isLoading);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Tool tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ResizableHtmlToolFrame
        key={isCloud ? slug : reloadKey}
        html={page.html_content}
        title={page.title}
        slug={slug}
        toolData={isCloud ? undefined : (dataQuery.data ?? {})}
      />
    </div>
  );
}
