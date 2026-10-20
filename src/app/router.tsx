import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@/features/settings/components/ThemeProvider";
import { SubmarineCursor } from "@/components/effects/SubmarineCursor";
import { HomePage } from "./pages/HomePage";
import { DashboardPlaceholderPage } from "./pages/DashboardPlaceholderPage";
import { AdminShell } from "@/components/layout/AdminShell";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { AdminToolsPage } from "./pages/admin/AdminToolsPage";
import { ToolsHubPage, ToolsOverview, ToolsFavorites } from "./pages/admin/ToolsHubPage";
import { AdminToolViewPage } from "@/features/pages/components/AdminToolViewPage";
import { SuperAdminLoginPage } from "@/features/auth/pages/SuperAdminLoginPage";
import { RequireUser, RequireSuperAdmin } from "@/features/auth/components/RouteGuards";

// Kept out of every nav/link — only referenced here and on the page itself.
const SUPERADMIN_PATH = import.meta.env.VITE_SUPERADMIN_PATH || "portal-x7f2";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ThemeProvider />
      <SubmarineCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={`/${SUPERADMIN_PATH}`} element={<SuperAdminLoginPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireUser>
              <DashboardPlaceholderPage />
            </RequireUser>
          }
        />

        {/* Admin Shell. Setelah CMS dihapus dari frontend: hanya Dashboard,
            Tools Hub, Kelola Tools, dan Settings yang di-nav. */}
        <Route
          path="/admin"
          element={
            <RequireSuperAdmin>
              <AdminShell />
            </RequireSuperAdmin>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Tools Hub: layout (panel sisi) + overview; tool dirender oleh :slug.
              URL tool TETAP /admin/tools/<slug>. */}
          <Route path="tools" element={<ToolsHubPage />}>
            <Route index element={<ToolsOverview />} />
            {/* Halaman favorit (segmen statis, diprioritaskan di atas :slug). */}
            <Route path="favorites" element={<ToolsFavorites />} />
            <Route path=":slug" element={<AdminToolViewPage />} />
          </Route>
          {/* Kelola Tools / Custom Tools (editor) dipindah dari /admin/tools. */}
          <Route path="customtools" element={<AdminToolsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
