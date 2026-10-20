import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Expand,
  PanelLeftClose,
  PanelLeftOpen,
  PanelTopClose,
  PanelTopOpen,
  Search,
  Star,
} from "lucide-react";

import { fetchPages } from "@/features/pages/api/pages.api";
import { useSettings } from "@/features/settings/hooks/useSettings";
import type { NavLayoutSettings } from "@/features/settings/types";
import { useToolsPrefs } from "@/features/pages/hooks/useToolsPrefs";
import {
  filterTools,
  orderToolsByRecent,
  orderToolsForDashboard,
} from "@/features/pages/lib/tool-order";
import { ToolStarButton } from "@/features/pages/components/ToolStarButton";
import { ToolsGrid } from "@/features/pages/components/ToolsGrid";
import {
  ToolsSearchContext,
  useToolsSearch,
} from "@/features/pages/components/tools-search-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getAdminNavVisible, setAdminNavVisible } from "@/lib/admin-nav-visibility";

/**
 * Tools Hub — navigator terpadu untuk semua tool privat (scope='admin').
 *
 * Halaman ini bertindak sebagai LAYOUT/navigator: header (pencarian + tombol
 * Favorit + toggle navigasi/panel/fullscreen), panel sisi berisi daftar semua
 * tool, dan area konten memakai <Outlet/>. Tool individual TETAP dirender oleh
 * route child `/admin/tools/:slug` (AdminToolViewPage), sehingga logika renderer
 * (cloud-native / legacy bridge) sama sekali tidak diduplikasi di sini — URL
 * tool pun tetap `/admin/tools/<slug>`.
 *
 * Fitur baru:
 *  - Pencarian (header) menyaring panel sisi + grid Overview/Favorit.
 *  - Tombol bintang di tiap tool untuk menambah/menghapus favorit.
 *  - Halaman Favorit (`/admin/tools/favorites`) menampilkan tool favorit saja.
 *  - Overview mengurutkan tool: favorit dipin, lalu "terakhir dibuka".
 *
 * Posisi panel sisi (kiri/kanan) mengikuti pengaturan Side-nav Panel yang sudah
 * ada: settings.nav_layout.sidePosition. TIDAK ada skema settings baru.
 */
export function ToolsHubPage() {
  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: fetchPages });
  const { data: settings } = useSettings();
  const sidePosition =
    (settings?.nav_layout as NavLayoutSettings | undefined)?.sidePosition ?? "left";

  const [collapsed, setCollapsed] = useState(false);

  // Visibilitas bar navigasi atas — dibaca dari localStorage (persisten antar
  // reload/halaman), state lokal hanya untuk label tombol.
  const [navVisible, setNavVisible] = useState(getAdminNavVisible);

  // Kata kunci pencarian — dibagikan ke panel sisi & view anak lewat context.
  const [query, setQuery] = useState("");

  // Favorit (localStorage) untuk indikator tombol Favorit di header.
  const { favorites } = useToolsPrefs();

  // Tombol Favorit bersifat TOGGLE: dari dashboard → halaman Favorit, dan
  // sebaliknya dari halaman Favorit → dashboard (Overview /admin/tools).
  const navigate = useNavigate();
  const location = useLocation();
  const onFavorites = location.pathname === "/admin/tools/favorites";

  function toggleNav() {
    const next = !navVisible;
    setNavVisible(next);
    setAdminNavVisible(next);
  }

  async function toggleBrowserFullscreen() {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }

  // Daftar tool privat (scope='admin') urut A-Z — dasar untuk panel sisi.
  const tools = useMemo(
    () =>
      (pagesQuery.data ?? [])
        .filter((p) => p.scope === "admin")
        .sort((a, b) => a.title.localeCompare(b.title)),
    [pagesQuery.data],
  );

  // Panel sisi mempertahankan urutan A-Z; pencarian hanya menyaring.
  const visibleTools = useMemo(() => filterTools(tools, query), [tools, query]);

  const sidePanel = (
    <aside className="flex w-64 shrink-0 flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Semua Tools
      </p>
      <nav className="flex flex-col gap-1">
        <NavLink
          to="/admin/tools"
          end
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )
          }
        >
          Overview
        </NavLink>
        {visibleTools.map((t) => (
          <div key={t.slug} className="flex items-center gap-1">
            <NavLink
              to={t.slug}
              className={({ isActive }) =>
                cn(
                  "flex min-w-0 flex-1 flex-col gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )
              }
            >
              <span className="line-clamp-1">{t.title}</span>
              <span className="block font-mono text-[11px] text-kicker">{t.slug}</span>
            </NavLink>
            <ToolStarButton slug={t.slug} title={t.title} />
          </div>
        ))}
        {visibleTools.length === 0 && (
          <p className="px-3 text-xs text-muted-foreground">
            {tools.length === 0 ? "Belum ada tool." : "Tidak ada tool yang cocok."}
          </p>
        )}
      </nav>
    </aside>
  );

  const content = (
    <div className="min-w-0 flex-1">
      <Outlet />
    </div>
  );

  return (
    <ToolsSearchContext.Provider value={query}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-kicker">Tools Hub</p>
            <h1 className="mt-1 text-xl font-semibold text-foreground">Tools</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Pencarian — menyaring panel sisi, Overview, dan halaman Favorit. */}
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari tool…"
                aria-label="Cari tool"
                className="h-9 w-52 pl-9 text-xs"
              />
            </div>
            {/* Tombol Favorit — TOGGLE: buka halaman Favorit, tekan lagi kembali
                ke Dashboard Tools. Label mengikuti aksi berikutnya. */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate(onFavorites ? "/admin/tools" : "/admin/tools/favorites")}
              aria-pressed={onFavorites}
              aria-label={onFavorites ? "Kembali ke Dashboard Tools" : "Buka daftar tool favorit"}
              title={onFavorites ? "Kembali ke Dashboard Tools" : "Favorit"}
              className={cn(onFavorites && "bg-foreground/10 text-foreground")}
            >
              <Star size={14} className={cn(favorites.length > 0 && "fill-current text-amber-400")} />
              <span className="text-xs">{onFavorites ? "Dashboard" : "Favorit"}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleNav}
              aria-expanded={navVisible}
              aria-label={navVisible ? "Sembunyikan navigasi atas" : "Tampilkan navigasi atas"}
            >
              {navVisible ? <PanelTopClose size={14} /> : <PanelTopOpen size={14} />}
              <span className="text-xs">
                {navVisible ? "Sembunyikan Navigasi" : "Tampilkan Navigasi"}
              </span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Collapse/expand panel sisi"
            >
              {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
              <span className="text-xs">{collapsed ? "Tampilkan Panel" : "Sembunyikan Panel"}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleBrowserFullscreen}
              aria-label="Fullscreen tab browser"
            >
              <Expand size={14} />
            </Button>
          </div>
        </div>

        <div className={cn("flex flex-1 gap-6", collapsed && "gap-0")}>
          {!collapsed && sidePosition === "left" && sidePanel}
          {content}
          {!collapsed && sidePosition === "right" && sidePanel}
        </div>
      </div>
    </ToolsSearchContext.Provider>
  );
}

