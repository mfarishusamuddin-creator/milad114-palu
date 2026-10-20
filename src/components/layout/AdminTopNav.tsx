import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useAdminNavItems } from "./useAdminNavItems";

export function AdminTopNav() {
  const { fixed, fixedTail } = useAdminNavItems();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card/40 px-4 py-2">
      <p className="mr-4 shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-kicker">
        Project Module
      </p>

      {fixed.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors",
              isActive
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )
          }
        >
          <Icon size={14} />
          {label}
        </NavLink>
      ))}

      {fixedTail.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors",
              isActive
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )
          }
        >
          <Icon size={14} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
