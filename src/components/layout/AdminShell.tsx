import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { AdminTopNav } from "./AdminTopNav";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_EVENT, getAdminNavVisible } from "@/lib/admin-nav-visibility";

export function AdminShell() {
  // Visibilitas nav atas — di-toggle dari Tools Hub via localStorage + event.
  const [navVisible, setNavVisible] = useState(getAdminNavVisible);

  useEffect(() => {
    function onNavChange(e: Event) {
      setNavVisible((e as CustomEvent<boolean>).detail);
    }
    window.addEventListener(ADMIN_NAV_EVENT, onNavChange);
    return () => window.removeEventListener(ADMIN_NAV_EVENT, onNavChange);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Bar navigasi atas (header + topnav). Collapse via max-height + opacity
          agar transisi halus (bukan display:none yang langsung "kedip"). */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          navVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <AdminHeader />
        <AdminTopNav />
      </div>
      <main className="flex flex-1 flex-col p-6">
        <Outlet />
      </main>
    </div>
  );
}