/**
 * Dashboard awal (`/admin/tools`, route index).
 * Mengurutkan tool: favorit dipin paling atas, lalu berdasarkan yang terakhir
 * dibuka, sisanya A-Z — dan menyaring sesuai kata kunci pencarian.
 */
export function ToolsOverview() {
  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: fetchPages });
  const { favorites, recent } = useToolsPrefs();
  const query = useToolsSearch();

  const tools = useMemo(
    () =>
      (pagesQuery.data ?? [])
        .filter((p) => p.scope === "admin")
        .sort((a, b) => a.title.localeCompare(b.title)),
    [pagesQuery.data],
  );

  const visible = useMemo(
    () => orderToolsForDashboard(filterTools(tools, query), favorites, recent),
    [tools, query, favorites, recent],
  );

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Dashboard Tools — favorit dipin di atas, lalu diurutkan berdasarkan yang terakhir dibuka.
      </p>
      <ToolsGrid
        tools={visible}
        emptyMessage={
          tools.length === 0
            ? "Belum ada tool. Tambah lewat Kelola Tools."
            : "Tidak ada tool yang cocok dengan pencarian."
        }
      />
    </div>
  );
}

/**
 * Halaman Favorit (`/admin/tools/favorites`).
 * Menampilkan HANYA tool favorit dengan tampilan & perilaku sama seperti
 * dashboard Overview; klik kartu membuka tool, bintang menghapus dari favorit.
 */
export function ToolsFavorites() {
  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: fetchPages });
  const { favorites, recent } = useToolsPrefs();
  const query = useToolsSearch();

  const favSet = useMemo(() => new Set(favorites), [favorites]);
  const tools = useMemo(
    () =>
      (pagesQuery.data ?? [])
        .filter((p) => p.scope === "admin" && favSet.has(p.slug))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [pagesQuery.data, favSet],
  );

  const visible = useMemo(
    () => orderToolsByRecent(filterTools(tools, query), recent),
    [tools, query, recent],
  );

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-kicker">Favorit</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">Tool Favorit</h2>
      </div>
      <ToolsGrid
        tools={visible}
        emptyMessage={
          tools.length === 0
            ? "Belum ada tool favorit. Klik ikon bintang di samping tool untuk menambahkannya."
            : "Tidak ada favorit yang cocok dengan pencarian."
        }
      />
    </div>
  );
}
