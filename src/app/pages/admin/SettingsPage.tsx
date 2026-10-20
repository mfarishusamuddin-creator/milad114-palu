import { useState } from "react";

import { PanelLayout } from "@/components/layout/PanelLayout";
import { SwarmCursorSettingsForm } from "@/features/settings/components/SwarmCursorSettingsForm";
import { SiteLayoutSettingsForm } from "@/features/settings/components/SiteLayoutSettingsForm";
import { ThemeSettingsForm } from "@/features/settings/components/ThemeSettingsForm";
import { SubmarineSettingsForm } from "@/features/settings/components/SubmarineSettingsForm";
import { WebVitalsPanel } from "@/features/settings/components/WebVitalsPanel";
import { DbUsagePanel } from "@/features/settings/components/DbUsagePanel";
import { StorageUsagePanel } from "@/features/settings/components/StorageUsagePanel";
import { ProjectUsagePanel } from "@/features/settings/components/ProjectUsagePanel";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "theme", label: "Tema" },
  { id: "submarine", label: "Submarine & Light" },
  { id: "swarm", label: "Swarm Cursor" },
  { id: "site", label: "Site & Layout" },
  { id: "performance", label: "Performance" },
] as const;

export function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("theme");

  return (
    <PanelLayout
      kicker="Settings & Customization"
      title={TABS.find((t) => t.id === tab)!.label}
      left={{
        name: "Menu",
        content: (
          <nav className="flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  tab === t.id
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        ),
      }}
    >
      {tab === "theme" && <ThemeSettingsForm />}
      {tab === "submarine" && <SubmarineSettingsForm />}
      {tab === "swarm" && <SwarmCursorSettingsForm />}
      {tab === "site" && <SiteLayoutSettingsForm />}
      {tab === "performance" && <PerformanceSettings />}
    </PanelLayout>
  );
}

function PerformanceSettings() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <section className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-kicker">Web Vitals</p>
        <WebVitalsPanel />
      </section>
      <section className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-kicker">Ukuran Database</p>
        <DbUsagePanel />
      </section>
      <section className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-kicker">Penyimpanan (Storage)</p>
        <StorageUsagePanel />
      </section>
      <section className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-kicker">Penggunaan Project</p>
        <ProjectUsagePanel />
      </section>
    </div>
  );
}
