import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, Settings, Wrench, LayoutGrid } from "lucide-react";

import { fetchPages } from "@/features/pages/api/pages.api";
import type { PageMeta } from "@/features/pages/types";

/**
 * Item navigasi admin setelah CMS dihapus dari frontend:
 * - Dashboard (fixed)
 * - Tools (hub — daftar tool hidup di panel sisi Tools Hub)
 * - Kelola Tools (editor, /admin/customtools)
 * - Settings & Customization (fixed)
 *
 * Tool privat individual (scope='admin') TIDAK lagi di-enumerasi di nav atas;
 * daftarnya kini hidup di panel sisi Tools Hub.
 */
export function useAdminNavItems() {
  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: fetchPages });
  const adminTools = (pagesQuery.data ?? [])
    .filter((p) => p.scope === "admin")
    .sort((a, b) => a.title.localeCompare(b.title));

  const tools = adminTools as PageMeta[];

  return {
    pagesQuery,
    fixed: [
      { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "tools", label: "Tools", icon: LayoutGrid },
      { to: "customtools", label: "Kelola Tools", icon: Wrench },
    ],
    tools,
    fixedTail: [
      { to: "settings", label: "Settings & Customization", icon: Settings },
    ],
  };
}
